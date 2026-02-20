import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';



const SessionLogging: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rpe, setRpe] = useState(3);
  const [feedback, setFeedback] = useState('');

  // State for recorded values
  const [records, setRecords] = useState<Record<string, { value?: string, load?: string, rir?: string }>>({});

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
      if (data.rpe) setRpe(data.rpe);
      if (data.feedback) setFeedback(data.feedback);

      const initialRecords: Record<string, any> = {};
      data.blocks?.forEach((block: any) => {
        block.tasks?.forEach((task: any) => {
          initialRecords[task.id] = {
            value: task.note || '', // Assuming value might be stored in note or similar
            load: task.sets?.match(/(\d+)kg/)?.[1] || '', // Rough extraction if available
            rir: '2'
          };
        });
      });
      setRecords(initialRecords);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!id || !session) return;

    // Build the updated blocks with records
    const updatedBlocks = session.blocks.map((block: any) => ({
      ...block,
      tasks: block.tasks.map((task: any) => ({
        ...task,
        isCompleted: true, // Assuming logging means completion
        note: records[task.id]?.value || records[task.id]?.load || task.note
      }))
    }));

    const { error } = await supabase
      .from('sessions')
      .update({
        rpe,
        feedback,
        blocks: updatedBlocks
      })
      .eq('id', id);

    if (error) {
      console.error('Error saving session:', error);
      alert('Error al guardar la sesión');
    } else {
      navigate('/diario');
    }
  };

  const updateRecord = (taskId: string, field: string, value: string) => {
    setRecords(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }));
  };

  if (loading) return <div className="min-h-screen bg-bg-app flex items-center justify-center text-accent">Cargando sesión...</div>;
  if (!session) return <div className="min-h-screen bg-bg-app flex flex-col items-center justify-center text-center p-8"><span className="material-symbols-outlined text-6xl text-white/20 mb-4">bedtime</span><p className="text-white font-bold uppercase tracking-widest text-xs font-label">nada programado por ahora, avisa a tu entrenador</p></div>;

  // Flatten tasks for rendering
  const allTasks = session.blocks?.flatMap((b: any) => b.tasks.map((t: any) => ({ ...t, blockTitle: b.title, blockId: b.id }))) || [];

  const seriesTasks = allTasks.filter((t: any) => t.blockTitle.toLowerCase().includes('serie') || t.description.toLowerCase().includes('m'));
  const strengthTasks = allTasks.filter((t: any) => !t.blockTitle.toLowerCase().includes('serie') && !t.description.toLowerCase().includes('m'));

  return (
    <div className="relative flex flex-col h-screen w-full max-w-md mx-auto bg-bg-app overflow-hidden animate-in slide-in-from-bottom duration-500">
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-5 py-4 bg-white/95 backdrop-blur-md border-b border-border-light z-20 pt-12">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center -ml-2 w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-text-muted"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-text-primary leading-tight">{session.title}</h1>
            <span className="text-[10px] font-bold text-accent-dim uppercase tracking-widest">ACTIVO</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="text-sm font-bold text-text-primary hover:text-accent-dim transition-colors px-4 py-2"
        >
          Guardar
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pb-32">
        {/* Dynamic Section: Running / Swimming / Series */}
        {seriesTasks.length > 0 && (
          <section className="mt-6 px-5">
            <div className="pb-4 flex justify-between items-end">
              <div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-[0.15em] mb-1 font-label">Registro de series</h3>
                <p className="text-text-muted text-[11px] font-medium">Introduce los tiempos registrados</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-border-light shadow-sm divide-y divide-border-light">
              {seriesTasks.map((task: any, index: number) => (
                <div key={task.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-6 h-6 rounded bg-accent/10 text-accent-dim text-[10px] font-bold font-numbers">{index + 1}</span>
                      <span className="text-sm font-medium text-text-muted">{task.description}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={records[task.id]?.value}
                        onChange={(e) => updateRecord(task.id, 'value', e.target.value)}
                        placeholder="--.--"
                        className="w-24 bg-gray-50 rounded-lg border-none text-right text-lg font-bold text-black p-2 focus:ring-accent font-numbers tabular-nums"
                      />
                      <span className="text-[10px] font-bold text-text-muted uppercase">s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {seriesTasks.length > 0 && strengthTasks.length > 0 && <div className="h-px bg-gray-100 mx-5 my-8"></div>}

        {/* Dynamic Section: Force / Strength */}
        {strengthTasks.length > 0 && (
          <section className="px-5 mt-6">
            <div className="pb-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-[0.15em] mb-1 font-label">Registro de fuerza</h3>
              <p className="text-text-muted text-[11px] font-medium">Ajuste de carga basado en RIR</p>
            </div>

            <div className="space-y-4">
              {strengthTasks.map((task: any) => (
                <div key={task.id} className="bg-white rounded-2xl p-5 border border-border-light shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-base font-bold text-text-primary">{task.description}</h4>
                      <p className="text-[11px] font-medium text-text-muted mt-1">{task.sets || '--'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-widget rounded-xl p-3 flex flex-col justify-between h-16 relative">
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest font-label">Carga Real</span>
                      <div className="flex items-baseline justify-between">
                        <input
                          type="text"
                          value={records[task.id]?.load}
                          onChange={(e) => updateRecord(task.id, 'load', e.target.value)}
                          className="bg-transparent border-none p-0 text-white font-bold text-xl focus:ring-0 w-full font-numbers"
                        />
                        <span className="text-[10px] font-bold text-white/30 uppercase">kg</span>
                      </div>
                    </div>
                    <div className="w-24 bg-widget rounded-xl p-3 flex flex-col justify-between h-16 relative">
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest font-label">RIR</span>
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          value={records[task.id]?.rir}
                          onChange={(e) => updateRecord(task.id, 'rir', e.target.value)}
                          className="bg-transparent border-none p-0 text-white font-bold text-xl focus:ring-0 w-full font-numbers"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="h-px bg-gray-100 mx-5 my-8"></div>

        {/* Common Section: RPE & Feedback */}
        <section className="px-5">
          <div className="pb-4">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-[0.15em] mb-1 font-label">Diario de sesión</h3>
            <p className="text-text-muted text-[11px] font-medium">Esfuerzo y sensaciones</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] font-label">Esfuerzo Percibido (RPE)</span>
              <span className="text-[10px] font-bold text-accent-dim uppercase font-numbers">{rpe}/10</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                <button
                  key={val}
                  onClick={() => setRpe(val)}
                  className={`h-14 rounded-xl font-bold transition-all border ${rpe === val
                    ? 'bg-accent text-black border-accent shadow-lg shadow-accent/20 scale-105'
                    : 'bg-white text-text-muted border-border-light hover:border-text-primary'
                    }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] font-label px-1">Feedback / Notas</span>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="¿Cómo te has sentido?"
              className="w-full mt-3 bg-white border border-border-light rounded-2xl p-4 text-sm font-medium focus:ring-accent focus:border-accent min-h-[100px]"
            />
          </div>
        </section>

        <div className="px-5 mt-4">
          <button
            onClick={handleSave}
            className="w-full h-16 bg-widget text-accent rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">lock</span>
            Finalizar Sesión
          </button>
        </div>
      </main>
    </div>
  );
};

export default SessionLogging;
