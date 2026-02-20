
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CoachAnalysis: React.FC = () => {
  const navigate = useNavigate();

  const athleteStatus = [
    {
      id: "1",
      name: "Alex Morgan",
      status: "Fatigue: High",
      recovery: 30,
      color: "bg-red-500",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBgLoB2_o5lAAUaBjkZq51GeobHmOX7JHXNSup1X9KJ7YCYC1bJJkQCsxnz8g1P54ZU3CcstUcTtiSdgmiJDsiYWFF2YrCFfAIC1-5wZG5n3O5KRnaiFNByMpxAbDiIUZGoh28BWVQIJCACP6atwXFYE_YR1Z9ppeZXUMTOCpBFO-0OhrWA9DGKgR02wBROskQaXw5h-uZ5umZyC49HzoviYANjJZANVXspU1D3z6TPkFIEMGgOiJEAp4Ukeyd38R1FzXMkMa-ZA"
    },
    {
      id: "2",
      name: "David Chen",
      status: "Ready to train",
      recovery: 90,
      color: "bg-accent",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXsN6fOEQRkt6_XAqhrTKva7EHdJESbjl3ahO-XXJJYAngQJjSNAh-1PUhdCy_VjbzLz7dFqgdDRrIIJg7JN06y-63fr9RZfFawiq8UwWkTlgGKHJd_cng7RNRxeo35FyL6YeSfbLeWMrQfJwf1ve4a1LfSyCZAZuiq-U2Bv0j3z-Yftr5mnYeWDkriA3NNLRCAlqYUas0fJ9963vig9N5WT9yPLZd0fI11U2LSuYYxQ0IqBAPLR-Vxh5x6Nk4kgUvH-OXUyyVyA"
    },
    {
      id: "3",
      name: "Sarah Jones",
      status: "Injury Watch",
      recovery: 60,
      color: "bg-yellow-500",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjsOUKyLpPQ4owvfqxTc9YXa3ml6-b16_r_PSGm1UTy7JRdsH1TOD2-oPNhTddxtPGCCQMpSrHLQq9CvLTSyyRka0bxlOd24sSslItpuOAEGxQH9FEbbRgTvoYL2NRxeXFTwyppUi9N4NSyVJKBYxND60HsqlHiBGcGyJzALklW-XMg8hXllNXW_kik5ZAP5NEz7IvvAyZMip0dlXCP5i6_4XR1AkBNTBcXM--55s-mlrJRHoLBY-jAWfKKeQ5fJNGAZs7Lrd9-A"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-32 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-app/95 backdrop-blur-md px-4 pt-12 pb-3 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-text-primary">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary font-label">Coach Analysis</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-text-primary">tune</span>
        </button>
      </header>

      {/* Filters Scroll */}
      <div className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar">
        <button className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-accent px-4 shadow-sm active:scale-95 transition-transform border border-accent">
          <span className="material-symbols-outlined text-black text-[18px]">group</span>
          <span className="text-xs font-bold text-black font-label">All Athletes</span>
          <span className="material-symbols-outlined text-black text-[18px]">keyboard_arrow_down</span>
        </button>
        <button className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-black px-4 text-white active:scale-95 transition-transform hover:bg-black/80 border border-white/5 font-label">
          <span className="material-symbols-outlined text-gray-300 text-[18px]">calendar_today</span>
          <span className="text-xs font-bold uppercase tracking-widest">Last 4 Weeks</span>
        </button>
        <button className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-black px-4 text-white active:scale-95 transition-transform hover:bg-black/80 border border-white/5 font-label">
          <span className="material-symbols-outlined text-gray-300 text-[18px]">fitness_center</span>
          <span className="text-xs font-bold uppercase tracking-widest">Strength</span>
        </button>
      </div>

      <main className="flex flex-col gap-8 px-4 pt-2">
        {/* KPI Overview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary font-label">Overview</h2>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] font-label">AUG 12 - SEP 12</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col justify-between rounded-2xl bg-[#0f0f0f] p-5 shadow-lg border border-white/5">
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-label">Compliance</span>
                <span className="material-symbols-outlined text-accent text-[20px] icon-fill">check_circle</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-accent tracking-tighter font-numbers">94%</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-accent text-[14px]">trending_up</span>
                  <span className="text-[10px] text-gray-500 font-bold font-label uppercase">+2% vs cycle</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-[#0f0f0f] p-5 shadow-lg border border-white/5">
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-label">Volume</span>
                <span className="material-symbols-outlined text-gray-500 text-[20px]">weight</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-white tracking-tighter font-numbers">124<span className="text-base text-gray-400 font-bold ml-0.5">t</span></span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-accent text-[14px]">trending_up</span>
                  <span className="text-[10px] text-gray-500 font-bold font-label uppercase">+5% total</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-[#0f0f0f] p-5 shadow-lg border border-white/5 col-span-2">
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-label">Team Readiness</span>
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-accent"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-800"></div>
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <span className="text-4xl font-extrabold text-white tracking-tighter font-numbers">7.8</span>
                  <span className="text-sm text-gray-400 font-bold ml-1">/10</span>
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 font-label">Avg. RPE this week</span>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-zinc-900 overflow-hidden border border-white/5">
                <div className="h-full w-[78%] rounded-full bg-accent shadow-[0_0_10px_rgba(181,242,58,0.3)]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Volume Analysis Chart */}
        <section>
          <h2 className="text-lg font-bold text-text-primary font-label mb-4">Volume Analysis</h2>
          <div className="rounded-[2.5rem] bg-[#0f0f0f] p-8 shadow-2xl border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-label">Planned vs Realized</p>
                <h3 className="text-2xl font-extrabold text-white tracking-tight font-label mt-1">Weekly Load</h3>
              </div>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest font-label">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full border border-gray-600"></div>
                  <span className="text-gray-500">Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <span className="text-white">Real</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-end justify-between h-48 gap-4 w-full px-2">
              {[
                { label: "W1", plan: 70, real: 64 },
                { label: "W2", plan: 85, real: 83 },
                { label: "W3", plan: 95, real: 81 },
                { label: "W4", plan: 60, real: 63, active: true },
              ].map((w, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 flex-1 h-full justify-end">
                  <div className="relative w-full max-w-[28px] flex items-end justify-center h-full">
                    <div className="absolute bottom-0 w-full h-[95%] border-2 border-zinc-800 rounded-lg"></div>
                    <div className="absolute bottom-0 w-full rounded-lg bg-accent opacity-90 transition-all duration-700" style={{ height: `${w.real}%` }}></div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest font-label ${w.active ? 'text-accent' : 'text-gray-600'}`}>{w.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Trends */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary font-label">Performance Trends</h2>
            <button className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-text-primary transition-colors font-label">View All</button>
          </div>
          <div className="rounded-[2.5rem] bg-[#0f0f0f] p-8 shadow-2xl border border-white/5 relative overflow-hidden group">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="relative z-10 flex justify-between items-start mb-10">
              <div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-label">Primary Metric</p>
                <h3 className="text-2xl font-extrabold text-white tracking-tight font-label mt-1">Back Squat 1RM</h3>
              </div>
              <span className="rounded-lg bg-zinc-900 border border-white/5 px-2.5 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest font-label">Est. Max</span>
            </div>

            <div className="relative z-10 h-40 w-full flex items-end px-2">
              <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                <path d="M0,120 L80,90 L160,98 L240,45 L320,30" fill="none" stroke="var(--accent-color)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                <path d="M0,120 L80,90 L160,98 L240,45 L320,30 V160 H0 Z" fill="url(#lineGradient)" opacity="0.1" />
                <defs>
                  <linearGradient id="lineGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--accent-color)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--accent-color)', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex justify-between">
                {[
                  { x: 0, y: 120 },
                  { x: 80, y: 90 },
                  { x: 160, y: 98 },
                  { x: 240, y: 45 },
                  { x: 320, y: 30, current: true, val: "145kg" }
                ].map((p, i) => (
                  <div key={i} className="relative h-full flex flex-col justify-end" style={{ width: '2px' }}>
                    <div 
                      className={`absolute left-1/2 -translate-x-1/2 rounded-full ring-8 ring-black transition-all ${p.current ? 'h-4 w-4 bg-accent shadow-[0_0_20px_var(--accent-color)]' : 'h-2 w-2 bg-zinc-600'}`}
                      style={{ bottom: `calc(${160 - p.y}px - ${p.current ? '8px' : '4px'})` }}
                    />
                    {p.current && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-accent whitespace-nowrap shadow-xl">
                        {p.val}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Athlete Status List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary font-label">Athlete Status</h2>
            <span className="material-symbols-outlined text-gray-500 cursor-pointer">filter_list</span>
          </div>
          <div className="flex flex-col gap-3">
            {athleteStatus.map((athlete) => (
              <div 
                key={athlete.id} 
                onClick={() => navigate(`/athletes/${athlete.id}/technical-history`)}
                className="group flex items-center justify-between p-4 rounded-[2rem] bg-[#0f0f0f] border border-white/5 hover:border-accent/20 transition-all cursor-pointer shadow-xl active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full overflow-hidden border-2 border-white/5 bg-zinc-900">
                    <img className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={athlete.avatar} alt={athlete.name} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-white font-label">{athlete.name}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-label">{athlete.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="h-1.5 w-20 rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
                      <div className={`h-full rounded-full ${athlete.color}`} style={{ width: `${athlete.recovery}%` }}></div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest font-label">Recovery</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-700 group-hover:text-accent transition-colors">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoachAnalysis;
