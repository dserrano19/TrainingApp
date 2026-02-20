
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CoachDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dateString = now.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    weekday: 'long'
  });

  return (
    <div className="p-6 pb-28 space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between sticky top-0 z-20 bg-white/95 backdrop-blur-md -mx-6 px-6 py-4 border-b border-gray-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted font-label capitalize">{dateString}</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Coach Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/notifications')}
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-black text-2xl">notifications</span>
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent border-2 border-white"></span>
          </button>
          <div className="relative">
            <img src="https://picsum.photos/id/342/100/100" className="w-11 h-11 rounded-full border-2 border-white shadow-xl" alt="Coach" />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 bg-widget rounded-[2.5rem] p-7 text-white shadow-2xl flex items-center justify-between border border-white/5">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] font-label">Registros hoy</span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold font-numbers tracking-tighter tabular-nums">84<span className="text-accent">%</span></span>
              <span className="bg-accent text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg">+12%</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest font-label">Completados hasta ahora</p>
          </div>
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#18181b" strokeWidth="3"></circle>
              <circle cx="18" cy="18" r="16" fill="none" stroke="#B6F23B" strokeWidth="3" strokeDasharray="84, 100" strokeLinecap="round"></circle>
            </svg>
            <span className="material-symbols-outlined text-accent text-3xl absolute icon-fill">done_all</span>
          </div>
        </div>

        <div className="bg-widget rounded-[2rem] p-6 text-white shadow-xl space-y-4 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-orange-500 icon-fill">warning</span>
          </div>
          <div>
            <span className="text-4xl font-extrabold font-numbers text-white">3</span>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1 font-label">Alertas</p>
          </div>
        </div>

        <div className="bg-widget rounded-[2rem] p-6 text-white shadow-xl space-y-4 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-red-500 icon-fill">person_off</span>
          </div>
          <div>
            <span className="text-4xl font-extrabold font-numbers text-white">5</span>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1 font-label">Sin Reg.</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/management/daily-logs')}
          className="col-span-2 bg-accent rounded-[2rem] p-6 text-black shadow-xl flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group mt-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black text-accent flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined icon-fill">monitoring</span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Monitorizar Registros</h3>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Ver tabla en tiempo real</p>
            </div>
          </div>
          <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </div>
      </div>

      {/* Priority Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black font-label">Prioridad Alta</h3>
          <span className="text-[10px] font-bold bg-black text-white px-2.5 py-1 rounded-full font-numbers tracking-widest">3 CASOS</span>
        </div>

        <div className="space-y-3">
          {[
            { id: "elena-1", name: "Elena Rodriguez", status: "SALUD", detail: "Molestia Isquio - Dolor 7/10", avatar: "64", color: "text-red-500 bg-red-500/10 border-red-500/20" },
            { id: "carlos-2", name: "Carlos Ruiz", status: "CRÍTICO", detail: "Sesión Clave Saltada", avatar: "102", color: "text-red-500 bg-red-500/10 border-red-500/20" },
            { id: "maria-3", name: "Maria Lopez", status: "AUSENCIA", detail: "3 días sin registrar datos", avatar: "177", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" }
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(`/athletes/${item.id}/performance`)}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-xl hover:border-accent transition-all cursor-pointer group shadow-sm active:scale-[0.98]"
            >
              <img src={`https://picsum.photos/id/${item.avatar}/80/80`} className="w-14 h-14 rounded-full border border-gray-100" alt={item.name} />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-black">{item.name}</h4>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest font-label ${item.color}`}>{item.status}</span>
                </div>
                <p className="text-[11px] text-text-muted font-medium truncate">{item.detail}</p>
              </div>
              <span className="material-symbols-outlined text-gray-200 group-hover:text-black transition-colors">chevron_right</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black font-label">Actividad Reciente</h3>
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden divide-y divide-gray-50 shadow-sm">
          <div className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">fitness_center</span>
            </div>
            <div>
              <p className="text-sm font-bold text-black">Entrenamiento Grupo A</p>
              <p className="text-[10px] text-text-muted font-bold font-numbers tracking-widest uppercase">Hace 2h • Finalizado</p>
            </div>
          </div>
          <div className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">edit_note</span>
            </div>
            <div>
              <p className="text-sm font-bold text-black">Planificación Semanal</p>
              <p className="text-[10px] text-text-muted font-bold font-numbers tracking-widest uppercase">Hace 4h • Actualizada</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoachDashboard;
