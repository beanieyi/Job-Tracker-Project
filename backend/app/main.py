"""
Job Tracker API Backend Service

This module implements the REST API endpoints for the Job Tracker application using FastAPI.
It provides functionality for managing job applications, including retrieval and storage
of application data in a PostgreSQL database.

The API includes CORS middleware configuration for frontend integration and implements
proper error handling for database operations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor


class JobApplication(BaseModel):
    """
    Attributes:
        id (int): Unique identifier for the application
        company_name (str): Name of the company
        position_title (str): Title of the position applied for
        application_date (datetime): Date when the application was submitted
        status (str): Current status of the application
        location (str | None): Location of the job (optional)
        salary_range (str | None): Expected salary range (optional)
        notes (str | None): Additional notes about the application (optional)
    """

    id: int
    company_name: str
    position_title: str
    application_date: datetime
    status: str
    location: str | None
    salary_range: str | None
    notes: str | None


# Initialize FastAPI application
app = FastAPI(title="Job Tracker API")

# Configure CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
async def read_root():
    """
    Root endpoint to verify API status.

    Returns:
        dict: Status message indicating the API is online
    """
    return {"status": "online", "message": "Welcome to the Job Tracker API"}


@app.get("/api/applications", response_model=List[JobApplication])
async def get_applications():
    """
    Retrieve all job applications from the database.

    Returns:
        List[JobApplication]: List of job applications ordered by application date

    Raises:
        HTTPException: If database connection or query fails
    """
    try:
        # Establish database connection
        conn = psycopg2.connect("postgresql://jobtracker:jobtracker@db:5432/jobtracker")

        # Create cursor with dictionary factory for JSON-compatible results
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Execute query to fetch all applications
        cur.execute("SELECT * FROM job_applications ORDER BY application_date DESC")
        applications = cur.fetchall()

        # Clean up database resources
        cur.close()
        conn.close()

        return applications
    except Exception as e:
        # Raise HTTP 500 error if database operation fails
        raise HTTPException(status_code=500, detail=str(e))
