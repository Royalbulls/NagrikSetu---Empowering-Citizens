
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext, SchemerInsight } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown';

// Audio Helpers
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
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

interface GlobalSchemersProps {
  context: LocalContext;
  onEarnPoints: (amount: number) => void;
}

const GlobalSchemers: React.FC<GlobalSchemersProps> = ({ context, onEarnPoints }) => {
  const [query, setQuery] = useState('');
  const [insight, setInsight] = useState<SchemerInsight | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'wisdom' | 'modern' | 'profiles'>('wisdom');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const triggerPointsAnimation = (amount: number) => {
    const div = document.createElement('div');
    div.className = 'point-float';
    div.innerText = `+${amount}`;
    div.style.left = `${window.innerWidth / 2}px`;
    div.style.top = `${window.innerHeight / 2}px`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  };

  const handleFetchInsight = async (forcedQuery?: string) => {
    const finalQuery = forcedQuery || query;
    if (!finalQuery) return;
    setLoading(true);
    setInsight(null);
    setAnalysis(null);
    setFeedbackSent(false);
    try {
      if (activeTab === 'wisdom' || activeTab === 'profiles') {
        const data = await geminiService.getSchemerInsight(finalQuery, context);
        setInsight(data);
      } else {
        const data = await geminiService.analyzeModernScam(finalQuery, context);
        setAnalysis(data);
      }
      onEarnPoints(30);
      triggerPointsAnimation(30);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      if (sourceRef.current) sourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = analysis || (insight ? `${insight.name}. ${insight.lesson}. ${insight.tactic}` : "");
    if (!textToSpeak) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(textToSpeak, 'Kore');
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
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
    <div className="space-y-8 animate-fadeIn pb-24">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-center md:text-left">
        <h2 className="text-4xl font-black text-white tracking-tighter">जागरूक नागरिक (Citizen Wisdom)</h2>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="इतिहास के सबक या व्यवहार के बारे में पूछें..."
          className="w-full bg-slate-950 border border-indigo-900/20 rounded-[2.5rem] py-8 px-10 text-white min-h-[120px]"
        />
        <button onClick={() => handleFetchInsight()} disabled={loading || !query} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black mt-4 shadow-xl">
           Analyze Behavioral Case
        </button>
      </div>

      {(insight || analysis) && !loading && (
        <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 animate-slideUp">
           <div className="flex space-x-3 mb-10">
              <button onClick={handleSpeak} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-xl' : 'bg-slate-800 text-amber-500 border border-amber-500/20'}`}>
                 <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                 <span>{isSpeaking ? 'सुनना बंद करें' : 'सुनें (Listen)'}</span>
              </button>
              <button onClick={() => { navigator.clipboard.writeText(analysis || JSON.stringify(insight)); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                 <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                 <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
              </button>
           </div>
           
           {analysis ? <div className="prose prose-invert prose-indigo max-w-none text-slate-200 text-xl leading-relaxed"><ReactMarkdown>{analysis}</ReactMarkdown></div> : (
             <div className="space-y-6">
                <h3 className="text-4xl font-black text-white tracking-tighter">{insight?.name}</h3>
                <p className="text-slate-300 text-xl font-medium leading-relaxed italic">"{insight?.lesson}"</p>
                <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5">
                   <p className="text-indigo-400 font-black text-[10px] uppercase mb-2">Strategy Used:</p>
                   <p className="text-slate-200">{insight?.tactic}</p>
                </div>
             </div>
           )}

           <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase">मददगार विश्लेषण?</span>
              <button onClick={() => { onEarnPoints(10); triggerPointsAnimation(10); setFeedbackSent(true); }} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 flex items-center justify-center transition-all"><i className="fas fa-check"></i></button>
           </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSchemers;
