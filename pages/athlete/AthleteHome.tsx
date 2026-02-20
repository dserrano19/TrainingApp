import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { getCurrentStreak } from '../../utils/statsCalculations';

const formatDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const COMPETITION_DATES = ['2024-11-02', '2024-11-03', '2024-11-16'];

const UPCOMING_COMPETITIONS = [
  { id: 'c1', title: 'Camp. Autonómico', date: '15 NOV', location: 'Valencia, ES', days: 12, category: 'A' },
  { id: 'c2', title: 'Gran Premio Madrid', date: '22 NOV', location: 'Madrid, ES', days: 19, category: 'B' },
  { id: 'c3', title: 'Copa de Clubes', date: '30 NOV', location: 'Barcelona, ES', days: 27, category: 'A' },
  { id: 'c4', title: 'Nacional PC', date: '15 FEB', location: 'Madrid, ES', days: 104, category: 'Elite' },
];

// Placeholder data for DEMO/TESTING mode
const MOCK_SESSIONS: Record<string, any> = {};
const todayKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
MOCK_SESSIONS[todayKey] = {
  id: 'today',
  title: 'Intervalos VO2 Max',
  type: 'RUN',
  desc: 'Fase de Base • Semana 4',
  icon: 'sprint',
  location: 'Pista de Vallehermoso',
  time: '18:30',
  date: todayKey
};

const AthleteHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Data States
  const [sessions, setSessions] = useState<Record<string, any>>({});
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);

  // UI States
  const [location, setLocation] = useState<{ city: string; temp: string; condition: string; loading: boolean }>({
    city: "Madrid, ES",
    temp: "19°",
    condition: "Despejado",
    loading: true
  });
  const [healthMetrics, setHealthMetrics] = useState({ recovery: 0, sleepHours: 0, sleepMins: 0 });

  // Health Integration State
  const [isHealthLinked, setIsHealthLinked] = useState(false);
  const [isConnectingHealth, setIsConnectingHealth] = useState(false);

  // AI Insights State
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchStreak();
      fetchSessions();
      fetchCompetitions();
    } else {
      // Demo mode: Set sessions and user profile. Competitions are handled directly in useMemo.
      setSessions(MOCK_SESSIONS);
      setUserProfile({
        first_name: 'Alex',
        last_name: 'Straton',
        avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFbbOVr_Zcy7nHudr4kELDzwgKvaJgNxZ5LY8GbJqh-gua27Qkh8-5HEmFrum3pG3Cmy8YmdBJvpuwq3Xe8fN9-cdriU3YlprTuGc_ziGpyAJwxrqDjXRBQhX6JW83Jr8fDc52YDYkvPzjgor5BmiqNZjHxx6kcKPlmwif97of2n4eRLzhTJie6qo7zCXTXwNqjSXe15o54q9Ej9ZcdjmEI4tsqgahrBg3mDTeaOzqgYmHM1mcyRZ331m5kOFfONJufunfqWxtbQ"
      });
      setStreak(20);
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) fetchHealthMetrics();
  }, [selectedDate, user]);

  const fetchUserProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, teams(name)')
      .eq('id', user.id)
      .single();
    if (data) setUserProfile(data);
  };

  const fetchStreak = async () => {
    if (!user) return;
    const streakVal = await getCurrentStreak(user.id);
    setStreak(streakVal);
  };

  const fetchSessions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .eq('athlete_id', user.id);

    if (data) {
      const map: Record<string, any> = {};
      data.forEach(s => {
        map[s.date] = s;
      });
      setSessions(map);
    }
  };

  const fetchCompetitions = async () => {
    if (!user) return;

    // First get the coach_id from the athlete's team
    const { data: profile } = await supabase
      .from('profiles')
      .select('team_id, teams:team_id(coach_id)')
      .eq('id', user.id)
      .single();

    const coachId = (profile?.teams as any)?.coach_id;

    if (coachId) {
      const { data } = await supabase
        .from('competitions')
        .select('*')
        .eq('coach_id', coachId)
        .order('date', { ascending: true });

      if (data) {
        setCompetitions(data);
      }
    }
  };

  const fetchHealthMetrics = async () => {
    if (!user) return;
    const dateKey = formatDateKey(selectedDate);
    const { data } = await supabase
      .from('athlete_daily_metrics')
      .select('*')
      .eq('athlete_id', user.id)
      .eq('date', dateKey)
      .single();

    if (data) {
      setHealthMetrics({
        recovery: data.recovery || 0,
        sleepHours: Math.floor(data.sleep_hours || 0),
        sleepMins: Math.round(((data.sleep_hours || 0) % 1) * 60)
      });
    } else {
      setHealthMetrics({ recovery: 0, sleepHours: 0, sleepMins: 0 });
    }
  };

  const syncHealthMetrics = async (newMetrics: any) => {
    if (!user) return;
    const dateKey = formatDateKey(selectedDate);
    const sleep_hours = newMetrics.sleepHours + (newMetrics.sleepMins / 60);

    const { error } = await supabase
      .from('athlete_daily_metrics')
      .upsert({
        athlete_id: user.id,
        date: dateKey,
        recovery: newMetrics.recovery,
        sleep_hours: parseFloat(sleep_hours.toFixed(2))
      }, { onConflict: 'athlete_id,date' });

    if (error) {
      console.error('Error syncing metrics:', error);
      alert('Error sincronizando métricas: ' + error.message);
    } else {
      fetchHealthMetrics();
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
          if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
            setLocation(prev => ({ ...prev, loading: false }));
            return;
          }
          const genAI = new GoogleGenAI({ apiKey });
          const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{
              role: 'user',
              parts: [{ text: `Busca el clima actual para lat:${latitude}, lon:${longitude}. Responde SOLO un JSON: {"city": "Ciudad", "temp": "XX°", "condition": "Sunny/Cloudy"}` }]
            }]
          });
          const text = response.text || "";
          const jsonMatch = text.match(/\{.*\}/s);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            setLocation({
              city: data.city || "Ubicación Actual",
              temp: data.temp || "19°",
              condition: data.condition || "Despejado",
              loading: false
            });
          }
        } catch (error) {
          setLocation(prev => ({ ...prev, loading: false }));
        }
      }, () => {
        setLocation(prev => ({ ...prev, loading: false }));
      });
    } else {
      setLocation(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Initialize Health State
  useEffect(() => {
    const linked = localStorage.getItem('health_linked') === 'true';
    if (linked) {
      setIsHealthLinked(true);
      // Simulate that we have fresh data if it's 0
      setHealthMetrics(prev => {
        if (prev.sleepHours === 0) return { ...prev, sleepHours: 7, sleepMins: 42 };
        return prev;
      });
    }
  }, []);

  const connectHealth = async () => {
    setIsConnectingHealth(true);
    // Simulate Apple Health Auth Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsHealthLinked(true);
    localStorage.setItem('health_linked', 'true');

    // Simulate fetching data from HealthKit
    const newMetrics = { ...healthMetrics, sleepHours: 7, sleepMins: 42 };
    setHealthMetrics(newMetrics);

    // Persist to Supabase
    await syncHealthMetrics(newMetrics);

    setIsConnectingHealth(false);
  };

  const generateAIInsight = async (session: any, weather: any) => {
    if (isLoadingInsight || !firstName) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') return;

    setIsLoadingInsight(true);
    try {
      const genAI = new GoogleGenAI({ apiKey });
      const sessionText = session ? `${session.title} (${session.desc})` : 'Día de descanso';
      const prompt = `Eres un entrenador de atletismo experto. Basado en el entrenamiento de hoy: ${sessionText} y el clima en ${weather.city}: ${weather.temp}, ${weather.condition}, dale un consejo corto (máx 20 palabras) y motivador a ${firstName}. Responde solo el texto del consejo en español. Evita saludos genéricos, ve directo al grano.`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }]
      });

      setAiInsight(response.text || "¡A darlo todo en el entrenamiento!");
    } catch (error) {
      console.error("Error generating AI insight:", error);
      setAiInsight("¡Mantén el foco en tus objetivos hoy!");
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // Trigger AI Insight generation
  useEffect(() => {
    if (location.loading) return;

    const dateKey = formatDateKey(selectedDate);
    const session = sessions[dateKey];

    // Simple debouncing or preventing redundant calls
    const timer = setTimeout(() => {
      generateAIInsight(session, location);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedDate, sessions, location.loading]);

  const weekDays = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(new Date(today).setDate(diff));

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, []);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Process data for UI
  const selectedDateKey = formatDateKey(selectedDate);
  const sessionForSelected = sessions[selectedDateKey];

  const dayName = selectedDate.toLocaleDateString('es-ES', { weekday: 'long' });
  const fullDate = selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  const timeStr = currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const firstName = userProfile?.first_name || userProfile?.full_name?.split(' ')[0] || 'Atleta';
  const displayName = userProfile?.full_name || (userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : "Cargando...");
  const avatarUrl = userProfile?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAFbbOVr_Zcy7nHudr4kELDzwgKvaJgNxZ5LY8GbJqh-gua27Qkh8-5HEmFrum3pG3Cmy8YmdBJvpuwq3Xe8fN9-cdriU3YlprTuGc_ziGpyAJwxrqDjXRBQhX6JW83Jr8fDc52YDYkvPzjgor5BmiqNZjHxx6kcKPlmwif97of2n4eRLzhTJie6qo7zCXTXwNqjSXe15o54q9Ej9ZcdjmEI4tsqgahrBg3mDTeaOzqgYmHM1mcyRZ331m5kOFfONJufunfqWxtbQ";

  // Calculate upcoming competitions for the banner
  const upcomingCompetitions = useMemo(() => {
    // In demo mode, use the exact static data requested
    if (!user) {
      return UPCOMING_COMPETITIONS;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return competitions
      .filter(c => new Date(c.date) >= today)
      .slice(0, 5)
      .map(c => {
        const cDate = new Date(c.date);
        const diffTime = Math.abs(cDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          id: c.id,
          title: c.title || c.name || 'Competición',
          date: cDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).toUpperCase(),
          location: c.location || 'Ubicación N/D',
          days: diffDays,
          category: c.category || 'General'
        };
      });
  }, [competitions, user]);

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500 bg-bg-app min-h-screen">
      <div className="sticky top-0 z-30 bg-bg-app/95 backdrop-blur-xl border-b border-widget-border pt-12">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-zinc-800 border border-widget-border overflow-hidden">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${avatarUrl}')` }}></div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold leading-tight font-label">Hola, {firstName}</span>
              <span className="text-sm font-bold tracking-tight text-text-primary leading-tight">{displayName}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/notifications')} className="relative size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-primary">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent border-2 border-bg-app"></span>
            </button>
            <div className="flex items-center gap-2 bg-widget border border-widget-border rounded-full px-3.5 py-1.5 shadow-sm">
              <span className="material-symbols-outlined text-accent text-[18px] icon-fill">local_fire_department</span>
              <span className="text-white text-xs font-nums font-bold tabular-nums tracking-wide">{streak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Join Team Banner (Hidden if already in a team or loading) */}
      {
        user && userProfile && !userProfile.teams && (
          <div className="mx-6 mt-4 animate-in slide-in-from-top-4 duration-700">
            <div
              onClick={() => navigate('/profile')}
              className="group relative bg-accent rounded-[1.5rem] p-5 border border-black/10 overflow-hidden shadow-xl active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-5xl text-black icon-fill">groups</span>
              </div>
              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 font-label">Acción Requerida</span>
                <h3 className="text-xl font-black text-black font-label leading-tight mt-1">Vincular con Entrenador</h3>
                <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest mt-2 flex items-center gap-1.5 font-label">
                  Pulsa para introducir tu Hashtag
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </p>
              </div>
            </div>
          </div>
        )
      }

      <div className="px-6 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-text-secondary font-label uppercase tracking-widest text-[11px] font-bold">
            <span className="text-accent-dim">{isSameDay(selectedDate, new Date()) ? 'Hoy' : dayName}</span>
            <span className="opacity-20">•</span>
            <span className="text-text-primary">{fullDate}</span>
          </div>
          <span className="text-[13px] font-bold text-text-secondary font-numbers tracking-tight tabular-nums opacity-60">
            {timeStr}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 bg-widget rounded-[1.5rem] p-6 flex items-center justify-between relative overflow-hidden shadow-xl border border-widget-border">
            <div className="relative z-10 flex flex-col justify-between h-full gap-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                <span className="material-symbols-outlined text-[16px] text-accent">location_on</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">{location.city}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold text-white font-numbers tracking-tighter tabular-nums">
                  {location.temp.replace('°', '')}
                  <span className="text-accent">°</span>
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide font-label">
                  {location.loading ? "Localizando..." : location.condition}
                </span>
              </div>
            </div>
            <span className={`material-symbols-outlined text-[64px] text-accent relative z-10 ${location.loading ? 'animate-pulse opacity-40' : ''}`}>
              {location.condition.toLowerCase().includes('nub') ? 'cloudy' : 'sunny'}
            </span>
          </div>

          <div className="bg-widget rounded-[1.5rem] p-5 flex flex-col justify-between h-32 relative overflow-hidden group border border-widget-border transition-all duration-500">
            <div className="absolute -top-2 -right-2 p-4 opacity-5">
              <span className="material-symbols-outlined text-[80px] text-white">ecg_heart</span>
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-label z-10">Recuperación</span>
            <div className="flex items-baseline gap-1 z-10 animate-in fade-in slide-in-from-left-2 duration-700">
              <span className="text-4xl font-bold text-white font-numbers tracking-tighter">{healthMetrics.recovery}</span>
              <span className="text-lg font-bold text-accent font-numbers">%</span>
            </div>
            <button
              onClick={() => {
                const val = prompt('Progreso de recuperación (0-100%):', healthMetrics.recovery.toString());
                if (val) syncHealthMetrics({ ...healthMetrics, recovery: parseInt(val) });
              }}
              className="mt-2 text-[8px] font-bold text-accent uppercase tracking-widest text-left hover:underline z-20"
            >
              Actualizar →
            </button>
          </div>

          {/* Sleep Widget with Health Integration Simulator */}
          <div className="bg-widget rounded-[1.5rem] p-5 flex flex-col justify-between h-32 relative overflow-hidden group border border-widget-border transition-all duration-500">
            <div className="absolute -top-2 -right-2 p-4 opacity-5">
              <span className="material-symbols-outlined text-[80px] text-white">bedtime</span>
            </div>

            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-label">Sueño</span>
              {isHealthLinked && (
                <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-bold text-white/50 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[10px]">favorite</span>
                  Salud
                </div>
              )}
            </div>

            {isHealthLinked ? (
              <>
                <div className="flex items-baseline gap-1 z-10 animate-in fade-in slide-in-from-left-2 duration-700">
                  <span className="text-3xl font-bold text-white font-numbers tracking-tighter">{healthMetrics.sleepHours}</span>
                  <span className="text-[10px] text-gray-500 font-bold font-numbers uppercase">h</span>
                  <span className="text-3xl font-bold text-white font-numbers tracking-tighter ml-1">{healthMetrics.sleepMins}</span>
                  <span className="text-[10px] text-gray-500 font-bold font-numbers uppercase">m</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-widest">Sincronizado</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-start justify-end h-full z-10 pb-1">
                <button
                  onClick={connectHealth}
                  disabled={isConnectingHealth}
                  className="group/btn flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 pr-3 pl-2 py-1.5 rounded-lg transition-all active:scale-95"
                >
                  {isConnectingHealth ? (
                    <>
                      <span className="size-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider">Conectando...</span>
                    </>
                  ) : (
                    <>
                      <div className="size-5 rounded bg-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-black text-[12px]">favorite</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider leading-none">Conectar</span>
                        <span className="text-[7px] font-bold text-gray-500 uppercase tracking-wider leading-none mt-0.5">Apple Health</span>
                      </div>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Proximas Competiciones - Banner Deslizable */}
        {upcomingCompetitions.length > 0 && (
          <section className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between px-1">
              <h1 className="text-lg font-bold tracking-tight text-text-primary leading-none font-label uppercase tracking-widest">Próximas Citas</h1>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-label">Desliza para ver más</span>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-1 px-1">
              {upcomingCompetitions.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => navigate(`/competition-confirmation/${comp.id}`)}
                  className="snap-start shrink-0 w-[calc(50%-6px)] bg-widget rounded-3xl p-5 border border-widget-border shadow-xl flex flex-col justify-between h-40 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-accent/5 rounded-full blur-xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-accent/10 border border-accent/20 text-accent text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Cat. {comp.category}</span>
                      <span className="text-white/30 material-symbols-outlined text-[18px]">event_available</span>
                    </div>
                    <h3 className="text-white font-bold text-sm font-label leading-tight line-clamp-2">{comp.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      <span className="text-[9px] font-medium truncate uppercase tracking-tighter">{comp.location}</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-end justify-between border-t border-white/5 pt-3">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest font-label">Faltan</span>
                      <span className="text-xl font-black text-accent font-numbers leading-none">{comp.days} <span className="text-[9px] text-gray-400 uppercase">Días</span></span>
                    </div>
                    <div className="text-[10px] font-bold text-white font-nums tabular-nums opacity-60">{comp.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TARJETA DE ENTRENAMIENTO ACTUALIZADA */}
        <div className="mt-4">
          <div className="flex items-end justify-between mb-4 px-1">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary leading-none font-label">Plan del Día</h1>
          </div>
          {sessionForSelected ? (
            <div
              className={`relative w-full rounded-[2rem] overflow-hidden shadow-2xl border transition-all ${sessionForSelected.isCompetition ? 'border-blue-500/30 ring-1 ring-blue-500/20' : 'border-widget-border'}`}
            >
              <div className="absolute inset-0 z-0 bg-widget"></div>
              {sessionForSelected.isCompetition && (
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <span className="material-symbols-outlined text-[120px] text-blue-400">emoji_events</span>
                </div>
              )}

              <div className="relative z-10 p-7 flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full shadow-lg ${sessionForSelected.isCompetition ? 'bg-blue-600 text-white' : 'bg-accent text-black'}`}>
                    <span className="text-[10px] font-bold tracking-widest uppercase font-label">
                      {sessionForSelected.isCompetition ? 'Competición' : 'Entrenamiento'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (sessionForSelected.isCompetition) navigate(`/competition-confirmation/${sessionForSelected.id}`);
                      else navigate(`/session/${sessionForSelected.id}`);
                    }}
                    className="bg-black/40 dark:bg-white/10 backdrop-blur-md h-9 w-9 flex items-center justify-center rounded-full border border-white/10 text-white dark:text-accent active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>

                <div onClick={() => navigate(`/session/${sessionForSelected.id}`)} className="cursor-pointer">
                  <h2 className="text-2xl font-bold text-white leading-tight mb-2 tracking-tight">{sessionForSelected.title}</h2>
                  <div className="flex items-center gap-2 text-gray-300 text-[11px] font-bold uppercase tracking-wider font-label mb-4">
                    <span className={`material-symbols-outlined text-[18px] icon-fill ${sessionForSelected.isCompetition ? 'text-blue-400' : 'text-accent'}`}>{sessionForSelected.icon || 'sprint'}</span>
                    <span className="text-white">{sessionForSelected.desc || 'Sin descripción'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                      <span className="material-symbols-outlined text-accent text-sm">location_on</span>
                      <span className="text-[10px] font-bold text-gray-300 uppercase truncate">{sessionForSelected.location || 'Localización N/D'}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                      <span className="material-symbols-outlined text-accent text-sm">schedule</span>
                      <span className="text-[10px] font-bold text-gray-300 uppercase">{sessionForSelected.time || '--:--'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/log-session/${sessionForSelected.id}`)}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all active:scale-[0.98] shadow-xl ${sessionForSelected.isCompetition ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-accent text-black shadow-accent/20'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">edit_square</span>
                  Registrar Diario
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full bg-widget rounded-[2rem] p-8 border border-widget-border flex flex-col items-center justify-center text-center gap-3">
              <div className="size-12 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                <span className="material-symbols-outlined">bedtime</span>
              </div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-label">nada programado por ahora, avisa a tu entrenador</p>
            </div>
          )}
        </div>

        {/* AI Training Insight Section */}
        {(aiInsight || isLoadingInsight) && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative bg-gradient-to-br from-widget to-black/40 rounded-[2rem] p-6 border border-accent/20 overflow-hidden shadow-2xl group transition-all duration-500 hover:border-accent/40">
              {/* Decorative AI Sparkles */}
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="material-symbols-outlined text-[100px] text-accent animate-pulse">auto_awesome</span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-lg bg-accent/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-accent icon-fill">neurology</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/80 font-label">Consejo de la IA</span>
                </div>

                {isLoadingInsight ? (
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/5 rounded-full animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-white/5 rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-white/90 leading-relaxed font-label italic pr-12">
                    "{aiInsight}"
                  </p>
                )}

                {!isLoadingInsight && aiInsight && (
                  <div className="mt-4 flex items-center gap-1.5">
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Optimizado para hoy</span>
                    <div className="h-px flex-1 bg-white/10"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <section className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between px-1">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary leading-none font-label">Tu Agenda</h1>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-label">Semana Actual</span>
          </div>

          <div className="flex flex-col gap-3">
            {weekDays.map((date, i) => {
              const dateKey = formatDateKey(date);
              const session = sessions[dateKey];
              const isToday = isSameDay(date, new Date());
              const isPast = date < new Date() && !isToday;

              const isComp = competitions.some(c => c.date === dateKey);
              if (!session && !isComp) return null;

              const displayItem = session || (isComp ? { ...competitions.find(c => c.date === dateKey), isCompetition: true, type: 'COMPETITION', title: 'Competición' } : null);

              if (!displayItem) return null;

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (displayItem.isCompetition) navigate(`/competition-confirmation/${displayItem.id}`);
                    else setSelectedDate(date);
                  }}
                  className={`flex items-center justify-between p-4 rounded-3xl border transition-all cursor-pointer active:scale-[0.98] 
                    ${isToday ? (displayItem.isCompetition ? 'bg-blue-900/20 border-blue-500/50 shadow-xl' : 'bg-widget border-accent/40 shadow-xl') :
                      isPast ? 'bg-widget/40 border-widget-border opacity-60' :
                        (displayItem.isCompetition ? 'bg-blue-500/10 border-blue-500/30' : 'bg-widget border-widget-border')}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex flex-col items-center justify-center size-12 rounded-2xl border transition-colors
                      ${isToday ? (displayItem.isCompetition ? 'bg-blue-600 text-white border-blue-400' : 'bg-accent text-black border-accent') :
                        displayItem.isCompetition ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-black/20 text-gray-400 border-white/5'}
                    `}>
                      <span className="text-[9px] font-bold uppercase leading-none mb-1">{date.toLocaleDateString('es-ES', { month: 'short' })}</span>
                      <span className="text-lg font-bold font-nums leading-none">{date.getDate()}</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold font-label ${isToday ? 'text-white' : 'text-gray-200'}`}>{displayItem.title}</h4>
                        {displayItem.isCompetition && (
                          <span className="text-[8px] font-black uppercase bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">Competición</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{displayItem.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {displayItem.completed ? (
                      <span className="material-symbols-outlined text-emerald-500 text-xl icon-fill">check_circle</span>
                    ) : isPast ? (
                      <span className="material-symbols-outlined text-red-500/50 text-xl">error</span>
                    ) : (
                      <span className={`material-symbols-outlined text-xl ${displayItem.isCompetition ? 'text-blue-400' : 'text-gray-700'}`}>
                        {displayItem.isCompetition ? 'emoji_events' : 'schedule'}
                      </span>
                    )}
                    <span className={`material-symbols-outlined ${isToday ? (displayItem.isCompetition ? 'text-blue-400' : 'text-accent') : 'text-gray-600'}`}>chevron_right</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AthleteHome;
