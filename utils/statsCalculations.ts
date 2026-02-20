import { supabase } from '../components/supabaseClient';


/**
 * Calculate total distance for a given period
 */
export async function calculateTotalDistance(
    athleteId: string,
    startDate: string,
    endDate: string
): Promise<number> {
    const { data, error } = await supabase
        .from('sessions')
        .select('distance_km')
        .eq('athlete_id', athleteId)
        .eq('completed', true)
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) {
        console.error('Error calculating total distance:', error);
        return 0;
    }

    return data.reduce((sum, session) => sum + (session.distance_km || 0), 0);
}

/**
 * Count sessions by type for a given period
 */
export async function countSessionsByType(
    athleteId: string,
    startDate: string,
    endDate: string
): Promise<{ track: number; gym: number; competition: number; other: number }> {
    const { data, error } = await supabase
        .from('sessions')
        .select('session_type')
        .eq('athlete_id', athleteId)
        .eq('completed', true)
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) {
        console.error('Error counting sessions:', error);
        return { track: 0, gym: 0, competition: 0, other: 0 };
    }

    const counts = {
        track: 0,
        gym: 0,
        competition: 0,
        other: 0
    };

    data.forEach(session => {
        const type = session.session_type?.toLowerCase();
        if (type === 'track') counts.track++;
        else if (type === 'gym') counts.gym++;
        else if (type === 'competition') counts.competition++;
        else counts.other++;
    });

    return counts;
}

/**
 * Get current streak for an athlete
 * Streak accumulates only after 5 consecutive days of completed sessions/logs.
 */
export async function getCurrentStreak(athleteId: string): Promise<number> {
    // We try to fetch from sessions directly to ensure accuracy
    const { data, error } = await supabase
        .from('sessions')
        .select('date')
        .eq('athlete_id', athleteId)
        .eq('completed', true)
        .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
        return 0;
    }

    // Get unique dates
    const uniqueDates = Array.from(new Set(data.map(s => s.date.split('T')[0]))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (uniqueDates.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if streak is active (completed today or yesterday)
    const lastCompleted = uniqueDates[0];
    if (lastCompleted !== today && lastCompleted !== yesterday) {
        return 0;
    }

    let streak = 0;
    let currentDate = new Date(lastCompleted);

    for (let i = 0; i < uniqueDates.length; i++) {
        const dateStr = uniqueDates[i];

        // Ensure consecutive days
        const checkDate = new Date(currentDate);
        const recordDate = new Date(dateStr);

        // Helper to ignore time for comparison
        const isSameDay = (d1: Date, d2: Date) => d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];

        if (isSameDay(checkDate, recordDate)) {
            streak++;
            // Move expectation to previous day
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            // Gap found
            break;
        }
    }

    // Rule: Return the actual streak
    return streak;
}

/**
 * Get training goal progress for current period
 */
export async function getTrainingGoalProgress(
    athleteId: string,
    periodType: 'WEEKLY' | 'MONTHLY'
): Promise<{
    targetDistance: number;
    currentDistance: number;
    targetSessions: number;
    currentSessions: number;
    progress: number;
} | null> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('athlete_training_goals')
        .select('*')
        .eq('athlete_id', athleteId)
        .eq('period_type', periodType)
        .lte('start_date', today)
        .gte('end_date', today)
        .order('start_date', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) {
        return null;
    }

    const progress = data.target_distance > 0
        ? Math.round((data.current_distance / data.target_distance) * 100)
        : 0;

    return {
        targetDistance: data.target_distance || 0,
        currentDistance: data.current_distance || 0,
        targetSessions: data.target_sessions || 0,
        currentSessions: data.current_sessions || 0,
        progress
    };
}

/**
 * Get performance records for a specific event
 */
export async function getPerformanceRecords(
    athleteId: string,
    eventType: string,
    limit: number = 10
): Promise<Array<{ date: string; time: number; location?: string }>> {
    const { data, error } = await supabase
        .from('athlete_performance_records')
        .select('date, time_seconds, location')
        .eq('athlete_id', athleteId)
        .eq('event_type', eventType)
        .order('date', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching performance records:', error);
        return [];
    }

    return data.map(record => ({
        date: record.date,
        time: record.time_seconds,
        location: record.location
    }));
}

/**
 * Get personal best for a specific event
 */
