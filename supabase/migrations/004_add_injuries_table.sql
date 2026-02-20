-- Migration: Add Injuries Table for Clinical History
-- Created: 2026-01-08

-- Table for athlete injuries and clinical history
CREATE TABLE IF NOT EXISTS public.injuries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    athlete_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('active', 'recovering', 'recovered')) NOT NULL DEFAULT 'active',
    date DATE NOT NULL
);

-- Enable RLS
ALTER TABLE public.injuries ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Athletes can manage their own injuries
CREATE POLICY "Athletes can manage their own injuries"
ON public.injuries FOR ALL
USING (auth.uid() = athlete_id);

-- RLS Policies: Coaches can view injuries of their team athletes
CREATE POLICY "Coaches can view athlete injuries"
ON public.injuries FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.teams t
        JOIN public.profiles p ON p.team_id = t.id
        WHERE t.coach_id = auth.uid() AND p.id = injuries.athlete_id
    )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_injuries_athlete_id ON public.injuries(athlete_id);
CREATE INDEX IF NOT EXISTS idx_injuries_status ON public.injuries(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_injuries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS on_injury_updated ON public.injuries;
CREATE TRIGGER on_injury_updated
    BEFORE UPDATE ON public.injuries
    FOR EACH ROW
    EXECUTE FUNCTION update_injuries_updated_at();
