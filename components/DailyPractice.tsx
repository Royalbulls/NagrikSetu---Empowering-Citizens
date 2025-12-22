
import React, { useState, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown';

const DailyPractice: React.FC<{ context: LocalContext; onEarnPoints: (val: number) => void }> = ({ context, onEarnPoints }) => {
  const [growthData, setGrowthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimit, setIsRateLimit] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [puzzleAnswered, setPuzzleAnswered] = useState<number | null>(null);
  const [commitment, setCommitment] = useState('');

  const fetchSadhana = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsRateLimit(false);
    try {
      const data = await geminiService.generateDailyGrowth(context);
      if (data && data.affirmation) {
        setGrowthData(data);
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (err: any) {
      console.error("[NagrikSetu] Growth fetching failed", err);
      const isQuotaError = 
        err?.message === 'SYSTEM_BUSY' || 
        err?.message?.includes('429') || 
        err?.message?.includes('RESOURCE_EXHAUSTED');
        
      setIsRateLimit(isQuotaError);
      setError(isQuotaError 
        ? "AI सिस्टम फिलहाल व्यस्त है (Quota Limit reached)। कृपया 1-2 मिनट बाद दोबारा प्रयास करें।" 
        : "सेवा अभी अनुपलब्ध है। कृपया अपना इंटरनेट कनेक्शन जांचें।");
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => {
    fetchSadhana();
  }, [fetchSadhana]);

  const toggleTask = (taskId: string, points: number) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
      onEarnPoints(points);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
        <div className="w-24 h-24 relative mb-8">
          <div className="absolute inset-0 border-4 border-amber-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <i className="fas fa-crown absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 text-3xl animate-pulse"></i>
        </div>
        <p className="text-amber-500 font-black text-xl uppercase tracking-[0.3em] text-center">Preparing Daily Sadhana...</p>
        <p className="text-slate-500 text-sm mt-2">शक्तिशाली बनने की यात्रा शुरू हो रही है</p>
      </div>
    );
  }

  if (error || !growthData) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fadeIn text-center space-y-8 bg-slate-900/50 rounded-[3rem] border border-white/5 mx-4">
        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-2xl">
          <i className="fas fa-hourglass-half text-4xl animate-pulse"></i>
        </div>
        <div className="space-y-3 max-w-md px-6">
          <h3 className="text-3xl font-black text-white">साधना लोड नहीं हो सकी</h3>
          <p className="text-slate-400 font-medium leading-relaxed">{error}</p>
        </div>
        <button 
          onClick={fetchSadhana}
          className="bg-amber-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl active:scale-95"
        >
          दोबारा प्रयास करें (Retry)
        </button>
      </div>
    );
  }

  const completionPercentage = (completedTasks.length / 4) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fadeIn pb-24 px-4">
      {/* Header with Progress */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 opacity-[0.05] pointer-events-none">
          <i className="fas fa-scroll text-[150px] text-amber-500"></i>
        </div>
        
        <div className="flex-1 space-y-3 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg">
              <i className="fas fa-shield-halved text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">दैनिक साधना (Daily Ritual)</h2>
              <p className="text-amber-500/60 font-bold text-[10px] uppercase tracking-widest mt-1">
                Grow Powerful, Grow Smart • {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="text-slate-400 text-lg italic border-l-2 border-amber-500/30 pl-4 py-1 leading-relaxed">"{growthData.affirmation}"</p>
        </div>

        <div className="flex flex-col items-center space-y-2 relative z-10">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
              <circle 
                cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="8" 
                className="text-amber-500 transition-all duration-1000"
                strokeDasharray={314}
                strokeDashoffset={314 - (314 * completionPercentage) / 100}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-black text-white">{Math.round(completionPercentage)}%</span>
            </div>
          </div>
          <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Growth Progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strategy Section */}
        <div className={`bg-slate-900 p-10 rounded-[3rem] border transition-all duration-500 ${completedTasks.includes('strategy') ? 'border-amber-500/50 grayscale-[0.8]' : 'border-amber-500/10 hover:border-amber-500/30'} shadow-xl relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className="fas fa-chess-knight text-[120px] text-amber-500"></i>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase rounded-full border border-amber-500/20">शक्तिशाली रणनीति (Ran-Neeti)</span>
              {growthData.strategy.source && <span className="text-slate-500 text-[9px] font-bold uppercase">Source: {growthData.strategy.source}</span>}
            </div>
            <h3 className="text-2xl font-black text-white">{growthData.strategy.title}</h3>
            <div className="prose prose-invert prose-sm text-slate-300 leading-relaxed">
               <ReactMarkdown>{growthData.strategy.content}</ReactMarkdown>
            </div>
            <button 
              onClick={() => toggleTask('strategy', 50)}
              disabled={completedTasks.includes('strategy')}
              className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center space-x-3 ${completedTasks.includes('strategy') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg active:scale-95'}`}
            >
              <i className={`fas ${completedTasks.includes('strategy') ? 'fa-check' : 'fa-bolt'}`}></i>
              <span>{completedTasks.includes('strategy') ? 'Absorbed' : 'Adopt Principle'}</span>
            </button>
          </div>
        </div>

        {/* Logic Puzzle Section */}
        <div className={`bg-slate-900 p-10 rounded-[3rem] border transition-all duration-500 ${completedTasks.includes('puzzle') ? 'border-purple-500/50 grayscale-[0.8]' : 'border-purple-500/10 hover:border-purple-500/30'} shadow-xl relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10">
            <i className="fas fa-puzzle-piece text-[120px] text-purple-500"></i>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-[9px] font-black uppercase rounded-full border border-amber-500/20">बुद्धि परीक्षण (Logic duel)</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white leading-relaxed">{growthData.logicPuzzle.question}</h3>
            
            <div className="space-y-3">
              {growthData.logicPuzzle.options.map((opt: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPuzzleAnswered(idx);
                    if (idx === growthData.logicPuzzle.correctIndex) {
                      toggleTask('puzzle', 75);
                    }
                  }}
                  disabled={puzzleAnswered !== null}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm font-bold flex items-center justify-between ${
                    puzzleAnswered === idx 
                      ? (idx === growthData.logicPuzzle.correctIndex ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400')
                      : (puzzleAnswered !== null && idx === growthData.logicPuzzle.correctIndex ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-purple-500/30 hover:bg-slate-800')
                  }`}
                >
                  <span className="pr-4">{opt}</span>
                  {puzzleAnswered === idx && (
                    <i className={`fas ${idx === growthData.logicPuzzle.correctIndex ? 'fa-check-circle' : 'fa-times-circle'} shrink-0`}></i>
                  )}
                </button>
              ))}
            </div>
            
            {puzzleAnswered !== null && (
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 animate-slideUp">
                <div className="flex items-center space-x-2 mb-2">
                   <i className="fas fa-info-circle text-purple-400 text-xs"></i>
                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Logic Explanation</p>
                </div>
                <p className="text-xs text-slate-400 italic leading-relaxed">{growthData.logicPuzzle.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Ethics & Commitment Section */}
        <div className={`bg-slate-900 p-10 rounded-[3rem] border transition-all duration-500 ${completedTasks.includes('ethics') ? 'border-cyan-500/50 grayscale-[0.8]' : 'border-cyan-500/10 hover:border-cyan-500/30'} shadow-xl relative overflow-hidden group`}>
          <div className="absolute bottom-0 right-0 p-8 opacity-5 group-hover:opacity-10">
            <i className="fas fa-hand-holding-heart text-[120px] text-cyan-500"></i>
          </div>
          <div className="relative z-10 space-y-6">
             <div className="flex items-center space-x-3">
               <span className="px-3 py-1 bg-cyan-500/10 text-cyan-500 text-[9px] font-black uppercase rounded-full border border-amber-500/20">मर्यादा और शक्ति (Ethics)</span>
             </div>
             <h3 className="text-2xl font-black text-white">{growthData.ethicsHabit.title}</h3>
             <p className="text-slate-300 text-lg leading-relaxed">{growthData.ethicsHabit.action}</p>
             
             <div className="space-y-4 pt-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">आपका संकल्प (Your Commitment)</label>
                <input 
                  type="text"
                  value={commitment}
                  onChange={(e) => setCommitment(e.target.value)}
                  placeholder="आज मैं इस नियम का पालन कैसे करूँगा..."
                  className="w-full bg-slate-950 border border-cyan-900/20 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-700"
                />
                <button 
                  onClick={() => toggleTask('ethics', 40)}
                  disabled={completedTasks.includes('ethics') || !commitment}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center space-x-3 ${completedTasks.includes('ethics') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 active:scale-95'}`}
                >
                  <i className="fas fa-anchor"></i>
                  <span>संकल्प लें (Make Commitment)</span>
                </button>
             </div>
          </div>
        </div>

        {/* Growth Stats Card */}
        <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden shadow-2xl min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
          <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center text-3xl text-amber-500 border border-amber-500/20 shadow-inner">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="space-y-2 relative z-10">
            <h4 className="text-3xl font-black text-white">Progress Analysis</h4>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">हर साधना आपको एक बेहतर रणनीतिकार और जानकार नागरिक बनाती है।</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full relative z-10">
            <div className="bg-slate-800/50 p-6 rounded-[2rem] border border-white/5">
              <p className="text-2xl font-black text-amber-500">{completedTasks.length}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Completed</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-[2rem] border border-white/5">
              <p className="text-2xl font-black text-emerald-500">+{completedTasks.length * 40}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Points Gained</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Celebration */}
      {completedTasks.length >= 3 && (
        <div className="bg-emerald-500/10 border-2 border-emerald-500/30 p-10 rounded-[3rem] text-center space-y-4 animate-bounce-slow">
           <i className="fas fa-star text-emerald-500 text-4xl mb-4"></i>
           <h3 className="text-2xl md:text-3xl font-black text-white italic">"ज्ञान और संयम ही विजय का आधार है"</h3>
           <p className="text-emerald-500/70 font-bold uppercase tracking-widest text-[10px]">आपकी आज की साधना सफल हुई। कल फिर से नए संकल्प के साथ मिलें।</p>
        </div>
      )}
    </div>
  );
};

export default DailyPractice;
