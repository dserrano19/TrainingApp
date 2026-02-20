
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CoachIntegrations: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-32 overflow-x-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-bg-app/95 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between border-b border-widget-border/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-primary"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-text-primary font-label">Integrations</h1>
        </div>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-primary">
          <span className="material-symbols-outlined text-[24px]">help</span>
        </button>
      </header>

      <main className="flex-1 px-5 pt-8 flex flex-col gap-8 max-w-md mx-auto w-full">
        {/* Header Section */}
        <section>
          <h2 className="text-4xl font-extrabold text-text-primary font-label tracking-tightest leading-none">Platform Sync</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed mt-4 font-label">
            Connect external platforms to automatically import athlete performance metrics and biometrics into TrainingDiary.
          </p>
        </section>

        {/* Active Connections */}
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-lg font-bold text-text-primary font-label">Active Connections</h3>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">1 Active</span>
          </div>
          
          {/* RFEA Card */}
          <div className="bg-black rounded-[2rem] p-6 shadow-2xl flex flex-col gap-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <span className="material-symbols-outlined text-[80px]">sync</span>
            </div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 p-2">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWOokxFKb_k0n2cL_7XXtuwh-Cke3kG5IMgSdIc3NEB0krbshyhXznU8LG1rLgOLcSWnbaNcLCMjpzTINaqWfpGx_rj70DndA3_M78xeX4XItTHJhZgTu_1RI2VEIe0DhFcoHmJdSM1tzW0EIVt58MUCRzWQNYACh3_KkFWK2tx0FJm8gzoYK3MwBcbJiT-H8uVQPaueCjfoPNTTdRESE1DenFa9bJMQeNkxlfr-XDzTCXPwS9kT87OhOqqYx2U7z3cGzuzsRajw" 
                    alt="RFEA logo" 
                    className="w-full h-full object-contain grayscale opacity-80"
                  />
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-xl font-label tracking-tight">RFEA Manager</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="size-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--accent-color)]"></span>
                    <span className="text-accent text-[10px] font-bold uppercase tracking-widest">Syncing Daily</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-600 hover:text-white transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            
            <div className="h-px bg-white/5 w-full relative z-10"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <p className="text-gray-500 text-[11px] font-medium font-nums">Last synced: Today, 09:41 AM</p>
              <button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all border border-white/10 flex items-center gap-2 font-label">
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Configure
              </button>
            </div>
          </div>
        </section>

        {/* Available Integrations */}
        <section className="pb-12">
          <h3 className="text-lg font-bold text-text-primary font-label mb-5 px-1">Available Integrations</h3>
          <div className="flex flex-col gap-3">
            {[
              { 
                name: "Garmin Connect", 
                desc: "Activities, HR, Sleep", 
                logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZfsRJW_EfDVW3a6BfBauohF_AYnkX4TNuLPqM2eGCfdEN-NCx-VLJfU3RaYInpes0rFqnRd7BR2t5nDzJ2IGBhxMm6tjwfkt41iUYEZ0a8DSUWtOiS03PaiFL8X0Q4EWinxYJoChcrce7_esnjje9q10ZlNe5x1xEI-UHL6roFtD1U0YOLprgu2yGPKnzDO2N_lxfpR4jfrXHH7_mxv3Qgx5ytXydWOGZvUqXnr2kh0UGYD1bTIO6JIH-pBC6VnhsxWiBEPXczA",
                color: "bg-blue-600/10 border-blue-600/20"
              },
              { 
                name: "Strava", 
                desc: "Public activities only", 
                logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCArk69Ci6wQbJLaCRO-NkM5QLynVElfV4xySgGmXZvC9yAoljfCXHyIMcrT5_5H8qqGKGqVptMdVyQ6UpOvHKSWfXxhqjTD81EMkec7jrg768cioHnKtvBMqdcefe-wKkcqke1_J_rFUWlpsw-CAdZhaIDBZQoQWP56CxPDJ69J4F-JWSGmHpARoGv3lZxXLK6RIHvtUt9GJ_ujxIOjBvT_wWCAePShswsvnL3-4v_2venunJ1b1ctAqFGl9kKdENNCszTtOzqJA",
                color: "bg-orange-600/10 border-orange-600/20"
              },
              { 
                name: "Polar Flow", 
                desc: "Detailed training load", 
                logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC69gSC8t35WDWVg5Kz_erpFl98krKAnIDKdYY-HOGkjs4JQ9IdRfva-rwRSgQyifEbBnRAw9H26x2IHwFiN-HxwmJucEk92iUwdToU3Fhy7v4MsIzgMY2aUN0yfCbJ1GQjj5RDYZNlIz2jk7V3Rv9UPb21J_0FQHLwvWLBV9UNTMoo5wM7Ll9n1bxXZMx0NPcenCl_cwiOsc-gcO1O3lS896n1LZs0_32eaxEwn42B6yITQgFl4MknaEEW3BhnRQLNK5CxUgAIsA",
                color: "bg-red-600/10 border-red-600/20"
              }
            ].map((platform, i) => (
              <div key={i} className="bg-black rounded-3xl p-5 flex items-center justify-between border border-white/5 shadow-xl hover:border-accent/20 transition-all active:scale-[0.99] group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="size-14 bg-white rounded-2xl flex items-center justify-center p-2.5 overflow-hidden">
                    <img src={platform.logo} alt={platform.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base font-label">{platform.name}</h4>
                    <p className="text-gray-500 text-xs font-medium font-label">{platform.desc}</p>
                  </div>
                </div>
                <button className="bg-accent hover:bg-accent-dim text-black text-xs font-extrabold px-5 py-3 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center gap-1 font-label uppercase tracking-widest active:scale-95">
                  Connect
                  <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                </button>
              </div>
            ))}

            {/* Whoop (Coming Soon) */}
            <div className="bg-black/50 rounded-3xl p-5 flex items-center justify-between border border-white/5 shadow-lg opacity-60 grayscale group">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-zinc-800 rounded-2xl flex items-center justify-center p-2.5 overflow-hidden border border-white/5">
                   <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdSlHaupml6eWq8wQZ4vq24kBKq4lt87rAGeb1VckQcnYMR0MWu86VtWvZnTzmLyCOF7ruYf5atVUkhR2yy15YaJEKkcvbQqg20PqiQ_sQ5w9MwOptKWeOoMbPiWuFDEbykB2igZsBiOnX6ZDT_84JKW-verzT-WddIAQFlie1EpYOOkopUDBzlnrVmtgiZPw0RXRe6mfBFn6wV7pb8MymUjDKMUrYvk9161gQpXSRqu9j3TW8DfVTd__6qJnKXIFdd6pp_V7fLA" alt="Whoop" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-gray-300 font-bold text-base font-label">Whoop</h4>
                  <p className="text-gray-600 text-xs font-medium font-label">Recovery & Strain</p>
                </div>
              </div>
              <div className="bg-zinc-800 text-gray-500 text-[10px] font-bold px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest font-label">
                Coming Soon
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoachIntegrations;
