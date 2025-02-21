CREATE_USER = """
INSERT INTO users (username, email, password_hash)
VALUES (%s, %s, %s)
RETURNING id, username, email, created_at;
"""

GET_USER_BY_EMAIL = """
SELECT * FROM users WHERE email = %s;
"""

FIND_USER = """
SELECT * FROM users WHERE email = %s;
"""

UPDATE_USER_SKILLS = """
UPDATE users
SET skills = %s
WHERE email = %s
"""
