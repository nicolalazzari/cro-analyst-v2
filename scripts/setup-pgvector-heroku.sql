-- SQL script to enable pgvector extension on Heroku Postgres
-- Run this via Heroku Postgres console or psql connection

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify extension is installed
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Create index for vector similarity search (run after creating experiments table)
-- CREATE INDEX IF NOT EXISTS idx_experiments_embedding ON experiments 
--     USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

