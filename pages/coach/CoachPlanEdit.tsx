
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Exercise {
  id: string;
  name: string;
  type: string;
  sets: string;
  reps: string;
  load: string;
}

interface SessionDay {
  id: string;
  day: string;
  title: string;
  duration: string;
  intensity: string;
  isExpanded: boolean;
  exercises: Exercise[];
  resource?: string;
}

const CoachPlanEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [planName, setPlanName] = useState("Marathon Prep: Phase 1");
  const [tags, setTags] = useState(["Endurance", "Strength"]);
  const [sessions, setSessions] = useState<SessionDay[]>([
    {
      id: 'mon',
      day: 'Mon',
      title: 'Lower Body Power',
      duration: '90 min',
      intensity: 'High Intensity',
      isExpanded: true,
      exercises: [
        { id: 'ex1', name: 'Back Squat', type: 'Primary Lift', sets: '4', reps: '5', load: '80%' },
        { id: 'ex2', name: 'Box Jumps', type: 'Plyometrics', sets: '3', reps: '5', load: '-' }
      ],
      resource: 'Technique_Guide.pdf'
    },
    {
      id: 'tue',
      day: 'Tue',
      title: 'Active Recovery',
      duration: '45 min',
      intensity: 'Zone 2',
      isExpanded: false,
      exercises: []
    },
    {
      id: 'wed',
      day: 'Wed',
      title: 'Threshold Intervals',
      duration: '60 min',
      intensity: 'Track',
      isExpanded: false,
      exercises: []
    }
  ]);

  const toggleDay = (dayId: string) => {
    setSessions(sessions.map(s => s.id === dayId ? { ...s, isExpanded: !s.isExpanded } : s));
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-40">
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex items-center bg-bg-app/95 backdrop-blur-md px-4 pt-12 pb-4 border-b border-gray-100 justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-text-primary"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-text-primary text-lg font-bold leading-tight flex-1 text-center font-label">Edit Plan</h2>
        <button 
          onClick={() => navigate(-1)}
          className="flex h-9 items-center justify-center px-5 rounded-full bg-black hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-black/10"
        >
          <p className="text-accent text-xs font-bold uppercase tracking-widest font-label">Save</p>
        </button>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 py-6 flex flex-col gap-8">
        {/* Plan Metadata Section */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-label ml-1">Plan Name</label>
            <input 
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-xl font-extrabold text-text-primary placeholder:text-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none font-label" 
              placeholder="Enter plan name" 
              type="text" 
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-label ml-1">Duration</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">calendar_today</span>
                <input className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none font-nums" type="text" defaultValue="Oct 24, 2023"/>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="material-symbols-outlined">trending_flat</span>
              </div>
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">event</span>
                <input className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none font-nums" type="text" defaultValue="Dec 15, 2023"/>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-label ml-1">Focus Areas</label>
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <button key={tag} className="flex h-9 items-center gap-2 rounded-full bg-accent px-4 shadow-lg shadow-accent/10 transition-transform active:scale-95 group">
                  <span className="material-symbols-outlined text-black text-[18px] font-bold">check</span>
                  <span className="text-black text-xs font-bold uppercase tracking-widest font-label">{tag}</span>
                </button>
              ))}
              <button className="flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 transition-all hover:border-black active:scale-95">
                <span className="material-symbols-outlined text-gray-400 text-[18px]">add</span>
                <span className="text-gray-600 text-xs font-bold uppercase tracking-widest font-label">Add Tag</span>
              </button>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-gray-100"></div>

        {/* Weekly Structure */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-2xl font-extrabold text-text-primary font-label tracking-tight">Weekly Structure</h3>
            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors font-label">Expand All</button>
          </div>

          <div className="flex flex-col gap-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex flex-col rounded-[2rem] bg-black shadow-2xl overflow-hidden border border-white/5 transition-all duration-300">
                {/* Session Header */}
                <div 
                  onClick={() => toggleDay(session.id)}
                  className={`flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-900 transition-colors ${session.isExpanded ? 'border-b border-white/5' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl transition-all ${session.isExpanded ? 'bg-accent text-black shadow-lg shadow-accent/20 scale-105' : 'bg-zinc-800 text-gray-400'}`}>
                      <span className="text-sm font-extrabold font-nums tracking-tighter uppercase">{session.day}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base font-label">{session.title}</h4>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest font-label">{session.duration} • {session.intensity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.isExpanded ? (
                      <button className="text-gray-500 hover:text-white transition-colors p-2">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    ) : (
                      <span className="material-symbols-outlined text-gray-700">expand_more</span>
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {session.isExpanded && (
                  <div className="flex flex-col p-5 gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-3">
                      {session.exercises.length > 0 ? (
                        session.exercises.map((ex) => (
                          <div key={ex.id} className="flex items-center justify-between bg-zinc-900 rounded-2xl p-4 border border-white/5 group relative overflow-hidden">
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/20 group-hover:bg-accent transition-colors"></div>
                             <div className="flex items-center gap-4 pl-1">
                                <span className="material-symbols-outlined text-gray-700 cursor-move hover:text-white transition-colors">drag_indicator</span>
                                <div>
                                  <p className="text-white text-sm font-bold font-label">{ex.name}</p>
                                  <p className="text-gray-500 text-[10px] font-medium font-label">{ex.type}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-5 pr-1">
                                <div className="flex flex-col items-center">
                                  <span className="text-accent font-extrabold text-sm font-numbers">{ex.sets}</span>
                                  <span className="text-gray-600 text-[8px] font-bold uppercase tracking-widest font-label">Sets</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-white font-extrabold text-sm font-numbers">{ex.reps}</span>
                                  <span className="text-gray-600 text-[8px] font-bold uppercase tracking-widest font-label">Reps</span>
                                </div>
                                <div className="flex flex-col items-center min-w-[32px]">
                                  <span className="text-white font-extrabold text-sm font-numbers">{ex.load}</span>
                                  <span className="text-gray-600 text-[8px] font-bold uppercase tracking-widest font-label">Load</span>
                                </div>
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl opacity-40">
                           <span className="material-symbols-outlined text-gray-500 mb-2">fitness_center</span>
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-label">No exercises defined</p>
                        </div>
                      )}
                    </div>

                    {/* Add Exercise */}
                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-800 py-5 hover:bg-zinc-900 hover:border-accent/40 transition-all group active:scale-[0.99]">
                      <span className="material-symbols-outlined text-accent group-hover:scale-110 transition-transform">add_circle</span>
                      <span className="text-accent text-[11px] font-bold uppercase tracking-widest font-label">Add Exercise</span>
                    </button>

                    {/* Resources Footer */}
                    {session.resource && (
                      <div className="bg-zinc-900/50 rounded-2xl px-5 py-4 flex items-center justify-between border border-white/5 mt-2">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
                            <span className="material-symbols-outlined text-lg">attach_file</span>
                          </div>
                          <span className="text-gray-400 text-[11px] font-medium font-label">{session.resource}</span>
                        </div>
                        <button className="text-accent text-[10px] font-bold uppercase tracking-widest font-label hover:underline">Edit</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <button className="flex w-full items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-gray-200 bg-transparent py-6 transition-all hover:bg-gray-50 hover:border-black group active:scale-[0.98]">
              <span className="material-symbols-outlined text-text-primary group-hover:rotate-12 transition-transform text-2xl">playlist_add</span>
              <span className="text-text-primary font-extrabold text-[13px] uppercase tracking-[0.2em] font-label">Add Training Session</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoachPlanEdit;
