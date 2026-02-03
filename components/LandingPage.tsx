
import React, { useState, useEffect } from 'react';
import { AppSection, Testimonial } from '../types';
import { firebaseService } from '../services/firebaseService';

interface LandingPageProps {
  onStart: () => void;
  onNavigate: (section: AppSection, tab?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate }) => {
  const [likes, setLikes] = useState(12450);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [feedback, setFeedback] = useState({ name: '', rating: 5, comment: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    firebaseService.getLikesCount().then(setLikes);
    firebaseService.getTestimonials().then(setTestimonials);
  }, []);

  const handleLike = async () => {
    const newLikes = await firebaseService.addLike();
    setLikes(newLikes);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await firebaseService.submitTestimonial({
      userName: feedback.name || 'Anonymous',
      rating: feedback.rating,
      comment: feedback.comment
    });
    setSubmitted(true);
    setFeedback({ name: '', rating: 5, comment: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* 🏛️ Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shadow-xl">
            <i className="fas fa-bridge text-lg"></i>
          </div>
          <span className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white royal-serif">नागरिक सेतु</span>
        </div>
        <div className="flex items-center gap-6">
           <button onClick={handleLike} className="hidden md:flex items-center gap-2 text-rose-500 hover:scale-110 transition-transform">
              <i className="fas fa-heart"></i>
              <span className="text-[10px] font-black">{likes.toLocaleString()}</span>
           </button>
           <button 
             onClick={onStart}
             className="bg-amber-500 text-slate-950 px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg active:scale-95"
           >
             Portal Access
           </button>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="relative pt-40 pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>
        
        <div className="space-y-12 max-w-4xl animate-fadeIn">
          <div className="inline-flex items-center space-x-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-5 py-2 rounded-full">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-widest">सार्वजनिक सशक्तिकरण मिशन : LIVE</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight italic uppercase royal-serif">
            अधिकारों का <span className="text-amber-500 underline decoration-white/10 underline-offset-[12px]">कवच</span>,<br />
            ज्ञान का <span className="text-blue-500 italic">प्रकाश</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto italic">
            "हर इंसान का फ़र्ज़ है अपने अधिकारों को जानना। हमने बनाया है एक ऐसा सेतु जो कानून, इतिहास और नागरिक कर्तव्यों को आपकी भाषा में आप तक पहुँचाता है।"
          </p>
          
          <div className="pt-8">
            <button 
              onClick={onStart}
              className="group bg-amber-500 text-slate-950 px-12 py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-amber-400 shadow-2xl transition-all flex items-center mx-auto space-x-4 border-b-4 border-amber-700 active:translate-y-1"
            >
              <span>प्रवेश करें (START NOW)</span>
              <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </button>
          </div>
        </div>
      </section>

      {/* 🏛️ Vision & Mission Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-slate-900/50 p-10 md:p-14 rounded-[4rem] border border-blue-500/10 shadow-2xl space-y-8 group hover:border-blue-500/30 transition-all">
             <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl">
                <i className="fas fa-eye"></i>
             </div>
             <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter royal-serif">हमारा <span className="text-blue-500 font-sans">विज़न</span></h3>
             <p className="text-slate-400 text-lg leading-relaxed italic">
                "2027 तक भारत के हर नागरिक को उसके मौलिक अधिकारों और इतिहास के प्रति इतना जागरूक बनाना कि वह बिना किसी डर या बिचौलिए के प्रशासन से सीधे संवाद कर सके।"
             </p>
          </div>

          <div className="bg-slate-900/50 p-10 md:p-14 rounded-[4rem] border border-amber-500/10 shadow-2xl space-y-8 group hover:border-amber-500/30 transition-all">
             <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-slate-950 text-3xl shadow-xl">
                <i className="fas fa-bullseye"></i>
             </div>
             <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter royal-serif">हमारा <span className="text-amber-500 font-sans">मिशन</span></h3>
             <p className="text-slate-400 text-lg leading-relaxed italic">
                "कठिन कानूनी भाषा और मोटी किताबों को 'सरल कहानियों' और 'AI वॉयस' में बदलकर नागरिकों की जेब में एक ऐसा डिजिटल गुरु देना जो उन्हें हर मोड़ पर सही रास्ता दिखाए।"
             </p>
          </div>
      </section>

      {/* 🛠️ Refined Services Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto space-y-20">
         <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none royal-serif">प्रमुख <span className="text-amber-500 font-sans tracking-normal">सेवाएं</span></h2>
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Premium Civic Services Hub</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "इतिहास (Pehle vs Aaj)", problem: "जड़ों का ज्ञान न होना", solution: "ऐतिहासिक व्यवस्थाओं और आधुनिक लोकतंत्र की सीधी तुलना।", icon: "fa-earth-asia", color: "bg-indigo-600" },
              { title: "संविधान कवच", problem: "कानूनी प्रक्रियाओं का डर", solution: "धाराओं और अधिकारों की सरल हिंदी व्याख्या।", icon: "fa-building-columns", color: "bg-blue-600" },
              { title: "सहायता केंद्र", problem: "बिचौलियों की लूट", solution: "शिकायत दर्ज करने और सही विभाग तक पहुँचने का सटीक मार्ग।", icon: "fa-handshake-angle", color: "bg-emerald-600" }
            ].map((s, i) => (
              <div key={i} className="bg-slate-900 border border-white/5 p-10 rounded-[3.5rem] space-y-6 hover:border-amber-500/20 transition-all group shadow-xl h-full flex flex-col justify-between">
                 <div className="space-y-6">
                    <div className={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                       <i className={`fas ${s.icon}`}></i>
                    </div>
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tight">{s.title}</h4>
                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">प्रॉब्लम: {s.problem}</p>
                       <p className="text-slate-400 text-base italic font-medium leading-relaxed">समाधान: {s.solution}</p>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-white/5 flex items-center justify-between text-slate-600 group-hover:text-amber-500 transition-colors">
                    <span className="text-[9px] font-black uppercase">Learn More</span>
                    <i className="fas fa-arrow-right-long"></i>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* ⭐ Testimonials Section */}
      <section className="py-32 px-6 max-w-6xl mx-auto space-y-20">
         <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter royal-serif">नागरिक <span className="text-blue-500 font-sans">फीडबैक</span></h2>
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Verified Citizen Reviews</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i className="fas fa-quote-right text-6xl"></i>
                 </div>
                 <div className="flex gap-1 text-amber-500 text-xs">
                    {[...Array(t.rating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                 </div>
                 <p className="text-slate-300 italic font-medium leading-relaxed">"{t.comment}"</p>
                 <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-black text-blue-500">{t.userName[0]}</div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.userName}</span>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 📝 Feedback & Evolution Portal */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
         <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-12 md:p-16 rounded-[4rem] border-2 border-white/5 shadow-[0_0_100px_rgba(37,99,235,0.1)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 blur-[80px] group-hover:opacity-100 transition-opacity opacity-50"></div>
            
            <div className="relative z-10 text-center space-y-12">
               <div className="space-y-4">
                  <h3 className="text-4xl md:text-6xl font-black text-white italic royal-serif uppercase tracking-tighter">अपना <span className="text-amber-500">विचार</span> साझा करें</h3>
                  <p className="text-slate-400 text-lg font-medium italic">आप इस ऐप में और क्या देखना चाहते हैं? हमें बताएं।</p>
               </div>

               {submitted ? (
                 <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 rounded-3xl animate-bounce-slow">
                    <i className="fas fa-circle-check text-emerald-500 text-5xl mb-4"></i>
                    <h4 className="text-2xl font-black text-white">धन्यवाद!</h4>
                    <p className="text-slate-400">आपका सुझाव हमारे 'DNA' का हिस्सा बनेगा।</p>
                 </div>
               ) : (
                 <form onSubmit={handleFeedbackSubmit} className="space-y-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <input 
                         type="text" required placeholder="आपका नाम" 
                         value={feedback.name} onChange={e => setFeedback({...feedback, name: e.target.value})}
                         className="bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all"
                       />
                       <select 
                         value={feedback.rating} onChange={e => setFeedback({...feedback, rating: parseInt(e.target.value)})}
                         className="bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none appearance-none"
                       >
                          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                          <option value="4">⭐⭐⭐⭐ Good</option>
                          <option value="3">⭐⭐⭐ Average</option>
                       </select>
                    </div>
                    <textarea 
                      required placeholder="आप हमें क्या बताना चाहते हैं या क्या जुड़वाना चाहते हैं?" 
                      value={feedback.comment} onChange={e => setFeedback({...feedback, comment: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 rounded-3xl px-8 py-6 text-white focus:border-blue-500/50 outline-none transition-all min-h-[150px]"
                    />
                    <button className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-amber-400 shadow-3xl transition-all">Submit Feedback</button>
                 </form>
               )}
            </div>
         </div>
      </section>

      {/* 🏛️ Official Footer */}
      <footer className="py-24 border-t border-white/5 px-6 md:px-12 bg-[#020617]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 md:gap-20">
            <div className="space-y-6">
               <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 shadow-lg">
                     <i className="fas fa-bridge text-sm"></i>
                  </div>
                  <span className="text-xl font-black uppercase tracking-tighter italic text-white royal-serif leading-none">नागरिक सेतु</span>
               </div>
               <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">A GLOBAL MOVEMENT FOR CITIZEN AWARENESS</p>
            </div>

            <div className="flex flex-wrap gap-8 md:gap-12 text-[10px] font-black uppercase tracking-widest text-slate-500">
               <button onClick={() => onNavigate(AppSection.DOCS)} className="hover:text-white transition-colors text-amber-500 font-black">Platform Guide (Docs)</button>
               <button onClick={() => onNavigate(AppSection.POLICIES, 'privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
               <button onClick={() => onNavigate(AppSection.POLICIES, 'terms')} className="hover:text-white transition-colors">Terms of Service</button>
               <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Home Page</button>
               <button onClick={() => onNavigate(AppSection.CONTACT_US)} className="hover:text-white transition-colors">CONTACT MISSION</button>
            </div>
         </div>

         <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-white/5 text-center">
            <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em]">
               © 2025 NagrikSetu. Built by Royal Bulls Advisory Pvt Ltd.
            </p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
