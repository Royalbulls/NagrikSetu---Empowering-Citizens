
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'react-markdown';

// Audio Helpers
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  let arrayBuffer = data.buffer;
  let byteOffset = data.byteOffset;
  if (byteOffset % 2 !== 0) {
    const copy = new Uint8Array(data.byteLength);
    copy.set(data);
    arrayBuffer = copy.buffer;
    byteOffset = 0;
  }
  const length = Math.floor(data.byteLength / 2);
  const dataInt16 = new Int16Array(arrayBuffer, byteOffset, length);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface RiskAnalyzerProps {
  context: LocalContext;
  onEarnPoints: (amount: number) => void;
}

const RiskAnalyzer: React.FC<RiskAnalyzerProps> = ({ context, onEarnPoints }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ riskLevel: 'Low' | 'Medium' | 'High', explanation: string } | null>(null);
  const [adminSummary, setAdminSummary] = useState<{ topic: string, purpose: string, riskLevel: string, recommendation: 'Approve' | 'Edit' | 'Reject', reason: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    setAdminSummary(null);
    if (isSpeaking && sourceRef.current) sourceRef.current.stop();
    setIsSpeaking(false);
    
    try {
      const [riskData, summaryData] = await Promise.all([
        geminiService.classifyRisk(content, context),
        geminiService.summarizeForAdmin(content, context)
      ]);
      setResult(riskData);
      setAdminSummary(summaryData);
      onEarnPoints(35); // Earn more for deep analysis
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      if (sourceRef.current) sourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = result?.explanation || "";
    if (!textToSpeak) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(textToSpeak, 'Zephyr');
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      await ctx.resume();
      const audioBuffer = await decodeAudioData(new Uint8Array(buffer), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      sourceRef.current = source;
      source.start(0);
    } catch (e) { setIsSpeaking(false); }
  };

  const riskColors = {
    Low: "from-emerald-500 to-teal-600 shadow-emerald-500/20 text-emerald-500",
    Medium: "from-amber-500 to-orange-600 shadow-amber-500/20 text-amber-500",
    High: "from-rose-600 to-red-700 shadow-rose-600/20 text-rose-500"
  };

  const recColors = {
    Approve: "bg-emerald-600 text-white",
    Edit: "bg-amber-500 text-slate-950",
    Reject: "bg-rose-600 text-white"
  };

  const riskLabels = {
    Low: "सुरक्षित / शैक्षणिक (Safe / Educational)",
    Medium: "जागरूकता / अधिकार (Awareness / Rights)",
    High: "संवेदनशील / कानूनी (Sensitive / Legal)"
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32 max-w-5xl mx-auto">
      {/* 🛡️ Header Section */}
      <div className="bg-slate-900 border-b-4 border-amber-500 p-10 md:p-14 rounded-[3.5rem] shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 rotate-12">
          <i className="fas fa-shield-halved text-[200px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
           <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl">
                 <i className="fas fa-microscope text-2xl"></i>
              </div>
              <div>
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">रिस्क <span className="text-amber-500">एनालाइजर</span></h2>
                 <p className="text-amber-500/60 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Sanskriti AI Content Safety Guard</p>
              </div>
           </div>
           <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-4xl border-l-4 border-amber-500/40 pl-8 py-2 italic">
             "किसी भी विषय या मैसेज को साझा करने से पहले उसकी संवेदनशीलता की जांच करें। जानें कि क्या वह सामान्य जानकारी है या इसमें पुलिस और कोर्ट जैसे उच्च जोखिम वाले संदर्भ हैं।"
           </p>
        </div>
      </div>

      {/* 📝 Input Section */}
      <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
         <div className="space-y-4">
            <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
               <i className="fas fa-comment-slash text-amber-500"></i>
               सामग्री की जांच करें (Input Content)
            </h3>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="यहाँ कोई टॉपिक, मैसेज या घटना का विवरण लिखें..."
              className="w-full bg-slate-950 border-2 border-white/5 rounded-[2.5rem] p-8 text-white text-lg placeholder:text-slate-800 outline-none focus:border-amber-500/50 min-h-[160px] shadow-inner font-medium leading-relaxed"
            />
         </div>
         <button 
           onClick={handleAnalyze}
           disabled={loading || !content.trim()}
           className="w-full bg-amber-500 text-slate-950 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-lg hover:bg-amber-400 shadow-3xl transition-all h-20 flex items-center justify-center border-b-4 border-amber-800 active:translate-y-1 disabled:opacity-30"
         >
           {loading ? <i className="fas fa-dharmachakra fa-spin text-2xl mr-3"></i> : <i className="fas fa-magnifying-glass-chart mr-3"></i>}
           <span>{loading ? "Analyzing Intent..." : "Analyze & Summarize"}</span>
         </button>
      </div>

      {/* 📊 Result Section */}
      {(result || adminSummary) && !loading && (
        <div className="space-y-10 animate-slideUp">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Risk Meter Card */}
              <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${result ? riskColors[result.riskLevel].split(' ')[0] : 'from-slate-700'} ${result ? riskColors[result.riskLevel].split(' ')[1] : 'to-slate-800'}`}></div>
                 
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Detected Risk Level</p>
                 
                 <div className={`w-40 h-40 rounded-full flex items-center justify-center border-8 transition-all duration-1000 relative shadow-[0_0_60px] ${result?.riskLevel === 'High' ? 'border-rose-600 shadow-rose-600/20' : result?.riskLevel === 'Medium' ? 'border-amber-500 shadow-amber-500/20' : 'border-emerald-500 shadow-emerald-500/20'}`}>
                    <div className="text-center">
                       <span className={`text-4xl font-black uppercase italic royal-serif ${result ? riskColors[result.riskLevel].split(' ').pop() : 'text-slate-500'}`}>{result?.riskLevel || '---'}</span>
                    </div>
                    <div className={`absolute inset-[-12px] border-2 rounded-full border-dashed animate-spin-slow opacity-30 ${result ? riskColors[result.riskLevel].split(' ').pop() : 'border-slate-800'}`}></div>
                 </div>

                 <h4 className={`text-sm font-black uppercase tracking-widest mt-10 ${result ? riskColors[result.riskLevel].split(' ').pop() : 'text-slate-500'}`}>
                    {result ? riskLabels[result.riskLevel] : 'विश्लेषण लंबित'}
                 </h4>
              </div>

              {/* Explanation Card */}
              <div className="lg:col-span-8 bg-slate-900 p-10 md:p-14 rounded-[4rem] border border-white/5 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <i className="fas fa-quote-right text-9xl text-white"></i>
                 </div>
                 
                 <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4 relative z-10">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">विश्लेषण और कारण (Analysis)</h3>
                    <button 
                      onClick={handleSpeak}
                      className={`flex items-center space-x-3 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-xl' : 'bg-slate-800 text-amber-500 hover:bg-slate-700'}`}
                    >
                       <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                       <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                    </button>
                 </div>
                 
                 <div className="prose prose-invert max-w-none text-slate-300 text-xl leading-relaxed italic font-medium relative z-10">
                    <ReactMarkdown>{result?.explanation || 'डेटा प्राप्त नहीं हुआ।'}</ReactMarkdown>
                 </div>
              </div>
           </div>

           {/* 📝 Admin Approval Summary (Dossier Style) */}
           {adminSummary && (
             <div className="bg-slate-950 p-10 md:p-16 rounded-[4rem] border-2 border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] animate-slideUp relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                   <i className="fas fa-user-tie text-[300px] text-white"></i>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 relative z-10">
                   <div>
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">प्रशासकीय सारांश (Admin Summary)</h3>
                      <p className="text-slate-600 font-black text-[10px] uppercase tracking-widest mt-1">INTERNAL COMPLIANCE REPORT • SEC-402</p>
                   </div>
                   <div className={`px-10 py-3 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl animate-pulse ${recColors[adminSummary.recommendation]}`}>
                      Status: {adminSummary.recommendation}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                   <div className="space-y-10">
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">विषय (Topic)</p>
                         <p className="text-xl font-bold text-white italic">"{adminSummary.topic}"</p>
                      </div>
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">उद्देश्य (Purpose)</p>
                         <p className="text-lg text-slate-300 font-medium leading-relaxed italic">"{adminSummary.purpose}"</p>
                      </div>
                   </div>

                   <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-white/5 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${recColors[adminSummary.recommendation]}`}>
                            <i className={`fas ${adminSummary.recommendation === 'Approve' ? 'fa-check' : adminSummary.recommendation === 'Edit' ? 'fa-pen-to-square' : 'fa-ban'}`}></i>
                         </div>
                         <h4 className="text-lg font-black text-white uppercase italic tracking-widest">सिफारिश (Recommendation)</h4>
                      </div>
                      <div className="space-y-4">
                         <p className="text-slate-400 text-sm leading-relaxed font-medium italic border-l-2 border-white/10 pl-6">
                            {adminSummary.reason}
                         </p>
                      </div>
                      <div className="pt-4 flex gap-4">
                         <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-600 transition-all">Quick Approve</button>
                         <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 transition-all">Flag Content</button>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      )}

      {/* ℹ️ Guide Section */}
      <div className="bg-slate-950 p-10 rounded-[3rem] border-2 border-dashed border-white/5 opacity-50 hover:opacity-100 transition-opacity">
         <h4 className="text-[10px] font-black text-white uppercase tracking-[0.6em] mb-6 text-center">रिस्क लेवल्स को समझें (Risk Guide)</h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
               <p className="text-emerald-500 font-black text-xs">Low Risk</p>
               <p className="text-slate-500 text-[11px] leading-relaxed">इतिहास के पन्ने, जनरल नॉलेज और प्रेरणादायक बातें। इसे शेयर करना पूरी तरह सुरक्षित है।</p>
            </div>
            <div className="space-y-2">
               <p className="text-amber-500 font-black text-xs">Medium Risk</p>
               <p className="text-slate-500 text-[11px] leading-relaxed">सरकारी दफ्तरों की कार्यप्रणाली और नागरिक अधिकार। जानकारी सही होने पर ही शेयर करें।</p>
            </div>
            <div className="space-y-2">
               <p className="text-rose-500 font-black text-xs">High Risk</p>
               <p className="text-slate-500 text-[11px] leading-relaxed">पुलिस कार्यवाही, कोर्ट के मामले या प्रशासनिक विवाद। यहाँ सावधानी और एक्सपर्ट की सलाह ज़रूरी है।</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RiskAnalyzer;
