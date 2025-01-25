from fastapi import APIRouter, HTTPException
from typing import List
from app.database import get_db_connection
from app.queries.applications import GET_JOB_APPLICATIONS
from app.models.applications import JobApplication
from app.config import settings

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.get("/get_applications", response_model=List[JobApplication])
async def get_applications():
    """Retrieve all job applications from the database"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(GET_JOB_APPLICATIONS)
        applications = cur.fetchall()
        cur.close()
        conn.close()
        return applications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
