
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const AthleteRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompleteRegistration = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          birth_date: formData.birthDate,
          gender: formData.gender,
          height: parseFloat(formData.height) || null,
          weight: parseFloat(formData.weight) || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Marcamos que el usuario acaba de registrarse para permitir ver WelcomeSuccess
      localStorage.removeItem('hasSeenWelcome');
      navigate('/welcome');
    } catch (error: any) {
      console.error('Error completing registration:', error);
      alert('Error al completar el registro: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-black">arrow_back</span>
        </button>
        <h1 className="text-[12px] font-bold tracking-widest text-black uppercase font-label">Invitación de Equipo</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Coach Invitation Banner */}
        <div className="relative overflow-hidden rounded-[2rem] bg-widget text-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-black font-extrabold text-2xl font-label">S</div>
              <div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-label">Invitado por</p>
                <p className="text-lg font-bold tracking-tight font-label">Coach Sarah Miller</p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 space-y-2">
              <p className="text-accent font-bold text-xs flex items-center gap-2 font-label uppercase tracking-widest">
                <span className="material-symbols-outlined text-[18px] icon-fill">groups</span>
                Unirse a: Elite Sprinters Group
              </p>
              <p className="text-gray-400 text-xs leading-relaxed font-label">
                Por favor, completa tu perfil de atleta a continuación para aceptar la invitación y empezar a registrar tus entrenamientos.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Personal Information */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-7 rounded-full bg-black text-white text-xs font-bold font-nums">1</div>
            <h2 className="text-xl font-extrabold tracking-tight text-black font-label">¿Quién eres?</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 font-label">Nombre</label>
              <input
                type="text"
                placeholder="e.g. Usain"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-accent focus:border-accent transition-all font-label mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 font-label">Apellidos</label>
              <input
                type="text"
                placeholder="e.g. Bolt"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-accent focus:border-accent transition-all font-label mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 font-label">Fecha de Nacimiento</label>
                <div className="relative mt-1">
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-accent focus:border-accent transition-all font-nums"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 font-label">Sexo</label>
                <div className="relative mt-1">
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-accent focus:border-accent transition-all appearance-none font-label"
                  >
                    <option value="">Seleccionar</option>
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                    <option value="other">Otro</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">expand_more</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-gray-100 w-full"></div>

        {/* Section 2: Metrics */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-7 rounded-full bg-black text-white text-xs font-bold font-nums">2</div>
            <h2 className="text-xl font-extrabold tracking-tight text-black font-label">Tus Métricas</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 font-label">Altura (cm)</label>
              <input
                type="number"
                placeholder="180"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-accent focus:border-accent transition-all font-nums mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 font-label">Peso (kg)</label>
              <input
                type="number"
                placeholder="75.5"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-accent focus:border-accent transition-all font-nums mt-1"
              />
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={handleCompleteRegistration}
              disabled={isSaving}
              className="w-full h-16 bg-accent text-black rounded-2xl font-extrabold text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-label disabled:opacity-50"
            >
              <span>{isSaving ? 'Guardando...' : 'Completar Registro'}</span>
              {!isSaving && (
                <div className="size-6 rounded-full bg-black flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
              )}
            </button>
          </div>
        </section>

        <div className="h-px bg-gray-100 w-full"></div>

        {/* Footer */}
        <footer className="pt-8 pb-12 flex items-center justify-center gap-2 text-gray-400">
          <span className="material-symbols-outlined text-[18px]">lock</span>
          <p className="text-[10px] font-bold uppercase tracking-widest font-label">Tus datos se comparten de forma segura solo con tu entrenador.</p>
        </footer>
      </main>
    </div>
  );
};

export default AthleteRegistration;
