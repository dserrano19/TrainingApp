-- Add new columns to profiles table for enhanced athlete registration
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS weight decimal,
ADD COLUMN IF NOT EXISTS license_number text,
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS group_code text,
ADD COLUMN IF NOT EXISTS height decimal,
ADD COLUMN IF NOT EXISTS season_goals text,
ADD COLUMN IF NOT EXISTS specialty text,
ADD COLUMN IF NOT EXISTS personal_bests jsonb,
ADD COLUMN IF NOT EXISTS clothing_size text,
ADD COLUMN IF NOT EXISTS injury_history text,
ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Update the handle_new_user function to include the new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, avatar_url, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add checking constraints for mandatory fields (optional, but good for data integrity if enforced at DB level)
-- Note: We might want to allow nulls initially for old users, so I will skipping strict NOT NULL constraints for now unless requested.
