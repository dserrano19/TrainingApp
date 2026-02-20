
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface DailySession {
  id: string;
  date: string;
  title: string;
  type: 'RUN' | 'SWIM' | 'GYM' | 'REST' | 'COMPETITION';
  desc: string;
  vol: string;
  intensity: 'Alta' | 'Media' | 'Baja';
  rpe: number;
  completed: boolean;
  tasks: Task[];
  isCompetition?: boolean;
}

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Fallback or dynamically loaded from DB
const FALLBACK_COMPETITION_DATES = ['2024-11-02', '2024-11-03', '2024-11-16'];

const INITIAL_SESSIONS: Record<string, DailySession> = {
  [getTodayKey()]: {
    id: 'today',
    date: getTodayKey(),
    title: 'Velocidad + Fuerza',
    type: 'RUN',
    desc: '4x400m • Sentadilla',
    vol: '2.4km',
    intensity: 'Alta',
    rpe: 8,
    completed: false,
    tasks: [
      { id: 't1', title: 'Calentamiento 15 min Z2', completed: false },
      { id: 't2', title: '4x400m al 90% (Rec 2 min)', completed: false },
      { id: 't3', title: '3x8 Sentadilla (70kg)', completed: false },
      { id: 't4', title: 'Core & Estiramientos', completed: false }
    ]
  },
  '2024-11-03': {
    id: 'comp1',
    date: '2024-11-03',
    title: 'Campeonato Regional',
    type: 'COMPETITION',
    desc: 'Evento Principal A • 10km Ruta',
    vol: '10km',
    intensity: 'Alta',
    rpe: 10,
    completed: false,
    isCompetition: true,
    tasks: [
      { id: 'ct1', title: 'Recogida de dorsal', completed: false },
      { id: 'ct2', title: 'Calentamiento específico', completed: false },
      { id: 'ct3', title: 'Carrera (Salida 09:30)', completed: false }
    ]
  }
};

