# Job Tracker Infrastructure

## Overview

The infrastructure configuration for the Job Tracker application provides a containerized development environment using Docker and Docker Compose. This setup ensures consistency across development environments and simplifies the deployment process.

## Architecture Components

### Services

1. **Frontend Service (React/Vite)**

   - Development server with hot-reload
   - Port: 5173
   - Environment variables for API configuration
   - Volume-mounted source code

2. **Backend Service (FastAPI)**

   - Auto-reloading development server
   - Port: 8000
   - Database connection configuration
   - Volume-mounted source code

3. **Database Service (PostgreSQL)**
   - Alpine-based PostgreSQL 14
   - Port: 5432
   - Persistent data storage
   - Health monitoring
   - Initialization scripts

## Getting Started

### Prerequisites

- Docker Desktop 4.0 or higher with WSL 2 backend
- Docker Compose version 2.0 or higher
- Modern terminal (WSL recommended for Windows users)
- Git for version control

### Environment Setup

1. Clone the repository
2. Navigate to the infrastructure/docker directory
3. Run the following command:
   ```bash
   docker-compose up --build
   ```

### Service Access Points

After successful startup, services are available at:

- Frontend Application: http://localhost:5173
- Backend API: http://localhost:8000
- Database: localhost:5432

## Configuration Management

### Environment Variables

The development environment uses the following configuration:

**Frontend Service:**

```env
VITE_API_URL=http://localhost:8000
```

**Backend Service:**

```env
DATABASE_URL=postgresql://jobtracker:jobtracker@db:5432/jobtracker
SECRET_KEY=development_secret_key
```

**Database Service:**

```env
POSTGRES_USER=jobtracker
POSTGRES_PASSWORD=jobtracker
POSTGRES_DB=jobtracker
```

### Volume Management

The infrastructure uses Docker volumes for data persistence:

1. **postgres_data**

   - Purpose: PostgreSQL data storage
   - Persistence: Survives container restarts
   - Management: Handled by Docker Compose

2. **Source Code Volumes**
   - Frontend: `../../frontend:/app`
   - Backend: `../../backend:/app`
   - Purpose: Development hot-reload

## Development Workflow

### Starting the Environment

```bash
# Start all services
docker-compose up --build

# Start specific service
docker-compose up frontend --build
```

### Monitoring and Maintenance

```bash
# View service logs
docker-compose logs -f [service_name]

# Check service status
docker-compose ps

# Restart services
docker-compose restart [service_name]
```

### Database Operations

**Connection Parameters:**

- Host: localhost (Windows) or Docker IP (WSL)
- Port: 5432
- Database: jobtracker
- Username: jobtracker
- Password: jobtracker
- Auth Method: scram-sha-256

**Management Operations:**

```bash
# Access PostgreSQL CLI
docker-compose exec db psql -U jobtracker

# Backup database
docker-compose exec db pg_dump -U jobtracker jobtracker > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U jobtracker jobtracker
```

## Troubleshooting Guide

### Debugging Commands

```bash
# Check container logs
docker-compose logs [service_name]

# Inspect container
docker-compose exec [service_name] sh

# Check network connectivity
docker network inspect job-tracker_default
```

## Security Considerations

### Development Environment

1. Default credentials are for development only
2. Ports are exposed for local access
3. Debug mode is enabled
4. Source code is mounted for hot-reload
