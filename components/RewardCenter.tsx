
import React, { useState, useEffect } from 'react';
import AdSlot from './AdSlot';

interface RewardCenterProps {
  onEarnPoints: (amount: number) => void;
}

const RewardCenter: React.FC<RewardCenterProps> = ({ onEarnPoints }) => {
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setCompleted(true);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startMining = () => {
    setIsActive(true);
    setTimer(30); // 30 second engagement
    setCompleted(false);
  };

  const handleClaim = () => {
    setClaiming(true);
    setTimeout(() => {
      onEarnPoints(100);
      setClaiming(false);
      setCompleted(false);
      
      // Points explosion animation
      const rect = document.getElementById('claim-btn')?.getBoundingClientRect();
      for(let i=0; i<15; i++) {
        const div = document.createElement('div');
        div.className = 'point-float';
        div.innerText = '🪙';
        div.style.left = `${(rect?.left || 0) + (Math.random() * 200 - 100)}px`;
        div.style.top = `${(rect?.top || 0) + (Math.random() * 200 - 100)}px`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 1500);
      }
    }, 1000);
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      {/* 🪙 Coin Center Header */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 border border-amber-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.08] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-coins text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10 text-center md:text-left">
           <div className="space-y-6">
              <div className="flex items-center space-x-6 justify-center md:justify-start">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 rounded-[2.5rem] flex items-center justify-center text-slate-950 shadow-2xl border-4 border-white/10 animate-bounce-slow">
                   <i className="fas fa-sack-dollar text-2xl md:text-3xl"></i>
                </div>
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">सिक्का <span className="text-amber-500">केंद्र</span></h2>
                   <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Nagrik Coins • Mission Support Hub</p>
                </div>
              </div>
              <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-2xl border-l-4 border-amber-500/50 pl-8">
                "मिशन को सहारा दें और इनाम पाएं। विज्ञापनों के साथ जुड़कर आप हमारे सर्वर खर्चों में मदद करते हैं, जिसके बदले हम आपको **+100 Coins** देते हैं।"
              </p>
           </div>
           
           <div className="bg-slate-950/80 p-10 rounded-[3rem] border border-white/5 text-center min-w-[280px] shadow-3xl">
              <p className="text-slate-500 font-black uppercase text-[11px] tracking-widest mb-4">Support Reward</p>
              <div className="text-6xl font-black text-white tracking-tighter flex items-center justify-center">
                 <span className="text-amber-500 mr-2">+100</span>
                 <i className="fas fa-coins text-2xl"></i>
              </div>
              <p className="text-[9px] text-amber-500/60 font-bold uppercase mt-4">Per Engagement</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* 🕹️ Interaction Area */}
         <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/10 shadow-3xl flex flex-col items-center justify-center space-y-10 relative overflow-hidden">
            {!isActive && !completed && (
              <div className="text-center space-y-8 animate-fadeIn">
                 <div className="w-32 h-32 bg-slate-950 rounded-full flex items-center justify-center mx-auto border-2 border-white/5 shadow-inner">
                    <i className="fas fa-bolt text-amber-500 text-5xl"></i>
                 </div>
                 <h3 className="text-3xl font-black text-white uppercase italic">माइनिंग शुरू करें</h3>
                 <p className="text-slate-500 font-medium">30 सेकंड के एड-सपोर्ट सत्र के लिए तैयार हो जाइये।</p>
                 <button 
                  onClick={startMining}
                  className="bg-amber-500 text-slate-950 px-14 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-amber-400 shadow-3xl hover:scale-105 active:scale-95 transition-all"
                 >
                   START SESSION
                 </button>
              </div>
            )}

            {isActive && (
              <div className="text-center space-y-8 animate-fadeIn w-full">
                 <div className="relative w-40 h-40 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                      <circle 
                        cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="8" 
                        className="text-amber-500 transition-all duration-1000"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * (30-timer)) / 30}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-5xl font-black text-white font-mono">{timer}s</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <p className="text-amber-500 font-black uppercase tracking-widest text-xs animate-pulse">Sponsor Engagement in Progress</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase">Please stay on this screen to validate points</p>
                 </div>
                 
                 {/* 📺 The Ad Slot that appears during mining */}
                 <div className="w-full mt-10">
                    <AdSlot className="h-[250px] shadow-2xl" />
                 </div>
              </div>
            )}

            {completed && (
              <div className="text-center space-y-8 animate-slideUp">
                 <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-3xl shadow-emerald-500/20">
                    <i className="fas fa-check text-slate-950 text-5xl"></i>
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase italic">सफलता!</h3>
                    <p className="text-slate-400 font-medium">आपका नागरिक कर्तव्य पूर्ण हुआ। अपने पॉइंट्स क्लेम करें।</p>
                 </div>
                 <button 
                  id="claim-btn"
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-emerald-500 shadow-3xl transition-all"
                 >
                   {claiming ? <i className="fas fa-circle-notch fa-spin"></i> : "CLAIM +100 COINS"}
                 </button>
              </div>
            )}
         </div>

         {/* 📑 Coin Rules & Stats */}
         <div className="space-y-8">
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
               <div className="absolute -bottom-8 -right-8 opacity-5 text-9xl text-white rotate-12"><i className="fas fa-shield-halved"></i></div>
               <h4 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                  <i className="fas fa-circle-info text-amber-500"></i>
                  नियम और लाभ
               </h4>
               <ul className="space-y-6">
                  {[
                    "हर 30 सेकंड का सत्र आपको 100 पॉइंट्स दिलाता है।",
                    "पॉइंट्स का उपयोग नए फीचर्स अनलॉक करने में करें।",
                    "आपका सपोर्ट 'Aura Chamber' और 'Expert Connect' को फ्री रखने में मदद करता है।",
                    "दिन में अधिकतम 50 सत्रों की अनुमति है।"
                  ].map((rule, i) => (
                    <li key={i} className="flex items-start gap-4 group">
                       <div className="w-6 h-6 rounded-lg bg-slate-950 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-[10px] shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">{i+1}</div>
                       <p className="text-slate-400 text-sm font-bold leading-relaxed">{rule}</p>
                    </li>
                  ))}
               </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-10 rounded-[3rem] border border-white/10 shadow-3xl text-center space-y-6 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <i className="fas fa-heart text-rose-500 text-4xl animate-pulse"></i>
               <h4 className="text-xl font-black text-white italic">क्यों सपोर्ट करें?</h4>
               <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  "नागरिक सेतु" एक गैर-लाभकारी मिशन के रूप में शुरू हुआ है। विज्ञापन दिखाने से हमें सर्वर को चालू रखने और AI को बिना किसी फीस के आप तक पहुँचाने में मदद मिलती है।
               </p>
               <div className="h-px bg-white/10 w-full"></div>
               <p className="text-amber-500 font-black uppercase text-[9px] tracking-[0.3em]">आपका सहयोग ही हमारी शक्ति है</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RewardCenter;
