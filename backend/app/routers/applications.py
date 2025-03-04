from app.models.timelines import ApplicationTimelineCreate, ApplicationTimelineResponse
from app.queries.timelines import (
    DELETE_APPLICATION_TIMELINE,
    GET_APPLICATION_TIMELINE,
    INSERT_APPLICATION_TIMELINE,
    UPDATE_APPLICATION_TIMELINE,
)
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.database import get_db_connection
from app.queries.applications import (
    DELETE_JOB_APPLICATION,
    GET_JOB_APPLICATION_BY_ID,
    GET_JOB_APPLICATIONS,
    INSERT_JOB_APPLICATION,
    UPDATE_JOB_APPLICATION,
)
from app.models.applications import JobApplicationCreate, JobApplicationResponse
from app.config import settings
from app.utils.jwt_manager import get_current_user

router = APIRouter(prefix="/api", tags=["Applications"])


@router.get("/applications", response_model=List[JobApplicationResponse])
async def get_applications(current_user: str = Depends(get_current_user)):
    """Retrieve all job applications from the database"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(GET_JOB_APPLICATIONS, (current_user,))
            jobs = cur.fetchall()

    return jobs


@router.get("/applications/{job_id}", response_model=dict)
async def get_job_application(
    job_id: int, current_user: str = Depends(get_current_user)
):
    """Retrieve a specific job application"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(GET_JOB_APPLICATION_BY_ID, (job_id, current_user))
            job = cur.fetchone()

            if not job:
                raise HTTPException(
                    status_code=404, detail="Job application not found or unauthorized"
                )
            
            # Fetch application timeline
            cur.execute(GET_APPLICATION_TIMELINE, (job_id,))
            timeline = cur.fetchall()

            

    return {"job_application": job, "timeline": timeline}


@router.post("/applications", response_model=JobApplicationResponse)
async def create_job_application(
    job: JobApplicationCreate, current_user: str = Depends(get_current_user)
):
    """Create a new job application and automatically insert the first timeline entry"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT skills FROM users WHERE email = %s",
                        (current_user,))
            user_record = cur.fetchone()
            user_skills = user_record["skills"] or []
            matched_skills = list(set(user_skills) & set(job.required_skills))
            cur.execute(
                INSERT_JOB_APPLICATION,
                (
                    current_user,
                    job.company,
                    job.position,
                    job.status,
                    job.date,
                    job.priority,
                    matched_skills,
                    job.required_skills,
                ),
            )
            new_job = cur.fetchone()
            job_id = new_job["id"]

            cur.execute(INSERT_APPLICATION_TIMELINE, (job_id, job.status, "applied"))

            conn.commit()

    return new_job


@router.put("/applications/{job_id}", response_model=JobApplicationResponse)
async def update_job_application(
    job_id: int,
    job_update: JobApplicationCreate,
    current_user: str = Depends(get_current_user),
):
    """Update a job application"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                "SELECT * FROM job_applications WHERE id = %s AND user_email = %s",
                (job_id, current_user),
            )
            existing_job = cur.fetchone()

            if not existing_job:
                raise HTTPException(
                    status_code=404, detail="Job application not found or unauthorized"
                )

            cur.execute(
                UPDATE_JOB_APPLICATION,
                (
                    job_update.company,
                    job_update.position,
                    job_update.status,
                    job_update.date,
                    job_update.priority,
                    job_update.matched_skills,
                    job_update.required_skills,
                    job_id,
                    current_user,
                ),
            )

            conn.commit()
            cur.execute(
                "SELECT id, company, position, status, date, priority, matched_skills, required_skills, user_email FROM job_applications WHERE id = %s",
                (job_id,),
            )
            updated_job = cur.fetchone()

    return updated_job


@router.delete("/applications/{job_id}")
async def delete_job_application(
    job_id: int, current_user: str = Depends(get_current_user)
):
    """Delete a job application (also deletes associated timeline entries)"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                "SELECT * FROM job_applications WHERE id = %s AND user_email = %s",
                (job_id, current_user),
            )
            existing_job = cur.fetchone()

            if not existing_job:
                raise HTTPException(
                    status_code=404, detail="Job application not found or unauthorized"
                )

            cur.execute(DELETE_JOB_APPLICATION, (job_id, current_user))
            conn.commit()

    return {"message": "Job application and its timeline entries deleted successfully"}


@router.get(
    "/applications/{job_id}/timeline", response_model=List[ApplicationTimelineResponse]
)
async def get_application_timeline(
    job_id: int, current_user: str = Depends(get_current_user)
):
    """Retrieve timeline entries for a job application"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(GET_JOB_APPLICATION_BY_ID, (job_id, current_user))
            job = cur.fetchone()

            if not job:
                raise HTTPException(
                    status_code=404, detail="Job application not found or unauthorized"
                )

            cur.execute(GET_APPLICATION_TIMELINE, (job_id,))
            timeline_entries = cur.fetchall()

    return timeline_entries


@router.post(
    "/applications/{job_id}/timeline", response_model=ApplicationTimelineResponse
)
async def add_timeline_entry(
    job_id: int,
    timeline_entry: ApplicationTimelineCreate,
    current_user: str = Depends(get_current_user),
):
    """Add a new timeline entry for a job application."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(GET_JOB_APPLICATION_BY_ID, (job_id, current_user))
            job = cur.fetchone()

            if not job:
                raise HTTPException(
                    status_code=404, detail="Job application not found or unauthorized"
                )

            cur.execute(
                INSERT_APPLICATION_TIMELINE,
                (job_id, timeline_entry.status, timeline_entry.notes),
            )
            conn.commit()

    return {"message": "Timeline entry added successfully"}


@router.put(
    "/applications/{job_id}/timeline/{timeline_id}",
    response_model=ApplicationTimelineResponse,
)
async def update_timeline_entry(
    job_id: int,
    timeline_id: int,
    timeline_update: ApplicationTimelineCreate,
    current_user: str = Depends(get_current_user),
):
    """Update a timeline entry for a job application"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                "SELECT * FROM application_timeline WHERE id = %s AND application_id = %s",
                (timeline_id, job_id),
            )
            existing_timeline = cur.fetchone()

            if not existing_timeline:
                raise HTTPException(
                    status_code=404, detail="Timeline entry not found or unauthorized"
                )

            cur.execute(
                UPDATE_APPLICATION_TIMELINE,
                (
                    timeline_update.status,
                    timeline_update.date,
                    timeline_update.notes,
                    timeline_id,
                    current_user,
                ),
            )
            updated_timeline = cur.fetchone()
            conn.commit()

    return updated_timeline


@router.delete("/applications/{job_id}/timeline/{timeline_id}")
async def delete_timeline_entry(
    job_id: int, timeline_id: int, current_user: str = Depends(get_current_user)
):
    """Delete a timeline entry"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                "SELECT * FROM application_timeline WHERE id = %s AND application_id = %s",
                (timeline_id, job_id),
            )
            existing_timeline = cur.fetchone()

            if not existing_timeline:
                raise HTTPException(
                    status_code=404, detail="Timeline entry not found or unauthorized"
                )

            cur.execute(DELETE_APPLICATION_TIMELINE, (timeline_id, current_user))
            deleted = cur.fetchone()
            conn.commit()

    if not deleted:
        raise HTTPException(
            status_code=404, detail="Timeline entry not found or already deleted"
        )

    return {"message": "Timeline entry deleted successfully"}
