
import React from 'react';

const SanskritiVision: React.FC = () => {
  const contributions = [
    { title: "ज्ञान का प्रकाश", desc: "कठिन कानूनों को सरल हिंदी में बदलकर हर नागरिक तक पहुँचाना।", icon: "fa-book-open-reader", color: "text-amber-500" },
    { title: "इतिहास की व्याख्या", desc: "'पहले' और 'आज' के बीच तुलना करके आधुनिक लोकतंत्र की महत्ता बताना।", icon: "fa-hourglass-half", color: "text-rose-500" },
    { title: "संवैधानिक कवच", desc: "धाराओं और अधिकारों का रक्षक बनकर नागरिकों को निडर बनाना।", icon: "fa-shield-halved", color: "text-blue-500" }
  ];

  const futureVision = [
    { title: "AI लीगल ड्राफ्टिंग", desc: "कोर्ट और सरकारी दफ्तरों के लिए सेकंडों में प्रोफेशनल आवेदन पत्र तैयार करना।", label: "Coming Soon" },
    { title: "वॉयस असिस्टेंट 2.0", desc: "बिना टाइप किए, केवल बातचीत से अपनी समस्याओं का समाधान पाना।", label: "In Dev" },
    { title: "न्याय प्रेडिक्टर", desc: "डेटा के आधार पर केस की दिशा और सफलता का विश्लेषण।", label: "Vision 2026" }
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-32 max-w-6xl mx-auto">
      <header className="text-center space-y-6">
        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-amber-500/20">
           <i className="fas fa-brain text-amber-500 text-4xl animate-pulse"></i>
        </div>
        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">AI <span className="text-amber-500">'Sanskriti'</span> का विज़न</h2>
        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto italic">"नागरिक सेतु की डिजिटल शक्ति, जो भारत के हर घर को एक 'संवैधानिक केंद्र' बनाएगी।"</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contributions.map((c, i) => (
          <div key={i} className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 space-y-6 hover:border-amber-500/30 transition-all">
            <i className={`fas ${c.icon} text-3xl ${c.color}`}></i>
            <h3 className="text-2xl font-black text-white uppercase italic">{c.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed italic">{c.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-slate-900 p-12 rounded-[4rem] border-2 border-amber-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12"><i className="fas fa-rocket text-[250px] text-white"></i></div>
        <div className="relative z-10 space-y-12">
           <h3 className="text-3xl font-black text-white uppercase italic tracking-widest text-center md:text-left">भविष्य की <span className="text-amber-500">क्षमताएं</span></h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {futureVision.map((v, i) => (
                <div key={i} className="bg-slate-950 p-8 rounded-3xl border border-white/5 space-y-4">
                  <span className="bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{v.label}</span>
                  <h4 className="text-white font-bold text-lg italic uppercase">{v.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <div className="text-center border-t border-white/5 pt-12">
         <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]">Powered by Advanced Generative AI • Royal Bulls Advisory</p>
      </div>
    </div>
  );
};

export default SanskritiVision;
