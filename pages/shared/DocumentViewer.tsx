
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DocumentViewer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;

  // Simulate document content based on screenshot
  const documentName = "Training_Plan_Week_4.pdf";
  const documentSize = "2.4 MB";

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#e5e7eb] dark:bg-[#0f120a] animate-in fade-in duration-300">
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-black/90 backdrop-blur-md z-50 border-b border-gray-200 dark:border-white/10 pt-12 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-black dark:text-white transition-colors"
        >
          <span className="material-symbols-outlined !text-[28px]">close</span>
        </button>
        
        <div className="flex-1 text-center px-4 overflow-hidden">
          <h1 className="text-black dark:text-white text-xs font-bold tracking-widest uppercase truncate font-label">
            {documentName}
          </h1>
          <p className="text-[10px] text-gray-500 font-nums mt-0.5">{documentSize} • {totalPages} Pages</p>
        </div>

        <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-black dark:text-white">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      {/* Loading Bar Simulation */}
      <div className="h-1 w-full bg-gray-100 dark:bg-zinc-800">
        <div className="h-full bg-accent w-full shadow-[0_0_10px_var(--accent-color)]" style={{ width: '100%' }}></div>
      </div>

      {/* Main Canvas */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col items-center gap-12 relative pb-48">
        {/* Page 1 (The one from the screenshot) */}
        <div className="w-full max-w-[500px] bg-white aspect-[3/4.2] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm relative overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
          <div className="absolute inset-0 p-10 flex flex-col gap-8">
            {/* Doc Header */}
            <div className="w-full flex justify-between items-end border-b-2 border-black pb-5">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-4xl font-black text-black uppercase tracking-tightest leading-none font-label">Hypertrophy</h2>
                <span className="text-[10px] font-bold bg-accent text-black px-3 py-1 w-fit rounded uppercase tracking-widest font-label">Week 4 / Cycle B</span>
              </div>
              <div className="text-right flex flex-col gap-0.5">
                <p className="text-[9px] font-bold text-gray-400 font-label tracking-widest">ATHLETE: ALEX D.</p>
                <p className="text-[9px] font-bold text-gray-400 font-label tracking-widest">COACH: SARAH M.</p>
              </div>
            </div>

            {/* Content Table Simulation */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="font-extrabold text-black text-sm font-label uppercase tracking-wide">Day 1: Legs & Core</span>
                <span className="material-symbols-outlined text-black text-xl">fitness_center</span>
              </div>

              <div className="space-y-4 mt-2">
                {[
                  { id: 'A1', name: 'Back Squat (Tempo 3010)', sets: '4 x 6', load: '82.5kg' },
                  { id: 'B1', name: 'Romanian Deadlift', sets: '3 x 8', load: '100kg' },
                  { id: 'C1', name: 'Walking Lunges', sets: '3 x 12', load: '20kg' },
                  { id: 'D1', name: 'Leg Extensions', sets: '3 x 15', load: '55kg' },
                ].map((row) => (
                  <div key={row.id} className="flex items-center gap-5 text-xs border-b border-gray-100 pb-3 group">
                    <span className="w-10 font-bold text-black font-label text-sm">{row.id}</span>
                    <span className="flex-1 text-black font-medium font-sans">{row.name}</span>
                    <span className="text-gray-500 font-nums w-12 text-right">{row.sets}</span>
                    <span className="text-black font-extrabold font-nums w-16 text-right">{row.load}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Area Simulation */}
            <div className="mt-auto h-32 w-full bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden flex items-end justify-between px-6 pb-4 gap-3">
              {[40, 75, 55, 90, 80].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md transition-all duration-1000" style={{ height: `${h}%`, backgroundColor: i % 2 === 0 ? '#111' : 'var(--accent-color)' }}></div>
              ))}
            </div>
          </div>
          {/* Page Indicator Tag */}
          <div className="absolute bottom-4 right-4 text-[9px] font-bold text-gray-300 font-nums tracking-widest uppercase">Page 1</div>
        </div>

        {/* Subsequent Pages (Simplified) */}
        <div className="w-full max-w-[500px] bg-white aspect-[3/4.2] shadow-xl rounded-sm opacity-60 flex flex-col p-10 gap-8">
           <div className="w-1/3 h-4 bg-gray-100 rounded"></div>
           <div className="space-y-4">
              <div className="w-full h-12 bg-gray-50 rounded"></div>
              <div className="w-full h-1 bg-gray-100 rounded"></div>
              <div className="w-full h-1 bg-gray-100 rounded"></div>
              <div className="w-full h-1 bg-gray-100 rounded"></div>
           </div>
        </div>
      </main>

      {/* Floating Footer Controls */}
      <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[500px] bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-white/20 z-[110] animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col gap-6">
          {/* Scrubber */}
          <div className="flex items-center gap-5">
            <span className="text-[10px] font-bold text-gray-400 font-nums">1</span>
            <div className="relative flex-1 h-1.5 flex items-center group cursor-pointer">
              <div className="absolute inset-0 bg-gray-100 dark:bg-white/5 rounded-full"></div>
              <div className="absolute inset-y-0 left-0 bg-accent rounded-full shadow-[0_0_8px_var(--accent-color)]" style={{ width: `${(currentPage / totalPages) * 100}%` }}></div>
              <div 
                className="absolute size-5 bg-white dark:bg-black border-2 border-accent rounded-full shadow-xl transition-transform group-hover:scale-110 flex items-center justify-center"
                style={{ left: `${(currentPage / totalPages) * 100}%`, transform: 'translateX(-50%)' }}
              >
                <div className="size-1 bg-accent rounded-full"></div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 font-nums">{totalPages}</span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="size-11 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5 text-black dark:text-white hover:bg-accent hover:text-black transition-all disabled:opacity-30 active:scale-90"
              >
                <span className="material-symbols-outlined !text-[24px]">chevron_left</span>
              </button>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="size-11 flex items-center justify-center rounded-2xl bg-black dark:bg-accent text-accent dark:text-black shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
              >
                <span className="material-symbols-outlined !text-[24px] font-bold">chevron_right</span>
              </button>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm font-extrabold text-black dark:text-white font-label">Page {currentPage} of {totalPages}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] font-label mt-0.5">Scroll to Read</span>
            </div>

            <button className="size-11 flex items-center justify-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-colors">
              <span className="material-symbols-outlined !text-[24px]">fit_screen</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentViewer;
