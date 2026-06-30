import logging
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from services.db_service import find_many, update_one, delete_many, delete_one
from auth_jwt import get_current_user
from mock_data.notifications import get_mock_notifications

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("")
async def get_notifications(
    category: str | None = Query(None),
    unreadOnly: bool = Query(False),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user_id: str = Depends(get_current_user),
):
    filter_dict: dict = {"userId": current_user_id}
    if category and category != "all":
        filter_dict["category"] = category
    if unreadOnly:
        filter_dict["read"] = False

    result = await find_many("notifications", filter_dict, {"_id": 0}, [("createdAt", -1)], page, limit)
    if result["data"] is not None:
        return {"notifications": result["data"], "pagination": result["pagination"], "source": "mongodb"}

    items = get_mock_notifications(current_user_id)
    if category and category != "all":
        items = [n for n in items if n["category"] == category]
    if unreadOnly:
        items = [n for n in items if not n["read"]]
    total = len(items)
    skip = (page - 1) * limit
    paged = items[skip : skip + limit]
    return {
        "notifications": paged,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit,
            "hasMore": skip + limit < total,
        },
        "source": "mock",
    }


class NotificationAction(BaseModel):
    notificationId: str | None = None
    action: str


@router.patch("")
async def update_notification(
    body: NotificationAction,
    current_user_id: str = Depends(get_current_user),
):
    if body.action == "markRead" and body.notificationId:
        updated = await update_one(
            "notifications",
            {"userId": current_user_id, "_id": body.notificationId},
            {"$set": {"read": True}},
        )
        if updated:
            return {"success": True, "source": "mongodb"}
    elif body.action == "markAllRead":
        from services.db_service import update_many
        await update_many("notifications", {"userId": current_user_id}, {"$set": {"read": True}})
        return {"success": True, "source": "mongodb"}

    return {"success": True, "source": "mock"}


class NotificationDelete(BaseModel):
    notificationId: str | None = None


@router.delete("")
async def delete_notification(
    body: NotificationDelete,
    current_user_id: str = Depends(get_current_user),
):
    if body.notificationId == "all":
        await delete_many("notifications", {"userId": current_user_id})
    elif body.notificationId:
        await delete_one("notifications", {"userId": current_user_id, "_id": body.notificationId})
    return {"success": True, "source": "mongodb" if body.notificationId else "mock"}
