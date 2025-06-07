-- Dale Loves Whales - Database Initialization Script
-- This script sets up the initial database configuration and extensions

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Set timezone
SET timezone = 'UTC';

-- Create initial admin user function
CREATE OR REPLACE FUNCTION create_initial_admin_user()
RETURNS VOID AS $$
BEGIN
    -- This will be called after schema is pushed via Drizzle
    -- Initial user creation happens in the application code
    RAISE NOTICE 'Database initialization complete. Schema will be managed by Drizzle ORM.';
END;
$$ LANGUAGE plpgsql;

-- Call the initialization function
SELECT create_initial_admin_user();

-- Performance optimizations
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Dale Loves Whales database initialization completed successfully';
    RAISE NOTICE 'Database ready for Drizzle schema migration';
END $$;