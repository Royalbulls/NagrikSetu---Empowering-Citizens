
import React from 'react';
import { AppSection } from '../types';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  language: string;
}

const sidebarTranslations: Record<string, any> = {
  Hindi: {
    hub: "नागरिक केंद्र", hubSub: "कंट्रोल हब",
    explorer: "विरासत एक्सप्लोरर", explorerSub: "नक्शे और गाइड",
    vision: "विज़न लैब", visionSub: "भविष्य की दृष्टि",
    support: "मिशन सहारा", supportSub: "हमारा साथ दें",
    archives: "ज्ञान संग्रह", archivesSub: "पुराने सत्र",
    daily: "दैनिक साधना", dailySub: "रोज का अभ्यास",
    contest: "प्रतियोगिता", contestSub: "ग्लोबल मुकाबला",
    investigate: "इन्वेस्टिगेटर", investigateSub: "अपराध और सुराग",
    wisdom: "विवेक केंद्र", wisdomSub: "बुद्धिमानी हब",
    culture: "विरासत लैब", cultureSub: "संस्कृति और बोलियाँ",
    religion: "धर्म संगम", religionSub: "विश्व का ज्ञान",
    law: "कानून सहायता", lawSub: "कानूनी कार्रवाई",
    constitution: "संविधान", constitutionSub: "अधिकार केंद्र",
    history: "इतिहास", historySub: "वैश्विक कालक्रम",
    story: "मेरी कहानी", storySub: "डिजिटल यादें",
    tutor: "लाइव ट्यूटर", tutorSub: "वॉइस AI",
    profile: "प्रोफाइल", profileSub: "सांख्यिकी और इनाम",
    about: "टीम और विज़न", aboutSub: "The Founders",
    chronology: "साप्ताहिक कालक्रम", chronologySub: "इतिहास का पहिया",
    menuHeader: "ऐप मेन्यू",
    mastery: "महारत स्तर"
  },
  English: {
    hub: "Citizen Hub", hubSub: "Control Hub",
    explorer: "Heritage Explorer", explorerSub: "Maps & Guides",
    vision: "Vision Lab", visionSub: "Future Vision",
    support: "Support Mission", supportSub: "Help Us Grow",
    archives: "Archives", archivesSub: "Saved Sessions",
    daily: "Daily Practice", dailySub: "Daily Ritual",
    contest: "Competition", contestSub: "Global Contest",
    investigate: "Investigator", investigateSub: "Crime & Clues",
    wisdom: "Wisdom Center", wisdomSub: "Intelligence Hub",
    culture: "Heritage Lab", cultureSub: "Culture & Dialects",
    religion: "Religion Junction", religionSub: "World Wisdom",
    law: "Legal Help", lawSub: "Law Action",
    constitution: "Constitution", constitutionSub: "Rights Center",
    history: "History", historySub: "Global History",
    story: "My Story", storySub: "Digital Memoir",
    tutor: "Live Tutor", tutorSub: "Voice AI",
    profile: "Profile", profileSub: "Stats & Rewards",
    about: "Team & Vision", aboutSub: "The Founders",
    chronology: "Weekly Chronology", chronologySub: "Wheel of History",
    menuHeader: "App Menu",
    mastery: "Mastery Level"
  }
};

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, language }) => {
  const t = sidebarTranslations[language] || sidebarTranslations.English;

  const menuItems = [
    { id: AppSection.HUB, label: t.hub, sub: t.hubSub, icon: 'fa-grip' },
    { id: AppSection.EXPLORER, label: t.explorer, sub: t.explorerSub, icon: 'fa-map-location-dot' },
    { id: AppSection.WEEKLY_TIMELINE, label: t.chronology, sub: t.chronologySub, icon: 'fa-timeline' },
    { id: AppSection.DAILY_PRACTICE, label: t.daily, sub: t.dailySub, icon: 'fa-crown' },
    { id: AppSection.COMPETITION, label: t.contest, sub: t.contestSub, icon: 'fa-trophy' },
    { id: AppSection.LAW, label: t.law, sub: t.lawSub, icon: 'fa-scale-balanced' },
    { id: AppSection.CONSTITUTION, label: t.constitution, sub: t.constitutionSub, icon: 'fa-book-open' },
    { id: AppSection.HISTORY, label: t.history, sub: t.historySub, icon: 'fa-monument' },
    { id: AppSection.DASHBOARD, label: t.profile, sub: t.profileSub, icon: 'fa-user' },
  ];

  return (
    <aside className="hidden md:flex w-72 flex-col bg-slate-900 border-r border-amber-900/30 shadow-2xl h-screen sticky top-0 overflow-hidden">
      <div className="p-6 flex flex-col h-full">
        <button 
          onClick={() => setActiveSection(AppSection.HUB)}
          className="flex items-center space-x-3 mb-8 shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <i className="fas fa-bridge text-slate-950 text-lg"></i>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase">{language === 'Hindi' ? 'नागरिक सेतु' : 'NagrikSetu'}</h1>
        </button>

        <nav className="space-y-1 overflow-y-auto flex-1 dark-scroll pr-2 -mr-2">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 ml-2">{t.menuHeader}</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeSection === item.id 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg scale-[1.02]' 
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-5 flex justify-center ${activeSection === item.id ? 'text-slate-950' : 'group-hover:text-amber-400'}`}>
                <i className={`fas ${item.icon} text-sm`}></i>
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black tracking-wide leading-none uppercase">{item.label}</p>
                <p className={`text-[8px] mt-0.5 uppercase tracking-tighter font-bold ${activeSection === item.id ? 'text-slate-900/70' : 'text-slate-600'}`}>{item.sub}</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-4 border-t border-white/5 shrink-0">
          <div className="bg-slate-950/50 rounded-xl p-4 border border-amber-500/10">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[9px] text-amber-500/60 font-black uppercase tracking-widest">{t.mastery}</p>
              <span className="text-[9px] font-black text-amber-500">65%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-2/3 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
