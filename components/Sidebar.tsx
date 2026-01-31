import React, { useMemo } from 'react';
import { AppSection } from '../types';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  language: string;
  points: number;
  unlockedFeatures: string[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isGuest: boolean;
  onLoginClick: () => void;
}

/**
 * Full Sidebar module with proper exports and logic
 */
const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  language, 
  points, 
  unlockedFeatures, 
  isOpen, 
  setIsOpen, 
  isGuest, 
  onLoginClick 
}) => {
  const isHindi = language === 'Hindi';
  
  const categories = useMemo(() => [
    {
      title: isHindi ? "नागरिक सेतु (NagrikSetu)" : "NagrikSetu Hub",
      items: [
        { id: AppSection.HUB, label: isHindi ? "मुख्य डैशबोर्ड" : "Main Hub", icon: 'fa-house-chimney' },
        { id: AppSection.HISTORY, label: isHindi ? "वैश्विक इतिहास" : "Global History", icon: 'fa-earth-asia' },
        { id: AppSection.CONSTITUTION, label: isHindi ? "संविधान एवं कानून" : "Constitution", icon: 'fa-building-columns' },
        { id: AppSection.GLOBAL_COMPARISON, label: isHindi ? "देश vs दुनिया" : "Global Audit", icon: 'fa-scale-balanced' },
        { id: AppSection.EPAPER, label: isHindi ? "आज क्या चल रहा है?" : "Daily ePaper", icon: 'fa-newspaper' },
        { id: AppSection.NEWS_FEED, label: isHindi ? "पब्लिक फीड" : "Public Feed", icon: 'fa-rss' },
      ]
    },
    {
      title: isHindi ? "विशेष सेवाएँ" : "Special Services",
      items: [
        { id: AppSection.SAHAYATA_KENDRA, label: isHindi ? "सहायता केंद्र" : "Help Desk", icon: 'fa-handshake-angle' },
        { id: AppSection.NYAY_DARPAN, label: isHindi ? "न्याय दर्पण" : "Nyay Darpan", icon: 'fa-scale-balanced' },
        { id: AppSection.JIGYASA_HUB, label: isHindi ? "जिज्ञासा केंद्र" : "Jigyasa Hub", icon: 'fa-lightbulb' },
      ]
    }
  ], [isHindi]);

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col p-6 overflow-y-auto no-scrollbar">
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg">
                  <i className="fas fa-bridge text-lg"></i>
               </div>
               <span className="text-xl font-black uppercase tracking-tighter text-white royal-serif">NagrikSetu</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 hover:text-white"><i className="fas fa-times"></i></button>
         </div>
         
         <div className="flex-1 space-y-10">
            {categories.map((cat, i) => (
               <div key={i} className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">{cat.title}</h4>
                  <div className="space-y-1">
                     {cat.items.map((item) => (
                        <button
                           key={item.id}
                           onClick={() => setActiveSection(item.id)}
                           className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeSection === item.id ? 'bg-amber-500 text-slate-950 shadow-xl font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white font-bold'}`}
                        >
                           <i className={`fas ${item.icon} text-lg w-6`}></i>
                           <span className="text-xs uppercase tracking-widest">{item.label}</span>
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>

         {isGuest && (
           <div className="mt-auto pt-10">
              <button onClick={onLoginClick} className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all border border-white/5 shadow-xl">
                 Unlock Elite Features
              </button>
           </div>
         )}
      </div>
    </aside>
  );
};

export default Sidebar;