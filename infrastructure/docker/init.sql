-- Job Tracker Database Initialization Script
-- This script creates the initial database schema and populates it with sample data
-- It runs automatically when the database container first starts

-- Initialize job applications table with comprehensive fields
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,                        -- Unique identifier for each application
    company_name VARCHAR(200) NOT NULL,           -- Company name (required)
    position_title VARCHAR(200) NOT NULL,         -- Job title (required)
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the application was submitted
    status VARCHAR(50) NOT NULL,                  -- Current application status
    location VARCHAR(100),                        -- Job location (optional)
    salary_range VARCHAR(100),                    -- Expected salary range (optional)
    application_link VARCHAR(500),                -- Link to job posting or application
    notes TEXT                                    -- Additional notes about the application
);

-- Insert sample job applications for testing and demonstration
INSERT INTO job_applications (company_name, position_title, status, location, salary_range, notes) VALUES
    ('TechCorp Industries', 'Senior Software Engineer', 'Applied', 'Seattle, WA', '$120k - $150k', 'Applied through company website. Following up in one week.'),
    ('DataDrive Solutions', 'Full Stack Developer', 'Interview Scheduled', 'Remote', '$95k - $120k', 'Technical interview scheduled for next Tuesday'),
    ('Cloud Systems Inc', 'Backend Developer', 'Second Interview', 'Portland, OR', '$100k - $130k', 'Second round with team lead'),
    ('Innovative Software', 'Frontend Engineer', 'Offer Received', 'San Francisco, CA', '$130k - $160k', 'Reviewing offer package'),
    ('Tech Startups United', 'DevOps Engineer', 'Initial Screen', 'Austin, TX', '$90k - $120k', 'HR screening call scheduled');