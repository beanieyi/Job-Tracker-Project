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

### Frontend Layer (React 18.3)

- Single-page application architecture with hot module replacement
- Material UI 6.4 for consistent, responsive design
- Motion library for enhanced user interactions
- Efficient state management for real-time updates
- ESLint 9.17 for code quality

### Backend Layer (FastAPI 0.109.0)

- RESTful API endpoints with automatic OpenAPI documentation
- JWT-based authentication system
- Pydantic 2.5.3 for request/response validation
- Comprehensive error handling
- Type-safe operations

### Data Layer (PostgreSQL 14)

- ACID-compliant data storage
- Efficient query performance
- Data integrity through constraints
- Proper indexing and optimization
- Backup and recovery support

## Quick Start

### Prerequisites

- Docker Desktop 4.0+ with WSL 2
- Git
- Modern web browser

### Initial Setup

1. Clone the repository:

```bash
git clone https://github.com/beanieyi/Job-Tracker-Project.git
cd job-tracker
```

2. Start the development environment:

```bash
cd infrastructure/docker
docker-compose up --build
```

3. Access the application:

- Frontend Dashboard: http://localhost:5173
- API Documentation: http://localhost:8000/docs
- Database: localhost:5432

## Project Structure

```
job-tracker/
├── frontend/                 # React frontend application
│   ├── src/                 # Application source code
│   │   ├── components/      # React components
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Dependencies and scripts
│   └── vite.config.js      # Vite configuration
├── backend/                 # FastAPI backend service
│   ├── app/                # Application package
│   │   ├── routers/        # API endpoints
│   │   ├── models/         # Data models
│   │   ├── queries/        # SQL queries
│   │   └── utils/          # Helper functions
│   └── requirements.txt    # Python dependencies
└── infrastructure/         # Deployment configurations
    └── docker/            # Docker related files
        ├── docker-compose.yml
        └── init.sql       # Database initialization
```

## Component Documentation

Each component has its own detailed documentation:

- [Frontend Documentation](frontend/README.md)

  - React components and state management
  - Development workflow
  - Available scripts

- [Backend Documentation](backend/README.md)

  - API endpoints and authentication
  - Database models
  - Development guidelines

- [Infrastructure Documentation](infrastructure/README.md)
  - Docker configuration
  - Development environment
  - Database management
