-- Add logo_url column to tools table
ALTER TABLE tools ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
