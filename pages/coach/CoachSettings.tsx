
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, useLanguage } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../components/supabaseClient';

const CoachSettings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, isDarkMode, setDarkMode } = useTheme();
  const { signOut, user } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [teamCode, setTeamCode] = useState<string>("");

  React.useEffect(() => {
    if (user) {
      fetchCoachProfile();
    }
  }, [user]);

  const fetchCoachProfile = async () => {
    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    if (prof) {
      setProfile(prof);
      const { data: team } = await supabase
        .from('teams')
        .select('code')
        .eq('coach_id', user!.id)
        .single();
      if (team) setTeamCode(team.code);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-40">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-bg-app/95 backdrop-blur-md border-b border-widget-border/10 px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 transition-colors"
          >
            <span className="material-symbols-outlined text-text-primary text-2xl">arrow_back</span>
          </button>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 transition-colors">
            <span className="material-symbols-outlined text-text-primary text-2xl">help</span>
          </button>
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary mt-4 font-label tracking-tight">Ajustes</h1>
      </header>

      <main className="flex flex-col gap-8 p-4 mt-2">
        {/* Profile Header Card */}
        <section className="w-full bg-widget rounded-[2.5rem] p-8 shadow-2xl border border-widget-border">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div
                className="h-28 w-28 rounded-full border-2 border-accent bg-cover bg-center shadow-lg grayscale"
                style={{ backgroundImage: `url("${profile?.avatar_url || 'https://picsum.photos/id/342/200/200'}")` }}
              ></div>
              <button className="absolute bottom-1 right-1 bg-accent rounded-full p-1.5 border-4 border-widget flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-black text-[14px] font-bold">edit</span>
              </button>
            </div>

            <div className="text-center">
              <h2 className="text-white text-3xl font-extrabold font-label">{profile?.full_name || "Coach"}</h2>
              <p className="text-gray-500 font-medium text-sm mt-1">Head Performance Coach</p>

              <div className="flex gap-2 mt-4 justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent text-[10px] font-bold uppercase tracking-widest">
                  Plan Pro
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  #{teamCode || "----"}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/profile')}
              className="w-full h-14 bg-accent hover:bg-accent-dim text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-accent/20 transition-all active:scale-[0.98]"
            >
              Editar Perfil
            </button>
          </div>
        </section>

        {/* General Settings Section */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-primary text-lg font-extrabold px-1 font-label">General Settings</h3>
          <div className="flex flex-col rounded-[2rem] bg-widget overflow-hidden divide-y divide-white/5 shadow-xl border border-widget-border">
            {/* Push Notifications */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined text-[22px] icon-fill">notifications</span>
                </div>
                <div>
                  <p className="text-white font-bold font-label">Push Notifications</p>
                  <p className="text-gray-500 text-xs font-medium">Daily summaries & alerts</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${notifications ? 'bg-accent' : 'bg-gray-800'}`}
              >
                <div className={`absolute top-1 left-1 size-5 bg-white rounded-full transition-transform duration-200 ${notifications ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>

            {/* Alerts Configuration */}
            <div
              onClick={() => navigate('/settings/alerts')}
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined text-[22px]">notification_important</span>
                </div>
                <div>
                  <p className="text-white font-bold font-label">Alerts Configuration</p>
                  <p className="text-gray-500 text-xs font-medium">Pain thresholds & injury risk</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-700">chevron_right</span>
            </div>

            {/* Units */}
            <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined text-[22px]">straighten</span>
                </div>
                <div>
                  <p className="text-white font-bold font-label">Units</p>
                  <p className="text-gray-500 text-xs font-medium">Preferred measurement system</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Metric (kg, km)</span>
                <span className="material-symbols-outlined text-gray-700">chevron_right</span>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="flex flex-col p-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined text-[22px]">dark_mode</span>
                </div>
                <div>
                  <p className="text-white font-bold font-label">Tema de Aplicación</p>
                  <p className="text-gray-500 text-xs font-medium">Auto detecta o elige manual</p>
                </div>
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

        {/* Group Management Section */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-primary text-lg font-extrabold px-1 font-label">Group Management</h3>
          <div className="flex flex-col rounded-[2rem] bg-widget overflow-hidden divide-y divide-white/5 shadow-xl border border-widget-border">
            <div
              onClick={() => navigate('/athletes/invite')}
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined text-[22px]">group_add</span>
                </div>
                <div>
                  <p className="text-white font-bold font-label">Invite Athletes</p>
                  <p className="text-gray-500 text-xs font-medium">Share code or link</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-700">chevron_right</span>
            </div>
            <div
              onClick={() => navigate('/management/groups/1')}
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined text-[22px]">settings_accessibility</span>
                </div>
                <div>
                  <p className="text-white font-bold font-label">Manage Roster</p>
                  <p className="text-gray-500 text-xs font-medium">Sprint Elite 2024 (12 Atletas)</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-700">chevron_right</span>
            </div>

            {/* Integrations Button */}
            <div
              onClick={() => navigate('/settings/integrations')}
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined text-[22px]">hub</span>
                </div>
                <div>
                  <p className="text-white font-bold font-label">Integrations</p>
                  <p className="text-gray-500 text-xs font-medium">Garmin, Strava, RFEA Manager</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-700">chevron_right</span>
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-primary text-lg font-extrabold px-1 font-label">Account</h3>
          <div className="flex flex-col rounded-[2rem] bg-widget overflow-hidden divide-y divide-white/5 shadow-xl border border-widget-border">
            <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-white font-bold font-label pl-2">Change Password</span>
              <span className="material-symbols-outlined text-gray-600">lock_reset</span>
            </div>
            <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-white font-bold font-label pl-2">Subscription</span>
              <span className="material-symbols-outlined text-gray-600">credit_card</span>
            </div>
            <div
              onClick={() => signOut()}
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-red-500/10 transition-colors group"
            >
              <span className="text-red-400 font-bold font-label pl-2">Sign Out</span>
              <span className="material-symbols-outlined text-red-400/50 group-hover:text-red-400">logout</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoachSettings;
