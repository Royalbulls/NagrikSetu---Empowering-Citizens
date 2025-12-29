
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'react-markdown';

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

const JigyasaHub: React.FC<{ context: LocalContext; onEarnPoints: (v: number) => void }> = ({ context, onEarnPoints }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleAsk = async (overriddenQuery?: string) => {
    const finalQuery = overriddenQuery || query;
    if (!finalQuery.trim()) return;
    setLoading(true);
    setResponse('');
    setLinks([]);
    setSuggestions([]);
    try {
      const res = await geminiService.askUniversalAI(finalQuery, context);
      const text = res.text || "";
      setResponse(text);
      
      if (res.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(res.candidates[0].groundingMetadata.groundingChunks);
      }

      const followUps = await geminiService.getFollowUpSuggestions(finalQuery, text, context);
      setSuggestions(followUps || []);
      
      onEarnPoints(40);
    } catch (e) {
      setResponse("विवेक के सेतु से जुड़ने में समस्या आई।");
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = async () => {
    if (isSpeaking) {
      if (sourceRef.current) sourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    try {
      const bytes = await geminiService.speak(response);
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      await ctx.resume();
      
      const buffer = await decodeAudioData(bytes, ctx, 24000, 1);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      sourceRef.current = source;
      source.start(0);
    } catch (e) { setIsSpeaking(false); }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950 rounded-[3.5rem] p-10 md:p-14 border border-indigo-500/30 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.08] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-brain text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
           <div className="flex items-center space-x-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl">
                 <i className="fas fa-lightbulb text-2xl md:text-3xl"></i>
              </div>
              <div>
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">जिज्ञासा <span className="text-amber-500">केंद्र</span></h2>
                 <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Universal Problem Solver • Sanskriti Wisdom</p>
              </div>
           </div>
           <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-4xl border-l-4 border-indigo-500/50 pl-8 py-2">
             "यहाँ आप कुछ भी पूछ सकते हैं। मैं आपके इरादे को समझकर सबसे सटीक और मानवीय मार्गदर्शन प्रदान करने का प्रयास करूँगी।"
           </p>
        </div>
      </div>

      <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8">
         <div className="space-y-4">
            <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
               <i className="fas fa-comment-dots text-indigo-500"></i>
               आपका सवाल (Ask Anything)
            </h3>
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="अपनी समस्या, जिज्ञासा या विचार यहाँ लिखें..."
              className="w-full bg-slate-950 border-2 border-white/5 rounded-[2.5rem] p-8 text-white text-lg placeholder:text-slate-800 outline-none focus:border-indigo-500/50 min-h-[160px] shadow-inner font-medium leading-relaxed"
            />
         </div>
         <button 
           onClick={() => handleAsk()}
           disabled={loading || !query.trim()}
           className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-lg hover:bg-indigo-500 shadow-3xl transition-all h-20 flex items-center justify-center border-b-4 border-indigo-800 active:translate-y-1 disabled:opacity-30"
         >
           {loading ? <i className="fas fa-dharmachakra fa-spin text-2xl mr-3"></i> : "मार्गदर्शन प्राप्त करें"}
         </button>
      </div>

      {response && !loading && (
        <div className="bg-slate-900 p-12 rounded-[4rem] border-2 border-indigo-500/20 shadow-3xl animate-slideUp relative overflow-hidden group">
           <div className="flex justify-between items-center mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <i className="fas fa-sparkles"></i>
                 </div>
                 <div>
                    <h4 className="font-black text-white uppercase italic tracking-tighter">संस्कृति का उत्तर</h4>
                    <p className="text-indigo-400 font-black text-[9px] uppercase tracking-widest">Intelligence Pulse</p>
                 </div>
              </div>
              <button 
                onClick={speakResponse}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-slate-800 text-indigo-400'}`}
              >
                 <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-volume-high'} text-xl`}></i>
              </button>
           </div>

           <div className="prose prose-invert prose-indigo max-w-none text-slate-200 text-xl leading-relaxed relative z-10 font-medium history-content mb-10">
              <ReactMarkdown>{response}</ReactMarkdown>
           </div>

           {links?.length > 0 && (
             <div className="relative z-10 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">संदर्भ एवं शोध (References):</p>
                <div className="flex flex-wrap gap-3">
                   {links.map((link, i) => (
                     <a key={i} href={link.web?.uri} target="_blank" rel="noopener noreferrer" className="bg-slate-950 px-4 py-2 rounded-xl text-[10px] text-slate-400 border border-white/5 hover:border-indigo-500/30 transition-all font-bold">
                       <i className="fas fa-link mr-2"></i> {link.web?.title}
                     </a>
                   ))}
                </div>
             </div>
           )}

           {suggestions?.length > 0 && (
             <div className="relative z-10 pt-12 border-t border-white/5 mt-8 space-y-6">
                <p className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.5em] text-center">आगे और जानें (Suggested Topics)</p>
                <div className="flex flex-wrap justify-center gap-3">
                   {suggestions.map((s, i) => (
                     <button key={i} onClick={() => { setQuery(s); handleAsk(s); }} className="bg-slate-950 hover:bg-indigo-600 text-slate-500 hover:text-white border border-white/10 px-6 py-3 rounded-full text-xs font-black transition-all shadow-xl hover:scale-105 active:scale-95">
                        {s}
                     </button>
                   ))}
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default JigyasaHub;
