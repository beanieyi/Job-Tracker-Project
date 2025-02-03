# Job Tracker Backend

## Overview

The backend service provides a robust API for managing job applications and user data. Built with FastAPI and PostgreSQL, it offers high-performance endpoints with automatic OpenAPI documentation and comprehensive type safety.

## Technology Stack

- **FastAPI 0.109.0**: Modern, high-performance web framework
- **Uvicorn 0.27.0**: Lightning-fast ASGI server
- **SQLAlchemy 2.0.25**: SQL toolkit and ORM
- **Pydantic 2.5.3**: Data validation using Python type hints
- **PostgreSQL 14**: Robust relational database
- **JWT & Passlib**: Authentication and security
- **Python-dotenv 1.0.1**: Environment configuration
- **Python-multipart 0.0.20**: Form data handling

## Features

- RESTful API endpoints
- JWT-based authentication
- Automatic API documentation
- Type-safe request/response handling
- Database connection pooling
- Comprehensive error handling
- CORS middleware configuration

## Getting Started

### Prerequisites

- Python 3.12 or higher
- Docker and Docker Compose
- PostgreSQL client
- Git

### Development Setup

#### Using Docker (Recommended)

```bash
# Start the backend service
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
├── app/
│   ├── routers/
│   │   ├── applications.py
│   │   ├── auth.py
│   │   └── contacts.py
│   ├── models/
│   │   ├── applications.py
│   │   ├── contacts.py
│   │   └── user.py
│   ├── queries/
│   │   ├── applications.py
│   │   ├── contacts.py
│   │   └── users.py
│   ├── utils/
│   │   ├── hashing.py
│   │   └── jwt_manager.py
│   ├── config.py
│   ├── database.py
│   └── main.py
└── requirements.txt
```

## API Documentation

### Authentication Endpoints

- POST `/auth/register`: Register new user
- POST `/auth/login`: User login
- GET `/auth/users`: List users (authenticated)

### Application Endpoints

- GET `/applications/get_applications`: List all job applications

### Contact Endpoints

- GET `/contacts/get_contacts`: List network contacts

### Interactive Documentation

When running, access:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Schema

### Core Tables

1. **users**

   - Authentication and profile data
   - Skills tracking
   - Created timestamp

2. **job_applications**

   - Application details
   - Status tracking
   - Skills matching
   - Priority levels

3. **application_timeline**

   - Status history
   - Date tracking
   - Application notes

4. **network_contacts**

   - Professional contacts
   - Contact information
   - Company associations

5. **role_insights**
   - Market analysis
   - Salary data
   - Skill requirements
   - Company trends

### Database Management

#### Connection Details

Development credentials:

- Host: `db`
- Port: 5432
- Database: jobtracker
- Username: jobtracker
- Password: jobtracker

#### Management Operations

```bash
# Access PostgreSQL CLI
docker-compose exec db psql -U jobtracker

# Backup database
docker-compose exec db pg_dump -U jobtracker > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U jobtracker
```

## Environment Configuration

Create `.env` file with:

```env
DATABASE_URL=postgresql://jobtracker:jobtracker@db:5432/jobtracker
SECRET_KEY=development_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
