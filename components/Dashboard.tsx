
import React, { useState, useEffect } from 'react';
import { UserState, LocalContext } from '../types.ts';
import { geminiService } from '../services/geminiService.ts';
import { firebaseService } from '../services/firebaseService.ts';

interface DashboardProps {
  user: UserState;
  context: LocalContext;
  onSpendPoints: (amount: number) => void;
  onUpdateProfile: (data: Partial<UserState>) => void;
  onUpdateLanguage: (lang: string) => void;
  onLogout: () => void;
  onOpenAuth?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, context, onSpendPoints, onUpdateProfile, onUpdateLanguage, onLogout, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'economy' | 'vision' | 'transparency'>('stats');
  const isGuest = user.uid === 'guest';
  const stats = user.auraStats || { history: 0, law: 0, ethics: 0, finance: 0, culture: 0 };
  
  const earningRules = [
    { activity: "AI Search / Ask Query", points: "+30", icon: "fa-magnifying-glass" },
    { activity: "Deep Historical Audit", points: "+75", icon: "fa-landmark" },
    { activity: "Daily Logic Puzzle", points: "+75", icon: "fa-brain" },
    { activity: "Citizen Chores (Task)", points: "+20", icon: "fa-check-double" },
    { activity: "Support Session (Reward)", points: "+100", icon: "fa-coins" },
    { activity: "Weekly Contest Win", points: "+500", icon: "fa-trophy" }
  ];

