
import React, { useState, useEffect } from 'react';
import { AppSection } from '../types';
import { geminiService } from '../services/geminiService';

interface KnowledgeHubProps { 
  setActiveSection: (section: AppSection) => void; 
  language: string;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ setActiveSection, language }) => {
  const [randomFact, setRandomFact] = useState<string>('');
  const [factLoading, setFactLoading] = useState(false);

  useEffect(() => {
    const fetchFact = async () => {
      setFactLoading(true);
      try {
        const fact = await geminiService.generateDidYouKnow("Global History and Linguistic Laws", { language, country: 'India' });
        setRandomFact(fact);
      } catch (e) { console.error(e); }
      finally { setFactLoading(false); }
    };
    fetchFact();
  }, [language]);

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      {/* Hero Header */}
      <div className="bg-slate-900 rounded-[3rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none scale-125">
          <i className="fas fa-earth-americas text-[180px] text-blue-500 animate-spin-slow"></i>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase">नागरिक सेतु <span className="text-blue-500">Global</span></h2>
          <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
            {language === 'Hindi' 
              ? "दुनिया का इतिहास, भाषा का कानून, और आज की खबरें — सब एक ही जगह। ज्ञान बढ़ाएं और पॉइंट्स कमाएं।" 
              : "Global History, Language Laws, and Today's News — all in one place. Learn and Earn points."}
          </p>
        </div>
      </div>

      {/* Featured Master Cards - Key requests by user */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          onClick={() => setActiveSection(AppSection.HISTORY)}
          className="group bg-gradient-to-br from-amber-600/20 to-slate-900 border border-amber-500/30 p-10 rounded-[3rem] text-left hover:scale-[1.02] transition-all shadow-xl"
        >
          <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
            <i className="fas fa-clock-rotate-left text-2xl"></i>
          </div>
          <h3 className="text-3xl font-black text-white italic mb-2">पहिले और संविधान (History)</h3>
          <p className="text-amber-200/60 font-bold uppercase tracking-widest text-[10px] mb-4">Era Comparison (Pehle vs Aaj)</p>
          <p className="text-slate-400 text-sm leading-relaxed">इतिहास की कालक्रम यात्रा। जानें पहिले क्या हुआ और संविधान ने उसे कैसे बदला।</p>
          <div className="mt-6 flex items-center text-amber-500 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            <span>इतिहास देखें (Explore)</span>
            <i className="fas fa-arrow-right ml-2"></i>
          </div>
        </button>

        <button 
          onClick={() => setActiveSection(AppSection.LAW)}
          className="group bg-gradient-to-br from-blue-600/20 to-slate-900 border border-blue-500/30 p-10 rounded-[3rem] text-left hover:scale-[1.02] transition-all shadow-xl"
        >
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
            <i className="fas fa-language text-2xl"></i>
          </div>
          <h3 className="text-3xl font-black text-white italic mb-2">भाषा का कानून (Language Law)</h3>
          <p className="text-blue-300/60 font-bold uppercase tracking-widest text-[10px] mb-4">Bhasha ka Kanun (Linguistic Rights)</p>
          <p className="text-slate-400 text-sm leading-relaxed">आपका संवैधानिक भाषाई कवच। जानें अपनी भाषा के अधिकारों के बारे में।</p>
          <div className="mt-6 flex items-center text-blue-400 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            <span>अधिकार जानें (Know Rights)</span>
            <i className="fas fa-arrow-right ml-2"></i>
          </div>
        </button>
      </div>

      {/* Daily Fact Ticker Widget */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-xl relative overflow-hidden group">
         <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-5">
               <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <i className="fas fa-bolt"></i>
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">आज क्या चल रहा है? (Today's Events)</h4>
                  {factLoading ? (
                    <div className="h-4 bg-white/5 rounded w-64 animate-pulse mt-1"></div>
                  ) : (
                    <p className="text-white font-bold italic leading-relaxed mt-1">
                      {randomFact || "इतिहास की गहराइयों में खोज जारी है..."}
                    </p>
                  )}
               </div>
            </div>
            <button 
              onClick={() => setActiveSection(AppSection.COMPETITION)}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
            >
              Learn & Earn Points
            </button>
         </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter border-l-4 border-amber-500 pl-4">अतिरिक्त ज्ञान केंद्र (More Modules)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: AppSection.WEEKLY_TIMELINE, label: "साप्ताहिक कालक्रम", icon: "fa-timeline", color: "text-amber-500" },
            { id: AppSection.EXPLORER, label: "ग्लोबल एक्सप्लोरर", icon: "fa-earth-asia", color: "text-blue-500" },
            { id: AppSection.CRIMINOLOGY, label: "अपराध विज्ञान", icon: "fa-user-secret", color: "text-rose-500" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 flex items-center space-x-4 hover:bg-slate-800 transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${item.color}`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <span className="text-xs font-black text-white uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub;
