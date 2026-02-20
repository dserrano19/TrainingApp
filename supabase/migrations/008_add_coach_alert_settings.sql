-- Migration: Add Coach Alert Settings Table
-- Created: 2026-01-08

-- Table for coach alert configuration
CREATE TABLE IF NOT EXISTS public.coach_alert_settings (
    coach_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Pain threshold settings
    pain_threshold INTEGER DEFAULT 8 CHECK (pain_threshold >= 1 AND pain_threshold <= 10),
    pain_enabled BOOLEAN DEFAULT true,
    
    -- Injury risk settings
    injury_risk_threshold INTEGER DEFAULT 15 CHECK (injury_risk_threshold >= 5 AND injury_risk_threshold <= 50),
    injury_risk_enabled BOOLEAN DEFAULT true,
    
    -- Absence settings
    absence_days INTEGER DEFAULT 3 CHECK (absence_days >= 1),
    absence_enabled BOOLEAN DEFAULT false,
    
    -- Missing feedback settings
    missing_feedback_sessions INTEGER DEFAULT 2 CHECK (missing_feedback_sessions >= 1),
    missing_feedback_enabled BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.coach_alert_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Coaches can manage their own alert settings
CREATE POLICY "Coaches can manage their own alert settings"
ON public.coach_alert_settings FOR ALL
USING (
    auth.uid() = coach_id
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'COACH'
    )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_coach_alert_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS on_coach_alert_settings_updated ON public.coach_alert_settings;
CREATE TRIGGER on_coach_alert_settings_updated
    BEFORE UPDATE ON public.coach_alert_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_coach_alert_settings_updated_at();

-- Function to create default settings for new coaches
CREATE OR REPLACE FUNCTION create_default_coach_alert_settings()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'COACH' THEN
        INSERT INTO public.coach_alert_settings (coach_id)
        VALUES (NEW.id)
        ON CONFLICT (coach_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default settings when a coach profile is created
DROP TRIGGER IF EXISTS on_coach_profile_created ON public.profiles;
CREATE TRIGGER on_coach_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_default_coach_alert_settings();
