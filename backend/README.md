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
├── app/ # Application package
│ ├── **init**.py # Package initializer
│ └── main.py # Application entry point
├── Dockerfile.dev # Development container configuration
└── requirements.txt # Python dependencies

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

[Previous content remains the same, add this new section:]

## Sample Data
The application comes pre-configured with sample job application data for development and testing purposes. This data is automatically loaded when the database container starts for the first time.

### Available Test Data
The sample dataset includes various job applications with the following information:
- Company names and positions
- Application statuses
- Locations and salary ranges
- Notes and application details

### Accessing Sample Data
- Via API: GET http://localhost:8000/api/applications
- Via Database: Connect to PostgreSQL and query the job_applications table
- Via Frontend: Data is displayed in a table format at http://localhost:5173

### Modifying Sample Data
To modify the sample data, edit the initialization script at:
infrastructure/docker/init.sql