
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Shoe {
  id: string;
  name: string;
  type: string;
  surface: string;
  status: 'Good' | 'Warning' | 'Mid';
  currentKm: number;
  maxKm: number;
  image: string;
}

const ShoeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'active' | 'retired' | 'alert'>('active');

  const shoes: Shoe[] = [
    {
      id: '1',
      name: 'Nike Alphafly 3',
      type: 'Competición',
      surface: 'Asfalto',
      status: 'Good',
      currentKm: 120,
      maxKm: 500,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCbYCvf99AzqYvfSY5iHDtRRFTcCzyDa6PoKLPqz6TEtFerCInLYOti8-pXjXvHkwz3qb56tHq9MHc1P3dWjBSUuXey3PHJpHHnOqBLr9ebQHm11dBY1R06B5TRc_r5gADv5eAPNc35TGKBiFjzPqi8afdhIcANvjtfaFtVfX-8GQIYgpTsBVbqlJVAp6Q5PFVrySIKPUZ7kPs2qE7dSPSTaIrSfhnAHF8whRvhd3ere_vO08FRmFbhfl0c8s2efVxXy67YWFrIg'
    },
    {
      id: '2',
      name: 'Adidas Adizero SL',
      type: 'Entrenamiento diario',
      surface: 'Mixta',
      status: 'Warning',
      currentKm: 780,
      maxKm: 800,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkcFiRK6ePIg9ZXm_blW7TU6EXscfWFIVM2r1uAxPf4kTbdeD8l92mdBuBZHbpADGELroDOaSPc3YDhkC8kuvtvz7wsOjktpVfjulzhkOlRwTxiLhrSNHpFgco1HB9qMFLxBdbvhIdR0yeWlcTdukvHieZDfcYlwE_wP5DsNHruzexm4qw6oQ3-P9yBNL6Kiv_w_HpID647VGCM5e3UGnUycLrg7LbxrrexXWRXL2ri7_f8_Yj3Q9V-5OaK6UOGAdc6ZpKu5D4rQ'
    },
    {
      id: '3',
      name: 'NB FuelCell Rebel',
      type: 'Series',
      surface: 'Pista',
      status: 'Mid',
      currentKm: 285,
      maxKm: 600,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4H4uJkml3j8LjD1b0f7_CkKkTm576yb6arDKnYzcpKc0ZY9-XkKeKN48-A_E3QJ8JZyba1W9dUTeFSd9vnQTRjs1j9YE7uBOj7WmI6Yw-vi-FbLFd88tQeFx7UxE6QiEJMF9E4F_4pM0Q9gzfmzaCf7e_-eKACfNaD5AtRx5AMiWaZ9pjU6vYkJ5WZlzF17O0szCe8iaN9dK7e4WQFsRDtxg0lIdRIB5j_FHteaG0QkTN7iAe-MHbyC0rcUZUPOCdt9bmIq6rlw'
    }
  ];

  const filteredShoes = shoes.filter(shoe => {
    if (filter === 'active') return shoe.currentKm < shoe.maxKm;
    if (filter === 'retired') return shoe.currentKm >= shoe.maxKm;
    if (filter === 'alert') return (shoe.currentKm / shoe.maxKm) > 0.8;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-app/90 backdrop-blur-md border-b border-gray-100 px-4 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-400 hover:text-black transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">Gestión de Calzado</h1>
        </div>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-widget text-accent hover:bg-widget/90 transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>add</span>
        </button>
      </header>

      {/* Filters */}
      <section className="px-4 py-6 w-full overflow-x-auto no-scrollbar">
        <div className="flex gap-3 min-w-max">
          <button 
            onClick={() => setFilter('active')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${filter === 'active' ? 'bg-widget text-white border-widget' : 'bg-white text-text-primary border-gray-200'}`}
          >
            Activos
          </button>
          <button 
            onClick={() => setFilter('retired')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${filter === 'retired' ? 'bg-widget text-white border-widget' : 'bg-white text-text-primary border-gray-200'}`}
          >
            Retirados
          </button>
          <button 
            onClick={() => setFilter('alert')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border flex items-center gap-2 ${filter === 'alert' ? 'bg-widget text-white border-widget' : 'bg-white text-text-primary border-gray-200'}`}
          >
            Alerta
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </section>

      {/* Main List */}
      <main className="flex flex-col gap-4 px-4 pb-40">
        {filteredShoes.map((shoe) => {
          const progress = Math.min((shoe.currentKm / shoe.maxKm) * 100, 100);
          
          return (
            <article 
              key={shoe.id} 
              onClick={() => navigate(`/shoes/${shoe.id}`)}
              className="group relative flex flex-col bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm hover:shadow-xl hover:border-accent transition-all duration-300 cursor-pointer active:scale-[0.98]"
            >
              <div className="flex justify-between items-start gap-4 mb-5">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden relative border border-gray-100">
                    <img 
                      alt={shoe.name} 
                      className="w-full h-full object-cover mix-blend-multiply opacity-90 grayscale group-hover:grayscale-0 transition-all duration-500" 
                      src={shoe.image} 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold leading-tight mb-1 text-text-primary">{shoe.name}</h3>
                    <p className="font-serif text-sm text-gray-500 italic">{shoe.type} • {shoe.surface}</p>
                  </div>
                </div>
                
                {shoe.status === 'Good' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-widest font-label">
                    Excelente
                  </span>
                )}
                {shoe.status === 'Warning' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold bg-accent/20 text-black border border-accent/30 uppercase tracking-widest font-label">
                    Alerta
                  </span>
                )}
                {shoe.status === 'Mid' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold bg-gray-50 text-gray-600 border border-gray-200 uppercase tracking-widest font-label">
                    Medio
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-label">Kilometraje</div>
                  <div className="font-numbers font-bold text-text-primary">
                    <span className="text-xl tracking-tighter">{shoe.currentKm}</span> 
                    <span className="text-xs text-gray-400 ml-1">/ {shoe.maxKm} km</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${shoe.status === 'Warning' ? 'bg-accent' : 'bg-accent opacity-80'}`} 
                    style={{ width: `${progress}%` }}
                  >
                    {shoe.status === 'Warning' && (
                       <div className="absolute inset-0 w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(0,0,0,.2) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.2) 50%,rgba(0,0,0,.2) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                <span className="material-symbols-outlined text-accent">chevron_right</span>
              </div>
            </article>
          );
        })}

        {/* Add New Placeholder */}
        <button className="w-full mt-4 flex items-center justify-center gap-3 p-8 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-gray-400 hover:border-accent hover:text-text-primary hover:bg-accent/5 transition-all group">
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
          <span className="font-bold text-xs uppercase tracking-[0.2em] font-label">Registrar Nuevo Par</span>
        </button>
      </main>
    </div>
  );
};

export default ShoeManagement;
