
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import AthleteHome from './pages/athlete/AthleteHome';
import AthleteStats from './pages/athlete/AthleteStats';
import GapAnalysis from './pages/athlete/GapAnalysis';
import SessionDetails from './pages/athlete/SessionDetails';
import SessionLogging from './pages/athlete/SessionLogging';
import Diario from './pages/athlete/Diario';
import Rankings from './pages/athlete/Rankings';
import AthleteProfile from './pages/athlete/AthleteProfile';
import ShoeManagement from './pages/athlete/ShoeManagement';
import ShoeDetail from './pages/athlete/ShoeDetail';
import MiCarpeta from './pages/athlete/MiCarpeta';
import Settings from './pages/athlete/Settings';
import AthleteRegistration from './pages/athlete/AthleteRegistration';
import AthleteNotifications from './pages/athlete/AthleteNotifications';
import AthleteTutorial from './pages/athlete/AthleteTutorial';
import InjuryDetail from './pages/athlete/InjuryDetail';
import CoachDashboard from './pages/coach/CoachDashboard';
import CoachAthletes from './pages/coach/CoachAthletes';
import CoachAthleteProfile from './pages/coach/CoachAthleteProfile';
import CoachAthletePerformance from './pages/coach/CoachAthletePerformance';
import CoachAthleteTechnicalHistory from './pages/coach/CoachAthleteTechnicalHistory';
import CoachInviteAthletes from './pages/coach/CoachInviteAthletes';
import CoachPlanning from './pages/coach/CoachPlanning';
import CoachPlanUpload from './pages/coach/CoachPlanUpload';
import CoachPlanEdit from './pages/coach/CoachPlanEdit';
import CoachGestionCompeticiones from './pages/coach/CoachGestionCompeticiones';
import CoachCompetitionDetail from './pages/coach/CoachCompetitionDetail';
import CoachAnalysis from './pages/coach/CoachAnalysis';
import CoachDailyLogs from './pages/coach/CoachDailyLogs';
import CoachGroupDetails from './pages/coach/CoachGroupDetails';
import CoachSettings from './pages/coach/CoachSettings';
import CoachIntegrations from './pages/coach/CoachIntegrations';
import CoachAlertConfig from './pages/coach/CoachAlertConfig';
import CoachNotifications from './pages/coach/CoachNotifications';
import CoachTutorial from './pages/coach/CoachTutorial';
import DocumentViewer from './pages/shared/DocumentViewer';
import WelcomeSuccess from './pages/shared/WelcomeSuccess';
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AthleteOnboarding from './pages/athlete/AthleteOnboarding';
import CoachOnboarding from './pages/coach/CoachOnboarding';
import { UserRole } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
    '182, 242, 59';
};

export type Language = 'es' | 'en';

