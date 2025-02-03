from pydantic import BaseModel, EmailStr
from typing import Optional


class NetworkContactBase(BaseModel):
    """Base model for network contacts"""
    name: str
    role: str
    company: str
    linkedin: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class NetworkContactCreate(NetworkContactBase):
    """Model for creating a new contact."""
    pass


class NetworkContactResponse(NetworkContactBase):
    """Response model for returning contacts (includes id)."""
    id: int
