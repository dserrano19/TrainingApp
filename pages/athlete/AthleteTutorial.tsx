
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  visual: React.ReactNode;
}

const AthleteTutorial: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = [
    {
      id: 0,
      title: "Tu Plan Diario",
      description: "Visualiza tus entrenamientos asignados cada día. Mantén el enfoque y sigue la programación de tu coach sin perder detalle.",
      icon: "calendar_today",
      visual: (
        <div className="relative h-full w-full bg-surface-light dark:bg-[#252b1b] rounded-3xl border border-gray-100 dark:border-[#333] shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#333] bg-white dark:bg-[#1c2210]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hoy</span>
              <span className="text-lg font-bold text-black dark:text-white">Lunes, 14 Oct</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-black shadow-sm">
              <span className="material-symbols-outlined text-[18px] icon-fill">calendar_today</span>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1c2210] rounded-xl border-l-4 border-accent shadow-sm">
              <span className="material-symbols-outlined text-gray-400 text-lg">fitness_center</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-black dark:text-white">Back Squat</span>
                <span className="text-[10px] text-gray-500">5 sets • 5 reps @ 80%</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1c2210] rounded-xl border border-transparent shadow-sm opacity-50">
              <span className="material-symbols-outlined text-gray-400 text-lg">timer</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-black dark:text-white">AMRAP 12'</span>
                <span className="text-[10px] text-gray-500">Metcon Alta Intensidad</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 h-10 w-10 rounded-2xl bg-black dark:bg-white text-accent dark:text-black flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-xl">add</span>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Registro de Datos",
      description: "Registra tus marcas, tiempos y el esfuerzo percibido (RPE) al finalizar cada bloque. Datos reales para resultados reales.",
      icon: "edit_note",
      visual: (
        <div className="relative h-full w-full bg-surface-light dark:bg-[#252b1b] rounded-3xl border border-gray-100 dark:border-[#333] shadow-2xl overflow-hidden flex flex-col p-6 items-center justify-center gap-6">
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Esfuerzo (RPE)</span>
              <span className="text-xs font-bold text-accent">8/10</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`flex-1 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${i === 4 ? 'bg-accent text-black shadow-lg scale-110' : 'bg-white dark:bg-black/40 text-gray-400 border border-gray-100 dark:border-white/5'}`}>
                  {i}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full bg-black dark:bg-black/60 rounded-2xl p-4 border border-white/10 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Peso Real</span>
                <span className="text-xl font-bold text-white font-numbers">125.5 <span className="text-[10px] text-gray-600">kg</span></span>
             </div>
             <div className="h-px bg-white/5 w-full"></div>
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sensaciones</span>
                <span className="material-symbols-outlined text-accent icon-fill">sentiment_satisfied</span>
             </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Tu Evolución",
      description: "Observa tu progreso a través de gráficas detalladas. Controla tu carga de entrenamiento y evita el sobreentrenamiento.",
      icon: "analytics",
      visual: (
        <div className="relative h-full w-full bg-surface-light dark:bg-[#252b1b] rounded-3xl border border-gray-100 dark:border-[#333] shadow-2xl overflow-hidden flex flex-col p-6">
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Carga Semanal</span>
              <span className="text-3xl font-extrabold text-black dark:text-white font-numbers tracking-tight">1.240 <span className="text-xs text-gray-400">TSS</span></span>
            </div>
            <span className="material-symbols-outlined text-accent text-3xl icon-fill">trending_up</span>
          </div>
          <div className="flex-1 flex items-end gap-2 px-2 pb-4">
            {[40, 65, 50, 85, 60, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full rounded-t-md transition-all duration-1000 ${i === 5 ? 'bg-accent shadow-[0_0_15px_rgba(182,242,59,0.5)]' : 'bg-gray-200 dark:bg-white/10'}`} 
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-[8px] font-bold text-gray-400 uppercase">W{i+1}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Gestión de Material",
      description: "Lleva el control del kilometraje de tus zapatillas. Recibe alertas automáticas cuando sea el momento de renovarlas.",
      icon: "steps",
      visual: (
        <div className="relative h-full w-full bg-surface-light dark:bg-[#252b1b] rounded-3xl border border-gray-100 dark:border-[#333] shadow-2xl overflow-hidden flex flex-col p-6">
          <div className="bg-white dark:bg-black/60 rounded-2xl p-5 border border-gray-100 dark:border-white/5 space-y-6 shadow-sm">
            <div className="flex gap-4">
               <div className="size-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-black dark:text-white">directions_run</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-black dark:text-white uppercase">Nike Pegasus 40</span>
                  <span className="text-[10px] text-gray-400">Entrenamiento Diario</span>
               </div>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                  <span>642 km</span>
                  <span>800 km</span>
               </div>
               <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[80%] rounded-full shadow-[0_0_8px_rgba(182,242,59,0.3)]"></div>
               </div>
               <p className="text-[9px] text-accent font-bold uppercase text-right tracking-widest">Alerta de Renovación</p>
            </div>
          </div>
          <div className="mt-auto flex justify-center pb-2">
            <span className="material-symbols-outlined text-[64px] text-gray-100 dark:text-white/5">inventory_2</span>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "El Team",
      description: "Compite de forma sana con tus compañeros de equipo. Sube posiciones en el ranking y mantén la motivación al máximo.",
      icon: "groups",
      visual: (
        <div className="relative h-full w-full bg-surface-light dark:bg-[#252b1b] rounded-3xl border border-gray-100 dark:border-[#333] shadow-2xl overflow-hidden flex flex-col p-6 items-center justify-center">
          <div className="w-full space-y-3">
             {[1, 2, 3].map((pos) => (
               <div key={pos} className={`flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-black/60 border ${pos === 1 ? 'border-accent shadow-lg scale-105' : 'border-gray-100 dark:border-white/5 opacity-60'}`}>
                  <span className={`text-xs font-bold font-numbers w-4 ${pos === 1 ? 'text-accent' : 'text-gray-400'}`}>{pos}</span>
                  <div className="size-8 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                    <img src={`https://picsum.photos/id/${pos+20}/40/40`} className="w-full h-full object-cover grayscale" alt="User" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] font-bold text-black dark:text-white">Athlete Name</span>
                    <div className="h-1 w-full bg-gray-100 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${100 - (pos*20)}%` }}></div>
                    </div>
                  </div>
                  {pos === 1 && <span className="material-symbols-outlined text-accent text-sm icon-fill">crown</span>}
               </div>
             ))}
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/');
    }
  };

  const handleSkip = () => navigate('/');

  const step = steps[currentStep];

  return (
    <div className="relative flex flex-col h-screen max-w-md mx-auto bg-white dark:bg-black overflow-hidden selection:bg-accent selection:text-black">
      {/* Header */}
      <header className="flex w-full items-center justify-end px-6 py-12 z-20 shrink-0">
        <button 
          onClick={handleSkip}
          className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer font-label"
        >
          Saltar tutorial
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-8 relative z-10">
        {/* Visual Component */}
        <div className="relative w-full aspect-[4/5] max-h-[400px] mb-12 group">
          {/* Abstract Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-accent/20 blur-[60px] rounded-full transition-all duration-1000"></div>
          
          <div key={currentStep} className="relative h-full w-full animate-in zoom-in-95 fade-in duration-700 ease-out">
            {step.visual}
          </div>
        </div>

        {/* Text Content */}
        <div key={`text-${currentStep}`} className="flex flex-col items-center text-center w-full max-w-[320px] mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100">
          <h1 className="text-black dark:text-white tracking-tightest text-[32px] font-extrabold leading-tight pb-3 font-label">
            {step.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed font-label">
            {step.description}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-2.5 mb-4">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-accent shadow-[0_0_8px_var(--accent-color)]' : 'w-1.5 bg-gray-200 dark:bg-zinc-800'}`}
            />
          ))}
        </div>
      </main>

      {/* Footer Button */}
      <footer className="flex flex-col w-full px-6 pb-12 pt-2 shrink-0">
        <button 
          onClick={handleNext}
          className="relative w-full overflow-hidden rounded-2xl h-16 bg-accent hover:bg-accent-dim active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group shadow-xl shadow-accent/20"
        >
          <span className="text-black text-[13px] font-extrabold uppercase tracking-[0.2em] z-10 font-label">
            {currentStep === steps.length - 1 ? 'Empezar ahora' : 'Siguiente'}
          </span>
          <span className="material-symbols-outlined text-black text-xl z-10 transition-transform duration-300 group-hover:translate-x-1">
            {currentStep === steps.length - 1 ? 'rocket_launch' : 'arrow_forward'}
          </span>
        </button>
      </footer>
    </div>
  );
};

export default AthleteTutorial;