export const translations = {
  es: {
    home: 'Inicio',
    stats: 'Estadísticas',
    diary: 'Diario',
    ranking: 'Ranking',
    profile: 'Perfil',
    settings: 'Ajustes',
    language: 'Idioma',
    theme: 'Modo Oscuro',
    accent: 'Color de Acento',
    logout: 'Cerrar Sesión',
    dashboard: 'Panel',
    athletes: 'Atletas',
    planning: 'Planificación',
    analysis: 'Análisis',
    management: 'Gestión',
    notifications: 'Notificaciones',
    folder: 'Carpeta'
  },
  en: {
    home: 'Home',
    stats: 'Statistics',
    diary: 'Diary',
    ranking: 'Ranking',
    profile: 'Profile',
    settings: 'Settings',
    language: 'Language',
    theme: 'Dark Mode',
    accent: 'Accent Color',
    logout: 'Log Out',
    dashboard: 'Dashboard',
    athletes: 'Athletes',
    planning: 'Planning',
    analysis: 'Analysis',
    management: 'Management',
    notifications: 'Notifications',
    folder: 'Folder'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['es']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  accentColor: string;
  setTheme: (theme: ThemeMode) => void;
  setDarkMode: (dark: boolean) => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, user, role: dbRole, loading, signOut } = useAuth();

  // Developer Mode State
  const [devMode, setDevMode] = useState(() => localStorage.getItem('devMode') !== 'false');
  const [devBypassAuth, setDevBypassAuth] = useState(() => localStorage.getItem('devBypassAuth') !== 'false');
  const [devRole, setDevRole] = useState<UserRole>(() => (localStorage.getItem('devRole') as UserRole) || 'ATHLETE');

  useEffect(() => {
    localStorage.setItem('devMode', devMode.toString());
    localStorage.setItem('devBypassAuth', devBypassAuth.toString());
    localStorage.setItem('devRole', devRole);
  }, [devMode, devBypassAuth, devRole]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') {
        setDevMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Local state for Pre-Auth flow (picking role before login/signup)
  const [preAuthRole, setPreAuthRole] = useState<UserRole | null>(() => localStorage.getItem('userRole') as UserRole || null);

  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('theme') as ThemeMode) || 'dark');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accentColor') || '#B6F23B');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'es');
  const [isActualDark, setIsActualDark] = useState(false);

  useEffect(() => {
    const checkIsDark = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return theme === 'dark';
    };

    const applyTheme = () => {
      const dark = checkIsDark();
      setIsActualDark(dark);
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-rgb', hexToRgb(accentColor));
    document.documentElement.style.setProperty('--accent-dim', accentColor + 'CC');
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  // Handle local role selection (Pre-Auth)
  const handleSetPreAuthRole = (newRole: UserRole | null) => {
    setPreAuthRole(newRole);
    if (newRole) localStorage.setItem('userRole', newRole);
    else {
      localStorage.removeItem('userRole');
    }
  };

  // Sync preAuthRole with session state to ensure clean logout/login
  useEffect(() => {
    if (!session && preAuthRole) {
      // If session is lost (logout), we stay in the current role unless session was explicitly ended via handleLogout
    }
  }, [session, preAuthRole]);

  const handleLogout = async () => {
    await signOut();
    setPreAuthRole(null);
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const t = (key: keyof typeof translations['es']) => translations[language][key] || key;
  const themeValue = {
    theme,
    isDarkMode: isActualDark,
    accentColor,
    setTheme,
    setDarkMode: (dark: boolean) => setTheme(dark ? 'dark' : 'light'),
    setAccentColor
  };
  const languageValue = { language, setLanguage, t };

  // Redirect to welcome if not seen in this session
  useEffect(() => {
    if (user && !loading) {
      const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome && location.pathname !== '/welcome' && location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/welcome', { replace: true });
      }
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-accent font-bold animate-pulse">Cargando TrainingDiary...</div>
      </div>
    );
  }

  // Determine active role: Database Role takes precedence if authenticated
  // Use a fallback to preAuthRole if dbRole (from useAuth) is not yet available
  const effectiveRole: UserRole = (devMode ? devRole : (session ? (dbRole || preAuthRole || 'ATHLETE') : (preAuthRole || 'ATHLETE'))) as UserRole;
  const isAuth = devMode ? devBypassAuth : !!session;

  return (
    <ThemeContext.Provider value={themeValue}>
      <LanguageContext.Provider value={languageValue}>
        {devMode && (
          <div className="fixed top-4 right-4 z-[9999] bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl text-white font-sans text-xs min-w-[200px] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <span className="font-bold text-accent uppercase tracking-widest">Dev Menu</span>
              <button onClick={() => setDevMode(false)} className="text-white/40 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-white/70 group-hover:text-white transition-colors">Bypass Auth</span>
                <input
                  type="checkbox"
                  checked={devBypassAuth}
                  onChange={(e) => setDevBypassAuth(e.target.checked)}
                  className="h-4 w-4 bg-transparent border-white/20 rounded focus:ring-0 checked:bg-accent"
                />
              </label>
              <div className="flex flex-col gap-1">
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Active Role</span>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <button
                    onClick={() => setDevRole('ATHLETE')}
                    className={`py-1.5 rounded-lg font-bold border transition-all ${devRole === 'ATHLETE' ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20 hover:border-white/40'}`}
                  >
                    ATHLETE
                  </button>
                  <button
                    onClick={() => setDevRole('COACH')}
                    className={`py-1.5 rounded-lg font-bold border transition-all ${devRole === 'COACH' ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20 hover:border-white/40'}`}
                  >
                    COACH
                  </button>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 text-[9px] text-white/30 text-center uppercase tracking-tighter">
                Press Shift + D to toggle
              </div>
            </div>
          </div>
        )}
        {!isAuth ? (
          // Unauthenticated Flow
          !preAuthRole ? (
            <RoleSelection onSelect={handleSetPreAuthRole} />
          ) : (
            <Routes>
              <Route path="/login" element={<Login onLogin={() => { }} onBack={() => handleSetPreAuthRole(null)} onRegister={() => handleSetPreAuthRole(null)} />} />
              <Route path="/signup" element={<Signup onBack={() => handleSetPreAuthRole(null)} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )
        ) : (
          // Authenticated Flow
          <Layout role={effectiveRole} onSwitchRole={() => handleSetPreAuthRole(null)} onLogout={handleLogout}>
            <Routes>
              {effectiveRole === 'ATHLETE' ? (
                <>
                  <Route path="/" element={<AthleteHome />} />
                  <Route path="/stats" element={<AthleteStats />} />
                  <Route path="/gap-analysis" element={<GapAnalysis />} />
                  <Route path="/session/:id" element={<SessionDetails />} />
                  <Route path="/log-session/:id" element={<SessionLogging />} />
                  <Route path="/log-session" element={<SessionLogging />} />
                  <Route path="/diario" element={<Diario />} />
                  <Route path="/rankings" element={<Rankings />} />
                  <Route path="/profile" element={<AthleteProfile />} />
                  <Route path="/injury/:id" element={<InjuryDetail />} />
                  <Route path="/shoes" element={<ShoeManagement />} />
                  <Route path="/shoes/:id" element={<ShoeDetail />} />
                  <Route path="/carpeta" element={<MiCarpeta />} />
                  <Route path="/viewer/:id" element={<DocumentViewer />} />
                  <Route path="/tutorial" element={<AthleteTutorial />} />
                  <Route path="/welcome" element={<WelcomeSuccess role="Atleta" />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/notifications" element={<AthleteNotifications />} />
                  <Route path="/registration" element={<AthleteRegistration />} />
                  {/* Onboarding routes should probably be restricted or handled differently if auth is done */}
                  <Route path="/onboarding/athlete" element={<AthleteOnboarding onComplete={() => navigate('/')} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<CoachDashboard />} />
                  <Route path="/athletes" element={<CoachAthletes />} />
                  <Route path="/athletes/:id" element={<CoachAthleteProfile />} />
                  <Route path="/athletes/:id/performance" element={<CoachAthletePerformance />} />
                  <Route path="/athletes/:id/technical-history" element={<CoachAthleteTechnicalHistory />} />
                  <Route path="/athletes/invite" element={<CoachInviteAthletes />} />
                  <Route path="/planning" element={<CoachPlanning />} />
                  <Route path="/planning/upload" element={<CoachPlanUpload />} />
                  <Route path="/planning/edit/:id" element={<CoachPlanEdit />} />
                  <Route path="/management/groups/:id" element={<CoachGroupDetails />} />
                  <Route path="/management/competitions" element={<CoachGestionCompeticiones />} />
                  <Route path="/planning/competition-detail" element={<CoachCompetitionDetail />} />
                  <Route path="/management/daily-logs" element={<CoachDailyLogs />} />
                  <Route path="/analysis" element={<CoachAnalysis />} />
                  <Route path="/viewer/:id" element={<DocumentViewer />} />
                  <Route path="/welcome" element={<WelcomeSuccess role="Coach" />} />
                  <Route path="/settings" element={<CoachSettings />} />
                  <Route path="/settings/integrations" element={<CoachIntegrations />} />
                  <Route path="/settings/alerts" element={<CoachAlertConfig />} />
                  <Route path="/notifications" element={<CoachNotifications />} />
                  <Route path="/tutorial" element={<CoachTutorial />} />
                  <Route path="/onboarding/coach" element={<CoachOnboarding onComplete={() => navigate('/')} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </Layout>
        )}
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
