import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { translations } from '../utils/translations';

// 🛠️ Audio Encoding & Decoding Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  feedback?: 'positive' | 'negative' | null;
}

interface SanskritiHubProps {
  language: string;
  onEarnPoints: (amount: number) => void;
}

const VoiceAssistant: React.FC<SanskritiHubProps> = ({ language, onEarnPoints }) => {
  const t = translations[language] || translations['English'];
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState(t.standby);
  const [loading, setLoading] = useState(false);

  const nextStartTime = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const startVoiceSession = async () => {
    setStatus('Initializing...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus(t.listening);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(session => session.sendRealtimeInput({ 
                media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              setStatus(t.speaking);
              const ctx = audioContextRef.current;
              nextStartTime.current = Math.max(nextStartTime.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus(t.listening);
              };
              source.start(nextStartTime.current);
              nextStartTime.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (msg.serverContent?.turnComplete) {
              // Add a default text placeholder for voice turns to history so feedback can be given
              setMessages(prev => [...prev, { role: 'model', text: "(Voice interaction complete)", feedback: null }]);
              onEarnPoints(15);
            }
          },
          onerror: () => setStatus('Error'),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are 'Sanskriti'. Respond in ${language}. Use 'Pehle vs Aaj' framework. Be calm, respectful, and empowering. Use feminine Hindi grammar if ${language} is Hindi. No legal advice. No politics. Use tools for citations.`,
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setStatus('No Mic Access');
    }
  };

  const handleSendText = async () => {
    if (!inputText.trim() || loading) return;
    const userText = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);
    try {
      const response = await geminiService.askUniversalAI(userText, { language, country: 'India' });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "I am reflecting on your question...", feedback: null }]);
      onEarnPoints(10);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection to Sanskriti failed.", feedback: null }]);
    } finally {
      setLoading(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setStatus(t.standby);
  };

  const triggerPointsAnimation = (x: number, y: number) => {
    const div = document.createElement('div');
    div.className = 'point-float';
    div.innerText = '+5';
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  };

  const handleFeedback = (index: number, type: 'positive' | 'negative', e: React.MouseEvent) => {
    if (messages[index].feedback) return; // Prevent double feedback
    
    const newMessages = [...messages];
    newMessages[index].feedback = type;
    setMessages(newMessages);

    if (type === 'positive') {
      onEarnPoints(5);
      triggerPointsAnimation(e.clientX, e.clientY);
    }
  };

  return (
    <div className="h-[85vh] flex flex-col lg:flex-row gap-10 animate-fadeIn">
      {/* Visual Hub & Sanskriti Portrait */}
      <div className="lg:w-1/3 space-y-8">
        <div className="bg-slate-900 rounded-[3rem] p-10 border border-amber-500/20 shadow-3xl text-center relative overflow-hidden group">
           <div className={`absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
           
           <div className={`w-48 h-48 rounded-full bg-slate-950 border-4 mx-auto mb-8 flex items-center justify-center relative transition-all duration-1000 ${isActive ? 'border-amber-500 shadow-[0_0_60px_rgba(251,191,36,0.3)]' : 'border-white/5 grayscale'}`}>
              <div className={`absolute inset-4 border border-dashed rounded-full transition-all duration-[3000ms] ${isActive ? 'border-amber-500/40 animate-spin-slow' : 'border-white/5'}`}></div>
              <i className={`fas ${isActive ? 'fa-waveform-lines text-amber-500 scale-125' : 'fa-microphone-slash text-slate-800'} text-7xl transition-all`}></i>
           </div>

           <div className="space-y-4 relative z-10">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter royal-serif">नमस्ते, मैं <span className="text-amber-500">संस्कृति</span> हूँ</h3>
              <p className="text-slate-500 text-sm font-medium italic leading-relaxed">
                "मैं इतिहास (पहले) और संविधान (आज) के बीच का सेतु हूँ। मैं {language} में बात कर सकती हूँ।"
              </p>
              <div className="bg-slate-950/50 py-2 px-4 rounded-xl inline-block border border-white/5">
                 <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-amber-500 animate-pulse' : 'text-slate-600'}`}>
                   {t.status}: {status}
                 </span>
              </div>
           </div>

           <div className="mt-10 pt-10 border-t border-white/5">
              <button 
                onClick={isActive ? stopSession : startVoiceSession}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl flex items-center justify-center gap-4 ${isActive ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95'}`}
              >
                 <i className={`fas ${isActive ? 'fa-stop-circle' : 'fa-play-circle'} text-xl`}></i>
                 <span>{isActive ? 'Stop Voice' : 'Start Voice Mode'}</span>
              </button>
           </div>
        </div>

        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 italic text-slate-400 text-xs leading-relaxed text-center">
           "Sanskriti handles Indian and Global citizen queries with a constitutional focus. She remains strictly apolitical."
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative">
         <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 dark-scroll">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 grayscale">
                 <i className="fas fa-bridge text-6xl"></i>
                 <p className="max-w-xs font-bold uppercase tracking-widest text-xs leading-loose">
                    Ask me about History (पहले) or Constitutional Rights (आज).<br />
                    (Type below or use Voice mode)
                 </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
                 <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-950/80 border border-amber-500/10 text-slate-200 rounded-tl-none'}`}>
                    <div className="prose prose-invert prose-sm max-w-none text-lg">
                       <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                    {m.role === 'model' && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                         {m.feedback ? (
                           <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest italic">{t.common.feedbackThanks}</span>
                         ) : (
                           <>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.common.feedbackPrompt}</span>
                             <div className="flex gap-2">
                                <button 
                                  onClick={(e) => handleFeedback(i, 'positive', e)}
                                  className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
                                >
                                   <i className="fas fa-thumbs-up text-xs"></i>
                                </button>
                                <button 
                                  onClick={(e) => handleFeedback(i, 'negative', e)}
                                  className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-500/30 transition-all"
                                >
                                   <i className="fas fa-thumbs-down text-xs"></i>
                                </button>
                             </div>
                           </>
                         )}
                      </div>
                    )}
                 </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-slate-950/50 p-5 rounded-2xl flex items-center space-x-3 border border-white/5">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
              </div>
            )}
         </div>

         <div className="p-8 bg-slate-950/50 border-t border-white/5">
            <div className="relative">
               <input 
                 type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                 placeholder={t.searchPlaceholder}
                 className="w-full bg-slate-900 border border-white/10 rounded-[2rem] py-6 pl-10 pr-24 text-white placeholder:text-slate-700 focus:border-amber-500/50 outline-none transition-all shadow-inner text-lg font-medium"
               />
               <button 
                 onClick={handleSendText}
                 disabled={loading || !inputText.trim()}
                 className="absolute right-4 top-4 bottom-4 w-16 bg-amber-500 text-slate-950 rounded-[1.2rem] flex items-center justify-center hover:bg-amber-400 transition-all shadow-xl active:scale-90 disabled:opacity-30"
               >
                  <i className="fas fa-arrow-up text-xl"></i>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;