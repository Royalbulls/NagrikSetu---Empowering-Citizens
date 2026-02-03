
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { LocalContext } from '../types';

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

const GovSchemesSection: React.FC<{ context: LocalContext; onEarnPoints: (val: number) => void }> = ({ context, onEarnPoints }) => {
  const [profile, setProfile] = useState({ category: 'Women', state: 'Madhya Pradesh', purpose: 'Entrepreneurship' });
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const triggerPointsAnimation = (amount: number) => {
    const div = document.createElement('div');
    div.className = 'point-float';
    div.innerText = `+${amount}`;
    div.style.left = '50%';
    div.style.top = '50%';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  };

  const handleSearch = async (forcedQuery?: string) => {
    const finalQuery = forcedQuery || `Find schemes for ${profile.category} in ${profile.state} focused on ${profile.purpose}.`;
    setLoading(true);
    setResult('');
    setLinks([]);
    setFeedbackSent(false);

    try {
      const response = await geminiService.analyzeGovSchemes(finalQuery, context);
      setResult(response.text || "योजनाएं नहीं मिलीं।");
      if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(response.candidates[0].groundingMetadata.groundingChunks);
      }
      onEarnPoints(50);
      triggerPointsAnimation(50);
    } catch (error) {
      setResult("सर्वर से जुड़ने में समस्या आई।");
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
    if (!result) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(result, 'Kore');
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

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      <div className="bg-gradient-to-br from-emerald-600 to-slate-900 rounded-[3.5rem] p-12 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
          <i className="fas fa-building-columns text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">सरकारी <span className="text-emerald-400">कवच</span></h2>
          <p className="text-emerald-100/70 text-xl font-medium leading-relaxed max-w-2xl border-l-4 border-emerald-400/50 pl-6 italic">
            "हर नागरिक को मिले उसका हक। सीधे आवेदन पोर्टल और आधिकारिक जानकारी के साथ योजनाओं का लाभ उठाएं।"
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 border border-emerald-500/10 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">आपकी श्रेणी (Category)</label>
              <select value={profile.category} onChange={e => setProfile(p => ({...p, category: e.target.value}))} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/40">
                <option>Women (महिलाएं)</option>
                <option>Entrepreneurs (उद्यमी)</option>
                <option>Farmers (किसान)</option>
                <option>Students (छात्र)</option>
                <option>Senior Citizens</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">राज्य (State)</label>
              <input type="text" value={profile.state} onChange={e => setProfile(p => ({...p, state: e.target.value}))} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/40" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">उद्देश्य (Purpose)</label>
              <select value={profile.purpose} onChange={e => setProfile(p => ({...p, purpose: e.target.value}))} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/40">
                <option value="Entrepreneurship">Business (व्यवसाय शुरू करना)</option>
                <option>Education Loan/Scholarship</option>
                <option>Medical Help</option>
                <option>Housing (आवास)</option>
                <option>Direct Cash Benefit</option>
              </select>
           </div>
        </div>
        
        <div className="relative group">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="जैसे: 'पीएम आवास योजना आवेदन कैसे करें?' या 'स्वरोजगार के लिए सरकारी लोन'..."
            className="w-full bg-slate-950 border-2 border-emerald-900/10 rounded-[2.5rem] p-8 text-white text-xl placeholder:text-slate-800 outline-none focus:border-emerald-500/40 transition-all min-h-[140px]"
          />
          <button onClick={() => handleSearch()} disabled={loading} className="w-full mt-4 bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-500 shadow-xl transition-all h-16 flex items-center justify-center border-b-4 border-emerald-800 active:translate-y-1">
            {loading ? <i className="fas fa-circle-notch fa-spin text-2xl"></i> : "आधिकारिक पोर्टल एवं योजनाएं खोजें (+50 Points)"}
          </button>
        </div>
      </div>

      {result && !loading && (
        <div className="space-y-10 animate-slideUp">
           {/* Primary Analysis Result */}
           <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-3xl border border-emerald-500/10 relative overflow-hidden group">
              <div className="flex justify-between items-center mb-10 gap-6">
                 <button onClick={handleSpeak} className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-xl' : 'bg-slate-800 text-amber-500 border border-amber-500/20'}`}>
                    <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                    <span>{isSpeaking ? 'सुनना बंद करें' : 'सुनें (Listen Mode)'}</span>
                 </button>
                 <div className="hidden md:flex gap-2">
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-[8px] font-black uppercase">Official Data Node Active</span>
                 </div>
              </div>

              <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-xl leading-relaxed mb-12">
                 <ReactMarkdown>{result}</ReactMarkdown>
              </div>

              {/* 🔗 DIRECT APPLICATION PORTAL LINKS - Prominently Displayed */}
              {links.length > 0 && (
                 <div className="mt-12 pt-10 border-t border-white/5 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg animate-pulse">
                          <i className="fas fa-link"></i>
                       </div>
                       <h3 className="text-xl font-black text-white uppercase italic tracking-widest">आधिकारिक आवेदन पोर्टल (Direct Apply)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {links.map((link, i) => (
                         <a 
                           key={i} 
                           href={link.web?.uri} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="bg-slate-950 p-8 rounded-[2.5rem] border-2 border-emerald-500/10 hover:border-emerald-500/40 transition-all group shadow-2xl relative overflow-hidden flex flex-col justify-between h-44"
                         >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                               <i className="fas fa-arrow-up-right-from-square text-6xl text-white"></i>
                            </div>
                            <div className="relative z-10">
                               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Government Portal {i+1}</p>
                               <h4 className="text-lg font-black text-white line-clamp-2 leading-tight uppercase italic">{link.web?.title || 'Apply Now'}</h4>
                            </div>
                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 relative z-10">
                               <span className="text-xs font-black text-emerald-400 group-hover:underline uppercase tracking-tighter">View Official Website</span>
                               <i className="fas fa-external-link-alt text-slate-800 group-hover:text-emerald-500 transition-colors"></i>
                            </div>
                         </a>
                       ))}
                    </div>
                 </div>
              )}

              <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">क्या यह जानकारी मददगार थी?</span>
                    <div className="flex space-x-2">
                       <button onClick={() => { setFeedbackSent(true); triggerPointsAnimation(10); onEarnPoints(10); }} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all"><i className="fas fa-thumbs-up"></i></button>
                       <button onClick={() => setFeedbackSent(true)} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 flex items-center justify-center transition-all"><i className="fas fa-thumbs-down"></i></button>
                    </div>
                 </div>
                 {feedbackSent && <span className="text-[10px] font-black text-emerald-500 uppercase animate-fadeIn">प्रतिक्रिया के लिए धन्यवाद! भारत सशक्त हो रहा है।</span>}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GovSchemesSection;
