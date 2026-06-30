import logging
from fastapi import APIRouter, Depends
from services.db_service import find_one
from auth_jwt import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/loyalty", tags=["loyalty"])

MOCK_LOYALTY = {
    "points": 8200,
    "tier": "Gold",
    "nextTier": "Platinum",
    "pointsToNext": 6800,
    "totalNights": 24,
    "pointsThisYear": 4200,
    "perks": ["Late checkout (2 PM)", "Room upgrades", "Welcome amenity"],
}


@router.get("")
async def get_loyalty(current_user_id: str = Depends(get_current_user)):
    loyalty = await find_one("loyalty", {"userId": current_user_id}, {"_id": 0})
    if loyalty:
        return {"loyalty": loyalty, "source": "mongodb"}
    return {"loyalty": MOCK_LOYALTY, "source": "mock"}
