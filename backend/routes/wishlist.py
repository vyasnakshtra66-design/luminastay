import logging
from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.db_service import find_one, update_one
from auth_jwt import get_optional_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])


class WishlistAdd(BaseModel):
    hotelId: int


def _get_mock_wishlist() -> list[int]:
    return [1, 3, 5, 8, 12, 19, 24, 35, 42, 57]


@router.get("")
async def get_wishlist(
    user_id: str | None = Depends(get_optional_user),
    userId: str | None = Query(None),
):
    uid = user_id or userId or "user_1"
    wishlist = await find_one("wishlists", {"userId": uid}, {"_id": 0})
    if wishlist is not None:
        return {"hotelIds": wishlist.get("hotelIds", []), "source": "mongodb"}
    return {"hotelIds": _get_mock_wishlist(), "source": "mock"}


@router.post("")
async def add_to_wishlist(
    body: WishlistAdd,
    user_id: str | None = Depends(get_optional_user),
    userId: str | None = Query(None),
):
    if not body.hotelId:
        return JSONResponse(status_code=400, content={"error": "Valid hotelId required"})
    uid = user_id or userId or "user_1"

    result = await update_one(
        "wishlists",
        {"userId": uid},
        {"$addToSet": {"hotelIds": body.hotelId}},
        upsert=True,
    )
    if result:
        return {"hotelIds": result.get("hotelIds", []), "source": "mongodb"}
    return {"success": True, "source": "mock"}


@router.delete("")
async def remove_from_wishlist(
    hotelId: int,
    user_id: str | None = Depends(get_optional_user),
    userId: str | None = Query(None),
):
    if not hotelId:
        return JSONResponse(status_code=400, content={"error": "Valid hotelId required"})
    uid = user_id or userId or "user_1"

    result = await update_one(
        "wishlists",
        {"userId": uid},
        {"$pull": {"hotelIds": hotelId}},
    )
    if result:
        return {"hotelIds": result.get("hotelIds", []), "source": "mongodb"}
    return {"success": True, "source": "mock"}
