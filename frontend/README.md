# Job Tracker Frontend

## Overview

The frontend application for the Job Tracker project, built with React and Vite. This service provides the user interface for managing job applications, tracking application status, and managing professional contacts.

## Technology Stack

- React 18.3: Core UI framework
- Vite: Build tool and development server
- ESLint: Code quality and style enforcement
- Docker: Development environment containerization

## Local Development Setup

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose

### Environment Configuration

The frontend service uses the following environment variables:
VITE_API_URL=http://localhost:8000

### Running the Service

Using Docker (recommended):
docker-compose up frontend

Direct development:
npm install
npm run dev

### Available Scripts

- npm run dev: Start development server
- npm run build: Build for production
- npm run preview: Preview production build locally

## Project Structure

frontend/
├── Dockerfile.dev # Development container configuration
├── eslint.config.js # ESLint configuration
├── index.html # HTML entry point
├── package.json # Project dependencies and scripts
├── public/ # Static assets
├── src/ # Application source code
│ ├── App.jsx # Root component
│ ├── App.css # Root styles
│ ├── main.jsx # Application entry point
│ ├── assets/ # Project assets
│ └── index.css # Global styles
└── vite.config.js # Vite configuration

## Development Guidelines

### Code Style

- Follow ESLint configuration guidelines
- Use functional components with hooks
- Implement proper prop-types validation
- Follow React best practices for component organization
- Use CSS modules for component-specific styles

### Component Structure

1. Place new components in appropriate directories
2. Include proper JSDoc documentation
3. Maintain single responsibility principle
4. Add proper error boundaries
5. Implement loading states

### State Management

- Use React hooks for local state
- Implement proper data fetching patterns
- Handle loading and error states
- Use appropriate caching strategies

### API Integration

Backend API available at:

- Development: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Deployment

1. Build the application: npm run build
2. Test the production build: npm run preview
3. Deploy the contents of the dist directory
