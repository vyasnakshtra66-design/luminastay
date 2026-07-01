import pytest


class TestGetBookings:
    def test_get_bookings_without_auth(self, client, csrf_headers):
        resp = client.get("/api/bookings", headers=csrf_headers)
        assert resp.status_code == 401

    def test_get_bookings_with_auth(self, client, auth_headers):
        resp = client.get("/api/bookings", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["source"] == "database"

    def test_get_bookings_filter_by_status(self, client, auth_headers):
        resp = client.get("/api/bookings?status=completed", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "bookings" in data

    def test_get_bookings_pagination(self, client, auth_headers):
        resp = client.get("/api/bookings?page=1&limit=2", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["bookings"]) == 2
        assert data["pagination"]["page"] == 1
        assert data["pagination"]["limit"] == 2
        assert data["pagination"]["total"] > 2

    def test_get_bookings_search_too_long(self, client, auth_headers):
        resp = client.get(f"/api/bookings?search={'a' * 101}", headers=auth_headers)
        assert resp.status_code == 400

    def test_get_bookings_page_out_of_range(self, client, auth_headers):
        resp = client.get("/api/bookings?page=999&limit=10", headers=auth_headers)
        assert resp.status_code == 200
        assert len(resp.json()["bookings"]) == 0


class TestCancelBooking:
    def test_cancel_booking(self, client, auth_headers):
        resp = client.put("/api/bookings", json={
            "bookingId": "LUM829471",
            "action": "cancel",
        }, headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "database"
        assert data["booking"]["status"] == "cancelled"

    def test_cancel_invalid_action(self, client, auth_headers):
        resp = client.put("/api/bookings", json={
            "bookingId": "LUM829471",
            "action": "refund",
        }, headers=auth_headers)
        assert resp.status_code == 400
