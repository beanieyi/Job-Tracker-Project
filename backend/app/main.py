"""
Job Tracker API Backend Service
This module implements the REST API endpoints for the Job Tracker application using FastAPI.
"""
from app.routers import auth, contacts, applications
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from datetime import date, datetime
# import psycopg2
# from psycopg2.extras import RealDictCursor
from app.database import get_db_connection


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
    linkedin: str
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
app.include_router(contacts.router)
app.include_router(applications.router)






@app.get("/api/timelines", response_model=List[TimelineEntry])
async def get_timelines():
    """Retrieve all timeline entries"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT id, application_id, status, date, notes 
                FROM application_timeline 
                ORDER BY date DESC
            """
            )
            timelines = cur.fetchall()

    return timelines



@app.get("/api/role-insights", response_model=List[RoleInsight])
async def get_role_insights():
    """Retrieve all role insights"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT role_title, common_skills, average_salary, 
                    demand_trend, top_companies 
                FROM role_insights
            """
            )
            insights = cur.fetchall()

    return insights
