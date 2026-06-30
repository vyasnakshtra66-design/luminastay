import pytest


class TestLogin:
    def test_login_unknown_user(self, client, csrf_headers):
        resp = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "TestPass123!",
        }, headers=csrf_headers)
        assert resp.status_code == 401

    def test_login_invalid_credentials(self, client, csrf_headers):
        resp = client.post("/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "WrongPass1!",
        }, headers=csrf_headers)
        assert resp.status_code == 401
        assert resp.json()["error"] == "Invalid email or password"

    def test_login_missing_fields(self, client, csrf_headers):
        resp = client.post("/api/auth/login", json={
            "email": "",
            "password": "",
        }, headers=csrf_headers)
        assert resp.status_code == 400
        assert "required" in resp.json()["error"].lower()

    def test_login_wrong_password(self, client, csrf_headers):
        resp = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "WrongPass1!",
        }, headers=csrf_headers)
        assert resp.status_code == 401


class TestRegister:
    VALID_USER = {
        "name": "New User",
        "email": "newuser@example.com",
        "password": "StrongP@ss1",
        "mobile": "+1 555 987 6543",
    }

    def test_register_success_mock(self, client, csrf_headers):
        resp = client.post("/api/auth/register", json=self.VALID_USER, headers=csrf_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["source"] == "mock"
        assert data["message"] == "Account created successfully! You can now sign in."

    def test_register_invalid_email(self, client, csrf_headers):
        body = {**self.VALID_USER, "email": "not-an-email"}
        resp = client.post("/api/auth/register", json=body, headers=csrf_headers)
        assert resp.status_code == 400
        assert "email" in resp.json()["error"].lower()

    def test_register_weak_password(self, client, csrf_headers):
        body = {**self.VALID_USER, "password": "short"}
        resp = client.post("/api/auth/register", json=body, headers=csrf_headers)
        assert resp.status_code == 400
        assert "password" in resp.json()["error"].lower()

    def test_register_missing_name(self, client, csrf_headers):
        body = {**self.VALID_USER, "name": "   "}
        resp = client.post("/api/auth/register", json=body, headers=csrf_headers)
        assert resp.status_code == 400

    def test_register_missing_mobile(self, client, csrf_headers):
        body = {**self.VALID_USER, "mobile": ""}
        resp = client.post("/api/auth/register", json=body, headers=csrf_headers)
        assert resp.status_code == 400
