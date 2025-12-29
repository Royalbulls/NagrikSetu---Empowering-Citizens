
import React, { useState } from 'react';
import AdSlot from './AdSlot';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { LocalContext } from '../types';

const EmergencyRoadLegal: React.FC<{ context: LocalContext; onEarnPoints: (v: number) => void }> = ({ context, onEarnPoints }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const emergencyKits = [
    { title: "Car Accident Lawsuit", icon: "fa-car-burst", desc: "दुर्घटना के बाद कानूनी कदम और हर्जाना।" },
    { title: "Insurance Claim Guide", icon: "fa-file-shield", desc: "रिजेक्ट हुए क्लेम को वापस पाने का तरीका।" },
    { title: "DUI & Traffic Penalties", icon: "fa-road-circle-exclamation", desc: "यातायात नियमों और जुर्माने की जानकारी।" },
    { title: "Emergency Legal Aid", icon: "fa-gavel", desc: "तुरंत कानूनी सहायता कैसे प्राप्त करें।" }
  ];

  const handleEmergencyAsk = async (forced?: string) => {
    const q = forced || query;
    if(!q) return;
    setLoading(true);
    setResult('');
    try {
      const res = await geminiService.askUniversalAI(`EMERGENCY LEGAL QUERY: ${q}. Focus on legal rights, insurance claims, and lawyer procedures in India.`, context);
      setResult(res.text || "");
      onEarnPoints(60);
    } catch (e) {
      setResult("कानूनी सहायता सर्वर अभी व्यस्त है।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      {/* 🚨 Emergency Hero */}
      <div className="bg-gradient-to-br from-rose-900 via-slate-900 to-rose-950 p-12 rounded-[4rem] border-2 border-rose-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none scale-150 rotate-12">
          <i className="fas fa-truck-medical text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
           <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Emergency <span className="text-rose-500">Legal</span></h2>
           <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-3xl border-l-4 border-rose-500/50 pl-6">
             "सड़क दुर्घटना या पुलिस केस? घबराएं नहीं, अपने अधिकारों को जानें। एक्सीडेंट क्लेम और इंश्योरेंस सहायता यहाँ उपलब्ध है।"
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {emergencyKits.map((kit, i) => (
           <button 
            key={i} onClick={() => { setQuery(kit.title); handleEmergencyAsk(kit.title); }}
            className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 hover:border-rose-500/40 transition-all text-left flex items-center space-x-6 group"
           >
              <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-rose-500 text-3xl shadow-xl group-hover:bg-rose-600 group-hover:text-white transition-all">
                 <i className={`fas ${kit.icon}`}></i>
              </div>
              <div>
                 <h4 className="text-white font-black text-sm uppercase tracking-widest">{kit.title}</h4>
                 <p className="text-slate-500 text-[10px] mt-1 font-bold italic">{kit.desc}</p>
              </div>
           </button>
         ))}
      </div>

      {/* 📢 High CPC Ad Placement */}
      <AdSlot className="h-[280px]" format="auto" />

      <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/10 shadow-3xl space-y-8">
         <h3 className="text-2xl font-black text-white italic uppercase tracking-widest flex items-center gap-4">
            <i className="fas fa-shield-halved text-rose-500"></i>
            केस दर्ज करें (Case Filing Support)
         </h3>
         <div className="relative">
            <textarea 
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="अपनी समस्या लिखें (उदा: 'Car accident lawyer near me' या 'How to claim third party insurance')..."
              className="w-full bg-slate-950 border-2 border-white/5 rounded-[2.5rem] p-10 text-white text-xl outline-none focus:border-rose-500/40 min-h-[180px] shadow-inner"
            />
            <button 
              onClick={() => handleEmergencyAsk()}
              disabled={loading}
              className="absolute right-6 bottom-6 bg-rose-600 text-white px-14 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-3xl"
            >
              {loading ? <i className="fas fa-dna fa-spin"></i> : "Get Legal Help"}
            </button>
         </div>
      </div>

      {result && (
        <div className="bg-slate-900/60 p-12 rounded-[4rem] border border-rose-500/10 animate-slideUp relative">
           <div className="absolute top-4 right-8">
              <span className="bg-rose-600/20 text-rose-400 px-4 py-1 rounded-full text-[8px] font-black uppercase">Urgent Advisory</span>
           </div>
           <div className="prose prose-invert prose-rose max-w-none text-slate-200 text-xl leading-relaxed">
              <ReactMarkdown>{result}</ReactMarkdown>
           </div>
           <AdSlot className="mt-12 h-[200px]" format="horizontal" />
        </div>
      )}
    </div>
  );
};

export default EmergencyRoadLegal;
