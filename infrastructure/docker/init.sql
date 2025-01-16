-- Initialize job applications table
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    position_title VARCHAR(200) NOT NULL,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    salary_range VARCHAR(100),
    application_link VARCHAR(500),
    notes TEXT
);

-- Insert sample job applications
INSERT INTO job_applications (company_name, position_title, status, location, salary_range, notes) VALUES
    ('TechCorp Industries', 'Senior Software Engineer', 'Applied', 'Seattle, WA', '$120k - $150k', 'Applied through company website. Following up in one week.'),
    ('DataDrive Solutions', 'Full Stack Developer', 'Interview Scheduled', 'Remote', '$95k - $120k', 'Technical interview scheduled for next Tuesday'),
    ('Cloud Systems Inc', 'Backend Developer', 'Second Interview', 'Portland, OR', '$100k - $130k', 'Second round with team lead'),
    ('Innovative Software', 'Frontend Engineer', 'Offer Received', 'San Francisco, CA', '$130k - $160k', 'Reviewing offer package'),
    ('Tech Startups United', 'DevOps Engineer', 'Initial Screen', 'Austin, TX', '$90k - $120k', 'HR screening call scheduled');