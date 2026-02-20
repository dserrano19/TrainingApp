import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';

interface TimelineItem {
    id: string;
    title: string;
    date: string;
    type: 'relapse' | 'milestone' | 'initial' | 'note';
    description: string;
}

interface ResourceItem {
    name: string;
    url: string;
    size: string;
}

interface InjuryData {
    id: string;
    name: string;
    grade: string;
    status: string;
    updated_at: string;
    relapses_count: number;
    consensus: string;
    doctor_name: string;
    doctor_role: string;
    doctor_avatar: string;
    timeline: TimelineItem[];
    resources: ResourceItem[];
}

const InjuryDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [injury, setInjury] = useState<InjuryData | null>(null);

    useEffect(() => {
        fetchInjuryDetail();
    }, [id]);

    const fetchInjuryDetail = async () => {
        if (!id) return;
        setLoading(true);

        try {
            // 1. Fetch main injury details
            const { data: mainData, error: mainError } = await supabase
                .from('injuries')
                .select('*')
                .eq('id', id)
                .single();

            if (mainError) throw mainError;

            // 2. Fetch timeline
            const { data: timelineData } = await supabase
                .from('injury_timeline')
                .select('*')
                .eq('injury_id', id)
                .order('date', { ascending: false });

            // 3. Fetch resources
            const { data: resourcesData } = await supabase
                .from('injury_resources')
                .select('*')
                .eq('injury_id', id);

            setInjury({
                ...mainData,
                timeline: timelineData || [],
                resources: resourcesData || []
            });
        } catch (err) {
            console.error('Error fetching injury:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
                <div className="animate-pulse text-accent font-bold uppercase tracking-widest">Cargando Evolución...</div>
            </div>
        );
    }

    if (!injury) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-center p-6">
                <h2 className="text-xl font-bold mb-4">No se encontró la lesión</h2>
                <button onClick={() => navigate(-1)} className="text-accent font-bold uppercase tracking-widest">Volver al Perfil</button>
            </div>
        );
    }

    const getTimeAgo = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            if (diffHrs < 24) return `${diffHrs}h ago`;
            const diffDays = Math.floor(diffHrs / 24);
            return `${diffDays}d ago`;
        } catch {
            return '';
        }
    };

    return (
        <div className="flex flex-col w-full animate-in fade-in duration-500 pb-32 bg-white dark:bg-black min-h-screen text-slate-900 dark:text-white">
            {/* Header Estilo Injury Evolution */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5 pt-12">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                    </button>
                    <h1 className="text-base font-bold font-label">Injury Evolution</h1>
                    <button className="text-sm font-bold hover:text-accent transition-colors px-2 font-label">Edit</button>
                </div>
            </header>

            <main className="px-5 pt-6 flex flex-col gap-6">
                {/* Main Status Hero */}
                <section className="relative overflow-hidden rounded-3xl bg-widget text-white p-6 shadow-xl border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${injury.status === 'active' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                                    injury.status === 'recovering' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' :
                                        'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${injury.status === 'active' ? 'bg-red-500' :
                                        injury.status === 'recovering' ? 'bg-orange-500' :
                                            'bg-emerald-500'
                                    }`}></span>
                                {injury.status === 'active' ? 'ACTIVA' : injury.status === 'recovering' ? 'EN RECUPERACIÓN' : 'RECUPERADA'}
                            </span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Updated {getTimeAgo(injury.updated_at)}</span>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-1 font-label">{injury.name}</h2>
                            {injury.grade && <p className="text-gray-400 text-sm font-medium font-serif italic">{injury.grade}</p>}
                        </div>
                    </div>
                </section>

                {/* KPI Cards */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-widget rounded-2xl p-5 text-white flex flex-col justify-between h-32 shadow-lg relative overflow-hidden group border border-white/5">
                        <div className="flex items-start justify-between relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-label">Recidivas</p>
                            <span className="material-symbols-outlined text-accent text-[20px]">history</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-4xl font-black tracking-tight text-white font-numbers">{injury.relapses_count || 0}</p>
                            {injury.relapses_count > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 font-bold uppercase tracking-widest">Risk detected</p>
                            )}
                        </div>
                    </div>
                    {/* Recovery estimation placeholder - could be added to DB if needed */}
                    <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-5 text-slate-900 dark:text-white flex flex-col justify-between h-32 relative border border-transparent dark:border-white/5">
                        <div className="flex items-start justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-label">Status</p>
                            <span className="material-symbols-outlined text-gray-400 text-[20px]">timer</span>
                        </div>
                        <div>
                            <p className="text-2xl font-black tracking-tight uppercase">{injury.status}</p>
                            <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-widest">Medical condition</p>
                        </div>
                    </div>
                </section>

                {/* Timeline of Incidents */}
                {injury.timeline.length > 0 && (
                    <section className="mt-2">
                        <h3 className="text-lg font-bold mb-6 px-1 flex items-center justify-between font-label">
                            Timeline of Incidents
                            <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Chronological</span>
                        </h3>
                        <div className="relative pl-4 space-y-8">
                            <div className="absolute top-2 bottom-0 left-[23px] w-0.5 bg-gray-200 dark:bg-white/5"></div>
                            {injury.timeline.map((item, i) => (
                                <div key={item.id} className="relative pl-8 animate-in slide-in-from-bottom-2 duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                                    <div className={`absolute left-3 top-4 w-5 h-5 bg-white dark:bg-black border-4 rounded-full z-10 ${item.type === 'relapse' ? 'border-red-500' :
                                            item.type === 'milestone' ? 'border-emerald-500' :
                                                'border-gray-300 dark:border-white/20'
                                        }`}></div>
                                    <div className="bg-widget rounded-[2rem] p-6 shadow-xl text-white group border border-white/5">
                                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                                            <span className={`font-bold text-sm font-label ${item.type === 'relapse' ? 'text-red-500' :
                                                    item.type === 'milestone' ? 'text-emerald-500' :
                                                        'text-accent'
                                                }`}>{item.title}</span>
                                            <span className="text-[10px] text-gray-500 font-nums font-bold">
                                                {new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {item.type === 'relapse' && (
                                                <div className="flex items-center gap-2 text-red-500 text-[10px] font-extrabold uppercase tracking-widest mb-2">
                                                    <span className="material-symbols-outlined text-[16px] icon-fill">warning</span>
                                                    Relapse Detected
                                                </div>
                                            )}
                                            <p className="font-serif text-gray-300 text-base leading-relaxed italic">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Resources */}
                {injury.resources.length > 0 && (
                    <section>
                        <h3 className="text-lg font-bold mb-4 px-1 font-label">Recursos de Rehabilitación</h3>
                        <div className="flex flex-col gap-3">
                            {injury.resources.map((res, i) => (
                                <div key={i} className="bg-widget rounded-2xl p-4 flex items-center justify-between shadow-lg border border-white/5 group hover:border-accent/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-accent flex-shrink-0">
                                            <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                                        </div>
                                        <span className="font-serif text-white text-base truncate italic">{res.name}</span>
                                    </div>
                                    <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-accent text-black text-[10px] font-black px-5 py-2 rounded-full hover:shadow-lg shadow-accent/20 transition-all flex-shrink-0 ml-3 uppercase tracking-widest"
                                    >
                                        Ver
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Coach Consensus */}
                {injury.consensus && (
                    <section className="mb-20">
                        <h3 className="text-lg font-bold mb-4 px-1 font-label">Coach & Medical Consensus</h3>
                        <div className="p-1">
                            <div className="border-l-4 border-accent pl-6 py-2">
                                <p className="font-serif text-slate-700 dark:text-slate-300 text-lg leading-relaxed italic">
                                    "{injury.consensus}"
                                </p>
                                {(injury.doctor_name || injury.doctor_avatar) && (
                                    <div className="mt-6 flex items-center gap-3">
                                        {injury.doctor_avatar ? (
                                            <div className="h-10 w-10 rounded-full border-2 border-accent overflow-hidden shadow-lg grayscale">
                                                <img className="w-full h-full object-cover" src={injury.doctor_avatar} alt={injury.doctor_name} />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-full border-2 border-accent bg-black flex items-center justify-center text-accent">
                                                <span className="material-symbols-outlined">person</span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-bold font-label">{injury.doctor_name || 'Personal Médico'}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{injury.doctor_role || 'Staff Técnico'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* Floating Add Note Button */}
            <button className="fixed bottom-28 right-5 z-40 bg-accent text-black rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[28px] font-bold">add</span>
            </button>
        </div>
    );
};

export default InjuryDetail;
