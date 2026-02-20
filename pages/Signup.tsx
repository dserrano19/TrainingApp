
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../components/supabaseClient';

interface SignupProps {
  onBack: () => void;
}

const Signup: React.FC<SignupProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '', // @handle
    password: '',
    teamCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Si no hay rol, volvemos al selector
  useEffect(() => {
    if (!role) {
      console.log('No role found in localStorage, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [role, navigate]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      let teamId = null;

      // Si es atleta, validamos el código de equipo primero
      if (role === 'ATHLETE') {
        if (!formData.teamCode) {
          throw new Error('El código de equipo es obligatorio para atletas.');
        }

        const { data: team, error: teamError } = await supabase
          .from('teams')
          .select('id')
          .eq('code', formData.teamCode.trim().toUpperCase())
          .single();

        if (teamError || !team) {
          throw new Error('Código de equipo no válido. Por favor, contacta con tu entrenador.');
        }
        teamId = team.id;
      }

      console.log('Attempting signup with role:', role);
      // Registrar usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: role, // 'ATHLETE' o 'COACH'
            username: formData.username,
            team_id: teamId
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log('Usuario registrado:', data.user);
        // Guardamos progreso temporal (opcional, ya que el usuario está creado)
        localStorage.setItem('temp_signup_name', formData.name);

        if (role === 'COACH') {
          navigate('/onboarding/coach');
        } else {
          navigate('/onboarding/athlete');
        }
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      setErrorMsg(error.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col max-w-md mx-auto relative animate-in slide-in-from-right duration-500 overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

      <header className="flex items-center justify-between p-4 pt-12 pb-2 relative z-10">
        <button
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        >
          <span className="material-symbols-outlined text-black">arrow_back</span>
        </button>
        <h2 className="text-black text-xs font-bold tracking-[0.2em] font-label uppercase">Registro de Cuenta</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 flex flex-col px-6 pt-12 pb-8 relative z-10">
        <div className="mb-12">
          <h1 className="text-black text-[40px] font-extrabold leading-[0.95] tracking-tightest font-label">Crea tu<br />perfil Elite</h1>
          <p className="text-gray-500 text-sm mt-4 font-medium font-label">
            Registrándote como <span className="text-black font-bold uppercase tracking-widest bg-accent/20 px-2 py-0.5 rounded">{role === 'COACH' ? 'Entrenador' : 'Atleta'}</span>.
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleContinue} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 group">
            <label className="text-black text-[10px] font-bold uppercase tracking-[0.15em] ml-1 font-label opacity-40">Nombre Completo</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-accent rounded-[1.25rem] px-6 text-base font-bold text-black outline-none transition-all font-label placeholder:text-gray-300"
              placeholder="Ej. Alex Rivera"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-2 group">
            <label className="text-black text-[10px] font-bold uppercase tracking-[0.15em] ml-1 font-label opacity-40">Email Profesional</label>
            <input
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-accent rounded-[1.25rem] px-6 text-base font-bold text-black outline-none transition-all font-nums placeholder:text-gray-300"
              placeholder="atleta@dominio.com"
              type="email"
            />
          </div>

          <div className="flex flex-col gap-2 group">
            <label className="text-black text-[10px] font-bold uppercase tracking-[0.15em] ml-1 font-label opacity-40">Usuario (@handle)</label>
            <div className="relative">
              <input
                required
                value={formData.username}
                onChange={(e) => {
                  const val = e.target.value.replace(/\s/g, ''); // No spaces
                  setFormData({ ...formData, username: val.startsWith('@') ? val : '@' + val });
                }}
                className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-accent rounded-[1.25rem] px-6 text-base font-bold text-black outline-none transition-all font-nums placeholder:text-gray-300"
                placeholder="@usuario"
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 group">
            <label className="text-black text-[10px] font-bold uppercase tracking-[0.15em] ml-1 font-label opacity-40">Contraseña Segura</label>
            <input
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-accent rounded-[1.25rem] px-6 text-base font-bold text-black outline-none transition-all font-nums placeholder:text-gray-300"
              placeholder="Mínimo 8 caracteres"
              type="password"
            />
          </div>

          {role === 'ATHLETE' && (
            <div className="flex flex-col gap-2 group animate-in slide-in-from-left duration-500">
              <label className="text-black text-[10px] font-bold uppercase tracking-[0.15em] ml-1 font-label opacity-40">Código de Equipo</label>
              <input
                required
                value={formData.teamCode}
                onChange={(e) => setFormData({ ...formData, teamCode: e.target.value.toUpperCase() })}
                className="w-full h-16 bg-black text-accent border-2 border-transparent focus:border-accent rounded-[1.25rem] px-6 text-base font-bold outline-none transition-all font-nums placeholder:text-zinc-700 uppercase"
                placeholder="EJ: ADRI-1234"
                type="text"
              />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1 mt-1 font-label">Pregunta a tu entrenador por este código</p>
            </div>
          )}

          <div className="mt-12 flex flex-col gap-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-black text-white font-extrabold text-[15px] uppercase tracking-widest rounded-[1.25rem] flex items-center justify-between px-8 transition-all active:scale-[0.98] shadow-2xl shadow-black/20 font-label group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Creando cuenta...' : 'Continuar'}</span>
              {!loading && (
                <div className="size-8 rounded-full bg-accent flex items-center justify-center text-black group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
                </div>
              )}
            </button>

            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest font-label leading-loose max-w-[280px] mx-auto">
              Al registrarte aceptas nuestros <button type="button" className="text-black underline underline-offset-2">Términos de Servicio</button> y <button type="button" className="text-black underline underline-offset-2">Privacidad</button>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Signup;
