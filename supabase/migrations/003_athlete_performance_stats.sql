-- Migration: Add Athlete Performance and Statistics Tables
-- Created: 2026-01-08

-- Table for athlete performance records (personal bests, time evolution)
CREATE TABLE IF NOT EXISTS public.athlete_performance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    athlete_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL, -- '100m', '200m', '400m', '800m', '1500m', etc.
    time_seconds DECIMAL NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    notes TEXT,
    UNIQUE(athlete_id, event_type, date)
);

-- Table for athlete training goals (weekly/monthly targets)
CREATE TABLE IF NOT EXISTS public.athlete_training_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    athlete_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    period_type TEXT CHECK (period_type IN ('WEEKLY', 'MONTHLY')) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_distance DECIMAL, -- in kilometers
    target_sessions INTEGER,
    current_distance DECIMAL DEFAULT 0,
    current_sessions INTEGER DEFAULT 0,
    UNIQUE(athlete_id, period_type, start_date)
);

-- Table for athlete streaks (consistency tracking)
CREATE TABLE IF NOT EXISTS public.athlete_streaks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Update sessions table with additional fields
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS session_type TEXT CHECK (session_type IN ('TRACK', 'GYM', 'COMPETITION', 'SWIM', 'OTHER')),
ADD COLUMN IF NOT EXISTS intensity TEXT CHECK (intensity IN ('BAJA', 'MEDIA', 'ALTA')),
ADD COLUMN IF NOT EXISTS distance_km DECIMAL,
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.athlete_performance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_training_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for athlete_performance_records
CREATE POLICY "Athletes can manage their own performance records"
ON public.athlete_performance_records FOR ALL
USING (auth.uid() = athlete_id);

CREATE POLICY "Coaches can view athlete performance records"
ON public.athlete_performance_records FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.teams t
        JOIN public.profiles p ON p.team_id = t.id
        WHERE t.coach_id = auth.uid() AND p.id = athlete_performance_records.athlete_id
    )
);

-- RLS Policies for athlete_training_goals
CREATE POLICY "Athletes can manage their own training goals"
ON public.athlete_training_goals FOR ALL
USING (auth.uid() = athlete_id);

CREATE POLICY "Coaches can view athlete training goals"
ON public.athlete_training_goals FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.teams t
        JOIN public.profiles p ON p.team_id = t.id
        WHERE t.coach_id = auth.uid() AND p.id = athlete_training_goals.athlete_id
    )
);

-- RLS Policies for athlete_streaks
CREATE POLICY "Athletes can manage their own streaks"
ON public.athlete_streaks FOR ALL
USING (auth.uid() = athlete_id);

CREATE POLICY "Coaches can view athlete streaks"
ON public.athlete_streaks FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.teams t
        JOIN public.profiles p ON p.team_id = t.id
        WHERE t.coach_id = auth.uid() AND p.id = athlete_streaks.athlete_id
    )
);

-- Function to automatically update streak when a session is completed
CREATE OR REPLACE FUNCTION update_athlete_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_date DATE;
    current_count INTEGER;
BEGIN
    -- Only update if session is marked as completed
    IF NEW.completed = true THEN
        -- Get or create streak record
        INSERT INTO public.athlete_streaks (athlete_id, current_streak, longest_streak, last_activity_date)
        VALUES (NEW.athlete_id, 0, 0, NEW.date)
        ON CONFLICT (athlete_id) DO NOTHING;

        -- Get current streak info
        SELECT last_activity_date, current_streak INTO last_date, current_count
        FROM public.athlete_streaks
        WHERE athlete_id = NEW.athlete_id;

        -- Update streak logic
        IF last_date IS NULL OR NEW.date > last_date THEN
            -- Check if this continues the streak (consecutive days)
            IF last_date IS NULL OR NEW.date = last_date + INTERVAL '1 day' THEN
                current_count := current_count + 1;
            ELSIF NEW.date > last_date + INTERVAL '1 day' THEN
                -- Streak broken, reset
                current_count := 1;
            END IF;

            -- Update the streak record
            UPDATE public.athlete_streaks
            SET 
                current_streak = current_count,
                longest_streak = GREATEST(longest_streak, current_count),
                last_activity_date = NEW.date,
                updated_at = now()
            WHERE athlete_id = NEW.athlete_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update streak on session completion
DROP TRIGGER IF EXISTS on_session_completed ON public.sessions;
CREATE TRIGGER on_session_completed
    AFTER INSERT OR UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_athlete_streak();

-- Function to update training goals progress
CREATE OR REPLACE FUNCTION update_training_goals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current progress for active goals when a session is completed
    IF NEW.completed = true THEN
        UPDATE public.athlete_training_goals
        SET 
            current_sessions = current_sessions + 1,
            current_distance = current_distance + COALESCE(NEW.distance_km, 0)
        WHERE 
            athlete_id = NEW.athlete_id
            AND start_date <= NEW.date
            AND end_date >= NEW.date;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update goals on session completion
DROP TRIGGER IF EXISTS on_session_completed_update_goals ON public.sessions;
CREATE TRIGGER on_session_completed_update_goals
    AFTER INSERT OR UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_training_goals();
