
import React, { useState, useRef, memo } from 'react';
import { AppSection, LocalContext } from '../types.ts';
import { geminiService } from '../services/geminiService.ts';
import ReactMarkdown from 'react-markdown';
import AdSlot from './AdSlot.tsx';

// Audio Helpers
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

interface KnowledgeHubProps { 
  setActiveSection: (section: AppSection) => void; 
  language: string;
  onEarnPoints?: (val: number) => void;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ setActiveSection, language, onEarnPoints }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [links, setLinks] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    setLinks([]);
    if (isSpeaking && sourceRef.current) sourceRef.current.stop();
    setIsSpeaking(false);

    try {
      const res = await geminiService.askUniversalAI(query, { language, country: 'India' });
      setResponse(res.text || "");
      if (res.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(res.candidates[0].groundingMetadata.groundingChunks);
      }
      if (onEarnPoints) onEarnPoints(30);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      setResponse("विवेक के सेतु से जुड़ने में क्षणिक समस्या आई।");
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
    if (!response) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(response, 'Kore');
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

  const toolCards = [
    { id: AppSection.VOICE_ASSISTANT, label: "वॉयस असिस्टेंट", icon: "fa-microphone-lines", color: "bg-amber-500", desc: "मुझसे बातचीत करके इतिहास और कानून सीखें।", points: "+50" },
    { id: AppSection.HISTORY, label: "इतिहास", icon: "fa-earth-asia", color: "bg-indigo-500", desc: "राजवंशों और पुरानी व्यवस्थाओं का गहन अध्ययन।", points: "+50" },
    { id: AppSection.LOCAL_LAWS_EXPOSED, label: "प्रशासनिक जागरूकता", icon: "fa-eye", color: "bg-rose-600", desc: "स्थानीय नियमों and प्रशासनिक प्रक्रियाओं की स्पष्टता।", points: "+75" },
    { id: AppSection.CONSTITUTION, label: "संवैधानिक अधिकार", icon: "fa-building-columns", color: "bg-blue-600", desc: "आपका सर्वोच्च कानूनी कवच - आधुनिक अधिकार।", points: "+50" }
  ];

  const faqs = [
    {
      q: "संस्कृति (Voice Assistant) क्या है?",
      a: "संस्कृति एक AI वॉयस असिस्टेंट है जिससे आप बोलकर सवाल पूछ सकते हैं। यह आपको बोलकर ही जवाब देगी, जिससे पढ़ना और सीखना और भी आसान हो जाता है।"
    },
    {
      q: "Education: Learn and Earn पॉइंट सिस्टम क्या है?",
      a: "यह एक अनूठा रिवॉर्ड सिस्टम है। जब आप इतिहास, कानून या ताज़ा खबरों के बारे में पढ़ते हैं, तो आपको 'Nagrik Power' पॉइंट्स मिलते हैं। इन पॉइंट्स से आप Aura AI और विशेषज्ञ सलाह जैसे प्रीमियम फीचर्स अनलॉक कर सकते हैं।"
    },
    {
      q: "इतिहास और संवैधानिक अधिकार का क्या संबंध है?",
      a: "इतिहास हमें सिखाता है कि हम कहाँ गलत थे और पुरानी व्यवस्थाएँ कैसे काम करती थीं। संवैधानिक अधिकार हमें आज के युग की शक्ति देते हैं। 'History Section' में आप इन दोनों की सीधी तुलना देख सकते हैं।"
    }
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-24">
      {/* 👑 Royal Education Banner */}
      <div className="relative royal-card rounded-[4rem] p-12 md:p-20 border border-amber-500/10 shadow-3xl overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12 scale-150 group-hover:scale-125 transition-transform duration-1000">
          <i className="fas fa-shield-halved text-[400px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-12">
           <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                 <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">Digital Education Console</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none royal-serif">नागरिक <span className="text-amber-500">ज्ञान</span> केंद्र</h2>
              <p className="text-slate-400 text-xl md:text-3xl font-medium italic border-l-8 border-amber-500/20 pl-8 leading-relaxed max-w-4xl py-2">
                "इतिहास से सीखें, वर्तमान को समझें और संवैधानिक अधिकारों से सशक्त बनें।"
              </p>
           </div>

           <div className="relative group max-w-5xl">
              <input 
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="पूछें: 'राजतंत्र और लोकतंत्र में क्या अंतर है?' या 'आज के समाचार और मेरे अधिकार'..."
                className="w-full bg-slate-950/80 border-2 border-white/5 rounded-[3rem] py-8 pl-16 pr-44 text-white text-xl md:text-2xl placeholder:text-slate-800 outline-none focus:border-amber-500/40 transition-all font-medium shadow-inner"
              />
              <i className="fas fa-search absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors"></i>
              <button 
                onClick={handleSearch} 
                disabled={loading || !query.trim()}
                className="absolute right-4 top-4 bottom-4 px-12 bg-amber-500 text-slate-950 rounded-[2.5rem] font-black uppercase text-xs tracking-widest hover:bg-amber-400 shadow-2xl transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <i className="fas fa-dharmachakra fa-spin text-xl"></i> : "पढ़ना शुरू करें"}
              </button>
           </div>
        </div>
      </div>

      {/* 🏛️ 4 Educational Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {toolCards.map((tool) => (
          <button 
            key={tool.id} onClick={() => setActiveSection(tool.id)}
            className="royal-card p-10 rounded-[3rem] text-left flex flex-col justify-between group h-80 border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-4 right-6 text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">{tool.points} pts</div>
            <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl shadow-slate-950 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <i className={`fas ${tool.icon}`}></i>
            </div>
            <div>
               <h3 className="text-2xl font-black text-white uppercase italic royal-serif group-hover:text-amber-500 transition-colors">{tool.label}</h3>
               <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed italic">{tool.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 📜 Educational Output Area */}
      <div ref={scrollRef}>
        {loading && (
          <div className="py-24 text-center space-y-8 animate-pulse">
             <i className="fas fa-dharmachakra fa-spin text-7xl text-amber-500 opacity-20"></i>
             <p className="text-amber-500/60 font-black uppercase tracking-[0.4em] text-[11px]">ज्ञान के पन्ने पलटे जा रहे हैं...</p>
          </div>
        )}
        {response && !loading && (
          <div className="royal-card p-12 md:p-20 rounded-[5rem] border-2 border-amber-500/20 shadow-[0_0_80px_rgba(251,191,36,0.05)] animate-slideUp relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5"><i className="fas fa-quote-right text-9xl text-amber-500"></i></div>
             
             {/* Read Aloud HUD */}
             <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8 relative z-10">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                      <i className="fas fa-book-open"></i>
                   </div>
                   <h4 className="text-white font-black text-xs uppercase tracking-widest italic">Sanskriti AI Knowledge Feed</h4>
                </div>
                <button 
                  onClick={handleSpeak}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-xl' : 'bg-slate-800 text-amber-500 hover:bg-slate-700'}`}
                >
                   <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                   <span>{isSpeaking ? 'सुनना बंद करें' : 'पाठ सुनें'}</span>
                </button>
             </div>

             <div className="prose prose-invert prose-amber max-w-none text-slate-200 text-2xl leading-relaxed font-medium history-content relative z-10">
                <ReactMarkdown>{response}</ReactMarkdown>
             </div>

             {/* Added: Search Grounding Link Rendering correctly as per guidelines */}
             {links.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
                   <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">संवैधानिक एवं आधिकारिक स्रोत (Verified Sources):</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {links.map((link, i) => (
                        <a key={i} href={link.web?.uri} target="_blank" rel="noopener noreferrer" className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group flex items-center justify-between shadow-lg">
                          <span className="text-white text-xs font-bold truncate pr-4">{link.web?.title || 'Knowledge Link'}</span>
                          <i className="fas fa-external-link-alt text-slate-800 group-hover:text-amber-500"></i>
                        </a>
                      ))}
                   </div>
                </div>
             )}

             <div className="mt-12 pt-8 border-t border-white/5 flex justify-center relative z-10">
                <div className="flex items-center space-x-3 bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20">
                   <i className="fas fa-coins text-emerald-500"></i>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Education Reward: +30 Points Earned</span>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* ❓ Education FAQ Section */}
      <div className="space-y-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg">
            <i className="fas fa-circle-question"></i>
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">शिक्षा: अक्सर पूछे जाने वाले सवाल</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group ${openFaq === idx ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900 border-white/5 hover:border-amber-500/20'}`}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex justify-between items-center gap-4">
                <h4 className={`text-lg font-black uppercase italic royal-serif transition-colors ${openFaq === idx ? 'text-amber-500' : 'text-white group-hover:text-amber-400'}`}>
                  {faq.q}
                </h4>
                <i className={`fas fa-chevron-down text-xs transition-transform duration-500 ${openFaq === idx ? 'rotate-180 text-amber-500' : 'text-slate-700'}`}></i>
              </div>
              {openFaq === idx && (
                <div className="mt-6 pt-6 border-t border-white/5 animate-fadeIn">
                  <p className="text-slate-400 text-base leading-relaxed italic font-medium">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AdSlot className="h-[300px] border-amber-500/5 shadow-2xl rounded-[4rem]" />
    </div>
  );
};

export default KnowledgeHub;
