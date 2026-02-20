
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CoachAthletePerformance: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data for Elena Rodriguez (flagged as "At Risk")
  const athlete = {
    id: id || 'elena-1',
    name: "Elena Rodriguez",
    category: "Triathlon Elite",
    phase: "Pre-Season Building",
    lastSync: "2h ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr1Wo7bn3O8gqkJo22jb_CeHymxEQQGrHSTN7tqW2TlGSusLG4OvCTELFyYmzR4RLpqMCVHesqDDjpHMzPjEc4ieXPJiShW-RmkFpEaf6OID9WaYsUMfgqrOI4ZhuAuBkOybyKx4KkopWB3CVVlW8tGs_wb8zCnP3FnLgVfLDM3r2B55w1ANxJFIbEc9MvvFHsB88jQXHXAa__oaNWrbw3xpfBDM5ArkV2ygcq7wHsneRDAfFZcNX_owuB3SauBxyMScQsnu_Otw",
    readiness: {
      status: "At Risk",
      desc: "High fatigue indicators reported post-session. HRV dropped significantly (-15ms).",
      type: "critical"
    },
    metrics: [
      { label: "Weekly Load", val: "450", unit: "AU", trend: "+12% vs last week", icon: "trending_up", color: "text-accent" },
      { label: "Sleep Quality", val: "85", unit: "%", trend: "7h 42m avg", icon: "bedtime", color: "text-gray-400" },
      { label: "RPE Avg", val: "8", unit: "/10", trend: "High Intensity", icon: "sentiment_dissatisfied", color: "text-orange-400" }
    ],
    alerts: [
      { id: 'a1', title: "Right Knee Pain", desc: "Reported after yesterday's long run. Pain level 4/10.", type: "new", icon: "medical_services", color: "text-red-500", bg: "bg-[#fff4f4]" },
      { id: 'a2', title: "Missed Session: Strength", desc: "Tuesday gym session marked as incomplete.", type: "action", icon: "event_busy", color: "text-yellow-600", bg: "bg-yellow-50" }
    ],
    activity: [
      { id: 'ac1', title: "Tempo Run 10k", time: "Today, 07:00 AM", status: "Done", desc: "Felt good initially, faded last 2km.", color: "bg-accent" },
      { id: 'ac2', title: "Strength & Conditioning", time: "Yesterday", status: "Missed", desc: "No data logged.", color: "bg-gray-300" },
      { id: 'ac3', title: "Recovery Swim", time: "Monday", status: "Done", desc: "Easy pace, focus on technique.", color: "bg-accent" }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-32">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-bg-app/90 backdrop-blur-md border-b border-widget-border/5 px-4 pt-12 pb-3 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-primary"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-text-primary text-lg font-bold leading-tight tracking-tight font-label">{athlete.name}</h2>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-primary">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      <main className="flex flex-col w-full max-w-md mx-auto">
        {/* Profile Header Compact */}
        <section className="px-6 py-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div 
                className="w-20 h-20 rounded-full bg-gray-200 bg-center bg-cover border-2 border-white shadow-xl" 
                style={{ backgroundImage: `url("${athlete.avatar}")` }}
              ></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-accent rounded-full border-2 border-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px] text-black font-bold">check</span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[9px] font-bold text-text-primary uppercase tracking-widest font-label">
                  {athlete.category}
                </span>
              </div>
              <p className="text-text-secondary text-xs font-medium font-label">
                Phase: <span className="text-text-primary font-bold">{athlete.phase}</span>
              </p>
              <p className="text-text-secondary text-[10px] mt-1 font-nums uppercase tracking-wide">Last Sync: {athlete.lastSync}</p>
            </div>
          </div>
        </section>

        {/* Status Widget (Hero) */}
        <section className="px-6 mb-8">
          <div className="bg-widget rounded-[2rem] p-7 shadow-2xl relative overflow-hidden group border border-white/5">
            {/* Subtle texture overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="flex flex-col gap-1">
                <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold font-label">Readiness Status</p>
                <h3 className="text-accent text-4xl font-extrabold tracking-tightest font-label my-1">At Risk</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[90%] font-medium">
                  {athlete.readiness.desc}
                </p>
              </div>
              <div className="bg-accent/20 p-3 rounded-2xl text-accent border border-accent/20">
                <span className="material-symbols-outlined text-3xl icon-fill">warning</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex gap-4 relative z-10">
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl transition-all border border-white/5 font-label active:scale-[0.98]">
                Adjust Plan
              </button>
              <button className="flex-1 bg-accent text-black text-xs font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-accent-dim transition-all shadow-xl shadow-accent/20 font-label active:scale-[0.98]">
                Message
              </button>
            </div>
          </div>
        </section>

        {/* Key Metrics Grid */}
        <section className="px-6 mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-text-primary text-lg font-bold tracking-tight font-label">Current Metrics</h3>
            <button className="text-xs text-accent font-bold uppercase tracking-widest hover:underline font-label">View Trends</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {athlete.metrics.map((metric, i) => (
              <div key={i} className="bg-widget p-5 rounded-[1.5rem] flex flex-col justify-between aspect-[1.3/1] border border-white/5 shadow-xl group">
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest font-label">{metric.label}</span>
                  <span className={`material-symbols-outlined ${metric.color} text-xl group-hover:scale-110 transition-transform`}>{metric.icon}</span>
                </div>
                <div>
                  <p className="text-white text-3xl font-extrabold tracking-tighter font-numbers">
                    {metric.val}<span className="text-sm text-gray-500 font-bold ml-1">{metric.unit}</span>
                  </p>
                  <p className={`${metric.color} text-[9px] font-bold mt-1 uppercase tracking-widest font-label`}>{metric.trend}</p>
                </div>
              </div>
            ))}
            <button className="bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 p-5 rounded-[1.5rem] flex flex-col justify-center items-center aspect-[1.3/1] transition-all hover:bg-accent/5 hover:border-accent group">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-accent text-3xl mb-1 transition-colors">add_chart</span>
              <p className="text-gray-500 group-hover:text-accent text-[10px] font-bold uppercase tracking-widest font-label">Add Widget</p>
            </button>
          </div>
        </section>

        {/* Active Alerts Section */}
        <section className="px-6 mb-10">
          <h3 className="text-text-primary text-lg font-bold tracking-tight mb-4 px-1 font-label">Active Alerts</h3>
          <div className="flex flex-col gap-3">
            {athlete.alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${alert.bg} ${alert.id === 'a1' ? 'border-red-100 shadow-md' : 'border-yellow-100'}`}>
                <div className={`p-2 rounded-xl bg-white shadow-sm flex-shrink-0 ${alert.color}`}>
                  <span className="material-symbols-outlined text-[20px] icon-fill">{alert.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-text-primary font-bold text-sm font-label">{alert.title}</p>
                    {alert.type === 'new' && (
                      <span className="text-[9px] text-red-500 font-extrabold uppercase tracking-widest font-label animate-pulse">New</span>
                    )}
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed font-medium">
                    {alert.desc}
                  </p>
                  {alert.type === 'action' && (
                    <button className="text-[10px] text-text-primary underline font-bold uppercase tracking-widest mt-2 font-label">Reschedule</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity Feed */}
        <section className="px-6 mb-12">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-text-primary text-lg font-bold tracking-tight font-label">Recent Activity</h3>
            <span className="material-symbols-outlined text-gray-400 text-xl">calendar_today</span>
          </div>
          <div className="relative pl-6 border-l-2 border-gray-100 dark:border-white/5 space-y-8">
            {athlete.activity.map((item) => (
              <div key={item.id} className="relative">
                <div className={`absolute -left-[33px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-bg-app ${item.color}`}></div>
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex flex-col">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-nums">{item.time}</p>
                    <h4 className="text-text-primary font-extrabold text-base font-label mt-0.5">{item.title}</h4>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest font-label ${item.status === 'Missed' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-accent/10 text-accent-dim border border-accent/20'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-text-secondary text-sm font-medium line-clamp-1 italic font-serif">"{item.desc}"</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoachAthletePerformance;
