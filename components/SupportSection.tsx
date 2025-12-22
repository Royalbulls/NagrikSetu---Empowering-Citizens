
import React from 'react';

const SupportSection: React.FC = () => {
  // Updated payment handle to cfpe.me/kvfs
  const paymentLink = "https://cfpe.me/kvfs";

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-700 to-amber-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none scale-125 rotate-12">
          <i className="fas fa-mug-hot text-[180px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6 max-w-3xl">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-tight">
            मिशन को <span className="text-amber-300">शक्ति</span> दें
          </h2>
          <p className="text-amber-100 text-xl font-medium leading-relaxed">
            "ज्ञान सेतु" का उद्देश्य हर नागरिक को शिक्षित और जागरूक बनाना है। अगर आपको हमारा यह प्रयास पसंद आया, तो आप एक कप **चाय या कॉफी** के माध्यम से हमारी टीम का उत्साह बढ़ा सकते हैं।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-10 rounded-[3rem] border border-amber-500/20 shadow-xl space-y-8">
          <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center text-amber-500 text-3xl shadow-inner border border-amber-500/20">
            <i className="fas fa-heart"></i>
          </div>
          <div className="space-y-4">
             <h3 className="text-3xl font-black text-white">आपका योगदान क्यों?</h3>
             <p className="text-slate-400 text-lg leading-relaxed">
               आपकी प्रोत्साहन राशि हमें सर्वर खर्चों, नई AI तकनीकों के जुड़ाव और इस ऐप को विज्ञापनों से मुक्त (Ad-free) रखने में मदद करती है। यह केवल एक भुगतान नहीं, बल्कि एक जागरूक समाज के निर्माण में आपका सहयोग है।
             </p>
          </div>
          
          <ul className="space-y-4 pt-4">
             {[
               "शिक्षा को हर घर तक पहुँचाना",
               "विज्ञापनों के बिना शुद्ध अनुभव",
               "निरंतर अपडेट और नए फीचर्स",
               "एक सशक्त भारत का निर्माण"
             ].map((item, idx) => (
               <li key={idx} className="flex items-center space-x-3 text-slate-300 font-bold">
                 <i className="fas fa-check-circle text-amber-500"></i>
                 <span>{item}</span>
               </li>
             ))}
          </ul>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] border border-amber-500/20 shadow-xl flex flex-col items-center justify-center text-center space-y-10 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
           
           <div className="relative z-10 space-y-4">
              <i className="fas fa-coffee text-6xl text-amber-500 mb-4 animate-bounce-slow"></i>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">प्रोत्साहन राशि</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">नीचे दिए गए बटन पर क्लिक करके आप अपनी पसंद की राशि भेज सकते हैं।</p>
           </div>

           <a 
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-amber-500 text-slate-950 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-lg hover:bg-amber-400 shadow-2xl shadow-amber-500/20 transition-all transform hover:scale-[1.03] active:scale-95 flex items-center justify-center space-x-4 relative z-10"
           >
             <i className="fas fa-paper-plane text-xl"></i>
             <span>Support Our Mission</span>
           </a>

           <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest relative z-10">
             SECURE PAYMENT VIA cfpe.me
           </p>
        </div>
      </div>

      <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 text-center">
         <p className="text-slate-500 italic text-lg">
           "सहयोग ही विकास की सबसे बड़ी सीढ़ी है। आपकी सराहना के लिए हम सदैव आभारी रहेंगे।"
         </p>
         <p className="text-amber-500 font-black uppercase tracking-widest mt-4 text-xs">— टीम ज्ञान सेतु</p>
      </div>
    </div>
  );
};

export default SupportSection;
