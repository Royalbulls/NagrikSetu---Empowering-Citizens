
import React, { useState, useEffect, useRef } from 'react';
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
  const [activeTab, setActiveTab] = useState<'analyzer' | 'lifecycle' | 'encyclopedia'>('analyzer');
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

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950 rounded-[3.5rem] p-12 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none"><i className="fas fa-landmark-dome text-[250px] text-white"></i></div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">नागरिक <span className="text-amber-500">अधिकार</span></h2>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl space-y-8">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="अपनी समस्या लिखें..."
          className="w-full bg-slate-950 border-2 border-indigo-900/20 rounded-[2.5rem] p-10 text-white text-xl placeholder:text-slate-800 outline-none focus:border-amber-500/30 transition-all min-h-[200px]"
        />
        <button onClick={() => handleAnalyze()} disabled={loading || !query} className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-amber-400 shadow-xl transition-all">
          {loading ? <i className="fas fa-sync fa-spin"></i> : "कानूनी रास्ता जानें"}
        </button>
      </div>

      {result && !loading && (
        <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-3xl border border-amber-500/10 animate-slideUp">
           <div className="flex flex-wrap space-x-3 mb-10">
              <button onClick={handleSpeak} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-500 border border-amber-500/20'}`}>
                 <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                 <span>{isSpeaking ? 'सुनना बंद करें' : 'सुनें (Listen)'}</span>
              </button>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                 <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                 <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
              </button>
           </div>
           <div className="prose prose-invert prose-amber max-w-none text-slate-200 text-xl leading-relaxed mb-12">
              <ReactMarkdown>{result}</ReactMarkdown>
           </div>
           <div className="pt-8 border-t border-white/5 flex items-center space-x-4">
              <span className="text-[10px] font-black text-slate-500 uppercase">सहायता मिली?</span>
              <button onClick={() => { handleAnalyze(); triggerPointsAnimation(10); onEarnPoints(10); setFeedbackSent(true); }} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all"><i className="fas fa-check"></i></button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CitizenRightsSection;
