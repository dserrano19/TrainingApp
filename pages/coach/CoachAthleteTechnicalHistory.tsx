
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CoachAthleteTechnicalHistory: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [timeframe, setTimeframe] = useState('3M');

  const recentSessions = [
    { date: '14', month: 'JUN', title: 'Hypertrophy Block A', detail: 'Squat Focus • 4 Sets', val: '142.5 kg', isPR: true },
    { date: '10', month: 'JUN', title: 'Strength Maintenance', detail: 'Full Body • 3 Sets', val: '138.0 kg', isPR: false },
    { date: '08', month: 'JUN', title: 'Technique Drill', detail: 'Low Load • 5 Sets', val: '100.0 kg', isPR: false, tag: 'Warmup' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-40">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-bg-app/95 backdrop-blur-md border-b border-widget-border/5 px-4 pt-12 pb-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 transition-colors text-text-primary"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight text-text-primary font-label flex-1 text-center pr-10">Historial Técnico</h1>
      </header>

      <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 py-2 space-y-6">
        {/* Athlete Profile / Selector */}
        <div className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-widget shadow-sm">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full border-2 border-accent bg-cover bg-center grayscale shadow-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLb1Yj6MTx-EJzWgD2Wp8RoiKVO0UgyVK8QiiowAA8e-w6uvCJdJfOYE1Ya0rmaAl6O8rWku858NFWfW3Q_xtAoxeZGMbKenHnOPJZAoidtvSLXu1_Qi4TReIH2KWJnsqnsV5j89dE-YDO_b-pqaREK28VS3A5Aw6wVc2Vtq4XZ6xAlksOT4ZUtvEBSlxjs1GD72ZPVVPH9KjhkCo0WAVKHsgZi7YLDW-UdU8-XS6XPTlJsQSAjZC_vJmfI9azQnfDKhbodSTRrw")' }}></div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 cursor-pointer group">
                <p className="text-text-primary text-lg font-bold leading-none font-label">Juan Pérez</p>
                <span className="material-symbols-outlined text-gray-400 group-hover:text-black transition-colors" style={{ fontSize: '20px' }}>expand_more</span>
              </div>
              <p className="text-gray-500 text-xs font-medium font-label">Sprinter • 100m / 200m • <span className="text-emerald-500 font-bold">Active</span></p>
            </div>
          </div>
          <button className="flex items-center justify-center size-10 bg-black rounded-full text-accent shadow-xl hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>chat</span>
          </button>
        </div>

        {/* Metric Selector & Filters */}
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between bg-black text-white p-5 rounded-2xl shadow-2xl border border-white/5 group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-zinc-800 rounded-xl text-accent ring-1 ring-white/10 group-hover:ring-accent/30 transition-all">
                <span className="material-symbols-outlined text-2xl">fitness_center</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] font-label">Metric selected</p>
                <p className="text-lg font-extrabold font-label tracking-tight">Back Squat (1RM)</p>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
               <span className="material-symbols-outlined">tune</span>
            </div>
          </button>

          {/* Time Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['3M', '6M', 'YTD', '1Y', 'All'].map((t) => (
              <button 
                key={t}
                onClick={() => setTimeframe(t)}
                className={`flex px-5 py-2.5 shrink-0 items-center justify-center rounded-full font-bold text-xs uppercase tracking-widest transition-all
                  ${timeframe === t 
                    ? 'bg-black text-accent shadow-lg shadow-black/10' 
                    : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart Widget */}
        <div className="bg-black rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden border border-white/5">
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>

          <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 font-label">Current Max</p>
              <h3 className="text-5xl font-extrabold tracking-tightest text-white font-numbers">145 <span className="text-lg text-gray-500 font-normal uppercase tracking-widest ml-1">kg</span></h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                <span className="material-symbols-outlined text-[16px] mr-1 font-bold">trending_up</span>
                <span className="font-bold text-xs font-nums">+5%</span>
              </div>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest font-label mt-1">vs. last month</p>
            </div>
          </div>

          {/* Chart SVG */}
          <div className="w-full h-48 relative z-10">
            <svg className="overflow-visible" fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 400 150" width="100%">
              <defs>
                <linearGradient id="technicalChartGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line stroke="#1a1a1a" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="400" y1="30" y2="30"></line>
              <line stroke="#1a1a1a" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="400" y1="75" y2="75"></line>
              <line stroke="#1a1a1a" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="400" y1="120" y2="120"></line>
              
              {/* Area Fill */}
              <path d="M0 120 C20 120 40 40 60 40 C80 40 100 110 120 110 C140 110 160 30 180 30 C200 30 220 130 240 130 C260 130 280 10 300 10 C320 10 340 90 360 90 C380 90 400 30 400 30 V150 H0 Z" fill="url(#technicalChartGrad)"></path>
              
              {/* Line Stroke */}
              <path d="M0 120 C20 120 40 40 60 40 C80 40 100 110 120 110 C140 110 160 30 180 30 C200 30 220 130 240 130 C260 130 280 10 300 10 C320 10 340 90 360 90 C380 90 400 30 400 30" stroke="var(--accent-color)" strokeLinecap="round" strokeWidth="3"></path>
              
              {/* Interactive Point */}
              <circle cx="300" cy="10" fill="var(--accent-color)" r="5" stroke="#000" strokeWidth="2" className="animate-pulse shadow-lg"></circle>
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between mt-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest font-label">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span className="text-accent">Jun</span>
          </div>
        </div>

        {/* Summary Metrics */}
        <div>
          <h3 className="text-black text-lg font-bold mb-4 font-label tracking-tight px-1">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl flex flex-col justify-between h-32 shadow-sm group hover:border-black transition-all">
              <div className="flex items-center gap-2 text-gray-400 group-hover:text-black transition-colors">
                <span className="material-symbols-outlined text-lg">bolt</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">Avg Intensity</span>
              </div>
              <p className="text-4xl font-extrabold text-black font-numbers tracking-tight">88<span className="text-lg text-gray-300 ml-0.5">%</span></p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl flex flex-col justify-between h-32 shadow-sm group hover:border-black transition-all">
              <div className="flex items-center gap-2 text-gray-400 group-hover:text-black transition-colors">
                <span className="material-symbols-outlined text-lg">history</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">Est. 1RM</span>
              </div>
              <p className="text-4xl font-extrabold text-black font-numbers tracking-tight">152<span className="text-base text-gray-300 font-bold ml-1 uppercase tracking-widest">kg</span></p>
            </div>
          </div>
        </div>

        {/* Recent History List */}
        <div className="pb-10">
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-black text-lg font-bold font-label tracking-tight">Recent Sessions</h3>
            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors font-label">See All</button>
          </div>
          <div className="flex flex-col gap-3">
            {recentSessions.map((session, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[1.75rem] shadow-sm hover:shadow-lg hover:border-black transition-all cursor-pointer group active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${session.isPR ? 'bg-black text-accent border-white/10' : 'bg-gray-50 text-gray-400 border-gray-100 group-hover:bg-black group-hover:text-white group-hover:border-black'}`}>
                    <span className="font-bold text-[9px] flex flex-col items-center leading-tight tracking-widest uppercase">
                      <span>{session.month}</span>
                      <span className="text-lg font-numbers">{session.date}</span>
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-black font-bold text-sm font-label truncate">{session.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {session.tag && <span className="bg-gray-100 text-gray-500 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">{session.tag}</span>}
                      <p className="text-gray-400 text-[11px] font-medium font-label">{session.detail}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-black font-extrabold text-sm font-nums tracking-tight">{session.val}</p>
                  {session.isPR && (
                    <div className="flex items-center gap-1 mt-0.5">
                       <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">PR</span>
                       <span className="material-symbols-outlined text-orange-500 text-xs icon-fill">local_fire_department</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoachAthleteTechnicalHistory;
