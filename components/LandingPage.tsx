
import React from 'react';
import { AppSection } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onNavigate: (section: AppSection, tab?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate }) => {
  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden font-sans">
      {/* 🏛️ RBA Branded Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-24 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4 md:px-12">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-xl">
            <i className="fas fa-bullseye text-lg md:text-xl"></i>
          </div>
          <div>
             <span className="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-white block leading-none">RBA ADVISOR</span>
             <span className="text-[7px] md:text-[8px] font-black text-amber-500 uppercase tracking-[0.4em]">Multi-App Platform</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 md:space-x-8">
          <button 
            onClick={() => onNavigate(AppSection.ABOUT_US)} 
            className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors border-b border-white/10 pb-1"
          >
            About Us
          </button>
          <button 
            onClick={onStart}
            className="bg-amber-500 text-slate-950 px-5 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 shadow-3xl active:scale-95 transition-all"
          >
            Access Console
          </button>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="relative pt-52 pb-24 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] bg-amber-500/5 blur-[150px] rounded-full -z-10"></div>
        
        <div className="animate-stagger space-y-10 max-w-6xl">
          <div className="inline-flex items-center space-x-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-6 py-3 rounded-full">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">RBA Advisor Mission: Digital Transformation</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] italic uppercase">
            आपका <span className="text-amber-500 font-serif">डिजिटल</span><br />
            शिक्षा <span className="text-blue-500 font-serif">सेतु</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-400 font-medium leading-relaxed max-w-4xl mx-auto border-l-4 md:border-l-8 border-amber-500/20 pl-6 md:pl-10 text-left md:text-center italic">
            "इतिहास (Global History), कानून (Constitution) और वर्तमान समाचार (Aaj) - सब कुछ एक ही स्थान पर। <strong>RBA Advisor</strong> द्वारा प्रस्तुत Apps की दुनिया में आपका स्वागत है।"
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-10">
            <button 
              onClick={onStart}
              className="group bg-amber-500 text-slate-950 px-12 md:px-16 py-5 md:py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs md:text-sm hover:bg-amber-400 shadow-[0_0_60px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center space-x-6"
            >
              <span>App Store में प्रवेश करें</span>
              <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform text-xl"></i>
            </button>
            <button 
              onClick={scrollToFeatures}
              className="text-slate-500 hover:text-white font-black uppercase tracking-[0.3em] text-xs transition-colors py-6 px-10 flex items-center"
            >
              Learn & Earn Points <i className="fas fa-chevron-down ml-4 animate-bounce"></i>
            </button>
          </div>
        </div>

        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-6xl" id="features">
           {[
             { val: "GLOBAL", label: "History (Pehle)" },
             { val: "LOCAL", label: "Laws Exposed" },
             { val: "SAMVIDHAN", label: "Legal Armor (Aaj)" },
             { val: "REWARDS", label: "Learn & Earn" }
           ].map((stat, i) => (
             <div key={i} className="flex flex-col items-center group">
               <span className="text-3xl md:text-5xl font-black text-white tracking-tighter group-hover:text-amber-500 transition-colors">{stat.val}</span>
               <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">{stat.label}</span>
             </div>
           ))}
        </div>
      </section>

      {/* 🏛️ RBA Vision Footer */}
      <footer className="py-24 md:py-32 border-t border-white/5 px-6 md:px-12 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 md:gap-20">
           <div className="space-y-8 max-w-md">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950">
                  <i className="fas fa-bullseye"></i>
                </div>
                <span className="text-2xl font-black uppercase tracking-tighter italic text-white leading-none">RBA ADVISOR</span>
              </div>
              <p className="text-slate-500 text-sm font-bold leading-relaxed uppercase tracking-widest italic border-l-2 border-white/10 pl-6">
                <strong>Royal Bulls Advisory Private Limited</strong> is India's leading multi-asset advisory firm. Our App Console is our flagship CSR mission for national digital literacy.
              </p>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 hover:text-amber-500 transition-all"><i className="fab fa-linkedin-in"></i></div>
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 hover:text-amber-500 transition-all"><i className="fab fa-instagram"></i></div>
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 hover:text-amber-500 transition-all"><i className="fab fa-x-twitter"></i></div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 flex-1">
              <div className="space-y-6">
                 <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Active Apps</p>
                 <div className="flex flex-col space-y-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <button onClick={() => onNavigate(AppSection.HUB)} className="text-left hover:text-amber-500 transition-colors">NagrikSetu (Education)</button>
                    <button className="text-left opacity-30 cursor-default">Invest Pro (Coming Soon)</button>
                    <button className="text-left opacity-30 cursor-default">Advocate Connect (Soon)</button>
                 </div>
              </div>
              <div className="space-y-6">
                 <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Corporate & Legal</p>
                 <div className="flex flex-col space-y-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <button onClick={() => onNavigate(AppSection.ABOUT_US)} className="text-left hover:text-amber-500 transition-colors">About Us</button>
                    <button onClick={() => onNavigate(AppSection.CONTACT_US)} className="text-left hover:text-amber-500 transition-colors">Contact Us</button>
                    <button onClick={() => onNavigate(AppSection.PRIVACY)} className="text-left text-amber-500/80 hover:text-amber-500 transition-colors font-black underline decoration-amber-500/20 underline-offset-4">Privacy Policy</button>
                    <button onClick={() => onNavigate(AppSection.TERMS)} className="text-left hover:text-amber-500 transition-colors">Terms of Service</button>
                 </div>
              </div>
              <div className="space-y-6">
                 <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Entity ID</p>
                 <div className="p-5 bg-slate-900 rounded-[2rem] border border-white/5 space-y-3 shadow-2xl">
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest flex items-center italic"><i className="fas fa-shield-check mr-2"></i> Verified Official Node</p>
                    <p className="text-[10px] text-white font-mono truncate">rbaadvisor.com</p>
                 </div>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 md:mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-slate-700 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-center md:text-left leading-relaxed">
             © 2025 Royal Bulls Advisory Private Limited. CIN: U74999MP2020PTC052614. Sagar, MP.<br />
             RBA Advisor & NagrikSetu are registered trademarks.
           </p>
           <div className="flex space-x-8 grayscale opacity-20 hover:opacity-50 transition-opacity">
              <i className="fab fa-google text-2xl"></i>
              <i className="fas fa-fingerprint text-2xl"></i>
              <i className="fas fa-building-columns text-2xl"></i>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
