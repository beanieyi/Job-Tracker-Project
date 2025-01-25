from fastapi import APIRouter, HTTPException
from typing import List
from app.database import get_db_connection
from app.queries.contacts import GET_CONTACTS
from app.models.contacts import NetworkContact

router = APIRouter(prefix="/contacts", tags=["Contacts"])


@router.get("/get_contacts", response_model=List[NetworkContact])
async def get_contacts():
    """Retrieve all network contacts"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(GET_CONTACTS)
        contacts = cur.fetchall()

        cur.close()
        conn.close()
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
