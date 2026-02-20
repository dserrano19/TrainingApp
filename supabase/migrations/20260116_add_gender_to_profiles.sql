-- Add gender column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gender text;

-- Optional: Add a check constraint to ensure valid values if desired
-- ALTER TABLE public.profiles ADD CONSTRAINT check_gender CHECK (gender IN ('male', 'female', 'other'));
