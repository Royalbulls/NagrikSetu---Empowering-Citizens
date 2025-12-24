
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'https://esm.sh/react-markdown';
import { QuizQuestion, LocalContext } from '../types';

// Audio Helpers
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
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

interface CriminologySectionProps {
  onUpdatePoints: (amount: number) => void;
  context: LocalContext;
}

const CriminologySection: React.FC<CriminologySectionProps> = ({ onUpdatePoints, context }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [pointPopup, setPointPopup] = useState<{ val: number; id: number } | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const triggerPointFeedback = (val: number) => {
    setPointPopup({ val, id: Date.now() });
    onUpdatePoints(val);
    setTimeout(() => setPointPopup(null), 1500);
  };

  const handleStudy = async (topic?: string) => {
    const finalQuery = topic || query;
    if (!finalQuery) return;

    setLoading(true);
    setResponse('');
    setFeedbackSent(false);

    try {
      const prompt = `Psychological profiling and study of: "${finalQuery}". Language: ${context.language}. markdown.`;
      const result = await geminiService.askComplexQuestion(prompt, context);
      setResponse(result.text || "No insights found.");
      triggerPointFeedback(15);
    } catch (error) {
      setResponse("विवरण प्राप्त करने में विफल।");
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
    if (!response) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(response, 'Zephyr');
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
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
    <div className="space-y-8 animate-fadeIn pb-20 relative">
      {pointPopup && (
        <div key={pointPopup.id} className={`fixed top-1/2 left-1/2 -translate-x-1/2 z-[100] font-black text-6xl animate-bounce ${pointPopup.val > 0 ? 'text-indigo-500' : 'text-rose-500'}`}>
          {pointPopup.val > 0 ? `+${pointPopup.val}` : pointPopup.val}
        </div>
      )}

      <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-indigo-500/20">
        <h3 className="text-3xl font-black text-white mb-6 flex items-center space-x-4">
           <i className="fas fa-user-secret text-indigo-500"></i>
           <span>अपराधी मानस (Criminology Hub)</span>
        </h3>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="अपराधी व्यवहार के बारे में पूछें..."
          className="w-full p-6 rounded-3xl bg-slate-950 border border-indigo-900/30 text-white min-h-[140px]"
        />
        <button onClick={() => handleStudy()} disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black mt-4 hover:bg-indigo-500 transition-all shadow-xl">
           Analyze Case
        </button>
      </div>

      {response && !loading && (
        <div className="bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-indigo-500/10 animate-slideUp">
           <div className="flex space-x-3 mb-10">
              <button onClick={handleSpeak} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-xl' : 'bg-slate-800 text-amber-500 border border-amber-500/20'}`}>
                 <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                 <span>{isSpeaking ? 'सुनना बंद करें' : 'सुनें (Listen)'}</span>
              </button>
              <button onClick={() => { navigator.clipboard.writeText(response); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                 <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                 <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
              </button>
           </div>
           <div className="prose prose-invert prose-indigo max-w-none text-slate-200 text-lg leading-relaxed">
              <ReactMarkdown>{response}</ReactMarkdown>
           </div>
           <div className="mt-12 pt-8 border-t border-white/5 flex items-center space-x-4">
              <span className="text-[10px] font-black text-slate-500 uppercase">प्रोफाइलिंग मददगार थी?</span>
              <button onClick={() => { triggerPointFeedback(10); setFeedbackSent(true); }} disabled={feedbackSent} className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 flex items-center justify-center transition-all"><i className="fas fa-check"></i></button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CriminologySection;
