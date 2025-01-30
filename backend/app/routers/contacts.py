# backend/app/routers/contacts.py

from fastapi import APIRouter, HTTPException
from typing import List
from app.database import get_db_connection
from app.models.contacts import NetworkContact
import logging

router = APIRouter(prefix="/api", tags=["Contacts"])


@router.get("/contacts", response_model=List[NetworkContact])
async def get_contacts():
    """Retrieve all network contacts"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT id, name, role, company, linkedin, 
                   email, phone 
            FROM network_contacts 
            ORDER BY name
        """
        )
        contacts = cur.fetchall()

        # Log the results
        logging.info(f"Retrieved {len(contacts)} contacts")
        if contacts:
            logging.info(f"First contact: {contacts[0]}")

        cur.close()
        conn.close()
        return contacts
    except Exception as e:
        logging.error(f"Error in get_contacts: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/role-insights")
async def get_role_insights():
    """Retrieve all role insights"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT role_title, common_skills, average_salary, 
                   demand_trend, top_companies 
            FROM role_insights
        """
        )
        insights = cur.fetchall()

        # Log the results
        logging.info(f"Retrieved {len(insights)} role insights")
        if insights:
            logging.info(f"First insight: {insights[0]}")

        cur.close()
        conn.close()

        # Convert any None values in array fields to empty lists
        for insight in insights:
            if insight["common_skills"] is None:
                insight["common_skills"] = []
            if insight["top_companies"] is None:
                insight["top_companies"] = []

        return insights
    except Exception as e:
        logging.error(f"Error in get_role_insights: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
