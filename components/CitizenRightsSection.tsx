import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'react-markdown';

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

interface CitizenRightsSectionProps {
  context: LocalContext;
  onEarnPoints: (amount: number) => void;
  onSearch?: (query: string) => void;
  onDraftApplication?: (subject: string, details: string) => void;
}

const CitizenRightsSection: React.FC<CitizenRightsSectionProps> = ({ context, onEarnPoints, onSearch, onDraftApplication }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [encyclopedia, setEncyclopedia] = useState<any[]>([]);
  const [encyclopediaLoading, setEncyclopediaLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'consult' | 'audit'>('consult');
  const [auditResult, setAuditResult] = useState<{ pehle: string, aaj: string, article: string } | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const fundamentalRights = [
    { num: "14", label: "समानता का अधिकार (Equality)" },
    { num: "19", label: "अभिव्यक्ति की स्वतंत्रता (Freedom)" },
    { num: "21", label: "जीवन और निजता (Life & Privacy)" },
    { num: "25", label: "धार्मिक स्वतंत्रता (Religious Freedom)" },
    { num: "32", label: "संवैधानिक उपचार (Legal Remedy)" }
  ];

  const triggerPointsAnimation = (amount: number) => {
    const div = document.createElement('div');
    div.className = 'point-float';
    div.innerText = `+${amount}`;
    div.style.left = `50%`;
    div.style.top = `50%`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  };

  const handleAnalyze = async (forcedQuery?: string) => {
    const finalQuery = forcedQuery || query;
    if (!finalQuery) return;

    setLoading(true);
    setResult('');
    setAuditResult(null);
    setFeedbackSent(false);
    if (onSearch) onSearch(finalQuery);

    try {
      const response = await geminiService.analyzeCitizenRights(finalQuery, context);
      setResult(response.text || "जानकारी उपलब्ध नहीं है।");
      onEarnPoints(50);
      triggerPointsAnimation(50);
    } catch (error) {
      setResult("त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  const handleAuditRight = async (article: string) => {
    setLoading(true);
    setResult('');
    setAuditResult(null);
    try {
      const result = await geminiService.explainArticle(article, context);
      const text = result.text || "";
      
      // Parse "Pehle vs Aaj" logic from model response
      const parts = text.split(/आज|Aaj/i);
      if (parts.length >= 2) {
        setAuditResult({
          pehle: parts[0],
          aaj: parts[1],
          article: article
        });
      } else {
        setResult(text);
      }
      onEarnPoints(75);
      triggerPointsAnimation(75);
    } catch (e) {
      setResult("ऑडिट विफल रहा।");
    } finally {
      setLoading(false);
    }
  };

  const fetchConsumerLaws = async () => {
    setEncyclopediaLoading(true);
    setResult('');
    setAuditResult(null);
    try {
      const laws = await geminiService.fetchLegalEncyclopedia("Consumer Protection and Rights in India", context);
      setEncyclopedia(laws);
      onEarnPoints(30);
      triggerPointsAnimation(30);
    } catch (e) {
      console.error(e);
    } finally {
      setEncyclopediaLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      if (sourceRef.current) sourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    if (!text) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(text, 'Kore');
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      await ctx.resume();
      const audioBuffer = await decodeAudioData(new Uint8Array(buffer), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      sourceRef.current = source;
      source.start(0);
    } catch (e) { setIsSpeaking(false); }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      {/* 🏛️ Citizen Rights Header */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950 rounded-[3.5rem] p-10 md:p-14 border border-white/10 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none"><i className="fas fa-landmark-dome text-[250px] text-white"></i></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-4">
              <div className="flex bg-slate-950/50 p-1 rounded-2xl border border-white/5 w-fit">
                 <button onClick={() => setActiveTab('consult')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'consult' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}>Rights Consult</button>
                 <button onClick={() => setActiveTab('audit')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'audit' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}>Rights Audit</button>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">नागरिक <span className="text-amber-500">अधिकार</span></h2>
              <p className="text-slate-400 text-lg font-medium italic">"इतिहास की गलतियों को संविधान की शक्ति से सुधारें।"</p>
           </div>
           <button 
            onClick={fetchConsumerLaws}
            className="bg-slate-900 text-amber-500 border border-amber-500/20 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all shadow-3xl flex items-center space-x-3 group"
           >
              <i className="fas fa-cart-shopping group-hover:rotate-12 transition-transform"></i>
              <span>Consumer Hub</span>
           </button>
        </div>
      </div>

      {activeTab === 'audit' && (
        <div className="space-y-8 animate-slideUp">
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {fundamentalRights.map((r, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAuditRight(r.num)}
                  className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 hover:border-amber-500/40 transition-all text-center group relative overflow-hidden"
                >
                   <div className="absolute -top-2 -right-2 opacity-5 text-4xl font-black group-hover:scale-125 transition-transform">{r.num}</div>
                   <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-1">Article {r.num}</p>
                   <p className="text-white font-bold text-[11px] leading-tight">{r.label}</p>
                   <div className="mt-4 pt-3 border-t border-white/5 text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover:text-amber-500">Audit History</div>
                </button>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'consult' && (
        <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl space-y-8 animate-slideUp">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="अपनी समस्या या अधिकार के बारे में पूछें... (उदा: 'पुलिस रिपोर्ट नहीं लिख रही' या 'मेरे वोटिंग अधिकार')"
            className="w-full bg-slate-950 border-2 border-indigo-900/20 rounded-[2.5rem] p-10 text-white text-xl placeholder:text-slate-800 outline-none focus:border-amber-500/30 transition-all min-h-[160px]"
          />
          <button onClick={() => handleAnalyze()} disabled={loading} className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-amber-400 shadow-xl transition-all h-20 flex items-center justify-center">
            {loading ? <i className="fas fa-dharmachakra fa-spin text-2xl"></i> : "कानूनी रास्ता जानें (+50 Points)"}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
           <i className="fas fa-dharmachakra fa-spin text-amber-500 text-6xl"></i>
           <p className="text-amber-500/60 font-black uppercase tracking-widest text-[10px] mt-6 animate-pulse">Analyzing Constitutional Power...</p>
        </div>
      )}

      {auditResult && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
           <div className="bg-slate-900 rounded-[3.5rem] p-10 border-l-[12px] border-rose-600 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><i className="fas fa-hourglass-start text-8xl"></i></div>
              <h3 className="text-rose-500 font-black text-3xl italic uppercase tracking-tighter royal-serif">इतिहास (Pehle)</h3>
              <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest border-b border-white/5 pb-2">Article {auditResult.article}: दमनकारी व्यवस्था</p>
              <div className="prose prose-invert prose-rose max-w-none text-slate-400 text-xl leading-relaxed italic">
                 <ReactMarkdown>{auditResult.pehle}</ReactMarkdown>
              </div>
           </div>
           <div className="bg-slate-900 rounded-[3.5rem] p-10 border-l-[12px] border-blue-600 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><i className="fas fa-building-columns text-8xl"></i></div>
              <h3 className="text-blue-500 font-black text-3xl italic uppercase tracking-tighter royal-serif">संविधान (Aaj)</h3>
              <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest border-b border-white/5 pb-2">Article {auditResult.article}: आपका कानूनी कवच</p>
              <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-xl leading-relaxed font-bold">
                 <ReactMarkdown>{auditResult.aaj}</ReactMarkdown>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                 <button onClick={() => handleSpeak(auditResult.aaj)} className="bg-blue-600/20 text-blue-400 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">Listen Mode</button>
              </div>
           </div>
        </div>
      )}

      {encyclopedia.length > 0 && !encyclopediaLoading && (
        <div className="space-y-8 animate-slideUp">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">प्रमुख उपभोक्ता कानून (Consumer Statutes)</h3>
              <button onClick={() => setEncyclopedia([])} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest">Close List</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {encyclopedia.map((law, idx) => (
                <div key={idx} className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:border-amber-500/30 transition-all group relative overflow-hidden">
                   <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
                      <i className="fas fa-shield-halved text-[100px] text-white"></i>
                   </div>
                   <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                         <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black">{law.year}</span>
                         <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-amber-500 shadow-inner transition-all group-hover:bg-amber-500 group-hover:text-slate-950"><i className="fas fa-gavel"></i></div>
                      </div>
                      <h4 className="text-lg font-black text-white italic leading-tight">{law.title}</h4>
                      <div className="space-y-3 pt-2">
                         <p className="text-xs text-slate-400 italic"><strong>उद्देश्य:</strong> {law.purpose}</p>
                         <p className="text-xs text-emerald-500 font-bold"><strong>लाभ:</strong> {law.benefit}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {result && !loading && (
        <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-3xl border border-amber-500/10 animate-slideUp">
           <div className="flex flex-wrap space-x-3 mb-10">
              <button onClick={() => handleSpeak(result)} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-500'}`}>
                 <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                 <span>{isSpeaking ? 'बंद करें' : 'सुनें (Listen)'}</span>
              </button>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                 <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                 <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
              </button>
           </div>
           <div className="prose prose-invert prose-amber max-w-none text-slate-200 text-xl leading-relaxed mb-12">
              <ReactMarkdown>{result}</ReactMarkdown>
           </div>
           <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-4">
                 <span className="text-[10px] font-black text-slate-500 uppercase">मददगार लगा?</span>
                 <div className="flex space-x-2">
                    <button onClick={() => { triggerPointsAnimation(10); onEarnPoints(10); setFeedbackSent(true); }} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 flex items-center justify-center transition-all"><i className="fas fa-thumbs-up"></i></button>
                    <button onClick={() => setFeedbackSent(true)} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 flex items-center justify-center transition-all"><i className="fas fa-thumbs-down"></i></button>
                 </div>
              </div>
              <button onClick={() => onDraftApplication?.(query || "Citizen Right Issue", result)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-500 transition-all border-b-4 border-indigo-800">शिकायत ड्राफ्ट तैयार करें</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CitizenRightsSection;