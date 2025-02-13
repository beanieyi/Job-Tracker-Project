# Path: backend/tests/test_main.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_read_root():
    """Test the root endpoint returns correct status"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "status": "online",
        "message": "Welcome to the Job Tracker API",
    }


def test_get_applications_unauthorized():
    """Test that applications endpoint requires authentication"""
    response = client.get("/bpi/applications")  # Using correct endpoint
    assert response.status_code == 401
    assert "detail" in response.json()


def test_get_contacts_unauthorized():
    """Test that contacts endpoint requires authentication"""
    response = client.get("/bpi/contacts")  # Using correct endpoint
    assert response.status_code == 401
    assert "detail" in response.json()
