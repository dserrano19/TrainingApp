
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  subtitle?: string;
  time?: string;
  link?: { label: string; type: string };
  completed: boolean;
}

const SessionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Local state for checkboxes
  const [taskStatus, setTaskStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) fetchSession();
  }, [id]);

  const fetchSession = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching session:', error);
    } else {
      setSession(data);
      const initialStatus: Record<string, boolean> = {};
      data.blocks?.forEach((block: any) => {
        block.tasks?.forEach((task: any) => {
          initialStatus[task.id] = task.isCompleted;
        });
      });
      setTaskStatus(initialStatus);
    }
    setLoading(false);
  };

  const toggleTask = (taskId: string) => {
    setTaskStatus(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  if (loading) return <div className="min-h-screen bg-bg-app flex items-center justify-center text-accent">Cargando sesión...</div>;
  if (!session) return <div className="min-h-screen bg-bg-app flex flex-col items-center justify-center text-center p-8"><span className="material-symbols-outlined text-6xl text-white/20 mb-4">bedtime</span><p className="text-white font-bold uppercase tracking-widest text-xs font-label">nada programado por ahora, avisa a tu entrenador</p></div>;

  const dateObj = new Date(session.date);
  const formattedDate = dateObj.toLocaleDateString('es-ES', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-300 pb-40">
      {/* Header Estilo Apple/Elite */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-light flex items-center justify-between px-4 h-14 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-gray-100 transition-colors rounded-full"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-label">Detalles de Sesión</span>
        <button className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-gray-100 transition-colors rounded-full">
          <span className="material-symbols-outlined text-xl">more_horiz</span>
        </button>
      </header>

      {/* Título Principal */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-black mb-2 font-label">{formattedDate}</h1>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 border border-gray-200 text-black font-label tracking-widest">{session.type || 'Training'}</span>
          <span className="text-[11px] font-medium text-text-muted font-label">{session.title}</span>
        </div>
      </div>

      {/* Grid de Info Key (Widgets Negros) */}
      <div className="mx-6 grid grid-cols-2 gap-2 mb-8">
        <div className="bg-widget rounded-xl p-5 flex flex-col justify-between h-24 shadow-sm">
          <div className="flex items-center gap-2 text-text-muted-inv mb-1">
            <span className="material-symbols-outlined text-base text-accent">location_on</span>
            <span className="text-[10px] uppercase font-bold tracking-wider font-label">Lugar</span>
          </div>
          <span className="text-sm font-semibold text-white font-label">{session.location || 'Not specified'}</span>
        </div>
        <div className="bg-widget rounded-xl p-5 flex flex-col justify-between h-24 shadow-sm">
          <div className="flex items-center gap-2 text-text-muted-inv mb-1">
            <span className="material-symbols-outlined text-base text-accent">schedule</span>
            <span className="text-[10px] uppercase font-bold tracking-wider font-label">Hora</span>
          </div>
          <span className="text-sm font-semibold text-white font-numbers tabular-nums">{session.duration || '--:--'}</span>
        </div>
      </div>

      {/* Nota del Coach */}
      <div className="px-6 mb-8">
        <div className="relative pl-6 border-l-2 border-accent">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded-full bg-cover bg-center ring-1 ring-gray-200" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvCnOZww3Dw_r--Uj__3b1vagdxmxbatVbheRI-8IJj0yGFQAO0yRjO69C8m-Na_Qy1J4urG_uV3pXyzKY2leUan26H8oRkrTfQuRnJNR78r9l8DGu2FhKcYdiTVwaCCuq6Z9kwS0JwRRcJthqmwQgq6KUvyN0FdlX_hd_IJk1Ct6CA5_5KDajySzJRJn5DQQZJY3w-PdLhkOsKaqwsBACl2J1ABuGzO1PJ_DriROLeZtjw3qHRYnd34dBCl04jPonnj1rjlTYAg")' }}></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-label">Dice el Coach Rivera</span>
          </div>
          <p className="font-serif italic text-xl leading-relaxed text-black">
            "Focus on explosive drive during the technique block. Keep rest times strict."
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-gray-100 mb-8 mx-auto max-w-[calc(100%-3rem)]"></div>

      {/* Dynamic Session Blocks */}
      {session.blocks?.map((block: any, blockIdx: number) => (
        <section key={blockIdx} className="px-6 mb-8">
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-lg font-bold text-black tracking-tight font-label">{block.title}</h3>
            <span className="text-xs font-nums font-medium text-text-muted bg-gray-100 px-2 py-1 rounded">{block.duration || ''}</span>
          </div>
          <div className="bg-widget rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-border-dark">
              {block.tasks?.map((task: any) => (
                <label key={task.id} className="group flex items-start gap-4 cursor-pointer p-4 hover:bg-widget-hover transition-colors">
                  <div className="relative flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={taskStatus[task.id] || false}
                      onChange={() => toggleTask(task.id)}
                      className="h-5 w-5 rounded border border-gray-600 bg-transparent transition-all focus:ring-0 focus:ring-offset-0 checked:border-accent checked:bg-accent text-black"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className={`text-sm font-medium transition-all ${taskStatus[task.id] ? 'text-white/40 line-through' : 'text-white'}`}>{task.description}</p>
                        {task.note && <p className="text-xs text-text-muted-inv mt-1 font-serif italic">{task.note}</p>}
                      </div>
                      {task.link && (
                        <div className="flex items-center gap-1 pl-2 pr-1.5 py-1 rounded bg-surface-inner text-accent border border-white/10">
                          <span className="text-[9px] font-bold uppercase tracking-wider font-label">{task.link.label}</span>
                          <span className="material-symbols-outlined text-[12px]">arrow_outward</span>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Botón de Acción Principal (Registrar Datos de ejecución) */}
      <div className="fixed bottom-28 left-0 right-0 px-6 z-40 max-w-md mx-auto">
        <button
          onClick={() => navigate(`/log-session/${session.id}`)}
          className="w-full flex items-center justify-center gap-2 bg-widget hover:bg-black text-accent font-bold py-5 rounded-2xl shadow-2xl transition-all active:scale-[0.98] border border-border-widget"
        >
          <span className="material-symbols-outlined text-[20px] text-accent font-bold">check_circle</span>
          <span className="text-xs uppercase tracking-[0.2em] font-bold font-label">Rellenar Datos de Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default SessionDetails;
