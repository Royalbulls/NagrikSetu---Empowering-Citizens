import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { AppSection, LocalContext, TimelineEvent } from '../types';

interface LawSectionProps {
  onEarnPoints: (amount: number) => void;
  onSearch?: (query: string) => void;
  section: AppSection;
  context: LocalContext;
}

const LawSection: React.FC<LawSectionProps> = ({ onEarnPoints, onSearch, section, context }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [view, setView] = useState<'study' | 'journey'>('study');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Fetch initial spotlight info for samvidhan
  useEffect(() => {
    const fetchSpotlight = async () => {
      setLoading(true);
      try {
        const res = await geminiService.fetchSectionSpotlight("Indian Constitution Articles", context);
        setResponse(res);
      } catch (e) {} finally { setLoading(false); }
    };
    fetchSpotlight();
  }, [context.language]);

  const handleConsult = async (forcedQuery?: string, isArticle = false) => {
    const activeQuery = forcedQuery || query;
    if (!activeQuery) return;
    setLoading(true);
    setResponse('');
    setLinks([]);
    if (onSearch) onSearch(activeQuery);

    try {
      let result;
      if (isArticle) {
        result = await geminiService.explainArticle(activeQuery, context);
      } else {
        result = await geminiService.getLocalInfo(activeQuery, undefined, context);
      }
      
      const finalRes = result.text || "";
      setResponse(finalRes);

      if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(result.candidates[0].groundingMetadata.groundingChunks);
      }
      
      onEarnPoints(50);
      setView('study');
    } catch (error) { setResponse("त्रुटि हुई।"); } finally { setLoading(false); }
  };

  const fetchTimeline = async () => {
    setView('journey');
    if (timeline.length > 0) return;
    setTimelineLoading(true);
    try {
      const data = await geminiService.fetchConstitutionalTimeline(context);
      setTimeline(data);
      onEarnPoints(30);
    } catch (e) { console.error(e); } finally { setTimelineLoading(false); }
  };

  const majorArticles = [
    { num: "14", label: "समानता (Equality)" },
    { num: "19", label: "अभिव्यक्ति (Expression)" },
    { num: "21", label: "जीवन (Life/Privacy)" },
    { num: "32", label: "न्यायिक उपचार (Remedies)" },
    { num: "51A", label: "मूल कर्तव्य (Duties)" }
  ];

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      {/* 🏛️ Samvidhan Banner */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 border border-blue-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-building-columns text-[300px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl border-4 border-white/10">
                   <i className="fas fa-gavel text-2xl md:text-3xl"></i>
                </div>
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">संवैधानिक <span className="text-blue-500">कवच</span></h2>
                   <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Samvidhan Hub • Learn Your Fundamental Power</p>
                </div>
              </div>
              <div className="flex bg-slate-950 p-2 rounded-2xl border border-white/10 shrink-0">
                 <button onClick={() => setView('study')} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'study' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>Study Laws</button>
                 <button onClick={fetchTimeline} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'journey' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>The Journey</button>
              </div>
           </div>
           <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-4xl border-l-4 border-blue-500/50 pl-8 py-2 italic">
             "संविधान (Aaj) हमें वे अधिकार देता है जो 'पहले' के राजाओं के समय सोचे भी नहीं जा सकते थे। अपनी धाराओं को जानें, अपनी शक्ति को पहचानें।"
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 📚 Quick Article Access Sidebar */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
              <h4 className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-6 flex items-center border-b border-blue-500/10 pb-4">
                 <i className="fas fa-star mr-3"></i> प्रमुख धाराएं (Main Articles)
              </h4>
              <div className="space-y-3">
                 {majorArticles.map((art, idx) => (
                   <button 
                    key={idx}
                    onClick={() => handleConsult(art.num, true)}
                    className="w-full bg-slate-950 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group flex items-center justify-between text-left"
                   >
                      <div>
                         <p className="text-white font-black text-xs uppercase tracking-tighter">अनुच्छेद {art.num}</p>
                         <p className="text-slate-500 text-[9px] font-bold uppercase mt-1">{art.label}</p>
                      </div>
                      <i className="fas fa-arrow-right-long text-slate-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"></i>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 p-8 rounded-[2.5rem] border border-blue-500/10 shadow-xl text-center space-y-4">
              <i className="fas fa-book-quran text-blue-500 text-3xl opacity-50"></i>
              <p className="text-slate-400 text-[10px] font-bold uppercase leading-relaxed italic">
                 "एक जागरूक नागरिक वह है जो अधिकारों के साथ कर्तव्यों (Fundamental Duties) को भी समझता है।"
              </p>
           </div>
        </div>

        {/* 📋 Main Interactive Area */}
        <div className="lg:col-span-9 space-y-8">
           {view === 'study' ? (
             <div className="space-y-8">
                <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8">
                   <div className="space-y-4">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                         <i className="fas fa-search text-blue-500"></i>
                         धारा या अधिकार खोजें (Search Article/Right)
                      </h3>
                      <div className="relative group">
                         <textarea 
                           value={query}
                           onChange={(e) => setQuery(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
                           placeholder="लिखें: 'अनुच्छेद 19 क्या है?' या 'मेरे शिक्षा के अधिकार'..."
                           className="w-full bg-slate-950 border-2 border-white/5 rounded-[2.5rem] p-8 text-white text-lg placeholder:text-slate-800 outline-none focus:border-blue-500/50 min-h-[160px] shadow-inner font-medium leading-relaxed"
                         />
                         <button 
                           onClick={() => handleConsult()}
                           disabled={loading || !query.trim()}
                           className="absolute right-5 bottom-5 h-16 px-12 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-500 transition-all shadow-3xl uppercase tracking-widest text-xs border-b-4 border-blue-800 active:translate-y-1"
                         >
                           {loading ? <i className="fas fa-dharmachakra fa-spin text-xl"></i> : "परामर्श लें (+50)"}
                         </button>
                      </div>
                   </div>
                </div>

                {response && !loading && (
                  <div className="bg-slate-900 p-10 md:p-16 rounded-[4rem] border-2 border-blue-500/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] animate-slideUp relative overflow-hidden group">
                     <div className="absolute top-0 left-0 p-12 opacity-[0.02] pointer-events-none scale-150">
                        <i className="fas fa-quote-right text-[400px] text-white"></i>
                     </div>
                     <div className="relative z-10">
                        <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-2xl leading-relaxed font-medium history-content">
                           <ReactMarkdown>{response}</ReactMarkdown>
                        </div>
                        {links.length > 0 && (
                          <div className="mt-12 pt-8 border-t border-white/5">
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">संवैधानिक स्रोत (Legal Sources):</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {links.map((link, i) => (
                                  <a key={i} href={link.web?.uri} target="_blank" rel="noopener noreferrer" className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all font-bold group flex items-center justify-between">
                                    <span className="text-white text-xs">{link.web?.title || 'Constitutional Ref'}</span>
                                    <i className="fas fa-external-link-alt text-slate-800 group-hover:text-blue-500"></i>
                                  </a>
                                ))}
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="space-y-10 animate-slideUp">
                {timelineLoading ? (
                  <div className="py-40 text-center space-y-6">
                     <i className="fas fa-dharmachakra fa-spin text-6xl text-blue-500 opacity-20"></i>
                     <p className="text-blue-500/60 font-black uppercase tracking-[0.4em] text-[10px]">संविधान का सफर लोड हो रहा है...</p>
                  </div>
                ) : (
                  <div className="space-y-12">
                     <div className="relative pl-10 md:pl-16 border-l-4 border-blue-900/30 space-y-16">
                        {timeline.map((event, idx) => (
                          <div key={idx} className="relative group">
                             <div className="absolute -left-[54px] md:-left-[66px] top-0 w-10 h-10 md:w-12 md:h-12 bg-slate-950 border-4 border-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                                <span className="text-white font-black text-[10px]">{idx + 1}</span>
                             </div>
                             <div className="bg-slate-900/80 backdrop-blur-md p-10 rounded-[3rem] border border-white/5 shadow-2xl hover:border-blue-500/40 transition-all">
                                <span className="text-4xl font-black text-blue-500 tracking-tighter italic block mb-2">{event.year}</span>
                                <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">{event.event}</h4>
                                <p className="text-slate-400 text-lg leading-relaxed font-medium italic border-l-2 border-blue-500/20 pl-6">
                                   "{event.description}"
                                </p>
                             </div>
                          </div>
                        ))}
                     </div>
                     <div className="bg-blue-600/10 p-12 rounded-[4rem] border-2 border-dashed border-blue-500/20 text-center">
                        <p className="text-slate-400 italic text-xl font-medium">"यह सफर अभी जारी है... हर नया संशोधन भारत को और अधिक प्रगतिशील बनाने की एक कोशिश है।"</p>
                     </div>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default LawSection;