
import React, { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import { PublishedNews } from '../types';
import ReactMarkdown from 'react-markdown';

interface PublicFeedProps {
  initialNewsId?: string | null;
}

const PublicFeed: React.FC<PublicFeedProps> = ({ initialNewsId }) => {
  const [feed, setFeed] = useState<PublishedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<PublishedNews | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const data = await firebaseService.getPublicFeed();
        setFeed(data);
        
        // 🔗 Handle initial news item from deep link
        if (initialNewsId) {
          const item = data.find(n => n.id === initialNewsId);
          if (item) {
             setSelectedNews(item);
          } else {
             console.warn("Deep linked news ID not found in current feed:", initialNewsId);
          }
        }
      } catch (e) {
        console.error("Feed fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [initialNewsId]);

  const getShareableUrl = (id: string) => {
    const base = window.location.origin + window.location.pathname;
    return `${base}${base.endsWith('/') ? '' : '/'}?newsId=${id}`;
  };

  const handleShare = async (item: PublishedNews) => {
    const shareUrl = getShareableUrl(item.id);
    const shareTitle = `📰 नागरिक सेतु विशेष: ${item.data.leadStory.title}`;
    const shareText = `By: ${item.publisherName}\n\n📖 पूरा अखबार पढ़ने के लिए क्लिक करें:\n${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `नागरिक सेतु विशेष: ${item.data.leadStory.title}`,
          url: shareUrl
        });
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
        }
      }
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const copyToClipboard = async (id: string) => {
    try {
      const url = getShareableUrl(id);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-fadeIn">
        <div className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">Accessing Public Archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      {/* 🌍 Global Feed Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 rotate-12">
          <i className="fas fa-globe text-[200px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-4">
           <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                 <i className="fas fa-newspaper text-2xl"></i>
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">ग्लोबल <span className="text-rose-600">न्यूज़ फीड</span></h2>
                 <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 italic">Explore citizen broadcasts from across the nation</p>
              </div>
           </div>
        </div>
      </div>

      {feed.length === 0 ? (
        <div className="bg-slate-900/40 p-24 rounded-[4rem] border-2 border-dashed border-white/5 text-center space-y-6">
           <i className="fas fa-satellite-dish text-6xl text-slate-800 animate-pulse"></i>
           <p className="text-slate-600 font-black uppercase tracking-widest">No broadcasts found. Be the first to publish!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {feed.map((item) => (
             <button 
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className={`bg-slate-900 p-8 rounded-[3rem] border transition-all text-left flex flex-col justify-between group shadow-xl h-[400px] relative overflow-hidden ${item.id === initialNewsId ? 'border-amber-500/50 ring-2 ring-amber-500/20 shadow-amber-500/5' : 'border-white/5 hover:border-rose-500/30'}`}
             >
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:scale-125 transition-transform duration-700">
                   <i className="fas fa-paper-plane text-[150px] text-white"></i>
                </div>
                
                <div className="space-y-6 relative z-10">
                   <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black uppercase bg-rose-600/20 text-rose-500 px-3 py-1 rounded-full">Global Anchor</span>
                      <span className="text-[8px] font-mono text-slate-600 italic">{new Date(item.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <h3 className="text-xl font-black text-white group-hover:text-rose-500 transition-colors line-clamp-3 italic uppercase leading-tight tracking-tight">
                     {item.data.leadStory.title}
                   </h3>
                   <p className="text-slate-500 text-xs font-medium italic line-clamp-3">
                     {item.data.leadStory.subHeadline}
                   </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-rose-600 group-hover:text-white transition-all">
                        {item.publisherName[0]}
                      </div>
                      <span className="text-[9px] font-black uppercase text-slate-400">{item.publisherName}</span>
                   </div>
                   <i className="fas fa-arrow-right-long text-slate-700 group-hover:text-rose-500 group-hover:translate-x-2 transition-all"></i>
                </div>
             </button>
           ))}
        </div>
      )}

      {/* 📖 Reader Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-6 animate-fadeIn overflow-y-auto">
           <div className="max-w-4xl w-full bg-[#f9f9f7] rounded-[3.5rem] p-1 shadow-[0_0_100px_rgba(255,255,255,0.05)] animate-slideUp my-auto">
              <div className="bg-white rounded-[3.3rem] overflow-hidden border-8 border-slate-100 min-h-[80vh] flex flex-col">
                 
                 <div className="bg-rose-700 text-white p-4 flex justify-between items-center px-10">
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Official Archive Read • By {selectedNews.publisherName}</span>
                    <button onClick={() => setSelectedNews(null)} className="hover:scale-125 transition-transform"><i className="fas fa-times text-xl"></i></button>
                 </div>

                 <div className="p-8 md:p-14 flex-1 text-slate-900 space-y-12">
                    <div className="text-center space-y-6">
                       <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-none tracking-tighter text-slate-900 font-serif">
                         नागरिक <span className="text-rose-700">सेतु</span>
                       </h1>
                       <div className="w-full h-1 bg-slate-950"></div>
                       <p className="text-3xl md:text-5xl font-black leading-tight italic tracking-tighter uppercase font-serif">
                         {selectedNews.data.leadStory.title}
                       </p>
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-800 text-xl leading-relaxed font-medium">
                       <ReactMarkdown>{selectedNews.data.leadStory.content}</ReactMarkdown>
                    </div>

                    <div className="bg-amber-50 p-8 rounded-[2.5rem] border-2 border-slate-950 italic">
                       <h4 className="text-amber-900 font-black uppercase text-xs mb-2">विरासत और आधुनिकता (Pehle vs Aaj)</h4>
                       <p className="text-slate-800 text-lg">{selectedNews.data.pehleVsAaj.contrastText}</p>
                    </div>
                 </div>

                 <div className="bg-slate-950 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">Broadcast ID: {selectedNews.id}</div>
                    <div className="flex gap-4">
                       <button 
                        onClick={() => copyToClipboard(selectedNews.id)}
                        className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all border border-white/10 ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                       >
                         <i className={`fas ${copied ? 'fa-check' : 'fa-link'} mr-2`}></i>
                         {copied ? 'Copied' : 'Copy Link'}
                       </button>
                       <button 
                        onClick={() => handleShare(selectedNews)}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-emerald-500"
                       >
                         <i className="fab fa-whatsapp"></i> Share
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PublicFeed;
