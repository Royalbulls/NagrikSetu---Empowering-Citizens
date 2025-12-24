
import React, { useEffect, useState } from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
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

  // Check if we have a real ID or just the placeholder
  const hasRealId = slotId && slotId !== "YOUR_SLOT_ID";

  useEffect(() => {
    if (hasRealId) {
      try {
        // @ts-ignore
        const ads = (window.adsbygoogle = window.adsbygoogle || []);
        ads.push({});
        setIsAdActive(true);
      } catch (e) {
        console.error("AdSense load error", e);
      }
    }
  }, [hasRealId]);

  return (
    <div className={`relative min-h-[140px] w-full rounded-[2rem] overflow-hidden bg-slate-900/60 border border-white/5 group transition-all duration-500 ${className}`}>
      {/* Header Label */}
      <div className="absolute top-0 left-6 px-4 py-1 bg-amber-500/10 border-x border-b border-amber-500/20 rounded-b-xl z-20">
         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500/60 italic">नागरिक संदेश • Nagrik Message</span>
      </div>
      
      {/* Beautiful Fallback Content - No more white box */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-md">
         <i className="fas fa-quote-left text-amber-500/10 text-5xl mb-4 group-hover:scale-110 transition-transform duration-700"></i>
         <p className="text-slate-300 text-lg font-medium italic leading-relaxed max-w-xl relative z-10">
           "{randomQuote}"
         </p>
         <div className="mt-4 flex items-center space-x-2">
            <span className="h-[1px] w-8 bg-amber-500/20"></span>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Team NagrikSetu</span>
            <span className="h-[1px] w-8 bg-amber-500/20"></span>
         </div>
      </div>

      {/* AdSense Logic - Only renders if a real ID is provided */}
      {hasRealId && (
        <ins className="adsbygoogle relative z-30 block w-full bg-transparent"
             style={{ display: 'block', minHeight: '140px' }}
             data-ad-client="ca-pub-YOUR_AD_ID" 
             data-ad-slot={slotId} 
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
      )}

      {/* Decorative background icon */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-[150px] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
         <i className="fas fa-brain"></i>
      </div>
    </div>
  );
};

export default AdSlot;
