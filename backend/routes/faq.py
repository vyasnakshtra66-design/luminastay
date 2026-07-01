import re
import logging
from fastapi import APIRouter, Query
from services.db_service import find_many
from mock_data.faq import get_mock_faqs

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/faq", tags=["faq"])

MAX_SEARCH_LENGTH = 100


@router.get("")
async def get_faqs(
    category: str | None = Query(None),
    search: str = Query(""),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    filter_dict: dict = {"active": True}
    if category and category != "all":
        filter_dict["category"] = category
    if search:
        safe_search = search[:MAX_SEARCH_LENGTH]
        pattern = re.compile(re.escape(safe_search), re.IGNORECASE)
        filter_dict["$or"] = [
            {"question": {"$regex": pattern}},
            {"answer": {"$regex": pattern}},
        ]

    result = await find_many("faqs", filter_dict, {"_id": 0}, [("order", 1)], page, limit)
    if result["data"] is not None:
        return {"faqs": result["data"], "pagination": result["pagination"], "source": "database"}

    items = get_mock_faqs(category=category, search=search)
    total = len(items)
    skip = (page - 1) * limit
    paged = items[skip : skip + limit]
    return {
        "faqs": paged,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit,
            "hasMore": skip + limit < total,
        },
        "source": "fallback",
    }
