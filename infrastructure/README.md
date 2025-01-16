# Job Tracker Infrastructure

## Overview
This directory contains the infrastructure configuration for the Job Tracker application, including Docker configurations for local development and deployment. The infrastructure is designed to provide a consistent development environment across all team members.

## Components
The infrastructure consists of three main services:
- Frontend Service (React/Vite)
- Backend Service (FastAPI)
- Database Service (PostgreSQL)

## Local Development Setup

### Prerequisites
- Docker Desktop with WSL 2 backend
- Docker Compose version 2.0 or higher
- A modern terminal (WSL recommended for Windows users)

### Starting the Environment
From the infrastructure/docker directory:
docker-compose up --build

### Service Access
Once running, services are available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Database: localhost:5432

### Database Connection
When using tools like DBeaver or pgAdmin:
- Host: localhost (Windows) or Docker IP (WSL)
- Port: 5432
- Database: jobtracker
- Username: jobtracker
- Password: jobtracker
- Auth Method: scram-sha-256

### Volume Management
Persistent data is managed through Docker volumes:
- pgdata: PostgreSQL data storage

### Development Workflow
1. Code changes in frontend and backend directories are automatically reflected
2. Database data persists between container restarts
3. Container logs are available via docker-compose logs
4. Environment variables are managed through docker-compose.yml

### Common Commands
docker-compose up --build          # Start all services
docker-compose down -v            # Stop services and remove volumes
docker-compose logs -f           # Follow log output
docker-compose ps                # List running services

### Troubleshooting
1. Database Connection Issues:
   - Verify PostgreSQL container is running
   - Check authentication method configuration
   - Ensure correct connection parameters

2. Frontend/Backend Connection:
   - Verify CORS configuration in backend
   - Check API URL configuration in frontend
   - Ensure all containers are on same network

3. Volume Issues:
   - Clear volumes with docker-compose down -v
   - Verify volume mount permissions
   - Check Docker Desktop WSL integration

### Security Notes
- Development credentials should never be used in production
- Environment variables should be properly secured
- Database ports should be restricted in production