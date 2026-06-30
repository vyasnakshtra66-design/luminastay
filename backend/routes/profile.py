import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.db_service import find_one, update_one
from auth_jwt import get_optional_user
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
    twoFactorEnabled: bool | None = None
    darkMode: bool | None = None
    notificationPreferences: dict | None = None
    addresses: list | None = None
    paymentMethods: list | None = None
    guestPreferences: dict | None = None
    savedHotels: list | None = None
    reviews: list | None = None
    bookings: list | None = None
    upcomingTrips: list | None = None
    activeDevices: list | None = None


@router.get("")
async def get_profile(
    user_id: str | None = Depends(get_optional_user),
    userId: str | None = Query(None),
):
    uid = user_id or userId or "user_1"
    user = await find_one("users", {"userId": uid}, {"_id": 0, "password": 0})
    if user:
        return {"profile": user, "source": "mongodb"}
    return {
        "profile": {
            "userId": uid,
            "firstName": "John", "lastName": "Doe",
            "name": "John Doe",
            "email": "john@example.com",
            "mobile": "+1 555 123 4567",
            "dateOfBirth": "1992-05-15", "gender": "male",
            "country": "United States", "state": "California", "city": "San Francisco",
            "address": "123 Market Street, Suite 400",
            "avatar": "https://i.pravatar.cc/150?img=68",
            "language": "English", "currency": "USD",
            "twoFactorEnabled": False, "darkMode": False,
            "notificationPreferences": {"email": True, "sms": True, "push": True, "marketing": False},
            "paymentMethods": [
                {"type": "card", "label": "Visa ending in 4242", "value": "4242", "isDefault": True},
                {"type": "upi", "label": "Google Pay", "value": "john@paytm", "isDefault": False},
            ],
            "addresses": [
                {"id": "addr_1", "label": "Home", "fullName": "John Doe", "line1": "123 Market Street, Suite 400", "line2": "", "city": "San Francisco", "state": "California", "zip": "94105", "country": "United States", "phone": "+1 555 123 4567", "isDefault": True},
                {"id": "addr_2", "label": "Office", "fullName": "John Doe", "line1": "456 Pine Street", "line2": "Floor 12", "city": "San Francisco", "state": "California", "zip": "94108", "country": "United States", "phone": "+1 555 987 6543", "isDefault": False},
            ],
            "upcomingTrips": [
                {"id": "trip_1", "hotelName": "The Ritz-Carlton", "hotelImage": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80", "location": "Maldives", "checkIn": "2026-08-15", "checkOut": "2026-08-20", "status": "upcoming"},
                {"id": "trip_2", "hotelName": "Marriott Marquis", "hotelImage": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80", "location": "Dubai, UAE", "checkIn": "2026-09-10", "checkOut": "2026-09-14", "status": "upcoming"},
                {"id": "trip_3", "hotelName": "Four Seasons", "hotelImage": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80", "location": "Paris, France", "checkIn": "2026-10-05", "checkOut": "2026-10-12", "status": "upcoming"},
            ],
            "bookings": [
                {"id": "bkg_1", "hotelName": "The Ritz-Carlton", "hotelImage": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80", "location": "Maldives", "checkIn": "2026-08-15", "checkOut": "2026-08-20", "guests": 2, "roomType": "Ocean Suite", "status": "confirmed", "total": 4250, "currency": "USD"},
                {"id": "bkg_2", "hotelName": "Marriott Marquis", "hotelImage": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80", "location": "Dubai, UAE", "checkIn": "2026-09-10", "checkOut": "2026-09-14", "guests": 2, "roomType": "Executive Room", "status": "confirmed", "total": 2100, "currency": "USD"},
                {"id": "bkg_3", "hotelName": "Hilton Garden Inn", "hotelImage": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80", "location": "New York, US", "checkIn": "2026-04-20", "checkOut": "2026-04-23", "guests": 1, "roomType": "Standard Room", "status": "completed", "total": 720, "currency": "USD"},
                {"id": "bkg_4", "hotelName": "Grand Hyatt", "hotelImage": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80", "location": "Tokyo, Japan", "checkIn": "2026-03-01", "checkOut": "2026-03-05", "guests": 2, "roomType": "Deluxe Twin", "status": "completed", "total": 1850, "currency": "USD"},
                {"id": "bkg_5", "hotelName": "The Plaza", "hotelImage": "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=400&q=80", "location": "London, UK", "checkIn": "2026-07-01", "checkOut": "2026-07-04", "guests": 3, "roomType": "Family Suite", "status": "cancelled", "total": 1200, "currency": "USD"},
            ],
            "savedHotels": [
                {"id": "fav_1", "name": "Taj Lake Palace", "image": "https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=400&q=80", "location": "Udaipur, India", "rating": 4.8, "price": 350, "currency": "USD"},
                {"id": "fav_2", "name": "Burj Al Arab", "image": "https://images.unsplash.com/photo-1578894386345-11ce98d7404b?w=400&q=80", "location": "Dubai, UAE", "rating": 4.9, "price": 1200, "currency": "USD"},
                {"id": "fav_3", "name": "Aman Tokyo", "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f9f9?w=400&q=80", "location": "Tokyo, Japan", "rating": 4.7, "price": 850, "currency": "USD"},
                {"id": "fav_4", "name": "Hotel de Paris", "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80", "location": "Monte Carlo, Monaco", "rating": 4.6, "price": 680, "currency": "USD"},
            ],
            "reviews": [
                {"id": "rev_1", "hotelName": "Hilton Garden Inn", "hotelImage": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80", "location": "New York, US", "rating": 4, "title": "Great location and staff", "comment": "Hotel was clean and staff were helpful.", "date": "2026-04-24"},
                {"id": "rev_2", "hotelName": "Grand Hyatt", "hotelImage": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80", "location": "Tokyo, Japan", "rating": 5, "title": "Exceptional experience", "comment": "World-class service with breathtaking views.", "date": "2026-03-06"},
                {"id": "rev_3", "hotelName": "Marriott Downtown", "hotelImage": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80", "location": "Chicago, US", "rating": 3, "title": "Decent but overpriced", "comment": "Good hotel but amenities were limited.", "date": "2025-12-15"},
            ],
            "guestPreferences": {
                "roomType": "Double", "bedType": "King", "smoking": False,
                "earlyCheckIn": True, "lateCheckOut": False, "floorPreference": "High",
                "specialRequests": "Extra pillows please",
            },
            "lastLogin": "2026-06-28T14:30:00Z",
            "activeDevices": [{"name": "Chrome on Windows", "lastActive": "2 min ago", "location": "San Francisco, US"}],
            "createdAt": "2025-01-10T10:00:00Z",
        },
        "source": "mock",
    }


@router.put("/password")
async def change_password(
    body: PasswordChange,
    user_id: str | None = Depends(get_optional_user),
    userId: str | None = Query(None),
):
    uid = user_id or userId or "user_1"
    user = await find_one("users", {"userId": uid})
    if not user:
        from database import get_db
        if get_db() is None:
            return {"success": True, "source": "mock"}
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(body.currentPassword, user.get("password", "")):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    hashed = pwd_context.hash(body.newPassword)
    await update_one("users", {"userId": uid}, {"$set": {"password": hashed}})
    return {"success": True, "source": "mongodb"}


@router.put("")
async def update_profile(
    updates: ProfileUpdate,
    user_id: str | None = Depends(get_optional_user),
    userId: str | None = Query(None),
):
    data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not data:
        return JSONResponse(status_code=400, content={"error": "No fields to update"})
    uid = user_id or userId or "user_1"

    existing = await find_one("users", {"userId": uid})
    if not existing:
        from database import get_db
        if get_db() is None:
            return {"success": True, "source": "mock"}
        return JSONResponse(status_code=404, content={"error": "Profile not found"})

    updated = await update_one("users", {"userId": uid}, {"$set": data})
    if not updated:
        return {"success": True, "source": "mock"}

    updated.pop("password", None)
    updated.pop("_id", None)
    return {"profile": updated, "source": "mongodb"}
