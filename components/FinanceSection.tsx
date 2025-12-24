
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
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

interface FinanceSectionProps {
  context: LocalContext;
  onEarnPoints: (amount: number) => void;
  onSearch?: (query: string) => void;
}

const FinanceSection: React.FC<FinanceSectionProps> = ({ context, onEarnPoints, onSearch }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleAnalyze = async (forcedQuery?: string) => {
    const finalQuery = forcedQuery || query;
    if (!finalQuery) return;

    setLoading(true);
    setResult('');
    setFeedbackSent(false);
    if (onSearch) onSearch(finalQuery);

    try {
      const response = await geminiService.analyzeFinancialSafety(finalQuery, context);
      setResult(response.text || "जानकारी उपलब्ध नहीं है।");
      onEarnPoints(40);
      triggerPointsAnimation(40);
    } catch (error) {
      setResult("त्रुटि हुई।");
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
      const buffer = await geminiService.speak(result, 'Kore');
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

  const handleFeedback = (val: boolean) => {
    if (feedbackSent) return;
    setFeedbackSent(true);
    if (val) {
      onEarnPoints(10);
      triggerPointsAnimation(10);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-800 to-slate-950 rounded-[3.5rem] p-12 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
          <i className="fas fa-shield-heart text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">वित्तीय सुरक्षा <span className="text-emerald-400">कवच</span></h2>
          <p className="text-emerald-100/70 text-xl font-medium leading-relaxed max-w-2xl italic border-l-4 border-emerald-400/50 pl-6">"धोखाधड़ी से बचने के लिए जानकारी ही शक्ति है।"</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 border border-emerald-500/10 shadow-2xl space-y-8">
        <div className="relative group">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="किसी स्कीम या कंपनी के बारे में यहाँ लिखें..."
            className="w-full bg-slate-950 border-2 border-emerald-900/10 rounded-[2.5rem] p-10 text-white text-xl placeholder:text-slate-800 outline-none focus:border-emerald-500/40 transition-all min-h-[160px]"
          />
          <button onClick={() => handleAnalyze()} disabled={loading || !query} className="absolute right-6 bottom-6 h-14 px-10 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-xl uppercase tracking-widest text-xs">
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "जांच शुरू करें"}
          </button>
        </div>
      </div>

      {loading && <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-emerald-500 text-4xl"></i></div>}

      {result && !loading && (
        <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-3xl border border-emerald-500/10 animate-slideUp">
           <div className="flex flex-wrap justify-between items-center mb-10 gap-6">
              <div className="flex space-x-3">
                 <button onClick={handleSpeak} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-500 border border-amber-500/20'}`}>
                    <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                    <span>{isSpeaking ? 'सुनना बंद करें' : 'सुनें (Listen)'}</span>
                 </button>
                 <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                    <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                 </button>
              </div>
           </div>

           <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-xl leading-relaxed mb-12">
              <ReactMarkdown>{result}</ReactMarkdown>
           </div>

           <div className="pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">क्या जानकारी सही थी?</span>
                 <div className="flex space-x-2">
                    <button onClick={() => handleFeedback(true)} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all"><i className="fas fa-thumbs-up"></i></button>
                    <button onClick={() => handleFeedback(false)} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all"><i className="fas fa-thumbs-down"></i></button>
                 </div>
              </div>
              {feedbackSent && <span className="text-[10px] font-black text-emerald-500 uppercase">धन्यवाद!</span>}
           </div>
        </div>
      )}
    </div>
  );
};

export default FinanceSection;
