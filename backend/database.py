import logging
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure
from config import settings

logger = logging.getLogger(__name__)

client: MongoClient | None = None
db = None
_in_memory = False


def connect_db():
    global client, db, _in_memory
    try:
        client = MongoClient(settings.mongo_uri, serverSelectionTimeoutMS=3000)
        client.admin.command("ping")
        db = client[settings.db_name]
        _ensure_indexes(db)
        logger.info("Connected to MongoDB: %s", settings.db_name)
        return db
    except Exception:
        logger.warning("MongoDB not available. Using in-memory MongoDB (mongomock).")
        return _connect_mock()


def _connect_mock():
    global client, db, _in_memory
    try:
        import mongomock
        client = mongomock.MongoClient()
        db = client[settings.db_name]
        _ensure_indexes(db)
        _in_memory = True
        _seed_mock_data(db)
        logger.info("In-memory MongoDB ready with mock data.")
        return db
    except ImportError:
        logger.warning("mongomock not installed. Running without database.")
        client = None
        db = None
        return None


def _seed_mock_data(database):
    from passlib.context import CryptContext
    from mock_data.bookings import MOCK_BOOKINGS
    from mock_data.offers import MOCK_OFFERS
    from mock_data.destinations import MOCK_DESTINATIONS
    from mock_data.notifications import MOCK_NOTIFICATIONS
    from mock_data.faq import MOCK_FAQS
    from mock_data.contact import MOCK_CONTACT
    from mock_data.about import MOCK_COMPANY, MOCK_TEAM, MOCK_TESTIMONIALS, MOCK_STATS
    from mock_data.terms import MOCK_TERMS
    from mock_data.privacy import MOCK_PRIVACY
    from mock_data.room_details import MOCK_ROOMS

    pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
    if database.users.count_documents({"userId": "user_1"}) == 0:
        database.users.insert_one({
            "userId": "user_1", "firstName": "John", "lastName": "Doe", "name": "John Doe",
            "email": "john@example.com", "mobile": "+1 555 123 4567",
            "password": pwd_ctx.hash("demo123"),
            "dateOfBirth": "1992-05-15", "gender": "male",
            "country": "United States", "state": "California", "city": "San Francisco",
            "address": "123 Market Street, Suite 400",
            "avatar": "https://i.pravatar.cc/150?img=68",
            "language": "English", "currency": "USD", "twoFactorEnabled": False, "darkMode": False,
            "notificationPreferences": {"email": True, "sms": True, "push": True, "marketing": False},
            "createdAt": "2025-01-10T10:00:00Z", "lastLogin": "2026-06-28T14:30:00Z",
        })

    for b in MOCK_BOOKINGS:
        database.bookings.insert_one({k: v for k, v in b.items() if k != "_id"})
    for o in MOCK_OFFERS:
        database.offers.insert_one({k: v for k, v in o.items() if k != "_id"})
    for d in MOCK_DESTINATIONS:
        database.destinations.insert_one({k: v for k, v in d.items() if k != "_id"})
    for n in MOCK_NOTIFICATIONS:
        database.notifications.insert_one({k: v for k, v in n.items() if k != "_id"})
    for f in MOCK_FAQS:
        database.faqs.insert_one({k: v for k, v in f.items() if k != "_id"})
    database.contact.insert_one(dict(MOCK_CONTACT))
    database.terms.insert_one(dict(MOCK_TERMS))
    database.privacy.insert_one(dict(MOCK_PRIVACY))
    database.about.insert_one({"company": MOCK_COMPANY, "team": MOCK_TEAM, "testimonials": MOCK_TESTIMONIALS, "stats": MOCK_STATS})
    for room_id, room_data in MOCK_ROOMS.items():
        for hotel_id_short in range(1, 51):
            doc = {k: v for k, v in room_data.items() if k != "_id"}
            doc["hotelId"] = str(hotel_id_short)
            doc["roomId"] = room_id
            price_mod = (hotel_id_short % 10 + 1) * 0.1
            doc["pricePerNight"] = round(room_data["pricePerNight"] * (1 + price_mod))
            doc["totalPrice"] = round(room_data["totalPrice"] * (1 + price_mod))
            if doc.get("taxes"):
                doc["taxes"] = [{"amount": round(t["amount"] * (1 + price_mod), 2), "included": t["included"]} for t in room_data["taxes"]]
            database.rooms.insert_one(doc)


def _ensure_indexes(database):
    database.users.create_index("email", unique=True, sparse=True)
    database.users.create_index("userId", unique=True)
    database.wishlists.create_index("userId", unique=True)
    database.bookings.create_index([("userId", ASCENDING), ("createdAt", -1)])
    database.bookings.create_index("bookingId", unique=True, sparse=True)
    database.notifications.create_index([("userId", ASCENDING), ("createdAt", -1)])
    database.notifications.create_index([("userId", ASCENDING), ("read", ASCENDING)])
    database.destinations.create_index("category")
    database.destinations.create_index("popular")
    database.offers.create_index("category")
    database.offers.create_index("featured")
    database.faqs.create_index("order")


def get_db():
    return db


def is_in_memory():
    return _in_memory


def close_db():
    global client, db, _in_memory
    if client:
        client.close()
        client = None
        db = None
        _in_memory = False
        logger.info("MongoDB connection closed")
