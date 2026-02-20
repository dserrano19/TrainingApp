import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface DailyLog {
    id: string;
    athlete_name: string;
    recovery: number | null;
    sleep_hours: number | null;
    soreness: number | null;
    stress: number | null;
    session_status: 'COMPLETED' | 'PENDING' | 'MISSING';
    date: string;
}

const CoachDailyLogs: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState<string>('all');
    const [teams, setTeams] = useState<{ id: string, name: string }[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (user) {
            fetchTeams();
            fetchLogs();

            // Subscribe to real-time changes
            const metricsSubscription = supabase
                .channel('public:athlete_daily_metrics')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'athlete_daily_metrics' }, () => {
                    fetchLogs();
                })
                .subscribe();

            const sessionsSubscription = supabase
                .channel('public:sessions')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, () => {
                    fetchLogs();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(metricsSubscription);
                supabase.removeChannel(sessionsSubscription);
            };
        }
    }, [user, selectedTeam, selectedDate]);

    const fetchTeams = async () => {
        const { data } = await supabase.from('teams').select('id, name').eq('coach_id', user?.id);
        if (data) setTeams(data);
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            // 1. Fetch athletes for the coach's teams
            let query = supabase
                .from('profiles')
                .select('id, full_name, team_id')
                .eq('role', 'ATHLETE');

            if (selectedTeam !== 'all') {
                query = query.eq('team_id', selectedTeam);
            } else {
                // Only athletes in teams owned by this coach
                const { data: coachTeams } = await supabase.from('teams').select('id').eq('coach_id', user?.id);
                const teamIds = coachTeams?.map(t => t.id) || [];
                query = query.in('team_id', teamIds);
            }

            const { data: athletes } = await query;
            if (!athletes || athletes.length === 0) {
                setLogs([]);
                setLoading(false);
                return;
            }

            // 2. Fetch metrics for these athletes on selected date
            const athleteIds = athletes.map(a => a.id);
            const { data: metrics } = await supabase
                .from('athlete_daily_metrics')
                .select('*')
                .in('athlete_id', athleteIds)
                .eq('date', selectedDate);

            // 3. Fetch session statuses
            const { data: sessions } = await supabase
                .from('sessions')
                .select('athlete_id, rpe, feedback')
                .in('athlete_id', athleteIds)
                .eq('date', selectedDate);

            // 4. Combine data
            const combinedLogs: DailyLog[] = athletes.map(athlete => {
                const m = metrics?.find(met => met.athlete_id === athlete.id);
                const s = sessions?.filter(sess => sess.athlete_id === athlete.id);

                // Determine session status: if any session exists, check if any has RPE (completed)
                let status: 'COMPLETED' | 'PENDING' | 'MISSING' = 'MISSING';
                if (s && s.length > 0) {
                    const allCompleted = s.every(sess => sess.rpe !== null);
                    const anyCompleted = s.some(sess => sess.rpe !== null);
                    status = allCompleted ? 'COMPLETED' : anyCompleted ? 'COMPLETED' : 'PENDING';
                }

                return {
                    id: athlete.id,
                    athlete_name: athlete.full_name || 'Sin nombre',
                    recovery: m?.recovery || null,
                    sleep_hours: m?.sleep_hours || null,
                    soreness: m?.soreness || null,
                    stress: m?.stress || null,
                    session_status: status,
                    date: selectedDate
                };
            });

            setLogs(combinedLogs);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRecoveryColor = (val: number | null) => {
        if (val === null) return 'text-gray-400';
        if (val > 80) return 'text-emerald-500';
        if (val > 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-bg-app pb-24 animate-in fade-in duration-500">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 p-6 pt-12">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="size-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-black">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-black">Registros Diarios</h1>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-label">Monitorización en tiempo real</p>
                    </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-black focus:ring-2 focus:ring-accent outline-none"
                    />
                    <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-black focus:ring-2 focus:ring-accent outline-none min-w-[120px]"
                    >
                        <option value="all">Todos los equipos</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
            </header>

            <main className="p-4">
                {loading ? (
                    <div className="py-20 text-center space-y-4">
                        <div className="inline-block size-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-label">Sincronizando datos...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest font-label">Atleta</th>
                                        <th className="px-4 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest font-label text-center">Rec.</th>
                                        <th className="px-4 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest font-label text-center">Sueño</th>
                                        <th className="px-4 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest font-label text-center">Sesión</th>
                                        <th className="px-4 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest font-label text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <p className="text-xs text-text-muted font-medium">No hay registros para esta fecha.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-[10px] text-zinc-500">
                                                            {log.athlete_name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="text-xs font-bold text-black">{log.athlete_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`text-sm font-extrabold font-numbers ${getRecoveryColor(log.recovery)}`}>
                                                        {log.recovery !== null ? `${log.recovery}%` : '--'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center text-xs font-bold text-zinc-600 font-numbers uppercase tracking-tighter">
                                                    {log.sleep_hours !== null ? `${log.sleep_hours}h` : '--'}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <div className="flex items-center justify-center">
                                                        {log.session_status === 'COMPLETED' ? (
                                                            <span className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 scale-90">
                                                                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                                                            </span>
                                                        ) : log.session_status === 'PENDING' ? (
                                                            <span className="size-6 rounded-full bg-yellow-500 text-white flex items-center justify-center shadow-lg shadow-yellow-500/20 scale-90">
                                                                <span className="material-symbols-outlined text-[16px] font-bold">schedule</span>
                                                            </span>
                                                        ) : (
                                                            <span className="size-1.5 rounded-full bg-zinc-200"></span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <button onClick={() => navigate(`/athletes/${log.id}/performance`)} className="p-2 rounded-lg hover:bg-zinc-100 transition-colors">
                                                        <span className="material-symbols-outlined text-zinc-400 group-hover:text-black">monitoring</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="mt-8 flex flex-wrap gap-6 px-4">
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest font-label">Completado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-yellow-500"></span>
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest font-label">Pendiente</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-zinc-200"></span>
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest font-label">Sin Asignar</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CoachDailyLogs;
