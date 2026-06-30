import logging
from fastapi import APIRouter
from services.db_service import find_one
from mock_data.privacy import MOCK_PRIVACY

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/privacy", tags=["privacy"])


@router.get("")
async def get_privacy():
    policy = await find_one("privacy", {}, {"_id": 0}, [("createdAt", -1)])
    if policy:
        return {"policy": policy, "source": "mongodb"}
    return {"policy": MOCK_PRIVACY, "source": "mock"}
