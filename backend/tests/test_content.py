import pytest


class TestHealth:
    def test_root(self, client):
        resp = client.get("/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["app"] == "LuminaStay API"

    def test_health_degraded(self, client):
        resp = client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert data["details"]["database"] == "connected"


class TestHotels:
    def test_room_details_valid(self, client):
        resp = client.get("/api/hotels/1/rooms/1")
        assert resp.status_code == 200
        data = resp.json()
        assert data["room"]["id"] == "1"
        assert "pricePerNight" in data["room"]

    def test_room_details_not_found(self, client):
        resp = client.get("/api/hotels/1/rooms/nonexistent-room")
        assert resp.status_code == 404
        assert "Room not found" in resp.json()["error"]

    def test_room_details_another_valid(self, client):
        resp = client.get("/api/hotels/1/rooms/2")
        assert resp.status_code == 200
        assert resp.json()["room"]["id"] == "2"


class TestDestinations:
    def test_get_destinations(self, client):
        resp = client.get("/api/destinations")
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "database"
        assert "destinations" in data
        assert len(data["destinations"]) > 0

    def test_get_destinations_by_category(self, client):
        resp = client.get("/api/destinations?category=beach")
        assert resp.status_code == 200
        for d in resp.json()["destinations"]:
            assert "beach" in d["category"]

    def test_get_featured_hotels(self, client):
        resp = client.get("/api/destinations?type=featured-hotels")
        assert resp.status_code == 200
        assert "hotels" in resp.json()

    def test_get_travel_guides(self, client):
        resp = client.get("/api/destinations?type=guides")
        assert resp.status_code == 200
        assert "guides" in resp.json()

    def test_destinations_pagination(self, client):
        resp = client.get("/api/destinations?page=1&limit=5")
        assert resp.status_code == 200
        assert len(resp.json()["destinations"]) <= 5


class TestOffers:
    def test_get_offers(self, client):
        resp = client.get("/api/offers")
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "database"
        assert "offers" in data
        assert len(data["offers"]) > 0

    def test_get_offers_by_category(self, client):
        resp = client.get("/api/offers?category=seasonal")
        assert resp.status_code == 200
        for o in resp.json()["offers"]:
            assert o["category"] == "seasonal"

    def test_get_featured_offers(self, client):
        resp = client.get("/api/offers?featured=true")
        assert resp.status_code == 200

    def test_get_active_offers(self, client):
        resp = client.get("/api/offers?active=true")
        assert resp.status_code == 200

    def test_offers_pagination(self, client):
        resp = client.get("/api/offers?page=1&limit=3")
        assert resp.status_code == 200
        assert len(resp.json()["offers"]) <= 3


class TestNotifications:
    def test_get_notifications_without_auth(self, client, csrf_headers):
        resp = client.get("/api/notifications", headers=csrf_headers)
        assert resp.status_code == 401

    def test_get_notifications_with_auth(self, client, auth_headers):
        resp = client.get("/api/notifications", headers=auth_headers)
        assert resp.status_code == 200

    def test_get_unread_notifications(self, client, auth_headers):
        resp = client.get("/api/notifications?unreadOnly=true", headers=auth_headers)
        assert resp.status_code == 200
        for n in resp.json()["notifications"]:
            assert n["read"] is False

    def test_notifications_pagination(self, client, auth_headers):
        resp = client.get("/api/notifications?page=1&limit=5", headers=auth_headers)
        assert resp.status_code == 200

    def test_mark_notification_read(self, client, auth_headers):
        resp = client.patch("/api/notifications", json={
            "notificationId": "notif_1",
            "action": "markRead",
        }, headers=auth_headers)
        assert resp.status_code == 200

    def test_mark_all_read(self, client, auth_headers):
        resp = client.patch("/api/notifications", json={
            "action": "markAllRead",
        }, headers=auth_headers)
        assert resp.status_code == 200

    def test_delete_notification(self, client, auth_headers):
        resp = client.request("DELETE", "/api/notifications", json={
            "notificationId": "notif_1",
        }, headers=auth_headers)
        assert resp.status_code == 200

    def test_delete_all_notifications(self, client, auth_headers):
        resp = client.request("DELETE", "/api/notifications", json={
            "notificationId": "all",
        }, headers=auth_headers)
        assert resp.status_code == 200


class TestFAQ:
    def test_get_faqs(self, client):
        resp = client.get("/api/faq")
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "database"
        assert "faqs" in data
        assert len(data["faqs"]) > 0

    def test_get_faqs_by_category(self, client):
        resp = client.get("/api/faq?category=booking")
        assert resp.status_code == 200
        for f in resp.json()["faqs"]:
            assert f["category"] == "booking"

    def test_get_faqs_search(self, client):
        resp = client.get("/api/faq?search=cancel")
        assert resp.status_code == 200
        assert len(resp.json()["faqs"]) > 0

    def test_faqs_pagination(self, client):
        resp = client.get("/api/faq?page=1&limit=5")
        assert resp.status_code == 200


class TestAbout:
    def test_get_about(self, client):
        resp = client.get("/api/about")
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "database"
        assert "company" in data
        assert "team" in data
        assert "testimonials" in data
        assert "stats" in data


class TestTerms:
    def test_get_terms(self, client):
        resp = client.get("/api/terms")
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "database"
        assert "terms" in data


class TestPrivacy:
    def test_get_privacy(self, client):
        resp = client.get("/api/privacy")
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "database"
        assert "policy" in data


class TestCSRF:
    def test_get_csrf_token(self, client):
        resp = client.get("/api/auth/csrf")
        assert resp.status_code == 200
        data = resp.json()
        assert "csrfToken" in data
        assert len(data["csrfToken"]) == 64  # hex 32 bytes

    def test_csrf_unknown_origin_rejected(self, client):
        resp = client.post("/api/auth/login", json={"email": "john@example.com", "password": "demo123"},
            headers={"Origin": "https://evil.com"})
        assert resp.status_code == 403
        assert "CSRF" in resp.json()["error"]
