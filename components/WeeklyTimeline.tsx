
import React, { useState, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext, TimelineEvent } from '../types';

interface WeeklyTimelineProps {
  context: LocalContext;
}

const WeeklyTimeline: React.FC<WeeklyTimelineProps> = ({ context }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsBusy(false);
    try {
      const data = await geminiService.fetchTodayInHistory(context);
      setEvents(data);
    } catch (err: any) {
      console.error("Timeline failed", err);
      if (err?.message === 'SYSTEM_BUSY') {
        setIsBusy(true);
        setError("AI सिस्टम अभी व्यस्त है (System Busy)।");
      } else {
        setError("इतिहास लोड करने में समस्या आई है।");
      }
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const now = new Date();
  const todayDateStr = now.toLocaleDateString(context.language === 'Hindi' ? 'hi-IN' : 'en-US', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });

  const hour = now.getHours();
  const timeGreeting = hour < 12 ? 'शुभ प्रभात' : hour < 17 ? 'शुभ दोपहर' : hour < 21 ? 'शुभ संध्या' : 'शुभ रात्रि';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
        <div className="w-24 h-24 bg-amber-500/10 rounded-[2rem] flex items-center justify-center border-2 border-amber-500/20 mb-8 relative">
           <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-[2rem] animate-spin"></div>
           <i className="fas fa-history text-amber-500 text-3xl"></i>
        </div>
        <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">समय का चक्र घूम रहा है...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-slate-900/50 rounded-[3rem] border border-white/5 mx-4">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/20">
          <i className={`fas ${isBusy ? 'fa-bolt-lightning' : 'fa-triangle-exclamation'} text-3xl`}></i>
        </div>
        <div className="space-y-2 px-6">
          <h3 className="text-2xl font-black text-white uppercase italic">{isBusy ? "System Busy" : "लोडिंग त्रुटि"}</h3>
          <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm">{error} {isBusy ? "कृपया दोबारा प्रयास करें।" : ""}</p>
        </div>
        <button 
          onClick={fetchEvents}
          className="bg-amber-500 text-slate-950 px-10 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl active:scale-95 text-xs"
        >
          दोबारा प्रयास करें (Retry)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn pb-24 px-4 md:px-0">
      <div className="bg-slate-900 rounded-[3.5rem] p-12 border border-emerald-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 rotate-12">
          <i className="fas fa-calendar-check text-[200px] text-emerald-500"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg">
                <i className="fas fa-bolt-lightning"></i>
             </div>
             <div>
                <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em]">{timeGreeting}, नागरिक!</p>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{todayDateStr}</h2>
             </div>
          </div>
          <p className="text-slate-400 text-xl font-medium max-w-2xl border-l-4 border-emerald-500/30 pl-6 py-2 italic leading-relaxed">
            "आज की तारीख इतिहास के दर्पण में क्या कहानी कहती है? आइए समय के पन्नों को एक साथ पलटें।"
          </p>
        </div>
      </div>

      <div className="relative pl-8 md:pl-0">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-emerald-500 via-amber-500 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>

        <div className="space-y-20">
          {events.map((event, idx) => (
            <div key={idx} className={`relative flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-950 border-4 border-emerald-500 rounded-full z-10 shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              </div>
              
              <div className="w-full md:w-5/12 ml-12 md:ml-0">
                <div className={`bg-slate-900/60 backdrop-blur-md p-10 rounded-[3rem] border border-white/5 shadow-2xl transition-all hover:scale-[1.03] hover:border-emerald-500/40 group ${idx % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-emerald-500 tracking-tighter italic">{event.year}</span>
                    <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-slate-700 border border-white/5 group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all">
                       <i className="fas fa-scroll"></i>
                    </div>
                  </div>
                  <h4 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-emerald-400 transition-colors">{event.event}</h4>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium italic">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/80 p-12 rounded-[3.5rem] border border-white/5 text-center mt-20 shadow-3xl">
         <p className="text-slate-500 italic text-xl leading-relaxed">
           "समय सबसे बड़ा शिक्षक है, और इतिहास उसका सबसे महत्वपूर्ण पाठ।"
         </p>
         <div className="mt-8 flex justify-center">
            <span className="px-6 py-2 bg-emerald-500/10 text-emerald-500 rounded-full font-black text-[10px] uppercase tracking-widest border border-emerald-500/20">
              Last Synced: {now.toLocaleTimeString()}
            </span>
         </div>
      </div>
    </div>
  );
};

export default WeeklyTimeline;
