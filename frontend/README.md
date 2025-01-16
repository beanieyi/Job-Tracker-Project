# Job Tracker Frontend

## Overview

The frontend application for the Job Tracker project provides a modern, responsive user interface for managing job applications, tracking application statuses, and maintaining professional contacts. Built with React and Vite, it offers a seamless experience for job seekers to organize their job search process.

## Technology Stack

- **React 18.3**: Modern UI framework for building component-based interfaces
- **Vite**: Next-generation frontend tooling for faster development and optimized builds
- **ESLint**: Static code analysis tool for identifying problematic patterns
- **Docker**: Container platform for consistent development environments

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose

### Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
VITE_API_URL=http://localhost:8000
```

### Installation and Setup

#### Using Docker (Recommended)

```bash
# Start the frontend service with Docker Compose
docker-compose up frontend
```

#### Direct Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |

## Project Structure

```
frontend/
├── Dockerfile.dev         # Development container configuration
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry point
├── package.json          # Project dependencies and scripts
├── public/               # Static assets
├── src/                  # Application source code
│   ├── App.jsx          # Root component
│   ├── App.css          # Root styles
│   ├── main.jsx         # Application entry point
│   ├── assets/          # Project assets
│   └── index.css        # Global styles
└── vite.config.js       # Vite configuration
```

## Development Guidelines

### Code Style and Standards

- Follow ESLint configuration guidelines
- Use functional components with hooks
- Implement proper prop-types validation
- Follow React best practices for component organization
- Use CSS modules for component-specific styles

### Component Development

1. Place new components in appropriate directories
2. Include JSDoc documentation
3. Maintain single responsibility principle
4. Implement error boundaries
5. Handle loading states appropriately

### State Management Best Practices

- Utilize React hooks for local state
- Implement proper data fetching patterns
- Handle loading and error states comprehensively
- Apply appropriate caching strategies

### API Integration

The backend API is available at:

- Development: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Test the production build:

   ```bash
   npm run preview
   ```

3. Deploy the contents of the `dist` directory to your hosting platform
