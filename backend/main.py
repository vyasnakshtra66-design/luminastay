import uuid
import re
import secrets
import uvicorn
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from config import settings

from database import connect_db, close_db
from routes.auth_routes import router as auth_router
from routes.bookings import router as bookings_router
from routes.offers import router as offers_router
from routes.destinations import router as destinations_router
from routes.hotels import router as hotels_router
from routes.profile import router as profile_router
from routes.wishlist import router as wishlist_router
from routes.notifications import router as notifications_router
from routes.contact import router as contact_router
from routes.faq import router as faq_router
from routes.about import router as about_router
from routes.terms import router as terms_router
from routes.privacy import router as privacy_router
from routes.loyalty import router as loyalty_router

class PasswordRedactFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        msg = record.getMessage()
        if "password" in msg.lower() or "passwd" in msg.lower() or "secret" in msg.lower():
            return False
        return True

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)
logger.addFilter(PasswordRedactFilter())

for name in ["uvicorn", "uvicorn.access", "slowapi"]:
    h = logging.getLogger(name)
    h.addFilter(PasswordRedactFilter())

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    connect_db()
    yield
    close_db()


app = FastAPI(
    title="LuminaStay Hotel API",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.exception_handler(HTTPException)
async def http_exception_handler(_request: Request, exc: HTTPException):
    detail = exc.detail
    if isinstance(detail, str):
        return JSONResponse(status_code=exc.status_code, content={"error": detail})
    return JSONResponse(status_code=exc.status_code, content=detail)

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    settings.frontend_url,
    "https://nextjs-app-one-kohl.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-CSRF-Token", "Accept", "Origin"],
)


MUTATING_METHODS = {"POST", "PUT", "DELETE", "PATCH"}
CSRF_COOKIE = "csrf_token"


@app.middleware("http")
async def csrf_middleware(request: Request, call_next):
    if request.method in MUTATING_METHODS:
        origin = request.headers.get("origin", "")
        referer = request.headers.get("referer", "")
        if origin and not any(origin.rstrip("/") == o for o in ALLOWED_ORIGINS):
            return JSONResponse(status_code=403, content={"error": "CSRF check failed: unknown origin"})
        if not origin and referer and not any(referer.startswith(o) for o in ALLOWED_ORIGINS):
            return JSONResponse(status_code=403, content={"error": "CSRF check failed: unknown referer"})
    response = await call_next(request)
    return response


audit_logger = logging.getLogger("audit")
audit_handler = logging.FileHandler("audit.log")
audit_handler.setFormatter(logging.Formatter("%(asctime)s %(message)s"))
audit_logger.addHandler(audit_handler)
audit_logger.setLevel(logging.INFO)
audit_logger.propagate = False


@app.middleware("http")
async def audit_middleware(request: Request, call_next):
    if request.method in MUTATING_METHODS and not request.url.path.startswith("/api/auth/csrf"):
        user_id = request.headers.get("authorization", "anonymous")[:20]
        audit_logger.info("[%s] %s %s", user_id, request.method, request.url.path)
    response = await call_next(request)
    return response


IS_PRODUCTION = settings.frontend_url.startswith("https://")


@app.get("/api/auth/csrf")
async def get_csrf_token(request: Request):
    existing = request.cookies.get(CSRF_COOKIE)
    token = existing or secrets.token_hex(32)
    resp = JSONResponse(content={"csrfToken": token})
    resp.set_cookie(key=CSRF_COOKIE, value=token, httponly=False, samesite="strict", secure=IS_PRODUCTION, path="/")
    return resp


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    if IS_PRODUCTION:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    csp = (
        "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https:"
    )
    response.headers["Content-Security-Policy"] = csp
    response.headers["Cache-Control"] = "no-store"
    return response


app.include_router(auth_router)
app.include_router(bookings_router)
app.include_router(offers_router)
app.include_router(destinations_router)
app.include_router(hotels_router)
app.include_router(profile_router)
app.include_router(wishlist_router)
app.include_router(notifications_router)
app.include_router(contact_router)
app.include_router(faq_router)
app.include_router(about_router)
app.include_router(terms_router)
app.include_router(privacy_router)
app.include_router(loyalty_router)


@app.get("/")
async def root():
    return {"app": "LuminaStay API", "version": "1.0.0"}


@app.get("/health")
async def health():
    from database import get_db
    db = get_db()
    status = "healthy"
    details = {"database": "connected" if db else "unavailable"}
    if not db:
        status = "degraded"
    return {"status": status, "details": details}


if __name__ == "__main__":
    import os
    ssl_cert = os.getenv("SSL_CERT_FILE")
    ssl_key = os.getenv("SSL_KEY_FILE")
    ssl_kwargs = {"ssl_certfile": ssl_cert, "ssl_keyfile": ssl_key} if ssl_cert and ssl_key else {}
    uvicorn.run("main:app", host=settings.host, port=settings.port, **ssl_kwargs)
