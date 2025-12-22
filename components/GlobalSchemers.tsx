
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext, SchemerInsight } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown';

interface GlobalSchemersProps {
  context: LocalContext;
  onEarnPoints: (amount: number) => void;
}

const GlobalSchemers: React.FC<GlobalSchemersProps> = ({ context, onEarnPoints }) => {
  const [query, setQuery] = useState('');
  const [insight, setInsight] = useState<SchemerInsight | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'wisdom' | 'modern' | 'profiles'>('wisdom');

  const handleFetchInsight = async (forcedQuery?: string) => {
    const finalQuery = forcedQuery || query;
    if (!finalQuery) return;
    setLoading(true);
    setInsight(null);
    setAnalysis(null);
    try {
      if (activeTab === 'wisdom' || activeTab === 'profiles') {
        const data = await geminiService.getSchemerInsight(finalQuery, context);
        setInsight(data);
      } else {
        const data = await geminiService.analyzeModernScam(finalQuery, context);
        setAnalysis(data);
      }
      onEarnPoints(30);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const trendingTopics = [
    { name: "Jaichand: Psychological Study", cat: 'wisdom' },
    { name: "The Art of Social Engineering", cat: 'modern' },
    { name: "Machiavellian Strategies", cat: 'profiles' },
    { name: "Chanakya on Trust", cat: 'wisdom' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      {/* Header Banner - Wisdom Style */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 p-12 opacity-10 pointer-events-none">
          <i className="fas fa-eye text-[120px] text-indigo-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white tracking-tighter">जागरूक नागरिक (Aware Citizen)</h2>
            <p className="text-indigo-400 font-bold text-xs uppercase tracking-[0.2em]">इतिहास की भूलों से सीखें और वर्तमान में सशक्त बनें</p>
          </div>
          <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5">
            {[
              { id: 'wisdom', label: 'Lessons' },
              { id: 'profiles', label: 'History' },
              { id: 'modern', label: 'Scam Awareness' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setQuery(''); setInsight(null); setAnalysis(null); }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-indigo-400'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl">
        <div className="space-y-8">
          <div className="relative group">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === 'wisdom' ? "इतिहास के सबक या रणनीतियों के बारे में पूछें..." :
                activeTab === 'profiles' ? "विशिष्ट ऐतिहासिक चरित्रों का विश्लेषण करें..." : 
                "किसी संदिग्ध घटना या कॉल के बारे में पूछें..."
              }
              className="w-full bg-slate-950 border border-indigo-900/20 rounded-[2.5rem] py-8 px-10 text-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-xl placeholder:text-slate-700 min-h-[120px] resize-none"
            />
            <button 
              onClick={() => handleFetchInsight()}
              disabled={loading || !query}
              className="absolute right-5 bottom-5 h-14 px-10 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-xl uppercase tracking-widest text-xs"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "Study Case"}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center mr-2">Top Insights:</span>
            {trendingTopics.map((t, idx) => (
              <button 
                key={idx}
                onClick={() => { setActiveTab(t.cat as any); setQuery(t.name); handleFetchInsight(t.name); }}
                className="bg-slate-800/50 hover:bg-indigo-500 hover:text-white text-slate-400 py-2 px-6 rounded-full text-[10px] font-black border border-white/5 transition-all"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center border-2 border-indigo-500/20 mb-6">
            <i className="fas fa-compass text-indigo-500 text-2xl animate-spin-slow"></i>
          </div>
          <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-sm">विवेक का विश्लेषण जारी है...</p>
        </div>
      )}

      {insight && (activeTab === 'wisdom' || activeTab === 'profiles') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slideUp">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
               <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <i className="fas fa-scroll text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white tracking-tighter">{insight.name}</h3>
                    <p className="text-amber-500 font-bold text-[10px] uppercase tracking-widest">{insight.era}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5">
                    <h4 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Methodology (व्यवहार का तरीका)</h4>
                    <p className="text-slate-300 text-lg leading-relaxed">{insight.tactic}</p>
                  </div>

                  <div className="bg-indigo-500/5 p-10 rounded-[3rem] border-l-8 border-l-amber-500 border border-white/5">
                    <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">The Wisdom Lesson (इतिहास की सीख)</h4>
                    <p className="text-slate-100 text-2xl italic leading-relaxed font-black">"{insight.lesson}"</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-white/5 shadow-xl space-y-8 h-fit">
            <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest flex items-center pb-4 border-b border-white/5">
              <i className="fas fa-lightbulb mr-3"></i> Key Observations
            </h4>
            <div className="space-y-4">
              {insight.warningSigns.map((sign, idx) => (
                <div key={idx} className="flex items-start space-x-4 bg-slate-950 p-5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-black shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-slate-400 text-sm font-bold leading-relaxed">{sign}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {analysis && activeTab === 'modern' && (
        <div className="bg-slate-900 p-12 rounded-[4rem] border border-amber-500/20 shadow-2xl animate-slideUp">
           <div className="flex items-center space-x-6 mb-10">
              <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/20">
                 <i className="fas fa-shield-halved text-3xl"></i>
              </div>
              <div>
                 <h3 className="text-3xl font-black text-white tracking-tighter">Wisdom Report</h3>
                 <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em]">Behavioral Awareness Analysis</p>
              </div>
           </div>
           <div className="prose prose-invert prose-indigo max-w-none text-slate-200 text-xl leading-relaxed">
              <ReactMarkdown>{analysis}</ReactMarkdown>
           </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSchemers;
