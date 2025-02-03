GET_JOB_APPLICATIONS = """
SELECT * FROM job_applications WHERE user_email = %s
"""

GET_JOB_APPLICATION_BY_ID = """
SELECT * FROM job_applications WHERE id = %s AND user_email = %s
"""

INSERT_JOB_APPLICATION = """
INSERT INTO job_applications (user_email, company, position, status, date, priority, matched_skills, required_skills)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *;
"""

UPDATE_JOB_APPLICATION = """
UPDATE job_applications
SET company = %s, position = %s, status = %s, date = %s, priority = %s, matched_skills = %s, required_skills = %s
WHERE id = %s AND user_email = %s RETURNING *;
"""

DELETE_JOB_APPLICATION = """
DELETE FROM job_applications WHERE id = %s AND user_email = %s;
"""

GET_APPLICATION_STATUS_SUMMARY = """
SELECT status, COUNT(*) as count
FROM job_applications
WHERE user_email = %s
GROUP BY status
ORDER BY count DESC;
"""