  const levelRoadmap = [
    { level: "New Citizen", req: 0, perk: "Basic Search Access" },
    { level: "Scholar", req: 250, perk: "History Timelines Unlocked" },
    { level: "Master", req: 1000, perk: "Aura Chamber (Voice AI) Access" },
    { level: "Guardian", req: 2500, perk: "Expert Connect Priority" }
  ];

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      {/* 🧭 Dashboard Navigation */}
      <div className="flex flex-wrap gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 w-fit mx-auto md:mx-0 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('stats')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-amber-400'}`}>My Stats</button>
        <button onClick={() => setActiveTab('economy')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'economy' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-indigo-400'}`}>Point Economy</button>
        <button onClick={() => setActiveTab('vision')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'vision' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-emerald-400'}`}>Vision 2030</button>
        <button onClick={() => setActiveTab('transparency')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'transparency' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>Trust Report</button>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-8 animate-slideUp">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-white/5 text-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><i className="fas fa-coins text-6xl"></i></div>
                 <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2 relative z-10">Total Nagrik Power</p>
                 <p className="text-5xl font-black text-white tracking-tighter relative z-10 royal-serif">{user.points.toLocaleString()}</p>
                 <p className="text-amber-500/60 font-bold text-[9px] uppercase mt-4">Redeemable for Premium Access</p>
              </div>
              <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-white/5 text-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><i className="fas fa-crown text-6xl"></i></div>
                 <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2 relative z-10">Current Rank</p>
                 <p className="text-3xl font-black text-white uppercase italic tracking-tighter relative z-10">{user.level || 'Scholar'}</p>
                 <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-amber-500 w-2/3 shadow-[0_0_10px_#fbbf24]"></div>
                 </div>
              </div>
              <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-white/5 text-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><i className="fas fa-fire text-6xl"></i></div>
                 <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2 relative z-10">Learning Streak</p>
                 <p className="text-5xl font-black text-white tracking-tighter relative z-10">{user.streak || 1} Days</p>
                 <p className="text-rose-500/60 font-bold text-[9px] uppercase mt-4">Don't break the cycle!</p>
              </div>
           </div>

           <div className="bg-slate-900 p-10 md:p-12 rounded-[3.5rem] border border-white/5 shadow-3xl">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-10 flex items-center gap-4">
                 <i className="fas fa-chart-pie text-amber-500"></i>
                 Aura Analysis (ज्ञान वितरण)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                 {Object.entries(stats).map(([key, val]) => (
                   <div key={key} className="bg-slate-950 p-6 rounded-3xl border border-white/5 space-y-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{key}</p>
                      <p className="text-2xl font-black text-white">{val as any}</p>
                      <div className="h-1 bg-slate-800 rounded-full">
                         <div className="h-full bg-amber-500 shadow-[0_0_10px_#fbbf24]" style={{ width: `${Math.min(((val as any)/1000)*100, 100)}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'economy' && (
        <div className="space-y-10 animate-slideUp">
           {/* 💰 Point Earning Guide */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-indigo-500/20 shadow-3xl space-y-8">
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Learn & <span className="text-indigo-500">Earn</span></h3>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">पॉइंट्स कमाने की मार्गदर्शिका</p>
                 </div>
                 <div className="space-y-4">
                    {earningRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-950 p-5 rounded-2xl border border-white/5 group hover:border-indigo-500/40 transition-all">
                         <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                               <i className={`fas ${rule.icon}`}></i>
                            </div>
                            <span className="text-white font-bold text-sm">{rule.activity}</span>
                         </div>
                         <span className="text-emerald-500 font-black text-lg">{rule.points}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* 🏆 Rank Progression */}
              <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-amber-500/20 shadow-3xl space-y-8">
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Citizen <span className="text-amber-500">Roadmap</span></h3>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">स्तर और विशेषाधिकार</p>
                 </div>
                 <div className="relative pl-10 space-y-10">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-500 via-amber-900 to-transparent"></div>
                    {levelRoadmap.map((lvl, idx) => (
                      <div key={idx} className="relative group">
                         <div className={`absolute -left-8 top-1 w-4 h-4 rounded-full border-2 border-slate-950 shadow-xl z-10 transition-all duration-500 ${user.points >= lvl.req ? 'bg-amber-500 scale-125' : 'bg-slate-800'}`}></div>
                         <div className="space-y-1">
                            <h4 className={`font-black text-lg uppercase tracking-tighter ${user.points >= lvl.req ? 'text-white' : 'text-slate-600'}`}>{lvl.level} <span className="text-[9px] font-mono ml-2">({lvl.req} pts)</span></h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{lvl.perk}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-indigo-600/10 p-12 rounded-[4rem] border-2 border-indigo-500/20 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-50 animate-pulse"></div>
              <h4 className="text-indigo-400 font-black text-xs uppercase tracking-[0.5em] mb-4">Master's Secret</h4>
              <p className="text-slate-300 italic text-2xl leading-relaxed max-w-4xl mx-auto relative z-10 font-medium font-serif">
                "पॉइंट्स सिर्फ नंबर नहीं हैं, यह आपकी 'नागरिक शक्ति' का पैमाना हैं। 1000 पॉइंट्स पार करते ही आप **'Aura AI'** से सीधे जुड़ सकते हैं, जो आपकी निजी प्रगति का दर्पण है।"
              </p>
           </div>
        </div>
      )}

      {activeTab === 'transparency' && (
        <div className="space-y-8 animate-slideUp">
           <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-3xl space-y-10">
              <div className="flex items-center space-x-6 border-b border-white/5 pb-8">
                 <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-emerald-500 text-3xl shadow-xl">
                    <i className="fas fa-shield-check"></i>
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Trust & Transparency Report</h3>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Public Accountability Protocol v1.0</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 leading-relaxed">
                 <div className="space-y-4">
                    <h4 className="text-white font-black uppercase text-xs tracking-widest">How we value your data?</h4>
                    <p className="text-slate-400 text-sm italic font-medium">"Google की तरह, हम आपके व्यक्तिगत डेटा को नहीं बेचते। आपकी 'सीख' और 'पॉइंट्स' इस सिस्टम की बुद्धिमत्ता (LLM Context) को सुधारने में मदद करते हैं, जिससे NagrikSetu की वैश्विक वैल्यू बढ़ती है।"</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-white font-black uppercase text-xs tracking-widest">Institutional Integrity</h4>
                    <p className="text-slate-400 text-sm italic font-medium">"हमारा रेवेन्यू मॉडल भविष्य में 'Expert Consultation' (B2B) पर आधारित होगा। तब तक, आपका हर पॉइंट एक **Social Asset** है जिसे हम 'Public Ledger' पर सुरक्षित रखते हैं।"</p>
                 </div>
              </div>
              <div className="bg-slate-950 p-8 rounded-3xl border border-white/5">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Data Security Index</span>
                    <span className="text-white font-mono font-bold text-xs italic">A+ Grade (Sovereign Cloud)</span>
                 </div>
                 <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '94%' }}></div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'vision' && (
        <div className="bg-gradient-to-br from-emerald-600 to-slate-900 p-12 rounded-[4rem] shadow-3xl text-center space-y-6">
           <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase">The $25M Vision</h3>
           <p className="text-emerald-100 text-xl font-medium max-w-2xl mx-auto">"हमारा लक्ष्य 2027 तक भारत का सबसे बड़ा **'Legal Empowerment Network'** बनना है। आपकी हर जिज्ञासा इस विज़न का हिस्सा है।"</p>
           <div className="text-7xl font-black text-white tracking-tighter opacity-80 tabular-nums">$1.42M Secured</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
