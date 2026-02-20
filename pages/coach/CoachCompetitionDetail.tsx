
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CoachCompetitionDetail: React.FC = () => {
  const navigate = useNavigate();

  const registeredAthletes = [
    {
      id: '1',
      name: "Sarah Jenkins",
      event: "Long Jump",
      status: "Ready",
      target: "6.15m",
      pb: "6.32m",
      diff: "+0.17m",
      progress: 100,
      isPositive: true,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqC7CpQXJxVpZdeYusE3tjCq1RK5RLSXnyZG4n3BuvpMeHIhwWZNCmkFQJYiMwHX3yUX6v9Gk2tu2Qh2eNsCgCHjxVSQxKj7gCZfgLUrXSS2mvZSB-CFEc4AyhXv2A2W0PkrbBgzqKSyb2y4MR24rXIJe35sPUbweo4QqirtN1GasNu4QTa030VVW99rXRCFx2I38Cle_EvvIItvJZviqekW-9nf7H7ad95ZFMiuUTRdc0F4cqIQTAp6Ez3LdIoCj7uUo_YIH_MA"
    },
    {
      id: '2',
      name: "John Doe",
      event: "100m Dash",
      status: "On Watch",
      target: "10.50s",
      pb: "10.58s",
      diff: "-0.08s",
      progress: 92,
      isPositive: false,
      avatar: null
    },
    {
      id: '3',
      name: "Marcus Allen",
      event: "400m Relay",
      status: "Ready",
      target: "42.00s",
      pb: "41.80s",
      diff: "-0.20s",
      progress: 100,
      isPositive: false,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoB2x0DEok9J0RZKFGj0lzjK2tcUkx8slrRVz5auw0PBv5eZEmiP0kuq-NzJ6ffTOlf6ulBqdO0jHNDawqf0PhJLf_YHfaz66kqaE_Q0cixtem_LK6j9Gv3IZckFb2aCB5N_khNRKS9OYbCLPY_Morpqy1tTMyje96JvirwHGFcogOkUspda5qS87ZvUJevFzp7-CMMXhPpIpt2F6PwFO1DMT0NUo2Ghg4--rODN08jIjSvKj7gCZfgLUrXSS2mvZSB-CFEc4AyhXv2A2W0PkrbBgzqKSyb2y4MR24rXIJe35sPUbweo4QqirtN1GasNu4QTa030VVW99rXRCFx2I38Cle_EvvIItvJZviqekW-9nf7H7ad95ZFMiuUTRdc0F4cqIQTAp6Ez3LdIoCj7uUo_YIH_MA"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-500 pb-40 overflow-x-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 pt-12 pb-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 transition-colors text-black"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight truncate flex-1 text-center font-label">Competition Detail</h1>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-accent hover:bg-zinc-800 transition-colors">
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col w-full max-w-md mx-auto">
        {/* Competition Header Info */}
        <section className="p-5 flex flex-col gap-4">
          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-black text-white uppercase tracking-widest font-label mb-2">
              Official Meet
            </span>
            <h2 className="text-3xl font-extrabold tracking-tightest leading-tight mb-2 font-label text-black">State Championships 2024</h2>
            <p className="font-serif text-gray-500 italic text-sm leading-relaxed">
              The annual state qualifier event. Top 3 athletes per event advance to Nationals.
            </p>
          </div>

          {/* Date and Location Cards */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200 shadow-sm">
                <span className="material-symbols-outlined text-black">calendar_month</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-label mb-0.5">Date</p>
                <p className="font-bold text-sm text-black font-nums">Oct 14 - Oct 16, 2024</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-gray-100 h-24 group cursor-pointer active:scale-[0.99] transition-all">
              <div className="absolute inset-0 bg-zinc-800">
                <img
                  alt="Map location"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity"
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                />
              </div>
              <div className="absolute inset-0 p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-lg ring-4 ring-black/10">
                    <span className="material-symbols-outlined text-black icon-fill">location_on</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 font-label mb-0.5">Location</p>
                    <p className="font-bold text-white text-sm">Hayward Field, Eugene, OR</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-white">chevron_right</span>
              </div>
            </div>
          </div>
        </section>

        {/* Standards / Widget Area */}
        <section className="pl-5 pb-6">
          <div className="flex items-center justify-between pr-5 mb-3">
            <h3 className="text-lg font-bold text-black font-label">Event Standards</h3>
            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black flex items-center gap-1 font-label">
              View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2 pr-5 no-scrollbar snap-x">
            {[
              { event: "100m Dash", sub: "Men's Varsity", val: "10.50s" },
              { event: "Long Jump", sub: "Women's Open", val: "6.15m" }
            ].map((std, i) => (
              <div key={i} className="snap-start shrink-0 w-[160px] bg-black rounded-3xl p-5 flex flex-col justify-between h-[130px] group cursor-pointer relative overflow-hidden shadow-xl">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-accent/10 rounded-full blur-xl group-hover:bg-accent/20 transition-all"></div>
                <div>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest font-label mb-1">{std.event}</p>
                  <p className="text-white text-sm font-serif italic">{std.sub}</p>
                </div>
                <div>
                  <p className="text-accent text-2xl font-bold tracking-tight font-nums">{std.val}</p>
                  <p className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em] font-label">Min. Qual</p>
                </div>
              </div>
            ))}
            <div className="snap-start shrink-0 w-[160px] bg-white border-2 border-dashed border-gray-100 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-accent transition-all">
              <span className="material-symbols-outlined text-gray-300 group-hover:text-accent text-3xl">add_circle</span>
              <span className="font-bold text-[10px] text-gray-400 uppercase tracking-widest font-label">Add Event</span>
            </div>
          </div>
        </section>

        {/* Roster List */}
        <section className="px-5 flex-1 pb-10">
          <div className="flex items-end justify-between mb-6 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-lg font-bold text-black font-label">Registered Athletes</h3>
              <p className="text-[10px] text-gray-400 font-serif italic mt-1">12 of 15 slots filled</p>
            </div>
            <button className="bg-accent hover:bg-accent-dim text-black p-2.5 rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-90">
              <span className="material-symbols-outlined text-[20px] font-bold">person_add</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {registeredAthletes.map((athlete) => (
              <div key={athlete.id} className="group flex flex-col bg-white border border-gray-100 rounded-[2rem] p-5 hover:border-black transition-all shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-full bg-gray-100 border border-gray-200 overflow-hidden relative shadow-inner">
                      {athlete.avatar ? (
                        <img src={athlete.avatar} className="w-full h-full object-cover" alt={athlete.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black text-accent text-[10px] font-bold font-nums uppercase">
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-black font-label">{athlete.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-label">{athlete.event}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest font-label shadow-sm ${athlete.status === 'Ready' ? 'bg-accent/20 text-black border border-accent/20' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="material-symbols-outlined text-[14px]">{athlete.status === 'Ready' ? 'check_circle' : 'warning'}</span>
                    <span>{athlete.status}</span>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden flex relative">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${athlete.status === 'Ready' ? 'bg-accent' : 'bg-black'}`}
                    style={{ width: `${athlete.progress}%` }}
                  ></div>
                  {!athlete.isPositive && athlete.status !== 'Ready' && (
                    <div className="absolute right-0 top-0 h-full w-0.5 bg-red-500 z-10"></div>
                  )}
                </div>

                <div className="flex justify-between mt-3 text-[10px] font-nums font-bold tracking-tight">
                  <span className="text-gray-400 uppercase">Target: {athlete.target}</span>
                  <span className={athlete.isPositive ? 'text-emerald-500' : 'text-red-500'}>
                    PB: {athlete.pb} ({athlete.diff})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoachCompetitionDetail;
