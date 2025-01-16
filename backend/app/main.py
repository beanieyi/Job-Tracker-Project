from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

class JobApplication(BaseModel):
    id: int
    company_name: str
    position_title: str
    application_date: datetime
    status: str
    location: str | None
    salary_range: str | None
    notes: str | None

app = FastAPI(title="Job Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"status": "online", "message": "Welcome to the Job Tracker API"}

@app.get("/api/applications", response_model=List[JobApplication])
async def get_applications():
    try:
        conn = psycopg2.connect(
            "postgresql://jobtracker:jobtracker@db:5432/jobtracker"
        )
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM job_applications ORDER BY application_date DESC")
        applications = cur.fetchall()
        cur.close()
        conn.close()
        return applications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))