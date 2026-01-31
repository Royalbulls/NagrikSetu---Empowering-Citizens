import React from 'react';
import { AppSection } from '../types';

interface LauncherProps {
  onSelectApp: (section: AppSection) => void;
  points: number;
  isGuest?: boolean;
  onLogin?: () => void;
}

const Launcher: React.FC<LauncherProps> = ({ onSelectApp, points, isGuest, onLogin }) => {
  const knowledgeApps = [
    {
      id: AppSection.HUB,
      name: "NagrikSetu Hub",
      tagline: "Education & Awareness",
      hindi: "नागरिक सेतु",
      desc: "इतिहास (Pehle), संविधान (Aaj) और भ्रामक कानूनों का पर्दाफाश।",
      icon: "fa-shield-halved",
      color: "from-amber-500 to-orange-600",
      reward: "+150 Points"
    },
    {
      id: AppSection.EPAPER,
      name: "Daily Education Feed",
      tagline: "Aaj Kya Chal Raha Hai",
      hindi: "ताज़ा खबरें",
      desc: "आज की घटनाओं का संवैधानिक और ऐतिहासिक विश्लेषण।",
      icon: "fa-newspaper",
      color: "from-rose-500 to-red-600",
      reward: "Learn & Earn"
    },
    {
      id: AppSection.GLOBAL_COMPARISON,
      name: "Global Rights Audit",
      tagline: "Country Comparison",
      hindi: "देश vs दुनिया",
      desc: "भारत और अन्य देशों के नागरिक अधिकारों एवं सुविधाओं की तुलना।",
      icon: "fa-scale-balanced",
      color: "from-blue-500 to-indigo-600",
      reward: "+60 Points"
    }
  ];

  const advisorApps = [
    {
      id: AppSection.FINANCE_ADVISORY,
      name: "Finance Shield",
      tagline: "Financial Advisory",
      hindi: "वित्तीय सुरक्षा",
      desc: "लोन, इंश्योरेंस और सुरक्षित निवेश की प्रीमियम सलाह।",
      icon: "fa-vault",
      color: "from-emerald-500 to-teal-600",
      reward: "Premium Stats"
    },
    {
      id: AppSection.BUSINESS_ADVISORY,
      name: "Business Hub",
      tagline: "Strategy & Skill",
      hindi: "व्यवसाय एवं करियर",
      desc: "रियल एस्टेट, बैंकिंग ट्रेनिंग और आत्मनिर्भर बनने के मार्ग।",
      icon: "fa-chart-line",
      color: "from-blue-500 to-indigo-600",
      reward: "Wealth Growth"
    }
  ];

  const testimonials = [
    { name: "राहुल कुमार", text: "संविधान की धाराओं को इतनी आसानी से मैंने पहले कभी नहीं समझा। ePaper वाकई लाजवाब है!", role: "छात्र" },
    { name: "मनीषा वर्मा", text: "पुराने नियमों के बारे में पढ़कर मेरी आंखें खुल गई। अब मुझे कोई गुमराह नहीं कर सकता।", role: "जागरूक नागरिक" },
    { name: "विकास जैन", text: "RBA की वित्तीय सलाह से मैंने सही इंश्योरेंस चुना। पॉइंट्स कमाना एक मज़ेदार अनुभव है।", role: "व्यवसायी" }
  ];

  const problems = [
    { p: "कानूनी भाषा समझ नहीं आती?", s: "हम जटिल कानूनों को सरल हिंदी में समझाते हैं।" },
    { p: "धोखाधड़ी वाली स्कीमों से डर लगता है?", s: "AI द्वारा प्रमाणित वित्तीय सुरक्षा और सलाह।" },
    { p: "अपने अधिकारों का पता नहीं?", s: "संविधान (Samvidhan) सेक्शन में अपनी शक्ति जानें।" }
  ];

  return (
    <div className="space-y-24 animate-fadeIn py-12 max-w-7xl mx-auto px-4">
      {/* 🚀 Hero Section */}
      <div className="text-center space-y-8 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full -z-10"></div>
        <div className="inline-flex items-center space-x-4 bg-amber-500/10 border border-amber-500/20 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 italic shadow-2xl">
          <i className="fas fa-crown mr-2"></i> RBA ADVISOR • EDUCATION & WEALTH STORE
        </div>
        <div className="space-y-4">
           <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none royal-serif">
             नागरिक <span className="text-amber-500">सेतु</span> स्टोर
           </h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">इतिहास (Pehle), संविधान (Aaj) और भविष्य की शक्ति</p>
        </div>
        
        {isGuest && (
          <div className="pt-8">
             <button onClick={onLogin} className="bg-amber-500 text-slate-950 px-16 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-amber-400 shadow-[0_0_60px_rgba(245,158,11,0.3)] transition-all transform hover:scale-105 active:scale-95 border-b-4 border-amber-700">
                Unlock Full Access & Points
             </button>
          </div>
        )}
      </div>

      {/* 🛠️ Problem & Solution (Guest Only Focus) */}
      {isGuest && (
        <section className="space-y-12 bg-slate-900/50 p-12 rounded-[4rem] border border-white/5">
           <h3 className="text-3xl font-black text-white uppercase text-center italic tracking-tighter">हम क्या <span className="text-rose-500">हल</span> करते हैं?</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {problems.map((item, i) => (
                <div key={i} className="space-y-4 text-center">
                   <p className="text-rose-400 font-bold italic text-lg leading-tight">"{item.p}"</p>
                   <i className="fas fa-arrow-down text-slate-700"></i>
                   <p className="text-emerald-400 font-black uppercase text-xs tracking-widest leading-relaxed">{item.s}</p>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* 📚 Knowledge Apps Grid */}
      <div className="space-y-12">
        <div className="flex items-center gap-4">
           <div className="h-px bg-amber-500/20 flex-1"></div>
           <h3 className="text-amber-500 font-black uppercase tracking-[0.3em] text-[10px]">शिक्षा एवं जागरूकता (Education Apps)</h3>
           <div className="h-px bg-amber-500/20 flex-1"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {knowledgeApps.map((app, i) => (
            <button
              key={i}
              onClick={() => onSelectApp(app.id)}
              className="group relative royal-card p-10 rounded-[3rem] text-left transition-all duration-700 shadow-2xl hover:shadow-amber-500/5"
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-[0.08] blur-[80px] transition-opacity duration-700`}></div>
              <div className="relative z-10 flex items-start justify-between mb-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <i className={`fas ${app.icon}`}></i>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none royal-serif group-hover:text-amber-500 transition-colors">{app.name}</h3>
                <p className="text-amber-500/80 font-black text-[10px] uppercase tracking-[0.4em]">{app.tagline}</p>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic pt-4 border-t border-white/5">{app.desc}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{app.reward}</span>
                 <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-slate-950">
                   <i className="fas fa-arrow-right text-sm"></i>
                 </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 💰 Advisor Apps Grid */}
      <div className="space-y-12">
        <div className="flex items-center gap-4">
           <div className="h-px bg-emerald-500/20 flex-1"></div>
           <h3 className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px]">सलाह एवं उन्नति (Financial Advisor)</h3>
           <div className="h-px bg-emerald-500/20 flex-1"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {advisorApps.map((app, i) => (
            <button
              key={i}
              onClick={() => onSelectApp(app.id)}
              className="group relative royal-card p-10 rounded-[3rem] text-left transition-all duration-700 shadow-2xl hover:shadow-emerald-500/5"
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-[0.08] blur-[80px] transition-opacity duration-700`}></div>
              <div className="relative z-10 flex items-start justify-between mb-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <i className={`fas ${app.icon}`}></i>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none royal-serif group-hover:text-emerald-400 transition-colors">{app.name}</h3>
                <p className="text-emerald-500/80 font-black text-[10px] uppercase tracking-[0.4em]">{app.tagline}</p>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic pt-4 border-t border-white/5">{app.desc}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{app.reward}</span>
                 <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-slate-950">
                   <i className="fas fa-arrow-right text-sm"></i>
                 </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 Testimonials (Public Trust) */}
      <section className="space-y-12">
        <h3 className="text-2xl font-black text-white uppercase text-center italic tracking-widest">नागरिकों की <span className="text-amber-500">आवाज़</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {testimonials.map((t, i) => (
             <div key={i} className="bg-slate-900/30 p-8 rounded-3xl border border-white/5 italic">
                <p className="text-slate-300 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-black text-xs">{t.name[0]}</div>
                   <div>
                      <p className="text-white font-black text-xs uppercase">{t.name}</p>
                      <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{t.role}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 🏢 Corporate Badge */}
      <div className="pt-20 border-t border-white/5 flex flex-col items-center space-y-6 text-center">
         <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em]">Powered by Royal Bulls Advisory Private Limited</p>
         <div className="flex gap-10 opacity-20 grayscale hover:grayscale-0 hover:opacity-50 transition-all">
            <i className="fas fa-building-columns text-3xl"></i>
            <i className="fas fa-shield-halved text-3xl"></i>
            <i className="fas fa-scale-balanced text-3xl"></i>
         </div>
      </div>
    </div>
  );
};

export default Launcher;