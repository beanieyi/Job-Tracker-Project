"""
Job Tracker API main application module.

This module initializes the FastAPI application and defines the core API endpoints.
The application provides RESTful endpoints for managing job applications and user data,
including sample data retrieval for development and testing purposes.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor


# Define the data model for job applications
class JobApplication(BaseModel):
    """
    Represents a job application in the system.

    Attributes:
        id: Unique identifier for the application
        company_name: Name of the company
        position_title: Title of the position applied for
        application_date: When the application was submitted
        status: Current status of the application
        location: Location of the job (optional)
        salary_range: Expected salary range (optional)
        notes: Additional notes about the application (optional)
    """

    id: int
    company_name: str
    position_title: str
    application_date: datetime
    status: str
    location: str | None
    salary_range: str | None
    notes: str | None


# Initialize FastAPI application with metadata
app = FastAPI(
    title="Job Tracker API",
    description="API for managing job applications and tracking application status",
    version="1.0.0",
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
    return {"status": "online", "message": "Welcome to the Job Tracker API"}


@app.get("/api/applications", response_model=List[JobApplication])
async def get_applications():
    """
    Retrieve all job applications from the database.

    Returns:
        List[JobApplication]: List of all job applications

    Raises:
        HTTPException: If database connection fails or query errors occur
    """
    try:
        # Establish database connection
        conn = psycopg2.connect("postgresql://jobtracker:jobtracker@db:5432/jobtracker")
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Execute query and fetch results
        cur.execute("SELECT * FROM job_applications ORDER BY application_date DESC")
        applications = cur.fetchall()

        # Clean up database resources
        cur.close()
        conn.close()

        return applications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
