-- PostgreSQL initialization script for Job Tracker application
-- Begin transaction to ensure all operations succeed or none do
BEGIN;

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS application_timeline CASCADE;
DROP TABLE IF EXISTS network_contacts CASCADE;
DROP TABLE IF EXISTS role_insights CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;

-- Create job applications table with expanded tracking fields
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    company VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    matched_skills TEXT[], -- Array of matched skills
    required_skills TEXT[] -- Array of required skills
);

-- Create application timeline table for detailed status tracking
CREATE TABLE application_timeline (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES job_applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    date TIMESTAMP NOT NULL,
    notes TEXT
);

-- Create network contacts table
CREATE TABLE network_contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    company VARCHAR(200) NOT NULL,
    connection VARCHAR(100) NOT NULL,
    last_contact DATE NOT NULL,
    email VARCHAR(200),
    phone VARCHAR(20)
);

-- Create role insights table
CREATE TABLE role_insights (
    role_title VARCHAR(100) PRIMARY KEY,
    common_skills TEXT[],
    average_salary VARCHAR(50),
    demand_trend VARCHAR(50),
    top_companies TEXT[]
);

-- Create index on commonly queried fields
CREATE INDEX idx_applications_date ON job_applications(date DESC);
CREATE INDEX idx_applications_status ON job_applications(status);
CREATE INDEX idx_timeline_application_id ON application_timeline(application_id);
CREATE INDEX idx_timeline_date ON application_timeline(date DESC);

-- Insert ALL job applications
INSERT INTO job_applications (id, company, position, status, date, priority, matched_skills, required_skills) VALUES
(1, 'Tech Corp', 'Frontend Developer', 'Offer', '2025-01-15', 'High', 
    ARRAY['React', 'TypeScript'], 
    ARRAY['React', 'TypeScript', 'GraphQL']),
(2, 'Design Co', 'Full Stack Developer', 'Accepted', '2025-01-14', 'Medium',
    ARRAY['React', 'Node.js'],
    ARRAY['React', 'Node.js', 'MongoDB']),
(3, 'Startup Inc', 'Senior Frontend Developer', 'Rejected', '2025-01-10', 'High',
    ARRAY['React', 'TypeScript', 'AWS'],
    ARRAY['React', 'TypeScript', 'AWS', 'Vue.js']),
(4, 'Cloud Systems', 'Frontend Engineer', 'Withdrawn', '2025-01-08', 'Low',
    ARRAY['React', 'AWS'],
    ARRAY['React', 'AWS', 'Angular']),
(5, 'Data Systems Inc', 'UI Developer', 'No Response', '2025-01-05', 'Medium',
    ARRAY['React'],
    ARRAY['React', 'D3.js', 'TypeScript']),
(6, 'TechGiant', 'Frontend Developer', 'Technical Interview', '2025-01-17', 'High',
    ARRAY['React', 'TypeScript', 'AWS'],
    ARRAY['React', 'TypeScript', 'AWS', 'Redux']),
(7, 'DevHub', 'Full Stack Engineer', 'Initial Screen', '2025-01-16', 'Medium',
    ARRAY['React', 'Node.js', 'Python'],
    ARRAY['React', 'Node.js', 'Python', 'PostgreSQL']),
(8, 'AI Solutions', 'Frontend Engineer', 'Final Interview', '2025-01-12', 'High',
    ARRAY['React', 'TypeScript', 'Python'],
    ARRAY['React', 'TypeScript', 'Python', 'TensorFlow.js']),
(9, 'CloudTech', 'Senior Frontend Developer', 'Rejected', '2025-01-11', 'Medium',
    ARRAY['React', 'AWS', 'Node.js'],
    ARRAY['React', 'AWS', 'Node.js', 'Kubernetes']),
(10, 'FinTech Solutions', 'UI Engineer', 'Applied', '2025-01-19', 'Low',
    ARRAY['React', 'TypeScript'],
    ARRAY['React', 'TypeScript', 'D3.js']),
(11, 'DataViz Corp', 'Frontend Developer', 'No Response', '2025-01-07', 'Low',
    ARRAY['React', 'D3.js'],
    ARRAY['React', 'D3.js', 'TypeScript', 'SVG']),
(12, 'WebScale Inc', 'Full Stack Developer', 'Technical Interview', '2025-01-18', 'High',
    ARRAY['React', 'Node.js', 'AWS'],
    ARRAY['React', 'Node.js', 'AWS', 'MongoDB']),
(13, 'MobileTech', 'React Native Developer', 'Withdrawn', '2025-01-09', 'Medium',
    ARRAY['React', 'JavaScript'],
    ARRAY['React', 'React Native', 'TypeScript', 'Mobile Development']),
(14, 'DevOps Pro', 'Frontend Infrastructure Engineer', 'Rejected', '2025-01-13', 'Medium',
    ARRAY['React', 'AWS', 'CI/CD'],
    ARRAY['React', 'AWS', 'Kubernetes', 'Jenkins', 'Docker']),
(15, 'E-commerce Solutions', 'Frontend Developer', 'Initial Screen', '2025-01-20', 'Medium',
    ARRAY['React', 'TypeScript', 'Redux'],
    ARRAY['React', 'TypeScript', 'Redux', 'GraphQL']);

-- Reset sequence to prevent id conflicts
SELECT setval('job_applications_id_seq', (SELECT MAX(id) FROM job_applications));

-- Insert ALL timeline entries
INSERT INTO application_timeline (application_id, status, date, notes) VALUES
-- Application 1 timeline
(1, 'Applied', '2025-01-15T10:00:00Z', 'Applied through company website'),
(1, 'Initial Screen', '2025-01-18T14:30:00Z', '30-minute call with HR'),
(1, 'Technical Interview', '2025-01-22T15:00:00Z', 'Coding challenge completed'),
(1, 'Final Interview', '2025-01-25T13:00:00Z', 'Meeting with Engineering Manager'),
(1, 'Offer', '2025-01-27T16:00:00Z', 'Received offer letter'),

[... rest of timeline entries remain exactly the same ...]

-- Insert ALL network contacts
INSERT INTO network_contacts (id, name, role, company, connection, last_contact, email, phone) VALUES
[... network contacts entries remain exactly the same ...]

-- Insert ALL role insights
INSERT INTO role_insights (role_title, common_skills, average_salary, demand_trend, top_companies) VALUES
[... role insights entries remain exactly the same ...]

-- Reset all sequences
SELECT setval('application_timeline_id_seq', (SELECT MAX(id) FROM application_timeline));
SELECT setval('network_contacts_id_seq', (SELECT MAX(id) FROM network_contacts));

-- Commit transaction
COMMIT;