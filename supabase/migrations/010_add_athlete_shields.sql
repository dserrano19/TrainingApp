-- Migration: Add Athlete Shields Table
-- Created: 2026-01-08

-- Table for athlete shields/protections (gamification feature)
CREATE TABLE IF NOT EXISTS public.athlete_shields (
    athlete_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    active_shields INTEGER DEFAULT 0 CHECK (active_shields >= 0),
    total_shields_earned INTEGER DEFAULT 0 CHECK (total_shields_earned >= 0),
    last_shield_date DATE
);

-- Enable RLS
ALTER TABLE public.athlete_shields ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Athletes can view and update their own shields
CREATE POLICY "Athletes can manage their own shields"
ON public.athlete_shields FOR ALL
USING (auth.uid() = athlete_id);

-- RLS Policies: Coaches can view shields of their team athletes
CREATE POLICY "Coaches can view athlete shields"
ON public.athlete_shields FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.teams t
        JOIN public.profiles p ON p.team_id = t.id
        WHERE t.coach_id = auth.uid() AND p.id = athlete_shields.athlete_id
    )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_athlete_shields_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS on_athlete_shields_updated ON public.athlete_shields;
CREATE TRIGGER on_athlete_shields_updated
    BEFORE UPDATE ON public.athlete_shields
    FOR EACH ROW
    EXECUTE FUNCTION update_athlete_shields_updated_at();

-- Function to award shield when streak reaches milestones
CREATE OR REPLACE FUNCTION award_shield_on_streak_milestone()
RETURNS TRIGGER AS $$
BEGIN
    -- Award a shield every 7 days of streak
    IF NEW.current_streak % 7 = 0 AND NEW.current_streak > 0 THEN
        INSERT INTO public.athlete_shields (athlete_id, active_shields, total_shields_earned, last_shield_date)
        VALUES (NEW.athlete_id, 1, 1, CURRENT_DATE)
        ON CONFLICT (athlete_id) 
        DO UPDATE SET 
            active_shields = athlete_shields.active_shields + 1,
            total_shields_earned = athlete_shields.total_shields_earned + 1,
            last_shield_date = CURRENT_DATE,
            updated_at = now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to award shields based on streaks
DROP TRIGGER IF EXISTS on_streak_milestone ON public.athlete_streaks;
CREATE TRIGGER on_streak_milestone
    AFTER UPDATE ON public.athlete_streaks
    FOR EACH ROW
    WHEN (NEW.current_streak > OLD.current_streak)
    EXECUTE FUNCTION award_shield_on_streak_milestone();
