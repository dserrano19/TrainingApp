
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CoachNotifications: React.FC = () => {
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
      link: "/athletes/1",
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
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
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
      iconColor: "text-gray-400",
      iconBg: "bg-gray-700/30",
      unread: false,
      isArchived: true,
      section: "YESTERDAY"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-500 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-5 pt-14 pb-4 flex items-end justify-between border-b border-gray-100">
        <h1 className="text-3xl font-extrabold tracking-tight text-black font-label">Notifications</h1>
        <button className="flex items-center gap-1 text-[11px] font-bold text-[#135bec] hover:opacity-70 transition-opacity uppercase tracking-widest font-label">
          Mark all read
          <span className="material-symbols-outlined text-[16px]">done_all</span>
        </button>
      </header>

      <main className="flex-1 px-4 pt-6 flex flex-col">
        {/* Sections Mapping */}
        {["TODAY", "YESTERDAY"].map((sectionLabel) => (
          <div key={sectionLabel} className="mb-6">
            <div className="flex items-center gap-3 mb-4 px-1">
              <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] font-label">{sectionLabel}</h2>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>
            
            <div className="flex flex-col gap-4">
              {notifications.filter(n => n.section === sectionLabel).map((item) => (
                <div 
                  key={item.id}
                  className={`group relative flex w-full flex-col rounded-[1.5rem] p-5 border border-white/5 transition-all active:scale-[0.98] cursor-pointer shadow-lg
                    ${item.isArchived ? 'bg-gray-500/80 opacity-80' : 'bg-[#101622] text-white'}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon Box */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor} border border-white/5`}>
                      <span className={`material-symbols-outlined text-[24px] ${!item.isArchived ? 'icon-fill' : ''}`}>{item.icon}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-bold leading-tight font-label ${item.isArchived ? 'text-gray-200' : 'text-white'}`}>{item.title}</h3>
                        {item.type === 'critical' && (
                          <span className="bg-red-500/20 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-label">Critical</span>
                        )}
                      </div>
                      <p className={`text-sm leading-snug font-medium opacity-70 ${item.isArchived ? 'text-gray-300' : 'text-gray-400'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className={`mt-4 flex items-center justify-between pt-3 border-t ${item.isArchived ? 'border-white/10' : 'border-white/5'}`}>
                    <span className="text-[10px] font-bold text-gray-500 font-nums uppercase tracking-widest">{item.time}</span>
                    {item.action && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if(item.link) navigate(item.link);
                        }}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#135bec] flex items-center gap-1 font-label"
                      >
                        {item.action} 
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Unread Indicator */}
                  {item.unread && (
                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(182,242,59,0.6)]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Empty State / Caught up */}
        <div className="mt-12 flex flex-col items-center justify-center py-12">
          <div className="size-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100">
            <span className="material-symbols-outlined text-[32px]">check</span>
          </div>
          <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest font-label">You're all caught up</p>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-28 right-6 z-40">
        <button className="size-14 bg-[#135bec] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#135bec]/30 active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[28px]">filter_list</span>
        </button>
      </div>
    </div>
  );
};

export default CoachNotifications;
