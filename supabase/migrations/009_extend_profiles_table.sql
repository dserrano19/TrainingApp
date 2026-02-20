-- Migration: Extend Profiles Table with Additional Fields
-- Created: 2026-01-08

-- Add additional fields to profiles table for complete athlete information
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dni TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS club TEXT,
ADD COLUMN IF NOT EXISTS size_clothing TEXT,
ADD COLUMN IF NOT EXISTS size_suit TEXT,
ADD COLUMN IF NOT EXISTS body_fat DECIMAL;

-- Note: Some fields already exist from previous migrations:
-- - weight, height, birth_date, specialty, personal_bests, license_number

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
