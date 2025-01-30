# backend/app/models/contacts.py

from pydantic import BaseModel, EmailStr
from typing import Optional


class NetworkContact(BaseModel):
    """
    Pydantic model for network contacts
    """

    id: int
    name: str
    role: str
    company: str
    linkedin: str
    email: Optional[str] = None
    phone: Optional[str] = None
