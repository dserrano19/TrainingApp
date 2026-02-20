

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface AlertSettings {
  painThreshold: number;
  painEnabled: boolean;
  injuryRiskThreshold: number;
  injuryRiskEnabled: boolean;
  absenceDays: number;
  absenceEnabled: boolean;
  missingFeedbackSessions: number;
  missingFeedbackEnabled: boolean;
}

const CoachAlertConfig: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState<AlertSettings>({
    painThreshold: 8,
    painEnabled: true,
    injuryRiskThreshold: 15,
    injuryRiskEnabled: true,
    absenceDays: 3,
    absenceEnabled: false,
    missingFeedbackSessions: 2,
    missingFeedbackEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('coach_alert_settings')
      .select('*')
      .eq('coach_id', user.id)
      .single();

    if (data) {
      setSettings({
        painThreshold: data.pain_threshold,
        painEnabled: data.pain_enabled,
        injuryRiskThreshold: data.injury_risk_threshold,
        injuryRiskEnabled: data.injury_risk_enabled,
        absenceDays: data.absence_days,
        absenceEnabled: data.absence_enabled,
        missingFeedbackSessions: data.missing_feedback_sessions,
        missingFeedbackEnabled: data.missing_feedback_enabled,
      });
    } else if (error && error.code !== 'PGRST116') {
      console.error('Error fetching alert settings:', error);
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('coach_alert_settings')
      .upsert({
        coach_id: user.id,
        pain_threshold: settings.painThreshold,
        pain_enabled: settings.painEnabled,
        injury_risk_threshold: settings.injuryRiskThreshold,
        injury_risk_enabled: settings.injuryRiskEnabled,
        absence_days: settings.absenceDays,
        absence_enabled: settings.absenceEnabled,
        missing_feedback_sessions: settings.missingFeedbackSessions,
        missing_feedback_enabled: settings.missingFeedbackEnabled,
      }, { onConflict: 'coach_id' });

    if (error) {
      console.error('Error saving alert settings:', error);
      alert('Error al guardar la configuración: ' + error.message);
    } else {
      // Show success feedback
      alert('Configuración guardada exitosamente');
      navigate(-1);
    }
    setSaving(false);
  };

  const toggle = (key: keyof AlertSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateVal = (key: keyof AlertSettings, val: number) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-app/95 backdrop-blur-md border-b border-widget-border/10 px-4 pt-12 pb-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight flex-1 text-center pr-10 font-label text-text-primary">Configuración de Alertas</h1>
      </header>

      <main className="flex-1 flex flex-col gap-8 p-6 max-w-md mx-auto w-full">
        {/* Section: Bienestar Físico */}
        <section className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold tracking-tight px-1 font-label text-text-primary">Bienestar Físico</h2>

          {/* Card: Dolor Crítico */}
          <article className="bg-white dark:bg-widget rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-widget-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 icon-fill">medical_services</span>
                  <h3 className="font-bold text-lg text-text-primary font-label leading-none">Dolor Crítico</h3>
                </div>
                <p className="font-serif italic text-text-secondary text-sm leading-relaxed">Notificar cuando el reporte de dolor subjetivo supere el umbral.</p>
              </div>
              <button
                onClick={() => toggle('painEnabled')}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ease-in-out flex items-center px-1 shrink-0 ${settings.painEnabled ? 'bg-black dark:bg-accent' : 'bg-gray-200 dark:bg-white/10'}`}
              >
                <div className={`size-5 rounded-full shadow-sm transition-transform duration-200 ${settings.painEnabled ? 'translate-x-5 bg-accent dark:bg-black' : 'translate-x-0 bg-white dark:bg-gray-500'}`}></div>
              </button>
            </div>

            <div className={`mt-6 transition-opacity duration-300 ${settings.painEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-label">Umbral (Escala 1-10)</span>
                <span className="text-lg font-bold font-numbers bg-accent/20 text-black dark:text-accent px-3 py-0.5 rounded-lg">{settings.painThreshold}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.painThreshold}
                onChange={(e) => updateVal('painThreshold', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-numbers font-bold">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </article>

          {/* Card: Riesgo de Lesión */}
          <article className="bg-white dark:bg-widget rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-widget-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500 icon-fill">warning</span>
                  <h3 className="font-bold text-lg text-text-primary font-label leading-none">Riesgo de Lesión</h3>
                </div>
                <p className="font-serif italic text-text-secondary text-sm leading-relaxed">Alerta basada en aumento repentino de carga aguda vs crónica.</p>
              </div>
              <button
                onClick={() => toggle('injuryRiskEnabled')}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ease-in-out flex items-center px-1 shrink-0 ${settings.injuryRiskEnabled ? 'bg-black dark:bg-accent' : 'bg-gray-200 dark:bg-white/10'}`}
              >
                <div className={`size-5 rounded-full shadow-sm transition-transform duration-200 ${settings.injuryRiskEnabled ? 'translate-x-5 bg-accent dark:bg-black' : 'translate-x-0 bg-white dark:bg-gray-500'}`}></div>
              </button>
            </div>

            <div className={`mt-6 transition-opacity duration-300 ${settings.injuryRiskEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-label">Incremento de Carga (%)</span>
                <span className="text-lg font-bold font-numbers bg-accent/20 text-black dark:text-accent px-3 py-0.5 rounded-lg">+{settings.injuryRiskThreshold}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={settings.injuryRiskThreshold}
                onChange={(e) => updateVal('injuryRiskThreshold', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
              />
            </div>
          </article>
        </section>

        {/* Section: Adherencia */}
        <section className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold tracking-tight px-1 font-label text-text-primary">Adherencia</h2>

          {/* Card: Ausencia */}
          <article className="bg-white dark:bg-widget rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-widget-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400 icon-fill">person_off</span>
                  <h3 className="font-bold text-lg text-text-primary font-label leading-none">Ausencia Injustificada</h3>
                </div>
                <p className="font-serif italic text-text-secondary text-sm leading-relaxed">Días consecutivos sin registro de actividad o check-in.</p>
              </div>
              <button
                onClick={() => toggle('absenceEnabled')}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ease-in-out flex items-center px-1 shrink-0 ${settings.absenceEnabled ? 'bg-black dark:bg-accent' : 'bg-gray-200 dark:bg-white/10'}`}
              >
                <div className={`size-5 rounded-full shadow-sm transition-transform duration-200 ${settings.absenceEnabled ? 'translate-x-5 bg-accent dark:bg-black' : 'translate-x-0 bg-white dark:bg-gray-500'}`}></div>
              </button>
            </div>

            <div className={`mt-6 flex items-center justify-between transition-opacity duration-300 ${settings.absenceEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-label">Días consecutivos</span>
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-black/40 rounded-xl p-1.5 border border-gray-100 dark:border-white/5">
                <button
                  onClick={() => updateVal('absenceDays', Math.max(1, settings.absenceDays - 1))}
                  className="size-9 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 shadow-sm text-text-primary hover:bg-accent hover:text-black transition-all"
                >
                  <span className="material-symbols-outlined text-base">remove</span>
                </button>
                <span className="text-xl font-bold w-6 text-center font-numbers text-text-primary">{settings.absenceDays}</span>
                <button
                  onClick={() => updateVal('absenceDays', settings.absenceDays + 1)}
                  className="size-9 flex items-center justify-center rounded-lg bg-black dark:bg-accent text-accent dark:text-black shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base font-bold">add</span>
                </button>
              </div>
            </div>
          </article>

          {/* Card: Feedback Faltante */}
          <article className="bg-white dark:bg-widget rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-widget-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent icon-fill">rate_review</span>
                  <h3 className="font-bold text-lg text-text-primary font-label leading-none">Feedback Faltante</h3>
                </div>
                <p className="font-serif italic text-text-secondary text-sm leading-relaxed">Sesiones completadas sin RPE o comentarios.</p>
              </div>
              <button
                onClick={() => toggle('missingFeedbackEnabled')}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ease-in-out flex items-center px-1 shrink-0 ${settings.missingFeedbackEnabled ? 'bg-black dark:bg-accent' : 'bg-gray-200 dark:bg-white/10'}`}
              >
                <div className={`size-5 rounded-full shadow-sm transition-transform duration-200 ${settings.missingFeedbackEnabled ? 'translate-x-5 bg-accent dark:bg-black' : 'translate-x-0 bg-white dark:bg-gray-500'}`}></div>
              </button>
            </div>

            <div className={`mt-6 flex items-center justify-between transition-opacity duration-300 ${settings.missingFeedbackEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-label">Sesiones sin log</span>
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-black/40 rounded-xl p-1.5 border border-gray-100 dark:border-white/5">
                <button
                  onClick={() => updateVal('missingFeedbackSessions', Math.max(1, settings.missingFeedbackSessions - 1))}
                  className="size-9 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 shadow-sm text-text-primary hover:bg-accent hover:text-black transition-all"
                >
                  <span className="material-symbols-outlined text-base">remove</span>
                </button>
                <span className="text-xl font-bold w-6 text-center font-numbers text-text-primary">{settings.missingFeedbackSessions}</span>
                <button
                  onClick={() => updateVal('missingFeedbackSessions', settings.missingFeedbackSessions + 1)}
                  className="size-9 flex items-center justify-center rounded-lg bg-black dark:bg-accent text-accent dark:text-black shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base font-bold">add</span>
                </button>
              </div>
            </div>
          </article>
        </section>

        {/* Save Button */}
        <div className="fixed bottom-28 left-0 right-0 px-6 z-40 max-w-md mx-auto pointer-events-none">
          <button
            onClick={saveSettings}
            disabled={saving || loading}
            className="pointer-events-auto w-full h-16 bg-accent text-black rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-accent/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all font-label disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-xl">{saving ? 'hourglass_empty' : 'save'}</span>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CoachAlertConfig;
