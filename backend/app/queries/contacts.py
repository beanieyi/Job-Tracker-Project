INSERT_CONTACT = """
INSERT INTO network_contacts (user_email, name, role, company, linkedin, email, phone)
VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *;
"""

GET_ALL_CONTACTS = """
SELECT * FROM network_contacts WHERE user_email = %s;
"""

GET_CONTACT_BY_ID = """
SELECT * FROM network_contacts WHERE id = %s AND user_email = %s;
"""

UPDATE_CONTACT = """
UPDATE network_contacts
SET name = %s, role = %s, company = %s, linkedin = %s, email = %s, phone = %s
WHERE id = %s AND user_email = %s RETURNING *;
"""

DELETE_CONTACT = """
DELETE FROM network_contacts WHERE id = %s AND user_email = %s;
"""
