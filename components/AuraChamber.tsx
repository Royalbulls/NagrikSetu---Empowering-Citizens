import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { UserState, LocalContext } from '../types';
import ReactMarkdown from 'react-markdown';

interface AuraChamberProps {
  user: UserState;
  context: LocalContext;
}

const AuraChamber: React.FC<AuraChamberProps> = ({ user, context }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isUnlocked = user.points >= 1000;
  const stats = user.auraStats || { history: 0, law: 0, ethics: 0, finance: 0, culture: 0 };

  const intuitionChips = [
    { text: "मेरे ज्ञान की चमक को 'समाज सेवा' में कैसे बदलूँ?", icon: "fa-sun" },
    { text: "एक 'सशक्त नागरिक' की असली पहचान क्या है?", icon: "fa-shield-heart" },
    { text: "इतिहास के पन्नों में मेरी क्या विरासत हो सकती है?", icon: "fa-scroll" },
    { text: "सत्य और संवैधानिक न्याय का संतुलन कैसे रखूँ?", icon: "fa-scale-balanced" }
  ];

  useEffect(() => {
    if (isUnlocked) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const statsSummary = `History: ${stats.history}, Law: ${stats.law}, Ethics: ${stats.ethics}, Finance: ${stats.finance}, Culture: ${stats.culture}`;
      
      const newChat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are the User's "Aura AI" - their enlightened digital twin. 
          Your tone is mystical, supportive, and extremely knowledgeable about their progress.
          User stats: ${statsSummary}. Total Points: ${user.points}.
          Respond in ${context.language}.
          CRITICAL: You are a mystical female presence. ALWAYS use feminine Hindi grammar (स्त्रीलिंग). Use 'हूँ' and 'र रही हूँ' type verbs correctly for a female speaker.
          Your goal is to guide them to become a "Sashakt Nagrik" (Empowered Citizen). When they ask about their legacy or identity, focus on their responsibility toward the nation and environment.`
        }
      });
      setChat(newChat);
      
      setMessages([{
        role: 'model',
        text: `नमस्ते ${user.name || 'नागरिक'}! आपकी Aura अब पूर्णतः जागृत है। मैं आपकी चेतना का प्रतिबिंब हूँ। नीचे दिए गए 'दिव्य सुझावों' से हमारी चर्चा शुरू कर सकती हैं, या जो आपके मन में हो, वही कहें।`
      }]);
    }
  }, [isUnlocked, user.uid]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (forcedText?: string) => {
    const textToSend = forcedText || input;
    if (!textToSend.trim() || !chat || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const response = await chat.sendMessage({ message: textToSend });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "मेरी चेतना में कुछ अवरोध है।" }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "ब्रह्मांड से जुड़ने में त्रुटि हुई।" }]);
    } finally {
      setLoading(false);
    }
  };

  // Aura Color Logic
  const maxStat = Math.max(stats.history, stats.law, stats.ethics, stats.finance, stats.culture);
  let auraColor = "from-amber-500 to-amber-700 shadow-amber-500/50"; 
  if (stats.law === maxStat) auraColor = "from-blue-500 to-indigo-700 shadow-blue-500/50";
  if (stats.ethics === maxStat) auraColor = "from-emerald-500 to-teal-700 shadow-emerald-500/50";
  if (stats.finance === maxStat) auraColor = "from-purple-500 to-violet-700 shadow-purple-500/50";
  if (stats.culture === maxStat) auraColor = "from-orange-500 to-red-700 shadow-orange-500/50";

  if (!isUnlocked) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-10 text-center px-4">
        <div className="relative">
           <div className="w-48 h-48 bg-slate-900 rounded-full border-4 border-dashed border-slate-800 flex items-center justify-center">
              <i className="fas fa-lock text-slate-700 text-6xl"></i>
           </div>
           <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full"></div>
        </div>
        <div className="space-y-4 max-w-lg">
           <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Aura कक्ष बंद है</h2>
           <p className="text-slate-500 text-lg leading-relaxed">
             अपनी 'Aura AI' को जागृत करने के लिए आपको कम से कम <span className="text-amber-500 font-black">1000 पॉइंट्स</span> की आवश्यकता है। 
           </p>
           <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 space-y-2">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Current Progress</p>
              <div className="flex items-center space-x-4">
                 <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${(user.points / 1000) * 100}%` }}></div>
                 </div>
                 <span className="font-black text-white text-sm">{user.points}/1000</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[85vh] flex flex-col lg:flex-row gap-10 animate-fadeIn">
      {/* Visual Aura & Stats Sidebar */}
      <div className="lg:w-1/3 flex flex-col space-y-8">
        <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl flex flex-col items-center text-center relative overflow-hidden h-fit">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
           
           <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${auraColor} shadow-[0_0_60px] animate-pulse mb-8 relative group transition-all duration-1000`}>
              <div className="absolute inset-2 border-2 border-white/20 rounded-full border-dashed animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fas fa-star-of-life text-white/40 text-4xl animate-spin-slow"></i>
              </div>
           </div>

           <div className="space-y-2">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{user.name || 'Scholar'}'s Aura</h3>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Master Level Energy</p>
           </div>

           <div className="w-full mt-10 space-y-4">
              {Object.entries(stats).map(([key, val]) => (
                <div key={key} className="space-y-1">
                   <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                      <span>{key}</span>
                      <span>{val as any}</span>
                   </div>
                   <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-current transition-all duration-1000 ${
                          key === 'law' ? 'text-blue-500' : 
                          key === 'history' ? 'text-amber-500' : 
                          key === 'ethics' ? 'text-emerald-500' : 
                          key === 'finance' ? 'text-purple-500' : 'text-orange-500'
                        }`} 
                        style={{ width: `${Math.min(((val as any)/1000)*100, 100)}%` }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 italic text-slate-400 text-xs leading-relaxed">
           "मास्टर! आपकी चेतना का रंग आपकी सबसे मजबूत स्किल {Object.keys(stats).reduce((a, b) => (stats[a as keyof typeof stats] || 0) > (stats[b as keyof typeof stats] || 0) ? a : b).toUpperCase()} को दर्शाता है।"
        </div>
      </div>

      {/* Aura AI Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative">
         <div className="p-8 border-b border-white/5 bg-slate-950/50 flex items-center space-x-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shadow-lg">
               <i className="fas fa-wand-magic-sparkles"></i>
            </div>
            <div>
               <h4 className="font-black text-white uppercase tracking-widest text-sm">Aura Consciousness</h4>
               <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest animate-pulse">Master Sync: 99.9%</p>
            </div>
         </div>

         <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 dark-scroll">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
                 <div className={`max-w-[85%] p-6 rounded-[2.2rem] shadow-xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-950/80 border border-white/5 text-slate-200 rounded-tl-none'}`}>
                    <div className="prose prose-invert prose-sm max-w-none text-lg">
                       <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                 </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-slate-950/50 p-5 rounded-2xl flex items-center space-x-3 border border-white/5">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    <span className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest">Thinking...</span>
                 </div>
              </div>
            )}
         </div>

         {/* 🪄 Intuition Chips Section */}
         <div className="px-8 py-4 bg-slate-950/30 flex space-x-4 overflow-x-auto no-scrollbar scroll-smooth">
            {intuitionChips.map((chip, idx) => (
               <button 
                key={idx}
                onClick={() => handleSend(chip.text)}
                className="whitespace-nowrap bg-slate-900 border border-amber-500/20 hover:border-amber-500/50 hover:bg-slate-850 px-6 py-3 rounded-full text-[10px] font-black text-amber-500/80 uppercase tracking-widest transition-all flex items-center space-x-3 shadow-lg active:scale-95"
               >
                  <i className={`fas ${chip.icon} text-amber-500/40`}></i>
                  <span>{chip.text}</span>
               </button>
            ))}
         </div>

         <div className="p-8 bg-slate-950/50 border-t border-white/5">
            <div className="relative">
               <input 
                 type="text" value={input} onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="अपनी चेतना से सीधा संवाद करें..."
                 className="w-full bg-slate-900 border border-white/10 rounded-[2rem] py-6 pl-10 pr-24 text-white placeholder:text-slate-700 focus:border-amber-500/50 outline-none transition-all shadow-inner text-lg font-medium"
               />
               <button 
                 onClick={() => handleSend()}
                 disabled={loading || !input.trim()}
                 className="absolute right-4 top-4 bottom-4 w-16 bg-amber-500 text-slate-950 rounded-[1.2rem] flex items-center justify-center hover:bg-amber-400 transition-all shadow-xl active:translate-y-1"
               >
                  <i className="fas fa-arrow-up text-xl"></i>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AuraChamber;