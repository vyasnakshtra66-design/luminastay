import os
os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"

import pytest
from fastapi.testclient import TestClient
from main import app
from auth_jwt import create_token

CSRF_ORIGIN = "http://localhost:3000"


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def auth_token():
    return create_token("user_1")


@pytest.fixture(scope="session")
def auth_headers(auth_token):
    return {
        "Authorization": f"Bearer {auth_token}",
        "Origin": CSRF_ORIGIN,
    }


@pytest.fixture(scope="session")
def csrf_headers():
    return {"Origin": CSRF_ORIGIN}
