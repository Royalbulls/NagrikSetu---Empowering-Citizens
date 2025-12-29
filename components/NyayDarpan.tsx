
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';

const NyayDarpan: React.FC<{ context: LocalContext; onEarnPoints: (v: number) => void }> = ({ context, onEarnPoints }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJusticeData = async () => {
      setLoading(true);
      try {
        const result = await geminiService.analyzeJusticePendency(context);
        setData(result);
        onEarnPoints(30);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJusticeData();
  }, [context.language]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-fadeIn">
         <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border-2 border-blue-500/20 mb-8 relative">
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <i className="fas fa-gavel text-blue-500 text-3xl animate-pulse"></i>
         </div>
         <p className="text-blue-400 font-black uppercase tracking-[0.4em] text-xs animate-pulse">न्याय के दर्पण को साफ किया जा रहा है...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[3.5rem] p-10 md:p-14 border border-blue-500/30 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-balance-scale text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
           <div className="flex items-center space-x-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl">
                 <i className="fas fa-landmark-dome text-2xl md:text-3xl"></i>
              </div>
              <div>
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">न्याय <span className="text-amber-500 underline decoration-white/20">दर्पण</span></h2>
                 <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mt-2">Indian Legal Pendency Analysis • 2025 Vision</p>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <p className="text-slate-300 text-xl font-medium leading-relaxed italic border-l-4 border-blue-500/50 pl-8">
                "5 करोड़ से ज्यादा केस लंबित होने का मतलब न्याय का अभाव नहीं, बल्कि सही प्रक्रिया की जानकारी का अभाव है।"
              </p>
              <div className="bg-slate-950/60 p-8 rounded-[2.5rem] border border-white/5 text-center space-y-2">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">कुल लंबित मामले (Approx)</p>
                 <p className="text-6xl font-black text-white tracking-tighter">{data?.totalCases || '---'}</p>
                 <p className="text-emerald-500 font-bold text-[10px] uppercase">Official Status: Critical Awareness Phase</p>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-8">
         <h3 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
            <i className="fas fa-list-check text-blue-500"></i>
            केसों का वर्गीकरण (Top Categories)
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.categories?.map((cat: any, i: number) => (
              <div key={i} className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all group shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                    <i className="fas fa-folder-open text-6xl"></i>
                 </div>
                 <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-2">#{cat.name}</h4>
                 <p className="text-3xl font-black text-white mb-2">{cat.count}</p>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed italic border-t border-white/5 pt-4">"{cat.reason}"</p>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-rose-500/10 shadow-2xl space-y-8">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4 text-rose-500">
               <i className="fas fa-triangle-exclamation"></i>
               रुकावट के कारण (Root Causes)
            </h3>
            <div className="space-y-4">
               {data?.rootCauses?.map((cause: string, i: number) => (
                 <div key={i} className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex items-start gap-5">
                    <span className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-500 flex items-center justify-center font-black text-xs shrink-0">{i+1}</span>
                    <p className="text-slate-300 font-medium">{cause}</p>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-emerald-500/10 shadow-2xl space-y-8">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4 text-emerald-500">
               <i className="fas fa-hand-holding-heart"></i>
               समाधान और विकल्प (Paths to Justice)
            </h3>
            <div className="space-y-4">
               {data?.solutions?.map((sol: string, i: number) => (
                 <div key={i} className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex items-start gap-5 group hover:border-emerald-500/40 transition-all cursor-pointer">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-lg">{i+1}</span>
                    <p className="text-white font-bold leading-tight">{sol}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="bg-blue-600/10 p-12 rounded-[4rem] border-2 border-blue-500/20 text-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 animate-pulse"></div>
         <i className="fas fa-quote-left text-blue-500/10 text-8xl absolute top-10 left-10"></i>
         <div className="relative z-10 space-y-6">
            <h4 className="text-blue-400 font-black text-xs uppercase tracking-[0.5em]">संवैधानिक संदेश (Sanskriti's Wisdom)</h4>
            <p className="text-slate-200 italic text-3xl leading-relaxed max-w-5xl mx-auto font-medium">
               "{data?.mentorMessage || 'न्याय के पथ पर अडिग रहें।'}"
            </p>
         </div>
      </div>
    </div>
  );
};

export default NyayDarpan;
