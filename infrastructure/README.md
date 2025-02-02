# Job Tracker Infrastructure

## Overview

The infrastructure configuration provides a containerized development environment using Docker and Docker Compose. This setup ensures consistency across development environments and simplifies the deployment process.

## Architecture Components

### Services

1. **Frontend Service (React/Vite)**
   - Node.js 18 Alpine-based
   - Development server with hot-reload
   - Port: 5173
   - Volume-mounted source code
   - Tailwind CSS configuration

2. **Backend Service (FastAPI)**
   - Python 3.12 slim-based
   - Auto-reloading development server
   - Port: 8000
   - Volume-mounted source code
   - Database connection configuration

3. **Database Service (PostgreSQL)**
   - Alpine-based PostgreSQL 14
   - Port: 5432
   - Persistent data storage
   - Health monitoring
   - Initialization scripts

## Getting Started

### Prerequisites

- Docker Desktop 4.0+ with WSL 2 backend
- Docker Compose 2.0+
- Modern terminal (WSL recommended for Windows)
- Git for version control

### Environment Setup

1. Navigate to the infrastructure/docker directory
2. Create necessary environment files
3. Run the development environment:
   ```bash
   docker-compose up --build
   ```

### Service Access Points

After startup, services are available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Database: localhost:5432

## Configuration Management

### Environment Variables

**Frontend Service:**
```env
VITE_API_URL=http://localhost:8000
```

**Backend Service:**
```env
DATABASE_URL=postgresql://jobtracker:jobtracker@db:5432/jobtracker
SECRET_KEY=development_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
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

### Starting Services

```bash
# Start all services
docker-compose up --build

# Start specific service
docker-compose up frontend --build

# Start services in background
docker-compose up -d
```

### Monitoring and Maintenance

```bash
# View logs for all services
docker-compose logs

# View logs for specific service
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

## Container Configuration

### Frontend Container

- Base Image: node:18-alpine
- Working Directory: /app
- Volume Mounts:
  - Source code
  - Node modules
- Port: 5173
- Environment: Development
- Hot Reload: Enabled

### Backend Container

- Base Image: python:3.12-slim
- Working Directory: /app
- Volume Mounts:
  - Source code
- Port: 8000
- Environment: Development
- Auto Reload: Enabled

### Database Container

- Base Image: postgres:14-alpine
- Volume Mounts:
  - Data directory
  - Init scripts
- Port: 5432
- Health Check: Enabled

## Troubleshooting Guide

### Common Issues

1. Port Conflicts
```bash
# Check for port usage
lsof -i :5173
lsof -i :8000
lsof -i :5432
```

2. Volume Permissions
```bash
# Fix volume permissions
sudo chown -R $(id -u):$(id -g) ./postgres_data
```

3. Network Issues
```bash
# Check Docker networks
docker network ls
docker network inspect job-tracker_default
```

### Debug Commands

```bash
# Check container logs
docker-compose logs [service_name]

# Inspect container
docker-compose exec [service_name] sh

# Check resource usage
docker stats

# Validate compose file
docker-compose config
```

### Database Backups

1. Automated backups:
```bash
# Create cron job for backup
0 0 * * * docker-compose exec db pg_dump -U jobtracker jobtracker > backup_$(date +%Y%m%d).sql
```

2. Manual backups:
```bash
# Backup with timestamp
docker-compose exec db pg_dump -U jobtracker jobtracker > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Volume Backups

```bash
# Backup Docker volume
docker run --rm -v job-tracker_postgres_data:/volume -v $(pwd):/backup alpine tar cvf /backup/postgres_data.tar /volume
```