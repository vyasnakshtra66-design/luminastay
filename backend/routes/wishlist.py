import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.db_service import find_one, update_one
from auth_jwt import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])


class WishlistAdd(BaseModel):
    hotelId: int


def _get_mock_wishlist() -> list[int]:
    return [1, 3, 5, 8, 12, 19, 24, 35, 42, 57]


@router.get("")
async def get_wishlist(current_user_id: str = Depends(get_current_user)):
    wishlist = await find_one("wishlists", {"userId": current_user_id}, {"_id": 0})
    if wishlist is not None:
        return {"hotelIds": wishlist.get("hotelIds", []), "source": "database"}
    return {"hotelIds": _get_mock_wishlist(), "source": "fallback"}


@router.post("")
async def add_to_wishlist(
    body: WishlistAdd,
    current_user_id: str = Depends(get_current_user),
):
    if not body.hotelId:
        return JSONResponse(status_code=400, content={"error": "Valid hotelId required"})

    result = await update_one(
        "wishlists",
        {"userId": current_user_id},
        {"$addToSet": {"hotelIds": body.hotelId}},
        upsert=True,
    )
    if result:
        return {"hotelIds": result.get("hotelIds", []), "source": "database"}
    return {"success": True, "source": "fallback"}


@router.delete("")
async def remove_from_wishlist(
    hotelId: int,
    current_user_id: str = Depends(get_current_user),
):
    if not hotelId:
        return JSONResponse(status_code=400, content={"error": "Valid hotelId required"})

    result = await update_one(
        "wishlists",
        {"userId": current_user_id},
        {"$pull": {"hotelIds": hotelId}},
    )
    if result:
        return {"hotelIds": result.get("hotelIds", []), "source": "database"}
    return {"success": True, "source": "fallback"}
