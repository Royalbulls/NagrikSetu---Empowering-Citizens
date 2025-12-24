
import React, { useState, useEffect } from 'react';
import { UserState } from '../types';
import { firebaseService } from '../services/firebaseService';

const Header: React.FC<{ user: UserState; onOpenDashboard: () => void; language: string; onLoginClick?: () => void }> = ({ user, onOpenDashboard, language, onLoginClick }) => {
  const isCloud = firebaseService.isCloudConnected() && user.uid !== 'guest';
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = () => {
    return time.toLocaleString(language === 'Hindi' ? 'hi-IN' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <header className="h-20 bg-slate-900/80 backdrop-blur-xl border-b border-amber-900/20 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center space-x-6">
        <div className="hidden md:block">
           <h2 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">
             {user.uid === 'guest' ? 'GUEST CITIZEN' : (user.name || 'Scholar')} • {user.detectedCity || 'India'}
           </h2>
           <p className="text-slate-500 font-mono text-[10px] mt-1">
             <i className="fas fa-clock mr-2 text-amber-500/50"></i>{formatDateTime()}
           </p>
        </div>
        
        <div className={`flex items-center space-x-3 px-4 py-1.5 rounded-full border transition-all duration-700 ${isCloud ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'}`}>
           <i className={`fas ${isCloud ? 'fa-cloud-check' : 'fa-shield-halved'} text-[10px]`}></i>
           <span className="text-[9px] font-black uppercase tracking-tighter">{isCloud ? 'Cloud Sync ON' : 'Local Mode'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-2xl border border-amber-500/20 shadow-inner">
          <i className="fas fa-coins text-amber-500 animate-pulse text-xs"></i>
          <span className="font-black text-amber-500 tracking-tighter text-sm">{user.points}</span>
        </div>
        
        {user.uid === 'guest' ? (
          <button 
            onClick={onLoginClick}
            className="bg-amber-500 text-slate-950 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg hidden sm:block"
          >
            Sign In
          </button>
        ) : (
          <button 
            onClick={onOpenDashboard}
            className="w-12 h-12 rounded-2xl overflow-hidden bg-amber-500 flex items-center justify-center text-slate-950 font-black border-2 border-amber-400/50 shadow-2xl hover:scale-105 transition-all"
          >
            {user.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase() || 'U'}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
