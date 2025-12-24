
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg">
            <i className="fas fa-bridge text-lg"></i>
          </div>
          <span className="text-xl font-black uppercase tracking-tighter italic text-white">नागरिक सेतु</span>
        </div>
        <button 
          onClick={onStart}
          className="bg-amber-500 text-slate-950 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl active:scale-95"
        >
          Portal Access
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-amber-500/5 blur-[120px] rounded-full -z-10"></div>
        
        <div className="animate-stagger space-y-8 max-w-5xl">
          <div className="inline-flex items-center space-x-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-5 py-2.5 rounded-full">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">सार्वजनिक सशक्तिकरण मिशन : LIVE</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
            अधिकारों का <span className="text-amber-500">कवच</span>,<br />
            ज्ञान का <span className="text-blue-500">प्रकाश</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto border-l-4 border-amber-500/20 pl-8 text-left md:text-center">
            "हर इंसान का फ़र्ज़ है अपने अधिकारों को जानना। हमने बनाया है एक ऐसा सेतु जो कानून, इतिहास और नागरिक कर्तव्यों को आपकी भाषा में आप तक पहुँचाता है।"
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <button 
              onClick={onStart}
              className="group bg-amber-500 text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center space-x-4"
            >
              <span>प्रवेश करें (Start Now)</span>
              <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </button>
            <button 
              onClick={scrollToFeatures}
              className="text-slate-500 hover:text-white font-black uppercase tracking-widest text-xs transition-colors py-5 px-8 flex items-center"
            >
              मिशन को जानें <i className="fas fa-chevron-down ml-3 animate-bounce"></i>
            </button>
          </div>
        </div>

        {/* Public Impact Stats Counter */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl">
           {[
             { val: "140Cr+", label: "Target Citizens" },
             { val: "400+", label: "Legal Articles" },
             { val: "24/7", label: "AI Assistance" },
             { val: "FREE", label: "Education Access" }
           ].map((stat, i) => (
             <div key={i} className="text-center space-y-2">
                <p className="text-3xl md:text-5xl font-black text-white tracking-tighter">{stat.val}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Detailed How It Works Section */}
      <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
           <div className="space-y-4 max-w-2xl">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">यह कैसे <span className="text-amber-500">काम</span> करता है?</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em]">Step-by-Step Empowerment Portal</p>
           </div>
           <p className="text-slate-400 max-w-sm italic text-right border-r-4 border-blue-500/20 pr-6">"जटिल कानूनों को आसान कहानियों में बदलकर हमने इसे हर नागरिक के लिए सुलभ बनाया है।"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Manually defining cards to avoid dynamic Tailwind class generation issues */}
          <div className="relative group bg-slate-900/40 p-12 rounded-[3.5rem] border border-white/5 hover:border-white/10 transition-all">
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-slate-950 rounded-full border border-white/10 flex items-center justify-center font-black text-amber-500 text-xl shadow-2xl">01</div>
            <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
              <i className="fas fa-monument text-2xl"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-4 italic uppercase">इतिहास की समझ</h3>
            <p className="text-slate-400 font-medium leading-relaxed">विश्व इतिहास और कालक्रम को समझें। जानें कि पुराने समय में समाज कैसे चलता था और आज क्या बदलाव आए हैं।</p>
          </div>

          <div className="relative group bg-slate-900/40 p-12 rounded-[3.5rem] border border-white/5 hover:border-white/10 transition-all">
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-slate-950 rounded-full border border-white/10 flex items-center justify-center font-black text-blue-500 text-xl shadow-2xl">02</div>
            <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
              <i className="fas fa-scale-balanced text-2xl"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-4 italic uppercase">कानूनी सुरक्षा</h3>
            <p className="text-slate-400 font-medium leading-relaxed">पुलिस, अस्पताल, प्रॉपर्टी या खरीदारी—किसी भी समस्या में अपने संवैधानिक अधिकारों और कर्तव्यों का विश्लेषण तुरंत प्राप्त करें।</p>
          </div>

          <div className="relative group bg-slate-900/40 p-12 rounded-[3.5rem] border border-white/5 hover:border-white/10 transition-all">
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-slate-950 rounded-full border border-white/10 flex items-center justify-center font-black text-emerald-500 text-xl shadow-2xl">03</div>
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
              <i className="fas fa-crown text-2xl"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-4 italic uppercase">सशक्त नागरिक</h3>
            <p className="text-slate-400 font-medium leading-relaxed">ज्ञान प्राप्त करें, पॉइंट्स कमाएं और एक जागरूक नागरिक बनें। आवेदन पत्र लिखें और अपनी आवाज़ बुलंद करें।</p>
          </div>
        </div>
      </section>

      {/* Global Mission Wall */}
      <section className="bg-slate-900 py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-[0.02] pointer-events-none scale-150">
           <i className="fas fa-hand-holding-heart text-[500px] text-white"></i>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10 animate-slideUp">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">हमारा <span className="text-amber-500">सार्वजनिक</span> संकल्प</h2>
              <div className="space-y-6">
                 <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0 mt-1 border border-amber-500/20"><i className="fas fa-user-graduate"></i></div>
                    <div>
                       <h4 className="text-xl font-black text-white mb-2">सबके लिए शिक्षा (Education for All)</h4>
                       <p className="text-slate-400 font-medium">इतिहास और कानून किसी एक के लिए नहीं, हर नागरिक के लिए हैं।</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0 mt-1 border border-blue-500/20"><i className="fas fa-fingerprint"></i></div>
                    <div>
                       <h4 className="text-xl font-black text-white mb-2">अपनी पहचान पहचानें (Identity Power)</h4>
                       <p className="text-slate-400 font-medium">जन्म से मृत्यु तक, दस्तावेज़ों और अधिकारों के जाल को सरल बनाना ही हमारा लक्ष्य है।</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0 mt-1 border border-emerald-500/20"><i className="fas fa-shield-halved"></i></div>
                    <div>
                       <h4 className="text-xl font-black text-white mb-2">बिना डरे न्याय (Justice without Fear)</h4>
                       <p className="text-slate-400 font-medium">जब ज्ञान होगा, तभी निडरता आएगी। हम नागरिकों को जागरूक बनाकर उन्हें निडर बनाते हैं।</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-amber-500 to-blue-600 rounded-[4rem] p-1 shadow-3xl rotate-3">
                 <div className="w-full h-full bg-slate-950 rounded-[3.8rem] flex flex-col items-center justify-center text-center p-12 space-y-6">
                    <i className="fas fa-earth-asia text-[120px] text-amber-500/20 absolute opacity-30"></i>
                    <h3 className="text-4xl font-black text-white uppercase italic leading-tight">क्या आप तैयार हैं?</h3>
                    <p className="text-slate-400 text-lg">आज ही इस सार्वजनिक मिशन का हिस्सा बनें।</p>
                    <button onClick={onStart} className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Join The Public Portal</button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950">
                  <i className="fas fa-bridge"></i>
                </div>
                <span className="text-xl font-black uppercase tracking-tighter italic text-white">नागरिक सेतु</span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">A Global Movement for Citizen Awareness</p>
           </div>
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
             <a href="#" className="hover:text-amber-500 transition-colors">Privacy Charter</a>
             <a href="#" className="hover:text-amber-500 transition-colors">Public Rights</a>
             <a href="#" className="hover:text-amber-500 transition-colors">Contact Mission</a>
           </div>
           <div className="text-slate-600 text-[10px] font-bold">
             © 2025 NagrikSetu. Designed for the Global Citizen.
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
