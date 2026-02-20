-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    coach_id UUID REFERENCES public.profiles(id) NOT NULL
);

-- Add team_id to profiles for easier linking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Policies for teams
CREATE POLICY "Teams are viewable by assigned athletes and their coach."
ON public.teams FOR SELECT
USING (
    auth.uid() = coach_id 
    OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND team_id = public.teams.id
    )
);

CREATE POLICY "Coaches can manage their own teams."
ON public.teams FOR ALL
USING (
    auth.uid() = coach_id
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'COACH'
    )
);

-- Update RLS for profiles to allow athletes to see team-mates (optional but common)
-- (Skipping for now to keep it simple)
