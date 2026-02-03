
import React, { useState, useEffect, memo } from 'react';
import { UserState, AppSection } from '../types';

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
  const showBackButton = activeSection !== AppSection.LAUNCHER;
  
  const languages = [
    { code: 'Hindi', label: 'हिन्दी', icon: '🇮🇳' },
    { code: 'English', label: 'English', icon: '🌐' },
    { code: 'Bengali', label: 'বাংলা', icon: '🇮🇳' },
    { code: 'Tamil', label: 'தமிழ்', icon: '🇮🇳' },
    { code: 'Telugu', label: 'తెలుగు', icon: '🇮🇳' },
    { code: 'Marathi', label: 'मराठी', icon: '🇮🇳' },
    { code: 'Gujarati', label: 'ગુજરાતી', icon: '🇮🇳' },
  ];

  return (
    <header className="h-20 md:h-24 glass-panel sticky top-0 z-[60] flex items-center justify-between px-6 md:px-12 border-b border-white/5">
      <div className="flex items-center space-x-4 md:space-x-8">
        <button 
          onClick={onToggleSidebar}
          className="w-12 h-12 flex items-center justify-center bg-slate-900/80 text-amber-500 rounded-xl border border-amber-500/10 hover:bg-amber-500 hover:text-slate-950 transition-all active:scale-95 shadow-lg group"
        >
          <i className="fas fa-bars-staggered text-lg"></i>
        </button>

        {showBackButton && (
          <button 
            onClick={onBackToLauncher}
            className="flex items-center space-x-3 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-amber-500 px-5 py-2.5 rounded-xl transition-all shadow-lg group border border-amber-500/10 active:scale-95"
          >
            <i className="fas fa-grid-2 text-xs"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline">Store</span>
          </button>
        )}

        {/* 🌐 Global Language Switcher */}
        <div className="hidden md:flex items-center bg-slate-950/50 p-1 rounded-2xl border border-white/5 shadow-inner">
           <div className="flex px-3 border-r border-white/10 mr-1">
              <i className="fas fa-language text-amber-500/40 text-sm"></i>
           </div>
           {languages.map((l) => (
             <button
               key={l.code}
               onClick={() => onUpdateLanguage(l.code)}
               className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all duration-300 ${language === l.code ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
             >
               {l.label}
             </button>
           ))}
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-10">
        <div className="flex items-center space-x-4 bg-slate-950/50 px-5 py-2.5 rounded-2xl border border-white/5 shadow-inner relative group cursor-pointer" onClick={onOpenDashboard}>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Nagrik Power</span>
            <span className="font-black text-white tracking-tighter text-lg leading-none royal-serif">{user.points.toLocaleString()}</span>
          </div>
          <i className="fas fa-coins text-amber-500 text-base animate-pulse"></i>
        </div>
        
        {user.uid === 'guest' ? (
          <button onClick={onLoginClick} className="button-premium px-8 py-3 rounded-xl text-[10px] uppercase shadow-2xl active:scale-95">Elite Login</button>
        ) : (
          <button onClick={onOpenDashboard} className="group relative">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-2xl ring-4 ring-slate-950 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[0.9rem] flex items-center justify-center">
                {user.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : <span className="text-amber-500 font-black text-xl italic">{user.name?.[0]?.toUpperCase()}</span>}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-950"></div>
          </button>
        )}
      </div>
    </header>
  );
};

export default memo(Header);
