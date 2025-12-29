
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
    <p className="text-slate-600 font-mono text-[10px] mt-1 italic">
      <i className="fas fa-clock mr-2 text-amber-500/40"></i>{formatDateTime()}
    </p>
  );
});

interface HeaderProps {
  user: UserState;
  onOpenDashboard: () => void;
  language: string;
  onLoginClick?: () => void;
  onBackToLauncher: () => void;
  activeSection: AppSection;
}

const Header: React.FC<HeaderProps> = ({ user, onOpenDashboard, language, onLoginClick, onBackToLauncher, activeSection }) => {
  const showBackButton = activeSection !== AppSection.LAUNCHER;
  
  return (
    <header className="h-24 bg-[#020617]/90 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
      <div className="flex items-center space-x-4 md:space-x-8">
        {showBackButton && (
          <button 
            onClick={onBackToLauncher}
            className="flex items-center space-x-3 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-500 px-6 py-3 rounded-2xl transition-all shadow-xl group border border-amber-500/10"
          >
            <i className="fas fa-grid-2 text-xs group-hover:scale-110 transition-transform"></i>
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Store Hub</span>
          </button>
        )}

        <div className="hidden md:block">
           <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_#fbbf24]"></span>
              <h2 className="text-white text-[11px] font-black uppercase tracking-[0.4em] royal-serif">
                {user.uid === 'guest' ? 'GUEST CITIZEN' : (user.name || 'Scholar')} • {user.detectedCity || 'India'}
              </h2>
           </div>
           <LiveClock language={language} />
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-8">
        <div className="flex items-center space-x-3 bg-slate-900 px-6 py-3 rounded-2xl border border-amber-500/20 shadow-2xl relative group overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <i className="fas fa-coins text-amber-500 animate-bounce text-sm relative z-10"></i>
          <span className="font-black text-white tracking-tighter text-base relative z-10 royal-serif">{user.points.toLocaleString()}</span>
        </div>
        
        {user.uid === 'guest' ? (
          <button 
            onClick={onLoginClick}
            className="bg-amber-500 text-slate-950 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20 active:scale-95 border-b-4 border-amber-700"
          >
            Elite Login
          </button>
        ) : (
          <button 
            onClick={onOpenDashboard}
            className="w-14 h-14 rounded-[1.2rem] overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black border-4 border-slate-950 shadow-2xl hover:scale-105 transition-all hover:rotate-3"
          >
            {user.photo ? <img src={user.photo} className="w-full h-full object-cover" alt="User" /> : user.name?.[0]?.toUpperCase() || 'U'}
          </button>
        )}
      </div>
    </header>
  );
};

export default memo(Header);
