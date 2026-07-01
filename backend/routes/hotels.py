import logging
from fastapi import APIRouter, HTTPException
from services.db_service import find_one
from mock_data.room_details import get_mock_room_details, VALID_ROOM_IDS

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/hotels", tags=["hotels"])


@router.get("/{hotel_id}/rooms/{room_id}")
async def get_room_details(hotel_id: str, room_id: str):
    room = await find_one("rooms", {"hotelId": hotel_id, "roomId": room_id}, {"_id": 0})
    if room:
        return {"room": room, "source": "database"}
    if room_id not in VALID_ROOM_IDS:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"room": get_mock_room_details(hotel_id, room_id), "source": "fallback"}
