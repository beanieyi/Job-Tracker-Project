# backend/app/routers/applications.py

from fastapi import APIRouter, HTTPException
from typing import List
from app.database import get_db_connection
from app.models.applications import JobApplication

# Create the router instance
router = APIRouter(prefix="/api", tags=["Applications"])


@router.get("/applications", response_model=List[JobApplication])
async def get_applications():
    """Retrieve all job applications with their timelines"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Get applications with their timeline information
        cur.execute(
            """
            WITH timeline_info AS (
                SELECT 
                    application_id,
                    bool_or(status = 'Final Interview') as had_final_interview,
                    bool_or(status = 'Technical Interview') as had_technical
                FROM application_timeline
                GROUP BY application_id
            )
            SELECT 
                ja.*,
                COALESCE(ti.had_final_interview, false) as had_final_interview,
                COALESCE(ti.had_technical, false) as had_technical
            FROM job_applications ja
            LEFT JOIN timeline_info ti ON ja.id = ti.application_id
            ORDER BY ja.date DESC
            """
        )

        applications = cur.fetchall()
        cur.close()
        conn.close()
        return applications

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
