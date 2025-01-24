import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Helper function to create database connection"""
    return psycopg2.connect(
        "postgresql://jobtracker:jobtracker@db:5432/jobtracker",
        cursor_factory=RealDictCursor,
    )