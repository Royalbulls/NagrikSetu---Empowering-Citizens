
import React from 'react';
import { UserState } from '../types';
import { firebaseService } from '../services/firebaseService';

const headerTranslations: Record<string, any> = {
  Hindi: { welcome: "स्वागत है", scholar: "विद्वान", points: "अंक", days: "दिन" },
  English: { welcome: "Welcome", scholar: "Scholar", points: "Points", days: "Days" }
};

const Header: React.FC<{ user: UserState; onOpenDashboard: () => void; language: string }> = ({ user, onOpenDashboard, language }) => {
  const t = headerTranslations[language] || headerTranslations.English;
  const isCloud = firebaseService.isCloudConnected();
  
  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-amber-900/20 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center space-x-6">
        <h2 className="text-amber-500/70 text-xs font-bold uppercase tracking-widest hidden md:block">
          {t.welcome}, {user.name || t.scholar}
        </h2>
        
        {/* Connection Status Badge */}
        <div 
          className={`flex items-center space-x-2 px-3 py-1 rounded-full border border-white/5 transition-all duration-500 ${isCloud ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-rose-500/10 text-rose-500'}`}
          title={isCloud ? 'Encrypted Cloud Sync Active' : 'Offline Mode (Local Vault)'}
        >
           <i className={`fas ${isCloud ? 'fa-cloud-check' : 'fa-database'} text-[10px] ${isCloud ? 'animate-pulse' : ''}`}></i>
           <span className="text-[8px] font-black uppercase tracking-tighter">{isCloud ? 'Live Sync' : 'Offline'}</span>
        </div>

        {user.detectedCity && (
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-slate-800 rounded-full border border-white/5 animate-fadeIn">
            <i className="fas fa-location-dot text-[10px] text-amber-500"></i>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {user.detectedCity}, {user.detectedCountry}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
          <i className="fas fa-coins text-amber-500"></i>
          <span className="font-bold text-amber-500">{user.points}</span>
        </div>
        <div className="flex items-center space-x-2 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
          <i className="fas fa-fire text-orange-500"></i>
          <span className="font-bold text-orange-400">{user.streak} {t.days}</span>
        </div>
        <button 
          onClick={onOpenDashboard}
          className="w-10 h-10 rounded-full overflow-hidden bg-amber-500 flex items-center justify-center text-slate-950 font-black border-2 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-105 transition-transform"
        >
          {user.photo ? (
            <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            user.name?.[0]?.toUpperCase() || 'U'
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
