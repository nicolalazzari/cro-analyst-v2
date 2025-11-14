-- Migration script to migrate data from v1 cro_experiments table to v2 schema
-- Run this AFTER creating the new schema with Prisma

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Step 1: Migrate data from cro_experiments to new experiments table
-- This assumes cro_experiments has columns that map to the new schema
INSERT INTO experiments (
    experiment_id,
    test_name,
    hypothesis,
    lessons_learned,
    vertical,
    geo,
    brand,
    date_launched,
    date_concluded,
    winning_var,
    observed_revenue_impact,
    primary_metric_name,
    created_at,
    updated_at
)
SELECT 
    experiment_id,
    test_name,
    hypothesis,
    lessons_learned,
    vertical,
    geo,
    brand,
    date_launched,
    date_concluded,
    winning_var,
    observed_revenue_impact,
    primary_metric_name,
    created_at,
    updated_at
FROM cro_experiments
ON CONFLICT (experiment_id) DO NOTHING;

-- Step 2: After migration, you can drop the old table (optional)
-- DROP TABLE IF EXISTS cro_experiments;

