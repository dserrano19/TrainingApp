
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AthleteNotifications: React.FC = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: "Injury Alert",
      desc: "Marc Johnson reported severe knee pain during squat session. Needs immediate physio review.",
      time: "2h ago",
      type: "critical",
      icon: "medical_services",
      iconColor: "text-red-500",
      iconBg: "bg-red-500/10",
      unread: true,
      action: "Review Report",
      section: "TODAY"
    },
    {
      id: 2,
      title: "Milestone Reached",
      desc: "Team A achieved 100% attendance this week. Great consistency overall.",
      time: "5h ago",
      type: "success",
      icon: "emoji_events",
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
      unread: true,
      section: "TODAY"
    },
    {
      id: 3,
      title: "Schedule Change",
      desc: "Morning session moved to 8 AM due to facility maintenance.",
      time: "1d ago",
      type: "warning",
      icon: "schedule",
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10",
      unread: false,
      section: "YESTERDAY"
    },
    {
      id: 4,
      title: "System Update",
      desc: "New performance metrics are now available for all endurance athletes.",
      time: "1d ago",
      type: "info",
      icon: "info",
      iconColor: "text-[#135bec]",
      iconBg: "bg-[#135bec]/10",
      unread: false,
      section: "YESTERDAY"
    },
    {
      id: 5,
      title: "Weekly Summary",
      desc: "Your weekly coaching summary has been generated.",
      time: "2d ago",
      type: "system",
      icon: "archive",
      iconColor: "text-slate-400",
      iconBg: "bg-slate-700/30",
      unread: false,
      isArchived: true,
      section: "YESTERDAY"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-500 pb-40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-5 pt-14 pb-4 flex items-end justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => navigate(-1)}
                className="p-1 -ml-1 text-slate-400 hover:text-black transition-colors"
            >
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-label">Notifications</h1>
        </div>
        <button className="flex items-center gap-1 py-1 text-sm font-medium text-[#135bec] hover:opacity-70 transition-opacity font-label">
          <span>Mark all read</span>
          <span className="material-symbols-outlined text-[18px]">done_all</span>
        </button>
      </header>

      <main className="flex-1 px-4 pt-4 flex flex-col">
        {/* Today Section */}
        <div className="sticky top-[102px] z-10 bg-white py-4">
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-label">Today</h3>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {notifications.filter(n => n.section === "TODAY").map((item) => (
            <div 
              key={item.id}
              className="group relative flex flex-col gap-3 rounded-2xl bg-[#101622] p-4 shadow-sm transition-all active:scale-[0.98] border border-white/5"
            >
              {item.unread && (
                <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(182,242,59,0.6)]"></div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}>
                  <span className="material-symbols-outlined text-[24px] icon-fill">{item.icon}</span>
                </div>
                
                <div className="flex flex-col pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white font-label">{item.title}</span>
                    {item.type === 'critical' && (
                      <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-400 font-label">Critical</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-snug text-slate-400 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between border-t border-slate-800 pt-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-nums">{item.time}</span>
                {item.action && (
                  <button className="flex items-center gap-1 text-[11px] font-bold text-[#135bec] hover:text-white transition-colors uppercase tracking-widest font-label">
                    {item.action}
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Yesterday Section */}
        <div className="sticky top-[102px] z-10 bg-white py-4 mt-4">
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-label">Yesterday</h3>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {notifications.filter(n => n.section === "YESTERDAY").map((item) => (
            <div 
              key={item.id}
              className={`group relative flex flex-col gap-3 rounded-2xl p-4 shadow-sm transition-all active:scale-[0.98] border border-white/5 
                ${item.isArchived ? 'bg-[#101622]/80 opacity-80' : 'bg-[#101622]'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}>
                  <span className="material-symbols-outlined text-[24px] icon-fill">{item.icon}</span>
                </div>
                
                <div className="flex flex-col pt-0.5">
                  <h4 className={`text-sm font-semibold font-label ${item.isArchived ? 'text-slate-300' : 'text-white'}`}>{item.title}</h4>
                  <p className={`mt-1 text-sm leading-snug font-medium ${item.isArchived ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-end border-t border-slate-800/50 pt-3">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-nums">{item.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div className="mt-16 flex flex-col items-center justify-center py-8">
          <div className="rounded-full bg-slate-50 p-5 border border-slate-100 flex items-center justify-center text-slate-300">
            <span className="material-symbols-outlined text-[32px]">check</span>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest font-label">You're all caught up</p>
        </div>
      </main>

      {/* Floating Filter Button */}
      <div className="fixed bottom-28 right-6 z-40">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#135bec] text-white shadow-lg shadow-[#135bec]/30 transition-transform active:scale-90">
          <span className="material-symbols-outlined text-[28px]">filter_list</span>
        </button>
      </div>
    </div>
  );
};

export default AthleteNotifications;
