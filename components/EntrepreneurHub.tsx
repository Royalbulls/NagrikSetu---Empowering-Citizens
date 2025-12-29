
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { LocalContext } from '../types';

const EntrepreneurHub: React.FC<{ context: LocalContext; onEarnPoints: (val: number) => void }> = ({ context, onEarnPoints }) => {
  const [salesHelp, setSalesHelp] = useState('');
  const [coachResponse, setCoachResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const partnerLink = "https://partner.wcommerce.store/ba/k-v-financial-services";

  const handleAskCoach = async () => {
    if (!salesHelp) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `MISSION: You are the 'Nagrik Sales Guru'. 
      Help the user sell cosmetics and food products for their zero-investment professional business (Vyavsay).
      User Question/Goal: "${salesHelp}". 
      PROVIDE: 
      1. A catchy WhatsApp/Instagram caption (in Hindi & English mix).
      2. 3 psychological tips to convince followers.
      3. Strategy for 20-40% commission success.
      Language: ${context.language}. Use professional Hindi terminology (like 'व्यवसाय' instead of 'व्यापार'). 
      Use feminine Hindi grammar if applicable (स्त्रीलिंग).`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      setCoachResponse(response.text || "");
      onEarnPoints(20);
    } catch (e) {
      setCoachResponse("कोच अभी उपलब्ध नहीं हैं। कृपया बाद में प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      {/* Visual Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 rounded-[3.5rem] p-12 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
          <i className="fas fa-hand-holding-dollar text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">डिजिटल <span className="text-slate-900">उद्यमी</span></h2>
          <p className="text-white text-xl font-medium leading-relaxed max-w-2xl border-l-4 border-slate-900/40 pl-6">
            "बिना किसी निवेश के अपना <span className="text-slate-900 font-black underline decoration-white/30">व्यवसाय</span> शुरू करें। 20% से 40% तक कमीशन कमाएं और आत्मनिर्भर बनें।"
          </p>
          <a href={partnerLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-4 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl">
            <i className="fas fa-shop"></i>
            <span>अपना डिजिटल शोरूम सेटअप करें (Join Now)</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
            <h3 className="text-3xl font-black text-white flex items-center gap-4">
              <i className="fas fa-circle-nodes text-amber-500"></i>
              व्यवसाय कैसे शुरू करें?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-slate-950 p-6 rounded-3xl space-y-4 border border-white/5 group hover:border-amber-500/30 transition-all">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black">1</div>
                  <h4 className="text-white font-bold">रजिस्टर करें</h4>
                  <p className="text-slate-500 text-xs">ऊपर दिए लिंक से K-V Financial Services के साथ पार्टनर बनें।</p>
               </div>
               <div className="bg-slate-950 p-6 rounded-3xl space-y-4 border border-white/5 group hover:border-emerald-500/30 transition-all">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 font-black">2</div>
                  <h4 className="text-white font-bold">लिंक शेयर करें</h4>
                  <p className="text-slate-500 text-xs">बेहतरीन प्रोडक्ट्स के लिंक अपने सोशल मीडिया पर साझा करें।</p>
               </div>
               <div className="bg-slate-950 p-6 rounded-3xl space-y-4 border border-white/5 group hover:border-blue-500/30 transition-all">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-slate-950 font-black">3</div>
                  <h4 className="text-white font-bold">मुनाफा कमाएं</h4>
                  <p className="text-slate-500 text-xs">हर सफल सेल पर सम्मानजनक कमीशन सीधे आपके वॉलेट में।</p>
               </div>
            </div>
          </div>

          {/* AI Coach Area */}
          <div className="bg-slate-900 p-10 rounded-[3rem] border border-indigo-500/20 shadow-2xl space-y-8">
             <div className="flex items-center space-x-5">
               <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                 <i className="fas fa-microphone-lines text-2xl"></i>
               </div>
               <div>
                 <h3 className="text-2xl font-black text-white uppercase italic">Nagrik Sales Coach (AI)</h3>
                 <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest">व्यवसाय बढ़ाने की कला सीखें</p>
               </div>
             </div>
             <textarea 
               value={salesHelp}
               onChange={(e) => setSalesHelp(e.target.value)}
               placeholder="जैसे: 'Instagram Story के लिए लिपस्टिक की सेल का एक अच्छा कैप्शन लिखें' या 'WhatsApp पर प्रोफेशनल तरीके से कैसे बात करूँ?'"
               className="w-full bg-slate-950 border border-white/5 rounded-[2rem] p-8 text-white outline-none focus:border-indigo-500/50 min-h-[120px]"
             />
             <button onClick={handleAskCoach} disabled={loading || !salesHelp} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl">
               {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "कोच से सलाह लें (+20 Points)"}
             </button>

             {coachResponse && (
               <div className="mt-8 bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 animate-slideUp">
                  <div className="prose prose-invert prose-indigo max-w-none text-slate-300">
                    <ReactMarkdown>{coachResponse}</ReactMarkdown>
                  </div>
               </div>
             )}
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[3rem] border border-amber-500/20 shadow-xl text-center space-y-6">
              <i className="fas fa-piggy-bank text-5xl text-amber-500"></i>
              <h4 className="text-xl font-black text-white uppercase italic">आय की संभावना (Earnings)</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl">
                    <span className="text-slate-500 text-[10px] font-black uppercase">Small Scale</span>
                    <span className="text-emerald-500 font-black">₹200 - ₹500 Profit</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl">
                    <span className="text-slate-500 text-[10px] font-black uppercase">Medium Scale</span>
                    <span className="text-emerald-500 font-black">₹1500 - ₹3000 Profit</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-emerald-500/20">
                    <span className="text-slate-500 text-[10px] font-black uppercase">Creator Level</span>
                    <span className="text-amber-500 font-black">₹25,000+ / Month</span>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[3rem] border border-white/10 shadow-3xl text-center space-y-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <i className="fas fa-heart text-rose-500 text-4xl animate-pulse"></i>
              <h4 className="text-xl font-black text-white italic">महिलाओं के लिए विशेष</h4>
              <p className="text-slate-400 text-sm leading-relaxed">घर का काम संभालते हुए भी आप अपनी एक डिजिटल पहचान और <span className="text-white font-bold">स्वयं का व्यवसाय</span> बना सकती हैं। आज ही शुरुआत करें।</p>
              <button onClick={() => window.open(partnerLink, '_blank')} className="w-full bg-white text-slate-950 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all">Start Your Business</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurHub;
