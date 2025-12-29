
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { LocalContext, PublicAlert } from '../types';

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

const ClimateShield: React.FC<{ context: LocalContext; onEarnPoints: (val: number) => void }> = ({ context, onEarnPoints }) => {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [groundingLinks, setGroundingLinks] = useState<any[]>([]);
  const [activeMode, setActiveMode] = useState<'audit' | 'roadmap' | 'anthem'>('audit');
  
  const [alerts, setAlerts] = useState<PublicAlert[]>([
    { id: '1', userName: 'नर्मदा मित्र', location: 'धार, मप्र', issue: 'नहर प्रबंधन एवं जल संरक्षण जागरूकता', timestamp: Date.now(), severity: 'medium' },
    { id: '2', userName: 'Delhi Citizen', location: 'नई दिल्ली', issue: 'AQI 500+ Health Advisory Support #CleanAir', timestamp: Date.now() - 3600000, severity: 'high' },
    { id: '3', userName: 'Ecological Guard', location: 'हिमालय क्षेत्र', issue: 'सतत विकास एवं जंगल संरक्षण डेटा एनालिसिस', timestamp: Date.now() - 7200000, severity: 'medium' }
  ]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleInvestigate = async (forcedQuery?: string) => {
    const activeQuery = forcedQuery || query;
    if (!activeQuery) return;
    setLoading(true);
    setAnalysis('');
    setGroundingLinks([]);
    try {
      let response;
      if (activeMode === 'roadmap') {
        response = await geminiService.generateResolutionStrategy(activeQuery, context);
      } else if (activeMode === 'anthem') {
        response = await geminiService.generateNatureAnthem(activeQuery, context);
      } else {
        response = await geminiService.analyzeEcoImpact(activeQuery, context);
      }
      setAnalysis(response.text || "");
      if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setGroundingLinks(response.candidates[0].groundingMetadata.groundingChunks);
      }
      onEarnPoints(activeMode === 'anthem' ? 50 : 80);
    } catch (error) {
      setAnalysis("सेतु से डेटा प्राप्त करने में त्रुटि।");
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
    if (!analysis) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(analysis, 'Zephyr');
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
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-[3.5rem] p-10 md:p-14 border border-emerald-500/30 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] scale-150 rotate-12 pointer-events-none">
          <i className="fas fa-scale-balanced text-[250px] text-emerald-400"></i>
        </div>
        <div className="relative z-10 space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl">
                   <i className="fas fa-seedling text-2xl"></i>
                </div>
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">प्रकृति <span className="text-emerald-400">जवाबदेही</span></h2>
                   <p className="text-emerald-500/60 font-black text-[10px] uppercase tracking-[0.4em] mt-1 italic">Eco-Legality & Health Awareness Hub</p>
                </div>
              </div>
              <div className="flex bg-slate-950 p-2 rounded-2xl border border-white/5 shadow-inner overflow-x-auto no-scrollbar">
                 <button 
                  onClick={() => setActiveMode('audit')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeMode === 'audit' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-emerald-400'}`}
                 >
                   Legal Audit
                 </button>
                 <button 
                  onClick={() => setActiveMode('roadmap')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeMode === 'roadmap' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-blue-400'}`}
                 >
                   Roadmap
                 </button>
                 <button 
                  onClick={() => setActiveMode('anthem')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeMode === 'anthem' ? 'bg-rose-600 text-white shadow-xl' : 'text-slate-500 hover:text-rose-400'}`}
                 >
                   <i className="fas fa-music mr-2"></i>Anthem
                 </button>
              </div>
           </div>
           <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-4xl border-l-4 border-emerald-500/50 pl-8 py-2 italic">
             "पर्यावरण की सुरक्षा हमारा संवैधानिक कर्तव्य है। {activeMode === 'anthem' ? 'प्रकृति की महिमा को शब्दों में पिरोएं और समाज को जागरूक करें।' : 'जब हम कानून की भाषा अपनाते हैं, तो हमारा पक्ष निर्विवाद हो जाता है।'}"
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-6">
             <h3 className="text-2xl font-black text-white italic uppercase tracking-widest flex items-center gap-4">
                <i className={`fas ${activeMode === 'audit' ? 'fa-magnifying-glass-chart' : activeMode === 'roadmap' ? 'fa-map-location-dot' : 'fa-music'} ${activeMode === 'audit' ? 'text-emerald-500' : activeMode === 'roadmap' ? 'text-blue-500' : 'text-rose-500'}`}></i>
                {activeMode === 'audit' ? 'तथ्यात्मक विश्लेषण (Fact Audit)' : activeMode === 'roadmap' ? 'समाधान मार्गदर्शिका (Roadmap)' : 'प्रकृति गान (Nature Anthem)'}
             </h3>
             <textarea 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder={activeMode === 'audit' ? "प्रदूषण या पेड़ों की कटाई के कानूनी प्रभावों की जांच करें..." : activeMode === 'roadmap' ? "समस्या लिखें, AI आपको विभाग और प्रक्रिया बताएगा..." : "विषय लिखें (जैसे: हिमालय की महिमा, गंगा का दर्द)..."}
               className="w-full bg-slate-950 border-2 border-white/5 rounded-[2.5rem] p-8 text-white text-lg placeholder:text-slate-800 outline-none focus:border-emerald-500/50 min-h-[180px] shadow-inner font-medium"
             />
             <div className="flex flex-col gap-4">
                <button 
                  onClick={() => handleInvestigate()}
                  disabled={loading || !query}
                  className={`w-full py-6 rounded-2xl font-black uppercase text-sm tracking-widest shadow-3xl transition-all h-20 flex items-center justify-center border-b-4 active:translate-y-1 ${activeMode === 'audit' ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800' : activeMode === 'roadmap' ? 'bg-blue-600 hover:bg-blue-500 border-blue-800' : 'bg-rose-600 hover:bg-rose-500 border-rose-800'}`}
                >
                  {loading ? <i className="fas fa-dharmachakra fa-spin text-2xl mr-3"></i> : (activeMode === 'audit' ? "ऑडिट डेटा प्राप्त करें" : activeMode === 'roadmap' ? "संवैधानिक प्रक्रिया जानें" : "गीत की रचना करें")}
                </button>
             </div>
          </div>

          {analysis && !loading && (
            <div className={`bg-slate-900 p-12 rounded-[4rem] border shadow-3xl animate-slideUp relative overflow-hidden ${activeMode === 'anthem' ? 'border-rose-500/20' : 'border-white/10'}`}>
               <div className="absolute top-0 left-0 p-12 opacity-[0.02] pointer-events-none scale-150">
                  <i className={`fas ${activeMode === 'anthem' ? 'fa-music' : 'fa-file-shield'} text-[300px] text-white`}></i>
               </div>
               <div className="flex justify-between items-center mb-10 relative z-10">
                  <div className="flex items-center space-x-4">
                     <div className={`w-2.5 h-2.5 rounded-full animate-ping ${activeMode === 'audit' ? 'bg-emerald-500' : activeMode === 'roadmap' ? 'bg-blue-500' : 'bg-rose-500'}`}></div>
                     <span className={`text-[10px] font-black uppercase tracking-widest italic ${activeMode === 'audit' ? 'text-emerald-500' : activeMode === 'roadmap' ? 'text-blue-500' : 'text-rose-500'}`}>{activeMode === 'anthem' ? 'Sanskriti Poetry Feed' : 'Sanskriti AI Mentor Feed'}</span>
                  </div>
                  <button 
                    onClick={handleSpeak}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-xl' : 'bg-slate-850 text-emerald-400 border border-emerald-500/20'}`}
                  >
                     <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-volume-high'} text-xl`}></i>
                  </button>
               </div>
               <div className={`prose prose-invert max-w-none text-slate-200 text-xl leading-relaxed mb-12 relative z-10 font-medium ${activeMode === 'anthem' ? 'prose-rose font-serif italic text-center text-3xl leading-loose' : 'prose-emerald'}`}>
                  <ReactMarkdown>{analysis}</ReactMarkdown>
               </div>
               {groundingLinks.length > 0 && activeMode !== 'anthem' && (
                 <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                    <p className="text-xs font-black text-emerald-500/60 uppercase tracking-widest mb-4">सबूत एवं शोध (Evidence & Research):</p>
                    <div className="flex flex-wrap gap-3">
                       {groundingLinks.map((link, i) => (
                         <a key={i} href={link.web?.uri} target="_blank" rel="noopener noreferrer" className="bg-slate-950 px-4 py-2 rounded-xl text-[10px] text-slate-400 border border-white/5 hover:border-emerald-500/30 transition-all font-bold">
                           <i className="fas fa-link mr-2"></i> {link.web?.title}
                         </a>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">नागरिक सहयोग फीड</h4>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
                 {alerts.map((alert) => (
                   <div key={alert.id} className="bg-slate-950 p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all space-y-3 relative group">
                      <div className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full ${alert.severity === 'high' ? 'bg-rose-600' : 'bg-emerald-600'}`}></div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{alert.location}</p>
                      <h5 className="text-white font-black text-sm leading-tight italic">"{alert.issue}"</h5>
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                         <button className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1 hover:text-white transition-colors"><i className="fas fa-hands-holding-child"></i> SUPPORT TOPIC</button>
                         <span className="text-[8px] font-bold text-slate-600 italic">By: {alert.userName}</span>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 bg-slate-800 hover:bg-emerald-600 text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">Submit Awareness Entry</button>
           </div>

           <div className="bg-gradient-to-br from-rose-900 to-slate-950 p-8 rounded-[3rem] border border-white/10 shadow-3xl text-center space-y-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <i className="fas fa-music text-rose-400 text-4xl"></i>
              <h4 className="text-xl font-black text-white italic uppercase">प्रकृति की आवाज़</h4>
              <p className="text-rose-200 text-sm leading-relaxed">गीत और कविता समाज को जोड़ने का सबसे सशक्त माध्यम हैं। अपना गान बनाएं और पर्यावरण के प्रति जागरूकता फैलाएं।</p>
              <button onClick={() => setActiveMode('anthem')} className="w-full bg-white text-slate-950 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-400 transition-all">Create New Anthem</button>
           </div>
        </div>
      </div>

      <div className="bg-slate-950 p-12 rounded-[4rem] border-2 border-emerald-500/20 text-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50 animate-pulse"></div>
         <h4 className="text-emerald-500 font-black text-xs uppercase tracking-[0.5em] mb-8">Civic Responsibility Protocol</h4>
         <p className="text-slate-400 italic text-2xl leading-relaxed max-w-5xl mx-auto relative z-10 font-medium">
           "दिल्ली का दम घुटना सिर्फ एक मौसम नहीं, बल्कि एक प्रशासनिक चुनौती है। जब हम तथ्यों के साथ प्रशासन के सामने खड़े होते हैं, तो सुधार की प्रक्रिया अनिवार्य हो जाती है। ज्ञान सेतु आपको वह 'तथ्य आधारित शक्ति' प्रदान करता है।"
         </p>
      </div>
    </div>
  );
};

export default ClimateShield;
