# This is our FastAPI application entry point. It sets up a basic API endpoint
# that we can use to verify our backend is working correctly.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create the FastAPI application instance
app = FastAPI(title="Job Tracker API")

# Configure CORS to allow requests from our frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # This is where our Vite frontend will run
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A simple endpoint to test that our API is working
@app.get("/")
async def read_root():
    return {
        "status": "online",
        "message": "Welcome to the Job Tracker API"
    }