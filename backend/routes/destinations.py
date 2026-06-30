import logging
from fastapi import APIRouter, Query
from services.db_service import find_many
from mock_data.destinations import get_mock_destinations, MOCK_FEATURED_HOTELS, MOCK_TRAVEL_GUIDES

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/destinations", tags=["destinations"])


@router.get("")
async def get_destinations(
    category: str | None = Query(None),
    popular: bool = Query(False),
    type: str = Query("destinations"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    if type == "featured-hotels":
        return {"hotels": MOCK_FEATURED_HOTELS, "source": "mock"}
    if type == "guides":
        return {"guides": MOCK_TRAVEL_GUIDES, "source": "mock"}

    filter_dict: dict = {"active": True}
    if category and category != "all":
        filter_dict["category"] = category
    if popular:
        filter_dict["popular"] = True

    result = await find_many("destinations", filter_dict, {"_id": 0}, [("rating", -1)], page, limit)
    if result["data"] is not None:
        return {"destinations": result["data"], "pagination": result["pagination"], "source": "mongodb"}

    items = get_mock_destinations(category=category, popular=popular)
    total = len(items)
    skip = (page - 1) * limit
    paged = items[skip : skip + limit]
    return {
        "destinations": paged,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit,
            "hasMore": skip + limit < total,
        },
        "source": "mock",
    }
