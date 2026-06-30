MOCK_FAQS = [
    {"_id": "f1", "question": "How do I make a booking?", "answer": "Simply search for your desired destination, select a hotel, choose your room, and proceed to checkout. You can pay using credit/debit cards or UPI.", "category": "bookings", "popular": True, "order": 1, "active": True, "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z"},
    {"_id": "f2", "question": "Can I cancel or modify my booking?", "answer": "Yes, you can cancel or modify your booking from the My Bookings section. Cancellation policies vary by hotel and rate plan. Free cancellation is available on select bookings.", "category": "bookings", "popular": True, "order": 2, "active": True, "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z"},
    {"_id": "f3", "question": "How do I get a refund?", "answer": "Refunds are processed automatically when you cancel a refundable booking. The amount will be credited to your original payment method within 5-10 business days.", "category": "payments", "popular": True, "order": 3, "active": True, "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z"},
    {"_id": "f4", "question": "What payment methods do you accept?", "answer": "We accept Visa, Mastercard, American Express, UPI, and Net Banking. All transactions are secured with SSL encryption.", "category": "payments", "popular": True, "order": 4, "active": True, "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z"},
    {"_id": "f5", "question": "How do I earn loyalty points?", "answer": "You earn 1 point for every $1 spent on qualifying bookings. Points can be redeemed for discounts on future stays.", "category": "account", "popular": False, "order": 5, "active": True, "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z"},
    {"_id": "f6", "question": "How do I reset my password?", "answer": "Click on 'Forgot Password' on the login page and enter your registered email. We'll send you a password reset link.", "category": "account", "popular": False, "order": 6, "active": True, "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z"},
    {"_id": "f7", "question": "Is my personal information secure?", "answer": "Yes, we use industry-standard SSL encryption and never share your personal data with third parties without your consent.", "category": "account", "popular": False, "order": 7, "active": True, "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z"},
    {"_id": "f8", "question": "Do you offer group or corporate bookings?", "answer": "Yes, we offer special rates for group and corporate bookings. Contact our support team for a customized quote.", "category": "bookings", "popular": False, "order": 8, "active": True, "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z"},
]


def get_mock_faqs(category=None, search=""):
    result = [f for f in MOCK_FAQS if f["active"]]
    if category and category != "all":
        result = [f for f in result if f["category"] == category]
    if search:
        result = [f for f in result if search.lower() in f["question"].lower() or search.lower() in f["answer"].lower()]
    return result
