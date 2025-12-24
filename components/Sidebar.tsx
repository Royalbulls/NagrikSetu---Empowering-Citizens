
import React, { useState } from 'react';
import { AppSection } from '../types';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  language: string;
  points?: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isGuest?: boolean;
  onLoginClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, language, points = 0, isOpen, setIsOpen, isGuest, onLoginClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isHindi = language === 'Hindi';

  const categories = [
    {
      title: isHindi ? "शिक्षा और खोज" : "Education & Discovery",
      items: [
        { id: AppSection.HUB, label: isHindi ? "मेन हब" : "Main Hub", icon: 'fa-grip-vertical' },
        { id: AppSection.HISTORY, label: isHindi ? "इतिहास (पहिले/आज)" : "History (Then/Now)", icon: 'fa-monument' },
        { id: AppSection.CONSTITUTION, label: isHindi ? "संविधान (Samvidhan)" : "Constitution", icon: 'fa-book-open' },
        { id: AppSection.EXPLORER, label: isHindi ? "ग्लोबल मैप" : "Global Explorer", icon: 'fa-earth-asia' },
        { id: AppSection.WEEKLY_TIMELINE, label: isHindi ? "आज का इतिहास" : "Today in History", icon: 'fa-timeline' },
        { id: AppSection.CURRENT_AFFAIRS, label: isHindi ? "दुनिया की खबरें" : "Global News", icon: 'fa-newspaper' },
      ]
    },
    {
      title: isHindi ? "अधिकार और कानून" : "Rights & Laws",
      items: [
        { id: AppSection.CITIZEN_RIGHTS, label: isHindi ? "अधिकारों का कवच" : "Rights Hub", icon: 'fa-landmark-dome' },
        { id: AppSection.LAW, label: isHindi ? "भाषा और कानून" : "Language Law", icon: 'fa-scale-balanced' },
        { id: AppSection.FINANCE, label: isHindi ? "वित्तीय कवच" : "Financial Shield", icon: 'fa-vault' },
        { id: AppSection.GLOBAL_SCHEMERS, label: isHindi ? "जागरूक नागरिक" : "Global Schemers", icon: 'fa-user-ninja' },
      ]
    },
    {
      title: isHindi ? "आध्यात्मिक और ऊर्जा" : "Spiritual & Aura",
      items: [
        { id: AppSection.AURA_CHAMBER, label: isHindi ? "Aura कक्ष" : "Aura Chamber", icon: 'fa-wand-magic-sparkles', badge: points >= 1000 ? 'ACTIVE' : 'LOCKED' },
      ]
    },
    {
      title: isHindi ? "प्रीमियम सेवा (RBA)" : "Premium Services",
      items: [
        { id: AppSection.APPLICATION_WRITER, label: isHindi ? "आवेदन सहायक" : "Aavedan Writer", icon: 'fa-file-pen' },
        { id: AppSection.RBA_SERVICES, label: isHindi ? "RBA समाधान" : "RBA Solutions", icon: 'fa-bullseye', badge: 'PRO' },
        { id: AppSection.LIVE_TUTOR, label: isHindi ? "लाइव वॉयस एआई" : "Live Tutor", icon: 'fa-microphone-lines' },
      ]
    },
    {
      title: isHindi ? "मेरा सफर" : "My Journey",
      items: [
        { id: AppSection.DASHBOARD, label: isHindi ? "मेरा डैशबोर्ड" : "Dashboard", icon: 'fa-chart-pie' },
        { id: AppSection.DAILY_PRACTICE, label: isHindi ? "दैनिक साधना" : "Daily Practice", icon: 'fa-crown' },
        { id: AppSection.SAVED_SESSIONS, label: isHindi ? "ज्ञान संग्रह" : "Saved Archives", icon: 'fa-box-archive' },
        { id: AppSection.COMPETITION, label: isHindi ? "प्रतियोगिता" : "Competition", icon: 'fa-trophy' },
      ]
    }
  ];

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const handleNav = (id: AppSection) => {
    setActiveSection(id);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`fixed md:sticky top-0 left-0 h-screen w-80 bg-slate-900 border-r border-amber-900/20 shadow-2xl z-[70] transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex flex-col h-full overflow-hidden">
          
          <button onClick={() => handleNav(AppSection.HUB)} className="flex items-center space-x-4 mb-8 shrink-0 group">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-[1.25rem] shadow-2xl border-2 border-slate-900 group-hover:scale-110 transition-transform">
              <i className="fas fa-bridge text-slate-950 text-xl"></i>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">नागरिक सेतु</h1>
              <p className="text-[8px] text-amber-500/60 font-black uppercase tracking-[0.4em] mt-1">Sashakt Bharat Mission</p>
            </div>
          </button>

          {isGuest && (
            <div className="mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl animate-pulse">
               <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2 text-center">प्रगति स्थायी रूप से सेव करें</p>
               <button onClick={onLoginClick} className="w-full bg-amber-500 text-slate-950 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all">Sign In / Join</button>
            </div>
          )}

          <div className="relative mb-6 px-1 shrink-0">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isHindi ? "टूल खोजें..." : "Search tools..."}
              className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-amber-500/50 outline-none transition-all"
            />
          </div>

          <nav className="flex-1 overflow-y-auto pr-2 -mr-4 dark-scroll pb-10 space-y-8">
            {filteredCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mb-3 ml-4 flex items-center">
                  <span className="w-1.5 h-1.5 bg-slate-800 rounded-full mr-3"></span>
                  {cat.title}
                </p>
                {cat.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                      activeSection === item.id 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xl scale-[1.02]' 
                      : 'text-slate-400 hover:text-amber-400 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeSection === item.id ? 'bg-slate-950/10' : 'bg-slate-800 group-hover:bg-amber-500/10'}`}>
                        <i className={`fas ${item.icon} text-sm`}></i>
                      </div>
                      <span className="text-[11px] font-black tracking-wide uppercase">{item.label}</span>
                    </div>
                    {item.badge && <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase ${item.badge === 'LOCKED' ? 'bg-slate-800 text-slate-500' : 'bg-amber-500 text-slate-950'}`}>{item.badge}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-white/5 shrink-0">
            <div className="bg-slate-950/80 rounded-2xl p-5 border border-amber-500/10">
               <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">My Power Points</span>
                  <div className="flex items-center space-x-1">
                     <i className="fas fa-coins text-amber-500 text-[10px]"></i>
                     <span className="text-sm font-black text-white tracking-tighter">{points.toLocaleString()}</span>
                  </div>
               </div>
               <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${Math.min((points/1000)*100, 100)}%` }}></div>
               </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;