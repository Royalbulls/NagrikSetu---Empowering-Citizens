
import React, { memo } from 'react';
import { AppSection } from '../types';

interface LegalFooterProps {
  onNavigate: (section: AppSection, tab?: string) => void;
}

const LegalFooter: React.FC<LegalFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 py-10 border-t border-white/5 px-6 bg-slate-950/50 backdrop-blur-sm relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 shadow-lg">
            <i className="fas fa-bridge text-sm"></i>
          </div>
          <span className="text-sm font-black uppercase tracking-tighter italic text-white">नागरिक सेतु</span>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <button 
            onClick={() => onNavigate(AppSection.POLICIES, 'privacy')} 
            className="hover:text-amber-500 transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onNavigate(AppSection.POLICIES, 'terms')} 
            className="hover:text-amber-500 transition-colors"
          >
            Terms of Service
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="hover:text-amber-500 transition-colors"
          >
            rbaadvisor.com
          </button>
        </div>

        <div className="text-slate-600 text-[9px] font-bold text-center md:text-right">
          © 2025 Royal Bulls Advisory Pvt Ltd.<br />
          Authorized Domain: rbaadvisor.com
        </div>
      </div>
    </footer>
  );
};

export default memo(LegalFooter);
