import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  calculateTotalDistance,
  countSessionsByType,
  getCurrentStreak,
  getTrainingGoalProgress,
  getPerformanceRecords,
  getPersonalBest,
  getWeeklyEvolution,
  getMonthlyEvolution,
  getAnnualEvolution,
  calculateLaps,
  getDateRange
} from '../../utils/statsCalculations';
import { supabase } from '../../components/supabaseClient';

const ATHLETIC_EVENTS = [
  { id: '100m', label: '100m' },
  { id: '200m', label: '200m' },
  { id: '400m', label: '400m' },
  { id: '800m', label: '800m' },
  { id: 'Salto Longitud', label: 'Longitud' },
  { id: 'Salto Triple', label: 'Triple' },
];

interface StatsData {
  distance: string;
  target: string;
  progress: number;
  sessions: string;
  streak: string;
  sessionsTrend: string;
  evolution: number[];
  labels: string[];
  distribution: {
    track: number;
    gym: number;
    comp: number;
  };
  intensity: number;
  laps: number;
  maxSpeed: string;
  hrv: number[];
  weight: number[];
  prediction: string;
}

const AthleteStats: React.FC = () => {
  const [view, setView] = useState<'Weekly' | 'Monthly' | 'Annual'>('Monthly');
  const [selectedEvent, setSelectedEvent] = useState('100m');
  const [loading, setLoading] = useState(true);

  // Initialize with mostly clean defaults. For new metrics (HRV, Weight), we use the demo data as placeholders 
  // since the backend doesn't support them yet, preserving the "visual update" request.
  const [statsData, setStatsData] = useState<StatsData>({
    distance: "0.0",
    target: "0.0",
    progress: 0,
    sessions: "0",
    streak: "0",
    sessionsTrend: "+0",
    evolution: [],
    labels: [],
    distribution: { track: 0, gym: 0, comp: 0 },
    intensity: 8.2, // Placeholder
    laps: 0,
    maxSpeed: "0.0", // Placeholder until available
    hrv: [75, 82, 80, 85, 88], // Placeholder
    weight: [75.8, 75.4, 75.5, 75.2, 75.1], // Placeholder
    prediction: "--"
  });

  const [timeEvolution, setTimeEvolution] = useState<Array<{ date: string; time: string; val: number }>>([]);
  const [personalBest, setPersonalBest] = useState<{ time: number; date: string } | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  // Bench Press History - Placeholder as requested in design
  const benchPressHistory = useMemo(() => ([
    { date: 'ENE', val: 85 },
    { date: 'FEB', val: 87.5 },
    { date: 'MAR', val: 85 },
    { date: 'ABR', val: 90 },
    { date: 'MAY', val: 92.5 },
    { date: 'JUN', val: 95 },
  ]), []);

  // Helper for Donut chart
  const getDonutSegments = () => {
    const { track, gym, comp } = statsData.distribution;
    const total = track + gym + comp || 1; // Prevent div by zero
    const trackPerc = (track / total) * 100;
    const gymPerc = (gym / total) * 100;
    const compPerc = (comp / total) * 100;

    return [
      { color: 'var(--accent-color)', value: trackPerc, label: 'Pista' },
      { color: '#FFFFFF', value: gymPerc, label: 'Gym' },
      { color: '#3B82F6', value: compPerc, label: 'Comp' }
    ];
  };

  const getTrackPath = (x: number, y: number, width: number, height: number) => {
    const radius = height / 2;
    const straight = width - height;
    return `M ${x + radius},${y} L ${x + radius + straight},${y} A ${radius},${radius} 0 0 1 ${x + radius + straight},${y + height} L ${x + radius},${y + height} A ${radius},${radius} 0 0 1 ${x + radius},${y}`;
  };

  // Load real data from Supabase
  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      setLoading(true);
      try {
        const { start, end } = getDateRange(view);

        // Parallel data fetching
        const [
          distData,
          sessCounts,
          streakData,
          goalData,
          evolutionData
        ] = await Promise.all([
          calculateTotalDistance(user.id, start, end),
          countSessionsByType(user.id, start, end),
          getCurrentStreak(user.id),
          // Training goals support only Weekly/Monthly in DB currently
          view !== 'Annual' ? getTrainingGoalProgress(user.id, view === 'Weekly' ? 'WEEKLY' : 'MONTHLY') : Promise.resolve(null),
          view === 'Weekly' ? getWeeklyEvolution(user.id) :
            view === 'Monthly' ? getMonthlyEvolution(user.id) :
              getAnnualEvolution(user.id)
        ]);

        const totalSessions = Object.values(sessCounts).reduce((a, b) => a + b, 0);
        const laps = calculateLaps(distData);

        // Determine labels based on view
        let labels: string[] = [];
        if (view === 'Weekly') labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
        else if (view === 'Monthly') labels = ['W1', 'W2', 'W3', 'W4'];
        else labels = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

        setStatsData(prev => ({
          ...prev,
          distance: distData.toFixed(1),
          target: goalData?.targetDistance.toFixed(1) || "0.0",
          progress: goalData?.progress || 0,
          sessions: totalSessions.toString(),
          streak: streakData.toString(),
          sessionsTrend: view === 'Weekly' ? "+1" : view === 'Monthly' ? "+2%" : "+15%", // Simple logic or placeholer for trend
          evolution: evolutionData,
          labels,
          distribution: {
            track: sessCounts.track,
            gym: sessCounts.gym,
            comp: sessCounts.competition // mapped from 'competition' to 'comp'
          },
          laps,
          // Keep placeholders for biometrics until backend support
          hrv: view === 'Annual' ? [70, 72, 75, 78, 82, 85, 88, 86, 84, 82, 85, 90] : [75, 82, 80, 85, 88, 90, 89],
          weight: [75.2, 75.1, 75.4, 75.3, 75.2, 75.1, 75.0],
          prediction: "11.05s"
        }));

      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, view]);

  // Load performance records
  useEffect(() => {
    if (!user) return;

    const loadPerformanceData = async () => {
      try {
        const [records, pb] = await Promise.all([
          getPerformanceRecords(user.id, selectedEvent, 5),
          getPersonalBest(user.id, selectedEvent)
        ]);

        if (records.length > 0) {
          const times = records.map(r => r.time);
          const minTime = Math.min(...times);
          const maxTime = Math.max(...times);
          const range = maxTime - minTime || 1;

          const formattedRecords = records.reverse().map((record, index) => {
            const date = new Date(record.date);
            const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase();

            // Scale value for graph (higher is better visually for "progress" usually, but here we want relative positioning)
            // The user's design uses 0-100 val.
            // Let's normalize: lowest time (best) -> higher val? Or just time.
            // User snippet logic: val = 20 + ...
            // We'll map closer to bottom (0) or top (100).
            // For a time chart, usually lower time is higher up? Or lower.
            // Let's follow user snippet logic: val seemed to increase over time in their hardcoded example.
            const val = 10 + ((maxTime - record.time) / range) * 80;

            return {
              date: formattedDate,
              time: record.time.toString(), // Keep as string for display
              val: Math.round(val)
            };
          });
          setTimeEvolution(formattedRecords);
        } else {
          // Fallback to empty or placeholder if no data, to avoid breaking UI
          const isFieldEvent = selectedEvent.includes('Salto');
          setTimeEvolution([
            { date: 'INICIO', time: isFieldEvent ? '0.00m' : '00.00s', val: 0 }
          ]);
        }
        setPersonalBest(pb);
      } catch (error) {
        console.error('Error loading performance:', error);
      }
    };

    loadPerformanceData();
  }, [user, selectedEvent]);

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500 pb-40 bg-bg-app min-h-screen">
      <header className="sticky top-0 z-50 bg-bg-app/90 backdrop-blur-md border-b border-widget-border/5 px-4 pt-12 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex size-8 items-center justify-center rounded-full hover:bg-black/5 text-text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back_ios_new</span>
        </button>
        <h1 className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400 font-label">Analítica Técnica Elite</h1>
        <button className="flex size-8 items-center justify-center rounded-full hover:bg-black/5 text-text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">share</span>
        </button>
      </header>

      {/* Selectores */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex h-10 w-full items-center rounded-xl bg-widget p-1 border border-widget-border shadow-md">
          {(['Weekly', 'Monthly', 'Annual'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 h-full flex items-center justify-center rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${view === v ? 'bg-accent text-black shadow-sm' : 'text-gray-500'}`}
            >
              {v === 'Weekly' ? 'Semana' : v === 'Monthly' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {ATHLETIC_EVENTS.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all border ${selectedEvent === event.id
                ? 'bg-black text-accent border-accent/40 shadow-sm'
                : 'bg-widget border-widget-border text-gray-500'
                }`}
            >
              {event.label}
            </button>
          ))}
        </div>
      </div>

      {/* Volumen y Pista */}
      <div className="px-4 pb-4">
        <div className="w-full bg-widget rounded-[2rem] p-6 border border-widget-border shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[8px] font-bold uppercase text-gray-500 tracking-[0.2em] mb-0.5">Volumen Acumulado</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-numbers tracking-tight tabular-nums">{statsData.distance}</span>
                <span className="text-[10px] font-bold text-accent uppercase">km</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-white font-numbers leading-none">{Math.floor(statsData.laps)}</span>
              <span className="text-[7px] font-bold text-accent uppercase tracking-widest">Vueltas</span>
            </div>
          </div>

          <div className="relative h-48 w-full flex items-center justify-center mb-4 bg-black/30 rounded-[1.5rem] border border-white/5 p-2 overflow-hidden">
            <svg className="w-full h-full max-w-[280px]" viewBox="0 0 320 180">
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--accent-color)" />
                </linearGradient>
              </defs>
              <path d={getTrackPath(40, 20, 240, 140)} fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
              <path d={getTrackPath(50, 30, 220, 120)} fill="none" stroke="#222" strokeWidth="18" strokeLinecap="round" />
              <path
                d={getTrackPath(50, 30, 220, 120)}
                fill="none"
                stroke="url(#progressGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="540"
                strokeDashoffset={540 - (540 * statsData.progress / 100)}
                className="transition-all duration-[1s] ease-in-out"
              />
              <text x="160" y="85" textAnchor="middle" className="fill-white font-numbers font-black text-4xl tracking-tight">{statsData.progress}%</text>
              <text x="160" y="105" textAnchor="middle" className="fill-gray-500 font-label font-bold text-[8px] uppercase tracking-[0.2em]">Objetivo</text>
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <span className="text-[7px] font-bold text-gray-500 uppercase block mb-0.5">Sesiones</span>
              <span className="text-lg font-black text-white font-numbers">{statsData.sessions}</span>
            </div>
            <div className="text-center">
              <span className="text-[7px] font-bold text-gray-500 uppercase block mb-0.5">Racha</span>
              <span className="text-lg font-black text-white font-numbers">{statsData.streak}d</span>
            </div>
            <div className="text-center">
              <span className="text-[7px] font-bold text-gray-500 uppercase block mb-0.5">Tendencia</span>
              <span className="text-lg font-black text-emerald-400 font-numbers">{statsData.sessionsTrend}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PREDICCIÓN Y DISTRIBUCIÓN */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-bold text-text-primary tracking-tight font-label mb-2 px-1">Proyección de Rendimiento</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Predicción Próxima Competición */}
          <div
            onClick={() => navigate('/gap-analysis')}
            className="bg-widget rounded-[2rem] p-6 border border-widget-border shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <span className="material-symbols-outlined text-[80px] text-white">magic_button</span>
            </div>
            <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest block mb-4">Predicción Prox. Comp.</span>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-accent font-numbers tracking-tighter tabular-nums">{statsData.prediction}</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Est. {selectedEvent}</span>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[85%]" />
              </div>
              <span className="text-[8px] font-black text-accent uppercase">AI Confidence: 85%</span>
            </div>
          </div>

          {/* Distribución de Eventos Circular */}
          <div className="bg-widget rounded-[2rem] p-6 border border-widget-border shadow-xl flex flex-col justify-between">
            <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest block mb-4">Distribución Carga</span>
            <div className="flex items-center gap-4">
              <div className="relative size-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 42 42">
                  {(() => {
                    let currentOffset = 0;
                    return getDonutSegments().map((seg, i) => {
                      const dashArray = `${seg.value} ${100 - seg.value}`;
                      const dashOffset = -currentOffset;
                      currentOffset += seg.value;
                      return (
                        <circle
                          key={i}
                          cx="21"
                          cy="21"
                          r="15.915"
                          fill="transparent"
                          stroke={seg.color}
                          strokeWidth="6"
                          strokeDasharray={dashArray}
                          strokeDashoffset={dashOffset}
                          className="transition-all duration-1000"
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white font-numbers">{statsData.sessions}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {getDonutSegments().map((seg, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="size-1.5 rounded-full" style={{ backgroundColor: seg.color }}></div>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{seg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BIOMETRÍA Y RECUPERACIÓN */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-bold text-text-primary tracking-tight font-label mb-2 px-1">Salud y Biometría</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-widget rounded-[1.5rem] p-5 border border-widget-border shadow-xl">
            <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Peso Corporal (kg)</span>
            <div className="flex items-end justify-between h-12 gap-1 px-1">
              {statsData.weight.map((w, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-t-[1px]" style={{ height: `${(w - 70) * 10}%` }}></div>
              ))}
            </div>
            <div className="mt-3 flex justify-between items-baseline">
              <span className="text-lg font-black text-white font-numbers">{statsData.weight[statsData.weight.length - 1]}</span>
              <span className="text-[8px] font-bold text-emerald-400">-0.2%</span>
            </div>
          </div>
          <div className="bg-widget rounded-[1.5rem] p-5 border border-widget-border shadow-xl">
            <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest block mb-2">HRV (ms)</span>
            <div className="flex items-end justify-between h-12 gap-1 px-1">
              {statsData.hrv.map((v, i) => (
                <div key={i} className="flex-1 bg-accent/20 rounded-t-[1px]" style={{ height: `${v}%` }}></div>
              ))}
            </div>
            <div className="mt-3 flex justify-between items-baseline">
              <span className="text-lg font-black text-white font-numbers">{statsData.hrv[statsData.hrv.length - 1]}</span>
              <span className="text-[8px] font-bold text-accent">Estable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evolución Carga */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-bold text-text-primary tracking-tight font-label mb-2 px-1">Evolución de Carga</h3>
        <div className="bg-widget rounded-[1.5rem] p-6 border border-widget-border shadow-xl">
          <div className="flex items-end justify-between mb-6 h-32 gap-2">
            {statsData.evolution.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="relative w-full flex items-end justify-center h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${i === statsData.evolution.length - 1 ? 'bg-accent' : 'bg-white/5'}`}
                    style={{ height: `${val}%` }}
                  ></div>
                </div>
                {/* Safe check for label existence */}
                <span className={`text-[7px] font-bold uppercase tracking-widest ${i === statsData.evolution.length - 1 ? 'text-accent' : 'text-gray-600'}`}>{statsData.labels[i] || ''}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center px-1">
            <div className="flex flex-col">
              <span className="text-[6px] font-bold text-gray-500 uppercase tracking-widest">Pico</span>
              <span className="text-sm font-bold text-white font-numbers">{Math.max(...statsData.evolution, 0)}%</span>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-[6px] font-bold text-gray-500 uppercase tracking-widest">Estatus</span>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Óptimo</span>
            </div>
          </div>
        </div>
      </div>

      {/* EVOLUCIÓN PRESS BANCA (FUERZA) */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-bold text-text-primary tracking-tight font-label mb-2 px-1">Evolución Press Banca (1RM)</h3>
        <div className="bg-widget rounded-[1.5rem] p-6 border border-widget-border shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
            <span className="material-symbols-outlined text-[100px] text-white">fitness_center</span>
          </div>
          <div className="relative z-10 flex justify-between items-end mb-8">
            <div>
              <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest mb-1">Carga Máxima Estimada</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white font-numbers">95</span>
                <span className="text-xs font-bold text-accent uppercase">kg</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-emerald-500 text-[10px] font-bold font-nums">+11.7% YTD</p>
            </div>
          </div>
          <div className="relative h-24 w-full flex items-end justify-between px-1 gap-4">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline
                points={benchPressHistory.map((it, idx) => `${(idx * (100 / (benchPressHistory.length - 1)))},${100 - (it.val - 80) * 5}`).join(' ')}
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="2"
              />
            </svg>
            {benchPressHistory.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className={`w-1.5 h-1.5 rounded-full z-10 mb-2 ${i === benchPressHistory.length - 1 ? 'bg-accent shadow-[0_0_8px_var(--accent-dim)]' : 'bg-gray-700'}`} style={{ marginBottom: `${(item.val - 80) * 0.8}rem` }}></div>
                <span className="text-[6px] font-bold uppercase text-gray-600">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progresión Histórica Disciplina */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-bold text-text-primary tracking-tight font-label mb-2 px-1">Histórico: {selectedEvent}</h3>
        <div className="bg-widget rounded-[1.5rem] p-6 border border-widget-border shadow-xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[7px] font-bold uppercase text-gray-500 tracking-widest mb-0.5">Mejor Marca</p>
              <p className="text-3xl font-black text-white font-numbers tracking-tight">
                {personalBest ? personalBest.time.toFixed(2) : '--'}
              </p>
            </div>
            <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <span className="text-emerald-500 text-[8px] font-black uppercase tracking-tight">Progresando</span>
            </div>
          </div>

          <div className="relative h-36 w-full flex items-end justify-between px-1 gap-2">
            <svg className="absolute bottom-10 left-0 w-full h-full pointer-events-none opacity-10" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline
                points={timeEvolution.length > 1 ? timeEvolution.map((it, idx) => `${(idx * (100 / (timeEvolution.length - 1)))},${100 - it.val}`).join(' ') : ""}
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="1.5"
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />
            </svg>
            {timeEvolution.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                <div className="relative w-full flex items-end justify-center h-full">
                  <div className="absolute inset-x-0 bottom-0 bg-accent/5 rounded-t-lg transition-all" style={{ height: `${item.val}%` }}></div>
                  <div
                    className={`w-2 h-2 rounded-full absolute transition-all z-10 ${i === timeEvolution.length - 1 ? 'bg-accent scale-125 shadow-[0_0_8px_var(--accent-dim)]' : 'bg-gray-700'}`}
                    style={{ bottom: `${item.val}%` }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-black text-white font-nums tabular-nums leading-none">{item.time}</span>
                  <span className="text-[6px] font-bold uppercase text-gray-600 tracking-tighter mt-0.5">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Widgets Inferiores */}
      <div className="px-4 pb-12 grid grid-cols-2 gap-3">
        <div className="bg-widget p-6 rounded-[1.5rem] border border-widget-border shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-[80px] text-white">sprint</span>
          </div>
          <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] block relative z-10">Velocidad Pico</span>
          <div className="relative z-10 mt-2">
            <span className="text-4xl font-black text-white font-numbers tracking-tightest tabular-nums">{statsData.maxSpeed}</span>
            <span className="text-[10px] text-gray-600 font-bold ml-0.5 uppercase">km/h</span>
          </div>
          <div className="mt-2 bg-accent/10 px-2 py-1 rounded border border-accent/20 w-fit relative z-10">
            <span className="text-[7px] font-black text-accent uppercase tracking-widest">Récord Sesión</span>
          </div>
        </div>

        <div className="bg-widget p-6 rounded-[1.5rem] border border-widget-border shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-[80px] text-white">speed</span>
          </div>
          <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] block relative z-10">Esfuerzo Medio</span>
          <div className="relative z-10 mt-2">
            <span className="text-4xl font-black text-white font-numbers tracking-tightest tabular-nums">{statsData.intensity}</span>
            <span className="text-[10px] text-gray-600 font-bold ml-0.5 uppercase">/ 10</span>
          </div>
          <div className="mt-2 bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20 w-fit relative z-10">
            <span className="text-[7px] font-black text-orange-400 uppercase tracking-widest">Carga Elevada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteStats;
