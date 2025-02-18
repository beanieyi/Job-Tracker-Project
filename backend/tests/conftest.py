import os
import sys
import pytest
import psycopg2
from pathlib import Path

# Add the root directory to Python path
root_dir = str(Path(__file__).parent.parent)
sys.path.insert(0, root_dir)

def init_database():
    """Initialize test database with schema"""
    conn = psycopg2.connect(
        dbname="jobtracker",
        user="jobtracker",
        password="jobtracker",
        host="localhost",
        port="5432"
    )
    
    conn.autocommit = True
    with conn.cursor() as cur:
        # Read and execute initialization SQL
        sql_file = os.path.join(root_dir, '..', 'infrastructure', 'docker', 'init.sql')
        with open(sql_file, 'r') as f:
            cur.execute(f.read())
    
    conn.close()

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Fixture to set up test database before any tests run"""
    init_database()
    yield