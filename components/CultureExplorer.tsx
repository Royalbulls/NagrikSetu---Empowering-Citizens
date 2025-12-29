
import React, { useState, useRef, useEffect } from 'react';
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

const CultureExplorer: React.FC<{ context: LocalContext; onEarnPoints: (val: number) => void }> = ({ context, onEarnPoints }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [spotlightLoading, setSpotlightLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [travelMode, setTravelMode] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const states = [
    "Madhya Pradesh", "Rajasthan", "Gujarat", "Maharashtra", "Uttar Pradesh", 
    "Punjab", "West Bengal", "Tamil Nadu", "Kerala", "Karnataka", 
    "Assam", "Odisha", "Bihar", "Himachal Pradesh", "Jammu & Kashmir"
  ];

  // Load Cultural Spotlight on mount
  useEffect(() => {
    const fetchSpotlight = async () => {
      setSpotlightLoading(true);
      try {
        const insight = await geminiService.fetchSectionSpotlight("Global Heritage and Tourism", context);
        setResult(insight);
      } catch (e) {} finally { setSpotlightLoading(false); }
    };
    fetchSpotlight();
  }, [context.language]);

  const triggerPointsAnimation = (amount: number) => {
    const div = document.createElement('div');
    div.className = 'point-float';
    div.innerText = `+${amount}`;
    div.style.left = '50%';
    div.style.top = '50%';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  };

  const handleExplore = async (forcedValue?: string) => {
    const target = forcedValue || searchQuery || selectedState;
    if (!target) return;
    setLoading(true);
    setResult('');

    try {
      const response = await geminiService.fetchGlobalCulture(
        target + (travelMode ? " travel guide and family lifestyle" : ""), 
        context
      );
      setResult(response.text || "जानकारी नहीं मिल पाई।");
      onEarnPoints(40);
      triggerPointsAnimation(40);
    } catch (error) {
      setResult("संस्कृति के सेतु में कुछ बाधा आई है।");
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
    <div className="space-y-12 animate-fadeIn pb-32">
      {/* Visual Banner */}
      <div className="bg-gradient-to-br from-orange-600 via-rose-700 to-amber-900 rounded-[3.5rem] p-12 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
          <i className="fas fa-earth-asia text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">ग्लोबल <span className="text-orange-400">विरासत</span> दर्शन</h2>
          <p className="text-white/80 text-xl font-medium leading-relaxed max-w-2xl border-l-4 border-orange-400 pl-6 italic">
            "विश्व पर्यटन और संस्कृतियों का संगम। जानें दुनिया के किसी भी कोने का इतिहास, परिवार और जीवनशैली।"
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">दुनिया का कोई भी स्थान (City/Country)</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSelectedState(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleExplore()}
                  placeholder="जैसे: 'Paris', 'Tokyo', 'Varanasi'..."
                  className="w-full bg-slate-950 border-2 border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-lg placeholder:text-slate-700 focus:border-orange-500/50 outline-none transition-all shadow-inner"
                />
                <i className="fas fa-search-location absolute left-6 top-1/2 -translate-y-1/2 text-orange-500/50 group-focus-within:text-orange-500 transition-colors"></i>
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">या भारतीय राज्य चुनें (Quick Access)</label>
              <select 
                value={selectedState} 
                onChange={e => { setSelectedState(e.target.value); setSearchQuery(''); handleExplore(e.target.value); }} 
                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white text-lg appearance-none outline-none focus:border-orange-500/50 transition-all"
              >
                <option value="">-- भारतीय राज्य चुनें --</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
           </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
           <div className="flex-1 flex items-center space-x-6 bg-slate-950 p-6 rounded-3xl border border-white/5 w-full">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${travelMode ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
                <i className="fas fa-suitcase-rolling text-2xl"></i>
              </div>
              <div className="flex-1">
                 <p className="text-xs font-black text-white uppercase">World Tourism Guide</p>
                 <p className="text-[9px] text-slate-500 font-bold uppercase italic">पर्यटक और सांस्कृतिक गाइड के रूप में जानकारी</p>
              </div>
              <button 
                onClick={() => setTravelMode(!travelMode)}
                className={`w-14 h-7 rounded-full transition-all relative ${travelMode ? 'bg-orange-600' : 'bg-slate-700'}`}
              >
                 <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${travelMode ? 'right-1' : 'left-1'}`}></div>
              </button>
           </div>

           <button 
              onClick={() => handleExplore()} 
              disabled={loading || (!searchQuery && !selectedState)} 
              className="w-full md:w-auto bg-orange-600 text-white px-14 py-6 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-orange-500 shadow-3xl transition-all h-20 flex items-center justify-center disabled:opacity-30 flex-shrink-0"
            >
              {loading ? <i className="fas fa-dharmachakra fa-spin text-2xl"></i> : "खोजें (Explore)"}
            </button>
        </div>
      </div>

      {(loading || spotlightLoading) && (
        <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
           <i className="fas fa-dharmachakra fa-spin text-orange-500 text-6xl"></i>
           <p className="text-orange-500/60 font-black uppercase tracking-widest text-[10px] mt-6 animate-pulse">Scanning Global Heritage Nodes...</p>
        </div>
      )}

      {result && !loading && !spotlightLoading && (
        <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-3xl border border-orange-500/10 animate-slideUp relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none scale-150 rotate-12">
              <i className="fas fa-earth-asia text-[300px] text-white"></i>
           </div>

           <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 relative z-10">
              <div className="flex items-center space-x-5">
                 <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                    <i className="fas fa-map-marked-alt text-2xl"></i>
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{searchQuery || selectedState || "विरासत"} दर्शन</h3>
                    <p className="text-orange-500 font-black text-[9px] uppercase tracking-[0.4em]">Verified Global Insight • NagrikSetu World Feed</p>
                 </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleSpeak} 
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-xl scale-105' : 'bg-slate-800 text-amber-500 border border-amber-500/20'}`}
                >
                  <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                  <span>{isSpeaking ? 'बंद करें' : 'सुनें (Listen)'}</span>
                </button>
              </div>
           </div>

           <div className="prose prose-invert prose-orange max-w-none text-slate-200 text-xl leading-relaxed mb-12 relative z-10 font-medium">
              <ReactMarkdown>{result}</ReactMarkdown>
           </div>

           <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <div className="bg-slate-950/80 px-8 py-4 rounded-2xl border border-white/5 italic text-slate-500 text-sm">
                 "पूरी दुनिया एक परिवार है, और हर जगह की संस्कृति में मानवता का सार है।"
              </div>
              <div className="flex space-x-4">
                 <button onClick={() => window.print()} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Download Guide</button>
                 <button onClick={() => { triggerPointsAnimation(10); onEarnPoints(10); }} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Helpful +10</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CultureExplorer;
