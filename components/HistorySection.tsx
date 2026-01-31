import React, { useState, useRef, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { LocalContext, TimelineEvent, QuizQuestion, SavedSession } from '../types';

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

interface HistorySectionProps {
  onUpdatePoints: (amount: number) => void;
  onSearch?: (query: string) => void;
  context: LocalContext;
  onDraftApplication?: (subject: string, details: string) => void;
  mode?: 'standard' | 'exposed';
}

const HistorySection: React.FC<HistorySectionProps> = ({ onUpdatePoints, onSearch, context, onDraftApplication, mode = 'standard' }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [comparison, setComparison] = useState<{ pehle: string, aaj: string, location: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [spotlightLoading, setSpotlightLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [copied, setCopied] = useState<string | null>(null); 

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const fetchSpotlight = async () => {
      setSpotlightLoading(true);
      try {
        const pillar = mode === 'exposed' ? "LOCAL_EXPOSED" : "HISTORY";
        const insight = await geminiService.fetchSectionSpotlight(pillar, context);
        setResponse(insight);
      } catch (e) {} finally { setSpotlightLoading(false); }
    };
    fetchSpotlight();
  }, [context.language, mode]);

  const triggerPointsAnimation = (amount: number) => {
    const div = document.createElement('div');
    div.className = 'point-float';
    div.innerText = `+${amount}`;
    div.style.left = `50%`;
    div.style.top = `50%`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  };

  const handleCopyText = (text: string, label: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopied(label);
    triggerPointsAnimation(5);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleLocalHeritageScan = async () => {
    setLoading(true);
    setResponse('');
    setComparison(null);
    setLinks([]);

    const locationPrompt = context.city ? `${context.city}, ${context.country}` : "मेरे वर्तमान स्थान";
    const prompt = mode === 'exposed' 
      ? `विश्लेषण: "${locationPrompt}" में पहले कौन से 'भ्रामक नियम' प्रचलित थे और आज 'संविधान' उन पर क्या कहता है।`
      : `शिक्षात्मक विश्लेषण: "${locationPrompt}" का 'इतिहास' (Pehle) बनाम आज की 'संवैधानिक स्थिति' (Aaj)।`;

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

      onUpdatePoints(mode === 'exposed' ? 75 : 60);
      triggerPointsAnimation(mode === 'exposed' ? 75 : 60);
    } catch (e) {
      setResponse("डेटा प्राप्त करने में त्रुटि।");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async (modeType: 'deep' | 'timeline', forcedQuery?: string) => {
    const activeQuery = forcedQuery || query;
    if (!activeQuery) return;
    setLoading(true);
    setResponse('');
    setComparison(null);
    setLinks([]);

    try {
      if (modeType === 'timeline') {
        const events = await geminiService.getQueryTimeline(activeQuery, context);
        setResponse(events.map(e => `**${e.year}**: ${e.event} - ${e.description}`).join('\n\n'));
        onUpdatePoints(50);
      } else {
        const result = await geminiService.askPillar(mode === 'exposed' ? "LOCAL_EXPOSED" : "HISTORY", activeQuery, context);
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
    if (!text) return;
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
           <i className={`fas ${mode === 'exposed' ? 'fa-mask' : 'fa-landmark'} text-[300px] text-white`}></i>
        </div>
        <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 ${mode === 'exposed' ? 'bg-rose-600' : 'bg-amber-500'} rounded-[2rem] flex items-center justify-center text-slate-950 text-2xl shadow-3xl`}>
                  <i className={`fas ${mode === 'exposed' ? 'fa-mask' : 'fa-history'}`}></i>
                </div>
                <div>
                   <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none royal-serif">
                     {mode === 'exposed' ? 'पुराने नियम' : 'वैश्विक इतिहास'} <span className={mode === 'exposed' ? 'text-rose-600' : 'text-amber-500'}>केंद्र</span>
                   </h2>
                   <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.4em] mt-2 italic">
                     {mode === 'exposed' ? 'Debunking Outdated Rules vs Samvidhan' : 'Pehle vs Aaj • Learn and Earn Points'}
                   </p>
                </div>
             </div>
             
             <button 
               onClick={handleLocalHeritageScan}
               disabled={loading}
               className={`${mode === 'exposed' ? 'bg-rose-600 border-rose-800' : 'bg-emerald-600 border-emerald-800'} text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all shadow-3xl flex items-center gap-3 border-b-4 active:translate-y-1`}
             >
               <i className={`fas ${loading ? 'fa-sync fa-spin' : 'fa-location-crosshairs'}`}></i>
               <span>मेरे शहर की शिक्षा (+75 Points)</span>
             </button>
          </div>

          <div className="relative group">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={mode === 'exposed' ? "किसी पुराने नियम या कुप्रथा के बारे में पूछें... (जैसे: पुरानी रियासत के नियम)" : "दुनिया के इतिहास या युगों के बदलाव के बारे में पूछें..."}
              className="w-full bg-slate-950 border-2 border-amber-900/20 rounded-[2.5rem] p-10 text-white text-xl placeholder:text-slate-800 outline-none focus:border-amber-500/40 transition-all min-h-[160px] font-medium leading-relaxed"
            />
            <div className="absolute right-6 bottom-6 flex gap-3">
               <button onClick={() => handleAsk('timeline')} disabled={loading || !query} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-700">Timeline</button>
               <button onClick={() => handleAsk('deep')} disabled={loading || !query} className="bg-amber-500 text-slate-950 px-10 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-amber-400 shadow-xl">Deep Study</button>
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
        <div key={comparison.location + "-comp"} className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
           <div className="bg-slate-900 rounded-[3.5rem] p-10 border-l-[12px] border-rose-600 shadow-2xl space-y-6 relative overflow-hidden">
              <button 
                onClick={() => handleCopyText(comparison.pehle, 'pehle')}
                className={`absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copied === 'pehle' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
              >
                <i className={`fas ${copied === 'pehle' ? 'fa-check' : 'fa-copy'}`}></i>
              </button>
              <div className="absolute top-0 right-0 p-8 opacity-5 -z-10"><i className="fas fa-hourglass-start text-8xl text-white"></i></div>
              <h3 className="text-rose-500 font-black text-3xl italic uppercase tracking-tighter royal-serif">पहले (Pehle)</h3>
              <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest border-b border-white/5 pb-2">पुरानी व्यवस्था / भ्रम : {comparison.location}</p>
              <div className="prose prose-invert prose-rose max-w-none text-slate-300 text-xl leading-relaxed italic">
                 <ReactMarkdown>{comparison.pehle}</ReactMarkdown>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[3.5rem] p-10 border-l-[12px] border-blue-600 shadow-2xl space-y-6 relative overflow-hidden">
              <button 
                onClick={() => handleCopyText(comparison.aaj, 'aaj')}
                className={`absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copied === 'aaj' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
              >
                <i className={`fas ${copied === 'aaj' ? 'fa-check' : 'fa-copy'}`}></i>
              </button>
              <div className="absolute top-0 right-0 p-8 opacity-5 -z-10"><i className="fas fa-landmark text-8xl text-white"></i></div>
              <h3 className="text-blue-500 font-black text-3xl italic uppercase tracking-tighter royal-serif">आज (Aaj/Samvidhan)</h3>
              <p className="text-blue-400 font-black text-[9px] uppercase tracking-widest border-b border-white/5 pb-2">आधुनिक लोकतांत्रिक अधिकार : {comparison.location}</p>
              <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-xl leading-relaxed font-bold">
                 <ReactMarkdown>{comparison.aaj}</ReactMarkdown>
              </div>
           </div>
        </div>
      )}

      {response && !loading && (
        <div key={response.substring(0, 30)} className="bg-slate-900 p-12 md:p-20 rounded-[5rem] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] animate-slideUp relative group overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(251,191,36,0.02),_transparent)] pointer-events-none"></div>
           <div className="absolute -top-24 -right-24 p-12 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-1000">
              <i className="fas fa-quote-right text-[400px] text-amber-500"></i>
           </div>

           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-white/10 pb-10 relative z-10 gap-8">
              <div className="flex items-center gap-6">
                 <div className="relative">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-xl overflow-hidden">
                       <i className="fas fa-book-open text-2xl"></i>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping"></div>
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-[11px] font-black uppercase text-amber-500 tracking-[0.4em]">NagrikSetu Education Feed</h4>
                    <p className="text-slate-500 text-xs font-bold italic">Deep Text Insight • Pehle vs Aaj</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 bg-slate-950/80 p-2 rounded-2xl border border-white/5 shadow-inner">
                 <button 
                   onClick={() => speakText(response)}
                   className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'bg-slate-800 text-amber-500 hover:bg-slate-700'}`}
                 >
                    <i className={`fas ${isSpeaking ? 'fa-square' : 'fa-volume-high'} text-xs`}></i>
                    <span>{isSpeaking ? 'रुकें' : 'पाठ सुनें'}</span>
                 </button>
                 <button 
                   onClick={() => handleCopyText(response, 'main')}
                   className={`w-11 h-11 rounded-xl transition-all flex items-center justify-center ${copied === 'main' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                 >
                    <i className={`fas ${copied === 'main' ? 'fa-check' : 'fa-copy'} text-sm`}></i>
                 </button>
              </div>
           </div>

           <div className="relative z-10 space-y-12">
              <div className="prose prose-invert prose-amber max-w-none text-slate-200 text-2xl leading-[1.7] font-medium history-content">
                 <ReactMarkdown>{response}</ReactMarkdown>
              </div>
              
              {links.length > 0 && (
                <div className="pt-16 border-t border-white/5 space-y-8">
                   <div className="flex items-center gap-3">
                      <i className="fas fa-link text-amber-500/40 text-lg"></i>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Historical References:</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {links.map((link, i) => (
                        <a 
                          key={i} href={link.web?.uri} target="_blank" rel="noopener noreferrer" 
                          className="bg-slate-950 p-6 rounded-[2rem] border border-white/5 hover:border-amber-500/30 transition-all group flex items-center justify-between shadow-2xl"
                        >
                           <div className="space-y-1 pr-4 min-w-0">
                              <p className="text-white font-black text-sm line-clamp-1 group-hover:text-amber-400 transition-colors uppercase tracking-tight">{link.web?.title || "Educational Resource"}</p>
                           </div>
                           <i className="fas fa-external-link-alt text-slate-800 group-hover:text-amber-500 transition-colors text-xs"></i>
                        </a>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default HistorySection;