from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ApplicationTimelineBase(BaseModel):
    """
    Base model for application timeline entries.
    """
    status: str
    date: Optional[datetime] = datetime.now()
    notes: Optional[str] = None


class ApplicationTimelineCreate(ApplicationTimelineBase):
    """
    Model for creating a new timeline entry.
    Requires `application_id` for linking to a job application.
    """
    application_id: int


class ApplicationTimelineResponse(ApplicationTimelineBase):
    """
    Response model for timeline entries (includes `id`).
    """
    id: int
    application_id: int
