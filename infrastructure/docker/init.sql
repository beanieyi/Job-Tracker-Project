-- PostgreSQL initialization script for Job Tracker application
-- This script runs on first database initialization to set up required tables
-- and populate them with sample data for development purposes

-- Create job applications table with comprehensive tracking fields
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,                    -- Auto-incrementing primary key
    company_name VARCHAR(200) NOT NULL,       -- Company name with required input
    position_title VARCHAR(200) NOT NULL,     -- Job title with required input
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Automatic timestamp
    status VARCHAR(50) NOT NULL,              -- Current application status
    location VARCHAR(100),                    -- Optional job location
    salary_range VARCHAR(100),                -- Optional salary information
    application_link VARCHAR(500),            -- Optional application URL
    notes TEXT                                -- Optional detailed notes
);

-- Insert sample data for development and testing purposes
-- These entries provide a variety of scenarios for testing different application states
INSERT INTO job_applications (
    company_name,
    position_title,
    status,
    location,
    salary_range,
    notes
) VALUES
    (
        'TechCorp Industries',
        'Senior Software Engineer',
        'Applied',
        'Seattle, WA',
        '$120k - $150k',
        'Applied through company website. Following up in one week.'
    ),
    (
        'DataDrive Solutions',
        'Full Stack Developer',
        'Interview Scheduled',
        'Remote',
        '$95k - $120k',
        'Technical interview scheduled for next Tuesday'
    ),
    (
        'Cloud Systems Inc',
        'Backend Developer',
        'Second Interview',
        'Portland, OR',
        '$100k - $130k',
        'Second round with team lead'
    ),
    (
        'Innovative Software',
        'Frontend Engineer',
        'Offer Received',
        'San Francisco, CA',
        '$130k - $160k',
        'Reviewing offer package'
    ),
    (
        'Tech Startups United',
        'DevOps Engineer',
        'Initial Screen',
        'Austin, TX',
        '$90k - $120k',
        'HR screening call scheduled'
    );