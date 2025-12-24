
import React, { useState, useEffect, useCallback } from 'react';
import { AppSection } from '../types';
import { geminiService } from '../services/geminiService';
import AdSlot from './AdSlot';

interface KnowledgeHubProps { 
  setActiveSection: (section: AppSection) => void; 
  language: string;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ setActiveSection, language }) => {
  const [randomFact, setRandomFact] = useState<string>('');
  const [factLoading, setFactLoading] = useState(false);
  const isHindi = language === 'Hindi';

  const fetchFact = useCallback(async () => {
    setFactLoading(true);
    try {
      const fact = await geminiService.generateDidYouKnow("Global History and Linguistic Laws", { language, country: 'India' });
      setRandomFact(fact);
    } catch (e: any) { 
      setRandomFact(isHindi ? "संविधान हमें भाषा के चुनाव का अधिकार देता है (अनुच्छेद 343-351)।" : "The Constitution gives us the right to choose our language (Articles 343-351).");
    } finally { 
      setFactLoading(false); 
    }
  }, [language, isHindi]);

  useEffect(() => {
    fetchFact();
  }, [fetchFact]);

  const categories = [
    {
      title: isHindi ? "इतिहास और कालक्रम" : "History & Chronology",
      icon: "fa-hourglass-half",
      color: "from-amber-500 to-amber-700",
      items: [
        { id: AppSection.HISTORY, label: isHindi ? "पहिले और आज" : "Then vs Now", sub: "Global History Comparison", icon: "fa-monument" },
        { id: AppSection.WEEKLY_TIMELINE, label: isHindi ? "आज का इतिहास" : "Today in History", sub: "History Wheel", icon: "fa-timeline" },
        { id: AppSection.EXPLORER, label: isHindi ? "ग्लोबल एक्सप्लोरर" : "Global Explorer", sub: "Satellite Scan", icon: "fa-earth-asia" },
      ]
    },
    {
      title: isHindi ? "अधिकार और न्याय" : "Rights & Justice",
      icon: "fa-scale-balanced",
      color: "from-blue-500 to-blue-700",
      items: [
        { id: AppSection.CITIZEN_RIGHTS, label: isHindi ? "अधिकार और कर्तव्य" : "Rights Hub", sub: "Legal Empowerment", icon: "fa-landmark-dome" },
        { id: AppSection.LAW, label: isHindi ? "कानून सहायता" : "Legal Aid", sub: "Ask a Question", icon: "fa-scale-unbalanced" },
        { id: AppSection.FINANCE, label: isHindi ? "वित्तीय कवच" : "Financial Shield", sub: "Scam Protection & Rights", icon: "fa-vault" },
        { id: AppSection.APPLICATION_WRITER, label: isHindi ? "आवेदन सहायक" : "Aavedan Writer", sub: "Draft Professional Letters", icon: "fa-file-pen" },
        { id: AppSection.CONSTITUTION, label: isHindi ? "संवैधानिक कवच" : "Constitution", sub: "Rights Access", icon: "fa-book-open" },
        { id: AppSection.CRIMINOLOGY, label: isHindi ? "अपराध विज्ञान" : "Criminology", sub: "Psych Profile", icon: "fa-user-secret" },
      ]
    },
    {
      title: isHindi ? "व्यक्तिगत विकास" : "Growth & Rewards",
      icon: "fa-gem",
      color: "from-emerald-500 to-emerald-700",
      items: [
        { id: AppSection.DAILY_PRACTICE, label: isHindi ? "दैनिक साधना" : "Daily Ritual", sub: "Self Mastery", icon: "fa-crown" },
        { id: AppSection.MY_STORY, label: isHindi ? "मेरी कहानी" : "My Story", sub: "Digital Memoir", icon: "fa-feather-pointed" },
        { id: AppSection.COMPETITION, label: isHindi ? "प्रतियोगिता" : "Competition", sub: "Leaderboard", icon: "fa-trophy" },
      ]
    }
  ];

  const quests = [
    { title: isHindi ? "नागरिक अधिकार" : "Citizen Rights", points: 50, icon: "fa-landmark-dome", section: AppSection.CITIZEN_RIGHTS },
    { title: isHindi ? "वित्तीय सुरक्षा" : "Finance Safety", points: 40, icon: "fa-vault", section: AppSection.FINANCE },
    { title: isHindi ? "इतिहास के पन्ने" : "Pages of History", points: 50, icon: "fa-scroll", section: AppSection.HISTORY }
  ];

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      {/* Dynamic Knowledge Banner */}
      <div className="bg-slate-900 rounded-[3rem] p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex-1 flex items-center space-x-6">
               <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                  <i className="fas fa-bolt text-xl animate-pulse"></i>
               </div>
               <div className="min-w-0">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Knowledge Radar (आज का ज्ञान)</h4>
                  {factLoading ? (
                    <div className="h-4 bg-white/5 rounded w-64 animate-pulse mt-1"></div>
                  ) : (
                    <p className="text-white font-bold italic text-lg leading-relaxed line-clamp-2">
                      {randomFact || "सभ्यता का पहिया घूम रहा है..."}
                    </p>
                  )}
               </div>
            </div>
            <button 
              onClick={fetchFact}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Scan New Facts
            </button>
         </div>
      </div>

      <AdSlot className="mx-4" />

      {/* Learn & Earn Quests */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] flex items-center">
          <i className="fas fa-coins text-amber-500 mr-3"></i>
          {isHindi ? "सीखें और कमाएं" : "Learn & Earn Quests"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quests.map((quest, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(quest.section)}
              className="bg-slate-900/60 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/40 p-6 rounded-3xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                  <i className={`fas ${quest.icon} text-lg`}></i>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-white uppercase tracking-tight">{quest.title}</p>
                  <p className="text-[10px] text-amber-500/60 font-black uppercase">Earn +{quest.points} Coins</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-slate-700 group-hover:text-amber-500 transition-colors"></i>
            </button>
          ))}
        </div>
      </div>

      {/* Categorized Module Grid */}
      <div className="space-y-16">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                <i className={`fas ${cat.icon}`}></i>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{cat.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="group bg-slate-900 border border-white/5 hover:border-amber-500/30 p-8 rounded-[2.5rem] text-left hover:scale-[1.02] transition-all shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none scale-125">
                    <i className={`fas ${item.icon} text-[120px] text-white`}></i>
                  </div>
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    <i className={`fas ${item.icon} text-xl`}></i>
                  </div>
                  <h4 className="text-xl font-black text-white mb-1">{item.label}</h4>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">{item.sub}</p>
                  <div className="mt-6 flex items-center text-amber-500 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    <span>EXPLORE NOW</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </div>
                </button>
              ))}
            </div>
            {idx === 0 && <AdSlot />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeHub;
