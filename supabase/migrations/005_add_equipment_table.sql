-- Migration: Add Equipment Table for Shoes and Gear Management
-- Created: 2026-01-08

-- Table for athlete equipment (shoes, gear, etc.)
CREATE TABLE IF NOT EXISTS public.equipment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    athlete_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('RUNNING_SHOES', 'CYCLING_SHOES', 'BIKE', 'WETSUIT', 'OTHER')) NOT NULL DEFAULT 'RUNNING_SHOES',
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    purchase_date DATE,
    total_km DECIMAL DEFAULT 0,
    max_km DECIMAL DEFAULT 800, -- Recommended max km for running shoes
    status TEXT CHECK (status IN ('active', 'retired', 'backup')) NOT NULL DEFAULT 'active',
    notes TEXT,
    image_url TEXT
);

-- Enable RLS
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Athletes can manage their own equipment
CREATE POLICY "Athletes can manage their own equipment"
ON public.equipment FOR ALL
USING (auth.uid() = athlete_id);

-- RLS Policies: Coaches can view equipment of their team athletes
CREATE POLICY "Coaches can view athlete equipment"
ON public.equipment FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.teams t
        JOIN public.profiles p ON p.team_id = t.id
        WHERE t.coach_id = auth.uid() AND p.id = equipment.athlete_id
    )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_equipment_athlete_id ON public.equipment(athlete_id);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON public.equipment(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_equipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS on_equipment_updated ON public.equipment;
CREATE TRIGGER on_equipment_updated
    BEFORE UPDATE ON public.equipment
    FOR EACH ROW
    EXECUTE FUNCTION update_equipment_updated_at();
