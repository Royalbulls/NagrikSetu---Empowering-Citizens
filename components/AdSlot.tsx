
import React, { useEffect, useState, memo } from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ slotId, format = 'auto', className = "" }) => {
  const [isAdActive, setIsAdActive] = useState(false);

  const inspirationalQuotes = [
    "ज्ञान ही वह शक्ति है जिससे आप दुनिया बदल सकते हैं।",
    "अपने अधिकारों को जानना ही सच्ची देशभक्ति है।",
    "इतिहास से सीखें, वर्तमान में जिएं और भविष्य को सशक्त बनाएं।",
    "एक जागरूक नागरिक एक सशक्त राष्ट्र की नींव होता है।",
    "कानून की जानकारी आपके हाथ में एक अदृश्य शस्त्र है।"
  ];

  const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  // Official Publisher ID and provided Slot ID for rbaadvisor.com
  const PUBLISHER_ID = "ca-pub-7318770713203481";
  const DEFAULT_SLOT_ID = "4074378239"; // Specific slot provided by the user

  useEffect(() => {
    try {
      // @ts-ignore
      const ads = (window.adsbygoogle = window.adsbygoogle || []);
      // We always attempt to push even for default slots
      ads.push({});
      setIsAdActive(true);
    } catch (e) {
      console.error("AdSense load error", e);
    }
  }, [slotId]);

  return (
    <div className={`relative min-h-[120px] md:min-h-[250px] w-full rounded-[2rem] overflow-hidden bg-slate-900/60 border border-white/5 group transition-all duration-500 my-8 ${className}`}>
      {/* Header Label */}
      <div className="absolute top-0 left-6 px-4 py-1 bg-amber-500/10 border-x border-b border-amber-500/20 rounded-b-xl z-20">
         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500/60 italic">नागरिक संदेश • Sponsored Public Feed</span>
      </div>
      
      {/* Fallback Educational Content for Crawler/User */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-md">
         <i className="fas fa-quote-left text-amber-500/10 text-5xl mb-4 group-hover:scale-110 transition-transform duration-700"></i>
         <p className="text-slate-300 text-lg font-medium italic leading-relaxed max-w-xl relative z-10">
           "{randomQuote}"
         </p>
         <div className="mt-4 flex items-center space-x-2">
            <span className="h-[1px] w-8 bg-amber-500/20"></span>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">RBA Digital Media Mission</span>
            <span className="h-[1px] w-8 bg-amber-500/20"></span>
         </div>
      </div>

      {/* Actual AdSense Integration */}
      <ins className="adsbygoogle relative z-30 block w-full h-full"
           style={{ display: 'block' }}
           data-ad-client={PUBLISHER_ID} 
           data-ad-slot={slotId || DEFAULT_SLOT_ID} 
           data-ad-format={format}
           data-full-width-responsive="true"></ins>

      <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-[150px] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
         <i className="fas fa-scale-balanced"></i>
      </div>
    </div>
  );
};

export default memo(AdSlot);
