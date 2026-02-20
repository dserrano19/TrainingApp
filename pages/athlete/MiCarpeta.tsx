
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Document {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'pdf' | 'doc' | 'health' | 'calendar';
  tag?: string;
  isNew?: boolean;
}

const DOCUMENTS: Document[] = [
  { id: '1', name: 'Guía de Nutrición.pdf', date: '12 Oct', size: '1.2 MB', type: 'pdf' },
  { id: '2', name: 'Técnica de Carrera.pdf', date: '10 Oct', size: '3.4 MB', type: 'doc', tag: 'Técnica' },
  { id: '3', name: 'Resultados Test Lactato.pdf', date: '05 Oct', size: '0.5 MB', type: 'health', tag: 'Salud' },
  { id: '4', name: 'Calendario Competitivo Q4', date: '01 Oct', size: '1.1 MB', type: 'calendar' },
];

const MiCarpeta: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredDocs = DOCUMENTS.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf': return 'description';
      case 'doc': return 'article';
      case 'health': return 'monitor_heart';
      case 'calendar': return 'calendar_today';
      default: return 'insert_drive_file';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-app overflow-hidden animate-in fade-in duration-500">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-bg-app/90 backdrop-blur-md px-6 pt-12 pb-4 border-b border-widget-border">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl text-text-primary">arrow_back</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-widget-border">
            <img 
              alt="Coach Avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQREwoOQS5bcJzufGodFxBUXUnuKwsC93-MByHmYXq2yriOhS1AJDScL70NceHTk1I5mnS1Hl6S439nHWpTEUB--ZWSWDOwhnb2iRg5a-QsRrE1pc2l9VWzV468DkOHtOPrgsFfrTLQabIRIztJ4_dOnav59Yyp3q1f3TEM4vixIegkRqlrRcU7XnFLZ2mZeGXJy1JumTMtZQpN2yMK9WX0mlQ-oMPBRbtuTD8YOMZvjahfoNcNKl9vf_tOhXIsO5HSQ2OVGF22A" 
            />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary leading-none font-label">Mi Carpeta</h1>
            <p className="text-sm text-text-secondary mt-1 font-medium font-label">Recursos compartidos por Coach Sarah</p>
          </div>
          <button className="flex items-center justify-center w-10 h-10 bg-widget text-accent rounded-full shadow-lg border border-widget-border">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-40 px-6 pt-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 group-focus-within:text-accent transition-colors">search</span>
            </div>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-widget border-none rounded-2xl text-sm font-medium text-white placeholder-gray-500 focus:ring-2 focus:ring-accent transition-all shadow-sm font-label" 
              placeholder="Buscar documentos, planes..." 
              type="text"
            />
          </div>
        </div>

        {/* Section: Recientes */}
        {!search && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-bold text-text-primary font-label">Recientes</h2>
              <button className="text-[10px] font-bold text-accent uppercase tracking-widest font-label">Ver Todo</button>
            </div>
            
            {/* Featured Card */}
            <div 
              onClick={() => navigate('/viewer/featured-plan')}
              className="relative overflow-hidden rounded-[2.5rem] bg-widget p-6 shadow-2xl group border border-widget-border cursor-pointer active:scale-[0.98] transition-all"
            >
              {/* Decorative accent background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-black shadow-lg shadow-accent/20">
                  <span className="material-symbols-outlined icon-fill">picture_as_pdf</span>
                </div>
                <span className="bg-black/50 text-accent text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest border border-accent/20">Nuevo</span>
              </div>
              
              <div className="mt-6 relative z-10">
                <h3 className="text-white text-2xl font-bold leading-tight mb-1 font-label">Plan Macrociclo 2024</h3>
                <p className="text-gray-500 text-xs font-medium font-label">Actualizado hace 2 días</p>
                
                <div className="flex items-center justify-between mt-8">
                  <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-accent w-2/3 shadow-[0_0_10px_rgba(182,242,59,0.3)]"></div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold font-nums tracking-widest uppercase">2.4 MB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: Todos los Documentos */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-text-primary font-label">Todos los documentos</h2>
            {search && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filteredDocs.length} resultados</span>}
          </div>
          
          <div className="flex flex-col gap-3">
            {filteredDocs.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => navigate(`/viewer/${doc.id}`)}
                className="group flex items-center p-4 bg-widget border border-widget-border rounded-2xl hover:border-accent/30 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:bg-accent group-hover:text-black transition-all border border-white/5">
                  <span className="material-symbols-outlined">{getIcon(doc.type)}</span>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate font-label">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {doc.tag && (
                      <span className="bg-white/5 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-white/5">{doc.tag}</span>
                    )}
                    <p className="text-[10px] text-gray-500 font-bold font-nums tracking-wider uppercase">{doc.date} • {doc.size}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); /* simulate download */ }}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:text-accent hover:bg-white/5 transition-all"
                >
                  <span className="material-symbols-outlined text-xl">download</span>
                </button>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-700 mb-2">search_off</span>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No se encontraron documentos</p>
              </div>
            )}
          </div>
        </div>

        <div className="py-8 flex justify-center opacity-30">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] font-label">Fin de la biblioteca</p>
        </div>
      </div>
    </div>
  );
};

export default MiCarpeta;
