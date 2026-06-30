import re
import logging
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.db_service import insert_one
from mock_data.contact import MOCK_CONTACT

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/contact", tags=["contact"])

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class ContactForm(BaseModel):
    name: str
    email: str
    phone: str = ""
    subject: str
    message: str
    recaptchaToken: str = ""


@router.get("")
async def get_contact():
    return {"contact": MOCK_CONTACT, "source": "mock"}


@router.post("")
async def submit_contact(body: ContactForm):
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

    success = await insert_one("contact_submissions", body.model_dump())
    return {"success": True, "source": "mongodb" if success else "mock"}
