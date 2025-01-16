# Job Tracker Backend

## Overview

The backend service for the Job Tracker application provides a robust API for managing job applications and user data. Built with FastAPI and PostgreSQL, it offers high-performance endpoints with automatic OpenAPI documentation and type safety.

## Technology Stack

- **FastAPI**: Modern, fast web framework for building APIs with Python 3.7+
- **PostgreSQL**: Robust, open-source relational database
- **Uvicorn**: Lightning-fast ASGI server implementation
- **SQLAlchemy**: SQL toolkit and ORM for database operations
- **Docker**: Container platform for consistent development and deployment

## Getting Started

### Prerequisites

- Python 3.12 or higher
- Docker and Docker Compose
- PostgreSQL client (optional, for direct database access)
- Git (for version control)

### Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL=postgresql://jobtracker:jobtracker@db:5432/jobtracker
SECRET_KEY=development_secret_key
```

### Installation and Setup

#### Using Docker (Recommended)

```bash
# Start the backend service with Docker Compose
docker-compose up backend
```

#### Direct Development

```bash
# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload
```

## Project Structure

```
backend/
├── app/                    # Application package
│   ├── __init__.py        # Package initializer
│   └── main.py            # Application entry point and API routes
├── Dockerfile.dev         # Development container configuration
└── requirements.txt       # Python dependencies
```

## API Documentation

### Interactive Documentation

When running, the API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Available Endpoints

- `GET /`: Health check endpoint
- `GET /api/applications`: Retrieve all job applications

## Development Guidelines

### Code Style and Standards

1. Follow PEP 8 guidelines for Python code
2. Use type hints for all function parameters and returns
3. Include docstrings for all modules, classes, and functions
4. Implement proper error handling and logging
5. Maintain test coverage for critical paths

### Database Management

#### Connection Details

Development database credentials:

- Host: `db` (Docker service name)
- Port: 5432
- Database: jobtracker
- Username: jobtracker
- Password: jobtracker

### Environment Variables

Configure the following for production:

- `DATABASE_URL`: Production database connection string
- `SECRET_KEY`: Secure secret key
- `ALLOWED_ORIGINS`: Allowed CORS origins
- `LOG_LEVEL`: Logging configuration
