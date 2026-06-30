"""Seed MongoDB with mock data. Run: python seed.py"""

from database import connect_db, close_db
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


def seed():
    db = connect_db()
    if not db:
        print("MongoDB not available. Skipping seed.")
        return
    
    from database import is_in_memory
    if is_in_memory():
        print("In-memory mode — data already auto-seeded on startup.")
        close_db()
        return
    
    print("Seeding MongoDB database...")

    bookings_col = db["bookings"]
    bookings_col.delete_many({})
    for b in MOCK_BOOKINGS:
        b_copy = dict(b)
        b_copy.pop("_id", None)
        bookings_col.insert_one(b_copy)
    print(f"  Inserted {len(MOCK_BOOKINGS)} bookings")

    offers_col = db["offers"]
    offers_col.delete_many({})
    for o in MOCK_OFFERS:
        o_copy = dict(o)
        o_copy.pop("_id", None)
        offers_col.insert_one(o_copy)
    print(f"  Inserted {len(MOCK_OFFERS)} offers")

    dests_col = db["destinations"]
    dests_col.delete_many({})
    for d in MOCK_DESTINATIONS:
        d_copy = dict(d)
        d_copy.pop("_id", None)
        dests_col.insert_one(d_copy)
    print(f"  Inserted {len(MOCK_DESTINATIONS)} destinations")

    notifs_col = db["notifications"]
    notifs_col.delete_many({})
    for n in MOCK_NOTIFICATIONS:
        n_copy = dict(n)
        n_copy.pop("_id", None)
        notifs_col.insert_one(n_copy)
    print(f"  Inserted {len(MOCK_NOTIFICATIONS)} notifications")

    faqs_col = db["faqs"]
    faqs_col.delete_many({})
    for f in MOCK_FAQS:
        f_copy = dict(f)
        f_copy.pop("_id", None)
        faqs_col.insert_one(f_copy)
    print(f"  Inserted {len(MOCK_FAQS)} FAQs")

    contact_col = db["contact"]
    contact_col.delete_many({})
    contact_col.insert_one(dict(MOCK_CONTACT))
    print("  Inserted contact info")

    terms_col = db["terms"]
    terms_col.delete_many({})
    terms_col.insert_one(dict(MOCK_TERMS))
    print("  Inserted terms")

    privacy_col = db["privacy"]
    privacy_col.delete_many({})
    privacy_col.insert_one(dict(MOCK_PRIVACY))
    print("  Inserted privacy policy")

    about_col = db["about"]
    about_col.delete_many({})
    about_col.insert_one({
        "company": MOCK_COMPANY,
        "team": MOCK_TEAM,
        "testimonials": MOCK_TESTIMONIALS,
        "stats": MOCK_STATS,
    })
    print("  Inserted about data")

    rooms_col = db["rooms"]
    rooms_col.delete_many({})
    for room_id, room_data in MOCK_ROOMS.items():
        for hotel_id_short in range(1, 51):
            doc = dict(room_data)
            doc.pop("_id", None)
            doc["hotelId"] = str(hotel_id_short)
            doc["roomId"] = room_id
            price_mod = (hotel_id_short % 10 + 1) * 0.1
            doc["pricePerNight"] = round(room_data["pricePerNight"] * (1 + price_mod))
            doc["totalPrice"] = round(room_data["totalPrice"] * (1 + price_mod))
            if doc.get("taxes"):
                doc["taxes"] = [{"amount": round(t["amount"] * (1 + price_mod), 2), "included": t["included"]} for t in room_data["taxes"]]
            rooms_col.insert_one(doc)
    print(f"  Inserted {len(MOCK_ROOMS)} room types x 50 hotels = {len(MOCK_ROOMS) * 50} rooms")

    print("Seeding complete!")
    close_db()


if __name__ == "__main__":
    seed()
