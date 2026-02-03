
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { LocalContext } from '../types';

// Audio Helpers
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

const OmiLink: React.FC<{ context: LocalContext; onEarnPoints: (v: number) => void }> = ({ context, onEarnPoints }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('OFFLINE');
  const [transcript, setTranscript] = useState<{text: string, type: 'user' | 'ai'}[]>([]);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  
  const APP_ID = "01KGFPDXQKX007MF9PHBQZD6PA";
  const OMI_STORE_LINK = `https://h.omi.me/apps/${APP_ID}`;
  const OMI_PURCHASE_LINK = "https://www.omi.me/?ref=Mr.kilvish";

  const nextStartTime = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  const startOmiSession = async () => {
    setStatus('SYNCING...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('LISTENING');
            const source = inputContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(session => session.sendRealtimeInput({ 
                media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContextRef.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              setStatus('SPEAKING');
              const ctx = audioContextRef.current;
              nextStartTime.current = Math.max(nextStartTime.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.onended = () => setStatus('LISTENING');
              source.start(nextStartTime.current);
              nextStartTime.current += buffer.duration;
            }

            if (msg.serverContent?.inputTranscription) {
              const text = msg.serverContent.inputTranscription.text;
              setTranscript(prev => [{text, type: 'user'}, ...prev].slice(0, 5));
              const lowerText = text.toLowerCase();
              if (lowerText.includes('police') || lowerText.includes('law') || lowerText.includes('कानून') || lowerText.includes('पुलिस')) {
                setDetectedKeywords(prev => Array.from(new Set([...prev, "CIVIC_PROTECTION_ACTIVE"])));
              }
            }

            if (msg.serverContent?.turnComplete) onEarnPoints(25);
          },
          onclose: () => { setIsActive(false); setStatus('OFFLINE'); },
          onerror: () => setStatus('ERROR'),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: "You are 'NagrikSetu on Omi'. You act as an always-ready wearable companion. Speak shortly and concisely in " + context.language + ". Use the Pehle vs Aaj framework. If you detect a situation involving law or history, offer a quick 1-sentence tip. Use feminine grammar for Hindi.",
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setStatus('DENIED');
    }
  };

  const stopOmi = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
  };

  return (
    <div className="relative group">
       {/* 🟡 The Official OMI Orb - Refined Branding */}
       <div className="flex flex-col items-center space-y-8 py-12">
          <button 
            onClick={isActive ? stopOmi : startOmiSession}
            className={`relative w-64 h-64 rounded-full transition-all duration-1000 flex items-center justify-center ${isActive ? 'bg-amber-500 shadow-[0_0_120px_rgba(245,158,11,0.6)] scale-110' : 'bg-slate-900 border-4 border-white/5 grayscale hover:grayscale-0 hover:border-amber-500/20'}`}
          >
             <div className={`absolute inset-4 border-2 border-dashed rounded-full ${isActive ? 'border-slate-950/40 animate-spin-slow' : 'border-white/10'}`}></div>
             <div className="flex flex-col items-center space-y-2 relative z-10">
                <i className={`fas ${isActive ? 'fa-waveform-lines text-slate-950' : 'fa-microphone text-amber-500'} text-7xl`}></i>
             </div>
             
             {isActive && (
               <div className="absolute -top-6 bg-slate-950 text-emerald-400 px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-emerald-500/30 animate-pulse shadow-2xl">
                 Protective Node Active
               </div>
             )}
          </button>

          <div className="text-center space-y-6 w-full max-w-lg mx-auto">
             <div className="space-y-2">
                <h3 className="text-4xl font-black text-white uppercase italic tracking-widest royal-serif">NagrikSetu <span className="text-amber-500 font-sans">on Omi</span></h3>
                <p className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.5em] italic animate-pulse">Your Sovereign Wearable Shield</p>
             </div>
             
             <div className="flex flex-wrap justify-center gap-4 mt-6">
                <a 
                  href={OMI_STORE_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 bg-slate-950 border border-amber-500/30 text-amber-500 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all shadow-2xl group"
                >
                   <i className="fas fa-external-link-alt group-hover:rotate-12 transition-transform"></i>
                   <span>Omi App Store</span>
                </a>
                <a 
                  href={OMI_PURCHASE_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-3xl shadow-emerald-500/30 border-b-4 border-emerald-800 active:translate-y-1"
                >
                   <i className="fas fa-shopping-cart"></i>
                   <span>Purchase Omi Device</span>
                </a>
             </div>
          </div>
       </div>

       {/* 📟 Intelligence HUD - Human Centric Labels */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl group hover:border-amber-500/20 transition-all">
             <div className="flex items-center justify-between">
                <h4 className="text-amber-500 font-black text-[11px] uppercase tracking-widest flex items-center gap-4">
                   <i className="fas fa-comment-dots text-xl"></i> संवाद स्मृति (Memory)
                </h4>
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping opacity-30"></span>
             </div>
             <div className="space-y-4 h-56 overflow-y-auto no-scrollbar pr-4">
                {transcript.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                    <i className="fas fa-ear-listen text-4xl mb-4"></i>
                    <p className="text-xs font-bold uppercase tracking-widest italic text-center">Awaiting capture...</p>
                  </div>
                ) : transcript.map((t, i) => (
                  <div key={i} className={`p-5 rounded-[1.8rem] text-sm font-medium border animate-slideUp ${t.type === 'user' ? 'bg-slate-950 border-white/5 text-slate-400' : 'bg-amber-500/10 border-amber-500/20 text-white'}`}>
                    <p className="text-[8px] font-black uppercase tracking-widest mb-2 opacity-40">{t.type === 'user' ? 'Citizen' : 'Sanskriti'}</p>
                    {t.text}
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl group hover:border-emerald-500/20 transition-all">
             <div className="flex items-center justify-between">
                <h4 className="text-emerald-500 font-black text-[11px] uppercase tracking-widest flex items-center gap-4">
                   <i className="fas fa-shield-halved text-xl"></i> सुरक्षा अलर्ट (Alerts)
                </h4>
                <div className="flex gap-1">
                   {[1,2,3].map(i => <div key={i} className="w-1.5 h-4 bg-slate-800 rounded-full group-hover:bg-emerald-500/40 transition-colors"></div>)}
                </div>
             </div>
             <div className="flex flex-wrap gap-3">
                {detectedKeywords.map((k, i) => (
                  <div key={i} className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter shadow-xl animate-slideUp flex items-center gap-2">
                    <i className="fas fa-check-circle"></i>
                    {k.replace(/_/g, ' ')}
                  </div>
                ))}
                {detectedKeywords.length === 0 && (
                  <div className="w-full py-12 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-loose">संवैधानिक सुरक्षा कवच सक्रिय है।<br/>No threats detected.</p>
                  </div>
                )}
             </div>
             <div className="pt-8 border-t border-white/5">
                <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic text-center">
                  "NagrikSetu analyzes environmental audio via Omi to ensure your legal protection in real-time."
                </p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default OmiLink;
