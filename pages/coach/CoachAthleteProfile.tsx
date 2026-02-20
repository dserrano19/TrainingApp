
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CoachAthleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Datos simulados del atleta (en una app real vendrían de una API basados en el id)
  const athlete = {
    name: "Alex Rivera",
    specialty: "Swimming - 100m Free",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmFV_yUqy1mFM7YYp6mO9a5ZTQ83VhaQdsPdY0fGGKxWbEbZRAL2iQMN_wCrPcVxOqgvn7roFVU0mCqpp1k_M-9lZ7lbOU8wAV6RijyVFM2STjpHClwwF4nISZ5t0vRrxai7B8piLKLxrVjF_zCazgefwe2hCcVKT5D3EX2bbMH8ICjA4SXs7KGe_Cl_g_cxK7Nu7jgVbnAOauV_txbkyqYGuFdZI7xaOlaBHigjk282tsiE14tWt7efaXqk1ezsdlEmVPCQR1CQ",
    status: "ACTIVE",
    squad: "ELITE SQUAD",
    stats: {
      volume: 38,
      plan: 40,
      completion: 95,
      rpe: 8.5,
      intensity: "On Track"
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-black">arrow_back</span>
        </button>
        <h1 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500 font-label">Athlete Profile</h1>
        <button className="text-xs font-bold text-black uppercase tracking-widest font-label hover:text-accent transition-colors">
          EDIT
        </button>
      </header>

      {/* Profile Header Card */}
      <section className="p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div 
              className="h-24 w-24 rounded-full bg-gray-100 bg-cover bg-center border-4 border-white shadow-2xl" 
              style={{ backgroundImage: `url('${athlete.avatar}')` }}
            ></div>
            <div className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-white"></div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-black font-label">{athlete.name}</h2>
            <p className="text-sm font-medium text-gray-500 font-label mt-1">{athlete.specialty}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="px-2.5 py-1 rounded bg-black text-white text-[9px] font-bold uppercase tracking-widest font-label">ACTIVE</span>
              <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-500 text-[9px] font-bold uppercase tracking-widest font-label">ELITE SQUAD</span>
            </div>
          </div>
        </div>
        <button className="w-full h-14 bg-black text-white rounded-2xl mt-8 flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-black/10 active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined text-accent text-[20px] icon-fill">mail</span>
          Message Athlete
        </button>
      </section>

      {/* Plan vs Real Analysis */}
      <section className="px-6 mb-8">
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-xl font-bold tracking-tight text-black font-label">Plan vs Real</h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nums">WEEK 42</span>
        </div>
        <div className="bg-widget rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="material-symbols-outlined text-[100px] text-white">analytics</span>
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-label mb-1">Volume</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white font-numbers tabular-nums">{athlete.stats.volume}</span>
                <span className="text-sm font-medium text-gray-500 font-label">km</span>
                <span className="text-xl font-medium text-gray-600 mx-1">/</span>
                <span className="text-xl font-bold text-blue-400 font-numbers tabular-nums">{athlete.stats.plan}</span>
                <span className="text-[10px] font-bold text-blue-500/60 uppercase tracking-tighter ml-1">Plan</span>
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg flex items-center gap-1">
              <span className="material-symbols-outlined text-red-500 text-sm">trending_down</span>
              <span className="text-[11px] font-bold text-red-500 font-nums">5%</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest font-label">
              <span className="text-gray-500">Completion</span>
              <span className="text-white">{athlete.stats.completion}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 shadow-[0_0_10px_#3B82F6]" style={{ width: '95%' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            <div className="p-4 bg-surface-inner">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-label mb-1">Intensity</p>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-500 text-[16px] icon-fill">check_circle</span>
                <span className="text-sm font-bold text-emerald-500 font-label">On Track</span>
              </div>
            </div>
            <div className="p-4 bg-surface-inner">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-label mb-1">RPE Load</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-white font-numbers">8.5</span>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">HIGH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historial de series */}
      <section className="px-6 mb-10">
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-xl font-bold tracking-tight text-black font-label">Historial de series</h3>
          <button className="text-[10px] font-bold text-accent uppercase tracking-widest font-label">VIEW ALL</button>
        </div>
        <div className="space-y-3">
          {[
            { date: "14", month: "OCT", title: "Aerobic Capacity", detail: "8 x 100m Free @ 1:15 • 3.2km", status: "DONE", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
            { date: "13", month: "OCT", title: "Recovery Swim", detail: "Continuous 1500m • Z1", status: "REST", color: "text-gray-500 bg-gray-500/10 border-gray-500/20" },
            { date: "11", month: "OCT", title: "Speed Work", detail: "12 x 25m Sprint", status: "PARTIAL", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
          ].map((session, i) => (
            <div key={i} className="bg-widget rounded-3xl p-4 flex items-center gap-4 border border-white/5 group active:scale-[0.98] transition-all">
              <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-center flex-shrink-0">
                <span className="text-[10px] font-bold text-accent uppercase font-label leading-none mb-1">{session.month}</span>
                <span className="text-2xl font-bold text-white font-numbers leading-none">{session.date}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-white truncate font-label">{session.title}</h4>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest font-label ${session.color}`}>{session.status}</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate font-label">{session.detail}</p>
              </div>
              <span className="material-symbols-outlined text-gray-800 text-[20px] group-hover:text-accent transition-colors">chevron_right</span>
            </div>
          ))}
        </div>
      </section>

      {/* Fuerza 1RM */}
      <section className="px-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-bold tracking-tight text-black font-label">Fuerza</h3>
          <span className="text-xs font-bold text-gray-400 font-nums">1RM</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "SQUAT", val: "120", unit: "kg", active: true },
            { label: "DEADLIFT", val: "145", unit: "kg" },
            { label: "BENCH", val: "95", unit: "kg" },
            { label: "PULLUP", val: "35", unit: "kg" },
          ].map((lift, i) => (
            <div key={i} className={`rounded-3xl p-5 flex flex-col justify-between h-28 shadow-xl relative overflow-hidden transition-all ${lift.active ? 'bg-widget border border-accent/30 ring-1 ring-accent/20' : 'bg-widget border border-white/5'}`}>
              {lift.active && (
                <div className="absolute right-2 top-2 opacity-20">
                  <span className="material-symbols-outlined text-accent">fitness_center</span>
                </div>
              )}
              <span className={`text-[10px] font-bold uppercase tracking-widest font-label ${lift.active ? 'text-accent' : 'text-gray-500'}`}>{lift.label}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white font-numbers tracking-tighter">{lift.val}</span>
                <span className={`text-[11px] font-bold font-label ${lift.active ? 'text-accent/60' : 'text-gray-600'}`}>{lift.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Competiciones */}
      <section className="px-6 mb-10">
        <h3 className="text-xl font-bold tracking-tight text-black font-label mb-4">Competiciones</h3>
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-widget group border border-white/5 shadow-2xl h-52">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530549387074-d5624d55a7c7?auto=format&fit=crop&q=80&w=800')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            <div className="relative h-full p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="inline-block px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-accent text-black shadow-lg shadow-accent/20">UPCOMING</span>
                <span className="text-white text-[10px] font-bold uppercase tracking-widest font-nums">24 DAYS</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-white tracking-tight font-label">National Championship</h4>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider font-label">National Aquatic Centre</span>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Date:</span>
                  <span className="text-xs font-bold text-white font-nums">12 Nov 2023</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-5 rounded-3xl bg-widget border border-white/5 shadow-xl">
            <div>
              <h4 className="text-base font-bold text-white font-label">Regional Qualifier</h4>
              <p className="text-[10px] font-bold text-gray-500 font-nums mt-1">Sept 15, 2023</p>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold uppercase tracking-widest">GOLD</span>
          </div>
        </div>
      </section>

      {/* Observaciones del coach */}
      <section className="px-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold tracking-tight text-black font-label">Observaciones del coach</h3>
          <span className="material-symbols-outlined text-gray-400 text-[20px] cursor-pointer">edit_note</span>
        </div>
        <div className="bg-widget border-l-4 border-accent rounded-r-3xl p-6 shadow-2xl relative">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-accent text-[24px] mt-1">info</span>
            <div className="flex-1">
              <p className="text-base text-gray-100 leading-relaxed font-serif italic">
                Alex reported slight shoulder tightness on Tuesday after the sprint session. Volume for next week should be monitored closely. Focus on technique drills during warm-up.
              </p>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-nums">UPDATED TODAY, 10:30 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoachAthleteProfile;
