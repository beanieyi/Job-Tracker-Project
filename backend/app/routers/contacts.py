from app.utils.jwt_manager import get_current_user
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.database import get_db_connection
from app.queries.contacts import (
    DELETE_CONTACT,
    GET_ALL_CONTACTS,
    GET_CONTACT_BY_ID,
    INSERT_CONTACT,
    UPDATE_CONTACT,
)
from app.models.contacts import NetworkContactCreate, NetworkContactResponse

router = APIRouter(prefix="/api", tags=["Contacts"])


@router.get("/contacts", response_model=List[NetworkContactResponse])
async def get_contacts(current_user: str = Depends(get_current_user)):
    """Retrieve all contacts"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(GET_ALL_CONTACTS, (current_user,))
            contacts = cur.fetchall()

    return contacts


@router.get("/contacts/{contact_id}", response_model=NetworkContactResponse)
async def get_contact(contact_id: int, current_user: str = Depends(get_current_user)):
    """Retrieve a specific contact"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(GET_CONTACT_BY_ID, (contact_id, current_user))
            contact = cur.fetchone()

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found or unauthorized")

    return contact


@router.post("/contacts", response_model=NetworkContactResponse)
async def create_contact(
    contact: NetworkContactCreate, current_user: str = Depends(get_current_user)
):
    """Create a new contact"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                INSERT_CONTACT,
                (
                    current_user,
                    contact.name,
                    contact.role,
                    contact.company,
                    contact.linkedin,
                    contact.email,
                    contact.phone,
                ),
            )

            new_contact = cur.fetchone()
            conn.commit()

    return new_contact


@router.put("/contacts/{contact_id}", response_model=NetworkContactResponse)
async def update_contact(
    contact_id: int,
    contact_update: NetworkContactCreate,
    current_user: str = Depends(get_current_user),
):
    """Update an existing contact"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(GET_CONTACT_BY_ID, (contact_id, current_user))
            existing_contact = cur.fetchone()

            if not existing_contact:
                raise HTTPException(
                    status_code=404, detail="Contact not found or unauthorized"
                )

            cur.execute(
                UPDATE_CONTACT,
                (
                    contact_update.name,
                    contact_update.role,
                    contact_update.company,
                    contact_update.linkedin,
                    contact_update.email,
                    contact_update.phone,
                    contact_id,
                    current_user,
                ),
            )
            updated_contact = cur.fetchone()
            conn.commit()

    return updated_contact


@router.delete("/contacts/{contact_id}")
async def delete_contact(
    contact_id: int, current_user: str = Depends(get_current_user)
):
    """Delete a contact"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(GET_CONTACT_BY_ID, (contact_id, current_user))
            existing_contact = cur.fetchone()

            if not existing_contact:
                raise HTTPException(
                    status_code=404, detail="Contact not found or unauthorized"
                )

            cur.execute(DELETE_CONTACT, (contact_id, current_user))
            conn.commit()

    return {"message": "Contact deleted successfully"}
