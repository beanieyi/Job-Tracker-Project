"""
Job Tracker API main application module.

This module initializes the FastAPI application and defines the core API endpoints.
The application provides RESTful endpoints for managing job applications and user data.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI application with metadata
app = FastAPI(
    title="Job Tracker API",
    description="API for managing job applications and tracking application status",
    version="1.0.0"
)

# Configure CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Development frontend server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    """
    Root endpoint providing API status information.
    
    Returns:
        dict: Status message indicating API availability
    """
    return {
        "status": "online",
        "message": "Welcome to the Job Tracker API"
    }