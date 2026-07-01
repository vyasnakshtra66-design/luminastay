import html
import os
import re
import logging
from httpx import AsyncClient
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.db_service import insert_one
from mock_data.contact import MOCK_CONTACT
from limiter import limiter

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/contact", tags=["contact"])

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

RECAPTCHA_SECRET = os.getenv("RECAPTCHA_SECRET_KEY", "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe")


class ContactForm(BaseModel):
    name: str
    email: str
    phone: str = ""
    subject: str
    message: str
    recaptchaToken: str = ""


@router.get("")
async def get_contact():
    return {"contact": MOCK_CONTACT, "source": "fallback"}


@router.post("")
@limiter.limit("5/minute")
async def submit_contact(request: Request, body: ContactForm):
    errors = {}
    if not body.name.strip():
        errors["name"] = "Name is required"
    if not body.email.strip():
        errors["email"] = "Email is required"
    elif not EMAIL_REGEX.match(body.email):
        errors["email"] = "Invalid email format"
    if not body.subject.strip():
        errors["subject"] = "Subject is required"
    if not body.message.strip():
        errors["message"] = "Message is required"
    elif len(body.message.strip()) < 10:
        errors["message"] = "Message must be at least 10 characters"
    if errors:
        return JSONResponse(status_code=400, content={"errors": errors, "success": False})

    if body.recaptchaToken:
        async with AsyncClient() as client:
            verify = await client.post(
                "https://www.google.com/recaptcha/api/siteverify",
                data={"secret": RECAPTCHA_SECRET, "response": body.recaptchaToken},
            )
            result = verify.json()
            if not result.get("success"):
                return JSONResponse(status_code=400, content={"error": "reCAPTCHA verification failed", "success": False})

    sanitized = {
        "name": html.escape(body.name.strip())[:100],
        "email": body.email.lower().strip()[:100],
        "phone": body.phone.strip()[:20],
        "subject": html.escape(body.subject.strip())[:200],
        "message": html.escape(body.message.strip())[:2000],
    }
    success = await insert_one("contact_submissions", sanitized)
    return {"success": True, "source": "database" if success else "fallback"}
