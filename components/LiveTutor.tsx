
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

// Audio Helpers as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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

const LiveTutor: React.FC<{ onEarnPoints: () => void }> = ({ onEarnPoints }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const nextStartTime = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    // Initialize GoogleGenAI right before the API call as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          setIsActive(true);
          const source = inputContext.createMediaStreamSource(stream);
          const scriptProcessor = inputContext.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const pcmBlob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };
            // Always initiate sendRealtimeInput after the live session connection promise resolves.
            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputContext.destination);
        },
        onmessage: async (msg) => {
          const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && audioContextRef.current) {
            const ctx = audioContextRef.current;
            nextStartTime.current = Math.max(nextStartTime.current, ctx.currentTime);
            const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(nextStartTime.current);
            nextStartTime.current += buffer.duration;
            sourcesRef.current.add(source);
          }

          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTime.current = 0;
          }
        },
        onclose: () => setIsActive(false),
        onerror: () => setIsActive(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: "You are a friendly Hindi history and law tutor named 'Gyan Guru'. Respond warmly in Hindi.",
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    onEarnPoints();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 h-full min-h-[500px]">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">लाइव ट्यूटर (Live Voice AI)</h2>
        <p className="text-slate-500">बातचीत करके इतिहास और कानून सीखें।</p>
      </div>

      <div className={`relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-indigo-100' : 'bg-slate-100'}`}>
        {isActive && (
          <div className="absolute inset-0 border-4 border-indigo-400 rounded-full animate-ping opacity-25"></div>
        )}
        <div className={`w-48 h-48 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${isActive ? 'bg-indigo-600 scale-110' : 'bg-white'}`}>
          <i className={`fas ${isActive ? 'fa-microphone-lines text-white' : 'fa-microphone text-slate-400'} text-6xl`}></i>
        </div>
      </div>

      <button
        onClick={isActive ? stopSession : startSession}
        className={`px-12 py-5 rounded-full font-bold text-lg shadow-xl transition-all flex items-center space-x-3 ${
          isActive 
          ? 'bg-rose-500 text-white hover:bg-rose-600' 
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        <i className={`fas ${isActive ? 'fa-stop' : 'fa-play'}`}></i>
        <span>{isActive ? 'सत्र समाप्त करें' : 'सीखना शुरू करें'}</span>
      </button>

      {isActive && (
        <div className="bg-indigo-50 border border-indigo-100 px-6 py-3 rounded-2xl animate-pulse">
           <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">लाइव बातचीत जारी है...</span>
        </div>
      )}
    </div>
  );
};

export default LiveTutor;
