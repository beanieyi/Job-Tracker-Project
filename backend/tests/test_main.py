from fastapi.testclient import TestClient
from httpx import AsyncClient
import pytest
from app.main import app
import asyncio
from typing import Generator


# Create a test client fixture
@pytest.fixture(scope="module")
def test_client() -> Generator:
    with TestClient(app=app, base_url="http://test") as client:
        yield client


# Test cases using the fixture
def test_read_root(test_client: TestClient):
    """Test the root endpoint returns correct status"""
    response = test_client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "status": "online",
        "message": "Welcome to the Job Tracker API",
    }


def test_get_applications_unauthorized(test_client: TestClient):
    """Test that applications endpoint requires authentication"""
    response = test_client.get("/bpi/applications")
    assert response.status_code == 401
    assert "detail" in response.json()


def test_get_contacts_unauthorized(test_client: TestClient):
    """Test that contacts endpoint requires authentication"""
    response = test_client.get("/bpi/contacts")
    assert response.status_code == 401
    assert "detail" in response.json()


# Add async test client fixture for async endpoints
@pytest.fixture(scope="module")
async def async_test_client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


# Example of an async test if needed
@pytest.mark.asyncio
async def test_async_endpoint(async_test_client: AsyncClient):
    """Example of how to test async endpoints"""
    response = await async_test_client.get("/")
    assert response.status_code == 200
