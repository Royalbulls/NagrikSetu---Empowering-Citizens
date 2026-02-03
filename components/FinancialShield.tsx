
import React, { useState, useRef } from 'react';
import AdSlot from './AdSlot';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { LocalContext } from '../types';

// Audio Helpers
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  let arrayBuffer = data.buffer;
  let byteOffset = data.byteOffset;
  if (byteOffset % 2 !== 0) {
    const copy = new Uint8Array(data.byteLength);
    copy.set(data);
    arrayBuffer = copy.buffer;
    byteOffset = 0;
  }
  const length = Math.floor(data.byteLength / 2);
  const dataInt16 = new Int16Array(arrayBuffer, byteOffset, length);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const FinancialShield: React.FC<{ context: LocalContext; onEarnPoints: (v: number) => void }> = ({ context, onEarnPoints }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [links, setLinks] = useState<any[]>([]);

  const highValueTopics = [
    { title: "Best Life Insurance Plan", icon: "fa-heart-pulse", tag: "Insurance" },
    { title: "Personal Loan Eligibility", icon: "fa-money-bill-trend-up", tag: "Loans" },
    { title: "Improve Credit Score Fast", icon: "fa-gauge-high", tag: "Credit Score" },
    { title: "Health Insurance Claims", icon: "fa-hospital-user", tag: "Medical" }
  ];

  const handleConsult = async (forced?: string) => {
    const q = forced || query;
    if(!q) return;
    setLoading(true);
    setResult('');
    setLinks([]);
    try {
      const res = await geminiService.analyzeFinancialSafety(q, context);
      setResult(res.text || "");
      if (res.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(res.candidates[0].groundingMetadata.groundingChunks);
      }
      onEarnPoints(50);
    } catch (e) {
      setResult("वित्तीय परामर्श सर्वर अभी व्यस्त है।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      {/* 💰 Finance Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-12 rounded-[4rem] border-2 border-indigo-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none scale-150 rotate-12">
          <i className="fas fa-vault text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
           <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Finance <span className="text-amber-500">Shield</span></h2>
           <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-3xl border-l-4 border-amber-500/50 pl-6">
             "लोन, इंश्योरेंस और निवेश की सही जानकारी ही आपकी सबसे बड़ी बचत है। हमारे AI एक्सपर्ट से प्रीमियम वित्तीय सलाह लें।"
           </p>
        </div>
      </div>

      {/* 📢 Ad Placement (Keyword Trigger) */}
      <AdSlot className="h-[200px]" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {highValueTopics.map((topic, i) => (
           <button 
            key={i} onClick={() => { setQuery(topic.title); handleConsult(topic.title); }}
            className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500/40 transition-all text-center group"
           >
              <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-amber-500 text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                 <i className={`fas ${topic.icon}`}></i>
              </div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest">{topic.title}</h4>
              <span className="text-[8px] font-black text-slate-500 uppercase mt-2 block">{topic.tag}</span>
           </button>
         ))}
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/10 shadow-2xl">
         <div className="flex flex-col md:flex-row gap-6">
            <textarea 
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="आपका वित्तीय सवाल (जैसे: 'Best health insurance for family' या 'Car loan interest rates')..."
              className="flex-1 bg-slate-950 border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-amber-500/30"
            />
            <button 
              onClick={() => handleConsult()}
              disabled={loading}
              className="bg-amber-500 text-slate-950 px-12 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl h-20 md:h-auto"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "Consult AI"}
            </button>
         </div>
      </div>

      {result && (
        <div className="bg-slate-900/60 p-12 rounded-[4rem] border border-amber-500/10 animate-slideUp">
           <div className="prose prose-invert prose-amber max-w-none text-slate-200 text-xl leading-relaxed">
              <ReactMarkdown>{result}</ReactMarkdown>
           </div>

           {/* Added: Search Grounding Link Rendering correctly as per guidelines */}
           {links.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/5">
                 <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">आधिकारिक वित्तीय स्रोत (Verified Sources):</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {links.map((link, i) => (
                      <a key={i} href={link.web?.uri} target="_blank" rel="noopener noreferrer" className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group flex items-center justify-between shadow-lg">
                        <span className="text-white text-xs font-bold truncate pr-4">{link.web?.title || 'External Ref'}</span>
                        <i className="fas fa-external-link-alt text-slate-800 group-hover:text-amber-500"></i>
                      </a>
                    ))}
                 </div>
              </div>
           )}

           {/* Secondary Ad for high retention */}
           <AdSlot className="mt-12 h-[250px]" format="fluid" />
        </div>
      )}
    </div>
  );
};

export default FinancialShield;
