"""
Job Tracker API Backend Service
This module implements the REST API endpoints for the Job Tracker application using FastAPI.
"""
from app.routers import auth
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from datetime import date, datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from app.database import get_db_connection

class User(BaseModel):
    """
    Pydantic model for users
    """
    id: int
    email: str
    password: str
    skills: List[str]
    name: str
    
class JobApplication(BaseModel):
    """
    Pydantic model for job applications matching our new schema
    """

    id: int
    company: str
    position: str
    status: str
    date: date
    priority: str
    matched_skills: List[str]
    required_skills: List[str]


class TimelineEntry(BaseModel):
    """
    Pydantic model for timeline entries
    """

    id: int
    application_id: int
    status: str
    date: datetime
    notes: Optional[str]


class NetworkContact(BaseModel):
    """
    Pydantic model for network contacts
    """

    id: int
    name: str
    role: str
    company: str
    connection: str
    last_contact: date
    email: Optional[str]
    phone: Optional[str]


class RoleInsight(BaseModel):
    """
    Pydantic model for role insights
    """

    role_title: str
    common_skills: List[str]
    average_salary: str
    demand_trend: str
    top_companies: List[str]


# Initialize FastAPI application
app = FastAPI(title="Job Tracker API")

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# def get_db_connection():
#     """Helper function to create database connection"""
#     return psycopg2.connect(
#         "postgresql://jobtracker:jobtracker@db:5432/jobtracker",
#         cursor_factory=RealDictCursor,
#     )
app.include_router(auth.router)

@app.get("/")
async def read_root():
    """Root endpoint to verify API status"""
    return {"status": "online", "message": "Welcome to the Job Tracker API"}


@app.get("/api/applications", response_model=List[JobApplication])
async def get_applications():
    """Retrieve all job applications from the database"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT id, company, position, status, date, priority, 
                   matched_skills, required_skills 
            FROM job_applications 
            ORDER BY date DESC
        """
        )
        applications = cur.fetchall()

        cur.close()
        conn.close()
        return applications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/timelines", response_model=List[TimelineEntry])
async def get_timelines():
    """Retrieve all timeline entries"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT id, application_id, status, date, notes 
            FROM application_timeline 
            ORDER BY date DESC
        """
        )
        timelines = cur.fetchall()

        cur.close()
        conn.close()
        return timelines
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/contacts", response_model=List[NetworkContact])
async def get_contacts():
    """Retrieve all network contacts"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT id, name, role, company, connection, 
                   last_contact, email, phone 
            FROM network_contacts 
            ORDER BY last_contact DESC
        """
        )
        contacts = cur.fetchall()

        cur.close()
        conn.close()
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/role-insights", response_model=List[RoleInsight])
async def get_role_insights():
    """Retrieve all role insights"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT role_title, common_skills, average_salary, 
                   demand_trend, top_companies 
            FROM role_insights
        """
        )
        insights = cur.fetchall()

        cur.close()
        conn.close()
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
