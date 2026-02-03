
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
  const [artA, setArtA] = useState('14');
  const [artB, setArtB] = useState('21');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [view, setView] = useState<'study' | 'journey' | 'compare'>('study');
  
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

  const handleCompare = async () => {
    if (!artA || !artB) return;
    setLoading(true);
    setResponse('');
    setLinks([]);
    try {
      const result = await geminiService.compareArticles(artA, artB, context);
      setResponse(result.text || "");
      if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(result.candidates[0].groundingMetadata.groundingChunks);
      }
      onEarnPoints(60);
    } catch (e) {
      setResponse("तुलना विफल रही।");
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    setView('journey');
    if (timeline.length > 0) return;
    setTimelineLoading(true);
    try {
      const data = await geminiService.fetchConstitutionalTimeline(context);
      setTimeline(data);
      onEarnPoints(40); // Increased reward for timeline study
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
      {/* 🏛️ Unified Law Header */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 border border-blue-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-building-columns text-[300px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl border-4 border-white/10">
                   <i className="fas fa-shield-halved text-2xl md:text-3xl"></i>
                </div>
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">संवैधानिक <span className="text-blue-500">कवच</span></h2>
                   <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Samvidhan Hub • Learn Your Fundamental Power</p>
                </div>
              </div>
              <div className="flex bg-slate-950 p-2 rounded-2xl border border-white/10 shrink-0 overflow-x-auto no-scrollbar">
                 <button onClick={() => setView('study')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${view === 'study' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>Study Laws</button>
                 <button onClick={() => setView('compare')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${view === 'compare' ? 'bg-amber-600 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Compare Hub</button>
                 <button onClick={fetchTimeline} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${view === 'journey' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>संविधान यात्रा (Journey)</button>
              </div>
           </div>
           <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-4xl border-l-4 border-blue-500/50 pl-8 py-2 italic">
             {view === 'journey' ? "स्वतंत्र भारत के सबसे महान दस्तावेज के बनने की गौरवशाली यात्रा को जानें।" : view === 'compare' ? "दो धाराओं के बीच के संबंध को समझें और जानें कि वे एक साथ मिलकर आपके अधिकारों की रक्षा कैसे करती हैं।" : "संविधान (आज) हमें वे अधिकार देता है जो 'पहले' के राजाओं के समय सोचे भी नहीं जा सकते थे। अपनी धाराओं को जानें।"}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar - Quick Picks */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
              <h4 className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-6 flex items-center border-b border-blue-500/10 pb-4">
                 <i className="fas fa-star mr-3"></i> {view === 'journey' ? 'महत्वपूर्ण पड़ाव' : 'प्रमुख धाराएं'}
              </h4>
              <div className="space-y-3">
                 {majorArticles.map((art, idx) => (
                   <button 
                    key={idx}
                    onClick={() => { if(view === 'compare') { setArtB(art.num); } else { handleConsult(art.num, true); } }}
                    className="w-full bg-slate-950 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group flex items-center justify-between text-left"
                   >
                      <div>
                         <p className="text-white font-black text-xs uppercase tracking-tighter">अनुच्छेद {art.num}</p>
                         <p className="text-slate-500 text-[9px] font-bold uppercase mt-1">{art.label}</p>
                      </div>
                      <i className="fas fa-plus text-slate-800 group-hover:text-blue-500 transition-all"></i>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-8">
           {view === 'compare' && (
              <div className="space-y-8 animate-slideUp">
                 <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-amber-500/20 shadow-2xl space-y-8">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                       <i className="fas fa-layer-group text-amber-500"></i>
                       तुलना कक्ष (Comparison Lab)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Article A</label>
                          <input 
                             type="text" value={artA} onChange={e => setArtA(e.target.value)}
                             className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white focus:border-amber-500/50 outline-none"
                             placeholder="e.g. 14"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Article B</label>
                          <input 
                             type="text" value={artB} onChange={e => setArtB(e.target.value)}
                             className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white focus:border-blue-500/50 outline-none"
                             placeholder="e.g. 21"
                          />
                       </div>
                    </div>
                    <button 
                       onClick={handleCompare}
                       disabled={loading || !artA || !artB}
                       className="w-full bg-amber-500 text-slate-950 py-6 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-amber-400 shadow-3xl transition-all border-b-4 border-amber-800"
                    >
                       {loading ? <i className="fas fa-dharmachakra fa-spin text-2xl"></i> : "तुलना विश्लेषण शुरू करें (+60)"}
                    </button>
                 </div>
              </div>
           )}

           {view === 'study' && (
             <div className="space-y-8">
                <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8">
                   <div className="space-y-4">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                         <i className="fas fa-search text-blue-500"></i>
                         खोजें (Search)
                      </h3>
                      <div className="relative group">
                         <textarea 
                           value={query}
                           onChange={(e) => setQuery(e.target.value)}
                           placeholder="जैसे: 'अनुच्छेद 19 क्या है?'..."
                           className="w-full bg-slate-950 border-2 border-white/5 rounded-[2.5rem] p-8 text-white text-lg outline-none focus:border-blue-500/50 min-h-[160px]"
                         />
                         <button 
                           onClick={() => handleConsult()}
                           disabled={loading || !query.trim()}
                           className="absolute right-5 bottom-5 h-16 px-12 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-500 shadow-3xl uppercase tracking-widest text-xs border-b-4 border-blue-800"
                         >
                           {loading ? <i className="fas fa-dharmachakra fa-spin text-xl"></i> : "परामर्श लें"}
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {view === 'journey' && (
              <div className="space-y-12 animate-slideUp">
                {/* 🎖️ Journey Hero Card */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-10 md:p-14 rounded-[4rem] border-l-[12px] border-indigo-500 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><i className="fas fa-hourglass-half text-[200px]"></i></div>
                   <div className="relative z-10 space-y-6">
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter royal-serif">लोकतंत्र का <span className="text-indigo-400">उदय</span></h3>
                      <p className="text-slate-300 text-xl font-medium leading-relaxed italic max-w-3xl">
                        "1946 की पहली बैठक से लेकर 1950 में लागू होने तक, भारतीय संविधान का बनना विश्व के इतिहास की सबसे बड़ी लोकतांत्रिक घटना थी। यहाँ उन महत्वपूर्ण कड़ियों को डिकोड करें।"
                      </p>
                      <div className="flex items-center space-x-3 bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20 w-fit">
                         <i className="fas fa-coins text-emerald-500"></i>
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Studying History Earns +40 Power</span>
                      </div>
                   </div>
                </div>

                {timelineLoading ? (
                  <div className="py-40 text-center space-y-4">
                    <i className="fas fa-dharmachakra fa-spin text-6xl text-indigo-500 opacity-20"></i>
                    <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px]">Accessing Historical Archives...</p>
                  </div>
                ) : (
                  <div className="relative pl-10 md:pl-16 border-l-4 border-indigo-900/30 space-y-16">
                    {timeline.map((event, idx) => (
                      <div key={idx} className="relative group">
                         {/* Glowing Timeline Node */}
                         <div className="absolute -left-[54px] md:-left-[66px] top-0 w-10 h-10 md:w-12 md:h-12 bg-slate-950 border-4 border-indigo-600 rounded-2xl flex items-center justify-center z-10 shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-transform">
                            <span className="text-white font-black text-[10px]">{idx + 1}</span>
                         </div>
                         
                         <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-white/5 shadow-2xl group-hover:border-indigo-500/30 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                               <span className="text-4xl font-black text-indigo-500 tracking-tighter italic royal-serif">{event.year}</span>
                               <span className="bg-slate-950 px-4 py-1.5 rounded-xl border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Milestone #{idx + 1}</span>
                            </div>
                            <h4 className="text-2xl font-black text-white italic uppercase mb-4 tracking-tight">{event.event}</h4>
                            <p className="text-slate-400 text-lg leading-relaxed font-medium italic border-l-2 border-indigo-500/20 pl-6 py-1">
                               "{event.description}"
                            </p>
                         </div>
                      </div>
                    ))}
                    
                    {/* Journey End Marker */}
                    <div className="flex justify-center pt-10">
                       <div className="bg-slate-950 px-10 py-4 rounded-full border border-white/5 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] italic">End of Historical Scroll</div>
                    </div>
                  </div>
                )}
              </div>
           )}

           {loading && (
             <div className="py-24 text-center space-y-6">
                <i className="fas fa-dharmachakra fa-spin text-6xl text-blue-500 opacity-20"></i>
                <p className="text-blue-500/60 font-black uppercase tracking-[0.4em] text-[10px]">Processing Data...</p>
             </div>
           )}

           {response && !loading && view !== 'journey' && (
              <div className="bg-slate-900 p-10 md:p-16 rounded-[4rem] border-2 border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] animate-slideUp relative overflow-hidden group">
                 <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-2xl leading-relaxed font-medium history-content">
                    <ReactMarkdown>{response}</ReactMarkdown>
                 </div>
                 {links.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-white/5">
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Official Sources:</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {links.map((link, i) => (
                            <a key={i} href={link.web?.uri} target="_blank" rel="noopener noreferrer" className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all font-bold group flex items-center justify-between">
                              <span className="text-white text-xs">{link.web?.title || 'Legal Reference'}</span>
                              <i className="fas fa-external-link-alt text-slate-800 group-hover:text-blue-500"></i>
                            </a>
                          ))}
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