const Diario: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [sessions, setSessions] = useState<Record<string, DailySession>>({});
  const [competitionDates, setCompetitionDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('athlete_id', user.id);

    if (error) {
      console.error('Error fetching sessions:', error);
    } else if (data) {
      const sessionsMap: Record<string, DailySession> = {};
      data.forEach((s: any) => {
        sessionsMap[s.date] = {
          id: s.id,
          date: s.date,
          title: s.title,
          type: s.type || 'RUN',
          desc: s.feedback || '', // Using feedback as generic desc for now or we might need another field
          vol: s.duration || '',
          intensity: 'Media', // Defaulting as it's not in the schema explicitly
          rpe: s.rpe || 0,
          completed: !!s.rpe,
          tasks: s.blocks ? s.blocks.flatMap((b: any) => b.tasks.map((t: any) => ({
            id: t.id,
            title: t.description,
            completed: t.isCompleted
          }))) : []
        };
      });
      setSessions(sessionsMap);
    }

    // Fetch Competition Dates
    const { data: compData } = await supabase
      .from('competitions')
      .select('date');
    if (compData) {
      setCompetitionDates(compData.map(c => c.date));
    }

    setLoading(false);
  };

  const monthName = viewDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Ajustar offset para que la semana empiece en Lunes (1)
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    // Rellenar hasta completar semanas
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [viewDate]);

  // Helper to reset time for accurate day comparisons
  const resetTime = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const displayedDays = useMemo(() => {
    if (!isExpanded) {
      // Find the Monday of the week containing selectedDate
      const d = resetTime(selectedDate);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      const monday = new Date(d);
      monday.setDate(diff);

      const week = [];
      for (let i = 0; i < 7; i++) {
        const nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        week.push(nextDay);
      }
      return week; // Only return the 7 days of the current week
    }

    // Default full month logic
    return calendarDays;
  }, [isExpanded, calendarDays, selectedDate]);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };


  // Helper to check status
  const getDayStatus = (date: Date) => {
    const dateKey = formatDateKey(date);
    const session = sessions[dateKey];
    const isToday = isSameDay(date, now);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;

    // 1. Competition (Blue)
    if (FALLBACK_COMPETITION_DATES.includes(dateKey) || competitionDates.includes(dateKey) || session?.isCompetition || session?.type === 'COMPETITION') {
      return 'blue';
    }

    // 2. Injury/Sickness (Orange) - Check type or specific flag if we had one
    if (session?.type === 'INJURY' || session?.title?.toLowerCase().includes('lesi') || session?.title?.toLowerCase().includes('molestia')) {
      return 'orange';
    }

    // 3. Completed (Green)
    // If session exists and is marked completed OR has RPE entered
    if (session?.completed || (session?.rpe && session.rpe > 0)) {
      return 'green';
    }

    // 4. Missing/Incomplete (Red)
    // If it's a past date (or today?) and NOT completed, and either a session was planned OR it's just a blank past day (if we want to shame for not logging rest)
    // Request said: "Red dot for days diary is NOT filled".
    if (isPast && (!session || !session.completed)) {
      return 'red';
    }

    return null;
  };

  const currentSession = sessions[formatDateKey(selectedDate)];

  const toggleTask = (sessionId: string, taskId: string) => {
    const dateKey = formatDateKey(selectedDate);
    const session = sessions[dateKey];
    if (!session) return;

    const newTasks = session.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    // const allCompleted = newTasks.every(t => t.completed); // Unused for now

    // Optimized update logic for DB could go here, but for now we just update local state
    // In a real app we'd want to persist this change to Supabase 'blocks' JSONB
    setSessions(prev => ({
      ...prev,
      [dateKey]: {
        ...session,
        tasks: newTasks,
        // completed: allCompleted // Don't auto-complete whole session just by tasks for now
      }
    }));
  };

  const completionPercentage = useMemo(() => {
    if (!currentSession || currentSession.tasks.length === 0) return 0;
    const completedCount = currentSession.tasks.filter(t => t.completed).length;
    return Math.round((completedCount / currentSession.tasks.length) * 100);
  }, [currentSession]);

  return (
    <div className="flex flex-col h-screen animate-in fade-in duration-300 bg-bg-app overflow-hidden">
      <header className="px-6 pt-16 pb-4 flex items-end justify-between bg-bg-app border-b border-widget-border transition-all duration-300">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary font-label">Diario</h1>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-0.5 font-label">Historial de Carga</p>
        </div>

        {/* Only show month navigation if expanded OR we want to allow skipping weeks (but simplified for now) */}
        <div className={`flex items-center gap-3 bg-widget border border-widget-border rounded-full px-4 py-2 shadow-lg transition-all duration-300 ${!isExpanded ? 'opacity-0 pointer-events-none scale-90 hidden' : 'opacity-100 scale-100'}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white capitalize font-label">{monthName}</span>
          <div className="flex gap-1 border-l border-white/10 pl-2">
            <button onClick={() => changeMonth(-1)} className="material-symbols-outlined text-white text-lg">chevron_left</button>
            <button onClick={() => changeMonth(1)} className="material-symbols-outlined text-white text-lg">chevron_right</button>
          </div>
        </div>
      </header>

      <div className={`p-4 grid grid-cols-7 gap-y-1 bg-bg-app transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[400px]' : 'max-h-24'}`}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div key={i} className="text-[10px] font-bold text-gray-500 text-center py-2 uppercase tracking-widest font-label">{d}</div>
        ))}
        {displayedDays.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} className="h-12" />; // Padding for month view

          const isSelected = isSameDay(date, selectedDate);
          const isToday = resetTime(date).getTime() === resetTime(new Date()).getTime();
          const status = getDayStatus(date);

          let dotClass = '';
          if (status === 'blue') dotClass = 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]';
          else if (status === 'green') dotClass = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
          else if (status === 'orange') dotClass = 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]';
          else if (status === 'red') dotClass = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';

          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedDate(date);
                // Sync viewDate if needed
                if (date.getMonth() !== viewDate.getMonth()) {
                  setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
                }
              }}
              className="flex flex-col items-center justify-center h-12 relative animate-in fade-in slide-in-from-top-1 duration-300"
            >
              <div className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-bold transition-all tabular-nums font-numbers
                ${isSelected ? 'bg-accent text-black shadow-lg scale-110 ring-2 ring-accent/20' :
                  isToday ? 'border-2 border-accent text-text-primary' : 'text-text-primary hover:bg-widget border border-transparent'}
              `}>
                {date.getDate()}
              </div>

              {/* Status Dot */}
              {status && (
                <div className={`mt-1 w-1.5 h-1.5 rounded-full transition-all duration-300 ${dotClass}`}></div>
              )}
            </button>
          );
        })}
      </div>

      <section
        className={`flex-1 bg-widget rounded-t-[2.5rem] border-t border-widget-border mt-2 p-8 shadow-2xl overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out transform ${isExpanded ? 'translate-y-0' : 'translate-y-2'}`}
        style={{ paddingBottom: '160px' }}
      >
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex flex-col items-center justify-center mb-6 cursor-pointer group pt-2 pb-4 hover:bg-white/5 rounded-t-xl transition-colors -mt-4"
        >
          <div className={`w-12 h-1.5 bg-gray-300/20 rounded-full transition-all duration-300 mb-2 ${isExpanded ? 'w-16 bg-accent/60' : 'w-12 group-hover:bg-gray-300/40'}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-label group-hover:text-gray-300 transition-colors">
            {isExpanded ? 'Ver Semana' : 'Ver Calendario Completo'}
          </span>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white tracking-tight capitalize font-label">
              {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
            </h2>
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="size-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">keyboard_arrow_up</span>
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-label">
              {currentSession?.isCompetition ? 'DÍA DE COMPETICIÓN' : (currentSession ? 'Sesión programada' : 'Día de descanso')}
            </p>
            {currentSession && (
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold font-numbers uppercase tracking-widest ${currentSession.isCompetition ? 'text-blue-400' : 'text-accent'}`}>{completionPercentage}%</span>
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full transition-all duration-500 ${currentSession.isCompetition ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-accent'}`} style={{ width: `${completionPercentage}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {currentSession ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div
              onClick={() => navigate(`/session/${currentSession.id}`)}
              className={`bg-white/5 rounded-[2.5rem] p-8 border shadow-2xl space-y-8 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all ${currentSession.isCompetition ? 'border-blue-500/30' : 'border-white/5'}`}
            >
              {currentSession.isCompetition && (
                <div className="absolute top-0 right-0 p-6 opacity-10 text-blue-400">
                  <span className="material-symbols-outlined text-[64px] icon-fill">emoji_events</span>
                </div>
              )}

              <div className="flex items-start justify-between relative z-10">
                <div className="flex gap-5">
                  <div className={`w-16 h-16 rounded-full bg-black flex items-center justify-center border shadow-2xl ${currentSession.isCompetition ? 'text-blue-400 border-blue-500/20' : 'text-accent border-white/10'}`}>
                    <span className="material-symbols-outlined text-4xl icon-fill">
                      {currentSession.isCompetition ? 'emoji_events' : (currentSession.type === 'RUN' ? 'sprint' : 'pool')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-white tracking-tight font-label leading-tight">{currentSession.title}</h3>
                    <p className="text-sm text-gray-400 mt-2 italic font-serif leading-snug">{currentSession.desc}</p>
                  </div>
                </div>
                <div className="bg-black/40 h-8 w-8 flex items-center justify-center rounded-full border border-white/10 text-white/50 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">open_in_new</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase mb-2 font-label tracking-widest">OBJETIVO</span>
                  <span className="block font-bold font-numbers text-2xl text-white">{currentSession.vol}</span>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase mb-2 font-label tracking-widest">CARGA RPE</span>
                  <span className={`block font-bold font-numbers text-2xl ${currentSession.isCompetition ? 'text-blue-400' : 'text-accent'}`}>{currentSession.rpe}<span className="text-sm text-gray-600 ml-1">/10</span></span>
                </div>
              </div>
            </div>

            <div className="bg-black/20 rounded-[2rem] p-6 border border-white/5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6 px-1 font-label">Hitos de Jornada</h4>
              <div className="flex flex-col gap-4">
                {currentSession.tasks.map(task => (
                  <label key={task.id} className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(currentSession.id, task.id)}
                        className={`h-6 w-6 rounded-lg border-white/10 bg-white/5 focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer ${currentSession.isCompetition ? 'checked:bg-blue-500 checked:border-blue-500' : 'checked:bg-accent checked:border-accent'} text-black`}
                      />
                    </div>
                    <span className={`text-sm font-medium transition-all ${task.completed ? 'text-white/30 line-through' : 'text-white'}`}>
                      {task.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-700">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
              <span className="material-symbols-outlined text-4xl text-white/20">bedtime</span>
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs font-label">nada programado por ahora, avisa a tu entrenador</p>
          </div>
        )}

        <div className="mt-8 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex gap-3">
          <span className="material-symbols-outlined text-blue-400">sync</span>
          <p className="text-[10px] text-blue-300 font-medium leading-relaxed font-label uppercase tracking-wider">
            Competiciones sincronizadas automáticamente desde el documento de planificación del Coach.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Diario;
