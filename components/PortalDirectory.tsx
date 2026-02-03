
import React from 'react';
import { AppSection } from '../types';

interface PortalDirectoryProps {
  onSelectApp: (section: AppSection) => void;
}

const PortalDirectory: React.FC<PortalDirectoryProps> = ({ onSelectApp }) => {
  const portals = [
    { 
      id: AppSection.FINANCE, 
      title: "RBA प्रीमियम पोर्टल", 
      problem: "व्यावसायिक सेवाओं की कमी", 
      solution: "रियल एस्टेट, लोन और लीगल क्लीनिक एक ही स्थान पर।",
      icon: "fa-crown",
      color: "bg-amber-600"
    },
    { 
      id: AppSection.HUB, 
      title: "ज्ञान केंद्र (Knowledge Hub)", 
      problem: "जानकारी का अभाव", 
      solution: "दुनिया भर का इतिहास और कानून एक साथ।",
      icon: "fa-house-chimney",
      color: "bg-amber-500"
    },
    { 
      id: AppSection.VOICE_ASSISTANT, 
      title: "वॉयस (संस्कृति AI)", 
      problem: "टाइप करने या पढ़ने में कठिनाई", 
      solution: "बोलकर सवाल पूछें और बोलकर जवाब पाएं।",
      icon: "fa-microphone-lines",
      color: "bg-amber-600"
    },
    { 
      id: AppSection.COUNTRY_COMPARISON, 
      title: "देश vs दुनिया (Global Compare)", 
      problem: "वैश्विक परिप्रेक्ष्य की कमी", 
      solution: "भारत और अन्य देशों के अधिकारों एवं सुविधाओं की तुलना।",
      icon: "fa-earth-europe",
      color: "bg-blue-500"
    },
    { 
      id: AppSection.HISTORY, 
      title: "इतिहास (Pehle vs Aaj)", 
      problem: "पुरानी रूढ़ियों का भ्रम", 
      solution: "विरासत और आधुनिक व्यवस्था की तुलना।",
      icon: "fa-earth-asia",
      color: "bg-indigo-500"
    },
    { 
      id: AppSection.CONSTITUTION, 
      title: "संविधान कवच", 
      problem: "कानूनी अधिकारों का डर", 
      solution: "धाराओं और अधिकारों की सरल व्याख्या।",
      icon: "fa-building-columns",
      color: "bg-blue-600"
    },
    { 
      id: AppSection.LOCAL_LAWS_EXPOSED, 
      title: "प्रशासनिक जागरूकता", 
      problem: "दफ्तरों के चक्कर", 
      solution: "स्थानीय नियमों और प्रक्रियाओं की स्पष्टता।",
      icon: "fa-eye",
      color: "bg-rose-600"
    },
    { 
      id: AppSection.EPAPER, 
      title: "डिजिटल ई-अखबार", 
      problem: "फेक न्यूज़ और भ्रम", 
      solution: "ताज़ा खबरों का नागरिक अधिकारों के साथ विश्लेषण।",
      icon: "fa-newspaper",
      color: "bg-slate-700"
    },
    { 
      id: AppSection.PARIVAR_VRUKSH, 
      title: "वंश वृक्ष (Succession Audit)", 
      problem: "संपत्ति और वारिस विवाद", 
      solution: "कानूनी वारिसों की पहचान और वंशावली निर्माण।",
      icon: "fa-sitemap",
      color: "bg-emerald-600"
    },
    { 
      id: AppSection.SAHAYATA_KENDRA, 
      title: "सहायता केंद्र (Help Desk)", 
      problem: "बिचौलियों (Agents) का खर्च", 
      solution: "सही विभाग की पहचान और सीधी सहायता।",
      icon: "fa-handshake-angle",
      color: "bg-blue-700"
    },
    { 
      id: AppSection.NYAY_DARPAN, 
      title: "न्याय दर्पण", 
      problem: "कानूनी देरी (Pendency)", 
      solution: "अदालतों के बोझ और समाधान का विश्लेषण।",
      icon: "fa-gavel",
      color: "bg-slate-800"
    },
    { 
      id: AppSection.TREND_SCANNER, 
      title: "नेशनल ट्रेंड स्कैनर", 
      problem: "ट्रेंड्स की समझ न होना", 
      solution: "देश में चल रहे ज्वलंत विषयों का विश्लेषण।",
      icon: "fa-tower-broadcast",
      color: "bg-emerald-500"
    },
    { 
      id: AppSection.RISK_ANALYZER, 
      title: "रिस्क एनालाइजर", 
      problem: "कानूनी जोखिम", 
      solution: "किसी भी कंटेंट को शेयर करने से पहले रिस्क चेक।",
      icon: "fa-shield-halved",
      color: "bg-rose-500"
    },
    { 
      id: AppSection.JIGYASA_HUB, 
      title: "जिज्ञासा केंद्र", 
      problem: "अनसुलझे सवाल", 
      solution: "किसी भी समस्या का AI आधारित मार्गदर्शन।",
      icon: "fa-lightbulb",
      color: "bg-indigo-600"
    },
    { 
      id: AppSection.PROFILE_EDITOR, 
      title: "नागरिक पहचान (Profile)", 
      problem: "डेटा और प्राइवेसी", 
      solution: "आपका सुरक्षित और निजी नागरिक डेटाबेस।",
      icon: "fa-user-gear",
      color: "bg-slate-900"
    }
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-32">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[4rem] p-12 border border-white/5 shadow-3xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 p-12 opacity-5"><i className="fas fa-bridge text-[200px]</i></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">पोर्टल <span className="text-amber-500">निर्देशिका</span></h2>
          <p className="text-slate-400 text-xl font-medium max-w-3xl mx-auto italic">
            "नागरिक सेतु 15 से अधिक सेवाओं का एक महा-संगम है। यहाँ आपकी हर समस्या का एक 'डिजिटल' समाधान उपलब्ध है।"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portals.map((portal) => (
          <div 
            key={portal.id} 
            className="royal-card p-10 rounded-[3.5rem] border border-white/5 space-y-6 group hover:border-amber-500/30 transition-all cursor-pointer"
            onClick={() => onSelectApp(portal.id)}
          >
            <div className="flex justify-between items-start">
               <div className={`w-16 h-16 ${portal.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${portal.icon}`}></i>
               </div>
               <span className="text-[9px] font-black text-slate-700 group-hover:text-amber-500 uppercase tracking-widest transition-colors">Launch Portal</span>
            </div>
            <div className="space-y-4">
               <h3 className="text-2xl font-black text-white italic tracking-tight">{portal.title}</h3>
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">प्रॉब्लम: {portal.problem}</p>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed italic">समाधान: {portal.solution}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-500/10 p-12 rounded-[4rem] border-2 border-dashed border-amber-500/20 text-center space-y-8">
         <i className="fas fa-heart text-amber-500 text-5xl animate-pulse"></i>
         <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">सशक्त नागरिक, समृद्ध राष्ट्र</h3>
         <p className="text-slate-400 text-lg max-w-2xl mx-auto italic">
           "हमारा लक्ष्य नागरिकों को जागरूक करना है ताकि वे बिचौलियों के चंगुल से बच सकें और अपने अधिकारों को गर्व के साथ जी सकें।"
         </p>
         <button 
           onClick={() => window.open('https://cfpe.me/rbaadvisor', '_blank')}
           className="bg-amber-500 text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 shadow-3xl active:scale-95"
         >
           Support This Mission (Appreciation)
         </button>
      </div>
    </div>
  );
};

export default PortalDirectory;
