import psycopg2
from psycopg2.extras import RealDictCursor
from app.config import settings
from contextlib import closing

def get_db_connection():
    """Helper function to create database connection"""
    return closing(psycopg2.connect(
        settings.DATABASE_URL,
        cursor_factory=RealDictCursor,
    ))