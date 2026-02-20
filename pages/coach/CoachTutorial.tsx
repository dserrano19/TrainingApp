
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  visual: React.ReactNode;
}

const CoachTutorial: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = [
    {
      id: 0,
      title: "Dashboard",
      description: "Tu centro de mando. Obtén una visión diaria de las sesiones pendientes y alertas urgentes de un vistazo.",
      visual: (
        <div className="w-full aspect-[4/5] bg-gray-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-6 flex flex-col gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden relative">
          <div className="w-full h-8 flex justify-between items-center mb-2">
            <div className="h-4 w-1/3 bg-black dark:bg-white rounded-md"></div>
            <div className="h-8 w-8 rounded-full border-2 border-black dark:border-white"></div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-24 rounded-lg border-2 border-black dark:border-white bg-accent/20"></div>
            <div className="flex-1 h-24 rounded-lg border-2 border-black dark:border-white"></div>
          </div>
          <div className="w-full h-32 rounded-lg border-2 border-black dark:border-white mt-2 p-3 space-y-2">
            <div className="h-2 w-3/4 bg-gray-300 dark:bg-zinc-600 rounded"></div>
            <div className="h-2 w-1/2 bg-gray-300 dark:bg-zinc-600 rounded"></div>
            <div className="h-2 w-5/6 bg-gray-300 dark:bg-zinc-600 rounded"></div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Planificación",
      description: "Construye macrociclos y entrenamientos diarios sin esfuerzo con nuestro editor detallado.",
      visual: (
        <div className="w-full aspect-[4/5] bg-gray-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-6 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-400">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 flex-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className={`aspect-square border rounded-md ${i === 4 ? 'bg-accent border-black' : 'border-gray-200 dark:border-zinc-800'}`}></div>
            ))}
            <div className="col-span-7 h-20 border-2 border-black dark:border-white border-dashed rounded-xl mt-4 flex items-center justify-center">
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Builder UI</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Atletas",
      description: "Gestiona tu plantilla de forma eficiente. Revisa perfiles individuales y métricas de salud al instante.",
      visual: (
        <div className="w-full aspect-[4/5] bg-gray-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-0 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden">
          <div className="flex flex-col divide-y-2 divide-black dark:divide-zinc-700">
            {[
              { color: 'bg-accent', name: 'W: 32', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDlnaZdEaIzgLwtRuGxw8kiYdWfBjTIUj-N3-TV8Di6CEM62OS7B1GgN47M7my9PS0i6gVbMCzhOfLRtDig-jBwH7eiSPm1s7ERcE8ikQ3PkjIqeZDbB3VawA5ayLU2_kndD_2PazBXG9hSokyl3YP8jFHPNwlUzugfC0TC_2t75owRTeq6yArvrDjPe_AkVhaX7K-BnQsk3ZNFydKcGtsCdq0XgdVoX9gwAwcTc8TbQYvXjSTtRRfKawgSHJgqRXFqMhX8beoEw' },
              { color: 'bg-red-500', name: 'W: 12', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxW1nLB7JSNn5KWySPgJCqxnS_-VsqwwXs8hsr_WjmPcrJtCbj66vpciKa5rXrnOg_BZ8EKdii7rFNifDn7b3LuDAe_9AkOofdE-8BvGfZxg3IXiK5ofA7VeM7j_VNJBcO4kJJG36fR83-Brgm4sPuXAiKVyKI8pH20kUZi7mImRI9zyOPGc__XMHlKN6exGB05EW2TlFlJN6DIVaV6qV8yLl9hMTEqIhsOOYdZxdJElLmksAiLiKrnyh2Wmkz0eAzqQ3FnB7QBg' },
              { color: 'bg-accent', name: 'W: 28', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU9ZWXZ_QYJqh_hQouGWzs8-ohUsyWZcX8FmsP481cXfzclcqoqj2FkjDMhBXjkRjXaAbyOK_30zAauWnalc4DxuIP4pQBNslLDZAgbY02WD5aXXzimIHwF-E6BQMEePniGxha8DvqcvS7NNH3r-832k3rJHo_nLf3K58a_X_n7QNuuwTv63Q3jjLK1Bz_S7fRs0VBTYB0d0Ukr1NAIQ0NYCiJo0P2Sq2JggUV5e2T77okdK3x6Au5q6STbQD-1vpvA0_y3aDf1Q' }
            ].map((a, i) => (
              <div key={i} className="flex items-center p-4 gap-4 bg-white dark:bg-zinc-800">
                <div className="size-10 rounded-full border-2 border-black overflow-hidden bg-gray-200">
                  <img src={a.img} className="w-full h-full object-cover grayscale" alt="User" />
                </div>
                <div className="flex-1">
                   <div className="h-3 w-2/3 bg-black dark:bg-white rounded mb-1.5"></div>
                   <div className={`h-2 w-1/3 rounded ${a.color}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Análisis",
      description: "Sumérgete en los datos. Rastrea las tendencias de progreso y los puntos de referencia del rendimiento.",
      visual: (
        <div className="w-full aspect-[4/5] bg-gray-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-6 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden">
          <div className="flex items-end justify-between h-48 w-full gap-2 mt-auto mb-8 px-2">
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-t-sm h-[30%]"></div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-t-sm h-[50%]"></div>
            <div className="w-full bg-black dark:bg-white rounded-t-sm h-[40%] relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">240%</div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-t-sm h-[65%]"></div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-t-sm h-[80%]"></div>
          </div>
          <div className="w-full h-0.5 bg-black dark:bg-white mb-2 opacity-20"></div>
          <div className="flex justify-between text-[8px] font-bold text-gray-400 tracking-widest uppercase">
            <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span>
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
    <div className="relative flex flex-col h-screen max-w-md mx-auto bg-white dark:bg-[#0f1208] overflow-hidden selection:bg-accent selection:text-black animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex w-full items-center justify-between px-6 py-12 z-20 shrink-0">
        <div className="flex flex-1 gap-2">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-accent shadow-[0_0_10px_rgba(181,242,58,0.4)]' : 'bg-gray-200 dark:bg-zinc-800'}`}
            />
          ))}
        </div>
        <button 
          onClick={handleSkip}
          className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-opacity ml-6 font-label"
        >
          Skip
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-8 relative z-10">
        <div key={currentStep} className="w-full mb-12 animate-in zoom-in-95 fade-in duration-700 ease-out">
          {step.visual}
        </div>

        <div key={`text-${currentStep}`} className="flex flex-col items-start w-full mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100">
          <h2 className="text-black dark:text-white tracking-tightest text-[36px] font-extrabold leading-tight mb-4 font-label">
            {step.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-300 text-lg font-light leading-relaxed font-label">
            {step.description}
          </p>
        </div>
      </main>

      {/* Footer Button */}
      <footer className="w-full px-6 pb-12 pt-4 shrink-0">
        <button 
          onClick={handleNext}
          className="flex w-full cursor-pointer items-center justify-between rounded-xl h-16 pl-8 pr-6 bg-accent text-black text-xl font-extrabold leading-normal tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none transition-all active:translate-y-[4px] active:shadow-none font-label"
        >
          <span className="truncate">{currentStep === steps.length - 1 ? 'Empezar' : 'Siguiente'}</span>
          <span className="material-symbols-outlined text-2xl font-bold">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};

export default CoachTutorial;
