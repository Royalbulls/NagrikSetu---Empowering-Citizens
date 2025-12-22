
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'https://esm.sh/react-markdown';
import { AppSection, LocalContext } from '../types';

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

interface LawSectionProps {
  onEarnPoints: (amount: number) => void;
  onSearch?: (query: string) => void;
  section: AppSection;
  context: LocalContext;
}

const LawSection: React.FC<LawSectionProps> = ({ onEarnPoints, onSearch, section, context }) => {
  const [query, setQuery] = useState('');
  const [isLanguageMode, setIsLanguageMode] = useState(false);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
  const sessionRef = useRef<any>(null);

  const handleConsult = async () => {
    if (!query) return;
    setLoading(true);
    setResponse('');
    setPointsAwarded(null);
    if (onSearch) onSearch(query);

    try {
      let result;
      let points = 0;
      if (isLanguageMode) {
        result = await geminiService.askLinguisticRights(query, context);
        points = 45; // High reward for linguistic law study
      } else {
        const legalInstruction = `As a legal advisor for ${context.country}: ${query}. Highlight articles in **Double Asterisks**. Answer in ${context.language}.`;
        result = await geminiService.getLocalInfo(legalInstruction, undefined, context);
        points = 30;
      }
      setResponse(result.text || "इस विषय पर परामर्श उपलब्ध नहीं है।");
      onEarnPoints(points);
      setPointsAwarded(points);
      setTimeout(() => setPointsAwarded(null), 3000);
    } catch (error: any) {
      setResponse(error?.message === 'SYSTEM_BUSY' 
        ? "AI सिस्टम फिलहाल व्यस्त है। कृपया 2 मिनट रुककर दोबारा प्रयास करें।" 
        : "सर्च करने में बाधा आई है।");
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = async () => {
    if (isListening) {
      if (sessionRef.current) sessionRef.current.close();
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
      sessionRef.current = await sessionPromise;
    } catch (err) { setIsListening(false); }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-24 relative">
      {pointsAwarded && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-blue-500 text-white px-8 py-3 rounded-2xl font-black shadow-2xl animate-bounce flex items-center space-x-3">
          <i className="fas fa-shield-halved"></i>
          <span>+{pointsAwarded} Legal Scholar Points!</span>
        </div>
      )}

      <div className="bg-slate-900 rounded-[3rem] p-12 border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-shield-halved text-[200px] text-blue-500"></i>
        </div>

        <div className="relative z-10 space-y-10">
           <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-slate-950 shadow-2xl">
                 <i className="fas fa-landmark text-3xl"></i>
              </div>
              <div>
                 <h3 className="text-4xl font-black text-white uppercase tracking-tighter">
                   {isLanguageMode ? 'भाषा का कानून' : 'वैश्विक कानूनी कवच'}
                 </h3>
                 <p className="text-blue-400/60 font-black text-[10px] uppercase tracking-widest mt-1">
                   {isLanguageMode ? 'Constitutional Linguistic Rights (Arts 343-351)' : 'Global Law & Constitutional Access'}
                 </p>
              </div>
           </div>

           <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLanguageMode ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-800 text-slate-500'}`}>
                  <i className="fas fa-language text-xl"></i>
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Linguistic Mode (भाषाई अधिकार)</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">संविधान और आपकी भाषा का अधिकार</p>
                </div>
              </div>
              <button 
                onClick={() => setIsLanguageMode(!isLanguageMode)}
                className={`w-16 h-8 rounded-full transition-all relative ${isLanguageMode ? 'bg-indigo-600 shadow-xl' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${isLanguageMode ? 'right-1.5' : 'left-1.5'}`}></div>
              </button>
           </div>

           <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isLanguageMode ? "अपनी भाषा के अधिकारों के बारे में पूछें (उदा: अदालतों में क्षेत्रीय भाषा का उपयोग)..." : "कानूनी या संवैधानिक समस्या लिखें..."}
                className="w-full bg-slate-950/80 border border-blue-900/30 rounded-[2.5rem] p-10 text-white text-xl placeholder:text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[180px]"
              />
              <button onClick={toggleVoiceInput} className={`absolute top-10 right-10 w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-blue-500 hover:bg-slate-750'}`}>
                 <i className={`fas ${isListening ? 'fa-microphone-lines' : 'fa-microphone'} text-2xl`}></i>
              </button>
           </div>
           
           <button onClick={handleConsult} disabled={loading || !query} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-lg hover:bg-blue-500 transition-all flex items-center justify-center space-x-4 shadow-xl border-b-4 border-blue-800 active:translate-y-1">
              <i className="fas fa-scale-balanced text-xl"></i>
              <span>{isLanguageMode ? 'भाषाई अधिकार जानें' : 'परामर्श लें (Get Counsel)'}</span>
           </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs">न्याय के सेतु सक्रिय हो रहे हैं...</p>
        </div>
      )}

      {response && !loading && (
        <div className="bg-slate-900 rounded-[4rem] p-12 shadow-3xl border border-blue-500/10 animate-slideUp relative overflow-hidden group legal-content">
           <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-xl leading-relaxed mb-6 font-medium">
              <ReactMarkdown>{response}</ReactMarkdown>
           </div>
           <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              <span>Legal Shield V1.0 • Points Gained: +{isLanguageMode ? 45 : 30}</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default LawSection;
