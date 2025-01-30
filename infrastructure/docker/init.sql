-- PostgreSQL initialization script for Job Tracker application
-- Begin transaction to ensure all operations succeed or none do
BEGIN;

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS application_timeline CASCADE;
DROP TABLE IF EXISTS network_contacts CASCADE;
DROP TABLE IF EXISTS role_insights CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;

CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            skills TEXT[]
        );
        
-- Create job applications table with expanded tracking fields
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    company VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    matched_skills TEXT[],  -- Array of matched skills
    required_skills TEXT[]  -- Array of required skills
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
    linkedin VARCHAR(200) NOT NULL,
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

-- Insert job applications
INSERT INTO job_applications (id, company, position, status, date, priority, matched_skills, required_skills) VALUES
(1,  'Tech Corp',            'Frontend Developer',           'Offer',              '2025-01-15', 'High', 
     ARRAY['React', 'TypeScript'], 
     ARRAY['React', 'TypeScript', 'GraphQL']),
(2,  'Design Co',            'Full Stack Developer',         'Accepted',           '2025-01-14', 'Medium',
     ARRAY['React', 'Node.js'],
     ARRAY['React', 'Node.js', 'MongoDB']),
(3,  'Startup Inc',          'Senior Frontend Developer',    'Rejected',           '2025-01-10', 'High',
     ARRAY['React', 'TypeScript', 'AWS'],
     ARRAY['React', 'TypeScript', 'AWS', 'Vue.js']),
(4,  'Cloud Systems',        'Frontend Engineer',            'Withdrawn',          '2025-01-08', 'Low',
     ARRAY['React', 'AWS'],
     ARRAY['React', 'AWS', 'Angular']),
(5,  'Data Systems Inc',     'UI Developer',                 'No Response',        '2025-01-05', 'Medium',
     ARRAY['React'],
     ARRAY['React', 'D3.js', 'TypeScript']),
(6,  'TechGiant',            'Frontend Developer',           'Technical Interview','2025-01-17', 'High',
     ARRAY['React', 'TypeScript', 'AWS'],
     ARRAY['React', 'TypeScript', 'AWS', 'Redux']),
(7,  'DevHub',               'Full Stack Engineer',          'Initial Screen',     '2025-01-16', 'Medium',
     ARRAY['React', 'Node.js', 'Python'],
     ARRAY['React', 'Node.js', 'Python', 'PostgreSQL']),
(8,  'AI Solutions',         'Frontend Engineer',            'Final Interview',    '2025-01-12', 'High',
     ARRAY['React', 'TypeScript', 'Python'],
     ARRAY['React', 'TypeScript', 'Python', 'TensorFlow.js']),
(9,  'CloudTech',            'Senior Frontend Developer',    'Rejected',           '2025-01-11', 'Medium',
     ARRAY['React', 'AWS', 'Node.js'],
     ARRAY['React', 'AWS', 'Node.js', 'Kubernetes']),
(10, 'FinTech Solutions',    'UI Engineer',                  'Applied',            '2025-01-19', 'Low',
     ARRAY['React', 'TypeScript'],
     ARRAY['React', 'TypeScript', 'D3.js']),
(11, 'DataViz Corp',         'Frontend Developer',           'No Response',        '2025-01-07', 'Low',
     ARRAY['React', 'D3.js'],
     ARRAY['React', 'D3.js', 'TypeScript', 'SVG']),
(12, 'WebScale Inc',         'Full Stack Developer',         'Technical Interview','2025-01-18', 'High',
     ARRAY['React', 'Node.js', 'AWS'],
     ARRAY['React', 'Node.js', 'AWS', 'MongoDB']),
(13, 'MobileTech',           'React Native Developer',       'Withdrawn',          '2025-01-09', 'Medium',
     ARRAY['React', 'JavaScript'],
     ARRAY['React', 'React Native', 'TypeScript', 'Mobile Development']),
(14, 'DevOps Pro',           'Frontend Infrastructure Engineer','Rejected',        '2025-01-13', 'Medium',
     ARRAY['React', 'AWS', 'CI/CD'],
     ARRAY['React', 'AWS', 'Kubernetes', 'Jenkins', 'Docker']),
(15, 'E-commerce Solutions', 'Frontend Developer',           'Initial Screen',     '2025-01-20', 'Medium',
     ARRAY['React', 'TypeScript', 'Redux'],
     ARRAY['React', 'TypeScript', 'Redux', 'GraphQL']);

-- Reset job_applications sequence to prevent ID conflicts
SELECT setval('job_applications_id_seq', (SELECT MAX(id) FROM job_applications));

