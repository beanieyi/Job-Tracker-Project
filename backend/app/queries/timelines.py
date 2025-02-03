GET_APPLICATION_TIMELINE = """
SELECT * FROM application_timeline 
WHERE application_id = %s 
ORDER BY date ASC;
"""

INSERT_APPLICATION_TIMELINE = """
INSERT INTO application_timeline (application_id, status, date, notes)
VALUES (%s, %s, NOW(), %s);
"""

UPDATE_APPLICATION_TIMELINE = """
UPDATE application_timeline
SET status = %s, date = %s, notes = %s
WHERE id = %s RETURNING *;
"""

DELETE_APPLICATION_TIMELINE = """
DELETE FROM application_timeline WHERE id = %s;
"""

CHECK_TIMELINE_ENTRY_EXISTS = """
SELECT * FROM application_timeline WHERE id = %s;
"""

GET_LATEST_TIMELINE_STATUS = """
SELECT * FROM application_timeline
WHERE application_id = %s
ORDER BY date DESC
LIMIT 1;
"""
