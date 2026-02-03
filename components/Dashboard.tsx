
import React, { useState } from 'react';
import { UserState, LocalContext } from '../types.ts';
import { translations } from '../utils/translations';

interface DashboardProps {
  user: UserState;
  context: LocalContext;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, context, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'impact' | 'transparency'>('stats');
  const t = translations[context.language] || translations['English'];
  const d = t.dashboard;
  const stats = user.auraStats || { history: 0, law: 0, ethics: 0, finance: 0, culture: 0 };
  
  const impactData = [
    { label: d.helpedCount, value: "1,24,500+", icon: "fa-users", color: "text-blue-500" },
    { label: d.activeExperts, value: "4,250", icon: "fa-user-tie", color: "text-amber-500" },
    { label: "Free Seva Provided", value: "98.2%", icon: "fa-heart", color: "text-emerald-500" }
  ];

  return (
    <div className="space-y-10 animate-fadeIn pb-20 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-3 bg-slate-900/50 p-2 rounded-2xl border border-white/5 w-fit mx-auto md:mx-0 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('stats')} className={`px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-amber-400'}`}>{d.stats}</button>
        <button onClick={() => setActiveTab('impact')} className={`px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'impact' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-indigo-400'}`}>{d.impact}</button>
        <button onClick={() => setActiveTab('transparency')} className={`px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'transparency' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>{d.trust}</button>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-10 animate-slideUp">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 text-center shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><i className="fas fa-coins text-7xl text-white"></i></div>
                 <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4 relative z-10">{t.pointsLabel}</p>
                 <p className="text-6xl font-black text-white tracking-tighter relative z-10 royal-serif leading-none">{user.points.toLocaleString()}</p>
                 <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-amber-500 font-black text-[11px] uppercase italic tracking-tighter">{user.level || 'Scholar'}</p>
                 </div>
              </div>

              <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-3xl relative overflow-hidden">
                 <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Personal Profile Node</h4>
                 <div className="space-y-6">
                    <div>
                       <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Profession</p>
                       <p className="text-white font-black italic">{user.profile?.profession || 'Not Specified'}</p>
                    </div>
                    <div>
                       <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Context</p>
                       <p className="text-amber-500 font-black italic uppercase text-xs">{user.profile?.city || 'India'} | {user.profile?.pinCode || '6-Digit'}</p>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 p-12 rounded-[4rem] border-2 border-rose-600/30 text-center shadow-3xl flex flex-col justify-between">
                 <div className="space-y-4">
                    <i className="fas fa-shield-heart text-rose-500 text-5xl animate-pulse"></i>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">System Security</h3>
                    <button onClick={onLogout} className="w-full bg-slate-850 hover:bg-rose-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all mt-8">Secure Logout</button>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 p-12 md:p-16 rounded-[5rem] border border-white/5 shadow-3xl relative overflow-hidden">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-12 flex items-center gap-6 relative z-10">
                 <i className="fas fa-chart-line text-amber-500"></i>
                 शिक्षा औरा (Knowledge Aura)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
                 {Object.entries(stats).map(([key, val]) => (
                   <div key={key} className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 space-y-6 group hover:border-amber-500/40 transition-all text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-amber-500 transition-colors">{key}</p>
                      <p className="text-4xl font-black text-white tracking-tighter royal-serif">{val as any}</p>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${Math.min(((val as any)/1000)*100, 100)}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'impact' && (
        <div className="space-y-12 animate-slideUp">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {impactData.map((item, i) => (
                <div key={i} className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-3xl text-center space-y-4">
                   <i className={`fas ${item.icon} ${item.color} text-5xl mb-4`}></i>
                   <h3 className="text-4xl font-black text-white tracking-tighter royal-serif">{item.value}</h3>
                   <p className="text-slate-500 font-black text-[11px] uppercase tracking-widest">{item.label}</p>
                </div>
              ))}
           </div>

           <div className="bg-slate-950 p-12 rounded-[4rem] border-2 border-emerald-500/20 shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-5"><i className="fas fa-handshake-angle text-[200px] text-emerald-500"></i></div>
              <div className="relative z-10 space-y-8">
                 <h3 className="text-3xl font-black text-white italic uppercase">मुफ़्त सेवा (Free Seva) रिपोर्ट</h3>
                 <p className="text-slate-400 text-lg leading-relaxed max-w-3xl font-medium">
                    "Nagrik Setu के माध्यम से देश के हज़ारों वकील और पेशेवर मुफ़्त सेवा (Free Help) दे रहे हैं। हम नागरिकों की सीधी मदद सुनिश्चित करते हैं और इसकी रिपोर्ट साप्ताहिक आधार पर प्रकाशित करते हैं।"
                 </p>
                 <button className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl">Download Detailed Impact Report</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
