
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserRole } from '../types';
import { useLanguage } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onSwitchRole: () => void;
  onLogout: () => void;
}

interface NavItem {
  icon: string;
  label: string;
  path: string;
  isCenter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onSwitchRole, onLogout }) => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isSpecialPage = 
    location.pathname === '/welcome' || 
    location.pathname === '/register-invite' ||
    location.pathname === '/tutorial' ||
    location.pathname.startsWith('/viewer');

  const athleteNav: NavItem[] = [
    { icon: 'home', label: t('home'), path: '/' },
    { icon: 'bar_chart', label: t('stats'), path: '/stats' },
    { icon: 'edit', label: t('diary'), path: '/diario', isCenter: true },
    { icon: 'trophy', label: t('ranking'), path: '/rankings' },
    { icon: 'person', label: t('profile'), path: '/profile' },
  ];

  const coachNav: NavItem[] = [
    { icon: 'grid_view', label: 'Dash', path: '/' },
    { icon: 'directions_run', label: t('athletes'), path: '/athletes' },
    { icon: 'calendar_month', label: t('planning'), path: '/planning', isCenter: true },
    { icon: 'analytics', label: t('analysis'), path: '/analysis' },
    { icon: 'settings', label: t('management'), path: '/settings' },
  ];

  const navItems = role === 'ATHLETE' ? athleteNav : coachNav;

  return (
    <div className="min-h-screen bg-bg-app flex flex-col max-w-md mx-auto relative border-x border-gray-100 dark:border-zinc-900 shadow-sm overflow-x-hidden transition-colors duration-300">
      <main className={`flex-1 ${!isSpecialPage ? 'pb-32' : ''}`}>
        {children}
      </main>

      {/* Floating Navigation Bar */}
      {!isSpecialPage && (
        <nav className="fixed bottom-8 z-50 w-[calc(100%-3rem)] max-w-[380px] left-1/2 -translate-x-1/2 animate-in slide-in-from-bottom-4 duration-500">
          <div className="relative flex items-center justify-around h-16 px-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl rounded-full border border-white/30 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] ring-1 ring-black/5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              if (item.isCenter) {
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="relative -top-4 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isActive ? 'bg-accent text-black ring-4 ring-bg-app' : 'bg-black dark:bg-white text-white dark:text-black ring-4 ring-bg-app'}`}>
                      <span className={`material-symbols-outlined text-2xl ${isActive ? 'icon-fill' : ''}`}>
                        {item.icon}
                      </span>
                    </div>
                  </NavLink>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center w-12 h-12 group"
                >
                  <span 
                    className={`material-symbols-outlined text-[28px] transition-all duration-300 relative z-10 ${isActive ? 'text-accent scale-110 icon-fill' : 'text-gray-400 group-hover:text-text-primary'}`}
                  >
                    {item.icon}
                  </span>

                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_var(--accent-color)] animate-in zoom-in duration-300" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}

      {/* Switch Role Debug (Opacidad casi cero para no molestar) */}
      <button 
        onClick={onSwitchRole}
        className="fixed top-4 right-4 z-[60] bg-widget/10 text-accent/20 text-[7px] px-2 py-1 rounded-full font-bold hover:bg-widget hover:text-accent hover:opacity-100 transition-all opacity-10"
      >
        SW
      </button>
    </div>
  );
};

export default Layout;
