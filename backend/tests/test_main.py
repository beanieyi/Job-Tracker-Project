import pytest
from fastapi.testclient import TestClient
from app.main import app

# Create test client without using 'app' keyword argument
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
    response = client.get("/api/applications")
    assert response.status_code == 401
    assert "detail" in response.json()


def test_get_contacts_unauthorized():
    """Test that contacts endpoint requires authentication"""
    response = client.get("/api/contacts")
    assert response.status_code == 401
    assert "detail" in response.json()


@pytest.fixture(autouse=True)
def setup_test_env(monkeypatch):
    """Setup test environment variables"""
    test_env_vars = {
        "DATABASE_URL": "postgresql://jobtracker:jobtracker@localhost:5432/jobtracker",
        "SECRET_KEY": "test_secret_key",
        "ALGORITHM": "HS256",
        "ACCESS_TOKEN_EXPIRE_MINUTES": "30",
    }
    for key, value in test_env_vars.items():
        monkeypatch.setenv(key, value)
