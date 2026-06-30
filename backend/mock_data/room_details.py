VALID_ROOM_IDS = ["1", "2", "3", "4"]

MOCK_ROOMS = {
    "1": {
        "id": "1", "name": "Deluxe King Room", "type": "DELUXE",
        "bedType": "King", "bedCount": 1, "maxGuests": 2,
        "description": "Experience ultimate comfort in our Deluxe King Room. Featuring a premium king-sized bed with Egyptian cotton linens, a marble bathroom with rain shower, and stunning city views through floor-to-ceiling windows.",
        "pricePerNight": 389, "currency": "USD", "totalPrice": 778,
        "taxes": [{"amount": 62.24, "included": False}],
        "checkIn": "2026-07-15", "checkOut": "2026-07-17", "nights": 2,
        "availableRooms": 3, "breakfast": True, "freeCancellation": True,
        "cancellationDeadline": "2026-07-10T23:59:00",
        "images": [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
            "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80",
        ],
        "amenities": ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Mini Bar",
                       "Coffee Maker", "Safe Locker", "Hair Dryer", "Room Service", "Work Desk"],
    },
    "2": {
        "id": "2", "name": "Executive Suite", "type": "SUITE",
        "bedType": "King", "bedCount": 1, "maxGuests": 3,
        "description": "Our Executive Suite offers a spacious living area separate from the bedroom, a private workspace, and access to the executive lounge with complimentary refreshments throughout the day.",
        "pricePerNight": 512, "currency": "USD", "totalPrice": 1024,
        "taxes": [{"amount": 81.92, "included": False}],
        "checkIn": "2026-07-15", "checkOut": "2026-07-17", "nights": 2,
        "availableRooms": 2, "breakfast": True, "freeCancellation": True,
        "cancellationDeadline": "2026-07-11T23:59:00",
        "images": [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
            "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        ],
        "amenities": ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Balcony",
                       "Mini Bar", "Coffee Maker", "Safe Locker", "Hair Dryer", "Room Service", "Work Desk"],
    },
    "3": {
        "id": "3", "name": "Junior Suite", "type": "JUNIOR_SUITE",
        "bedType": "Queen", "bedCount": 1, "maxGuests": 2,
        "description": "A perfect blend of comfort and style. The Junior Suite features a queen-sized bed, a cozy sitting area, a walk-in closet, and upgraded bathroom amenities for a truly relaxing stay.",
        "pricePerNight": 445, "currency": "USD", "totalPrice": 890,
        "taxes": [{"amount": 71.2, "included": False}],
        "checkIn": "2026-07-15", "checkOut": "2026-07-17", "nights": 2,
        "availableRooms": 4, "breakfast": False, "freeCancellation": True,
        "cancellationDeadline": "2026-07-09T23:59:00",
        "images": [
            "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
            "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80",
        ],
        "amenities": ["Free Wi-Fi", "Air Conditioning", "TV", "Mini Bar",
                       "Coffee Maker", "Safe Locker", "Hair Dryer", "Work Desk"],
    },
    "4": {
        "id": "4", "name": "Standard Twin Room", "type": "STANDARD",
        "bedType": "Twin", "bedCount": 2, "maxGuests": 2,
        "description": "Ideal for friends or colleagues traveling together. The Standard Twin Room offers two comfortable single beds, a work desk, and all essential amenities for a pleasant stay.",
        "pricePerNight": 179, "currency": "USD", "totalPrice": 358,
        "taxes": [{"amount": 28.64, "included": False}],
        "checkIn": "2026-07-15", "checkOut": "2026-07-17", "nights": 2,
        "availableRooms": 6, "breakfast": False, "freeCancellation": True,
        "cancellationDeadline": "2026-07-12T23:59:00",
        "images": [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
            "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80",
            "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80",
        ],
        "amenities": ["Free Wi-Fi", "Air Conditioning", "TV", "Work Desk", "Hair Dryer"],
    },
}


def get_mock_room_details(hotel_id: str, room_id: str):
    if not hotel_id:
        return None
    room = MOCK_ROOMS.get(room_id)
    if not room:
        room = MOCK_ROOMS["1"]
    result = dict(room)
    price_mod = (int(hotel_id) % 10 + 1) * 0.1
    result["pricePerNight"] = round(room["pricePerNight"] * (1 + price_mod))
    result["totalPrice"] = round(room["totalPrice"] * (1 + price_mod))
    if room.get("taxes"):
        result["taxes"] = [{"amount": round(t["amount"] * (1 + price_mod), 2), "included": t["included"]} for t in room["taxes"]]
    return result
