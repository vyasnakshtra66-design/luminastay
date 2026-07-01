import re
import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from services.db_service import find_many, update_one
from auth_jwt import get_current_user
from mock_data.bookings import get_mock_bookings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/bookings", tags=["bookings"])

MAX_SEARCH_LENGTH = 100


class CancelRequest(BaseModel):
    bookingId: str
    action: str


@router.get("")
async def get_bookings(
    status: str | None = Query(None),
    search: str = Query(""),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user_id: str = Depends(get_current_user),
):
    filter_dict: dict = {"userId": current_user_id}
    if status and status != "all":
        filter_dict["status"] = status
    if search:
        if len(search) > MAX_SEARCH_LENGTH:
            raise HTTPException(status_code=400, detail="Search too long")
        pattern = re.compile(re.escape(search[:MAX_SEARCH_LENGTH]), re.IGNORECASE)
        filter_dict["$or"] = [
            {"bookingId": {"$regex": pattern}},
            {"hotelName": {"$regex": pattern}},
        ]

    result = await find_many("bookings", filter_dict, {"_id": 0}, [("rating", -1)], page, limit)
    if result["data"] is not None:
        return {"bookings": result["data"], "pagination": result["pagination"], "source": "database"}

    items = get_mock_bookings(current_user_id)
    total = len(items)
    skip = (page - 1) * limit
    paged = items[skip : skip + limit]
    return {
        "bookings": paged,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit,
            "hasMore": skip + limit < total,
        },
        "source": "fallback",
    }


@router.put("")
async def update_booking(
    body: CancelRequest,
    current_user_id: str = Depends(get_current_user),
):
    if body.action != "cancel":
        raise HTTPException(status_code=400, detail="Invalid action")

    updated = await update_one(
        "bookings",
        {"bookingId": body.bookingId, "userId": current_user_id},
        {"$set": {"status": "cancelled", "paymentStatus": "refunded"}},
    )
    if updated:
        updated.pop("_id", None)
        return {"booking": updated, "source": "database"}

    return {"success": True, "action": body.action, "source": "fallback"}
