-- Migration: Add Competitions Table
-- Created: 2026-01-08

-- Table for competitions and events
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    athlete_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    event_type TEXT, -- '10km', 'Half Marathon', 'Sprint Triathlon', etc.
    distance TEXT,
    result_time TEXT, -- Format: "HH:MM:SS" or "MM:SS"
    position INTEGER,
    notes TEXT,
    is_target BOOLEAN DEFAULT false -- Is this a target/goal competition?
);

-- Enable RLS
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Athletes can manage their own competitions
CREATE POLICY "Athletes can manage their own competitions"
ON public.competitions FOR ALL
USING (auth.uid() = athlete_id);

-- RLS Policies: Coaches can view competitions of their team athletes
CREATE POLICY "Coaches can view athlete competitions"
ON public.competitions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.teams t
        JOIN public.profiles p ON p.team_id = t.id
        WHERE t.coach_id = auth.uid() AND p.id = competitions.athlete_id
    )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_competitions_athlete_id ON public.competitions(athlete_id);
CREATE INDEX IF NOT EXISTS idx_competitions_date ON public.competitions(date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_competitions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS on_competition_updated ON public.competitions;
CREATE TRIGGER on_competition_updated
    BEFORE UPDATE ON public.competitions
    FOR EACH ROW
    EXECUTE FUNCTION update_competitions_updated_at();