export async function getPersonalBest(
    athleteId: string,
    eventType: string
): Promise<{ time: number; date: string } | null> {
    const { data, error } = await supabase
        .from('athlete_performance_records')
        .select('time_seconds, date')
        .eq('athlete_id', athleteId)
        .eq('event_type', eventType)
        .order('time_seconds', { ascending: true })
        .limit(1)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        time: data.time_seconds,
        date: data.date
    };
}

/**
 * Get weekly evolution data (last 7 days)
 */
export async function getWeeklyEvolution(
    athleteId: string
): Promise<number[]> {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const { data, error } = await supabase
        .from('sessions')
        .select('date, distance_km')
        .eq('athlete_id', athleteId)
        .eq('completed', true)
        .gte('date', weekAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0]);

    if (error) {
        console.error('Error fetching weekly evolution:', error);
        return [0, 0, 0, 0, 0, 0, 0];
    }

    // Create array for each day of the week
    const evolution = new Array(7).fill(0);
    const dayMap: { [key: string]: number } = {};

    data.forEach(session => {
        const sessionDate = new Date(session.date);
        const dayIndex = Math.floor((sessionDate.getTime() - weekAgo.getTime()) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < 7) {
            evolution[dayIndex] += session.distance_km || 0;
        }
    });

    // Convert to percentages for visualization (0-100)
    const maxDistance = Math.max(...evolution, 1);
    return evolution.map(dist => Math.round((dist / maxDistance) * 100));
}

/**
 * Get monthly evolution data (last 4 weeks)
 */
export async function getMonthlyEvolution(
    athleteId: string
): Promise<number[]> {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 27); // 4 weeks

    const { data, error } = await supabase
        .from('sessions')
        .select('date, distance_km')
        .eq('athlete_id', athleteId)
        .eq('completed', true)
        .gte('date', monthAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0]);

    if (error) {
        console.error('Error fetching monthly evolution:', error);
        return [0, 0, 0, 0];
    }

    // Create array for each week
    const evolution = new Array(4).fill(0);

    data.forEach(session => {
        const sessionDate = new Date(session.date);
        const weekIndex = Math.floor((sessionDate.getTime() - monthAgo.getTime()) / (1000 * 60 * 60 * 24 * 7));
        if (weekIndex >= 0 && weekIndex < 4) {
            evolution[weekIndex] += session.distance_km || 0;
        }
    });

    // Convert to percentages for visualization (0-100)
    const maxDistance = Math.max(...evolution, 1);
    return evolution.map(dist => Math.round((dist / maxDistance) * 100));
}

/**
 * Get annual evolution data (last 12 months)
 */
export async function getAnnualEvolution(
    athleteId: string
): Promise<number[]> {
    const today = new Date();
    const yearAgo = new Date(today);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    const { data, error } = await supabase
        .from('sessions')
        .select('date, distance_km')
        .eq('athlete_id', athleteId)
        .eq('completed', true)
        .gte('date', yearAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0]);

    if (error) {
        console.error('Error fetching annual evolution:', error);
        return new Array(12).fill(0);
    }

    // Create array for each month
    const evolution = new Array(12).fill(0);

    data.forEach(session => {
        const sessionDate = new Date(session.date);
        const monthDiff = (today.getFullYear() - sessionDate.getFullYear()) * 12 + (today.getMonth() - sessionDate.getMonth());
        // We want the index 11 to be current month, 0 to be 11 months ago
        const index = 11 - monthDiff;

        if (index >= 0 && index < 12) {
            evolution[index] += session.distance_km || 0;
        }
    });

    // Convert to percentages for visualization (0-100)
    const maxDistance = Math.max(...evolution, 1);
    return evolution.map(dist => Math.round((dist / maxDistance) * 100));
}

/**
 * Calculate laps from distance (assuming 400m track)
 */
export function calculateLaps(distanceKm: number): number {
    return (distanceKm * 1000) / 400;
}

/**
 * Get date range for period type
 */
export function getDateRange(periodType: 'WEEKLY' | 'MONTHLY' | 'ANNUAL'): { start: string; end: string } {
    const today = new Date();
    const start = new Date(today);

    if (periodType === 'WEEKLY') {
        // Start from Monday of current week
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
    } else if (periodType === 'MONTHLY') {
        // Start from first day of current month
        start.setDate(1);
    } else {
        // Start from first day of the year
        start.setMonth(0, 1);
    }

    return {
        start: start.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
    };
}
