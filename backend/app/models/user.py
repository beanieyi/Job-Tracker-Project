from pydantic import BaseModel, EmailStr
from typing import List


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginUser(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    """
    Pydantic model for users
    """
    id: int
    email: str
    password: str
    skills: List[str]

class UserSkills(BaseModel):
    """
    Pydantic model for updating user skills
    """
    skills: List[str]
