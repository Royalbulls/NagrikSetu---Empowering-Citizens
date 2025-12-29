
import React, { useState, useEffect } from 'react';
import { UserState, LocalContext, AppSection } from '../types';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface EvolutionHubProps {
  user: UserState;
  context: LocalContext;
  onUpdatePoints: (amount: number) => void;
}

const EvolutionHub: React.FC<EvolutionHubProps> = ({ user, context, onUpdatePoints }) => {
  const [feedback, setFeedback] = useState('');
  const [evolutionReport, setEvolutionReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [stages] = useState([
    { level: 1, title: "Base Intel", desc: "History & Law Essentials", req: 0, icon: "fa-seedling" },
    { level: 2, title: "Detection Alpha", desc: "Patterns & Explorer Tools", req: 500, icon: "fa-fingerprint" },
    { level: 3, title: "Aura Awakening", desc: "Voice AI & Soul Connect", req: 1000, icon: "fa-wand-magic-sparkles" },
    { level: 4, title: "Elite Network", desc: "Expert Marketplace Access", req: 1500, icon: "fa-user-tie" },
    { level: 5, title: "Guardian Prime", desc: "Full System Autonomy", req: 2000, icon: "fa-crown" }
  ]);

  const currentStage = user.stage || 1;

  const handleEvolveRequest = async () => {
    if (!feedback.trim()) return;
    setLoading(true);
    try {
      // Simulate AI analyzing feedback to "Evolve" the app
      const ai = await geminiService.explainWithAnalogy(
        `User is at Stage ${currentStage} with ${user.points} points. They suggest: "${feedback}". 
        Create a mystical "Evolution Report" explaining how the system is upgrading its logic or adding a secret sub-feature in the next cycle based on this input.`, 
        context
      );
      setEvolutionReport(ai);
      setFeedback('');
      onUpdatePoints(50);
    } catch (e) {
      setEvolutionReport("इवोल्यूशन डेटा सिंक करने में बाधा आई।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      {/* 🧬 DNA Header */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 border border-emerald-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-dna text-[300px] text-emerald-500"></i>
        </div>
        <div className="relative z-10 space-y-6">
           <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-slate-950 shadow-2xl">
                 <i className="fas fa-microchip text-3xl"></i>
              </div>
              <div>
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">सिस्टम <span className="text-emerald-400">विकास</span> केंद्र</h2>
                 <p className="text-emerald-500/60 font-black text-[10px] uppercase tracking-[0.4em] mt-2">NagrikSetu Self-Evolution Protocol v4.0</p>
              </div>
           </div>
           <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-2xl border-l-4 border-emerald-500/30 pl-8 py-2">
             "NagrikSetu कोई स्टैटिक ऐप नहीं है। यह आपकी प्रोग्रेस और फीडबैक के साथ खुद को अपग्रेड करता है। जैसे-जैसे आप सीखेंगे, नए टूल्स खुद-ब-खुद जन्म लेंगे।"
           </p>
        </div>
      </div>

      {/* 🎮 Progression Roadmap */}
      <div className="space-y-8">
         <h3 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
           <i className="fas fa-map-location-dot text-emerald-500"></i>
           विकास पथ (Evolution Roadmap)
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stages.map((s) => {
               const isCurrent = s.level === currentStage;
               const isLocked = s.req > user.points;
               return (
                 <div key={s.level} className={`p-6 rounded-3xl border transition-all duration-700 relative overflow-hidden ${isCurrent ? 'bg-emerald-600/20 border-emerald-500 shadow-2xl scale-105' : (isLocked ? 'bg-slate-900/50 border-white/5 opacity-50 grayscale' : 'bg-slate-900 border-white/10')}`}>
                    {isCurrent && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                       <i className={`fas ${isLocked ? 'fa-lock' : s.icon} text-sm`}></i>
                    </div>
                    <h4 className="text-white font-black text-xs uppercase mb-1">{s.title}</h4>
                    <p className="text-slate-500 text-[8px] font-bold uppercase leading-tight">{s.desc}</p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                       <span className="text-[9px] font-black text-emerald-500">Stage {s.level}</span>
                       <span className="text-[9px] font-mono text-slate-600">{s.req} pts</span>
                    </div>
                 </div>
               );
            })}
         </div>
      </div>

      {/* 🚀 Evolution Input Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
         <div className="lg:col-span-1 bg-slate-900 p-10 rounded-[3.5rem] border border-emerald-500/10 shadow-xl space-y-8">
            <div className="space-y-2">
               <h3 className="text-2xl font-black text-white italic uppercase">अगला फीचर क्या हो?</h3>
               <p className="text-slate-500 text-xs leading-relaxed font-bold">आपका फीडबैक सिस्टम के 'DNA' को बदल देगा। AI आपकी डिमांड के हिसाब से नए मॉड्यूल डिजाइन करेगा।</p>
            </div>
            <textarea 
               value={feedback}
               onChange={(e) => setFeedback(e.target.value)}
               placeholder="लिखें: 'मुझे खेती के लिए कानून चाहिए' या 'ऐप की थीम डार्क ब्लू कर दें'..."
               className="w-full bg-slate-950 border border-white/5 rounded-[2rem] p-6 text-white text-sm focus:border-emerald-500/50 outline-none transition-all min-h-[120px]"
            />
            <button 
               onClick={handleEvolveRequest}
               disabled={loading || !feedback.trim()}
               className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 shadow-3xl disabled:opacity-30 transition-all h-16 flex items-center justify-center space-x-3"
            >
               {loading ? <i className="fas fa-dna fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
               <span>Submit For Evolution</span>
            </button>
         </div>

         <div className="lg:col-span-2">
            {evolutionReport ? (
               <div className="bg-slate-900/40 p-12 rounded-[4rem] border-2 border-dashed border-emerald-500/30 animate-slideUp relative">
                  <div className="absolute top-0 right-0 p-8">
                     <span className="bg-emerald-500 text-slate-950 px-4 py-1 rounded-full text-[8px] font-black uppercase italic">Report SEC-9</span>
                  </div>
                  <h4 className="text-2xl font-black text-emerald-500 mb-8 flex items-center gap-3">
                     <i className="fas fa-file-code"></i> Evolution Report Generated
                  </h4>
                  <div className="prose prose-invert prose-emerald max-w-none text-slate-300 text-lg leading-relaxed font-mono">
                     <ReactMarkdown>{evolutionReport}</ReactMarkdown>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Rewards Secured: +50 Evolution Points</p>
                     <button onClick={() => setEvolutionReport('')} className="text-[9px] font-black text-emerald-500 underline underline-offset-4 uppercase">Close Protocol</button>
                  </div>
               </div>
            ) : (
               <div className="bg-slate-900/30 rounded-[4rem] border-4 border-dashed border-white/5 p-20 text-center flex flex-col items-center justify-center space-y-6 grayscale opacity-40 group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                  <i className="fas fa-terminal text-6xl text-emerald-500 group-hover:animate-pulse"></i>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">विकास रिपोर्ट के लिए फीडबैक दें</h3>
                  <p className="text-slate-500 max-w-md mx-auto font-bold text-sm">सिस्टम आपके विचारों का इंतजार कर रहा है। आपका सुझाव ही अगली बड़ी अपडेट बनेगा।</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default EvolutionHub;
