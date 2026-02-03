
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext, TrendItem } from '../types';
import ReactMarkdown from 'react-markdown';

interface TrendScannerProps {
  context: LocalContext;
  onEarnPoints: (amount: number) => void;
}

const TrendScanner: React.FC<TrendScannerProps> = ({ context, onEarnPoints }) => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activePost, setActivePost] = useState<{ topic: string, content: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('');

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh"
  ];

  const handleScan = async () => {
    setLoading(true);
    setTrends([]);
    setActivePost(null);
    try {
      const data = await geminiService.scanTrends(context, selectedState);
      setTrends(data);
      onEarnPoints(40);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generatePost = async (topic: string) => {
    setGenerating(true);
    setActivePost(null);
    try {
      const content = await geminiService.generateSocialPost(topic, context);
      setActivePost({ topic, content });
      onEarnPoints(30);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (activePost) {
      navigator.clipboard.writeText(activePost.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32 max-w-6xl mx-auto">
      {/* 📡 Mission Control Header */}
      <div className="bg-slate-900 border-b-4 border-emerald-500 p-10 md:p-14 rounded-[3.5rem] shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none animate-pulse">
          <i className="fas fa-satellite-dish text-[200px] text-emerald-400"></i>
        </div>
        <div className="relative z-10 space-y-6">
           <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl">
                 <i className="fas fa-tower-broadcast text-2xl"></i>
              </div>
              <div>
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">ट्रेंड <span className="text-emerald-400">स्कैनर</span></h2>
                 <p className="text-emerald-500/60 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Real-time Citizen Intelligence Center</p>
              </div>
           </div>
           <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-4xl border-l-4 border-emerald-500/40 pl-8 py-2 italic">
             "आज भारत में क्या चल रहा है? नागरिकों के अधिकारों और जन सेवाओं से जुड़े ट्रेंड्स को स्कैन करें। आप इसे किसी विशिष्ट राज्य के लिए भी फ़िल्टर कर सकते हैं।"
           </p>
           
           <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full md:w-80">
                 <select 
                    value={selectedState} 
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 appearance-none font-bold italic"
                 >
                    <option value="">-- पूरे भारत का चयन करें --</option>
                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
                 <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none"></i>
              </div>

              <button 
                onClick={handleScan}
                disabled={loading}
                className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-3xl hover:bg-emerald-500 transition-all active:scale-95 flex items-center gap-4 border-b-4 border-emerald-800"
              >
                {loading ? <i className="fas fa-dharmachakra fa-spin text-xl"></i> : <i className="fas fa-radar text-xl"></i>}
                <span>{loading ? "Scanning National Nodes..." : (selectedState ? `${selectedState} स्कैन करें` : "Scan Today's Trends (+40)")}</span>
              </button>
           </div>
        </div>
      </div>

      {trends.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slideUp">
           {trends.map((t, idx) => (
             <div key={idx} className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col justify-between group hover:border-emerald-500/30 transition-all h-[420px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><i className="fas fa-bolt-lightning text-7xl text-white"></i></div>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${t.riskLevel === 'High' ? 'bg-rose-600 text-white' : t.riskLevel === 'Medium' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'}`}>
                        {t.riskLevel} Risk
                      </span>
                      <i className="fas fa-circle-nodes text-slate-700 group-hover:text-emerald-500 transition-colors"></i>
                   </div>
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tight leading-tight line-clamp-3">"{t.topic}"</h3>
                   <p className="text-slate-500 text-sm font-medium italic border-l-2 border-white/5 pl-4 line-clamp-3">"{t.relevance}"</p>
                </div>
                <button 
                  onClick={() => generatePost(t.topic)}
                  disabled={generating}
                  className="w-full mt-10 bg-slate-950 border border-white/10 hover:bg-emerald-600 text-emerald-500 hover:text-white py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
                >
                   {generating ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-share-nodes"></i>}
                   <span>Generate Educational Post</span>
                </button>
             </div>
           ))}
        </div>
      )}

      {generating && (
        <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
           <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] mt-6 animate-pulse">Designing Compliant Post...</p>
        </div>
      )}

      {activePost && (
        <div className="bg-slate-900 rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] animate-slideUp border border-amber-500/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-[0.03]"><i className="fas fa-hashtag text-[200px] text-white"></i></div>
           
           <div className="flex justify-between items-center mb-12 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-xl">
                    <i className="fas fa-pen-nib text-xl"></i>
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">तैयार सोशल पोस्ट</h3>
                    <p className="text-amber-500 font-black text-[9px] uppercase tracking-widest">Educational & Compliant Format</p>
                 </div>
              </div>
              <button 
                onClick={handleCopy}
                className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl border-b-4 active:translate-y-1 ${copied ? 'bg-emerald-600 text-white border-emerald-800' : 'bg-slate-800 text-amber-500 border-slate-700 hover:bg-slate-700'}`}
              >
                 <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} mr-2`}></i>
                 {copied ? "Copied to Clipboard" : "Copy Post Text"}
              </button>
           </div>

           <div className="bg-slate-950 p-10 md:p-14 rounded-[3rem] border border-white/5 relative group cursor-text">
              <div className="absolute top-4 left-6 flex gap-1.5 opacity-30">
                 <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                 <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <div className="prose prose-invert max-w-none text-slate-200 text-2xl leading-relaxed italic font-medium whitespace-pre-wrap">
                 {activePost.content}
              </div>
           </div>
           
           <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="bg-rose-500/10 px-6 py-3 rounded-2xl border border-rose-500/20 italic">
                 <p className="text-[10px] font-bold text-rose-400">🚨 Compliance Rule: "यह जानकारी शैक्षणिक उद्देश्य से है" disclaimer included.</p>
              </div>
              <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest italic">RBA Advisor Verified Module</p>
           </div>
        </div>
      )}

      {trends.length === 0 && !loading && (
        <div className="bg-slate-900/40 p-24 rounded-[4rem] border-4 border-dashed border-white/5 text-center space-y-8 flex flex-col items-center grayscale opacity-40">
           <i className="fas fa-radar text-6xl text-slate-700"></i>
           <h4 className="text-3xl font-black text-white tracking-tighter italic uppercase">सिस्टम स्टैंडबाय मोड</h4>
           <p className="text-slate-500 max-w-md mx-auto font-bold uppercase tracking-widest text-xs leading-loose text-center">
              स्कैन बटन दबाएं ताकि 'संस्कृति' आज के महत्वपूर्ण नागरिक विषयों का विश्लेषण कर सके। आप राज्य चुनकर जानकारी को और सटीक बना सकते हैं।
           </p>
        </div>
      )}
    </div>
  );
};

export default TrendScanner;