-- Insert timeline entries for each application
INSERT INTO application_timeline (application_id, status, date, notes) VALUES
    -- Application 1
    (1,  'Applied',              '2025-01-15T10:00:00Z', 'Applied through company website'),
    (1,  'Offer',                '2025-01-27T16:00:00Z', 'Received an offer letter'),

    -- Application 2
    (2,  'Applied',              '2025-01-14T08:00:00Z', 'Through internal referral'),
    (2,  'Accepted',             '2025-01-20T09:00:00Z', 'Signed contract'),

    -- Application 3
    (3,  'Applied',              '2025-01-10T09:00:00Z', 'Via company website'),
    (3,  'Rejected',             '2025-01-14T10:00:00Z', 'Email from HR'),

    -- Application 4
    (4,  'Applied',              '2025-01-08T08:00:00Z', 'Met at career fair'),
    (4,  'Withdrawn',            '2025-01-10T08:00:00Z', 'Accepted a different role'),

    -- Application 5
    (5,  'Applied',              '2025-01-05T08:00:00Z', 'Through online platform'),
    (5,  'No Response',          '2025-01-25T08:00:00Z', 'No callback or email'),

    -- Application 6
    (6,  'Applied',              '2025-01-17T08:00:00Z', 'Online application'),
    (6,  'Technical Interview',  '2025-01-22T10:00:00Z', 'Coding challenge scheduled'),

    -- Application 7
    (7,  'Applied',              '2025-01-16T08:00:00Z', 'Recruitment event'),
    (7,  'Initial Screen',       '2025-01-18T09:00:00Z', 'Phone call with recruiter'),

    -- Application 8
    (8,  'Applied',              '2025-01-12T08:00:00Z', 'Emailed HR directly'),
    (8,  'Final Interview',      '2025-01-23T10:00:00Z', 'Panel interview on Zoom'),

    -- Application 9
    (9,  'Applied',              '2025-01-11T08:00:00Z', 'Company portal'),
    (9,  'Rejected',             '2025-01-20T13:00:00Z', 'Not a good fit'),

    -- Application 10
    (10, 'Applied',              '2025-01-19T08:00:00Z', 'Referred by friend'),
    (10, 'Under Review',         '2025-01-20T09:00:00Z', 'Waiting for hiring manager feedback'),

    -- Application 11
    (11, 'Applied',              '2025-01-07T08:00:00Z', 'Company website'),
    (11, 'No Response',          '2025-01-22T11:00:00Z', 'No feedback received'),

    -- Application 12
    (12, 'Applied',              '2025-01-18T08:00:00Z', 'Employee referral'),
    (12, 'Technical Interview',  '2025-01-26T10:00:00Z', 'Coding test scheduled'),

    -- Application 13
    (13, 'Applied',              '2025-01-09T08:00:00Z', 'Job board listing'),
    (13, 'Withdrawn',            '2025-01-11T08:00:00Z', 'Accepted a competing offer'),

    -- Application 14
    (14, 'Applied',              '2025-01-13T08:00:00Z', 'Company website'),
    (14, 'Rejected',             '2025-01-17T08:00:00Z', 'Email from HR'),

    -- Application 15
    (15, 'Applied',              '2025-01-20T08:00:00Z', 'Online job board'),
    (15, 'Initial Screen',       '2025-01-23T08:00:00Z', 'Phone screen scheduled');

-- Reset timeline sequence
SELECT setval('application_timeline_id_seq', (SELECT MAX(id) FROM application_timeline));

-- Insert network contacts
INSERT INTO network_contacts (id, name, role, company, linkedin, email, phone) VALUES
    (1, 'Alice Johnson',  'Recruiter',             'Tech Corp',            'LinkedIn',  'alice@techcorp.com',     '555-0101'),
    (2, 'Bob Williams',   'HR Manager',            'Design Co',           'LinkedIn',   'bob@designco.com',       '555-0202'),
    (3, 'Carol Smith',    'Engineering Manager',   'Startup Inc',         'LinkedIn',   'carol@startupinc.com',   '555-0303'),
    (4, 'David Brown',    'DevOps Lead',           'Cloud Systems',       'LinkedIn',   'david@cloudsystems.com', '555-0404'),
    (5, 'Eve Davis',      'CEO',                   'Data Systems Inc',    'LinkedIn',   'eve@datasystems.com',    '555-0505');

-- Reset network contacts sequence
SELECT setval('network_contacts_id_seq', (SELECT MAX(id) FROM network_contacts));

-- Insert role insights
INSERT INTO role_insights (role_title, common_skills, average_salary, demand_trend, top_companies) VALUES
    ('Frontend Developer',
        ARRAY['React','JavaScript','CSS','HTML'],
        '$80K - $110K',
        'High',
        ARRAY['Tech Corp','E-commerce Solutions','Cloud Systems']
    ),
    ('Full Stack Developer',
        ARRAY['React','Node.js','Databases','AWS'],
        '$90K - $120K',
        'High',
        ARRAY['Design Co','Startup Inc','WebScale Inc']
    ),
    ('UI Developer',
        ARRAY['React','TypeScript','D3.js','Design'],
        '$75K - $100K',
        'Medium',
        ARRAY['Data Systems Inc','FinTech Solutions']
    ),
    ('Senior Frontend Developer',
        ARRAY['React','TypeScript','AWS','Testing'],
        '$100K - $140K',
        'High',
        ARRAY['Startup Inc','CloudTech']
    ),
    ('Frontend Engineer',
        ARRAY['React','AWS','CI/CD','Docker'],
        '$85K - $120K',
        'Growing',
        ARRAY['Cloud Systems','DevOps Pro','AI Solutions']
    );

COMMIT;