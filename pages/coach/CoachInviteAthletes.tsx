
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const CoachInviteAthletes: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [emails, setEmails] = useState(['', '']);
  const [team, setTeam] = useState<{ id: string; name: string; code: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrCreateTeam();
    }
  }, [user]);

  const fetchOrCreateTeam = async () => {
    try {
      setLoading(true);
      // Try to find an existing team for this coach
      const { data: existingTeams, error: fetchError } = await supabase
        .from('teams')
        .select('*')
        .eq('coach_id', user!.id)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingTeams && existingTeams.length > 0) {
        setTeam(existingTeams[0]);
      } else {
        // Create a default team if none exists
        const defaultCode = (user!.id.slice(0, 4) + Math.random().toString(36).substring(2, 6)).toUpperCase();
        const { data: newTeam, error: createError } = await supabase
          .from('teams')
          .insert({
            name: 'Mi Equipo de Entrenamiento',
            code: defaultCode,
            coach_id: user!.id
          })
          .select()
          .single();

        if (createError) throw createError;
        setTeam(newTeam);
      }
    } catch (err) {
      console.error('Error fetching/creating team:', err);
    } finally {
      setLoading(false);
    }
  };

  const addEmail = () => setEmails([...emails, '']);
  const removeEmail = (index: number) => setEmails(emails.filter((_, i) => i !== index));

  const copyToClipboard = () => {
    if (team?.code) {
      navigator.clipboard.writeText(team.code);
      alert('¡Código copiado al portapapeles!');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-black">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-black font-label">Invitar Atletas</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-bold text-black hover:opacity-70 transition-opacity font-label"
        >
          Hecho
        </button>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Share Link Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-black font-label">Código de Equipo</h2>
          <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-label">Tu Training Hashtag</label>
              <div className="mt-2 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl h-14 px-4 overflow-hidden">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">tag</span>
                {loading ? (
                  <span className="text-sm text-gray-400 animate-pulse">Generando código...</span>
                ) : (
                  <span className="text-lg font-black text-black tracking-widest flex-1">
                    {team?.code || 'ERROR'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 h-14 bg-accent text-black rounded-2xl font-extrabold text-[13px] uppercase tracking-[0.15em] shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-label"
              >
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
                Copiar Código
              </button>
              <button className="size-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-black">ios_share</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-500 text-center font-medium leading-relaxed">
              Comparte este código con tus atletas. Al introducirlo en su perfil, se unirán automáticamente a tu grupo.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 px-2">
          <div className="h-px bg-gray-100 flex-1"></div>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest font-label">O</span>
          <div className="h-px bg-gray-100 flex-1"></div>
        </div>

        {/* Email Invitation Section (Preserving layout but it's secondary now) */}
        <section className="space-y-5">
          <h2 className="text-2xl font-extrabold tracking-tight text-black font-label">Invitar por Email</h2>

          <div className="space-y-3">
            {emails.map((email, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const newEmails = [...emails];
                    newEmails[idx] = e.target.value;
                    setEmails(newEmails);
                  }}
                  placeholder={idx === 0 ? "atleta@ejemplo.com" : "Otro email (opcional)"}
                  className="w-full h-14 bg-white border border-gray-200 rounded-2xl pl-12 pr-12 text-sm font-medium focus:ring-2 focus:ring-black focus:border-black transition-all font-label"
                />
                {idx > 0 && (
                  <button
                    onClick={() => removeEmail(idx)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addEmail}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors px-1 font-label"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Añadir otro email
          </button>

          <button className="w-full h-16 bg-black text-white rounded-2xl font-extrabold text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-label">
            <span>Enviar {emails.filter(e => e.trim() !== '').length} Invitaciones</span>
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </section>

        {/* Pending Section */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-black font-label">Pendientes</h2>
            <div className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-lg font-nums">0</div>
          </div>
          <p className="text-xs text-center text-gray-400 py-8 italic">No hay invitaciones por email pendientes.</p>
        </section>
      </main>
    </div>
  );
};

export default CoachInviteAthletes;
