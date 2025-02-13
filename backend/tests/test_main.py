from fastapi.testclient import TestClient
import pytest
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
    response = client.get("/bpi/applications")
    assert response.status_code == 401
    assert "detail" in response.json()


def test_get_contacts_unauthorized():
    """Test that contacts endpoint requires authentication"""
    response = client.get("/bpi/contacts")
    assert response.status_code == 401
    assert "detail" in response.json()


# Add a basic test configuration fixture
@pytest.fixture(autouse=True)
def setup_test_env(monkeypatch):
    """Setup test environment variables"""
    monkeypatch.setenv(
        "DATABASE_URL", "postgresql://jobtracker:jobtracker@localhost:5432/jobtracker"
    )
    monkeypatch.setenv("SECRET_KEY", "test_secret_key")
    monkeypatch.setenv("ALGORITHM", "HS256")
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
