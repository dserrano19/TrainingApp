
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface AthleteOnboardingProps {
  onComplete: () => void;
}

const AthleteOnboarding: React.FC<AthleteOnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Steps: 1 = Mandatory (Specialty + Critical Info), 2 = Wizard (Optional PBs/Goals).
  const [step, setStep] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);

  // Mandatory Data
  const [specialty, setSpecialty] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [license, setLicense] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [groupCode, setGroupCode] = useState('');

  // Optional Data (Wizard)
  const [seasonGoals, setSeasonGoals] = useState('');
  const [personalBests, setPersonalBests] = useState('');

  const specialties = [
    { id: 'run', label: 'Carrera', icon: 'sprint' },
    { id: 'swim', label: 'Natación', icon: 'pool' },
    { id: 'bike', label: 'Ciclismo', icon: 'directions_bike' },
    { id: 'tri', label: 'Triatlón', icon: 'legend_toggle' },
    { id: 'gym', label: 'Fuerza', icon: 'fitness_center' },
  ];

  const handleNext = async () => {
    if (step === 1) {
      if (!specialty || !weight || !license || !birthDate || !groupCode) return;
      setStep(2);
    } else if (step === 2) {
      setIsFinishing(true);

      try {
        if (!session?.user) throw new Error("No user session");

        // Save to Supabase
        const { error } = await supabase.from('profiles').update({
          specialty,
          gender,
          weight: parseFloat(weight),
          height: parseFloat(height),
          license_number: license,
          birth_date: birthDate, // Format should be verified YYYY-MM-DD
          group_code: groupCode,
          season_goals: seasonGoals,
          // personal_bests: personalBests // Needs proper JSON structure parsing if implemented
        }).eq('id', session.user.id);

        if (error) throw error;

        // Local legacy fallback
        localStorage.setItem('user_specialty', specialty);
        localStorage.setItem('hasSeenWelcome', 'false');

        onComplete();

      } catch (err) {
        console.error("Error saving profile:", err);
        setIsFinishing(false);
        // Show error UI here ideally
        alert("Error al guardar el perfil. Inténtalo de nuevo.");
      }
    }
  };

  const isStep1Valid = specialty && gender && weight && height && license && birthDate && groupCode;

  return (
    <div className="min-h-screen bg-bg-app flex flex-col max-w-md mx-auto animate-in slide-in-from-bottom duration-700 overflow-hidden">
      <header className="p-4 pt-12 flex items-center justify-between relative z-10">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <span className="material-symbols-outlined text-black">{step > 1 ? 'arrow_back' : 'close'}</span>
        </button>
        <div className="flex gap-2">
          {[1, 2].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-10 bg-accent shadow-[0_0_10px_var(--accent-color)]' : 'w-2 bg-gray-100'}`}></div>
          ))}
        </div>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 flex flex-col px-8 pt-4 pb-12 relative z-10 overflow-y-auto no-scrollbar">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <div>
              <h1 className="text-[32px] font-extrabold text-black font-label tracking-tightest leading-[1.1]">Perfil<br />Obligatorio</h1>
              <p className="text-gray-500 text-xs mt-2 font-medium font-label">Datos críticos para tu entrenador y el club.</p>
            </div>

            {/* Specialty Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Especialidad</label>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {specialties.map(spec => (
                  <button
                    key={spec.id}
                    onClick={() => setSpecialty(spec.id)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 w-24 rounded-[1.5rem] border-2 transition-all duration-300 ${specialty === spec.id ? 'border-accent bg-accent/10 scale-105' : 'border-gray-100 bg-white'}`}
                  >
                    <span className={`material-symbols-outlined text-[28px] ${specialty === spec.id ? 'text-black icon-fill' : 'text-gray-300'}`}>{spec.icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-black font-label">{spec.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Sexo *</label>
              <div className="flex gap-3">
                {['male', 'female'].map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-4 rounded-[1rem] border-2 font-bold uppercase tracking-widest text-xs transition-all ${gender === g ? 'border-accent bg-accent text-black shadow-lg shadow-accent/20' : 'border-gray-100 bg-white text-gray-400'}`}
                  >
                    {g === 'male' ? 'Hombre' : 'Mujer'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Peso (kg) *</label>
                  <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="75.5" className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-[1rem] px-4 text-base font-nums font-bold focus:border-accent outline-none transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Altura (cm) *</label>
                  <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="180" className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-[1rem] px-4 text-base font-nums font-bold focus:border-accent outline-none transition-all shadow-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">F. Nacimiento *</label>
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-[1rem] px-4 text-sm font-nums font-bold focus:border-accent outline-none transition-all shadow-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Nº Licencia RFEA *</label>
                <input type="text" value={license} onChange={e => setLicense(e.target.value)} placeholder="M-1234" className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-[1rem] px-5 text-base font-nums font-bold focus:border-accent outline-none transition-all shadow-sm uppercase placeholder:normal-case" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Código de Grupo *</label>
                <input type="text" value={groupCode} onChange={e => setGroupCode(e.target.value)} placeholder="Ej. RUNNING-2024" className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-[1rem] px-5 text-base font-nums font-bold focus:border-accent outline-none transition-all shadow-sm" />
                <p className="text-[10px] text-gray-400 pl-2">Pídelo a tu entrenador para unirte al equipo.</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <div>
              <h1 className="text-[32px] font-extrabold text-black font-label tracking-tightest leading-[1.1]">Configuración<br />Personal</h1>
              <p className="text-gray-500 text-xs mt-2 font-medium font-label">Opcional. Ayuda a personalizar tu experiencia.</p>
            </div>

            <div className="space-y-5">


              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Objetivo de la Temporada</label>
                <textarea value={seasonGoals} onChange={e => setSeasonGoals(e.target.value)} placeholder="Ej. Bajar de 35' en 10K, clasificar al nacional..." className="w-full h-32 bg-gray-50 border-2 border-transparent rounded-[1rem] p-5 text-sm font-medium focus:border-accent outline-none transition-all shadow-sm resize-none"></textarea>
              </div>

              <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-accent-dim">emoji_events</span>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-black/80">Marcas Personales</h3>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">Puedes añadir tus mejores marcas más tarde en tu Perfil para ajustar tus ritmos de entrenamiento.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8">
          <button
            onClick={handleNext}
            disabled={(step === 1 && !isStep1Valid) || isFinishing}
            className="w-full bg-black text-white hover:bg-black/90 font-extrabold text-[15px] uppercase tracking-widest rounded-[1.25rem] shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-label flex items-center justify-between px-6 h-16 group"
          >
            {isFinishing ? (
              <div className="flex w-full justify-center"><span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span></div>
            ) : (
              <>
                <span>{step === 1 ? 'Siguiente Paso' : 'Finalizar Registro'}</span>
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
                </div>
              </>
            )}
          </button>

          {step === 2 && (
            <button onClick={() => handleNext()} className="w-full text-center mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
              Saltar por ahora
            </button>
          )}
        </div>
      </main>

      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
    </div>
  );
};

export default AthleteOnboarding;
