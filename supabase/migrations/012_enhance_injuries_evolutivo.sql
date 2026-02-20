-- Migration: Enhance Injuries Table for Evolutivo Detail
-- Created: 2026-01-16

-- Extend public.injuries with more details
ALTER TABLE public.injuries 
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS relapses_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS consensus TEXT,
ADD COLUMN IF NOT EXISTS doctor_name TEXT,
ADD COLUMN IF NOT EXISTS doctor_role TEXT,
ADD COLUMN IF NOT EXISTS doctor_avatar TEXT;

-- Table for injury evolution timeline (incidents/milestones)
CREATE TABLE IF NOT EXISTS public.injury_timeline (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    injury_id UUID REFERENCES public.injuries(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    type TEXT CHECK (type IN ('relapse', 'milestone', 'initial', 'note')) NOT NULL DEFAULT 'note',
    description TEXT
);

-- Table for injury rehabilitation resources (PDFs, etc)
CREATE TABLE IF NOT EXISTS public.injury_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    injury_id UUID REFERENCES public.injuries(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    size TEXT
);

-- Enable RLS
ALTER TABLE public.injury_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injury_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Timeline
CREATE POLICY "Athletes can manage their injury timeline"
ON public.injury_timeline FOR ALL
USING (EXISTS (SELECT 1 FROM public.injuries WHERE id = injury_timeline.injury_id AND athlete_id = auth.uid()));

CREATE POLICY "Coaches can view injury timeline"
ON public.injury_timeline FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.injuries i
    JOIN public.teams t ON i.athlete_id = ANY(SELECT p.id FROM public.profiles p WHERE p.team_id = t.id)
    WHERE i.id = injury_timeline.injury_id AND t.coach_id = auth.uid()
));

-- RLS Policies for Resources
CREATE POLICY "Athletes can manage their injury resources"
ON public.injury_resources FOR ALL
USING (EXISTS (SELECT 1 FROM public.injuries WHERE id = injury_resources.injury_id AND athlete_id = auth.uid()));

CREATE POLICY "Coaches can view injury resources"
ON public.injury_resources FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.injuries i
    JOIN public.teams t ON i.athlete_id = ANY(SELECT p.id FROM public.profiles p WHERE p.team_id = t.id)
    WHERE i.id = injury_resources.injury_id AND t.coach_id = auth.uid()
));
