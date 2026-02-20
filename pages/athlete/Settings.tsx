
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, useLanguage } from '../../App';
import { useAuth } from '../../context/AuthContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, isDarkMode, accentColor, setDarkMode, setAccentColor } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { signOut } = useAuth();

  const accentColors = [
    '#B6F23B', '#4DA3FF', '#B18CFF', '#FF6B6B', '#FFA94D',
    '#3DDC97', '#3EDBF0', '#D6CDB8', '#FFE066', '#FF5D8F'
  ];

  const handleLogoutAction = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-md min-h-screen relative flex flex-col pb-20 bg-background-light animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-black/5 pt-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 transition-colors group"
        >
          <span className="material-symbols-outlined text-black group-hover:text-black/70" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-black absolute left-1/2 -translate-x-1/2 font-sans">{t('settings')}</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 px-5 pt-6 space-y-8">
        {/* Personalización */}
        <section>
          <h2 className="text-xs font-bold text-black/60 uppercase tracking-widest mb-3 ml-1 font-sans">{t('management').toUpperCase()}</h2>
          <div className="bg-black rounded-2xl p-5 shadow-lg shadow-black/5">
            <div className="mb-5">
              <span className="text-white font-medium text-base font-sans block">{t('accent')}</span>
              <p className="text-white/50 text-sm mt-1 font-serif leading-relaxed">Selecciona el color principal para resaltar elementos interactivos.</p>
            </div>
            <div className="grid grid-cols-5 gap-y-5 gap-x-2 justify-items-center">
              {accentColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  style={{ backgroundColor: color }}
                  className={`relative size-10 rounded-full transition-transform hover:scale-110 ${accentColor === color ? 'ring-2 ring-offset-2 ring-offset-black ring-white' : ''}`}
                >
                  {accentColor === color && (
                    <span className="sr-only">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Preferencias */}
        <section>
          <h2 className="text-xs font-bold text-black/60 uppercase tracking-widest mb-3 ml-1 font-sans">Preferencias</h2>
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg shadow-black/5">
            {/* Idioma Selector */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center size-8 rounded-full bg-white/10 text-white">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>language</span>
                </div>
                <span className="text-white font-medium text-base font-sans">{t('language')}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-1 flex h-11 border border-white/5">
                <button
                  onClick={() => setLanguage('es')}
                  className={`flex-1 flex items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${language === 'es' ? 'bg-accent text-black' : 'text-gray-400'}`}
                >
                  Español
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 flex items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${language === 'en' ? 'bg-accent text-black' : 'text-gray-400'}`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center size-8 rounded-full bg-white/10 text-white">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>dark_mode</span>
                </div>
                <span className="text-white font-medium text-base font-sans">{t('theme')}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-1 flex h-11 border border-white/5">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${theme === 'light' ? 'bg-accent text-black' : 'text-gray-400'}`}
                >
                  Claro
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex-1 flex items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${theme === 'system' ? 'bg-accent text-black' : 'text-gray-400'}`}
                >
                  Auto
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-accent text-black' : 'text-gray-400'}`}
                >
                  Oscuro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Soporte */}
        <section>
          <h2 className="text-xs font-bold text-black/60 uppercase tracking-widest mb-3 ml-1 font-sans">Soporte</h2>
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg shadow-black/5">
            <div className="flex items-center justify-between p-4 min-h-[64px] border-b border-white/10 group active:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 rounded-full bg-white/10 text-white">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>help</span>
                </div>
                <span className="text-white font-medium text-base font-sans">Ayuda y Soporte</span>
              </div>
              <span className="material-symbols-outlined text-white/30" style={{ fontSize: '20px' }}>open_in_new</span>
            </div>
          </div>
        </section>

        <button
          onClick={handleLogoutAction}
          className="w-full bg-black/5 rounded-2xl p-5 flex items-center justify-center gap-2 group active:bg-red-50 transition-colors mt-4"
        >
          <span className="material-symbols-outlined text-black group-active:text-red-600 transition-colors" style={{ fontSize: '20px' }}>logout</span>
          <span className="text-black font-bold text-sm uppercase tracking-widest font-sans group-active:text-red-600 transition-colors">{t('logout')}</span>
        </button>

        <div className="text-center py-6">
          <p className="text-[10px] text-black/40 font-bold font-serif tracking-[0.2em] uppercase">TrainingDiary v2.5.0</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
