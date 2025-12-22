
import React, { useState, useEffect } from 'react';
import { SavedSession } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown';

const SavedArchives: React.FC = () => {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<SavedSession | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gyansetu_saved_sessions');
    if (saved) {
      setSessions(JSON.parse(saved).sort((a: any, b: any) => b.timestamp - a.timestamp));
    }
  }, []);

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem('gyansetu_saved_sessions', JSON.stringify(updated));
    if (selectedSession?.id === id) setSelectedSession(null);
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-24">
      <div className="bg-slate-900 rounded-[3rem] p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <i className="fas fa-box-archive text-[180px] text-emerald-500"></i>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">मेरा ज्ञान संग्रह <span className="text-emerald-500">My Archives</span></h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">आपके द्वारा सहेजे गए महत्वपूर्ण सत्र और परामर्श</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">सहेजे गए लेख ({sessions.length})</p>
          <div className="space-y-3 max-h-[600px] overflow-y-auto dark-scroll pr-2">
            {sessions.length === 0 ? (
              <div className="bg-slate-900/50 p-10 rounded-3xl border border-white/5 text-center text-slate-600 italic">
                अभी तक कोई सत्र सहेजा नहीं गया है।
              </div>
            ) : (
              sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`w-full text-left p-6 rounded-3xl border transition-all relative group ${selectedSession?.id === session.id ? 'bg-emerald-500/10 border-emerald-500 shadow-lg' : 'bg-slate-900 border-white/5 hover:border-emerald-500/30'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-500/60 bg-emerald-500/5 px-2 py-0.5 rounded">{session.section}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                      className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400 transition-opacity"
                    >
                      <i className="fas fa-trash-can text-xs"></i>
                    </button>
                  </div>
                  <h4 className="font-bold text-white line-clamp-2 text-sm leading-tight">{session.title}</h4>
                  <p className="text-[9px] text-slate-600 mt-3 font-medium uppercase tracking-widest">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="bg-slate-900 rounded-[3rem] p-12 shadow-3xl border border-white/5 animate-slideUp min-h-[500px]">
              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
                <div>
                   <h3 className="text-2xl font-black text-white">{selectedSession.title}</h3>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Saved on {new Date(selectedSession.timestamp).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-xl leading-relaxed font-medium">
                 <ReactMarkdown>{selectedSession.content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/30 rounded-[3rem] h-full flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-white/5 p-20 text-center">
               <i className="fas fa-book-open-reader text-6xl mb-6 opacity-20"></i>
               <p className="text-lg font-bold">पढ़ने के लिए बाईं ओर से एक सत्र चुनें।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedArchives;
