
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
  onOpenAuth?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, context, onSpendPoints, onUpdateProfile, onUpdateLanguage, onLogout, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'rewards' | 'profile'>('stats');
  const [dailyHighlights, setDailyHighlights] = useState<any>(null);
  const isGuest = user.uid === 'guest';

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const data = await geminiService.getDailyHighlights(context);
        setDailyHighlights(data);
      } catch (error) {
        setDailyHighlights({ 
          article: { title: "आज का विचार", content: "ज्ञान ही शक्ति है। निरंतर सीखते रहें।" },
          history: { title: "ऐतिहासिक क्षण", content: "आज के दिन इतिहास में कई महान परिवर्तन हुए।" }
        });
      }
    };
    fetchHighlights();
  }, [context.language]);

  const languages = [
    { code: 'Hindi', label: 'हिन्दी (Hindi)' },
    { code: 'English', label: 'English' },
    { code: 'Urdu', label: 'اردو (Urdu)' }
  ];

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      {isGuest && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">प्रगति को सुरक्षित करें!</h3>
              <p className="text-slate-950/80 font-bold">अभी आपने {user.points} पॉइंट्स कमाए हैं। इन्हें हमेशा के लिए सेव करने के लिए अकाउंट बनाएं।</p>
           </div>
           <button onClick={onOpenAuth} className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Join Now</button>
        </div>
      )}

      <div className="flex space-x-2 bg-slate-900/50 p-1.5 rounded-2xl border border-amber-500/10 w-fit mx-auto md:mx-0">
        <button onClick={() => setActiveTab('stats')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-amber-500'}`}>Stats</button>
        <button onClick={() => setActiveTab('profile')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-amber-500'}`}>प्रोफाइल</button>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-8 rounded-3xl border border-amber-500/10 text-center">
              <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Rank</h4>
              <p className="text-3xl font-black text-white">{isGuest ? 'Guest Scholar' : user.level}</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl border border-amber-500/10 text-center">
              <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Points</h4>
              <p className="text-3xl font-black text-white">{user.points}</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl border border-amber-500/10 text-center">
              <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Streak</h4>
              <p className="text-3xl font-black text-white">{user.streak} Days</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-indigo-500/10 min-h-[200px] flex flex-col justify-center">
                <h5 className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4">Daily Legal Insight</h5>
                {dailyHighlights ? (
                  <div className="space-y-2 animate-fadeIn"><p className="text-white font-black text-lg">{dailyHighlights.article.title}</p><p className="text-slate-400 text-sm">{dailyHighlights.article.content}</p></div>
                ) : <div className="h-20 bg-white/5 animate-pulse rounded-xl"></div>}
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-amber-500/10 min-h-[200px] flex flex-col justify-center">
                <h5 className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4">Historical Fact</h5>
                {dailyHighlights ? (
                  <div className="space-y-2 animate-fadeIn"><p className="text-white font-black text-lg">{dailyHighlights.history.title}</p><p className="text-slate-400 text-sm">{dailyHighlights.history.content}</p></div>
                ) : <div className="h-20 bg-white/5 animate-pulse rounded-xl"></div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5">
           <div className="max-w-md mx-auto space-y-8">
              <div className="flex flex-col items-center space-y-4">
                 <div className="w-32 h-32 bg-slate-800 rounded-full border-4 border-amber-500/20 flex items-center justify-center">
                    <i className="fas fa-user text-4xl text-slate-600"></i>
                 </div>
                 <h4 className="text-xl font-black text-white">{isGuest ? 'Guest Account' : user.name}</h4>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Language</label>
                    <select value={context.language} onChange={(e) => onUpdateLanguage(e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-5 py-3 text-white">
                      {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                    </select>
                 </div>
                 {!isGuest && (
                   <button onClick={onLogout} className="w-full bg-rose-500/10 text-rose-500 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">Sign Out</button>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
