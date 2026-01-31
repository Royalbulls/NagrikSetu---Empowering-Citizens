
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { LocalContext } from '../types';

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
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

interface CountryComparisonProps {
  context: LocalContext;
  onEarnPoints: (amount: number) => void;
}

const CountryComparison: React.FC<CountryComparisonProps> = ({ context, onEarnPoints }) => {
  const [countryA, setCountryA] = useState(context.country || 'India');
  const [countryB, setCountryB] = useState('USA');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const countries = [
    "India", "USA", "United Kingdom", "Germany", "Japan", "Norway", 
    "Singapore", "Australia", "Canada", "China", "Russia", "Brazil", 
    "South Africa", "United Arab Emirates", "Switzerland"
  ];

  const handleCompare = async () => {
    if (countryA === countryB) {
      alert("Please select two different countries for comparison.");
      return;
    }
    setLoading(true);
    setResult('');
    setLinks([]);

    try {
      const response = await geminiService.compareGlobalRights(countryA, countryB, context);
      setResult(response.text || "");
      if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(response.candidates[0].groundingMetadata.groundingChunks);
      }
      onEarnPoints(60);
    } catch (error) {
      setResult("तुलना डेटा प्राप्त करने में समस्या आई।");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      if (sourceRef.current) sourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    if (!result) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(result, 'Zephyr');
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
    <div className="space-y-12 animate-fadeIn pb-32">
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-10 md:p-14 rounded-[3.5rem] border border-white/10 shadow-3xl relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-globe-stand text-[200px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">देश vs <span className="text-blue-500">दुनिया</span></h2>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-3 italic">Global Rights & Facilities Comparison</p>
          <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-4xl border-l-4 border-blue-500/50 pl-8">
            "जानिए दुनिया के अलग-अलग देशों में नागरिकों को क्या अधिकार मिलते हैं और वहां की सुविधाएं हमारे मुकाबले कैसी हैं।"
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Country A (Source)</label>
              <select 
                value={countryA} 
                onChange={e => setCountryA(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white text-lg appearance-none outline-none focus:border-blue-500/50 transition-all"
              >
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Country B (Target)</label>
              <select 
                value={countryB} 
                onChange={e => setCountryB(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white text-lg appearance-none outline-none focus:border-blue-500/50 transition-all"
              >
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
           </div>
        </div>

        <button 
          onClick={handleCompare}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-lg hover:bg-blue-500 shadow-3xl transition-all h-20 flex items-center justify-center border-b-4 border-blue-800 active:translate-y-1"
        >
          {loading ? <i className="fas fa-sync fa-spin text-2xl mr-3"></i> : <i className="fas fa-scale-balanced mr-3"></i>}
          <span>तुलना शुरू करें (Compare Now)</span>
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
           <i className="fas fa-dharmachakra fa-spin text-blue-500 text-6xl"></i>
           <p className="text-blue-500/60 font-black uppercase tracking-widest text-[10px] mt-6 animate-pulse">Analyzing International Legal Nodes...</p>
        </div>
      )}

      {result && !loading && (
        <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-3xl border border-white/10 animate-slideUp relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none scale-150">
              <i className="fas fa-file-invoice text-[300px] text-white"></i>
           </div>
           
           <div className="flex justify-between items-center mb-12 relative z-10">
              <div className="flex items-center space-x-5">
                 <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                    <i className="fas fa-check-double text-2xl"></i>
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{countryA} vs {countryB} Report</h3>
                    <p className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em]">NagrikSetu Global Audit</p>
                 </div>
              </div>
              <button 
                onClick={handleSpeak}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-xl scale-105 animate-pulse' : 'bg-slate-800 text-blue-500 border border-blue-500/20'}`}
              >
                 <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-volume-high'} text-xl`}></i>
              </button>
           </div>

           <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-2xl leading-relaxed mb-12 relative z-10 font-medium history-content">
              <ReactMarkdown>{result}</ReactMarkdown>
           </div>

           {links.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">आधिकारिक स्रोत (Official Sources):</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {links.map((link, i) => (
                      <a key={i} href={link.web?.uri} target="_blank" rel="noopener noreferrer" className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group flex items-center justify-between shadow-2xl">
                        <span className="text-white text-xs font-bold uppercase tracking-tight truncate pr-4">{link.web?.title || 'External Ref'}</span>
                        <i className="fas fa-external-link-alt text-slate-800 group-hover:text-blue-500"></i>
                      </a>
                    ))}
                 </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
};

export default CountryComparison;
