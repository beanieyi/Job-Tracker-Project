from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class JobApplicationBase(BaseModel):
    """
    Pydantic model for job applications
    """
    company: str
    position: str
    status: str
    date: date
    priority: str
    matched_skills: Optional[List[str]] = []
    required_skills: Optional[List[str]] = []


class JobApplicationCreate(JobApplicationBase):
    """
    Model for creating a new job application.
    """
    pass


class JobApplicationResponse(JobApplicationBase):
    """
    Response model for job applications (includes id).
    """
    id: int
