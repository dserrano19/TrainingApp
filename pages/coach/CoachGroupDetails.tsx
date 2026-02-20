
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';

const CoachGroupDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [groupName, setGroupName] = useState("Cargando...");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    chat: true,
    public: false
  });

  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchTeamDetails();
    }
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();

      if (teamError) throw teamError;
      setGroupName(team.name);

      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('id, full_name, specialty, avatar_url')
        .eq('team_id', id);

      if (profError) throw profError;
      setMembers(profiles.map(p => ({
        id: p.id,
        name: p.full_name || "Atleta sin nombre",
        specs: p.specialty || "Sin especialidad",
        avatar: p.avatar_url
      })));
    } catch (err) {
      console.error('Error fetching team details:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (memberId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ team_id: null })
      .eq('id', memberId);

    if (!error) {
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-40 overflow-x-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-bg-app/95 backdrop-blur-md border-b border-gray-100 px-4 pt-12 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 transition-colors"
        >
          <span className="material-symbols-outlined text-text-primary text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-text-primary absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-label">Detalles del Equipo</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center px-5 py-2.5 bg-black text-accent rounded-full hover:bg-zinc-800 transition-all font-bold text-xs uppercase tracking-widest active:scale-95 shadow-lg shadow-black/10"
        >
          Hecho
        </button>
      </header>

      <main className="flex-1 p-5 space-y-8 max-w-md mx-auto w-full">
        {/* Group Identity Section */}
        <section className="space-y-3">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 font-label">Nombre del Equipo</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <input
              readOnly
              className="block w-full pl-12 pr-4 py-5 bg-white border border-gray-100 rounded-2xl text-xl font-extrabold text-black placeholder-gray-300 focus:outline-none transition-all shadow-sm font-label"
              value={groupName}
            />
          </div>
        </section>

        {/* Settings Section */}
        <section className="space-y-3">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 font-label">Configuración</label>
          <div className="flex flex-col rounded-3xl bg-white border border-gray-100 overflow-hidden divide-y divide-gray-50 shadow-sm">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-black font-label">Chat Grupal</span>
                <span className="text-xs text-gray-500 font-medium font-label">Permitir mensajes entre miembros</span>
              </div>
              <button
                onClick={() => setSettings({ ...settings, chat: !settings.chat })}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${settings.chat ? 'bg-black' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 size-5 bg-accent rounded-full transition-transform duration-200 ${settings.chat ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>
            {/* Toggle 2 */}
            <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-black font-label">Visibilidad Pública</span>
                <span className="text-xs text-gray-500 font-medium font-label">Visible para otros entrenadores</span>
              </div>
              <button
                onClick={() => setSettings({ ...settings, public: !settings.public })}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${settings.public ? 'bg-black' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 size-5 bg-accent rounded-full transition-transform duration-200 ${settings.public ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Members Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] font-label">Miembros ({members.length})</h3>
          </div>

          <div className="flex flex-col gap-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-black transition-all shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative size-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100 ring-2 ring-transparent group-hover:ring-accent transition-all">
                    {member.avatar ? (
                      <img src={member.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={member.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-accent font-bold text-xs font-nums uppercase">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-black font-label">{member.name}</span>
                    <span className="text-[11px] text-gray-500 font-medium font-label">{member.specs}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeMember(member.id); }}
                  className="size-9 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all group/btn"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-4">
          <button className="w-full py-5 px-4 flex items-center justify-center gap-3 border border-red-100 bg-red-50 text-red-600 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest hover:bg-red-100 transition-all active:scale-[0.98] font-label">
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            Eliminar Grupo
          </button>
        </section>
      </main>
    </div>
  );
};

export default CoachGroupDetails;
