import pytest


class TestProfile:
    def test_get_profile_without_auth(self, client, csrf_headers):
        resp = client.get("/api/profile", headers=csrf_headers)
        assert resp.status_code == 401

    def test_get_profile_with_auth(self, client, auth_headers):
        resp = client.get("/api/profile", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["source"] == "database"

    def test_update_profile_no_fields(self, client, auth_headers):
        resp = client.put("/api/profile", json={}, headers=auth_headers)
        assert resp.status_code == 400
        assert resp.json()["error"] == "No valid fields to update"

    def test_update_profile_success(self, client, auth_headers):
        resp = client.put("/api/profile", json={"firstName": "Jane"}, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["source"] == "database"

    def test_update_profile_partial(self, client, auth_headers):
        resp = client.put("/api/profile", json={
            "firstName": "Jane",
            "language": "French",
            "currency": "EUR",
        }, headers=auth_headers)
        assert resp.status_code == 200


class TestLoyalty:
    def test_get_loyalty_without_auth(self, client, csrf_headers):
        resp = client.get("/api/loyalty", headers=csrf_headers)
        assert resp.status_code == 401

    def test_get_loyalty_with_auth(self, client, auth_headers):
        resp = client.get("/api/loyalty", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["source"] == "fallback"

    def test_loyalty_tier_progression(self, client, auth_headers):
        resp = client.get("/api/loyalty", headers=auth_headers)
        data = resp.json()["loyalty"]
        assert data["nextTier"] == "Platinum"
        assert data["pointsToNext"] == 6800
        assert data["totalNights"] == 24
