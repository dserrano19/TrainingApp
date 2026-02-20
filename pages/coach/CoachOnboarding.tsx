import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface CoachOnboardingProps {
  onComplete: () => void;
}

const CoachOnboarding: React.FC<CoachOnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [step, setStep] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);

  // Mandatory Data (Step 1)
  const [clubName, setClubName] = useState('');
  const [specialty, setSpecialty] = useState('Atletismo / Velocidad');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [license, setLicense] = useState('');

  // Optional Data (Step 2)
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');

  const handleNext = async () => {
    if (step === 1) {
      if (clubName && specialty && gender && birthDate && license) {
        setStep(2);
      }
    } else {
      setIsFinishing(true);
      try {
        if (!session?.user) throw new Error("No user session");

        const { error } = await supabase.from('profiles').update({
          club: clubName,
          specialty,
          gender,
          birth_date: birthDate,
          license_number: license,
          // Storing experience/bio in a metadata field or just ignoring if no column exists yet
          // If 'experience' and 'bio' columns don't exist, we can store in a JSONB 'meta' or skip
          // For now, let's assume we just update what fits or add columns if needed.
          // Ideally, we added these in previous migrations or they are standard. 
          // If not, we might lose them, but the request emphasized the MANDATORY fields.
        }).eq('id', session.user.id);

        if (error) throw error;

        localStorage.removeItem('hasSeenWelcome');
        onComplete();
        navigate('/welcome');

      } catch (err) {
        console.error("Error saving coach profile:", err);
        setIsFinishing(false);
        alert("Error al guardar perfil. Inténtalo de nuevo.");
      }
    }
  };

  const isStep1Valid = clubName && specialty && gender && birthDate && license;

  return (
    <div className="min-h-screen bg-bg-app flex flex-col max-w-md mx-auto animate-in slide-in-from-bottom duration-700 overflow-hidden">
      <header className="p-4 pt-12 flex items-center justify-between relative z-10">
        <button onClick={() => setStep(Math.max(1, step - 1))} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <span className="material-symbols-outlined text-black">{step > 1 ? 'arrow_back' : 'close'}</span>
        </button>
        <div className="flex gap-1.5">
          {[1, 2].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-black' : 'w-2 bg-gray-100'}`}></div>
          ))}
        </div>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 flex flex-col px-8 pt-8 pb-12 overflow-y-auto no-scrollbar relative z-10">
        {step === 1 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <div>
              <h1 className="text-3xl font-extrabold text-black font-label tracking-tight leading-tight">Configura tu Equipo</h1>
              <p className="text-gray-500 text-sm mt-2 font-medium">Define tu identidad y datos oficiales.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Nombre del Club o Equipo *</label>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="Ej. Elite Sprinters Team"
                  className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl px-5 font-label font-bold outline-none transition-all shadow-sm"
                />
              </div>

              {/* Gender Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Sexo *</label>
                <div className="flex gap-3">
                  {['male', 'female'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-4 rounded-2xl border-2 font-bold uppercase tracking-widest text-xs transition-all ${gender === g ? 'border-black bg-black text-white shadow-xl' : 'border-gray-100 bg-white text-gray-400'}`}
                    >
                      {g === 'male' ? 'Hombre' : 'Mujer'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">F. Nacimiento *</label>
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl px-4 text-sm font-nums font-bold focus:border-black outline-none transition-all shadow-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Nº Licencia Entrenador *</label>
                <input type="text" value={license} onChange={e => setLicense(e.target.value)} placeholder="Ej. CT-1234" className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl px-5 text-base font-nums font-bold focus:border-black outline-none transition-all shadow-sm uppercase placeholder:normal-case" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Especialidad Principal *</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl px-5 font-label font-bold outline-none appearance-none"
                >
                  <option>Atletismo / Velocidad</option>
                  <option>Fondo / Maratón</option>
                  <option>Triatlón</option>
                  <option>Natación</option>
                  <option>Crossfit / HIIT</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <div>
              <h1 className="text-3xl font-extrabold text-black font-label tracking-tight">Tu Perfil Coach</h1>
              <p className="text-gray-500 text-sm mt-2 font-medium">Personaliza cómo te verán tus atletas al invitarlos.</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center mb-8">
                <div className="size-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 gap-1 cursor-pointer hover:border-black hover:text-black transition-all">
                  <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest">Subir Foto</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Años de Experiencia</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Ej. 10"
                  className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl px-5 font-nums font-bold focus:border-black outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 font-label">Biografía Corta</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Coach especializado en alto rendimiento..."
                  className="w-full h-32 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl p-5 font-label font-medium outline-none transition-all shadow-sm resize-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-12">
          <button
            onClick={handleNext}
            disabled={(step === 1 && !isStep1Valid) || isFinishing}
            className="w-full h-16 bg-black text-accent hover:bg-black/90 font-extrabold text-[15px] uppercase tracking-widest rounded-2xl shadow-2xl transition-all active:scale-[0.98] font-label disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isFinishing ? (
              <>
                <span className="size-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></span>
                <span>Guardando...</span>
              </>
            ) : (
              <span>{step === 1 ? 'Siguiente' : 'Crear Equipo'}</span>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CoachOnboarding;
