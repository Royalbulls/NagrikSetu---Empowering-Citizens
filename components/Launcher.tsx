
import React from 'react';
import { AppSection } from '../types';

interface LauncherProps {
  onSelectApp: (section: AppSection) => void;
  points: number;
}

const Launcher: React.FC<LauncherProps> = ({ onSelectApp, points }) => {
  const apps = [
    {
      id: AppSection.HUB,
      name: "NagrikSetu",
      tagline: "Empowerment Hub",
      hindi: "नागरिक सेतु",
      desc: "इतिहास, कानून और संविधान का संगम। जागरूक नागरिक बनें और पॉइंट्स कमाएं।",
      icon: "fa-shield-halved",
      color: "from-amber-500 to-orange-600",
      status: "Active",
      reward: "+150 Points"
    },
    {
      id: AppSection.FINANCE,
      name: "RBA Premium Hub",
      tagline: "Wealth & Advisory",
      hindi: "प्रीमियम सेवाएँ",
      desc: "Royal Bulls की विशेष निवेश, रियल एस्टेट और करियर सलाह। सब कुछ एक ही स्थान पर।",
      icon: "fa-bullseye",
      color: "from-blue-500 to-indigo-600",
      status: "Active",
      reward: "Direct Assistance"
    }
  ];

  const featuredServices = [
    { title: "Real Estate", icon: "fa-house-flag", label: "Ujjain & Indore", color: "text-emerald-500" },
    { title: "ITR & GST", icon: "fa-file-invoice-dollar", label: "Legal Clinic", color: "text-blue-500" },
    { title: "Bank Training", icon: "fa-graduation-cap", label: "Aurum Program", color: "text-amber-500" },
    { title: "Startup Reg.", icon: "fa-rocket", label: "Business Growth", color: "text-rose-500" }
  ];

  return (
    <div className="space-y-20 animate-fadeIn py-12 max-w-7xl mx-auto px-4">
      {/* 🐂 Royal Branding Header */}
      <div className="text-center space-y-8 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full -z-10"></div>
        <div className="inline-flex items-center space-x-4 bg-amber-500/10 border border-amber-500/20 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 italic shadow-2xl">
          <i className="fas fa-crown mr-2"></i> ROYAL BULLS ADVISORY CONSOLE
        </div>
        <div className="space-y-4">
           <h2 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none royal-serif">
             डिजिटल <span className="text-amber-500">सेतु</span> स्टोर
           </h2>
           <p className="text-slate-500 text-xl md:text-2xl font-medium max-w-3xl mx-auto italic leading-relaxed">
             "एक ही छत के नीचे—शिक्षा, सुरक्षा और समृद्धि। <span className="text-white font-bold">Royal Bulls</span> का आधिकारिक मल्टी-ऐप ईकोसिस्टम।"
           </p>
        </div>
      </div>

      {/* 📱 Main App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {apps.map((app, i) => {
          const isActive = app.status === 'Active';
          return (
            <button
              key={i}
              onClick={() => isActive && onSelectApp(app.id as AppSection)}
              className={`group relative royal-card p-10 md:p-14 rounded-[3.5rem] text-left transition-all duration-700 ${!isActive ? 'opacity-50 grayscale cursor-default' : 'shadow-2xl hover:shadow-amber-500/5'}`}
            >
              <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-[0.08] blur-[100px] transition-opacity duration-700`}></div>
              
              <div className="relative z-10 flex items-start justify-between mb-10">
                <div className={`w-20 h-20 bg-gradient-to-br ${app.color} rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <i className={`fas ${app.icon}`}></i>
                </div>
                <div className="text-right">
                  <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${isActive ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-lg' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                    {app.status}
                  </span>
                  <p className="text-amber-500/60 text-[9px] font-black mt-3 uppercase tracking-[0.2em]">{app.reward}</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none royal-serif group-hover:text-amber-500 transition-colors">{app.name}</h3>
                <p className="text-amber-500/80 font-black text-[11px] uppercase tracking-[0.4em]">{app.tagline}</p>
                <h4 className="text-slate-300 text-xl font-bold">{app.hindi}</h4>
                <p className="text-slate-500 text-base font-medium leading-relaxed italic pt-4 border-t border-white/5">{app.desc}</p>
              </div>

              <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                 <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Royal Bulls Certified</span>
                 </div>
                 <div className={`w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center transition-all duration-500 ${isActive ? 'group-hover:bg-white group-hover:text-slate-950 group-hover:translate-x-2 shadow-xl shadow-white/5' : 'opacity-20'}`}>
                   <i className="fas fa-arrow-right-long text-xl"></i>
                 </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 💎 Featured Services Portfolio */}
      <div className="space-y-10">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
            <div className="space-y-2">
               <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase royal-serif">हमारी <span className="text-amber-500">प्रीमियम</span> सेवाएँ</h3>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Expert Solutions by Royal Bulls Advisory</p>
            </div>
            <button 
              onClick={() => onSelectApp(AppSection.FINANCE)}
              className="text-amber-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors flex items-center gap-3"
            >
              See All Services <i className="fas fa-arrow-right-long"></i>
            </button>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, idx) => (
              <button 
                key={idx}
                onClick={() => onSelectApp(AppSection.FINANCE)}
                className="bg-slate-900/60 border border-white/5 p-8 rounded-[2.5rem] text-left space-y-6 hover:border-amber-500/30 hover:bg-slate-900 transition-all group shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:scale-110 transition-transform">
                   <i className={`fas ${service.icon} text-[120px] text-white`}></i>
                </div>
                <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white text-2xl shadow-inner border border-white/5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-500">
                   <i className={`fas ${service.icon}`}></i>
                </div>
                <div className="space-y-1 relative z-10">
                   <h4 className="text-xl font-black text-white uppercase italic leading-tight">{service.title}</h4>
                   <p className={`${service.color} text-[9px] font-black uppercase tracking-widest`}>{service.label}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-slate-600 text-[8px] font-black uppercase tracking-widest group-hover:text-slate-400">Consult Now</span>
                   <i className="fas fa-chevron-right text-[10px] text-slate-700 group-hover:text-amber-500"></i>
                </div>
              </button>
            ))}
         </div>
      </div>

      {/* 🚀 Partnership Banner */}
      <div className="bg-slate-950/80 p-12 rounded-[4rem] border-2 border-dashed border-amber-500/10 text-center space-y-8 max-w-4xl mx-auto group hover:border-amber-500/30 transition-all duration-700 shadow-inner">
         <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-white/5 group-hover:scale-110 transition-transform">
            <i className="fas fa-plus text-2xl text-slate-700 group-hover:text-amber-500 transition-colors"></i>
         </div>
         <div className="space-y-3">
            <h4 className="text-2xl font-black text-slate-400 uppercase royal-serif group-hover:text-white transition-colors">App Partnership Program</h4>
            <p className="text-slate-600 text-sm font-bold uppercase tracking-widest max-w-xl mx-auto leading-relaxed italic">
              "क्या आपके पास नागरिकों के जीवन में बदलाव लाने वाला कोई क्रांतिकारी विचार है? Royal Bulls के प्लेटफॉर्म से जुड़ें।"
            </p>
         </div>
      </div>
    </div>
  );
};

export default Launcher;
