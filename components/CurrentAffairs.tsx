
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { LocalContext } from '../types';

const CurrentAffairs: React.FC<{ onEarnPoints: () => void; context: LocalContext }> = ({ onEarnPoints, context }) => {
  const [query, setQuery] = useState('');
  const [newsResult, setNewsResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trendingBrief, setTrendingBrief] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState('Trending');
  const [tickerIndex, setTickerIndex] = useState(0);

  const categories = ['Trending', 'Global', 'Bharat', 'Legal', 'Tech', 'Economy'];
  const tickerItems = [
    "🇮🇳 भारत की नई आर्थिक नीति 2025: आम नागरिक पर प्रभाव...",
    "🌍 ग्लोबल वार्मिंग रिपोर्ट: 2030 तक बड़े बदलावों के संकेत...",
    "⚖️ सुप्रीम कोर्ट: डिजिटल प्राइवेसी पर ऐतिहासिक फैसला...",
    "🚀 इसरो का नया सूर्य मिशन: अंतरिक्ष विज्ञान में नया अध्याय...",
    "💰 डिजिटल रुपया और साइबर सुरक्षा: क्या सावधानियां बरतें?"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 5000);
    fetchDailyPulse();
    return () => clearInterval(timer);
  }, []);

  const fetchDailyPulse = async () => {
    setLoading(true);
    try {
      const res = await geminiService.fetchTrendingNews(context);
      setTrendingBrief(res.text || "");
      if (res.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(res.candidates[0].groundingMetadata.groundingChunks);
      }
    } catch (e) {
      setTrendingBrief("न्यूज़ फीड लोड करने में समस्या आई।");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (forcedQuery?: string) => {
    const activeQuery = forcedQuery || query;
    if (!activeQuery) return;
    setLoading(true);
    setNewsResult('');
    setLinks([]);
    setSuggestions([]);

    try {
      const result = await geminiService.searchCurrentEvents(activeQuery, context);
      const text = result.text || "कोई परिणाम नहीं मिले।";
      setNewsResult(text);
      
      if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(result.candidates[0].groundingMetadata.groundingChunks);
      }

      const followUps = await geminiService.getFollowUpSuggestions(activeQuery, text, context);
      setSuggestions(followUps || []);
      
      onEarnPoints();
    } catch (error) {
      setNewsResult("न्यूज़ सर्च करने में समस्या आई।");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'Trending') {
      setNewsResult('');
      fetchDailyPulse();
    } else {
      const targetQuery = `${cat} latest news today and its global context`;
      setQuery(`${cat} Special Report`);
      handleSearch(targetQuery);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      <div className="bg-rose-600/10 border-y border-rose-600/30 overflow-hidden py-3 relative group">
         <div className="flex items-center space-x-12 animate-marquee whitespace-nowrap">
            <div className="flex items-center gap-3 bg-rose-600 text-white px-5 py-1 rounded-lg text-[10px] font-black uppercase italic shadow-2xl flex-shrink-0">
               <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
               MEDIA ALERT
            </div>
            <p className="text-white font-black text-sm uppercase italic tracking-wider transition-all duration-1000">
               {tickerItems[tickerIndex]}
            </p>
         </div>
      </div>

      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-14 border border-white/5 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.04] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-tower-broadcast text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-12">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl border-4 border-white/10">
                   <i className="fas fa-newspaper text-3xl"></i>
                </div>
                <div>
                   <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">RBA <span className="text-rose-600">प्रेस</span></h2>
                   <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.6em] mt-3">Verified Digital Media Hub • {context.domain || 'rbaadvisor.com'}</p>
                </div>
              </div>
           </div>
           
           <div className="relative group max-w-5xl">
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="किसी भी वैश्विक घटना या समाचार हेडलाइन को डिकोड करें..."
                className="w-full bg-slate-950 border-2 border-white/5 rounded-[2.5rem] py-7 pl-16 pr-44 text-white text-xl placeholder:text-slate-800 outline-none focus:border-rose-500/50 transition-all shadow-inner font-medium"
              />
              <button 
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="absolute right-3 top-3 bottom-3 px-10 bg-rose-600 text-white font-black rounded-[2rem] hover:bg-rose-500 transition-all text-xs uppercase tracking-widest shadow-xl flex items-center"
              >
                {loading ? <i className="fas fa-dharmachakra fa-spin text-xl"></i> : "SCAN NEWS"}
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-10">
           {!loading && (newsResult || trendingBrief) && (
             <div className="bg-slate-900 p-10 md:p-20 rounded-[5rem] border-2 border-white/5 shadow-3xl animate-slideUp relative overflow-hidden">
                <div className="absolute top-0 left-0 p-12 opacity-[0.02] pointer-events-none scale-150">
                   <i className="fas fa-quote-right text-[400px] text-white"></i>
                </div>
                
                <div className="relative z-10 space-y-12">
                   <div className="prose prose-invert prose-rose max-w-none text-slate-200 text-2xl leading-relaxed font-medium history-content article-body">
                      <ReactMarkdown>{newsResult || trendingBrief}</ReactMarkdown>
                   </div>

                   {links?.length > 0 && (
                     <div className="pt-12 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                           <i className="fas fa-link text-rose-500"></i>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">प्रमाणित समाचार स्रोत (Trusted Sources)</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           {links.map((link, i) => (
                             <a 
                               key={i} 
                               href={link.web?.uri} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="bg-slate-950 p-8 rounded-3xl border border-white/5 hover:border-rose-500/40 transition-all group flex items-center justify-between shadow-2xl"
                             >
                                <div className="space-y-2">
                                   <p className="text-white font-black text-base line-clamp-1 group-hover:text-rose-400 transition-colors">{link.web?.title || "News Link"}</p>
                                </div>
                             </a>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairs;
