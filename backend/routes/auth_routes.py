import re
import logging
from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from services.db_service import find_one, insert_one, update_one
from auth_jwt import hash_password, verify_password, create_token, set_token_cookie, validate_password_strength

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    mobile: str
    country: str = ""
    preferredCurrency: str = "USD"
    travelPreferences: list[str] = []


@router.post("/login")
async def login(body: LoginRequest, response: Response):
    if not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Email and password required")

    user = await find_one("users", {"email": body.email.lower()}, {"password": 1, "userId": 1, "email": 1, "name": 1})
    if user:
        if not verify_password(body.password, user.get("password", "")):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        token = create_token(user["userId"])
        set_token_cookie(response, token)
        return {
            "user": {"userId": user["userId"], "email": user["email"], "name": user["name"], "token": token},
            "source": "mongodb",
        }

    raise HTTPException(status_code=401, detail="Invalid email or password")


@router.post("/register", status_code=201)
async def register(body: RegisterRequest):
    if not body.name.strip():
        raise HTTPException(status_code=400, detail="Name is required")
    if not body.email.strip() or not EMAIL_REGEX.match(body.email):
        raise HTTPException(status_code=400, detail="Please provide a valid email address")
    if not body.mobile.strip():
        raise HTTPException(status_code=400, detail="Mobile number is required")

    pw_error = validate_password_strength(body.password)
    if pw_error:
        raise HTTPException(status_code=400, detail=pw_error)

    existing = await find_one("users", {"email": body.email.lower()})
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    import uuid
    user_id = str(uuid.uuid4())

    success = await insert_one("users", {
        "userId": user_id,
        "name": body.name.strip(),
        "email": body.email.lower().strip(),
        "password": hash_password(body.password),
        "mobile": body.mobile.strip(),
        "country": body.country or "",
        "preferredCurrency": body.preferredCurrency or "USD",
        "travelPreferences": body.travelPreferences or [],
    })

    if not success:
        logger.info("User registered (mock): %s (%s)", user_id, body.email)
        return {"message": "Account created successfully! You can now sign in.", "source": "mock"}

    logger.info("User registered: %s (%s)", user_id, body.email)
    return {"message": "Account created successfully! You can now sign in.", "source": "mongodb"}


class ForgotPasswordRequest(BaseModel):
    email: str


RESET_TOKENS: dict[str, str] = {}


# ── OTP Login ──────────────────────────────────────────────────────────────


class SendOTPRequest(BaseModel):
    email: str | None = None
    phone: str | None = None


class VerifyOTPRequest(BaseModel):
    email: str | None = None
    phone: str | None = None
    otp: str


OTP_STORE: dict[str, dict] = {}


@router.post("/send-otp")
async def send_otp(body: SendOTPRequest):
    import random, time, os
    identifier = body.email or body.phone
    if not identifier:
        raise HTTPException(status_code=400, detail="Email or phone is required")

    otp = str(random.randint(100000, 999999))
    OTP_STORE[identifier] = {"otp": otp, "expires": time.time() + 300}

    if body.email:
        from services.email_service import send_otp_email
        send_otp_email(body.email, otp)

    logger.info("OTP for %s: %s (expires in 5 min)", identifier, otp)

    return_otp = otp if os.getenv("NODE_ENV") == "development" or os.getenv("ENABLE_DEMO_LOGIN") == "true" else None
    return {"message": "OTP sent successfully.", "otp": return_otp, "source": "dev"}


@router.post("/verify-otp")
async def verify_otp(body: VerifyOTPRequest, response: Response):
    identifier = body.email or body.phone
    if not identifier:
        raise HTTPException(status_code=400, detail="Email or phone is required")

    import time
    stored = OTP_STORE.get(identifier)
    if not stored or stored["otp"] != body.otp or stored["expires"] < time.time():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    del OTP_STORE[identifier]

    user = None
    if body.email:
        user = await find_one("users", {"email": body.email.lower()})
    elif body.phone:
        user = await find_one("users", {"mobile": body.phone})

    if not user:
        logger.info("OTP login (mock): new session for %s", identifier)
        return {"user": {"userId": "otp-" + identifier, "email": body.email or "", "name": "Guest"}, "source": "mock"}

    token = create_token(user["userId"])
    set_token_cookie(response, token)
    return {
        "user": {"userId": user["userId"], "email": user["email"], "name": user["name"], "token": token},
        "source": "mongodb",
    }


@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest):
    if not body.email.strip() or not EMAIL_REGEX.match(body.email):
        raise HTTPException(status_code=400, detail="Please provide a valid email address")

    import uuid, time
    token = str(uuid.uuid4())

    user = await find_one("users", {"email": body.email.lower()})
    if user:
        uid = user.get("userId") or str(user.get("_id", ""))
        await update_one("users", {"email": body.email.lower()}, {"$set": {"resetToken": token, "resetTokenExpires": time.time() + 3600}})
        logger.info("Password reset token created for %s", body.email)
    else:
        uid = ""

    RESET_TOKENS[token] = {"userId": uid, "email": body.email.lower(), "expires": time.time() + 3600}

    from services.email_service import send_password_reset
    send_password_reset(body.email.lower(), token)

    return {"message": "If that email is registered, a reset link has been sent."}


class ResetPasswordRequest(BaseModel):
    token: str
    password: str


@router.post("/reset-password")
async def reset_password(body: ResetPasswordRequest):
    if not body.token.strip():
        raise HTTPException(status_code=400, detail="Reset token is required")

    pw_error = validate_password_strength(body.password)
    if pw_error:
        raise HTTPException(status_code=400, detail=pw_error)

    import time
    token_data = RESET_TOKENS.get(body.token)
    if token_data and token_data["expires"] > time.time():
        user = await update_one("users", {"email": token_data["email"]}, {"$set": {"password": hash_password(body.password)}, "$unset": {"resetToken": "", "resetTokenExpires": ""}})
        del RESET_TOKENS[body.token]
        if user:
            return {"message": "Password has been reset successfully.", "source": "mongodb"}
        logger.info("Password reset (mock) for %s", token_data["email"])
        return {"message": "Password has been reset successfully.", "source": "mock"}

    user = await find_one("users", {"resetToken": body.token, "resetTokenExpires": {"$gt": time.time()}})
    if user:
        await update_one("users", {"_id": user["_id"]}, {"$set": {"password": hash_password(body.password)}, "$unset": {"resetToken": "", "resetTokenExpires": ""}})
        return {"message": "Password has been reset successfully.", "source": "mongodb"}

    raise HTTPException(status_code=400, detail="Invalid or expired reset token")
