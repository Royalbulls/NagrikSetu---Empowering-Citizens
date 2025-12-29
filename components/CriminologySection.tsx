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
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const CriminologySection: React.FC<{ onUpdatePoints: (val: number) => void; context: LocalContext }> = ({ onUpdatePoints, context }) => {
  const [details, setDetails] = useState('');
  const [timeOfOccurence, setTimeOfOccurence] = useState('');
  const [direction, setDirection] = useState('');
  const [patternResult, setPatternResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleDeepAnalyze = async () => {
    if (!details) return;
    setLoading(true);
    setPatternResult(null);
    try {
      const data = await geminiService.analyzeCrimePatterns({
        details,
        time: timeOfOccurence,
        direction
      }, context);
      setPatternResult(data);
      onUpdatePoints(60);
    } catch (error) {
      console.error(error);
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
    if (!patternResult) return;
    const text = `${patternResult.patternIdentified}. ${patternResult.chronoAnalysis}. ${patternResult.spatialInsight}.`;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(text, 'Zephyr');
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
      <div className="bg-slate-950 p-12 rounded-[4rem] border-l-[10px] border-rose-600 shadow-3xl relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[160%] bg-rose-600/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
              अपराध <span className="text-rose-600 font-serif">पैटर्न</span> लैब
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-1 bg-slate-900 p-10 rounded-[3.5rem] border border-white/10 shadow-3xl space-y-10 relative">
           <textarea
             value={details}
             onChange={(e) => setDetails(e.target.value)}
             placeholder="क्या हुआ? एक या अधिक घटनाओं का विवरण दें..."
             className="w-full bg-slate-950 border-2 border-white/5 rounded-[2.5rem] p-8 text-white text-lg focus:border-rose-600/50 outline-none transition-all min-h-[250px]"
           />
           <button 
             onClick={handleDeepAnalyze} 
             disabled={loading || !details} 
             className="w-full bg-rose-600 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-lg hover:bg-rose-500 shadow-3xl transition-all"
           >
             {loading ? <i className="fas fa-brain fa-spin"></i> : "पैटर्न विश्लेषण शुरू करें"}
           </button>
        </div>

        <div className="lg:col-span-2 space-y-10">
           {patternResult && !loading && (
             <div className="bg-slate-900 rounded-[4rem] p-12 border-2 border-rose-600/20 shadow-3xl animate-slideUp relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 relative z-10">
                   <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">{patternResult.title}</h3>
                   <button 
                    onClick={handleSpeak}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-rose-600 text-white' : 'bg-slate-800 text-rose-500'}`}
                   >
                      <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-volume-high'} text-2xl`}></i>
                   </button>
                </div>
                <div className="space-y-8 relative z-10">
                   {patternResult.nextSteps?.map((step: string, i: number) => (
                    <div key={i} className="bg-slate-850 p-8 rounded-3xl border border-white/5 flex items-start gap-6">
                       <span className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black">{i+1}</span>
                       <p className="text-slate-300 text-lg">{step}</p>
                    </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CriminologySection;