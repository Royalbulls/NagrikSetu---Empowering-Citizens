import React, { useState, useRef, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { LocalContext, TimelineEvent, QuizQuestion, SavedSession } from '../types';

// Audio Helpers
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  // Fix byte alignment: Int16Array requires buffer to be a multiple of 2
  let arrayBuffer = data.buffer;
  let byteOffset = data.byteOffset;
  if (byteOffset % 2 !== 0) {
    const copy = new Uint8Array(data.byteLength);
    copy.set(data);
    arrayBuffer = copy.buffer;
    byteOffset = 0; // Absolute reset to ensure alignment
  }
  const length = Math.floor(data.byteLength / 2);
  const dataInt16 = new Int16Array(arrayBuffer, byteOffset, length);
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
  const [comparison, setComparison] = useState<{ pehle: string, aaj: string, location: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [spotlightLoading, setSpotlightLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [links, setLinks] = useState<any[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const fetchSpotlight = async () => {
      setSpotlightLoading(true);
      try {
        const insight = await geminiService.fetchSectionSpotlight("Global History, Civilizations, and Moral Values", context);
        setResponse(insight);
      } catch (e) {} finally { setSpotlightLoading(false); }
    };
    fetchSpotlight();
  }, [context.language]);

  const triggerPointsAnimation = (amount: number) => {
    const div = document.createElement('div');
    div.className = 'point-float';
    div.innerText = `+${amount}`;
    div.style.left = `50%`;
    div.style.top = `50%`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  };

  const handleLocalHeritageScan = async () => {
    setLoading(true);
    setResponse('');
    setComparison(null);
    setLinks([]);

    const locationPrompt = context.city ? `${context.city}, ${context.country}` : "मेरे वर्तमान स्थान";
    const prompt = `विश्लेषण करें: "${locationPrompt}" का 'स्थानीय कानून' (पुराना/रियासत का कानून) बनाम आज का 'भारतीय संविधान'।
    Format: मुझे बताएं कि यहाँ पहले कौन सी व्यवस्था चलती थी और आज नागरिक के क्या अधिकार हैं।`;

    try {
      const result = await geminiService.askEraComparison(prompt, context);
      const text = result.text || "";
      
      const parts = text.split(/आज|Aaj/i);
      if (parts.length >= 2) {
        setComparison({
          pehle: parts[0],
          aaj: parts[1],
          location: context.city || "भारत"
        });
      } else {
        setResponse(text);
      }

      if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(result.candidates[0].groundingMetadata.groundingChunks);
      }

      onUpdatePoints(75);
      triggerPointsAnimation(75);
    } catch (e) {
      setResponse("विरासत डेटा प्राप्त करने में त्रुटि।");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async (mode: 'deep' | 'timeline', forcedQuery?: string) => {
    const activeQuery = forcedQuery || query;
    if (!activeQuery) return;
    setLoading(true);
    setResponse('');
    setComparison(null);
    setLinks([]);

    try {
      if (mode === 'timeline') {
        const events = await geminiService.getQueryTimeline(activeQuery, context);
        setResponse(events.map(e => `**${e.year}**: ${e.event} - ${e.description}`).join('\n\n'));
        onUpdatePoints(50);
      } else {
        const result = await geminiService.askEraComparison(activeQuery, context);
        setResponse(result.text || "");
        if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
          setLinks(result.candidates[0].groundingMetadata.groundingChunks);
        }
        onUpdatePoints(60);
      }
      triggerPointsAnimation(50);
    } catch (error: any) {
      setResponse("त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (isSpeaking) {
      if (sourceRef.current) sourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    try {
      const audioBytes = await geminiService.speak(text, 'Kore');
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      await ctx.resume();
      const buffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      sourceRef.current = source;
      source.start(0);
    } catch (e) { setIsSpeaking(false); }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-40">
      <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 border border-amber-500/10 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12 scale-150">
           <i className="fas fa-landmark text-[300px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-amber-500 rounded-[2rem] flex items-center justify-center text-slate-950 text-2xl shadow-3xl"><i className="fas fa-history"></i></div>
                <div>
                   <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">इतिहास <span className="text-amber-500">जाँच</span> केंद्र</h2>
                   <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.4em] mt-2 italic">Local Laws Exposed vs Samvidhan • v4.3</p>
                </div>
             </div>
             
             <button 
               onClick={handleLocalHeritageScan}
               disabled={loading}
               className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-3xl flex items-center gap-3 border-b-4 border-emerald-800 active:translate-y-1"
             >
               <i className={`fas ${loading ? 'fa-sync fa-spin' : 'fa-location-crosshairs'}`}></i>
               <span>मेरे शहर की विरासत स्कैन करें</span>
             </button>
          </div>

          <div className="relative group">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="दुनिया के इतिहास, पुराने स्थानीय नियमों (Local Laws Exposed) या युगों के बदलाव के बारे में पूछें..."
              className="w-full bg-slate-950 border-2 border-amber-900/20 rounded-[2.5rem] p-10 text-white text-xl placeholder:text-slate-800 outline-none focus:border-amber-500/40 transition-all min-h-[160px] font-medium leading-relaxed"
            />
            <div className="absolute right-6 bottom-6 flex gap-3">
               <button onClick={() => handleAsk('timeline')} disabled={loading || !query} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-700">Timeline</button>
               <button onClick={() => handleAsk('deep')} disabled={loading || !query} className="bg-amber-500 text-slate-950 px-10 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-amber-400 shadow-xl">Deep Audit</button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
           <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">समय के पन्ने पलटे जा रहे हैं...</p>
        </div>
      )}

      {comparison && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
           <div className="bg-slate-900 rounded-[3.5rem] p-10 border-l-[12px] border-rose-600 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><i className="fas fa-hourglass-start text-8xl text-white"></i></div>
              <h3 className="text-rose-500 font-black text-3xl italic uppercase tracking-tighter">पहले (Local Laws Exposed)</h3>
              <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest border-b border-white/5 pb-2">रियासत/पुरानी व्यवस्था : {comparison.location}</p>
              <div className="prose prose-invert prose-rose max-w-none text-slate-300 text-xl leading-relaxed italic">
                 <ReactMarkdown>{comparison.pehle}</ReactMarkdown>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[3.5rem] p-10 border-l-[12px] border-blue-600 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><i className="fas fa-landmark text-8xl text-white"></i></div>
              <h3 className="text-blue-500 font-black text-3xl italic uppercase tracking-tighter">आज (Samvidhan)</h3>
              <p className="text-blue-400 font-black text-[9px] uppercase tracking-widest border-b border-white/5 pb-2">आधुनिक लोकतांत्रिक अधिकार : {comparison.location}</p>
              <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-xl leading-relaxed font-bold">
                 <ReactMarkdown>{comparison.aaj}</ReactMarkdown>
              </div>
           </div>
        </div>
      )}

      {response && !loading && (
        <div className="bg-slate-900 p-12 md:p-20 rounded-[4rem] border border-white/5 shadow-3xl animate-slideUp relative">
           <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                 <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Historical Investigation Report</span>
              </div>
              <button 
                onClick={() => speakText(response)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-500'}`}
              >
                 <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-volume-high'}`}></i>
              </button>
           </div>
           <div className="prose prose-invert prose-amber max-w-none text-slate-200 text-2xl leading-relaxed font-medium history-content">
              <ReactMarkdown>{response}</ReactMarkdown>
           </div>
           {links.length > 0 && (
             <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Verified Historical Archives:</p>
                <div className="flex flex-wrap gap-3">
                   {links.map((link, i) => (
                     <a key={i} href={link.web?.uri} target="_blank" rel="noopener noreferrer" className="bg-slate-950 px-4 py-2 rounded-xl text-[10px] text-slate-500 border border-white/5 hover:border-amber-500/30 transition-all font-bold">
                       <i className="fas fa-link mr-2"></i> {link.web?.title}
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

export default HistorySection;