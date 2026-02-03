
import React, { useState, useEffect, memo, useRef } from 'react';
import { UserState, AppSection } from '../types';
import { translations } from '../utils/translations';

const LiveClock = memo(({ language }: { language: string }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const formatDateTime = () => {
    return time.toLocaleString(language === 'Hindi' ? 'hi-IN' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };
  return (
    <p className="text-slate-500 font-mono text-[9px] mt-1.5 flex items-center opacity-80">
      <i className="fas fa-clock mr-2 text-amber-500/40"></i>{formatDateTime()}
    </p>
  );
});

interface HeaderProps {
  user: UserState;
  onOpenDashboard: () => void;
  language: string;
  onUpdateLanguage: (lang: string) => void;
  onLoginClick?: () => void;
  onBackToLauncher: () => void;
  activeSection: AppSection;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onOpenDashboard, 
  language, 
  onUpdateLanguage,
  onLoginClick, 
  onBackToLauncher, 
  activeSection,
  onToggleSidebar 
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const showBackButton = activeSection !== AppSection.LAUNCHER;
  const t = translations[language] || translations['English'];
  
  const languages = [
    { code: 'Hindi', label: 'हिन्दी', icon: '🇮🇳' },
    { code: 'English', label: 'English', icon: '🌐' },
    { code: 'Bengali', label: 'বাংলা', icon: '🇮🇳' },
    { code: 'Tamil', label: 'தமிழ்', icon: '🇮🇳' },
    { code: 'Telugu', label: 'తెలుగు', icon: '🇮🇳' },
    { code: 'Marathi', label: 'मराठी', icon: '🇮🇳' },
    { code: 'Gujarati', label: 'ગુજરાતી', icon: '🇮🇳' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangLabel = languages.find(l => l.code === language)?.label || 'Hindi';

  return (
    <header className="h-20 md:h-24 glass-panel sticky top-0 z-[60] flex items-center justify-between px-4 md:px-12 border-b border-white/5">
      <div className="flex items-center space-x-3 md:space-x-8">
        <button 
          onClick={onToggleSidebar}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-900/80 text-amber-500 rounded-xl border border-amber-500/10 hover:bg-amber-500 hover:text-slate-950 transition-all active:scale-95 shadow-lg group"
        >
          <i className="fas fa-bars-staggered text-base md:text-lg"></i>
        </button>

        {showBackButton && (
          <button 
            onClick={onBackToLauncher}
            className="flex items-center space-x-2 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-amber-500 px-3 md:px-5 py-2 md:py-2.5 rounded-xl transition-all shadow-lg group border border-amber-500/10 active:scale-95"
          >
            <i className="fas fa-grid-2 text-[10px]"></i>
            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">{t.store}</span>
          </button>
        )}

        {/* 🌐 Compact Language Switcher */}
        <div className="relative" ref={langRef}>
           <button 
             onClick={() => setIsLangOpen(!isLangOpen)}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${isLangOpen ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950/50 border-white/5 text-slate-400 hover:text-white'}`}
           >
              <i className="fas fa-language text-sm"></i>
              <span className="text-[10px] font-black uppercase tracking-tighter hidden xs:inline">{currentLangLabel}</span>
              <i className={`fas fa-chevron-down text-[8px] transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}></i>
           </button>

           {isLangOpen && (
             <div className="absolute top-full left-0 mt-3 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-3xl p-2 animate-fadeIn overflow-hidden">
                <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest px-3 py-2 mb-1 border-b border-white/5">Select Language</div>
                <div className="grid grid-cols-1 gap-1">
                   {languages.map((l) => (
                     <button
                       key={l.code}
                       onClick={() => { onUpdateLanguage(l.code); setIsLangOpen(false); }}
                       className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all ${language === l.code ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                     >
                       <span className="flex items-center gap-3">
                          <span className="opacity-50">{l.icon}</span>
                          {l.label}
                       </span>
                       {language === l.code && <i className="fas fa-check-circle text-[8px]"></i>}
                     </button>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-10">
        <div className="flex items-center space-x-3 md:space-x-4 bg-slate-950/50 px-3 md:px-5 py-2 md:py-2.5 rounded-2xl border border-white/5 shadow-inner relative group cursor-pointer" onClick={onOpenDashboard}>
          <div className="flex flex-col items-end">
            <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{t.pointsLabel}</span>
            <span className="font-black text-white tracking-tighter text-sm md:text-lg leading-none royal-serif">{user.points.toLocaleString()}</span>
          </div>
          <i className="fas fa-coins text-amber-500 text-sm md:text-base animate-pulse"></i>
        </div>
        
        {user.uid === 'guest' ? (
          <button onClick={onLoginClick} className="button-premium px-4 md:px-8 py-2 md:py-3 rounded-xl text-[9px] md:text-[10px] uppercase shadow-2xl active:scale-95">{t.login}</button>
        ) : (
          <button onClick={onOpenDashboard} className="group relative">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-2xl ring-4 ring-slate-950 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[0.9rem] flex items-center justify-center">
                {user.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : <span className="text-amber-500 font-black text-lg md:text-xl italic">{user.name?.[0]?.toUpperCase()}</span>}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 md:border-4 border-slate-950"></div>
          </button>
        )}
      </div>
    </header>
  );
};

export default memo(Header);
