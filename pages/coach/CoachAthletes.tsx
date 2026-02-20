
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface AthleteListItem {
  id: string;
  name: string;
  spec: string;
  status: string;
  detail: string;
  avatar: string;
  badge: string;
  color: string;
  textColor: string;
}

const CoachAthletes: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [athletes, setAthletes] = useState<AthleteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamInfo, setTeamInfo] = useState<{ name: string; athleteCount: number } | null>(null);

  useEffect(() => {
    if (user) {
      fetchTeamAndAthletes();
    }
  }, [user]);

  const fetchTeamAndAthletes = async () => {
    try {
      setLoading(true);

      // 1. Get coach's team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('id, name')
        .eq('coach_id', user!.id)
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        setLoading(false);
        return;
      }

      // 2. Get athletes in that team
      const { data: athleteProfiles, error: athleteError } = await supabase
        .from('profiles')
        .select(`
          id, 
          full_name, 
          specialty, 
          avatar_url,
          injuries (status, name)
        `)
        .eq('team_id', teamData.id);

      if (athleteError) throw athleteError;

      const formattedAthletes: AthleteListItem[] = athleteProfiles.map(p => {
        const activeInjury = (p.injuries as any[])?.find(i => i.status === 'active');
        const recoveringInjury = (p.injuries as any[])?.find(i => i.status === 'recovering');

        let status = "READY";
        let detail = "On Track";
        let badge = "check_circle";
        let color = "bg-accent";
        let textColor = "text-accent";

        if (activeInjury) {
          status = "INJURED";
          detail = activeInjury.name;
          badge = "medical_services";
          color = "bg-red-600";
          textColor = "text-red-500";
        } else if (recoveringInjury) {
          status = "RECOVERING";
          detail = recoveringInjury.name;
          badge = "healing";
          color = "bg-yellow-500";
          textColor = "text-yellow-500";
        }

        return {
          id: p.id,
          name: p.full_name || "Atleta sin nombre",
          spec: p.specialty || "Sin especialidad",
          status,
          detail,
          avatar: p.avatar_url || "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg",
          badge,
          color,
          textColor
        };
      });

      setAthletes(formattedAthletes);
      setTeamInfo({ name: teamData.name, athleteCount: formattedAthletes.length });
    } catch (err) {
      console.error('Error fetching athletes:', err);
    } finally {
      setLoading(false);
    }
  };

  const criticalCount = athletes.filter(a => a.status === 'INJURED').length;
  const watchCount = athletes.filter(a => a.status === 'RECOVERING').length;
  const readyCount = athletes.filter(a => a.status === 'READY').length;

  return (
    <div className="p-0 pb-32 animate-in fade-in duration-500 bg-bg-app min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-border-light pt-12 text-black">
        <div className="flex items-center px-5 justify-between h-20">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary font-label">Atletas</h2>
            <p className="text-[10px] text-text-muted font-bold tracking-[0.2em] uppercase mt-1 font-label">
              {teamInfo?.name || "Cargando..."} • {teamInfo?.athleteCount || 0} Activos
            </p>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button className="flex items-center justify-center rounded-full w-10 h-10 text-text-primary hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-[24px]">tune</span>
            </button>
            <button
              onClick={() => navigate('/athletes/invite')}
              className="flex items-center justify-center rounded-full w-10 h-10 bg-black text-accent hover:bg-black/80 transition-all active:scale-90 shadow-xl shadow-black/20"
            >
              <span className="material-symbols-outlined text-[24px] font-bold">add</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-5 pt-6 pb-2">
        <div className="relative flex w-full items-center rounded-2xl h-14 bg-gray-100 focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition-all border border-transparent px-4">
          <span className="material-symbols-outlined text-text-muted text-[22px]">search</span>
          <input
            className="flex-1 bg-transparent border-none text-[15px] font-medium placeholder:text-text-muted/60 text-text-primary focus:ring-0 px-3 font-label"
            placeholder="Buscar atletas..."
          />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-2 rounded-2xl p-4 bg-white border border-border-light relative overflow-hidden group hover:border-red-600/30 transition-colors shadow-sm">
            <div className="relative flex justify-between items-start">
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-600 font-label">CRÍTICO</span>
              <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
            </div>
            <p className="relative text-3xl font-extrabold leading-none tracking-tight text-text-primary font-numbers">{criticalCount}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-4 bg-white border border-border-light relative overflow-hidden group hover:border-yellow-500/30 transition-colors shadow-sm">
            <div className="relative flex justify-between items-start">
              <span className="text-[9px] font-bold uppercase tracking-widest text-yellow-600 font-label">AVISO</span>
              <span className="material-symbols-outlined text-yellow-500 text-[18px]">error</span>
            </div>
            <p className="relative text-3xl font-extrabold leading-none tracking-tight text-text-primary font-numbers">{watchCount}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-4 bg-white border border-border-light relative overflow-hidden group hover:border-accent/30 transition-colors shadow-sm">
            <div className="relative flex justify-between items-start">
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 font-label">LISTO</span>
              <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
            </div>
            <p className="relative text-3xl font-extrabold leading-none tracking-tight text-text-primary font-numbers">{readyCount}</p>
          </div>
        </div>
      </div>

      {/* Athletes List */}
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex justify-between items-center px-6">
          <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] font-label">LISTA DE ATLETAS</h3>
          <button className="text-[10px] text-text-primary font-bold hover:text-accent-dim transition-colors flex items-center gap-1 uppercase tracking-widest font-label">
            Filtrar
            <span className="material-symbols-outlined text-[14px]">sort</span>
          </button>
        </div>

        <div className="flex flex-col px-5 gap-3">
          {loading ? (
            <div className="py-10 text-center text-gray-400 animate-pulse uppercase text-[10px] font-bold tracking-widest">
              Cargando escuadrón...
            </div>
          ) : athletes.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
              <span className="material-symbols-outlined text-5xl text-gray-200">group_off</span>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Aún no hay atletas en tu equipo</p>
              <button
                onClick={() => navigate('/athletes/invite')}
                className="text-[10px] font-black text-accent uppercase tracking-[0.2em] bg-black px-6 py-3 rounded-full shadow-xl"
              >
                Invitar Atletas
              </button>
            </div>
          ) : (
            athletes.map((athlete) => (
              <div
                key={athlete.id}
                onClick={() => navigate(`/athletes/${athlete.id}`)}
                className="group relative flex flex-row items-center gap-4 p-5 rounded-[2rem] bg-white hover:bg-gray-50 active:scale-[0.99] transition-all duration-300 cursor-pointer shadow-sm border border-gray-100"
              >
                {/* Status Sidebar */}
                <div className={`absolute left-0 top-5 bottom-5 w-1.5 rounded-r-full ${athlete.color} shadow-lg shadow-black/10`}></div>

                {/* Avatar Section */}
                <div className="relative shrink-0 ml-2">
                  <div className="h-14 w-14 rounded-full border-2 border-white/10 overflow-hidden ring-2 ring-gray-100">
                    <img alt={athlete.name} className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0 duration-500" src={athlete.avatar} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-100">
                    <span className={`material-symbols-outlined ${athlete.textColor} text-[18px] icon-fill`}>{athlete.badge}</span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col flex-1 min-w-0 gap-1">
                  <div className="flex justify-between items-center text-black">
                    <h4 className="text-lg font-bold text-black tracking-tight font-label">{athlete.name}</h4>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${athlete.textColor} bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 font-label`}>{athlete.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted-inv">
                    <span className="font-medium text-gray-600 font-label">{athlete.spec}</span>
                    <span className="opacity-20 text-gray-400">•</span>
                    <span className={`${athlete.textColor} font-bold text-[11px] font-label uppercase tracking-tight`}>{athlete.detail}</span>
                  </div>
                </div>

                {/* Arrow */}
                <span className="material-symbols-outlined text-gray-300 group-hover:text-black transition-all translate-x-0 group-hover:translate-x-1">chevron_right</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachAthletes;
