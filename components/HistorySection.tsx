
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'https://esm.sh/react-markdown';
import { LocalContext } from '../types';

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

interface HistorySectionProps {
  onUpdatePoints: (amount: number) => void;
  onSearch?: (query: string) => void;
  context: LocalContext;
}

const HistorySection: React.FC<HistorySectionProps> = ({ onUpdatePoints, onSearch, context }) => {
  const [query, setQuery] = useState('');
  const [isEraCompareMode, setIsEraCompareMode] = useState(true); // Default to True
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
  const recognitionSessionRef = useRef<any>(null);

  const handleAsk = async (mode: 'deep' | 'news') => {
    if (!query) return;
    setLoading(true);
    setResponse('');
    setPointsAwarded(null);
    if (onSearch) onSearch(query);

    try {
      let result;
      let points = 0;
      if (isEraCompareMode) {
        result = await geminiService.askEraComparison(query, context);
        points = 60; // Rewarding Era Comparison even more
      } else if (mode === 'news') {
        result = await geminiService.searchCurrentEvents(query, context);
        points = 25;
      } else {
        result = await geminiService.askComplexQuestion(query, context);
        points = 30;
      }
      setResponse(result.text || "इतिहास का पन्ना अभी खाली है।");
      onUpdatePoints(points);
      setPointsAwarded(points);
      setTimeout(() => setPointsAwarded(null), 3000);
    } catch (error: any) {
      setResponse(error?.message === 'SYSTEM_BUSY' 
        ? "AI सिस्टम फिलहाल व्यस्त है। कृपया 1 मिनट बाद दोबारा प्रयास करें।" 
        : "ज्ञान के सेतु में बाधा आई है।");
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = async () => {
    if (isListening) {
      if (recognitionSessionRef.current) recognitionSessionRef.current.close();
      setIsListening(false);
      return;
    }
    setIsListening(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputContext.createMediaStreamSource(stream);
            const scriptProcessor = inputContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = { data: encode(new Uint8Array(new Int16Array(inputData.map(v => v * 32768)).buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContext.destination);
          },
          onmessage: (msg) => {
            if (msg.serverContent?.inputTranscription) {
              setQuery(prev => (prev.trim() + ' ' + msg.serverContent.inputTranscription.text).trim());
            }
          },
          onclose: () => setIsListening(false),
          onerror: () => setIsListening(false),
        },
        config: { responseModalities: [Modality.AUDIO], inputAudioTranscription: {} }
      });
      recognitionSessionRef.current = await sessionPromise;
    } catch (err) { setIsListening(false); }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24 relative">
      {pointsAwarded && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 px-8 py-3 rounded-2xl font-black shadow-2xl animate-bounce flex items-center space-x-3">
          <i className="fas fa-history"></i>
          <span>+{pointsAwarded} History Scholar Points!</span>
        </div>
      )}

      <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-amber-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 rotate-12">
          <i className="fas fa-scroll text-[200px] text-amber-500"></i>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-center space-x-6">
             <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl">
                <i className="fas fa-monument text-2xl"></i>
             </div>
             <div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">ग्लोबल इतिहास <span className="text-amber-500">Explorer</span></h3>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">तुलना करें: पहिले और संविधान के बाद</p>
             </div>
          </div>

          <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
             <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isEraCompareMode ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                  <i className="fas fa-clock-rotate-left"></i>
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Pehle vs Aaj (Era Comparison)</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">पहिले की दुनिया और आज का कानून</p>
                </div>
             </div>
             <button 
                onClick={() => setIsEraCompareMode(!isEraCompareMode)}
                className={`w-16 h-8 rounded-full transition-all relative ${isEraCompareMode ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${isEraCompareMode ? 'right-1.5' : 'left-1.5'}`}></div>
              </button>
          </div>

          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isEraCompareMode ? "किसी विषय का नाम लिखें (उदा: न्याय, शिक्षा, व्यापार, कृषि)..." : "इतिहास का कोई भी सवाल पूछें..."}
              className="w-full bg-slate-950/80 border border-amber-900/20 rounded-[2rem] p-10 text-white text-xl placeholder:text-slate-700 outline-none focus:ring-4 focus:ring-amber-500/10 transition-all min-h-[180px]"
            />
            <button 
              onClick={toggleVoiceInput}
              className={`absolute top-10 right-10 w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-amber-500 hover:bg-slate-750'}`}
            >
              <i className={`fas ${isListening ? 'fa-microphone-lines' : 'fa-microphone'} text-2xl`}></i>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
             <button
              onClick={() => handleAsk('deep')}
              disabled={loading || !query}
              className="flex-1 bg-amber-500 text-slate-950 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-amber-400 shadow-xl flex items-center justify-center space-x-4 border-b-4 border-amber-700 active:translate-y-1 transition-all"
             >
                <i className="fas fa-brain text-xl"></i>
                <span>{isEraCompareMode ? 'तुलना देखें (Analyze)' : 'गहरा इतिहास (Pehle)'}</span>
             </button>
             <button
              onClick={() => handleAsk('news')}
              disabled={loading || !query}
              className="flex-1 bg-slate-800 text-amber-500 border border-amber-500/20 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-750 flex items-center justify-center space-x-4 border-b-4 border-slate-900 active:translate-y-1 transition-all"
             >
                <i className="fas fa-earth-asia text-xl"></i>
                <span>आज क्या चल रहा है? (Live)</span>
             </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fadeIn">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-amber-500 font-black uppercase tracking-[0.4em] animate-pulse text-xs">इतिहास की कड़ियों को जोड़ा जा रहा है...</p>
        </div>
      )}

      {response && !loading && (
        <div className="bg-slate-900 rounded-[4rem] p-12 shadow-2xl border border-amber-500/10 animate-slideUp relative overflow-hidden history-content">
           <div className="prose prose-invert prose-amber max-w-none text-slate-200 text-xl leading-relaxed mb-6 font-medium">
              <ReactMarkdown>{response}</ReactMarkdown>
           </div>
           <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              <span>Verified Global Knowledge • Points Gained: +{isEraCompareMode ? 60 : 30}</span>
              <button onClick={() => window.print()} className="hover:text-amber-500 transition-colors"><i className="fas fa-print mr-2"></i>Export Report</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default HistorySection;
