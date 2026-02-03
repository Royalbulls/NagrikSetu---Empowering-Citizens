
import React, { useState } from 'react';
import { LocalContext } from '../types';

interface ExpertConnectProps {
  context: LocalContext;
}

const ExpertConnect: React.FC<ExpertConnectProps> = ({ context }) => {
  const [view, setView] = useState<'marketplace' | 'register'>('marketplace');
  const [filterSeva, setFilterSeva] = useState(false);
  const [formData, setFormData] = useState({ name: '', profession: 'Civil Lawyer', experience: '', city: '', isSeva: false });
  const [submitted, setSubmitted] = useState(false);
  const WHATSAPP_NUMBER = "917869690819";

  const experts = [
    { title: "वरिष्ठ वकील (Senior Advocate)", desc: "सिविल और क्रिमिनल मामलों के विशेषज्ञ", icon: "fa-scale-balanced", category: "Legal", isSeva: true },
    { title: "प्रॉपर्टी एक्सपर्ट (Property Expert)", desc: "जमीन और जायदाद के कानूनी कागजात की जांच", icon: "fa-house-circle-check", category: "Legal", isSeva: false },
    { title: "इतिहासकार (Historical Scholar)", desc: "शोध और प्राचीन दस्तावेजों का विश्लेषण", icon: "fa-scroll", category: "History", isSeva: true },
    { title: "उपभोक्ता सलाहकार (Consumer Advisor)", desc: "कंपनियों के खिलाफ शिकायत और अधिकारों के विशेषज्ञ", icon: "fa-cart-shopping", category: "Consumer", isSeva: true }
  ];

  const filteredExperts = filterSeva ? experts.filter(e => e.isSeva) : experts;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const sevaMsg = formData.isSeva ? "✅ Ready for FREE SEVA (समाज सेवा हेतु तैयार)" : "💼 Professional Consultant";
    const msg = `🤝 *New Partner Registration Request*
---------------------------------------
👤 *Name:* ${formData.name}
💼 *Profession:* ${formData.profession}
⏳ *Experience:* ${formData.experience} Years
📍 *City:* ${formData.city}
❤️ *Service:* ${sevaMsg}
---------------------------------------
_Inquiry via NagrikSetu Expert Portal._`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setView('marketplace'); }, 3000);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32 max-w-7xl mx-auto">
      <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 border-2 border-amber-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-handshake text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
           <div className="space-y-6 max-w-3xl">
              <div className="flex items-center space-x-3 bg-rose-600/10 w-fit px-4 py-1.5 rounded-full border border-rose-600/20">
                 <i className="fas fa-heart text-[10px] text-rose-500 animate-pulse"></i>
                 <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Free Seva Initiative Active</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none royal-serif">विशेषज्ञ <span className="text-amber-500">संपर्क</span></h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed italic border-l-4 border-amber-500/50 pl-8 py-2">
                "हज़ारों विशेषज्ञ नागरिकों की मुफ़्त सेवा (Free Help) के लिए यहाँ उपलब्ध हैं। अपने लिए सही सलाहकार चुनें।"
              </p>
           </div>
           <div className="flex bg-slate-950 p-2 rounded-2xl border border-white/5 shrink-0 shadow-2xl">
              <button onClick={() => setView('marketplace')} className={`px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${view === 'marketplace' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Find Experts</button>
              <button onClick={() => setView('register')} className={`px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${view === 'register' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Join Mission</button>
           </div>
        </div>
      </div>

      {view === 'marketplace' && (
        <div className="space-y-12 animate-slideUp">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-4 bg-slate-900/50 p-3 px-6 rounded-2xl border border-white/5">
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">मुफ़्त सेवा (Seva Mode)</span>
                 <button 
                   onClick={() => setFilterSeva(!filterSeva)}
                   className={`w-14 h-7 rounded-full transition-all relative shadow-inner ${filterSeva ? 'bg-emerald-600' : 'bg-slate-800'}`}
                 >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-lg ${filterSeva ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">{filteredExperts.length} Experts active for your city</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredExperts.map((exp, idx) => (
                <div key={idx} className="bg-slate-900 border border-white/5 p-10 rounded-[3.5rem] flex flex-col justify-between group hover:border-amber-500/30 transition-all shadow-xl h-[480px] relative overflow-hidden">
                   <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-start">
                         <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-amber-500 text-2xl shadow-inner group-hover:scale-110 transition-transform">
                            <i className={`fas ${exp.icon}`}></i>
                         </div>
                         {exp.isSeva && (
                           <div className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-lg flex items-center gap-1">
                              <i className="fas fa-heart"></i> SEVA
                           </div>
                         )}
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-black text-white italic uppercase tracking-tight leading-tight">{exp.title}</h4>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{exp.category}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed italic font-medium">"{exp.desc}"</p>
                   </div>
                   <button 
                    onClick={() => {
                        const msg = `नमस्ते,\n\nमैं 'नागरिक सेतु' के माध्यम से ${exp.title} से सहायता प्राप्त करना चाहता हूँ। ${exp.isSeva ? '(सेवा मोड)' : ''}`;
                        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="w-full bg-slate-800 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-500 hover:text-slate-950 transition-all mt-10 shadow-lg relative z-10"
                  >
                    Request WhatsApp Call
                  </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {view === 'register' && (
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-16 border border-white/5 shadow-2xl space-y-12 animate-slideUp">
           <div className="text-center space-y-4">
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">मिशन से <span className="text-amber-500 font-sans">जुड़ें</span></h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Join our Professional Network of Expert Volunteers</p>
           </div>

           {submitted ? (
             <div className="bg-emerald-500/10 border border-emerald-500/20 p-24 rounded-[3rem] text-center space-y-6 animate-bounce-slow">
                <i className="fas fa-heart text-emerald-500 text-6xl"></i>
                <h4 className="text-2xl font-black text-white">आवेदन स्वीकार!</h4>
                <p className="text-slate-400">आपका विवरण सुरक्षित है। हमारी टीम जल्द संपर्क करेगी।</p>
             </div>
           ) : (
             <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
                   <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500/50" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Profession</label>
                   <input type="text" required value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500/50" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Experience (Years)</label>
                   <input type="number" required value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500/50" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Base City</label>
                   <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500/50" />
                </div>
                
                <div className="md:col-span-2 bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl space-y-6">
                   <label className="flex items-center space-x-4 cursor-pointer group">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${formData.isSeva ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'}`}>
                        {formData.isSeva && <i className="fas fa-check text-slate-950 text-xs"></i>}
                        <input type="checkbox" className="hidden" checked={formData.isSeva} onChange={e => setFormData({...formData, isSeva: e.target.checked})} />
                      </div>
                      <div className="space-y-1">
                         <span className="text-white font-black uppercase text-xs">मुफ़्त नागरिक सेवा (Volunteer Help)</span>
                         <p className="text-[10px] text-slate-500 font-medium italic">"मैं नागरिकों को उनके अधिकारों के लिए मुफ़्त मार्गदर्शन देने के लिए तैयार हूँ।"</p>
                      </div>
                   </label>
                </div>

                <button type="submit" className="md:col-span-2 bg-amber-500 text-slate-950 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-amber-400 shadow-3xl transition-all border-b-4 border-amber-800 active:translate-y-1">JOIN EXPERT PANEL</button>
             </form>
           )}
        </div>
      )}
    </div>
  );
};

export default ExpertConnect;
