import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { getCurrentStreak } from '../../utils/statsCalculations';

interface AthleteRank {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  performance: string; // Marca en formato texto
  perfVal: number;    // Valor numérico para ordenar
  trend: 'up' | 'down' | 'stable';
  isMe?: boolean;
}

const CATEGORIES = ['Global', 'Sprints', 'Fondo', 'Fuerza'];

const MOCK_DATA: Record<string, AthleteRank[]> = {
  'Global': [
    { id: '1', name: 'Sarah Miller', avatar: 'https://picsum.photos/id/65/100/100', streak: 45, performance: '11.42s', perfVal: 11.42, trend: 'stable' },
    { id: '2', name: 'John Davis', avatar: 'https://picsum.photos/id/64/100/100', streak: 38, performance: '11.58s', perfVal: 11.58, trend: 'up' },
    { id: '3', name: 'Marcus Chen', avatar: 'https://picsum.photos/id/61/100/100', streak: 32, performance: '11.65s', perfVal: 11.65, trend: 'down' },
    { id: 'me', name: 'Alex Runner', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFbbOVr_Zcy7nHudr4kELDzwgKvaJgNxZ5LY8GbJqh-gua27Qkh8-5HEmFrum3pG3Cmy8YmdBJvpuwq3Xe8fN9-cdriU3YlprTuGc_ziGpyAJwxrqDjXRBQhX6JW83Jr8fDc52YDYkvPzjgor5BmiqNZjHxx6kcKPlmwif97of2n4eRLzhTJie6qo7zCXTXwNqjSXe15o54q9Ej9ZcdjmEI4tsqgahrBg3mDTeaOzqgYmHM1mcyRZ331m5kOFfONJufunfqWxtbQ', streak: 28, performance: '11.85s', perfVal: 11.85, trend: 'up', isMe: true },
    { id: '5', name: 'Elena Smith', avatar: 'https://picsum.photos/id/62/100/100', streak: 21, performance: '11.92s', perfVal: 11.92, trend: 'stable' },
    { id: '6', name: 'David L.', avatar: 'https://picsum.photos/id/60/100/100', streak: 18, performance: '12.05s', perfVal: 12.05, trend: 'down' },
    { id: '7', name: 'Sofia P.', avatar: 'https://picsum.photos/id/59/100/100', streak: 14, performance: '12.10s', perfVal: 12.10, trend: 'up' },
  ],
  'Sprints': [
    { id: '1', name: 'Sarah Miller', avatar: 'https://picsum.photos/id/65/100/100', streak: 45, performance: '11.42s', perfVal: 11.42, trend: 'stable' },
    { id: 'me', name: 'Alex Runner', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFbbOVr_Zcy7nHudr4kELDzwgKvaJgNxZ5LY8GbJqh-gua27Qkh8-5HEmFrum3pG3Cmy8YmdBJvpuwq3Xe8fN9-cdriU3YlprTuGc_ziGpyAJwxrqDjXRBQhX6JW83Jr8fDc52YDYkvPzjgor5BmiqNZjHxx6kcKPlmwif97of2n4eRLzhTJie6qo7zCXTXwNqjSXe15o54q9Ej9ZcdjmEI4tsqgahrBg3mDTeaOzqgYmHM1mcyRZ331m5kOFfONJufunfqWxtbQ', streak: 28, performance: '11.85s', perfVal: 11.85, trend: 'up', isMe: true },
    { id: '2', name: 'John Davis', avatar: 'https://picsum.photos/id/64/100/100', streak: 38, performance: '11.58s', perfVal: 11.58, trend: 'stable' },
  ],
  'Fuerza': [
    { id: '3', name: 'Marcus Chen', avatar: 'https://picsum.photos/id/61/100/100', streak: 32, performance: '180kg', perfVal: 180, trend: 'up' },
    { id: '1', name: 'Sarah Miller', avatar: 'https://picsum.photos/id/65/100/100', streak: 45, performance: '140kg', perfVal: 140, trend: 'stable' },
    { id: 'me', name: 'Alex Runner', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFbbOVr_Zcy7nHudr4kELDzwgKvaJgNxZ5LY8GbJqh-gua27Qkh8-5HEmFrum3pG3Cmy8YmdBJvpuwq3Xe8fN9-cdriU3YlprTuGc_ziGpyAJwxrqDjXRBQhX6JW83Jr8fDc52YDYkvPzjgor5BmiqNZjHxx6kcKPlmwif97of2n4eRLzhTJie6qo7zCXTXwNqjSXe15o54q9Ej9ZcdjmEI4tsqgahrBg3mDTeaOzqgYmHM1mcyRZ331m5kOFfONJufunfqWxtbQ', streak: 28, performance: '120kg', perfVal: 120, trend: 'down', isMe: true },
  ]
};

// ... (Interface and MOCK_DATA remain the same, so we don't need to replace them if we carefully target lines. Wait, imports are at top.)

const Rankings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rankingType, setRankingType] = useState<'constancia' | 'rendimiento'>('constancia');
  const [selectedCat, setSelectedCat] = useState('Global');
  const [isSyncing, setIsSyncing] = useState(false);
  const [myStreak, setMyStreak] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      getCurrentStreak(user.id).then(setMyStreak);
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) setUserProfile(data);
      });
    }
  }, [user]);

  const sortedData = useMemo(() => {
    // Clone logic with overridden streak for 'me'
    const rawList = [...(MOCK_DATA[selectedCat] || MOCK_DATA['Global'])];
    const list = rawList.map(item => {
      if (item.isMe) {
        return {
          ...item,
          streak: myStreak,
          name: userProfile?.full_name || item.name,
          avatar: userProfile?.avatar_url || item.avatar
        };
      }
      return item;
    });

    if (rankingType === 'constancia') {
      return list.sort((a, b) => b.streak - a.streak);
    } else {
      // Rendimiento
      if (selectedCat === 'Fuerza') return list.sort((a, b) => b.perfVal - a.perfVal);
      return list.sort((a, b) => a.perfVal - b.perfVal);
    }
  }, [rankingType, selectedCat, myStreak]);

  const podium = sortedData.slice(0, 3);
  const listItems = sortedData.slice(3);
  const me = sortedData.find(a => a.isMe);
  const myRank = sortedData.findIndex(a => a.isMe) + 1;

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-48 overflow-x-hidden">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-bg-app/80 backdrop-blur-xl border-b border-widget-border/10 px-6 pt-12 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-primary"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center flex-1">
          <h1 className="text-xs font-bold tracking-widest uppercase text-gray-500 font-label">Leaderboard Elite</h1>
          <p className="text-sm font-extrabold text-text-primary font-label">Temporada Otoño 2024</p>
        </div>
        <button
          onClick={handleSync}
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-primary relative"
        >
          <span className={`material-symbols-outlined ${isSyncing ? 'animate-spin text-accent' : ''}`}>sync</span>
          {isSyncing && <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>}
        </button>
      </header>

      {/* Categories Carousel */}
      <div className="flex gap-2 px-6 py-6 overflow-x-auto no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${selectedCat === cat
              ? 'bg-accent border-accent text-black shadow-lg shadow-accent/20 scale-105'
              : 'bg-widget border-widget-border text-gray-500 hover:text-white'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Toggle */}
      <div className="px-6 mb-8">
        <div className="flex h-12 w-full items-center rounded-2xl bg-widget p-1 border border-widget-border shadow-2xl relative">
          <div
            className={`absolute h-10 w-[calc(50%-4px)] bg-accent rounded-xl transition-all duration-500 ease-out shadow-lg ${rankingType === 'rendimiento' ? 'translate-x-[calc(100%)]' : 'translate-x-0'}`}
          ></div>
          <button
            onClick={() => setRankingType('constancia')}
            className={`flex-1 z-10 h-full flex items-center justify-center text-[10px] font-bold uppercase tracking-widest transition-colors ${rankingType === 'constancia' ? 'text-black' : 'text-gray-500'}`}
          >
            Constancia
          </button>
          <button
            onClick={() => setRankingType('rendimiento')}
            className={`flex-1 z-10 h-full flex items-center justify-center text-[10px] font-bold uppercase tracking-widest transition-colors ${rankingType === 'rendimiento' ? 'text-black' : 'text-gray-500'}`}
          >
            Rendimiento
          </button>
        </div>
      </div>

      {/* Dynamic Podium */}
      <div className="px-4 mb-12">
        <div className="grid grid-cols-3 gap-2 items-end pt-16">
          {/* 2nd Place */}
          <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="relative w-full aspect-[4/5] bg-widget rounded-t-[2.5rem] flex flex-col items-center justify-end pb-6 border-x border-t border-widget-border shadow-xl">
              <div className="absolute -top-6 size-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-gray-400 font-bold text-lg">2</div>
              <div className="size-14 rounded-full border-4 border-zinc-800 overflow-hidden mb-3 scale-90">
                <img src={podium[1]?.avatar} className="w-full h-full object-cover" alt="2nd" />
              </div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 truncate px-2 w-full text-center">{podium[1]?.name}</p>
              <p className="text-lg font-extrabold text-white font-numbers tracking-tight">
                {rankingType === 'constancia' ? `${podium[1]?.streak}d` : podium[1]?.performance}
              </p>
            </div>
          </div>

          {/* 1st Place - The Hero */}
          <div className="flex flex-col items-center scale-110 z-10 animate-in slide-in-from-bottom-12 duration-1000">
            <div className="relative w-full aspect-[4/6.5] bg-widget rounded-t-[3rem] flex flex-col items-center justify-end pb-10 shadow-[0_30px_60px_-15px_rgba(182,242,59,0.3)] border-x border-t border-accent/40 ring-1 ring-accent/10">
              <div className="absolute -top-8 size-14 rounded-full bg-accent text-black flex items-center justify-center font-extrabold text-2xl shadow-xl shadow-accent/40 animate-pulse">1</div>
              <span className="material-symbols-outlined text-accent mb-4 icon-fill text-3xl">crown</span>
              <div className="size-20 rounded-full border-4 border-accent overflow-hidden mb-4 shadow-2xl">
                <img src={podium[0]?.avatar} className="w-full h-full object-cover" alt="1st" />
              </div>
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1 truncate px-2 w-full text-center">{podium[0]?.name}</p>
              <p className="text-2xl font-black text-white font-numbers tracking-tight">
                {rankingType === 'constancia' ? `${podium[0]?.streak}d` : podium[0]?.performance}
              </p>
            </div>
            <div className="w-full h-2 bg-accent rounded-b-xl shadow-lg shadow-accent/20"></div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center animate-in slide-in-from-bottom-6 duration-700 delay-200">
            <div className="relative w-full aspect-[4/4.2] bg-widget rounded-t-[2.5rem] flex flex-col items-center justify-end pb-6 border-x border-t border-widget-border shadow-xl">
              <div className="absolute -top-6 size-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-gray-500 font-bold text-lg">3</div>
              <div className="size-14 rounded-full border-4 border-zinc-800 overflow-hidden mb-3 scale-90">
                <img src={podium[2]?.avatar} className="w-full h-full object-cover" alt="3rd" />
              </div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 truncate px-2 w-full text-center">{podium[2]?.name}</p>
              <p className="text-lg font-extrabold text-white font-numbers tracking-tight">
                {rankingType === 'constancia' ? `${podium[2]?.streak}d` : podium[2]?.performance}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-6 flex flex-col gap-3">
        <div className="flex items-center justify-between px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-label">
          <span>Pos • Atleta</span>
          <span>Resultado</span>
        </div>

        {listItems.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 rounded-[1.75rem] bg-widget border border-widget-border shadow-lg transition-all hover:border-accent/30 group cursor-pointer active:scale-[0.98] ${item.isMe ? 'ring-2 ring-accent shadow-accent/10' : ''}`}
          >
            <span className="w-6 text-xs font-bold text-gray-500 font-numbers">{(idx + 4).toString().padStart(2, '0')}</span>
            <div className="relative">
              <div className="size-11 rounded-full overflow-hidden border-2 border-white/5 transition-all duration-500">
                <img src={item.avatar} className="w-full h-full object-cover" alt={item.name} />
              </div>
              <div className={`absolute -bottom-1 -right-1 size-5 rounded-full bg-black border border-white/10 flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-[12px] font-bold ${item.trend === 'up' ? 'text-accent' : item.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                  {item.trend === 'up' ? 'trending_up' : item.trend === 'down' ? 'trending_down' : 'remove'}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white font-label truncate">{item.name}</p>
              <p className="text-[10px] text-gray-600 font-label uppercase tracking-widest">{selectedCat === 'Global' ? 'Elite Squad' : selectedCat}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-extrabold text-white font-numbers tracking-tight">
                {rankingType === 'constancia' ? `${item.streak}d` : item.performance}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Persistant "My Position" Footer Bar */}
      <div className="fixed bottom-28 left-6 right-6 z-[60] max-w-md mx-auto">
        <div className="bg-black rounded-[2.5rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-accent/40 flex items-center relative overflow-hidden ring-4 ring-black/50 group active:scale-95 transition-transform">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-accent shadow-[0_0_15px_rgba(182,242,59,0.5)]"></div>
          <div className="flex items-center gap-4 flex-1">
            <span className="text-2xl font-black text-accent font-numbers w-10 text-center">{myRank}</span>
            <div className="size-14 rounded-full border-2 border-accent overflow-hidden">
              <img src={me?.avatar} className="w-full h-full object-cover" alt="Me" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-white font-extrabold text-base font-label truncate">Tú ({me?.name})</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1 w-20 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-accent animate-pulse" style={{ width: '65%' }}></div>
                </div>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Prox. nivel</span>
              </div>
            </div>
          </div>
          <div className="text-right pl-4">
            <p className="text-2xl font-black text-white font-numbers tracking-tighter tabular-nums">
              {rankingType === 'constancia' ? `${me?.streak}d` : me?.performance}
            </p>
            <div className="flex items-center justify-end gap-1 text-accent animate-bounce">
              <span className="material-symbols-outlined text-xs font-bold">stat_1</span>
              <span className="text-[9px] font-bold uppercase tracking-widest font-label">Subiendo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
