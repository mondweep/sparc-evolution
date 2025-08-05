-- Database initialization script
-- This script runs when PostgreSQL container starts for the first time

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create database if it doesn't exist (this is usually done by POSTGRES_DB env var)
-- SELECT 'CREATE DATABASE fastapi_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fastapi_db');

-- Create a schema for the application
CREATE SCHEMA IF NOT EXISTS app;

-- Set default permissions
GRANT ALL PRIVILEGES ON SCHEMA app TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA app TO postgres;

-- Create initial admin user (will be handled by the application migration)
-- This is just for reference
/*
INSERT INTO users (
    id,
    email,
    first_name,
    last_name,
    hashed_password,
    is_active,
    is_admin,
    created_at
) VALUES (
    uuid_generate_v4(),
    'admin@example.com',
    'Admin',
    'User',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5w8ZjZKlNu', -- hashed 'admin123'
    true,
    true,
    NOW()
) ON CONFLICT (email) DO NOTHING;
*/