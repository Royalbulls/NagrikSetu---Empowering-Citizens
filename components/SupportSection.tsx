
import React from 'react';

const SupportSection: React.FC = () => {
  const paymentLink = "https://cfpe.me/rbaadvisor";

  return (
    <div className="space-y-16 animate-fadeIn pb-32 max-w-6xl mx-auto">
      {/* 🚀 Hero Section - Mission Appeal */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-700 to-amber-900 rounded-[3rem] p-12 shadow-3xl relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none scale-125 rotate-12">
          <i className="fas fa-handshake-angle text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
             <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
             <span className="text-[10px] font-black uppercase tracking-widest text-white">Sovereign Mission Support</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight italic">
            मिशन को <span className="text-amber-300">शक्ति</span> दें
          </h2>
          <p className="text-amber-100 text-xl md:text-2xl font-medium leading-relaxed italic">
            "जब आप हमें सपोर्ट करते हैं, तो आप सिर्फ एक ऐप को नहीं, बल्कि भारत के हर उस नागरिक को सपोर्ट करते हैं जो अपने अधिकारों के लिए लड़ रहा है।"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 📜 The Article: Why Support Nagrik Setu? */}
        <div className="lg:col-span-7 bg-slate-900 p-10 md:p-14 rounded-[4rem] border border-white/5 shadow-2xl space-y-10 relative overflow-hidden">
           <div className="absolute -top-10 -left-10 opacity-[0.02]"><i className="fas fa-quote-left text-[200px]"></i></div>
           
           <div className="space-y-6 relative z-10">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter border-b border-white/5 pb-6">नागरिक सेतु: आपका डिजिटल <span className="text-amber-500">अधिकार कवच</span></h3>
              <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed space-y-6 italic">
                 <p>
                    प्रिय नागरिक, <strong>नागरिक सेतु</strong> का जन्म एक विचार से हुआ था—कि कानून की किताबें सिर्फ दफ्तरों की अलमारियों तक सीमित न रहें, बल्कि हर नागरिक की जेब में हों।
                 </p>
                 <p>
                    इस प्लेटफॉर्म को फ्री और बिना किसी विज्ञापन के दबाव के चलाने के लिए भारी तकनीकी खर्च (LLM Infrastructure, AI Servers, and Data Security) की आवश्यकता होती है। आपका छोटा सा 'Appreciation' हमारे इस डिजिटल सेतु को और मजबूत बनाता है।
                 </p>
                 <p className="text-white font-bold bg-amber-500/5 p-6 rounded-2xl border-l-4 border-amber-500">
                    "आपका सहयोग हमें स्वतंत्र रखता है ताकि हम बिना किसी डर के नागरिकों को उनकी संवैधानिक शक्तियों के प्रति जागरूक कर सकें।"
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 space-y-2">
                 <i className="fas fa-microchip text-blue-500"></i>
                 <p className="text-[10px] font-black text-slate-500 uppercase">AI Infrastructure</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 space-y-2">
                 <i className="fas fa-shield-halved text-emerald-500"></i>
                 <p className="text-[10px] font-black text-slate-500 uppercase">Verified Content</p>
              </div>
           </div>
        </div>

        {/* 💳 Payment & Partner Hub */}
        <div className="lg:col-span-5 space-y-8">
           {/* Direct Support Card */}
           <div className="bg-slate-900 p-10 rounded-[3.5rem] border-2 border-amber-500/30 shadow-3xl text-center space-y-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 space-y-4">
                 <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto text-slate-950 text-3xl shadow-3xl border-4 border-slate-900 mb-4 animate-bounce-slow">
                    <i className="fas fa-coins"></i>
                 </div>
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">सहयोग राशि (Contribute)</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed px-4">
                    आपका सहयोग इस मिशन को निरंतर चलाने और सुधारने में मदद करेगा।
                 </p>
              </div>

              <a 
               href={paymentLink}
               target="_blank"
               rel="noopener noreferrer"
               className="w-full bg-amber-500 text-slate-950 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-lg hover:bg-amber-400 shadow-3xl shadow-amber-500/20 transition-all transform hover:scale-[1.03] active:scale-95 flex items-center justify-center space-x-4 relative z-10 border-b-4 border-amber-800"
              >
                <i className="fas fa-heart text-xl"></i>
                <span>SUPPORT VIA CASHFREE</span>
              </a>

              <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest relative z-10">Secure Gateway Powered by RBA Advisory</p>
           </div>

           {/* 🤝 Partner / Volunteer Program */}
           <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-8">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <i className="fas fa-users-gear"></i>
                 </div>
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">नागरिक <span className="text-indigo-500">पार्टनर</span></h3>
              </div>
              <p className="text-slate-500 text-sm italic font-medium leading-relaxed">
                 क्या आप एक जागरूक नागरिक, वकील या एक्सपर्ट हैं? हमारे **वॉलंटियर पार्टनर प्रोग्राम** से जुड़ें और अपने क्षेत्र के लोगों की मदद करें।
              </p>
              <button 
                onClick={() => window.open('https://wa.me/917869690819?text=' + encodeURIComponent("नमस्ते RBA टीम, मैं 'नागरिक सेतु' के पार्टनर/वॉलंटियर प्रोग्राम से जुड़कर समाज की मदद करना चाहता हूँ।"), '_blank')}
                className="w-full bg-slate-800 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center space-x-3"
              >
                 <i className="fas fa-handshake"></i>
                 <span>JOIN AS VOLUNTEER</span>
              </button>
           </div>
        </div>
      </div>

      {/* 🏛️ Final Philosophy Message */}
      <div className="bg-slate-950 p-12 rounded-[4rem] border-2 border-white/5 text-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50 animate-pulse"></div>
         <p className="text-slate-500 italic text-sm md:text-xl leading-relaxed max-w-5xl mx-auto relative z-10 font-medium">
           "नागरिक सेतु केवल एक तकनीकी उपकरण नहीं है, यह हमारी सामूहिक चेतना का सेतु है। आज आपका छोटा सा सहयोग कल के एक सशक्त और भ्रष्टाचार-मुक्त भारत की नींव रखेगा।"
         </p>
         <div className="mt-8 pt-8 border-t border-white/5 flex justify-center gap-6 relative z-10 opacity-30 group-hover:opacity-100 transition-opacity">
            <i className="fas fa-scale-balanced text-2xl"></i>
            <i className="fas fa-landmark text-2xl"></i>
            <i className="fas fa-shield-halved text-2xl"></i>
         </div>
      </div>
    </div>
  );
};

export default SupportSection;
