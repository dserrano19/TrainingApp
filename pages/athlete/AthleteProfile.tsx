
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const AthleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName1: "",
    lastName2: "",
    specialty: "",
    phone: "",
    email: "",
    address: "",
    avatar: "",
    dni: "",
    birthDate: "",
    club: "",
    license: "",
    seasonGoal: "",
    daysToGoal: 0,
    sizeClothing: "",
    sizeSuit: "",
    height: 0,
    weight: 0,
    bodyFat: 0,
    rhr: 0,
    hrv: 0,
    clinicalHistory: "",
    lastMedicalCheck: "",
    pb: {
      "60m": "",
      "100m": "",
      "200m": ""
    }
  });

  const [injuries, setInjuries] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [streak, setStreak] = useState(0);
  const [shields, setShields] = useState(0);
  const [team, setTeam] = useState<{ id: string; name: string } | null>(null);
  const [teamCodeInput, setTeamCodeInput] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchInjuries();
      fetchStreak();
      fetchShields();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*, teams(id, name)')
      .eq('id', user.id)
      .single();

    if (data) {
      if (data.teams) {
        setTeam(data.teams as any);
      }
      const pb = data.personal_bests || {};
      const fullName = (data.full_name || "").split(" ");
      const profileData = {
        firstName: fullName[0] || "",
        lastName1: fullName[1] || "",
        lastName2: fullName[2] || "",
        specialty: data.specialty || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        avatar: data.avatar_url || "",
        dni: data.dni || "",
        birthDate: data.birth_date || "",
        club: data.club || "",
        license: data.license_number || "",
        seasonGoal: data.season_goals || "",
        daysToGoal: 0, // Calculate from goal date if needed
        sizeClothing: data.size_clothing || "",
        sizeSuit: data.size_suit || "",
        height: data.height || 0,
        weight: data.weight || 0,
        bodyFat: data.body_fat || 0,
        rhr: 0, // Add to DB if needed
        hrv: 0, // Add to DB if needed
        clinicalHistory: data.injury_history || "",
        lastMedicalCheck: "", // Add to DB if needed
        pb: {
          "60m": pb["60m"] || "",
          "100m": pb["100m"] || "",
          "200m": pb["200m"] || ""
        }
      };

      const days = await calculateDaysToGoal();
      profileData.daysToGoal = days;

      setProfile(profileData);
      setTempProfile(profileData);
    }
  };

  const fetchInjuries = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('injuries')
      .select('*')
      .eq('athlete_id', user.id)
      .order('date', { ascending: false });

    if (data) setInjuries(data);
  };

  const fetchStreak = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('athlete_streaks')
      .select('current_streak')
      .eq('athlete_id', user.id)
      .single();
    if (data) setStreak(data.current_streak || 0);
  };

  const fetchShields = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('athlete_shields')
      .select('active_shields')
      .eq('athlete_id', user.id)
      .single();
    if (data) setShields(data.active_shields || 0);
  };

  const calculateDaysToGoal = async () => {
    if (!user) return 0;
    const { data: profile } = await supabase
      .from('profiles')
      .select('teams:team_id(coach_id)')
      .eq('id', user.id)
      .single();

    const coachId = (profile?.teams as any)?.coach_id;
    if (!coachId) return 0;

    const { data: comps } = await supabase
      .from('competitions')
      .select('date')
      .eq('coach_id', coachId)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(1);

    if (comps && comps.length > 0) {
      const targetDate = new Date(comps[0].date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const handleSave = async () => {
    if (!user) return;

    const fullName = `${tempProfile.firstName} ${tempProfile.lastName1} ${tempProfile.lastName2}`.trim();

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        specialty: tempProfile.specialty,
        phone: tempProfile.phone,
        email: tempProfile.email,
        address: tempProfile.address,
        avatar_url: tempProfile.avatar,
        dni: tempProfile.dni,
        birth_date: tempProfile.birthDate,
        club: tempProfile.club,
        license_number: tempProfile.license,
        season_goals: tempProfile.seasonGoal,
        size_clothing: tempProfile.sizeClothing,
        size_suit: tempProfile.sizeSuit,
        height: tempProfile.height,
        weight: tempProfile.weight,
        body_fat: tempProfile.bodyFat,
        injury_history: tempProfile.clinicalHistory,
        personal_bests: tempProfile.pb
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar el perfil: ' + error.message);
    } else {
      setProfile(tempProfile);
      setIsEditing(false);
      alert('Perfil actualizado exitosamente');
    }
  };

  const handleJoinTeam = async () => {
    if (!teamCodeInput.trim()) return;
    setIsJoining(true);
    try {
      // 1. Find team by code
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('id, name')
        .eq('code', teamCodeInput.trim().toUpperCase())
        .single();

      if (teamError || !teamData) {
        alert('Código de equipo no válido. Por favor, verifica el training hashtag con tu entrenador.');
        return;
      }

      // 2. Link athlete to team
      const { error: linkError } = await supabase
        .from('profiles')
        .update({ team_id: teamData.id })
        .eq('id', user!.id);

      if (linkError) throw linkError;

      setTeam(teamData);
      setTeamCodeInput("");
      alert(`¡Te has unido con éxito a ${teamData.name}!`);
    } catch (error: any) {
      console.error('Error joining team:', error);
      alert('Error al unirse al equipo: ' + error.message);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres dejar el equipo ${team?.name}?`)) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ team_id: null })
        .eq('id', user!.id);

      if (error) throw error;
      setTeam(null);
      alert('Has dejado el equipo.');
    } catch (error: any) {
      alert('Error al dejar el equipo: ' + error.message);
    }
  };

  const fullName = `${profile.firstName} ${profile.lastName1} ${profile.lastName2}`.trim();

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500 pb-40 bg-bg-app min-h-screen">
      {/* Modal de Edición Completa */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="w-full max-w-md bg-widget rounded-[2.5rem] p-8 shadow-2xl border border-white/10 flex flex-col gap-6 h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center sticky top-0 bg-widget z-10 pb-4 border-b border-white/5">
              <h3 className="text-xl font-bold text-white font-label uppercase tracking-widest">Editar Expediente</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-8 py-4">
              {/* Objetivo */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent font-label">Objetivo Principal</h4>
                <input type="text" placeholder="Meta de la temporada" value={tempProfile.seasonGoal} onChange={(e) => setTempProfile({ ...tempProfile, seasonGoal: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
              </div>

              {/* Datos Personales */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent font-label">Datos de Identidad</h4>
                <div className="grid grid-cols-1 gap-3">
                  <input type="text" placeholder="Nombre" value={tempProfile.firstName} onChange={(e) => setTempProfile({ ...tempProfile, firstName: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="1er Apellido" value={tempProfile.lastName1} onChange={(e) => setTempProfile({ ...tempProfile, lastName1: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                    <input type="text" placeholder="2º Apellido" value={tempProfile.lastName2} onChange={(e) => setTempProfile({ ...tempProfile, lastName2: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase ml-1">Fecha de Nacimiento</label>
                    <input type="date" value={tempProfile.birthDate} onChange={(e) => setTempProfile({ ...tempProfile, birthDate: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  </div>
                  <input type="email" placeholder="Email" value={tempProfile.email} onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  <input type="tel" placeholder="Teléfono" value={tempProfile.phone} onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  <input type="text" placeholder="Dirección Habitual" value={tempProfile.address} onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                </div>
              </div>

              {/* Ficha Técnica */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent font-label">Ficha Técnica & Club</h4>
                <div className="grid grid-cols-1 gap-3">
                  <input type="text" placeholder="Club" value={tempProfile.club} onChange={(e) => setTempProfile({ ...tempProfile, club: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  <input type="text" placeholder="Especialidad" value={tempProfile.specialty} onChange={(e) => setTempProfile({ ...tempProfile, specialty: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="DNI" value={tempProfile.dni} onChange={(e) => setTempProfile({ ...tempProfile, dni: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                    <input type="text" placeholder="Licencia" value={tempProfile.license} onChange={(e) => setTempProfile({ ...tempProfile, license: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  </div>
                </div>
              </div>

              {/* Biometría */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent font-label">Biometría</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase ml-1">Peso (kg)</label>
                    <input type="number" step="0.1" value={tempProfile.weight} onChange={(e) => setTempProfile({ ...tempProfile, weight: parseFloat(e.target.value) || 0 })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase ml-1">Altura (cm)</label>
                    <input type="number" value={tempProfile.height} onChange={(e) => setTempProfile({ ...tempProfile, height: parseInt(e.target.value) || 0 })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase ml-1">% Grasa</label>
                    <input type="number" step="0.1" value={tempProfile.bodyFat} onChange={(e) => setTempProfile({ ...tempProfile, bodyFat: parseFloat(e.target.value) || 0 })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  </div>
                </div>
              </div>

              {/* Historial Clínico */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent font-label">Historial Clínico & Lesiones</h4>
                <textarea
                  placeholder="Detalla lesiones, cirugías o notas médicas..."
                  value={tempProfile.clinicalHistory}
                  onChange={(e) => setTempProfile({ ...tempProfile, clinicalHistory: e.target.value })}
                  className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 text-white text-sm outline-none resize-none"
                />
              </div>

              {/* Marcas Personales */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent font-label">Mejores Marcas (PB)</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <label className="text-xs text-gray-400">60m</label>
                    <input type="text" placeholder="6.78s" value={tempProfile.pb["60m"]} onChange={(e) => setTempProfile({ ...tempProfile, pb: { ...tempProfile.pb, "60m": e.target.value } })} className="w-full h-10 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <label className="text-xs text-gray-400">100m</label>
                    <input type="text" placeholder="10.42s" value={tempProfile.pb["100m"]} onChange={(e) => setTempProfile({ ...tempProfile, pb: { ...tempProfile.pb, "100m": e.target.value } })} className="w-full h-10 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <label className="text-xs text-gray-400">200m</label>
                    <input type="text" placeholder="21.15s" value={tempProfile.pb["200m"]} onChange={(e) => setTempProfile({ ...tempProfile, pb: { ...tempProfile.pb, "200m": e.target.value } })} className="w-full h-10 bg-black border border-white/10 rounded-xl px-4 text-white font-bold" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 sticky bottom-0 bg-widget pb-2 border-t border-white/5">
              <button onClick={() => setIsEditing(false)} className="flex-1 h-14 rounded-2xl bg-white/5 text-gray-400 text-xs font-bold uppercase">Cancelar</button>
              <button onClick={handleSave} className="flex-1 h-14 rounded-2xl bg-accent text-black text-xs font-bold uppercase shadow-xl shadow-accent/20">Guardar Todo</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Fijo */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-bg-app/95 backdrop-blur-md border-b border-widget-border/10 pt-12">
        <button onClick={() => navigate('/settings')} className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 text-text-primary">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <h1 className="text-[11px] font-bold tracking-widest uppercase font-label text-gray-500">Expediente Atleta</h1>
        <button onClick={() => navigate('/notifications')} className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 text-text-primary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>

      <div className="flex-1 flex-col w-full">
        {/* Identidad Visual */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6 w-full text-center">
          <div className="relative mb-6">
            <div className="size-32 rounded-full border-4 border-accent shadow-2xl bg-cover bg-center" style={{ backgroundImage: `url('${profile.avatar}')` }}></div>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-1 -right-1 h-10 w-10 bg-accent border-2 border-bg-app rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-xl"
            >
              <span className="material-symbols-outlined text-lg font-bold">edit</span>
            </button>
          </div>
          <h2 className="text-3xl font-black tracking-tightest text-text-primary font-label leading-tight">{fullName || "Atleta"}</h2>
          <p className="text-sm font-bold text-accent uppercase tracking-widest font-label mt-1">{profile.specialty} • {profile.club}</p>
        </div>

        {/* Widgets de Racha y Escudos Funcionales */}
        <div className="w-full px-4 mb-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-widget rounded-3xl border border-widget-border p-5 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 font-label block mb-1">Racha</span>
                <span className="text-3xl font-black text-white font-numbers tabular-nums">{streak} <span className="text-[10px] text-gray-400 uppercase">Días</span></span>
              </div>
              <span className="material-symbols-outlined text-accent text-3xl icon-fill animate-pulse">bolt</span>
            </div>
            <div className="bg-widget rounded-3xl border border-widget-border p-5 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 font-label block mb-1">Escudos</span>
                <span className="text-3xl font-black text-blue-400 font-numbers tabular-nums">{shields} <span className="text-[10px] text-gray-400 uppercase">Pro</span></span>
              </div>
              <span className="material-symbols-outlined text-blue-400 text-3xl icon-fill">shield</span>
            </div>
          </div>
        </div>

        {/* OBJETIVO DE TEMPORADA */}
        <div className="w-full px-4 mb-8">
          <div className="bg-accent rounded-[2.5rem] p-8 shadow-2xl shadow-accent/20 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl text-black icon-fill">emoji_events</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 font-label mb-1">Objetivo Pinned</span>
            <h3 className="text-2xl font-extrabold text-black font-label leading-tight mb-6 pr-12">{profile.seasonGoal || "Sin objetivo definido"}</h3>

            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-black/50">Cuenta atrás</span>
                <span className="text-5xl font-black text-black font-numbers leading-none">{profile.daysToGoal}</span>
                <span className="text-[10px] font-bold uppercase text-black/50">Días para el pico</span>
              </div>
              <div className="h-14 w-14 rounded-full border-2 border-black/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-3xl">flag</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biometría */}
        <div className="w-full px-4 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 font-label mb-3 ml-1">Biometría & Salud</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-widget p-6 rounded-[2rem] border border-widget-border shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase font-label">Cuerpo</span>
                <span className="material-symbols-outlined text-gray-700 text-sm">straighten</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400">Peso</span>
                  <span className="text-xl font-bold text-white font-numbers">{profile.weight || "-"} kg</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400">Altura</span>
                  <span className="text-xl font-bold text-white font-numbers">{profile.height || "-"} cm</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400">Grasa</span>
                  <span className="text-xl font-bold text-accent font-numbers">{profile.bodyFat || "-"}%</span>
                </div>
              </div>
            </div>

            <div className="bg-widget p-6 rounded-[2rem] border border-widget-border shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase font-label">Vitales</span>
                <span className="material-symbols-outlined text-red-500 text-sm animate-pulse">monitor_heart</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400">RHR</span>
                  <span className="text-xl font-bold text-white font-numbers">{profile.rhr || "-"} bpm</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400">HRV</span>
                  <span className="text-xl font-bold text-white font-numbers">{profile.hrv || "-"} ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* FICHA TÉCNICA DEFINITIVA */}
        <div className="w-full px-4 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 font-label mb-3 ml-1">Ficha Técnica & Contacto</h3>
          <div className="bg-widget rounded-[2rem] border border-widget-border overflow-hidden divide-y divide-white/5 shadow-2xl">
            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Licencia</span>
                <span className="text-sm font-bold text-white font-nums">{profile.license || "-"}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">DNI Atleta</span>
                <span className="text-sm font-bold text-white font-nums">{profile.dni || "-"}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Email Principal</span>
                <span className="text-sm font-bold text-white">{profile.email || "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Teléfono</span>
                <span className="text-sm font-bold text-white font-nums">{profile.phone || "-"}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Nacimiento</span>
                <span className="text-sm font-bold text-white font-nums">{profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('es-ES') : "-"}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Residencia Habitual</span>
                <span className="text-sm font-medium text-gray-300 leading-relaxed">{profile.address || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historial Clínico */}
        <div className="w-full px-4 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 font-label mb-3 ml-1">Historial Clínico & Lesiones</h3>
          <div className="bg-widget rounded-[2rem] border border-widget-border p-8 shadow-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
                <span className="material-symbols-outlined icon-fill">medical_information</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Notas Médicas Generales</p>
                <p className="text-sm text-gray-200 font-serif italic leading-relaxed">{profile.clinicalHistory || "Sin notas médicas generales"}</p>
              </div>
            </div>

            {injuries.length > 0 && (
              <div className="pt-6 border-t border-white/5 space-y-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lesiones Registradas ({injuries.length})</p>
                <div className="space-y-3">
                  {injuries.map(injury => (
                    <div key={injury.id} className="bg-black/20 rounded-2xl p-4 border border-white/5 flex items-center justify-between group">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${injury.status === 'active' ? 'bg-red-500 pulse' :
                            injury.status === 'recovering' ? 'bg-orange-500 font-serif' :
                              'bg-emerald-500'
                            }`}></span>
                          <p className="text-sm font-bold text-white transition-colors group-hover:text-accent font-label uppercase tracking-wide">{injury.name}</p>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">{new Date(injury.date).toLocaleDateString('es-ES')}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/injury/${injury.id}`)}
                        className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-accent/10 transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.lastMedicalCheck && (
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Último Reconocimiento</span>
                <span className="text-xs font-bold text-white font-numbers">{new Date(profile.lastMedicalCheck).toLocaleDateString('es-ES')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Marcas Personales */}
        <div className="w-full px-4 mb-12">
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 font-label">Mejores Marcas (PB)</h3>
            <button onClick={() => setIsEditing(true)} className="size-8 rounded-full bg-widget border border-widget-border flex items-center justify-center text-accent">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div className="bg-widget rounded-[2rem] border border-widget-border overflow-hidden divide-y divide-white/5 shadow-2xl">
            {Object.entries(profile.pb).map(([event, time]) => (
              <div key={event} className="p-5 flex justify-between items-center group hover:bg-black/20 transition-colors">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest font-label">{event}</span>
                <span className="text-xl font-black text-white font-numbers tracking-tight group-hover:text-accent">{time || "-"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GESTIÓN DE EQUIPO */}
        <div className="w-full px-4 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 font-label mb-3 ml-1">Mi Equipo de Entrenamiento</h3>
          <div className="bg-widget rounded-[2rem] border border-widget-border p-6 shadow-2xl space-y-4">
            {team ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined icon-fill">groups</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Equipo Actual</span>
                    <span className="text-sm font-bold text-white">{team.name}</span>
                  </div>
                </div>
                <button
                  onClick={handleLeaveTeam}
                  className="size-10 rounded-full border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Introduce el <span className="text-accent font-bold">Training Hashtag</span> proporcionado por tu entrenador para vincular tu expediente.
                </p>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                    <span className="material-symbols-outlined text-[20px]">tag</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Hashtag del equipo"
                    value={teamCodeInput}
                    onChange={(e) => setTeamCodeInput(e.target.value.toUpperCase())}
                    className="w-full h-14 bg-black border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-bold text-white placeholder-gray-600 focus:border-accent transition-all outline-none uppercase"
                  />
                  <button
                    onClick={handleJoinTeam}
                    disabled={isJoining || !teamCodeInput}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-accent text-black rounded-xl font-bold text-[10px] uppercase tracking-widest disabled:opacity-30 transition-opacity"
                  >
                    {isJoining ? '...' : 'Unirse'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MATERIAL & RECURSOS */}
        <div className="w-full px-4 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 font-label mb-3 ml-1">Material & Recursos</h3>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => navigate('/shoes')}
              className="bg-widget p-6 rounded-[2rem] border border-widget-border shadow-xl hover:border-accent/40 transition-all cursor-pointer group active:scale-95"
            >
              <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent mb-4">
                <span className="material-symbols-outlined icon-fill">directions_run</span>
              </div>
              <p className="text-sm font-bold text-white font-label">Mis Zapatillas</p>
              <p className="text-[10px] text-gray-500 font-medium">Gestión de desgaste</p>
            </div>
            <div
              onClick={() => navigate('/carpeta')}
              className="bg-widget p-6 rounded-[2rem] border border-widget-border shadow-xl hover:border-accent/40 transition-all cursor-pointer group active:scale-95"
            >
              <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent mb-4">
                <span className="material-symbols-outlined icon-fill">folder_open</span>
              </div>
              <p className="text-sm font-bold text-white font-label">Mi Carpeta</p>
              <p className="text-[10px] text-gray-500 font-medium">Planes y analíticas</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AthleteProfile;
