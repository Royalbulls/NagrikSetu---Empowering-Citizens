
import React, { useState, useEffect } from 'react';
import AdSlot from './AdSlot';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'react-markdown';

const EPaper: React.FC<{ context: LocalContext; onEarnPoints: (v: number) => void }> = ({ context, onEarnPoints }) => {
  const [edition, setEdition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchEdition = async () => {
    setLoading(true);
    try {
      const data = await geminiService.generateDailyEdition(context);
      setEdition(data);
      onEarnPoints(50);
    } catch (e) {
      console.error("ePaper loading error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdition();
  }, [context.language]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-fadeIn text-center">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 animate-spin">
           <i className="fas fa-newspaper text-white text-4xl"></i>
        </div>
        <p className="text-amber-500 font-black uppercase tracking-[0.5em] text-xs">ताज़ा संस्करण छप रहा है...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn pb-40 px-2 md:px-0 bg-[#f9f9f7] min-h-screen border-x border-slate-300 shadow-2xl">
      
      <div className="bg-rose-700 text-white text-center py-1.5 font-black text-xs uppercase tracking-widest shadow-md">
         राष्ट्रीय संस्करण (AAJ NEWS FEED)
      </div>

      <div className="bg-white border-b-4 border-slate-950 p-6 md:p-10 text-slate-950 space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex flex-col gap-1 items-start text-[10px] font-black uppercase tracking-tighter leading-none border-l-4 border-rose-600 pl-4">
               <span>अंक: #4205 • वर्ष: 1</span>
               <span>पंजीकृत: RBA MEDIA GROUP</span>
            </div>
            
            <div className="flex flex-col items-center">
               <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none text-center font-serif">
                  नागरिक <span className="text-rose-700">सेतु</span>
               </h1>
               <div className="w-full h-1 bg-slate-900 mt-2"></div>
               <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.6em] mt-2 italic text-slate-500">जागरूक नागरिक, सशक्त राष्ट्र</p>
            </div>

            <div className="text-[10px] font-black uppercase tracking-tighter text-right border-r-4 border-rose-600 pr-4">
               {new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br />
               FREE • rbaadvisor.com
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white border-b-4 border-slate-950 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-slate-300">
         
         <div className="lg:col-span-3 p-6 space-y-8 bg-slate-50">
            <div className="border-b-4 border-rose-700 pb-2 mb-6">
               <h3 className="text-xl font-black text-rose-700 uppercase italic">संक्षेप में (Briefs)</h3>
            </div>
            {edition?.briefs?.map((brief: any, i: number) => (
              <div key={i} className="space-y-2 group cursor-pointer hover:bg-white p-2 rounded-lg transition-all">
                 <p className="text-[10px] font-black text-rose-600 uppercase">#{brief.location}</p>
                 <h4 className="text-base font-bold leading-tight text-slate-900 group-hover:text-rose-700">{brief.title}</h4>
                 <div className="h-px bg-slate-200 w-full mt-4"></div>
              </div>
            ))}
            <AdSlot className="h-[250px] border-0" format="rectangle" />
         </div>

         <div className="lg:col-span-6 p-6 md:p-10 space-y-12">
            <div className="space-y-6">
               <h2 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter font-serif text-slate-900 decoration-rose-700/20 underline underline-offset-8">
                  {edition?.leadStory?.title || 'मुख्य समाचार'}
               </h2>
               <p className="text-xl font-bold text-slate-600 italic border-l-4 border-slate-900 pl-6 leading-relaxed">
                  {edition?.leadStory?.subHeadline}
               </p>
               <div className="prose prose-slate max-w-none text-slate-800 text-lg leading-relaxed font-medium">
                  {edition?.leadStory?.content ? <ReactMarkdown>{edition.leadStory.content}</ReactMarkdown> : 'सामग्री लोड हो रही है...'}
               </div>
            </div>

            <div className="bg-amber-50 border-4 border-slate-950 p-8 space-y-4 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><i className="fas fa-landmark text-4xl"></i></div>
               <h3 className="text-2xl font-black text-amber-900 italic uppercase">विरासत और आधुनिकता (Pehle vs Aaj)</h3>
               <p className="text-amber-800 font-bold text-base">विषय: {edition?.pehleVsAaj?.topic}</p>
               <p className="text-slate-800 text-lg italic leading-relaxed">{edition?.pehleVsAaj?.contrastText}</p>
            </div>
         </div>

         <div className="lg:col-span-3 p-6 space-y-10 bg-slate-50">
            <div className="bg-white p-6 border-2 border-slate-950 shadow-lg space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-950 text-white flex items-center justify-center font-black italic text-lg">S</div>
                  <h4 className="text-sm font-black uppercase tracking-tighter italic">विमर्श (Editorial)</h4>
               </div>
               <div className="text-slate-700 text-base leading-relaxed font-serif italic">
                  <ReactMarkdown>{edition?.editorial || 'संपादकीय उपलब्ध नहीं।'}</ReactMarkdown>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default EPaper;
