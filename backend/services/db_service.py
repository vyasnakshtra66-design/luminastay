import asyncio
import logging
from functools import partial
from typing import Any
from database import get_db

logger = logging.getLogger(__name__)


async def run_db(func, *args, **kwargs):
    """Run a synchronous DB operation in a thread pool to avoid blocking the event loop."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(func, *args, **kwargs))


def paginate(page: int = 1, limit: int = 20) -> tuple[int, int]:
    """Returns (skip, limit) with bounds checking."""
    if page < 1:
        page = 1
    if limit < 1:
        limit = 20
    if limit > 100:
        limit = 100
    return (page - 1) * limit, limit


def paginated_response(items: list, total: int, page: int, limit: int) -> dict:
    return {
        "data": items,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit,
            "hasMore": page * limit < total,
        },
    }


async def find_many(
    collection: str,
    filter_dict: dict,
    projection: dict | None = None,
    sort: list | None = None,
    page: int = 1,
    limit: int = 20,
) -> dict:
    db = get_db()
    if not db:
        return {"data": None, "source": "mock"}

    skip, lim = paginate(page, limit)
    col = db[collection]

    try:
        total = await run_db(col.count_documents, filter_dict)
        cursor = col.find(filter_dict, projection or {}).sort(sort or [("_id", -1)]).skip(skip).limit(lim)
        items = await run_db(list, cursor)
        return {
            "data": items,
            "total": total,
            "source": "mongodb",
            "pagination": {
                "page": page,
                "limit": lim,
                "total": total,
                "totalPages": (total + lim - 1) // lim,
                "hasMore": page * lim < total,
            },
        }
    except Exception as e:
        logger.error("DB find_many error [%s]: %s", collection, e)
        return {"data": None, "source": "error", "error": str(e)}


async def find_one(
    collection: str,
    filter_dict: dict,
    projection: dict | None = None,
    sort: list | None = None,
) -> dict | None:
    db = get_db()
    if not db:
        return None

    try:
        return await run_db(
            db[collection].find_one, filter_dict, projection or {}, sort=sort or []
        )
    except Exception as e:
        logger.error("DB find_one error [%s]: %s", collection, e)
        return None


async def insert_one(collection: str, document: dict) -> bool:
    db = get_db()
    if not db:
        return False

    try:
        await run_db(db[collection].insert_one, document)
        return True
    except Exception as e:
        logger.error("DB insert_one error [%s]: %s", collection, e)
        return False


async def update_one(
    collection: str,
    filter_dict: dict,
    update: dict,
    upsert: bool = False,
) -> dict | None:
    db = get_db()
    if not db:
        return None

    try:
        from pymongo import ReturnDocument

        result = await run_db(
            db[collection].find_one_and_update,
            filter_dict,
            update,
            upsert=upsert,
            return_document=ReturnDocument.AFTER,
        )
        return result
    except Exception as e:
        logger.error("DB update_one error [%s]: %s", collection, e)
        return None


async def update_many(
    collection: str,
    filter_dict: dict,
    update: dict,
) -> int | None:
    db = get_db()
    if not db:
        return None
    try:
        result = await run_db(db[collection].update_many, filter_dict, update)
        return result.modified_count if result else None
    except Exception as e:
        logger.error("DB update_many error [%s]: %s", collection, e)
        return None


async def delete_many(collection: str, filter_dict: dict) -> bool:
    db = get_db()
    if not db:
        return False

    try:
        await run_db(db[collection].delete_many, filter_dict)
        return True
    except Exception as e:
        logger.error("DB delete_many error [%s]: %s", collection, e)
        return False


async def delete_one(collection: str, filter_dict: dict) -> bool:
    db = get_db()
    if not db:
        return False

    try:
        await run_db(db[collection].delete_one, filter_dict)
        return True
    except Exception as e:
        logger.error("DB delete_one error [%s]: %s", collection, e)
        return False
