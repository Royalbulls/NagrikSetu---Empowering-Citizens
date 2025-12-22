
import React, { useState, useEffect } from 'react';
import { UserState, LocalContext } from '../types';
import { geminiService } from '../services/geminiService';
import { firebaseService } from '../services/firebaseService';

interface DashboardProps {
  user: UserState;
  context: LocalContext;
  onSpendPoints: (amount: number) => void;
  onUpdateProfile: (data: Partial<UserState>) => void;
  onUpdateLanguage: (lang: string) => void;
  onLogout: () => void;
  onRevisitSearch?: (query: string, section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, context, onSpendPoints, onUpdateProfile, onUpdateLanguage, onLogout, onRevisitSearch }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'rewards' | 'profile'>('stats');
  const [dailyHighlights, setDailyHighlights] = useState<any>(null);
  const [highlightsLoading, setHighlightsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const fetchHighlights = async () => {
      setHighlightsLoading(true);
      try {
        const data = await geminiService.getDailyHighlights(context);
        setDailyHighlights(data);
      } catch (error) {
        console.error("Failed to fetch daily highlights", error);
      } finally {
        setHighlightsLoading(false);
      }
    };
    fetchHighlights();
  }, [context.country, context.language]);

  const handleRetrySync = () => {
    setIsRetrying(true);
    setTimeout(() => {
      firebaseService.retryConnection();
      setIsRetrying(false);
    }, 1000);
  };

  const rewards = [
    { id: 1, name: "Gyan Expert Badge", cost: 500, icon: "fa-certificate", color: "text-blue-400" },
    { id: 2, name: "Pro Hindi Voice Unlock", cost: 1500, icon: "fa-microphone-lines", color: "text-purple-400" },
    { id: 3, name: "Digital Merit Certificate", cost: 3000, icon: "fa-file-signature", color: "text-emerald-400" },
    { id: 4, name: "Scholar's Trophy", cost: 5000, icon: "fa-trophy", color: "text-amber-500" },
  ];

  const languages = [
    { code: 'Hindi', label: 'हिन्दी (Hindi)' },
    { code: 'English', label: 'English' },
    { code: 'Urdu', label: 'اردو (Urdu)' },
    { code: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'Marathi', label: 'मराठी (Marathi)' },
    { code: 'Bengali', label: 'বাংলা (Bengali)' },
    { code: 'Tamil', label: 'தமிழ் (Tamil)' },
    { code: 'Telugu', label: 'తెలుగు (Telugu)' },
    { code: 'Gujarati', label: 'गुજરાती (Gujarati)' }
  ];

  const isCloud = firebaseService.isCloudConnected();
  const cloudError = firebaseService.getInitError();

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      <div className="flex space-x-2 bg-slate-900/50 p-1.5 rounded-2xl border border-amber-500/10 w-fit mx-auto md:mx-0">
        <button onClick={() => setActiveTab('stats')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-amber-500'}`}>Stats</button>
        <button onClick={() => setActiveTab('rewards')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'rewards' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-amber-500'}`}>Rewards</button>
        <button onClick={() => setActiveTab('profile')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-amber-500'}`}>प्रोफाइल</button>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-amber-500/10 flex flex-col items-center text-center transition-transform hover:scale-[1.02]">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20"><i className="fas fa-award text-amber-500 text-2xl"></i></div>
              <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">स्तर (Rank)</h4>
              <p className="text-3xl font-black text-white">{user.level}</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-amber-500/10 flex flex-col items-center text-center transition-transform hover:scale-[1.02]">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20"><i className="fas fa-star text-amber-500 text-2xl"></i></div>
              <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">कुल अंक (Points)</h4>
              <p className="text-3xl font-black text-white">{user.points}</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-amber-500/10 flex flex-col items-center text-center transition-transform hover:scale-[1.02]">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 border border-orange-500/20"><i className="fas fa-bolt text-orange-500 text-2xl"></i></div>
              <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">दैनिक लय (Streak)</h4>
              <p className="text-3xl font-black text-white">{user.streak} दिन</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[2.5rem] border border-indigo-500/20 shadow-2xl relative overflow-hidden group min-h-[250px] flex flex-col justify-center">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center space-x-3"><span className="bg-indigo-500 text-slate-950 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Article of the Day</span></div>
                {dailyHighlights ? <><h5 className="text-xl font-black text-white">{dailyHighlights.article.title}</h5><p className="text-slate-400 text-sm leading-relaxed">{dailyHighlights.article.content}</p></> : <div className="space-y-3"><div className="h-6 bg-white/5 rounded-lg w-3/4 animate-pulse"></div><div className="h-4 bg-white/5 rounded-lg w-full animate-pulse"></div></div>}
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-amber-950 p-8 rounded-[2.5rem] border border-amber-500/20 shadow-2xl relative overflow-hidden group min-h-[250px] flex flex-col justify-center">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center space-x-3"><span className="bg-amber-500 text-slate-950 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Today in History</span></div>
                {dailyHighlights ? <><h5 className="text-xl font-black text-white">{dailyHighlights.history.title}</h5><p className="text-slate-400 text-sm leading-relaxed">{dailyHighlights.history.content}</p></> : <div className="space-y-3"><div className="h-6 bg-white/5 rounded-lg w-3/4 animate-pulse"></div><div className="h-4 bg-white/5 rounded-lg w-full animate-pulse"></div></div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-5xl mx-auto space-y-8 animate-slideUp">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* User Profile Info */}
            <div className="md:col-span-3 bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-amber-500/10">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full bg-slate-800 border-4 border-amber-500/30 overflow-hidden flex items-center justify-center shadow-2xl">{user.photo ? <img src={user.photo} alt="Profile" className="w-full h-full object-cover" /> : <i className="fas fa-user text-5xl text-slate-600"></i>}</div>
                    <label className="absolute bottom-1 right-1 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 cursor-pointer shadow-lg border-4 border-slate-900 hover:scale-110 transition-transform"><i className="fas fa-camera text-sm"></i><input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => onUpdateProfile({ photo: reader.result as string }); reader.readAsDataURL(file); } }} /></label>
                  </div>
                  <div className="text-center"><p className="text-white font-black text-xl">{user.name || 'आपका नाम'}</p><p className="text-amber-500/60 font-bold uppercase tracking-widest text-[9px]">{user.level}</p></div>
                  <button onClick={onLogout} className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-rose-500 hover:text-white transition-all">Logout</button>
                </div>

                <div className="flex-1 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Name</label><input type="text" value={user.name} onChange={(e) => onUpdateProfile({ name: e.target.value })} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-amber-500/50" /></div>
                      <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Language</label><select value={context.language} onChange={(e) => onUpdateLanguage(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-5 py-3 text-white outline-none appearance-none cursor-pointer">{languages.map(l => <option key={l.code} value={l.code} className="bg-slate-900">{l.label}</option>)}</select></div>
                   </div>
                   <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Location (City)</label><input type="text" value={user.place || ''} onChange={(e) => onUpdateProfile({ place: e.target.value })} placeholder="Enter city" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-amber-500/50" /></div>
                </div>
              </div>
            </div>

            {/* System Status & Diagnostic Panel */}
            <div className="md:col-span-1 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-white/5">
                <i className="fas fa-microchip text-indigo-500"></i>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">System Health</h4>
              </div>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Cloud Sync</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${isCloud ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>{isCloud ? 'Online' : 'Offline'}</span>
                 </div>
                 
                 {!isCloud && (
                   <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/20 space-y-2">
                      <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Diagnostic Detail:</p>
                      <p className="text-[9px] text-slate-400 font-mono leading-relaxed break-words">{cloudError || "Check Firewall or Firebase Console Whitelist."}</p>
                      <button 
                        onClick={handleRetrySync} 
                        disabled={isRetrying}
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[8px] font-black py-2 rounded-lg transition-all uppercase tracking-widest"
                      >
                        {isRetrying ? <i className="fas fa-sync fa-spin"></i> : "Reconnect to Cloud"}
                      </button>
                   </div>
                 )}

                 <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-2">
                    <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Local Vault Status:</p>
                    <div className="flex items-center space-x-2">
                       <i className="fas fa-shield-check text-emerald-500 text-[10px]"></i>
                       <span className="text-[9px] text-slate-300 font-bold uppercase">Encrypted Local Persistence Active</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Search History Log */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-amber-500/10 shadow-2xl">
               <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500"><i className="fas fa-magnifying-glass"></i></div>
                  <div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Search History</h3>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">आपकी पिछली खोजें और परामर्श</p>
                  </div>
               </div>

               <div className="space-y-3 max-h-[400px] overflow-y-auto dark-scroll pr-2">
                  {!user.searchHistory || user.searchHistory.length === 0 ? (
                    <div className="p-12 text-center bg-slate-950/50 rounded-3xl border border-dashed border-white/5 text-slate-600 font-bold uppercase tracking-widest text-[10px]">No searches recorded</div>
                  ) : (
                    user.searchHistory.map((s) => (
                      <button 
                        key={s.id} 
                        onClick={() => onRevisitSearch?.(s.query, s.section)}
                        className="w-full flex items-center justify-between p-6 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group text-left"
                      >
                         <div className="flex items-center space-x-6">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 font-black text-xs">
                              <i className={`fas ${s.section === 'Law' ? 'fa-gavel' : s.section === 'History' ? 'fa-scroll' : 'fa-location-dot'}`}></i>
                            </div>
                            <div>
                               <p className="font-black text-white group-hover:text-amber-500 transition-colors line-clamp-1">{s.query}</p>
                               <div className="flex items-center space-x-3 mt-1">
                                  <span className="text-[8px] bg-white/5 text-slate-400 px-2 py-0.5 rounded font-black uppercase tracking-widest">{s.section}</span>
                                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{new Date(s.timestamp).toLocaleDateString()}</p>
                               </div>
                            </div>
                         </div>
                         <i className="fas fa-chevron-right text-slate-800 group-hover:text-amber-500 transition-colors text-xs"></i>
                      </button>
                    ))
                  )}
               </div>
            </div>

            {/* Contest History Log */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-emerald-500/10 shadow-2xl">
               <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500"><i className="fas fa-trophy"></i></div>
                  <div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Competition Log</h3>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">आपके पिछले मुकाबलों का इतिहास</p>
                  </div>
               </div>

               <div className="space-y-3 max-h-[400px] overflow-y-auto dark-scroll pr-2">
                  {!user.contests || user.contests.length === 0 ? (
                    <div className="p-12 text-center bg-slate-950/50 rounded-3xl border border-dashed border-white/5 text-slate-600 font-bold uppercase tracking-widest text-[10px]">No contests played yet</div>
                  ) : (
                    user.contests.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-6 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                         <div className="flex items-center space-x-6">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-black text-xs">{c.score}/{c.totalQuestions}</div>
                            <div>
                               <p className="font-black text-white group-hover:text-emerald-400 transition-colors">{c.title}</p>
                               <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{new Date(c.timestamp).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg">+{c.pointsEarned}</div>
                      </div>
                    )).reverse()
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
