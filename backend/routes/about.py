import logging
from fastapi import APIRouter
from services.db_service import find_one
from mock_data.about import MOCK_COMPANY, MOCK_TEAM, MOCK_TESTIMONIALS, MOCK_STATS

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/about", tags=["about"])


@router.get("")
async def get_about():
    about = await find_one("about", {}, {"_id": 0}, [("createdAt", -1)])
    if about:
        return {
            "company": about.get("company", MOCK_COMPANY),
            "team": about.get("team", MOCK_TEAM),
            "testimonials": about.get("testimonials", MOCK_TESTIMONIALS),
            "stats": about.get("stats", MOCK_STATS),
            "source": "database",
        }
    return {
        "company": MOCK_COMPANY,
        "team": MOCK_TEAM,
        "testimonials": MOCK_TESTIMONIALS,
        "stats": MOCK_STATS,
        "source": "fallback",
    }
