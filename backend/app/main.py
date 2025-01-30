# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import applications, contacts, auth

# Initialize FastAPI application
app = FastAPI(title="Job Tracker API")

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(contacts.router)
app.include_router(applications.router)


@app.get("/")
async def read_root():
    """Root endpoint to verify API status"""
    return {"status": "online", "message": "Welcome to the Job Tracker API"}
