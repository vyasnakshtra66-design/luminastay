import pytest


class TestGetBookings:
    def test_get_bookings_without_auth(self, client, csrf_headers):
        resp = client.get("/api/bookings", headers=csrf_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "mock"
        assert "bookings" in data
        assert "pagination" in data
        assert len(data["bookings"]) > 0
        assert data["bookings"][0]["bookingId"] == "LUM829471"

    def test_get_bookings_with_auth(self, client, auth_headers):
        resp = client.get("/api/bookings", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["source"] == "mock"

    def test_get_bookings_filter_by_status(self, client, csrf_headers):
        resp = client.get("/api/bookings?status=completed", headers=csrf_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "bookings" in data

    def test_get_bookings_pagination(self, client, csrf_headers):
        resp = client.get("/api/bookings?page=1&limit=2", headers=csrf_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["bookings"]) == 2
        assert data["pagination"]["page"] == 1
        assert data["pagination"]["limit"] == 2
        assert data["pagination"]["total"] > 2

    def test_get_bookings_search_too_long(self, client, csrf_headers):
        resp = client.get(f"/api/bookings?search={'a' * 101}", headers=csrf_headers)
        assert resp.status_code == 400

    def test_get_bookings_page_out_of_range(self, client, csrf_headers):
        resp = client.get("/api/bookings?page=999&limit=10", headers=csrf_headers)
        assert resp.status_code == 200
        assert len(resp.json()["bookings"]) == 0


class TestCancelBooking:
    def test_cancel_booking(self, client, csrf_headers):
        resp = client.put("/api/bookings", json={
            "bookingId": "LUM829471",
            "action": "cancel",
        }, headers=csrf_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "mock"
        assert data["success"] is True

    def test_cancel_invalid_action(self, client, csrf_headers):
        resp = client.put("/api/bookings", json={
            "bookingId": "LUM829471",
            "action": "refund",
        }, headers=csrf_headers)
        assert resp.status_code == 400
