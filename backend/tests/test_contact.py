import pytest


class TestContact:
    def test_get_contact_info(self, client):
        resp = client.get("/api/contact")
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "fallback"
        assert "contact" in data

    def test_contact_submission_success(self, client, csrf_headers):
        resp = client.post("/api/contact", json={
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+1 555 123 4567",
            "subject": "Test Subject",
            "message": "This is a test message that is long enough.",
            "recaptchaToken": "test-token",
        }, headers=csrf_headers)
        assert resp.status_code == 200
        assert resp.json()["success"] is True

    def test_contact_submission_missing_name(self, client, csrf_headers):
        resp = client.post("/api/contact", json={
            "name": "",
            "email": "test@example.com",
            "subject": "Test",
            "message": "Valid message here",
        }, headers=csrf_headers)
        assert resp.status_code == 400
        assert "name" in resp.json()["errors"]

    def test_contact_submission_invalid_email(self, client, csrf_headers):
        resp = client.post("/api/contact", json={
            "name": "Test",
            "email": "bad-email",
            "subject": "Test",
            "message": "Valid message here",
        }, headers=csrf_headers)
        assert resp.status_code == 400
        assert "email" in resp.json()["errors"]

    def test_contact_submission_short_message(self, client, csrf_headers):
        resp = client.post("/api/contact", json={
            "name": "Test",
            "email": "test@example.com",
            "subject": "Test",
            "message": "Short",
        }, headers=csrf_headers)
        assert resp.status_code == 400
        assert "message" in resp.json()["errors"]


class TestWishlist:
    def test_get_wishlist_without_auth(self, client, csrf_headers):
        resp = client.get("/api/wishlist", headers=csrf_headers)
        assert resp.status_code == 401

    def test_get_wishlist_with_auth(self, client, auth_headers):
        resp = client.get("/api/wishlist", headers=auth_headers)
        assert resp.status_code == 200

    def test_add_to_wishlist(self, client, auth_headers):
        resp = client.post("/api/wishlist", json={"hotelId": 42}, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["source"] == "database"

    def test_add_to_wishlist_missing_id(self, client, auth_headers):
        resp = client.post("/api/wishlist", json={"hotelId": 0}, headers=auth_headers)
        assert resp.status_code == 400

    def test_remove_from_wishlist(self, client, auth_headers):
        resp = client.delete("/api/wishlist?hotelId=1", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["source"] == "database"

    def test_remove_from_wishlist_missing_id(self, client, auth_headers):
        resp = client.delete("/api/wishlist?hotelId=0", headers=auth_headers)
        assert resp.status_code == 400
