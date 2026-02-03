
import React from 'react';
import { AppSection } from '../types';

interface FooterProps {
  onNavigate: (section: AppSection, tab?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-24 pb-12 px-6 md:px-16 mt-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 right-0 p-24 opacity-[0.02] pointer-events-none">
         <i className="fas fa-bridge text-[400px] text-white"></i>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
        
        {/* Column 1: Brand & Social */}
        <div className="space-y-8">
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-xl">
                 <i className="fas fa-bridge text-xl"></i>
              </div>
              <div>
                 <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter royal-serif">नागरिक सेतु</h2>
                 <p className="text-amber-500 font-black text-[8px] uppercase tracking-[0.4em]">Sovereign Awareness Portal</p>
              </div>
           </div>
           <p className="text-slate-500 text-sm leading-relaxed italic font-medium">
             "एक सशक्त राष्ट्र की नींव उसके जागरूक नागरिक होते हैं। हम तकनीक के माध्यम से ज्ञान का सेतु बना रहे हैं।"
           </p>
           <div className="flex gap-4">
              {[
                { icon: 'fa-whatsapp', link: 'https://wa.me/917869690819' },
                { icon: 'fa-instagram', link: '#' },
                { icon: 'fa-x-twitter', link: '#' },
                { icon: 'fa-linkedin-in', link: '#' }
              ].map((s, i) => (
                <a key={i} href={s.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:bg-amber-500 hover:text-slate-950 transition-all shadow-lg">
                   <i className={`fab ${s.icon}`}></i>
                </a>
              ))}
           </div>
        </div>

        {/* Column 2: Civic Pillars */}
        <div className="space-y-8">
           <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] border-l-4 border-amber-500 pl-4">नागरिक स्तंभ</h4>
           <nav className="flex flex-col space-y-4">
              <button onClick={() => onNavigate(AppSection.HISTORY)} className="text-left text-slate-500 hover:text-amber-500 text-[11px] font-black uppercase tracking-widest transition-colors">इतिहास एवं विरासत</button>
              <button onClick={() => onNavigate(AppSection.CONSTITUTION)} className="text-left text-slate-500 hover:text-amber-500 text-[11px] font-black uppercase tracking-widest transition-colors">संवैधानिक अधिकार</button>
              <button onClick={() => onNavigate(AppSection.LOCAL_LAWS_EXPOSED)} className="text-left text-slate-500 hover:text-amber-500 text-[11px] font-black uppercase tracking-widest transition-colors">प्रशासनिक जागरूकता</button>
              <button onClick={() => onNavigate(AppSection.SAHAYATA_KENDRA)} className="text-left text-slate-500 hover:text-amber-500 text-[11px] font-black uppercase tracking-widest transition-colors">सहायता केंद्र</button>
              <button onClick={() => onNavigate(AppSection.EPAPER)} className="text-left text-slate-500 hover:text-amber-500 text-[11px] font-black uppercase tracking-widest transition-colors">डिजिटल अखबार</button>
           </nav>
        </div>

        {/* Column 3: Professional & Tech */}
        <div className="space-y-8">
           <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] border-l-4 border-blue-500 pl-4">RBA & Technology</h4>
           <nav className="flex flex-col space-y-4">
              <button onClick={() => onNavigate(AppSection.FINANCE)} className="text-left text-slate-500 hover:text-blue-500 text-[11px] font-black uppercase tracking-widest transition-colors">RBA प्रीमियम सेवाएं</button>
              <button onClick={() => onNavigate(AppSection.OMI_INTEGRATION)} className="text-left text-slate-500 hover:text-emerald-500 text-[11px] font-black uppercase tracking-widest transition-colors">Omi वियरेबल लिंक</button>
              <button onClick={() => onNavigate(AppSection.APPLICATION_WRITER)} className="text-left text-slate-500 hover:text-blue-500 text-[11px] font-black uppercase tracking-widest transition-colors">दस्तावेज जनरेटर</button>
              <button onClick={() => onNavigate(AppSection.EXPERT_CONNECT)} className="text-left text-slate-500 hover:text-blue-500 text-[11px] font-black uppercase tracking-widest transition-colors">विशेषज्ञ संपर्क</button>
              <button onClick={() => onNavigate(AppSection.TREND_SCANNER)} className="text-left text-slate-500 hover:text-blue-500 text-[11px] font-black uppercase tracking-widest transition-colors">राष्ट्रीय ट्रेंड्स</button>
           </nav>
        </div>

        {/* Column 4: Corporate & Legal */}
        <div className="space-y-8">
           <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] border-l-4 border-rose-500 pl-4">Company & Legal</h4>
           <nav className="flex flex-col space-y-4">
              <button onClick={() => onNavigate(AppSection.GOVT_PITCH)} className="text-left text-amber-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors"><i className="fas fa-landmark mr-2"></i>सरकार हेतु प्रस्ताव</button>
              <button onClick={() => onNavigate(AppSection.DOCS)} className="text-left text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors">प्लेटफॉर्म गाइड</button>
              <button onClick={() => onNavigate(AppSection.POLICIES, 'privacy')} className="text-left text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors">Privacy Policy</button>
              <button onClick={() => onNavigate(AppSection.POLICIES, 'terms')} className="text-left text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors">Terms of Service</button>
              <button onClick={() => onNavigate(AppSection.CONTACT_US)} className="text-left text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors">संपर्क</button>
           </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
         <div className="text-center md:text-left space-y-2">
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em]">© 2025 Royal Bulls Advisory Private Limited</p>
            <p className="text-slate-700 text-[8px] font-bold uppercase tracking-widest italic">Authorized Sovereign Node: rbaadvisor.com</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="bg-slate-900 border border-white/5 px-6 py-2 rounded-xl">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Server Status: </span>
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Online & Protective</span>
            </div>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
