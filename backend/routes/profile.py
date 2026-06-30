import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.db_service import find_one, update_one
from auth_jwt import get_current_user, pwd_context, verify_password

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/profile", tags=["profile"])


class PasswordChange(BaseModel):
    currentPassword: str
    newPassword: str


class ProfileUpdate(BaseModel):
    firstName: str | None = None
    lastName: str | None = None
    email: str | None = None
    mobile: str | None = None
    dateOfBirth: str | None = None
    gender: str | None = None
    country: str | None = None
    state: str | None = None
    city: str | None = None
    address: str | None = None
    avatar: str | None = None
    language: str | None = None
    currency: str | None = None
    darkMode: bool | None = None
    notificationPreferences: dict | None = None


ALLOWED_UPDATE_FIELDS = {
    "firstName", "lastName", "email", "mobile",
    "dateOfBirth", "gender", "country", "state", "city",
    "address", "avatar", "language", "currency",
    "darkMode", "notificationPreferences",
}


@router.get("")
async def get_profile(current_user_id: str = Depends(get_current_user)):
    user = await find_one("users", {"userId": current_user_id}, {"_id": 0, "password": 0})
    if not user:
        from database import get_db
        if get_db() is None:
            raise HTTPException(status_code=404, detail="User not found")
    return {"profile": user, "source": "mongodb"}


@router.put("/password")
async def change_password(
    body: PasswordChange,
    current_user_id: str = Depends(get_current_user),
):
    user = await find_one("users", {"userId": current_user_id})
    if not user:
        from database import get_db
        if get_db() is None:
            raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(body.currentPassword, user.get("password", "")):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    hashed = pwd_context.hash(body.newPassword)
    await update_one("users", {"userId": current_user_id}, {"$set": {"password": hashed}})
    return {"success": True, "source": "mongodb"}


@router.put("")
async def update_profile(
    updates: ProfileUpdate,
    current_user_id: str = Depends(get_current_user),
):
    raw = updates.model_dump(exclude_none=True)
    data = {k: v for k, v in raw.items() if k in ALLOWED_UPDATE_FIELDS}
    if not data:
        return JSONResponse(status_code=400, content={"error": "No valid fields to update"})

    existing = await find_one("users", {"userId": current_user_id})
    if not existing:
        from database import get_db
        if get_db() is None:
            return JSONResponse(status_code=404, content={"error": "Profile not found"})

    updated = await update_one("users", {"userId": current_user_id}, {"$set": data})
    if updated:
        updated.pop("password", None)
        updated.pop("_id", None)
        return {"profile": updated, "source": "mongodb"}

    return {"success": True, "source": "mock"}
