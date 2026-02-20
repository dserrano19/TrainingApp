
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface Team {
  id: string;
  name: string;
  code: string;
}

const CoachPlanUpload: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'groups' | 'athletes' | 'category'>('groups');
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string, size: string, raw?: File } | null>(null);
  const [isParsed, setIsParsed] = useState(false);

  useEffect(() => {
    if (user) fetchTeams();
  }, [user]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
      setFile({
        name: selectedFile.name,
        size: `${sizeInMB} MB`,
        raw: selectedFile
      });
      // Simulate parsing delay
      setIsParsed(false);
      setTimeout(() => setIsParsed(true), 1500);
    }
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');
    if (error) console.error('Error fetching teams:', error);
    else setTeams(data || []);
  };

  const handleCreateTeam = async () => {
    if (!newTeamName || !user) return;
    setLoading(true);

    // Generate a simple code
    const code = `${newTeamName.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: newTeamName,
        code,
        coach_id: user.id
      })
      .select()
      .single();

    if (error) {
      alert('Error creating team: ' + error.message);
    } else {
      setTeams([...teams, data]);
      setSelectedTeamId(data.id);
      setShowCreateTeam(false);
      setNewTeamName('');
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    if (!selectedTeamId || !user) {
      alert('Please select a team and ensure you are logged in.');
      return;
    }

    setLoading(true);

    try {
      // 1. Mock session data (this would normally come from parsing the PDF)
      const mockSessions = [
        {
          title: "Fuerza Basal - A1",
          type: "Fuerza",
          duration: "90 min",
          blocks: [
            {
              title: "Calentamiento",
              tasks: [{ id: "t1", description: "Movilidad articular + 10' trote suave" }]
            },
            {
              title: "Fuerza",
              tasks: [
                { id: "t2", description: "Sentadilla Trasera", sets: "3x10 (RIR 2)" },
                { id: "t3", description: "Press Militar", sets: "3x10 (RIR 2)" }
              ]
            }
          ]
        },
        {
          title: "Series de Umbral",
          type: "Carrera",
          duration: "75 min",
          blocks: [
            {
              title: "Principal",
              tasks: [
                { id: "t4", description: "4 x 1000m (RITMO 3:50)", sets: "Rec: 90\"" }
              ]
            }
          ]
        }
      ];

      // 2. Find athletes in the team
      const { data: athletes, error: athleteError } = await supabase
        .from('profiles')
        .select('id')
        .eq('team_id', selectedTeamId);

      if (athleteError) throw athleteError;

      if (!athletes || athletes.length === 0) {
        alert('No athletes found in the selected team.');
        setLoading(false);
        return;
      }

      // 3. Create sessions for each athlete
      const sessionsToInsert = athletes.flatMap(athlete =>
        mockSessions.map(session => ({
          ...session,
          athlete_id: athlete.id,
          date: new Date().toISOString().split('T')[0] // Assign to today for demo
        }))
      );

      const { error: sessionError } = await supabase
        .from('sessions')
        .insert(sessionsToInsert);

      if (sessionError) throw sessionError;

      // 4. Save document record
      await supabase.from('documents').insert({
        title: file?.name || 'Untitled Plan',
        coach_id: user.id,
        file_url: 'https://example.com/mock-url.pdf'
      });

      alert('Successfully published sessions to ' + athletes.length + ' athletes!');
      navigate('/planning');
    } catch (err: any) {
      console.error('Publication error:', err);
      alert('Error publishing plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app animate-in fade-in duration-500 pb-40">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 pt-12 pb-4 bg-white/95 backdrop-blur-md border-b border-border-light">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors text-text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <h1 className="text-[12px] font-bold tracking-widest text-text-primary uppercase font-label">Coach Plan Upload</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-[12px] font-bold text-text-muted hover:text-text-primary transition-colors px-2 font-label uppercase"
        >
          Cancel
        </button>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Stepper */}
        <div className="flex items-center justify-between w-full px-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-6 rounded-full bg-black text-white text-[10px] font-bold font-nums">1</div>
            <span className="text-[10px] font-bold text-black uppercase tracking-widest font-label">File</span>
          </div>
          <div className="h-px flex-1 mx-3 bg-border-light"></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-6 rounded-full bg-accent text-black text-[10px] font-bold font-nums ring-4 ring-accent/10">2</div>
            <span className="text-[10px] font-bold text-black uppercase tracking-widest font-label">Target</span>
          </div>
          <div className="h-px flex-1 mx-3 bg-border-light"></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-6 rounded-full bg-gray-100 border border-border-light text-text-muted text-[10px] font-bold font-nums">3</div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-label">Sync</span>
          </div>
        </div>

        {/* Source Document Section */}
        <section className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-black font-label">Source Document</h2>
            {file && (
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest font-label transition-all duration-500 ${isParsed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                {isParsed ? (
                  <>
                    <span className="material-symbols-outlined text-[14px] icon-fill">check_circle</span>
                    Parsed
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                    Parsing...
                  </>
                )}
              </span>
            )}
          </div>

          {file ? (
            <div className="group relative flex items-start gap-4 p-5 rounded-2xl bg-white border border-border-light hover:border-black transition-all shadow-sm">
              <div className="flex items-center justify-center size-12 rounded-xl bg-gray-50 border border-border-light shrink-0">
                <span className="material-symbols-outlined text-2xl text-black">picture_as_pdf</span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-sm font-bold truncate text-black font-label">{file.name}</span>
                <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium font-nums">
                  <span>{file.size}</span>
                  <span className="size-1 rounded-full bg-gray-300"></span>
                  <span>Uploaded just now</span>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="text-text-muted hover:text-black transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          ) : (
            <div
              className="group relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl bg-white border-2 border-dashed border-border-light hover:border-black transition-all cursor-pointer"
              onClick={handleFileSelect}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.zip"
                onChange={handleFileChange}
              />
              <div className="size-12 rounded-full bg-gray-50 flex items-center justify-center text-text-muted group-hover:bg-black group-hover:text-white transition-all">
                <span className="material-symbols-outlined">cloud_upload</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-black font-label">Tap to upload plan</p>
                <p className="text-[10px] text-text-muted font-medium font-label">PDF, DOCX or ZIP up to 10MB</p>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-3 gap-px bg-border-light rounded-xl overflow-hidden border border-border-light shadow-sm transition-opacity duration-500 ${isParsed ? 'opacity-100' : 'opacity-40'}`}>
            <div className="bg-gray-50 p-4 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold font-label">Weeks</span>
              <span className="text-base font-extrabold text-black font-nums">{isParsed ? '4' : '-'}</span>
            </div>
            <div className="bg-gray-50 p-4 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold font-label">Sessions</span>
              <span className="text-base font-extrabold text-black font-nums">{isParsed ? '24' : '-'}</span>
            </div>
            <div className="bg-gray-50 p-4 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold font-label">Focus</span>
              <span className="text-sm font-extrabold text-black truncate font-label">{isParsed ? 'Str, Hyp' : '-'}</span>
            </div>
          </div>
        </section>

        {/* Assignment Section */}
        <section className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold tracking-tight text-black font-label">Assignment</h2>
            <p className="text-xs text-text-muted font-medium font-label">Define the scope of athletes receiving this plan.</p>
          </div>

          <div className="grid grid-cols-3 p-1 rounded-xl bg-gray-100 border border-border-light">
            <button
              onClick={() => setActiveTab('groups')}
              className={`py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all font-label ${activeTab === 'groups' ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-text-muted'}`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveTab('athletes')}
              className={`py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all font-label ${activeTab === 'athletes' ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-text-muted'}`}
            >
              Athletes
            </button>
            <button
              onClick={() => setActiveTab('category')}
              className={`py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all font-label ${activeTab === 'category' ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-text-muted'}`}
            >
              Category
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowCreateTeam(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest font-label hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Group
            </button>
          </div>

          {showCreateTeam && (
            <div className="p-4 rounded-xl bg-gray-50 border border-border-light space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                placeholder="Group Name (e.g. AdriTeam)"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full bg-white border border-border-light rounded-lg p-3 text-sm font-bold outline-none focus:ring-1 focus:ring-accent"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowCreateTeam(false)} className="flex-1 py-2 text-[10px] font-bold uppercase text-text-muted font-label">Cancel</button>
                <button onClick={handleCreateTeam} disabled={loading} className="flex-1 py-2 bg-accent text-black rounded-lg text-[10px] font-bold uppercase font-label shadow-sm disabled:opacity-50">Create</button>
              </div>
            </div>
          )}

          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-black transition-colors material-symbols-outlined text-[20px]">search</span>
            <input
              className="w-full bg-white border border-border-light rounded-xl py-4 pl-12 pr-4 text-sm font-medium text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all shadow-sm font-label"
              placeholder="Search specific groups..."
              type="text"
            />
          </div>

          <div className="space-y-2">
            {teams.length === 0 ? (
              <p className="text-center py-8 text-xs text-text-muted font-medium font-label">No groups found. Create one to start!</p>
            ) : (
              teams.map((team) => (
                <label
                  key={team.id}
                  className={`flex items-center justify-between p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-sm group ${selectedTeamId === team.id ? 'border-accent ring-2 ring-accent/10' : 'border-border-light hover:border-gray-300'}`}
                  onClick={() => setSelectedTeamId(team.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center text-black font-bold text-xs font-nums border border-accent/20">
                      {team.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-black font-label">{team.name}</span>
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest font-label">Code: {team.code}</span>
                    </div>
                  </div>
                  <div className={`size-5 rounded border flex items-center justify-center transition-all ${selectedTeamId === team.id ? 'bg-accent border-accent text-black' : 'border-gray-300 bg-white'}`}>
                    {selectedTeamId === team.id && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
                  </div>
                </label>
              ))
            )}
          </div>
        </section>

        {/* Review & Publish */}
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold tracking-tight text-black font-label">Review & Publish</h2>
          <div className="relative overflow-hidden rounded-2xl border border-border-light bg-gradient-to-br from-gray-50 to-white shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-black via-accent to-black"></div>
            <div className="p-6 space-y-5">
              <div className="flex gap-4">
                <div className="mt-1 shrink-0 text-black">
                  <span className="material-symbols-outlined icon-fill">info</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-muted font-medium leading-relaxed font-label">
                    You are publishing <span className="text-black font-bold">{file?.name || '---'}</span> to <span className="text-black font-bold">{teams.find(t => t.id === selectedTeamId)?.name || '1 Group'}</span>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white border border-border-light flex flex-col gap-1.5 shadow-sm">
                  <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold font-label">Visibility</span>
                  <span className="text-[11px] font-bold text-black flex items-center gap-2 font-label">
                    <span className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                    Immediate
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-border-light flex flex-col gap-1.5 shadow-sm">
                  <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold font-label">Notify</span>
                  <span className="text-[11px] font-bold text-black flex items-center gap-2 font-label">
                    <span className="material-symbols-outlined text-[16px] text-black">notifications_active</span>
                    Push + Email
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handlePublish}
            disabled={loading || !selectedTeamId || !file}
            className="group w-full h-16 flex items-center justify-between px-2 bg-black hover:bg-zinc-900 text-white rounded-2xl transition-all shadow-xl shadow-black/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12"></div>
            <span className="font-bold text-[13px] tracking-[0.2em] uppercase font-label">
              {loading ? 'Publishing...' : 'Confirm Publication'}
            </span>
            <div className="size-12 flex items-center justify-center bg-white/10 rounded-xl group-hover:bg-accent group-hover:text-black transition-all">
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default CoachPlanUpload;
