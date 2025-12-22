
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown';

const MarketVision: React.FC<{ context: LocalContext }> = ({ context }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const data = await geminiService.analyzeMarketPosition(context);
      setAnalysis(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [context.language]);

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      {/* Visual Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 p-12 rounded-[4rem] border-2 border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none">
          <i className="fas fa-rocket text-[200px] text-blue-400 rotate-12"></i>
        </div>
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex items-center space-x-4">
             <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
               <i className="fas fa-chart-line text-3xl"></i>
             </div>
             <div>
               <h2 className="text-4xl font-black text-white tracking-tighter uppercase">विज़न लैब (Market Vision Lab)</h2>
               <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em]">Future of Gyan Setu Ecosystem</p>
             </div>
          </div>
          <p className="text-slate-300 text-xl font-medium leading-relaxed">
            यह सेक्शन इस बात का विश्लेषण करता है कि "ज्ञान सेतु" अन्य AI सिस्टमों से अलग क्यों है और मार्केट में आने पर यह कैसे एक क्रांतिकारी नागरिक टूल बनेगा।
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
           <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border-2 border-blue-500/20">
              <i className="fas fa-brain text-blue-500 text-3xl animate-pulse"></i>
           </div>
           <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-sm">Deep Strategic Analysis in Progress...</p>
        </div>
      ) : (
        <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative">
           <div className="absolute top-0 left-0 p-12 opacity-[0.02] pointer-events-none">
              <i className="fas fa-gemini text-[300px] text-white"></i>
           </div>
           <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-xl leading-relaxed relative z-10 font-medium">
              <ReactMarkdown>{analysis}</ReactMarkdown>
           </div>
           
           <div className="mt-12 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10">
                 <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2">Target Market</h4>
                 <p className="text-white font-bold">100M+ Hindi Citizens</p>
              </div>
              <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10">
                 <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-2">Moat (सुरक्षा कवच)</h4>
                 <p className="text-white font-bold">Domain Specific Reasoning</p>
              </div>
              <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10">
                 <h4 className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-2">Core Impact</h4>
                 <p className="text-white font-bold">Informed & Empowered Nation</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MarketVision;
