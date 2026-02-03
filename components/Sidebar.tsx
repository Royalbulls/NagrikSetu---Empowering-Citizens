
import React, { useMemo } from 'react';
import { AppSection, UserRole } from '../types';
import { translations } from '../utils/translations';

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
  userRole: UserRole;
  recentSections?: AppSection[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  language, 
  isOpen, 
  setIsOpen, 
  isGuest, 
  onLoginClick,
  userRole,
  recentSections = []
}) => {
  const t = translations[language] || translations['English'];
  
  const categories = useMemo(() => [
    {
      title: t.categories.identity,
      items: [
        { id: AppSection.PROFILE_EDITOR, label: t.sections.profile, icon: 'fa-user-gear' },
        { id: AppSection.PARIVAR_VRUKSH, label: t.sections.familyTree, icon: 'fa-sitemap' },
      ]
    },
    {
      title: "RBA & Technology",
      items: [
        { id: AppSection.FINANCE, label: "RBA प्रीमियम सेवाएं", icon: 'fa-crown text-amber-500' },
        { id: AppSection.OMI_INTEGRATION, label: "Omi वियरेबल (Link)", icon: 'fa-microchip text-emerald-500' },
        { id: AppSection.APPLICATION_WRITER, label: "डॉक्यूमेंट जनरेटर", icon: 'fa-file-pen' },
      ]
    },
    {
      title: t.categories.powers,
      items: [
        { id: AppSection.SAHAYATA_KENDRA, label: t.sections.help, icon: 'fa-file-signature' },
        { id: AppSection.CONSTITUTION, label: t.sections.rights, icon: 'fa-shield-halved' },
        { id: AppSection.EXPERT_CONNECT, label: t.sections.experts, icon: 'fa-user-doctor' },
      ]
    },
    {
      title: t.categories.education,
      items: [
        { id: AppSection.HISTORY, label: t.sections.history, icon: 'fa-earth-asia' },
        { id: AppSection.LOCAL_LAWS_EXPOSED, label: t.sections.laws, icon: 'fa-eye' },
        { id: AppSection.EPAPER, label: t.sections.epaper, icon: 'fa-newspaper' },
      ]
    },
    {
      title: t.categories.support,
      items: [
        { id: AppSection.SUPPORT_MISSION, label: t.sections.support, icon: 'fa-heart' },
        { id: AppSection.CONTACT_US, label: t.sections.contact, icon: 'fa-headset' },
        { id: AppSection.DOCS, label: t.sections.docs, icon: 'fa-book' },
      ]
    }
  ], [language, t]);

  const allItemsMap = useMemo(() => {
    const map: Record<string, { label: string, icon: string }> = {};
    categories.forEach(cat => cat.items.forEach(item => { map[item.id] = { label: item.label, icon: item.icon }; }));
    return map;
  }, [categories]);

  return (
    <aside className={`fixed inset-y-0 left-0 z-[70] w-72 bg-slate-950 border-r border-white/5 transition-transform duration-500 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col p-6 overflow-y-auto no-scrollbar shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setActiveSection(AppSection.LAUNCHER)}>
               <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shadow-xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-bridge text-lg"></i>
               </div>
               <span className="text-lg font-black uppercase tracking-tighter text-white royal-serif">{t.appTitle}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 p-2"><i className="fas fa-times"></i></button>
         </div>
         
         <div className="flex-1 space-y-8">
            {recentSections.length > 0 && (
               <div className="space-y-3">
                  <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500">{t.categories.quickAccess}</h4>
                  {recentSections.map((id) => {
                     const info = allItemsMap[id];
                     if (!info) return null;
                     return (
                        <button key={id} onClick={() => setActiveSection(id)} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all bg-white/5 border border-white/5 ${activeSection === id ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`}>
                           <i className={`fas ${info.icon} text-sm w-5`}></i>
                           <span className="text-[9px] uppercase font-bold">{info.label}</span>
                        </button>
                     );
                  })}
               </div>
            )}

            {categories.map((cat, i) => (
               <div key={i} className="space-y-3">
                  <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 ml-2">{cat.title}</h4>
                  <div className="space-y-1">
                     {cat.items.map((item) => (
                        <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-amber-500 text-slate-950 font-black shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}>
                           <i className={`fas ${item.icon} text-base w-5`}></i>
                           <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>

         {isGuest && (
           <div className="mt-8">
              <button onClick={onLoginClick} className="w-full bg-slate-900 border border-white/10 text-amber-500 py-4 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all">{t.login}</button>
           </div>
         )}
      </div>
    </aside>
  );
};

export default Sidebar;
