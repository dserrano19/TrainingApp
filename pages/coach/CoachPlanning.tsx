
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const CoachPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [displayPlans, setDisplayPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch Documents as "Plans"
      const { data: docs, error: docError } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch Teams
      const { data: teams, error: teamError } = await supabase
        .from('teams')
        .select('*, profiles(count)')
        .order('name');

      if (docError) throw docError;
      if (teamError) throw teamError;

      const formattedPlans = [
        ...(docs || []).map(doc => ({
          id: doc.id,
          title: doc.title,
          status: "ACTIVE",
          updated: `Created ${new Date(doc.created_at).toLocaleDateString()}`,
          duration: "4 Weeks Block",
          remaining: "Document Uploaded",
          load: "Multi-Focus",
          loadIcon: "description",
          completion: 100,
          athletes: [],
          extraAthletes: 0
        })),
        ...(teams || []).map(team => ({
          id: team.id,
          title: team.name,
          status: "TEAM",
          updated: `Code: ${team.code}`,
          isGroup: true,
          groupName: team.name,
          completion: 0,
          athletesCount: team.profiles?.[0]?.count || 0
        }))
      ];

      setDisplayPlans(formattedPlans);
    } catch (err) {
      console.error('Error fetching planning data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-500 pb-40 overflow-x-hidden">
      {/* Create Selection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-black font-label tracking-tight">¿Qué quieres crear?</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => navigate('/planning/upload')}
                className="group flex items-center gap-6 p-6 rounded-3xl bg-black hover:bg-zinc-800 transition-all text-left shadow-xl"
              >
                <div className="size-14 rounded-2xl bg-accent flex items-center justify-center text-black shadow-lg shadow-accent/20">
                  <span className="material-symbols-outlined text-3xl icon-fill">fitness_center</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg font-label">Entrenamiento</p>
                  <p className="text-gray-400 text-sm font-medium">Subir plan, asignar bloques o series.</p>
                </div>
                <span className="material-symbols-outlined text-accent ml-auto group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>

              <button
                onClick={() => navigate('/management/competitions')}
                className="group flex items-center gap-6 p-6 rounded-3xl bg-white border-2 border-gray-100 hover:border-black transition-all text-left"
              >
                <div className="size-14 rounded-2xl bg-gray-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl icon-fill">emoji_events</span>
                </div>
                <div>
                  <p className="text-black font-bold text-lg font-label">Competición</p>
                  <p className="text-gray-500 text-sm font-medium">Gestionar calendario y mínimas.</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 ml-auto group-hover:text-black group-hover:translate-x-1 transition-all">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between transition-colors duration-300">
        <div>
          <h1 className="text-4xl font-extrabold text-black font-label tracking-tightest leading-none">Planificación</h1>
          <p className="text-sm text-gray-500 font-medium mt-1 font-label">Manage cycles & programs</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="group bg-accent text-black rounded-full h-11 px-5 flex items-center justify-center gap-2 shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[20px] font-bold">add</span>
          <span className="text-[13px] font-bold tracking-tight font-label uppercase">Create</span>
        </button>
      </header>

      {/* Search & Filters */}
      <div className="px-5 py-4 space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-black transition-colors">search</span>
          </div>
          <input
            className="block w-full pl-11 pr-4 py-4 border-none rounded-2xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-accent focus:bg-white transition-all duration-200 font-medium text-sm"
            placeholder="Search plans or athletes..."
            type="text"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Active', 'Drafts', 'Archived', 'Groups'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all
                ${activeTab === tab
                  ? 'bg-black text-accent shadow-lg shadow-black/10'
                  : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
            >
              {tab}
              {tab === 'Drafts' && <span className="ml-1.5 opacity-50 font-numbers text-[10px]">2</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans List */}
      <main className="px-5 space-y-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="size-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 font-label">Loading Planning Data...</p>
          </div>
        ) : displayPlans.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 mx-5 mt-10">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">inventory_2</span>
            <p className="text-sm font-bold text-gray-500 font-label uppercase tracking-widest">No plans or groups yet</p>
            <button onClick={() => setShowCreateModal(true)} className="mt-4 text-accent font-bold text-xs uppercase tracking-widest">Create First Plan</button>
          </div>
        ) : (
          displayPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => plan.isCompetition ? navigate('/planning/competition-detail') : navigate(`/planning/edit/${plan.id}`)}
              className={`group bg-black rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden border border-white/5 active:scale-[0.99] transition-all cursor-pointer ${plan.isCompetition ? 'ring-2 ring-accent/20' : ''}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest font-label border
                      ${plan.status === 'ACTIVE' ? 'bg-accent/10 text-accent border-accent/20' :
                        plan.status === 'COMPETITION' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          plan.status === 'STARTING SOON' ? 'bg-zinc-800 text-gray-400 border-zinc-700' :
                            'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {plan.status}
                    </span>
                    {plan.isGroup && (
                      <span className="bg-zinc-800 text-gray-400 text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest border border-zinc-700">Group</span>
                    )}
                    {plan.updated && (
                      <span className={`text-[10px] font-medium ${plan.isCompetition ? 'text-blue-400/70 font-bold uppercase tracking-widest' : 'text-gray-500'}`}>{plan.updated}</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight font-label">{plan.title}</h3>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); }}>
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>

              {/* Metrics Grid */}
              {!plan.isGroup && (
                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-label mb-1.5">{plan.startDate ? 'Start Date' : 'Duration'}</p>
                    <p className={`text-sm font-bold font-nums ${plan.isCompetition ? 'text-blue-400' : 'text-gray-100'}`}>{plan.startDate || plan.duration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-label mb-1.5">{plan.focus ? 'Focus' : 'Load'}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-[16px] text-accent`}>{plan.focusIcon || plan.loadIcon}</span>
                      <p className="text-sm font-bold text-gray-100 font-label">{plan.focus || plan.load}</p>
                    </div>
                  </div>
                </div>
              )}

              {plan.isGroup && (
                <div className="flex items-center gap-2.5 mb-6 relative z-10">
                  <div className="size-7 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="material-symbols-outlined text-[14px] text-gray-400">groups</span>
                  </div>
                  <span className="text-sm font-bold text-gray-300 font-label">{plan.groupName}</span>
                </div>
              )}

              {/* Progress Bar & Footer */}
              <div className="flex items-end justify-between relative z-10 pt-2">
                {plan.isGroup ? (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent font-label">Athletes: {plan.athletesCount}</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 flex-1 mr-6">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-label">Status</span>
                      <span className="text-[11px] font-bold font-numbers text-accent">Ready</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-accent" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                )}

                {plan.athletes && plan.athletes.length > 0 && (
                  <div className="flex -space-x-3 shrink-0">
                    {plan.athletes.map((src, i) => (
                      <img key={i} className="w-9 h-9 rounded-full border-2 border-black object-cover" src={src} alt="Athlete" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default CoachPlanning;
