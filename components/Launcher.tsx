
import React, { useRef, useState, useEffect } from 'react';
import { AppSection, UserProfile } from '../types';
import { geminiService } from '../services/geminiService';
import { translations } from '../utils/translations';

// Audio Decoder Helper
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface LauncherProps {
  onSelectApp: (section: AppSection) => void;
  points: number;
  isGuest?: boolean;
  onLogin?: () => void;
  userProfile?: UserProfile;
  language: string;
}

const Launcher: React.FC<LauncherProps> = ({ onSelectApp, points, isGuest, onLogin, userProfile, language }) => {
  const serviceRef = useRef<HTMLDivElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const t = translations[language] || translations['English'];
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSanskritiMessage = async () => {
    if (isSpeaking) {
      if (sourceRef.current) try { sourceRef.current.stop(); } catch (e) {}
      setIsSpeaking(false);
      return;
    }
    
    setIsSpeaking(true);
      
    try {
      const context = { language, country: 'India', city: userProfile?.city };
      const dynamicMsg = await geminiService.generateDynamicGreeting(context, userProfile);
      
      const audioBytes = await geminiService.speak(dynamicMsg, 'Zephyr');
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      await ctx.resume();
      const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      sourceRef.current = source;
      source.start(0);
    } catch (err) {
      console.error("Sanskriti voice failure:", err);
      setIsSpeaking(false);
    }
  };

  const services = [
    { 
      id: AppSection.HISTORY, 
      name: t.sections.history, 
      desc: t.serviceDescs.history,
      icon: "fa-earth-asia", 
      color: "from-amber-500 to-orange-600" 
    },
    { 
      id: AppSection.CONSTITUTION, 
      name: t.sections.rights, 
      desc: t.serviceDescs.rights,
      icon: "fa-building-columns", 
      color: "from-blue-600 to-indigo-700" 
    },
    { 
      id: AppSection.LOCAL_LAWS_EXPOSED, 
      name: t.sections.laws, 
      desc: t.serviceDescs.laws,
      icon: "fa-eye", 
      color: "from-rose-600 to-red-700" 
    },
    { 
      id: AppSection.SAHAYATA_KENDRA, 
      name: t.sections.help, 
      desc: t.serviceDescs.help,
      icon: "fa-handshake-angle", 
      color: "from-emerald-500 to-teal-600" 
    }
  ];

  return (
    <div className="space-y-24 md:space-y-32 animate-fadeIn py-12 max-w-7xl mx-auto px-4 overflow-hidden">
      
      <section className="text-center space-y-12 md:space-y-16 relative py-12 min-h-[60vh] flex flex-col justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-amber-500/[0.03] blur-[140px] rounded-full -z-10"></div>
        
        <div className="space-y-8 animate-slideUp">
           <div className="inline-flex items-center gap-4 bg-amber-500/10 px-8 py-3 rounded-full border border-amber-500/20 mb-4 shadow-xl">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">{t.launcher.globalConsole}</span>
           </div>

           <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.85] royal-serif select-none drop-shadow-2xl">
             {t.hero.title} <span className="text-amber-500 font-sans tracking-tight block md:inline">{t.hero.subtitle}</span>
           </h1>
           
           <p className="text-slate-400 text-xl md:text-3xl font-medium max-w-4xl mx-auto italic leading-relaxed text-center mt-8 px-4">
             "{t.hero.description}"
           </p>

           <div className="pt-8 flex flex-col items-center gap-10">
              <button 
                onClick={handleSanskritiMessage}
                className={`group relative flex items-center gap-6 bg-slate-900/90 backdrop-blur-3xl border-2 transition-all p-4 md:p-6 pr-10 md:pr-14 rounded-[3.5rem] shadow-3xl ${isSpeaking ? 'border-amber-500 scale-105' : 'border-white/10 hover:border-amber-500/40'}`}
              >
                 <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all shadow-2xl ${isSpeaking ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-amber-500'}`}>
                    <i className={`fas ${isSpeaking ? 'fa-waveform-lines' : 'fa-play ml-1'} text-xl`}></i>
                 </div>
                 <div className="text-left space-y-1">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${isSpeaking ? 'text-amber-500' : 'text-slate-600'}`}>{t.launcher.sanskritiAura}</p>
                    <h4 className="text-white text-lg md:text-xl font-black italic tracking-tighter uppercase leading-none">{isSpeaking ? t.speaking : t.launcher.aiActive}</h4>
                 </div>
              </button>
           </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 pt-16">
           <button onClick={() => scrollTo(serviceRef)} className="bg-amber-500 text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl hover:bg-amber-400 transition-all flex items-center gap-4 group active:translate-y-1">
              {t.startNow}
              <i className="fas fa-arrow-down group-hover:translate-y-2 transition-transform"></i>
           </button>
           <button 
            onClick={() => onSelectApp(AppSection.JIGYASA_HUB)}
            className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl hover:bg-indigo-500 transition-all flex items-center gap-4 group"
           >
              <i className="fas fa-coins text-amber-300"></i>
              <span>Learn & Earn Points</span>
           </button>
        </div>
      </section>

      {/* Reward Economy Stats HUD */}
      <section className="animate-fadeIn">
         <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 text-3xl shadow-xl animate-bounce-slow">
                  <i className="fas fa-sack-dollar"></i>
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white italic uppercase">नागरिक <span className="text-amber-500">पावर</span> (Economy)</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">Earn Points for every history & law chapter you complete.</p>
               </div>
            </div>
            <div className="bg-slate-950 px-10 py-4 rounded-2xl border border-amber-500/20 text-center">
               <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">Your Total Power</p>
               <p className="text-3xl font-black text-white royal-serif tracking-tighter">{points.toLocaleString()} <span className="text-amber-500 text-xs">Points</span></p>
            </div>
         </div>
      </section>

      <section ref={serviceRef} className="space-y-32">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <button 
                key={i} 
                onClick={() => onSelectApp(service.id)}
                className="royal-card p-10 rounded-[3.5rem] text-left flex flex-col justify-between group h-[420px] border border-white/5 relative overflow-hidden"
              >
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-10">
                      <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-3xl shadow-slate-950 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700`}>
                        <i className={`fas ${service.icon}`}></i>
                      </div>
                      <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">+50 Points</div>
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-2xl font-black text-white uppercase italic royal-serif group-hover:text-amber-500 transition-colors leading-tight tracking-tighter">{service.name}</h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed italic line-clamp-5 group-hover:text-slate-300 transition-colors">
                        {service.desc}
                      </p>
                   </div>
                </div>
                <div className="mt-auto pt-8 flex items-center justify-between relative z-10">
                   <span className="text-[10px] font-black text-slate-700 group-hover:text-white uppercase tracking-widest transition-all">प्रवेश करें</span>
                   <i className="fas fa-arrow-right-long text-slate-700 group-hover:text-amber-500 group-hover:translate-x-3 transition-all text-xl"></i>
                </div>
              </button>
            ))}
         </div>
      </section>

      <section className="bg-slate-950 p-12 rounded-[4rem] border-2 border-dashed border-white/5 text-center opacity-60 hover:opacity-100 transition-opacity">
         <p className="text-slate-500 italic text-sm md:text-xl leading-relaxed max-w-4xl mx-auto font-medium">
           "इतिहास हमें बताता है कि हम कहाँ थे, और संविधान हमें बताता है कि हम कहाँ जा सकते हैं। नागरिक सेतु इसी 'पहले vs आज' की यात्रा का साथी है।"
         </p>
      </section>
    </div>
  );
};

export default Launcher;
