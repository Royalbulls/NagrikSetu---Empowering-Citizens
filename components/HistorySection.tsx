
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'https://esm.sh/react-markdown';
import { LocalContext, TimelineEvent, SavedSession } from '../types';

// Audio Helpers
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

interface HistorySectionProps {
  onUpdatePoints: (amount: number) => void;
  onSearch?: (query: string) => void;
  context: LocalContext;
  onDraftApplication?: (subject: string, details: string) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({ onUpdatePoints, onSearch, context, onDraftApplication }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
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

  const handleAsk = async (mode: 'deep' | 'timeline', forcedQuery?: string) => {
    const activeQuery = forcedQuery || query;
    if (!activeQuery) return;
    setLoading(true);
    setResponse('');
    setTimelineEvents([]);
    setFeedbackSent(false);
    if (onSearch) onSearch(activeQuery);

    try {
      let points = 0;
      if (mode === 'timeline') {
        const events = await geminiService.getQueryTimeline(activeQuery, context);
        setTimelineEvents(events);
        points = 50;
      } else {
        const result = await geminiService.askEraComparison(activeQuery, context);
        setResponse(result.text || "विवरण प्राप्त नहीं हुआ।");
        points = 60;
      }
      onUpdatePoints(points);
      triggerPointsAnimation(points);
    } catch (error: any) {
      setResponse("इतिहास के सेतु से जुड़ने में त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = async () => {
    if (isSpeaking) {
      if (sourceRef.current) sourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    if (!response) return;
    setIsSpeaking(true);
    try {
      const audioBytes = await geminiService.speak(response, 'Kore');
      if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      const buffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
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
      onUpdatePoints(10);
      triggerPointsAnimation(10);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      <div className="bg-slate-900 rounded-[3.5rem] p-10 border border-amber-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12"><i className="fas fa-monument text-[250px] text-white"></i></div>
        <div className="relative z-10 space-y-10">
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">पहिले और <span className="text-amber-500">आज</span></h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="किसी ऐतिहासिक घटना या पुरानी व्यवस्था के बारे में पूछें..."
            className="w-full bg-slate-950 border-2 border-amber-900/20 rounded-[2.5rem] p-10 text-white text-xl placeholder:text-slate-800 outline-none focus:border-amber-500/30 transition-all min-h-[160px]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <button onClick={() => handleAsk('deep')} disabled={loading || !query} className="bg-amber-500 text-slate-950 py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 shadow-xl transition-all">युग तुलना विश्लेषण</button>
             <button onClick={() => handleAsk('timeline')} disabled={loading || !query} className="bg-emerald-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500 shadow-xl transition-all">ऐतिहासिक कालक्रम</button>
          </div>
        </div>
      </div>

      {loading && <div className="flex justify-center py-20"><i className="fas fa-history fa-spin text-amber-500 text-4xl"></i></div>}

      {response && !loading && (
        <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-3xl border border-amber-500/10 animate-slideUp relative overflow-hidden">
           <div className="flex flex-wrap justify-between items-center mb-10 gap-6">
              <div className="flex space-x-3">
                 <button onClick={handleSpeech} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-500 border border-amber-500/20'}`}>
                    <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                    <span>{isSpeaking ? 'सुनना बंद करें' : 'सुनें (Listen)'}</span>
                 </button>
                 <button onClick={() => { navigator.clipboard.writeText(response); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                    <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                 </button>
              </div>
              <button onClick={() => onDraftApplication?.(query, response)} className="bg-amber-500 text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg">आवेदन पत्र में बदलें</button>
           </div>
           <div className="prose prose-invert prose-amber max-w-none text-slate-200 text-xl leading-relaxed mb-12">
              <ReactMarkdown>{response}</ReactMarkdown>
           </div>
           <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-3">
                 <span className="text-[10px] font-black text-slate-500 uppercase">क्या जानकारी ज्ञानवर्धक थी?</span>
                 <div className="flex space-x-2">
                    <button onClick={() => handleFeedback(true)} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center transition-all"><i className="fas fa-thumbs-up"></i></button>
                    <button onClick={() => handleFeedback(false)} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center transition-all"><i className="fas fa-thumbs-down"></i></button>
                 </div>
              </div>
              {feedbackSent && <span className="text-[10px] font-black text-emerald-500 italic uppercase">शुक्रिया! आपको +10 बोनस पॉइंट मिले हैं।</span>}
           </div>
        </div>
      )}
    </div>
  );
};

export default HistorySection;
