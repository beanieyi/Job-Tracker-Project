# Job Tracker Application

## Overview

The Job Tracker Application enables users to:

- Manage job applications through a centralized dashboard
- Track application status changes and progress
- Maintain records of professional networking contacts
- Generate insights about application patterns and outcomes
- Access information securely from any modern web browser

## Technical Architecture

The application implements a modern three-tier architecture designed for scalability and maintainability:

### Frontend Layer

The presentation layer utilizes React 18 with Vite, delivering:

- Single-page application architecture for smooth user interactions
- Responsive design supporting multiple device formats
- Real-time updates through efficient state management
- Optimized development workflow with hot module replacement

### Backend Layer

The service layer leverages FastAPI, providing:

- RESTful API endpoints with comprehensive documentation
- Type-safe request and response handling
- Efficient database operations
- Robust error handling and validation

### Data Layer

PostgreSQL serves as the data persistence layer, ensuring:

- Reliable data storage with ACID compliance
- Efficient query performance
- Data integrity through proper constraints
- Backup and recovery capabilities

## Development Setup

### System Requirements

- Docker Desktop
- Git

### Initial Setup

1. Clone the repository:

```bash
git clone https://github.com/beanieyi/Job-Tracker-Project.git
cd job-tracker
```

2. Start the development environment:

```bash
cd infrastructure/docker
````

3. Access the application:

- Frontend: http://localhost:5173
- API Documentation: http://localhost:8000/docs
- Database: localhost:5432

### Development Workflow

The project follows a containerized development approach, with services automatically reloading when code changes are detected. Source code is organized into three main directories:

- `frontend/`: React application code and assets
- `backend/`: FastAPI service implementation
- `infrastructure/`: Docker and deployment configurations

## Project Structure

```
job-tracker/
├── frontend/             # React frontend application
│   ├── src/             # Application source code
│   ├── public/          # Static assets
│   └── Dockerfile.dev   # Development container configuration
├── backend/             # FastAPI backend service
│   ├── app/             # Application package
│   └── Dockerfile.dev   # Development container configuration
└── infrastructure/      # Deployment and container configurations
    └── docker/          # Docker Compose and related files
```

## Configuration Management

Each component maintains its own configuration files:

- Frontend: Environment variables for API endpoints
- Backend: Database connections and security settings
- Infrastructure: Docker Compose service definitions

## Support and Documentation

Detailed documentation is available in component-specific README files:

- Frontend documentation: [frontend/README.md](frontend/README.md)
- Backend documentation: [backend/README.md](backend/README.md)
- Infrastructure documentation: [infrastructure/README.md](infrastructure/README.md)
