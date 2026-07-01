import logging
from fastapi import APIRouter
from services.db_service import find_one
from mock_data.terms import MOCK_TERMS

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/terms", tags=["terms"])


@router.get("")
async def get_terms():
    terms = await find_one("terms", {}, {"_id": 0}, [("createdAt", -1)])
    if terms:
        return {"terms": terms, "source": "database"}
    return {"terms": MOCK_TERMS, "source": "fallback"}
