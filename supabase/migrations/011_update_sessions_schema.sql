-- Migration: Update Sessions Schema
-- Created: 2026-01-08

-- Add additional fields to sessions table
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS desc TEXT, -- Description of the session
ADD COLUMN IF NOT EXISTS icon TEXT, -- Material icon name
ADD COLUMN IF NOT EXISTS is_competition BOOLEAN DEFAULT false;

-- Update the type column to support more session types if needed
-- Note: We're keeping it flexible as TEXT rather than ENUM for easier updates
