
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CoachGestionCompeticiones: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    confirm: true,
    compare: true,
    alerts: false
  });

  return (
    <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-500 pb-40 overflow-x-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 pt-12">
          <h1 className="text-2xl font-bold text-black font-label leading-none">Gestión Competiciones</h1>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-black hover:bg-accent transition-colors duration-200">
            <span className="material-symbols-outlined text-2xl font-bold">add</span>
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-6 p-5">
        {/* Quick Action: Upload Excel */}
        <section>
          <div className="relative overflow-hidden rounded-3xl bg-black text-white p-6 shadow-2xl group cursor-pointer transition-transform active:scale-95">
            <div className="relative z-10 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-black">
                <span className="material-symbols-outlined text-3xl icon-fill">table_view</span>
              </div>
              <div>
                <h2 className="text-xl font-bold font-label mb-1">Carga Masiva por Excel</h2>
                <p className="text-gray-400 text-sm font-medium max-w-[260px]">
                  Importar detalles, eventos y mínimas desde archivo .xlsx o .csv.
                </p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-black font-bold text-sm hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-lg">upload_file</span>
                Subir Archivo
              </button>
            </div>
            {/* Decorative Patterns */}
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-zinc-800 rounded-full blur-3xl opacity-50"></div>
          </div>
        </section>

        {/* Automation Settings */}
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-bold font-label text-black px-1">Configuración de Atletas</h3>
          <div className="flex flex-col gap-3">
            {/* Setting Item 1 */}
            <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl text-gray-900">
                  <span className="material-symbols-outlined">mark_email_unread</span>
                </div>
                <div>
                  <p className="font-bold font-label text-sm text-black">Solicitar confirmación</p>
                  <p className="text-[10px] text-gray-500 font-medium">Pedir a atletas que confirmen asistencia</p>
                </div>
              </div>
              <button 
                onClick={() => setConfig({...config, confirm: !config.confirm})}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${config.confirm ? 'bg-accent' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform duration-200 ${config.confirm ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>

            {/* Setting Item 2 */}
            <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl text-gray-900">
                  <span className="material-symbols-outlined">compare_arrows</span>
                </div>
                <div>
                  <p className="font-bold font-label text-sm text-black">Comparar PB vs Mínima</p>
                  <p className="text-[10px] text-gray-500 font-medium">Mostrar brecha de rendimiento en perfil</p>
                </div>
              </div>
              <button 
                onClick={() => setConfig({...config, compare: !config.compare})}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${config.compare ? 'bg-accent' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform duration-200 ${config.compare ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>

            {/* Setting Item 3 */}
            <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl text-gray-900">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <div>
                  <p className="font-bold font-label text-sm text-black">Alertas de recordatorio</p>
                  <p className="text-[10px] text-gray-500 font-medium">Avisar 48h antes del cierre de inscripciones</p>
                </div>
              </div>
              <button 
                onClick={() => setConfig({...config, alerts: !config.alerts})}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${config.alerts ? 'bg-accent' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform duration-200 ${config.alerts ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Competitions List */}
        <section className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold font-label text-black">Calendario & Mínimas</h3>
            <button className="text-xs font-bold text-gray-400 hover:text-black font-label">Ver todo</button>
          </div>

          {/* Competition Card 1 */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-5 flex justify-between items-start border-b border-gray-50 bg-gray-50/50">
              <div className="cursor-pointer" onClick={() => navigate('/planning/competition-detail')}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-accent text-black">Nacional</span>
                  <span className="text-[10px] font-bold text-gray-400 font-nums">15-17 May</span>
                </div>
                <h4 className="text-lg font-bold font-label leading-tight text-black">Camp. Nacional Absoluto</h4>
                <div className="flex items-center gap-1 text-gray-500 mt-1.5">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="text-xs font-medium">Madrid, Vallehermoso</span>
                </div>
              </div>
              <div className="bg-black text-white w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-[9px] font-bold uppercase font-label">MAY</span>
                <span className="text-lg font-bold font-nums leading-none">15</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-label">Progreso de Mínimas</span>
                <span className="text-[10px] font-bold text-black font-nums tracking-widest uppercase">8/12 Atletas</span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-accent w-2/3 rounded-full shadow-[0_0_10px_rgba(182,242,59,0.3)]"></div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <span className="block text-xl font-bold font-nums text-black leading-none">12</span>
                  <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest font-label mt-1 inline-block">Eventos</span>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <span className="block text-xl font-bold font-nums text-black leading-none">3</span>
                  <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest font-label mt-1 inline-block">Pendientes</span>
                </div>
                <button 
                  onClick={() => navigate('/planning/competition-detail')}
                  className="flex items-center justify-center w-10 bg-black text-white rounded-xl hover:bg-zinc-800 transition-all active:scale-95 shadow-xl"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Competition Card 2 */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 flex justify-between items-start bg-gray-50/50">
              <div className="cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-black text-white">Internacional</span>
                  <span className="text-[10px] font-bold text-gray-400 font-nums">22 May</span>
                </div>
                <h4 className="text-lg font-bold font-label leading-tight text-black">Meeting Internacional BCN</h4>
                <div className="flex items-center gap-1 text-gray-500 mt-1.5">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="text-xs font-medium">Barcelona, Serrahima</span>
                </div>
              </div>
              <div className="bg-gray-100 text-gray-900 w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold uppercase font-label">MAY</span>
                <span className="text-lg font-bold font-nums leading-none">22</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <span className="material-symbols-outlined text-red-500 icon-fill">warning</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-red-700 font-label">Mínimas sin configurar</span>
                  <span className="text-[10px] text-red-500 font-medium">Sube el archivo de criterios para activar.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Competition Card 3 (Simple) */}
          <div onClick={() => navigate('/planning/competition-detail')} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex justify-between items-center group cursor-pointer active:scale-[0.99]">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 text-black w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-widest">JUN</span>
                <span className="text-lg font-bold font-nums leading-none">05</span>
              </div>
              <div>
                <h4 className="text-base font-bold font-label leading-tight text-black">Ctl. Federación Madrid</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Madrid, Gallur</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-black transition-colors">chevron_right</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoachGestionCompeticiones;
