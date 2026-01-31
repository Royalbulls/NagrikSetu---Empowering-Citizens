import React, { useState, useEffect, useRef } from 'react';
import { UserState, MiningState, Web3Wallet } from '../types';

interface CryptoMiningProps {
  user: UserState;
  onUpdateMining: (data: MiningState) => void;
  onUpdateWeb3?: (data: Web3Wallet) => void;
}

const CryptoMining: React.FC<CryptoMiningProps> = ({ user, onUpdateMining }) => {
  const [sessionBalance, setSessionBalance] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [activeNetwork, setActiveNetwork] = useState<'polygon' | 'base'>('polygon');
  const [copied, setCopied] = useState(false);
  
  const miningData = user.mining || { 
    isMining: false, 
    lastStarted: 0, 
    balance: 0, 
    hashRate: 0.1,
    referralCode: user.uid ? btoa(user.uid).substring(0, 8).toUpperCase() : "CITIZEN2025",
    referralsCount: 0
  };
  
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (miningData.isMining) {
      const now = Date.now();
      const elapsedMs = now - miningData.lastStarted;
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (elapsedMs >= twentyFourHours) {
        stopMiningAuto();
      } else {
        setTimeLeft(Math.floor((twentyFourHours - elapsedMs) / 1000));
        timerRef.current = setInterval(() => {
          setSessionBalance(prev => prev + (miningData.hashRate / 3600));
          setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [miningData.isMining]);

  const stopMiningAuto = () => {
    const finalBalance = miningData.balance + (miningData.hashRate * 24);
    onUpdateMining({ ...miningData, isMining: false, balance: finalBalance });
    clearInterval(timerRef.current);
  };

  const startMining = () => {
    // Hash rate increases based on referral count: base 0.1 + 0.05 per referral
    const newHashRate = 0.1 + (miningData.referralsCount * 0.05);
    onUpdateMining({
      ...miningData,
      isMining: true,
      lastStarted: Date.now(),
      hashRate: newHashRate
    });
  };

  const handleCopyLink = () => {
    const referralLink = `${window.location.origin}/?ref=${miningData.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      {/* 🌐 Network Header */}
      <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/5 shadow-3xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 rotate-12">
            <i className="fas fa-users-rays text-[200px] text-white"></i>
         </div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-4">
               <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-500/20">
                     <i className="fas fa-network-wired"></i>
                  </div>
                  <div>
                     <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter royal-serif">RBC <span className="text-indigo-500">Citizen</span> Network</h2>
                     <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Growth via Referral & Knowledge Sharing</p>
                  </div>
               </div>
               <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl border-l-4 border-indigo-500/30 pl-6 italic">
                  "हमारा नेटवर्क जितना बड़ा होगा, आपकी माइनिंग शक्ति उतनी ही बढ़ेगी। नागरिकों को जोड़ें और अपनी 'डिजिटल संपत्ति' (RBC) बढ़ाएं।"
               </p>
            </div>

            <div className="flex bg-slate-950 p-2 rounded-2xl border border-white/10 shrink-0 shadow-inner">
               <button onClick={() => setActiveNetwork('polygon')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeNetwork === 'polygon' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-500 hover:text-purple-400'}`}>Polygon Hub</button>
               <button onClick={() => setActiveNetwork('base')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeNetwork === 'base' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-blue-400'}`}>Base Hub</button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Referral Card */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-slate-900 p-10 md:p-14 rounded-[4rem] border-2 border-indigo-500/20 shadow-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(79,70,229,0.05),_transparent)] pointer-events-none"></div>
              
              <div className="relative z-10 space-y-12">
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Invite & <span className="text-emerald-500">Earn</span></h3>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">हर नए नागरिक पर +100 RBC और +0.05 Hash Rate वृद्धि</p>
                 </div>

                 <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 space-y-6 shadow-inner">
                    <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest text-center">आपका रेफ़रल लिंक (Personal Link)</p>
                    <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-white/5 relative overflow-hidden group/link">
                       <span className="text-white font-mono text-sm md:text-lg truncate flex-1">nagriksetu.ai/invite/{miningData.referralCode}</span>
                       <button 
                        onClick={handleCopyLink}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl'}`}
                       >
                          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-lg`}></i>
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                       <p className="text-slate-500 font-black text-[9px] uppercase tracking-widest mb-1">Invited Members</p>
                       <p className="text-4xl font-black text-white royal-serif">{miningData.referralsCount}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                       <p className="text-slate-500 font-black text-[9px] uppercase tracking-widest mb-1">Referral Reward</p>
                       <p className="text-4xl font-black text-emerald-500 royal-serif">{(miningData.referralsCount * 100).toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                       <p className="text-slate-500 font-black text-[9px] uppercase tracking-widest mb-1">Hash Boost</p>
                       <p className="text-4xl font-black text-indigo-500 royal-serif">+{(miningData.referralsCount * 0.05).toFixed(2)}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Mining Console */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900 p-10 md:p-12 rounded-[4rem] border border-emerald-500/20 shadow-3xl flex flex-col justify-between h-full relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
             
             <div className="space-y-10">
                <div className="flex items-center justify-between">
                   <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-slate-950 text-4xl shadow-3xl transition-all duration-1000 ${miningData.isMining ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                      <i className={`fas ${miningData.isMining ? 'fa-dharmachakra fa-spin' : 'fa-bolt'}`}></i>
                   </div>
                   <div className="text-right">
                      <p className="text-emerald-500 font-black uppercase text-[10px] tracking-widest">{miningData.isMining ? 'Node Active' : 'Node Idle'}</p>
                      <p className="text-slate-400 font-bold text-xs italic">Efficiency: 98%</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <p className="text-slate-500 font-black uppercase text-[12px] tracking-widest">RBC Ledger Balance</p>
                   <div className="text-7xl font-black text-white tracking-tighter royal-serif">{(miningData.balance + sessionBalance).toFixed(4)}</div>
                   <p className="text-emerald-500/60 font-bold text-[10px] uppercase">RBC • Royal Bulls Coin</p>
                </div>

                {miningData.isMining ? (
                  <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 text-center shadow-inner">
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Sync Time Remaining</p>
                     <p className="text-4xl font-black text-white font-mono tracking-widest">{formatTime(timeLeft)}</p>
                  </div>
                ) : (
                  <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/20 italic">
                     <p className="text-amber-500 text-sm leading-relaxed">"माइनिंग शुरू करने के लिए कम से कम एक नागरिक को जोड़ें या अपनी 'ज्ञान शक्ति' का उपयोग करें।"</p>
                  </div>
                )}
             </div>

             <button 
               onClick={startMining}
               disabled={miningData.isMining}
               className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm shadow-3xl transition-all h-20 mt-10 ${miningData.isMining ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5' : 'bg-emerald-600 text-white hover:bg-emerald-500 border-b-4 border-emerald-800 active:translate-y-1'}`}
             >
                {miningData.isMining ? 'ACTIVE IN NETWORK' : 'INITIALIZE NODE'}
             </button>
          </div>
        </div>
      </div>

      {/* Trust Ledger */}
      <div className="bg-slate-950 p-12 rounded-[4rem] border-2 border-white/5 text-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-50 animate-pulse"></div>
         <h4 className="text-indigo-400 font-black text-xs uppercase tracking-[0.5em] mb-6 italic">Decentralized Governance</h4>
         <p className="text-slate-300 italic text-2xl leading-relaxed max-w-4xl mx-auto relative z-10 font-medium font-serif">
           "नागरिक सेतु का विज़न समुदाय द्वारा संचालित है। आपके द्वारा जोड़ा गया हर सदस्य इस ज्ञान के सेतु को और अधिक स्थिर और विश्वसनीय बनाता है।"
         </p>
      </div>
    </div>
  );
};
export default CryptoMining;