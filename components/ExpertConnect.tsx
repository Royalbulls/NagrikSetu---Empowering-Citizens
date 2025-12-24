
import React, { useState } from 'react';
import { LocalContext } from '../types';

interface ExpertConnectProps {
  context: LocalContext;
}

const ExpertConnect: React.FC<ExpertConnectProps> = ({ context }) => {
  const [view, setView] = useState<'marketplace' | 'register'>('marketplace');
  const [regForm, setRegForm] = useState({ name: '', profession: '', experience: '', city: '' });
  const [submitted, setSubmitted] = useState(false);

  const experts = [
    { title: "वरिष्ठ वकील (Senior Advocate)", desc: "सिविल और क्रिमिनल मामलों के विशेषज्ञ", icon: "fa-scale-balanced", category: "Legal" },
    { title: "प्रॉपर्टी एक्सपर्ट (Property Expert)", desc: "जमीन और जायदाद के कानूनी कागजात की जांच", icon: "fa-house-circle-check", category: "Legal" },
    { title: "इतिहासकार (Historical Scholar)", desc: "शोध और प्राचीन दस्तावेजों का विश्लेषण", icon: "fa-scroll", category: "History" },
    { title: "उपभोक्ता सलाहकार (Consumer Advisor)", desc: "कंपनियों के खिलाफ शिकायत और अधिकारों के विशेषज्ञ", icon: "fa-cart-shopping", category: "Consumer" }
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulating database call
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[3.5rem] p-12 border-2 border-amber-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-handshake text-[200px] text-amber-500"></i>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center space-x-3 bg-amber-500/10 w-fit px-4 py-1 rounded-full border border-amber-500/20">
              <i className="fas fa-star text-[10px] text-amber-500 animate-pulse"></i>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Premium Service: COMING SOON</span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              विशेषज्ञों से <span className="text-amber-500">सीधा संपर्क</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              "नागरिक सेतु" आपको देश के बेहतरीन वकीलों और विद्वानों से जोड़ रहा है। अब आपकी हर समस्या का समाधान सिर्फ एक क्लिक की दूरी पर होगा।
            </p>
          </div>
          
          <div className="flex bg-slate-950 p-2 rounded-2xl border border-white/5 shrink-0">
             <button onClick={() => setView('marketplace')} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'marketplace' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Explore Experts</button>
             <button onClick={() => setView('register')} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'register' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Join as Partner</button>
          </div>
        </div>
      </div>

      {view === 'marketplace' && (
        <div className="space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {experts.map((exp, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-white/5 p-8 rounded-[2.5rem] text-center space-y-6 group hover:border-amber-500/30 transition-all relative overflow-hidden grayscale hover:grayscale-0">
                  <div className="absolute top-2 right-2 px-3 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase rounded-full">Coming Soon</div>
                  <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-amber-500 text-2xl mx-auto shadow-inner group-hover:scale-110 transition-transform">
                     <i className={`fas ${exp.icon}`}></i>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-white">{exp.title}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{exp.category}</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">{exp.desc}</p>
                  <button className="w-full bg-slate-950 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-not-allowed">Get Consultation</button>
                </div>
              ))}
           </div>

           <div className="bg-amber-500/5 border border-amber-500/20 p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4">
                 <h3 className="text-3xl font-black text-white italic">क्या आप एक पेशेवर हैं?</h3>
                 <p className="text-slate-400">वकील, शोधकर्ता या कानूनी सलाहकार? आज ही हमारे पार्टनर नेटवर्क में शामिल हों और 140 करोड़ नागरिकों की मदद करें।</p>
              </div>
              <button onClick={() => setView('register')} className="bg-amber-500 text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all shadow-3xl shrink-0">Partner Registration Portal</button>
           </div>
        </div>
      )}

      {view === 'register' && (
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[4rem] p-12 border border-white/5 shadow-2xl space-y-12 animate-slideUp">
           <div className="text-center space-y-4">
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">पार्टनर <span className="text-amber-500">रजिस्ट्रेशन</span></h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Join India's Most Trusted Citizen Knowledge Network</p>
           </div>

           {submitted ? (
             <div className="bg-emerald-500/10 border border-emerald-500/20 p-20 rounded-[3rem] text-center space-y-6 animate-bounce-slow">
                <i className="fas fa-circle-check text-emerald-500 text-6xl"></i>
                <h4 className="text-2xl font-black text-white">सफलतापूर्वक रजिस्टर्ड!</h4>
                <p className="text-slate-400">हमारी टीम आपसे जल्द ही संपर्क करेगी। मिशन का हिस्सा बनने के लिए धन्यवाद।</p>
             </div>
           ) : (
             <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
                   <input 
                    type="text" required 
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500/50" 
                    placeholder="जैसे: एडवोकेट राहुल कुमार"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Profession</label>
                   <select className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500/50 appearance-none">
                      <option className="bg-slate-950">Civil Lawyer</option>
                      <option className="bg-slate-950">Criminal Lawyer</option>
                      <option className="bg-slate-950">Legal Consultant</option>
                      <option className="bg-slate-950">History Researcher</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Experience (Years)</label>
                   <input type="number" required className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500/50" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">City</label>
                   <input type="text" required className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500/50" />
                </div>
                <div className="md:col-span-2 bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl space-y-4">
                   <div className="flex items-start space-x-4">
                      <i className="fas fa-circle-info text-amber-500 mt-1"></i>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-wider">
                        नोट: "नागरिक सेतु" प्रत्येक सफल परामर्श पर 15% की सेवा शुल्क (Service Fee) चार्ज करेगा। बाकी 85% राशि सीधे पार्टनर को मिलेगी।
                      </p>
                   </div>
                </div>
                <button type="submit" className="md:col-span-2 bg-amber-500 text-slate-950 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 shadow-3xl transition-all">Submit Professional Profile</button>
             </form>
           )}
        </div>
      )}
    </div>
  );
};

export default ExpertConnect;
