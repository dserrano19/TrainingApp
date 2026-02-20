
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('ATHLETE');

  const handleContinue = () => {
    onSelect(selectedRole);
    navigate('/signup');
  };

  const handleGoToLogin = () => {
    onSelect(selectedRole);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col max-w-md mx-auto relative animate-in fade-in duration-700 selection:bg-accent selection:text-black">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-6 sticky top-0 z-10 bg-bg-app/90 backdrop-blur-sm pt-12">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full opacity-0">
          <span className="material-symbols-outlined text-black text-[24px]">arrow_back</span>
        </div>
        <h2 className="text-text-primary text-lg font-bold leading-tight tracking-widest flex-1 text-center font-label uppercase">TrainingDiary</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="text-text-secondary text-sm font-bold leading-normal tracking-wide hover:text-accent transition-colors font-label">HELP</button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-8 pb-12 w-full">
        {/* HeadlineText */}
        <div className="w-full flex flex-col items-center mb-12 text-center">
          <h1 className="text-text-primary tracking-tight text-[36px] font-extrabold leading-tight font-label pb-2">Define tu camino</h1>
          <p className="text-text-secondary text-base font-medium leading-relaxed max-w-[320px] font-label">
            Elige cómo usarás TrainingDiary para personalizar tu experiencia de alto rendimiento.
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-auto">
          {/* Athlete Option */}
          <div 
            onClick={() => setSelectedRole('ATHLETE')}
            className={`group relative flex flex-col gap-4 rounded-[2.5rem] p-6 aspect-[4/5.5] cursor-pointer transition-all duration-300 hover:scale-[1.02] border-[3px] shadow-2xl
              ${selectedRole === 'ATHLETE' 
                ? 'bg-widget-bg border-accent shadow-accent/10 dark:bg-zinc-900' 
                : 'bg-white dark:bg-zinc-900/40 border-gray-100 dark:border-white/5 shadow-sm opacity-60'}`}
          >
            {selectedRole === 'ATHLETE' && (
              <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                <span className="material-symbols-outlined text-accent text-[28px] icon-fill">check_circle</span>
              </div>
            )}
            <div className="flex-1 flex items-center justify-center">
              <span className={`material-symbols-outlined text-[72px] transition-colors duration-500 ${selectedRole === 'ATHLETE' ? 'text-accent' : 'text-gray-300'}`}>sprint</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <p className={`text-lg font-extrabold tracking-wide uppercase font-label ${selectedRole === 'ATHLETE' ? 'text-white' : 'text-gray-400'}`}>Atleta</p>
              <p className="text-gray-500 text-[10px] font-bold mt-1 uppercase tracking-widest font-label">ENTRENA & REGISTRA</p>
            </div>
          </div>

          {/* Coach Option */}
          <div 
            onClick={() => setSelectedRole('COACH')}
            className={`group relative flex flex-col gap-4 rounded-[2.5rem] p-6 aspect-[4/5.5] cursor-pointer transition-all duration-300 hover:scale-[1.02] border-[3px] shadow-2xl
              ${selectedRole === 'COACH' 
                ? 'bg-widget-bg border-accent shadow-accent/10 dark:bg-zinc-900' 
                : 'bg-white dark:bg-zinc-900/40 border-gray-100 dark:border-white/5 shadow-sm opacity-60'}`}
          >
            {selectedRole === 'COACH' && (
              <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                <span className="material-symbols-outlined text-accent text-[28px] icon-fill">check_circle</span>
              </div>
            )}
            <div className="flex-1 flex items-center justify-center">
              <span className={`material-symbols-outlined text-[72px] transition-colors duration-500 ${selectedRole === 'COACH' ? 'text-accent' : 'text-gray-200'}`}>sports</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <p className={`text-lg font-extrabold tracking-wide uppercase font-label ${selectedRole === 'COACH' ? 'text-white' : 'text-gray-400'}`}>Coach</p>
              <p className="text-gray-500 text-[10px] font-bold mt-1 uppercase tracking-widest font-label">PLANIFICA & GESTIONA</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full flex flex-col gap-6 mt-12">
          <button 
            onClick={handleContinue}
            className="flex w-full cursor-pointer items-center justify-center rounded-[1.25rem] h-16 bg-accent hover:bg-accent-dim active:scale-[0.98] transition-all text-black text-lg font-extrabold leading-normal tracking-wide shadow-xl shadow-accent/20 font-label"
          >
            Continuar
          </button>
          <p className="text-center text-sm font-bold text-text-secondary font-label uppercase tracking-widest">
            ¿Ya tienes cuenta? <button onClick={handleGoToLogin} className="text-text-primary font-extrabold underline decoration-2 decoration-accent underline-offset-4 hover:text-accent transition-colors">Entrar</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
