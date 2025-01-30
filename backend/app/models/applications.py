# backend/app/models/applications.py

from pydantic import BaseModel
from datetime import date
from typing import List


class JobApplication(BaseModel):
    """
    Pydantic model for job applications
    """

    id: int
    company: str
    position: str
    status: str
    date: date
    priority: str
    matched_skills: List[str]
    required_skills: List[str]
