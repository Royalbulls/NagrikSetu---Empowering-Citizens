
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

interface LawSectionProps {
  onEarnPoints: (amount: number) => void;
  onSearch?: (query: string) => void;
  section: AppSection;
  context: LocalContext;
  onDraftApplication?: (subject: string, details: string) => void;
}

const LawSection: React.FC<LawSectionProps> = ({ onEarnPoints, onSearch, section, context, onDraftApplication }) => {
  const [query, setQuery] = useState('');
  const [isLanguageMode, setIsLanguageMode] = useState(false);
  const [response, setResponse] = useState('');
  const [analogyResponse, setAnalogyResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [analogyLoading, setAnalogyLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const sessionRef = useRef<any>(null);

  const triggerPointsAnimation = (amount: number) => {
    const div = document.createElement('div');
    div.className = 'point-float';
    div.innerText = `+${amount}`;
    div.style.left = `${window.innerWidth / 2}px`;
    div.style.top = `${window.innerHeight / 2}px`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  };

  const handleConsult = async () => {
    if (!query) return;
    setLoading(true);
    setResponse('');
    setAnalogyResponse('');
    setPointsAwarded(null);
    setFeedbackSent(false);
    if (onSearch) onSearch(query);

    try {
      let result;
      let points = 0;
      const userCity = context.city || 'India';
      const userCountry = context.country || 'India';
      const locationContext = `USER LOCATION: ${userCity}, ${userCountry}.`;
      
      if (isLanguageMode) {
        const languagePrompt = `${locationContext} MISSION: Act as a Senior Constitutional Expert. 
        Analyze linguistic rights for: "${query}". 
        MANDATORY: Focus on Articles 343-351, 29, and 30. 
        If applicable, discuss state-specific language policies for ${userCity}. 
        FORMATTING: Cite specific laws/statutes in **BOLD** and use \`backticks\` for Section/Article numbers. 
        Language: ${context.language}.`;
        
        result = await geminiService.askLinguisticRights(languagePrompt, context);
        points = 70;
      } else {
        const isConstitution = section === AppSection.CONSTITUTION;
        const legalInstruction = `${locationContext} MISSION: Act as a high-ranking Legal AI advisor for ${userCity}, ${userCountry}. 
        Analyze the citizen query: "${query}". 
        SCOPE: ${isConstitution ? 'Constitutional Law & Fundamental Rights' : 'General/Local Law & Civil Rights'}. 
        REQUIREMENT: Provide a deep-dive analysis. If there are local rules or municipal laws relevant to ${userCity}, include them. 
        FORMATTING: Citations of Statutes/Acts must be in **BOLD**. Articles/Sections must be in \`backticks\`. 
        Tone: Professional, empowering, and highly specific to the region. 
        Language: ${context.language}.`;
        
        result = await geminiService.getLocalInfo(legalInstruction, undefined, context);
        points = 50;
      }
      
      setResponse(result.text || "इस विषय पर परामर्श उपलब्ध नहीं है।");
      onEarnPoints(points);
      triggerPointsAnimation(points);
      setPointsAwarded(points);
      setTimeout(() => setPointsAwarded(null), 3000);
    } catch (error: any) {
      setResponse("सर्च करने में बाधा आई है।");
    } finally {
      setLoading(false);
    }
  };

  const handleSimplify = async () => {
    if (!response) return;
    setAnalogyLoading(true);
    try {
      const result = await geminiService.explainWithAnalogy(response, context);
      setAnalogyResponse(result);
      onEarnPoints(20);
      triggerPointsAnimation(20);
    } catch (error) {
      setAnalogyResponse("सरलीकरण में समस्या आई।");
    } finally {
      setAnalogyLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      if (sourceRef.current) sourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = analogyResponse ? `${response}. अब सरल शब्दों में: ${analogyResponse}` : response;
    if (!textToSpeak) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(textToSpeak, 'Kore');
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

  const handleFeedback = (val: boolean) => {
    if (feedbackSent) return;
    setFeedbackSent(true);
    if (val) {
      onEarnPoints(10);
      triggerPointsAnimation(10);
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

  const isConstitution = section === AppSection.CONSTITUTION;

  return (
    <div className="space-y-10 animate-fadeIn pb-24 relative">
      {pointsAwarded && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-blue-500 text-white px-8 py-3 rounded-2xl font-black shadow-2xl animate-bounce flex items-center space-x-3 border-4 border-slate-950">
          <i className="fas fa-shield-halved"></i>
          <span>+{pointsAwarded} Legal Scholar Points!</span>
        </div>
      )}

      <div className="bg-slate-900 rounded-[3rem] p-12 border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-shield-halved text-[200px] text-blue-500"></i>
        </div>

        <div className="relative z-10 space-y-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-slate-950 shadow-2xl">
                   <i className="fas fa-landmark text-3xl"></i>
                </div>
                <div>
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter">
                     {isConstitution ? 'संवैधानिक कवच' : (isLanguageMode ? 'भाषा का कानून' : 'स्थानीय कानूनी कवच')}
                   </h3>
                   <p className="text-blue-400/60 font-black text-[10px] uppercase tracking-widest mt-1">
                     {isConstitution ? 'Fundamental Rights & Articles' : (isLanguageMode ? 'Linguistic Rights (Arts 343-351) • High Reward' : `Grounded in ${context.city || 'Local Regions'}`)}
                   </p>
                </div>
              </div>
           </div>

           {!isConstitution && (
             <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLanguageMode ? 'bg-indigo-600 shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
                    <i className="fas fa-language text-xl"></i>
                  </div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Linguistic Mode (भाषाई अधिकार)</p>
                </div>
                <button onClick={() => setIsLanguageMode(!isLanguageMode)} className={`w-16 h-8 rounded-full transition-all relative ${isLanguageMode ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                  <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${isLanguageMode ? 'right-1.5' : 'left-1.5'}`}></div>
                </button>
             </div>
           )}

           <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isConstitution ? "संवैधानिक धारा या अपने मौलिक अधिकारों के बारे में पूछें..." : (isLanguageMode ? "अपनी भाषा के अधिकारों के बारे में पूछें..." : "कानूनी समस्या लिखें...")}
                className="w-full bg-slate-950/80 border border-blue-900/30 rounded-[2.5rem] p-10 text-white text-xl placeholder:text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[180px]"
              />
              <button onClick={toggleVoiceInput} className={`absolute top-10 right-10 w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-blue-500 hover:bg-slate-750'}`}>
                 <i className={`fas ${isListening ? 'fa-microphone-lines' : 'fa-microphone'} text-2xl`}></i>
              </button>
           </div>
           
           <button onClick={handleConsult} disabled={loading || !query} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-lg hover:bg-blue-500 transition-all shadow-xl">
              <span>{isConstitution ? 'संविधान से पूछें' : (isLanguageMode ? 'भाषाई अधिकार जानें' : 'स्थानीय परामर्श लें')}</span>
           </button>
        </div>
      </div>

      {(loading || analogyLoading) && (
        <div className="flex flex-col items-center justify-center py-20 animate-spin-slow">
           <i className="fas fa-compass text-blue-500 text-6xl"></i>
        </div>
      )}

      {response && !loading && !analogyLoading && (
        <div className="space-y-6 animate-slideUp">
          <div className="bg-slate-900 rounded-[4rem] p-12 shadow-3xl border border-blue-500/10 relative overflow-hidden group legal-content">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 relative z-10">
                <div className="flex flex-wrap gap-3">
                   <button onClick={handleSpeak} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-500 border border-amber-500/20'}`}>
                      <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                      <span>{isSpeaking ? 'सुनना बंद करें' : 'सुनें (Listen)'}</span>
                   </button>
                   
                   <button onClick={handleSimplify} className="flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all">
                      <i className="fas fa-lightbulb"></i>
                      <span>सरल शब्दों में (Analogy)</span>
                   </button>

                   <button onClick={() => { navigator.clipboard.writeText(response); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                      <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                   </button>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => onDraftApplication?.(query, response)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 shadow-lg">आवेदन लिखें</button>
                </div>
             </div>

             <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-xl leading-relaxed mb-12">
                <ReactMarkdown>{response}</ReactMarkdown>
             </div>

             {analogyResponse && (
               <div className="mt-8 bg-emerald-500/5 border-2 border-emerald-500/20 p-8 rounded-[2.5rem] animate-slideUp">
                  <div className="flex items-center space-x-3 mb-4">
                     <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 font-black text-[10px]">
                        <i className="fas fa-child"></i>
                     </div>
                     <h4 className="text-emerald-500 font-black uppercase text-[10px] tracking-widest">सरल उदाहरण (Simplification)</h4>
                  </div>
                  <div className="prose prose-invert prose-emerald text-slate-300 italic font-medium leading-relaxed">
                     <ReactMarkdown>{analogyResponse}</ReactMarkdown>
                  </div>
               </div>
             )}

             <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center space-x-3">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">क्या यह जानकारी मददगार थी?</span>
                   <div className="flex space-x-2">
                      <button onClick={() => handleFeedback(true)} disabled={feedbackSent} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${feedbackSent ? 'opacity-30' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}><i className="fas fa-thumbs-up"></i></button>
                      <button onClick={() => handleFeedback(false)} disabled={feedbackSent} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${feedbackSent ? 'opacity-30' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'}`}><i className="fas fa-thumbs-down"></i></button>
                   </div>
                </div>
                {feedbackSent && <span className="text-[10px] font-black text-emerald-500 uppercase italic">धन्यवाद! आपकी प्रतिक्रिया दर्ज कर ली गई।</span>}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawSection;
