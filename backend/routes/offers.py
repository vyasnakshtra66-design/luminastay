import logging
from fastapi import APIRouter, Query
from services.db_service import find_many
from mock_data.offers import get_mock_offers

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/offers", tags=["offers"])


@router.get("")
async def get_offers(
    category: str | None = Query(None),
    active: str | None = Query(None),
    featured: str | None = Query(None),
    flashSale: str | None = Query(None),
    seasonal: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    filter_dict: dict = {}
    if category and category != "all":
        filter_dict["category"] = category
    if active == "true":
        filter_dict["active"] = True
    elif active == "false":
        filter_dict["active"] = False
    if featured == "true":
        filter_dict["featured"] = True
    if flashSale == "true":
        filter_dict["flashSale"] = True
    if seasonal == "true":
        filter_dict["seasonal"] = True

    result = await find_many("offers", filter_dict, {"_id": 0}, [("createdAt", -1)], page, limit)
    if result["data"] is not None:
        return {"offers": result["data"], "pagination": result["pagination"], "source": "database"}

    active_bool = None
    if active == "true":
        active_bool = True
    elif active == "false":
        active_bool = False
    items = get_mock_offers(category=category, active=active_bool)
    total = len(items)
    skip = (page - 1) * limit
    paged = items[skip : skip + limit]
    return {
        "offers": paged,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit,
            "hasMore": skip + limit < total,
        },
        "source": "fallback",
    }
