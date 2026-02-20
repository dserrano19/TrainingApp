
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ShoeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data for a specific shoe
  const shoe = {
    id: id || '1',
    name: 'Pegasus 39',
    brand: 'Nike',
    currentKm: 642,
    maxKm: 800,
    purchaseDate: 'Oct 12, 2023',
    costPerKm: '$0.18',
    notes: 'Reservadas para rodajes largos y días de recuperación. Excelente amortiguación, puntera ligeramente estrecha.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmPy1Wi-bmF38vrb0FMxL05ndS5Q9-oYw3raBFicI3x4iIete6QEmwLEasMldRE9J5fFEPT13CP-CN8S6qcaH1T3BmbymEcRvY9NwaWAINs4G-RpRfKjEjQyiPF0H0KCtykCx4_dSn0jEdRaRFc5C37-ED5k7if2NlVAaC1UZG9WznGti3s9eAPfQ0PaTLV-ooA629lqM8sna5HgcJM6XJ_q2qF8PU8XP99gAGoQreFSf1qeEeKaeLjrK3FQPY8FKgdW1TFxAkQw',
    activities: [
      { id: 'a1', title: 'Rodaje Matutino', date: '12 Oct', time: '06:30 AM', dist: '10.5 km', pace: '5:12 /km', icon: 'directions_run' },
      { id: 'a2', title: 'Intervalos', date: '10 Oct', time: '18:45 PM', dist: '8.0 km', pace: '4:45 /km', icon: 'timer' },
      { id: 'a3', title: 'Tirada Larga', date: '08 Oct', time: '07:00 AM', dist: '15.2 km', pace: '5:30 /km', icon: 'landscape' },
    ]
  };

  const progress = (shoe.currentKm / shoe.maxKm) * 100;
  const remaining = shoe.maxKm - shoe.currentKm;

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in slide-in-from-right duration-500 pb-40">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors text-text-primary"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-[12px] font-bold tracking-[0.2em] text-text-primary uppercase font-label">Detalle de Calzado</h1>
        <button className="text-[11px] font-bold text-text-primary hover:text-accent transition-colors uppercase tracking-widest font-label">
          Editar
        </button>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* Shoe Hero Card */}
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-50 group shadow-xl">
          <img 
            alt={shoe.name} 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105" 
            src={shoe.image} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="font-label text-[10px] font-bold tracking-[0.2em] opacity-80 uppercase mb-1">{shoe.brand}</p>
            <h2 className="font-label text-3xl font-bold leading-none tracking-tight">{shoe.name}</h2>
          </div>
        </div>

        {/* Life-cycle Dashboard */}
        <div className="bg-widget text-white rounded-[2rem] p-6 shadow-2xl border border-white/5">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-end border-b border-white/5 pb-5">
              <div className="flex flex-col">
                <span className="text-gray-500 font-serif text-sm italic">Uso Actual</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-bold font-numbers text-accent tracking-tighter">{shoe.currentKm}</span>
                  <span className="text-lg text-gray-500 font-numbers">/ {shoe.maxKm} km</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[9px] font-bold uppercase tracking-widest border border-accent/20">Activo</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[9px] text-gray-500 font-label uppercase tracking-widest font-bold">
                <span>0 km</span>
                <span>Límite vida útil</span>
              </div>
              <div className="h-5 w-full rounded-full bg-white/5 overflow-hidden border border-white/5 p-0.5">
                <div className="h-full bg-accent rounded-full relative transition-all duration-1000" style={{ width: `${progress}%` }}>
                  {/* Striped pattern overlay */}
                  <div className="absolute inset-0 w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #000 5px, #000 10px)' }}></div>
                </div>
              </div>
              <p className="text-right font-serif text-sm text-gray-400 italic mt-1">Faltan {remaining} km para la jubilación</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-label mb-1.5">Fecha de compra</span>
            <span className="text-base font-bold text-text-primary font-numbers">{shoe.purchaseDate}</span>
          </div>
          <div className="flex flex-col p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-label mb-1.5">Coste / km</span>
            <span className="text-base font-bold text-text-primary font-numbers">{shoe.costPerKm}</span>
          </div>
          <div className="col-span-2 flex flex-col p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-label mb-2">Notas del calzado</span>
            <p className="text-base text-text-primary font-serif leading-relaxed italic">{shoe.notes}</p>
          </div>
        </div>

        {/* Mileage Trend Chart */}
        <section className="mt-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-text-primary text-xl font-bold font-label tracking-tight">Tendencia de uso</h3>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest font-label">+12% vs mes anterior</span>
          </div>
          
          <div className="w-full bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xl">
            <div className="w-full h-[180px] relative">
              <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 472 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradient_chart_detail" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <line stroke="#F3F4F6" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="472" y1="149" y2="149"></line>
                <line stroke="#F3F4F6" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="472" y1="100" y2="100"></line>
                <line stroke="#F3F4F6" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="472" y1="50" y2="50"></line>
                <path d="M0 109C18.15 109 18.15 21 36.3 21C54.46 21 54.46 41 72.6 41C90.7 41 90.7 93 108.9 93C127 93 127 33 145.2 33C163.3 33 163.3 101 181.5 101C199.6 101 199.6 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363 1C381.2 1 381.2 81 399.3 81C417.5 81 417.5 129 435.6 129C453.8 129 453.8 25 472 25V149H0V109Z" fill="url(#gradient_chart_detail)"></path>
                <path d="M0 109C18.15 109 18.15 21 36.3 21C54.46 21 54.46 41 72.6 41C90.7 41 90.7 93 108.9 93C127 93 127 33 145.2 33C163.3 33 163.3 101 181.5 101C199.6 101 199.6 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363 1C381.2 1 381.2 81 399.3 81C417.5 81 417.5 129 435.6 129C453.8 129 453.8 25 472 25" stroke="#111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
              </svg>
            </div>
            <div className="flex justify-between mt-6 px-2 border-t border-gray-50 pt-4">
              {['W1', 'W2', 'W3', 'W4', 'W5'].map(w => (
                <span key={w} className="text-[10px] font-bold text-gray-400 font-label uppercase tracking-widest">{w}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity Log */}
        <section className="mt-4 pb-12">
          <h3 className="text-text-primary text-xl font-bold font-label tracking-tight mb-4 px-1">Actividades Recientes</h3>
          <div className="flex flex-col divide-y divide-gray-100 bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl">
            {shoe.activities.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-widget flex items-center justify-center text-accent shrink-0 shadow-lg">
                    <span className="material-symbols-outlined text-xl">{act.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-text-primary font-label uppercase tracking-wide truncate">{act.title}</span>
                    <span className="text-xs text-gray-500 font-serif italic">{act.date} • {act.time}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-base font-bold text-text-primary font-numbers tracking-tight">{act.dist}</span>
                  <span className="text-[10px] text-gray-500 font-numbers uppercase font-bold">{act.pace}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ShoeDetail;
