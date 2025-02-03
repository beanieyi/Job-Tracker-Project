# Job Tracker Frontend

## Overview

The frontend application provides a modern, responsive user interface for managing job applications, tracking application statuses, and maintaining professional contacts. Built with React and Vite, it offers a seamless experience for job seekers to organize their job search process.

## Technology Stack

- **React 18.3**: Modern UI framework with hooks and functional components
- **Vite 6.0**: Next-generation frontend tooling
- **Material UI 6.4**: Component library and styling
  - Lab Components
  - Material Icons
  - Styled Engine
- **Motion**: Animation library for enhanced UX
- **Headless UI & Heroicons**: Additional UI components and icons
- **ESLint 9.17**: Code quality and style enforcement
- **Emotion & Styled Components**: CSS-in-JS styling solutions

## Features

- Interactive job application dashboard
- Real-time application status updates
- Professional network contact management
- Role insights visualization
- Animated UI transitions
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose (recommended)
- Modern web browser

### Development Setup

#### Using Docker (Recommended)

```bash
# Start the frontend service
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
| `npm run lint`    | Run ESLint               |

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── NavTabs.jsx    # Navigation component
│   ├── App.jsx           # Root component
│   ├── App.css           # Root styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## Development Guidelines

### Code Style

- Follow ESLint configuration
- Use functional components
- Implement proper prop-types
- Follow React best practices
- Use CSS modules for styles

### Component Organization

- One component per file
- Clear component hierarchy
- Proper prop drilling management
- Error boundary implementation
- Loading state handling

### State Management

- Use React hooks appropriately
- Implement proper data fetching
- Handle loading/error states
- Apply caching as needed

### Animation Guidelines

- Use Motion library for transitions
- Keep animations subtle and purposeful
- Ensure accessibility
- Handle reduced motion preferences

## API Integration

The backend API is available at:

- Development: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Key Endpoints

- `/api/applications`: Job application data
- `/api/timelines`: Application status updates
- `/api/contacts`: Network contacts
- `/api/role-insights`: Role analytics

## Environment Configuration

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:8000
```

## Build and Deployment

1. Create production build:

```bash
npm run build
```

2. Test production build:

```bash
npm run preview
```

3. Deploy `dist` directory contents

## Troubleshooting

### Common Issues

1. Port conflicts:

   - Check if port 5173 is available
   - Modify vite.config.js if needed

2. API connection issues:

   - Verify API URL in .env
   - Check CORS configuration

3. Build problems:
   - Clear node_modules and reinstall
   - Check for dependency conflicts

### Development Tools

- React Developer Tools
- Vite Dev Tools
- Browser DevTools

## Contributing

1. Follow the established code style
2. Write meaningful commit messages
3. Create feature branches
4. Test thoroughly
5. Submit pull requests
