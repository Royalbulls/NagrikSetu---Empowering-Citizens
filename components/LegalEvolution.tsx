
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'react-markdown';

const LegalEvolution: React.FC<{ context: LocalContext; onEarnPoints: (v: number) => void }> = ({ context, onEarnPoints }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleCompare = async (q?: string) => {
    const activeQuery = q || query;
    if (!activeQuery) return;
    setLoading(true);
    try {
      const res = await geminiService.askUniversalAI(
        `COMPARE OLD VS NEW INDIAN LAWS: Topic is "${activeQuery}". 
        Detail the transition from IPC/CrPC/IEA to BNS/BNSS/BSA. 
        Explain what has changed, what remains same, and specific new section numbers. 
        Focus on professional utility for advocates. Language: ${context.language}.`,
        context
      );
      setResult(res.text || "");
      onEarnPoints(50);
    } catch (e) {
      setResult("डेटा प्राप्त करने में त्रुटि।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-32 max-w-6xl mx-auto">
      <div className="bg-slate-900 p-10 rounded-[3.5rem] border-2 border-blue-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 rotate-12">
          <i className="fas fa-scale-balanced text-[200px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6 text-center md:text-left">
          <div className="flex items-center space-x-6 justify-center md:justify-start">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
              <i className="fas fa-gavel text-2xl"></i>
            </div>
            <div>
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">धारा <span className="text-blue-500">परिवर्तन</span> (BNS vs IPC)</h2>
              <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Professional Legal Migration Hub</p>
            </div>
          </div>
          <p className="text-slate-300 text-lg font-medium leading-relaxed italic border-l-4 border-blue-500/50 pl-6">
            "वकीलों और कानून के छात्रों के लिए: अब पुरानी और नई धाराओं को याद रखने की ज़रूरत नहीं। सिर्फ अपराध का नाम या पुरानी धारा बोलें।"
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
        <div className="relative group">
          <input 
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCompare()}
            placeholder="जैसे: 'IPC 302 vs BNS' या 'चोरी की नई धारा क्या है?'"
            className="w-full bg-slate-950 border-2 border-white/5 rounded-2xl py-6 pl-10 pr-40 text-white text-xl placeholder:text-slate-800 outline-none focus:border-blue-500/50 transition-all"
          />
          <button 
            onClick={() => handleCompare()}
            className="absolute right-3 top-3 bottom-3 px-8 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-all uppercase text-[10px] tracking-widest shadow-xl"
          >
            {loading ? <i className="fas fa-dharmachakra fa-spin text-xl"></i> : "Compare Laws"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-slate-900 p-10 md:p-16 rounded-[4rem] border border-blue-500/10 shadow-3xl animate-slideUp">
           <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-xl leading-relaxed">
              <ReactMarkdown>{result}</ReactMarkdown>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { t: "हत्या (Murder)", q: "IPC 302 vs BNS Murder sections" },
           { t: "ठगी (Fraud)", q: "IPC 420 vs BNS Cheating sections" },
           { t: "मानहानि (Defamation)", q: "Defamation law changes BNS" }
         ].map((item, i) => (
           <button key={i} onClick={() => { setQuery(item.t); handleCompare(item.q); }} className="bg-slate-950 p-6 rounded-2xl border border-white/5 text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all text-xs font-black uppercase tracking-widest text-center">
              Quick Scan: {item.t}
           </button>
         ))}
      </div>
    </div>
  );
};

export default LegalEvolution;
