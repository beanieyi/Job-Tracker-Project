-- PostgreSQL initialization script for Job Tracker application
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

-- Create application timeline table with enhanced status tracking
CREATE TABLE application_timeline (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES job_applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    date TIMESTAMP NOT NULL,
    notes TEXT,
    previous_status VARCHAR(50)
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

-- Insert job applications with varied statuses
INSERT INTO job_applications (id, company, position, status, date, priority, matched_skills, required_skills) VALUES
-- Applications that moved through the process successfully
(1,  'Tech Corp',            'Frontend Developer',           'Offer',              '2025-01-15', 'High', 
     ARRAY['React', 'TypeScript'], 
     ARRAY['React', 'TypeScript', 'GraphQL']),
(2,  'Design Co',            'Full Stack Developer',         'Accepted',           '2025-01-14', 'Medium',
     ARRAY['React', 'Node.js'],
     ARRAY['React', 'Node.js', 'MongoDB']),

-- Applications that were rejected at different stages
(3,  'Startup Inc',          'Senior Frontend Developer',    'Rejected',           '2025-01-10', 'High',
     ARRAY['React', 'TypeScript', 'AWS'],
     ARRAY['React', 'TypeScript', 'AWS', 'Vue.js']),
(4,  'Cloud Systems',        'Frontend Engineer',            'Rejected',           '2025-01-08', 'Low',
     ARRAY['React', 'AWS'],
     ARRAY['React', 'AWS', 'Angular']),

-- Applications with no response
(5,  'Data Systems Inc',     'UI Developer',                 'No Response',        '2025-01-05', 'Medium',
     ARRAY['React'],
     ARRAY['React', 'D3.js', 'TypeScript']),

-- Applications in progress
(6,  'TechGiant',            'Frontend Developer',           'Technical Interview','2025-01-17', 'High',
     ARRAY['React', 'TypeScript', 'AWS'],
     ARRAY['React', 'TypeScript', 'AWS', 'Redux']),
(7,  'DevHub',               'Full Stack Engineer',          'Initial Screen',     '2025-01-16', 'Medium',
     ARRAY['React', 'Node.js', 'Python'],
     ARRAY['React', 'Node.js', 'Python', 'PostgreSQL']),
(8,  'AI Solutions',         'Frontend Engineer',            'Final Interview',    '2025-01-12', 'High',
     ARRAY['React', 'TypeScript', 'Python'],
     ARRAY['React', 'TypeScript', 'Python', 'TensorFlow.js']),

-- Applications that were withdrawn
(9,  'CloudTech',            'Senior Frontend Developer',    'Withdrawn',          '2025-01-11', 'Medium',
     ARRAY['React', 'AWS', 'Node.js'],
     ARRAY['React', 'AWS', 'Node.js', 'Kubernetes']),
(10, 'FinTech Solutions',    'UI Engineer',                  'Withdrawn',          '2025-01-19', 'Low',
     ARRAY['React', 'TypeScript'],
     ARRAY['React', 'TypeScript', 'D3.js']);

-- Insert detailed timeline entries showing full application progression
INSERT INTO application_timeline (application_id, status, date, notes, previous_status) VALUES
    -- Application 1: Complete successful progression
    (1, 'Applied',              '2025-01-15T10:00:00Z', 'Applied through company website', NULL),
    (1, 'Initial Screen',       '2025-01-17T14:00:00Z', 'Phone screen with HR', 'Applied'),
    (1, 'Technical Interview',  '2025-01-20T15:00:00Z', 'Technical assessment completed', 'Initial Screen'),
    (1, 'Final Interview',      '2025-01-25T11:00:00Z', 'Interview with CTO', 'Technical Interview'),
    (1, 'Offer',               '2025-01-27T16:00:00Z', 'Received offer letter', 'Final Interview'),

    -- Application 2: Quick progression to acceptance
    (2, 'Applied',              '2025-01-14T08:00:00Z', 'Applied through referral', NULL),
    (2, 'Initial Screen',       '2025-01-16T10:00:00Z', 'Initial discussion', 'Applied'),
    (2, 'Technical Interview',  '2025-01-18T14:00:00Z', 'Coding assessment', 'Initial Screen'),
    (2, 'Accepted',             '2025-01-20T09:00:00Z', 'Offer accepted', 'Technical Interview'),

    -- Application 3: Rejection after technical
    (3, 'Applied',              '2025-01-10T09:00:00Z', 'Applied via website', NULL),
    (3, 'Initial Screen',       '2025-01-12T11:00:00Z', 'Initial HR screen', 'Applied'),
    (3, 'Technical Interview',  '2025-01-13T14:00:00Z', 'Technical round', 'Initial Screen'),
    (3, 'Rejected',             '2025-01-14T10:00:00Z', 'Feedback: Need more experience', 'Technical Interview'),

    -- Application 4: Quick rejection
    (4, 'Applied',              '2025-01-08T08:00:00Z', 'Applied online', NULL),
    (4, 'Initial Screen',       '2025-01-09T10:00:00Z', 'Brief HR call', 'Applied'),
    (4, 'Rejected',             '2025-01-10T08:00:00Z', 'Not a good fit', 'Initial Screen'),

    -- Application 5: No response
    (5, 'Applied',              '2025-01-05T08:00:00Z', 'Applied through platform', NULL),
    (5, 'No Response',          '2025-01-25T08:00:00Z', 'No response after 3 weeks', 'Applied'),

    -- Application 6: In technical interview stage
    (6, 'Applied',              '2025-01-17T08:00:00Z', 'Direct application', NULL),
    (6, 'Initial Screen',       '2025-01-19T15:00:00Z', 'HR screening call', 'Applied'),
    (6, 'Technical Interview',  '2025-01-22T10:00:00Z', 'Currently in technical round', 'Initial Screen'),

    -- Application 7: In initial screen
    (7, 'Applied',              '2025-01-16T08:00:00Z', 'Applied via LinkedIn', NULL),
    (7, 'Initial Screen',       '2025-01-18T09:00:00Z', 'Scheduled for HR screen', 'Applied'),

    -- Application 8: In final interview
    (8, 'Applied',              '2025-01-12T08:00:00Z', 'Direct application', NULL),
    (8, 'Initial Screen',       '2025-01-14T10:00:00Z', 'HR discussion', 'Applied'),
    (8, 'Technical Interview',  '2025-01-18T14:00:00Z', 'Technical assessment', 'Initial Screen'),
    (8, 'Final Interview',      '2025-01-23T10:00:00Z', 'Final round scheduled', 'Technical Interview'),

    -- Application 9: Withdrawn after initial screen
    (9, 'Applied',              '2025-01-11T08:00:00Z', 'Applied via website', NULL),
    (9, 'Initial Screen',       '2025-01-13T14:00:00Z', 'Initial HR round', 'Applied'),
    (9, 'Withdrawn',            '2025-01-15T09:00:00Z', 'Accepted another offer', 'Initial Screen'),

    -- Application 10: Withdrawn after applying
    (10, 'Applied',             '2025-01-19T08:00:00Z', 'Direct application', NULL),
    (10, 'Withdrawn',           '2025-01-20T09:00:00Z', 'Position no longer available', 'Applied');

-- Insert network contacts
INSERT INTO network_contacts (id, name, role, company, linkedin, email, phone) VALUES
    (1, 'Alice Johnson',  'Recruiter',             'Tech Corp',            'linkedin.com/in/alice-johnson',  'alice@techcorp.com',     '555-0101'),
    (2, 'Bob Williams',   'HR Manager',            'Design Co',            'linkedin.com/in/bob-williams',   'bob@designco.com',       '555-0202'),
    (3, 'Carol Smith',    'Engineering Manager',   'Startup Inc',          'linkedin.com/in/carol-smith',    'carol@startupinc.com',   '555-0303'),
    (4, 'David Brown',    'DevOps Lead',           'Cloud Systems',        'linkedin.com/in/david-brown',    'david@cloudsystems.com', '555-0404'),
    (5, 'Eve Davis',      'CEO',                   'Data Systems Inc',     'linkedin.com/in/eve-davis',      'eve@datasystems.com',    '555-0505');

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

-- Reset sequences
SELECT setval('job_applications_id_seq', (SELECT MAX(id) FROM job_applications));
SELECT setval('application_timeline_id_seq', (SELECT MAX(id) FROM application_timeline));
SELECT setval('network_contacts_id_seq', (SELECT MAX(id) FROM network_contacts));

COMMIT;