
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext, TimelineEvent } from '../types';

interface WeeklyTimelineProps {
  context: LocalContext;
}

const WeeklyTimeline: React.FC<WeeklyTimelineProps> = ({ context }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await geminiService.fetchWeeklyTimeline(context);
        setEvents(data);
      } catch (err) {
        console.error("Timeline failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [context.language]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/20 mb-8">
           <i className="fas fa-hourglass-start text-amber-500 text-3xl animate-spin-slow"></i>
        </div>
        <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs">इतिहास का पहिया घूम रहा है...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      <div className="bg-slate-900 rounded-[3rem] p-12 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150">
          <i className="fas fa-timeline text-[200px] text-emerald-500"></i>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-tight">साप्ताहिक <span className="text-emerald-500">कालक्रम</span></h2>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mt-4">
            इस सप्ताह इतिहास में क्या-क्या हुआ? सदियों पहले 'पहिले' की दुनिया और 'आज' का आधुनिक काल।
          </p>
        </div>
      </div>

      <div className="relative pl-8 md:pl-0">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-500 via-amber-500 to-transparent"></div>

        <div className="space-y-16">
          {events.map((event, idx) => (
            <div key={idx} className={`relative flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-950 border-4 border-emerald-500 rounded-full z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
              
              <div className="w-full md:w-5/12 ml-12 md:ml-0">
                <div className={`bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl transition-all hover:scale-[1.02] hover:border-emerald-500/30 group ${idx % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-emerald-500 tracking-tighter group-hover:animate-pulse">{event.year}</span>
                    <i className="fas fa-calendar-check text-slate-700 text-xl"></i>
                  </div>
                  <h4 className="text-xl font-black text-white mb-3 leading-tight">{event.event}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 text-center">
         <p className="text-slate-500 italic text-lg leading-relaxed">
           "इतिहास हमें यह नहीं सिखाता कि क्या हुआ, बल्कि यह कि कानून कैसे बदल गया।"
         </p>
         <p className="text-emerald-500 font-black uppercase tracking-widest mt-4 text-[10px]">— ज्ञान सेतु कालक्रम</p>
      </div>
    </div>
  );
};

export default WeeklyTimeline;
