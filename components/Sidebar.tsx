
import React, { useMemo, memo } from 'react';
import { AppSection } from '../types';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  language: string;
  points?: number;
  unlockedFeatures: string[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isGuest?: boolean;
  onLoginClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, language, points = 0, isOpen, setIsOpen }) => {
  const isHindi = language === 'Hindi';

  const categories = useMemo(() => [
    {
      title: isHindi ? "नागरिक सेतु (NagrikSetu)" : "NagrikSetu Hub",
      items: [
        { id: AppSection.HUB, label: isHindi ? "मुख्य डैशबोर्ड" : "Main Hub", icon: 'fa-house-chimney' },
        { id: AppSection.HISTORY, label: isHindi ? "वैश्विक इतिहास" : "Global History", icon: 'fa-earth-asia' },
        { id: AppSection.CONSTITUTION, label: isHindi ? "संविधान एवं कानून" : "Constitution", icon: 'fa-building-columns' },
        { id: AppSection.EPAPER, label: isHindi ? "आज क्या चल रहा है?" : "Daily ePaper", icon: 'fa-newspaper' },
      ]
    },
    {
      title: isHindi ? "RBA प्रीमियम सेवाएँ" : "RBA Premium Hub",
      items: [
        { id: AppSection.FINANCE, label: isHindi ? "RBA मल्टी-सर्विसेज" : "RBA Services", icon: 'fa-bullseye' },
        { id: AppSection.SAHAYATA_KENDRA, label: isHindi ? "सहायता केंद्र" : "Help Desk", icon: 'fa-handshake-angle' },
        { id: AppSection.NYAY_DARPAN, label: isHindi ? "न्याय दर्पण" : "Justice Mirror", icon: 'fa-balance-scale' },
        { id: AppSection.JIGYASA_HUB, label: isHindi ? "जिज्ञासा केंद्र" : "Jigyasa Hub", icon: 'fa-brain' },
        { id: AppSection.APPLICATION_WRITER, label: isHindi ? "आवेदन लेखक" : "App Writer", icon: 'fa-pen-nib' },
      ]
    }
  ], [isHindi]);

  const handleNav = (id: AppSection) => {
    setActiveSection(id);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-amber-500 text-slate-950 rounded-full z-[100] md:hidden shadow-3xl border-4 border-slate-950 hover:scale-110 active:scale-95 transition-all"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars-staggered'}`}></i>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[60] md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`fixed md:sticky top-0 left-0 h-screen w-80 bg-[#020617] border-r border-white/5 z-[70] transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 flex flex-col h-full">
          
          <div className="flex items-center space-x-4 mb-12 shrink-0">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-2xl shadow-xl shadow-amber-500/20">
              <i className="fas fa-bullseye text-slate-950 text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none royal-serif">NAGRIK<span className="text-amber-500">SETU</span></h1>
              <p className="text-[7px] text-slate-500 font-black uppercase tracking-[0.5em] mt-1.5 leading-none">by Royal Bulls</p>
            </div>
          </div>

          <button 
            onClick={() => handleNav(AppSection.LAUNCHER)}
            className="flex items-center space-x-3 bg-white/5 hover:bg-amber-500/10 px-6 py-4 rounded-2xl mb-8 transition-all group border border-white/5"
          >
             <i className="fas fa-grid-2 text-amber-500 text-xs group-hover:scale-110 transition-transform"></i>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-500 transition-colors">Digital Setu Store</span>
          </button>

          <nav className="flex-1 overflow-y-auto pr-2 -mr-4 dark-scroll pb-10 space-y-12">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em] mb-4 ml-4">{cat.title}</p>
                {cat.items.map((item) => {
                  const active = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all group relative ${
                        active 
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-2xl shadow-amber-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-slate-950/10' : 'bg-slate-900 group-hover:bg-amber-500/10'}`}>
                          <i className={`fas ${item.icon} text-sm`}></i>
                        </div>
                        <span className="text-[11px] font-black tracking-wide uppercase">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 shrink-0">
             <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 text-center relative overflow-hidden group">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest relative z-10">Citizen Power</span>
                <p className="text-3xl font-black text-white tracking-tighter mt-1 relative z-10 royal-serif">{points.toLocaleString()}</p>
                <div className="mt-3 h-1 bg-slate-950 rounded-full overflow-hidden relative z-10">
                   <div className="h-full bg-amber-500 w-2/3 shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
                </div>
             </div>
             <p className="mt-6 text-[7px] text-slate-700 font-bold uppercase tracking-widest text-center">© 2025 Royal Bulls Advisory</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default memo(Sidebar);
