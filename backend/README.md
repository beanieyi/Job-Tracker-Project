# Job Tracker Backend

## Overview
The backend service for the Job Tracker application, built with FastAPI and PostgreSQL. This service provides the API endpoints for managing job applications, user data, and application tracking.

## Technology Stack
- FastAPI: Modern Python web framework for building APIs
- PostgreSQL: Primary database
- Uvicorn: ASGI server implementation
- Docker: Containerization

## Local Development Setup

### Prerequisites
- Python 3.12 or higher
- Docker and Docker Compose
- PostgreSQL client (optional, for direct database access)

### Environment Configuration
The service uses the following environment variables:

DATABASE_URL=postgresql://jobtracker:jobtracker@db:5432/jobtracker
SECRET_KEY=development_secret_key

### Running the Service
Using Docker (recommended):
docker-compose up backend

Direct development:
uvicorn app.main:app --reload

## Project Structure
backend/
├── app/                    # Application package
│   ├── __init__.py        # Package initializer
│   └── main.py            # Application entry point
├── Dockerfile.dev         # Development container configuration
└── requirements.txt       # Python dependencies

## API Documentation
When running, the API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development Guidelines

### Code Style
- Follow PEP 8 guidelines
- Use type hints for function parameters and returns
- Document functions using docstrings

### Testing
- Write unit tests for new endpoints
- Ensure test coverage for critical paths

### Database Connections
When developing locally with Docker:
- Host: localhost (Windows) or Docker IP (WSL)
- Port: 5432
- Database: jobtracker
- Username: jobtracker
- Password: jobtracker

### Adding New Endpoints
1. Create new endpoints in appropriate modules
2. Include type hints and docstrings
3. Update API documentation
4. Add necessary database models
5. Include error handling