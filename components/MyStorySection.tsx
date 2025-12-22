
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'https://esm.sh/react-markdown';
import { LocalContext } from '../types';

// Audio Helpers
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

const MyStorySection: React.FC<{ context: LocalContext; onEarnPoints: () => void }> = ({ context, onEarnPoints }) => {
  const [notes, setNotes] = useState('');
  const [biography, setBiography] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const recognitionSessionRef = useRef<any>(null);

  const toggleVoiceInput = async () => {
    if (isListening) {
      if (recognitionSessionRef.current) {
        recognitionSessionRef.current.close();
        recognitionSessionRef.current = null;
      }
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
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContext.destination);
          },
          onmessage: (msg) => {
            if (msg.serverContent?.inputTranscription) {
              const text = msg.serverContent.inputTranscription.text;
              setNotes(prev => (prev.trim() + ' ' + text).trim());
            }
          },
          onclose: () => setIsListening(false),
          onerror: () => setIsListening(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: "You are a professional memoir transcriptionist. Accurately capture user stories and memories in Hindi.",
        }
      });
      recognitionSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Voice input failed", err);
      setIsListening(false);
    }
  };

  const handleCreateBiography = async (style: 'standard' | 'fast' = 'standard') => {
    if (!notes) return;
    setLoading(true);
    setBiography('');
    try {
      const promptSuffix = style === 'fast' 
        ? ". Note: Focus on speed and concise impactful chapters. Transform these brief points into a professional, fast-paced autobiography summary." 
        : ". Note: Write a detailed, literary-style historical autobiography.";
      const result = await geminiService.generatePersonalHistory(notes + promptSuffix, context);
      setBiography(result.text || "");
      onEarnPoints();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stopSpeaking = () => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch (e) {}
    }
    setIsSpeaking(false);
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    if (!biography) return;
    setIsSpeaking(true);

    try {
      // Use Zephyr for a clear narration voice
      const buffer = await geminiService.speak(biography, 'Zephyr');
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(new Uint8Array(buffer), ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      sourceRef.current = source;
      source.start(0);
    } catch (error) {
      console.error("Speech failed", error);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-amber-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none rotate-12">
          <i className="fas fa-feather-pointed text-[150px] text-amber-500"></i>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-center space-x-5">
            <div className="bg-amber-500 p-5 rounded-2xl text-slate-950 shadow-lg">
              <i className="fas fa-book-bookmark text-2xl"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">मेरी कहानी (My Story)</h2>
              <p className="text-amber-500/60 font-bold text-xs uppercase tracking-widest mt-1">
                AI की मदद से अपना डिजिटल इतिहास लिखें
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="अपने जीवन की मुख्य घटनाएं, यादें या अनुभव यहाँ लिखें या बोलें... (जैसे: जन्म, स्कूल के दिन, आपकी मेहनत, सफलता)"
                className="w-full bg-slate-950/80 border border-amber-900/20 rounded-[2rem] p-8 text-white text-lg placeholder:text-slate-600 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all min-h-[220px] font-medium leading-relaxed"
              />
              <button 
                onClick={toggleVoiceInput}
                className={`absolute top-8 right-8 w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-slate-800 text-amber-500 hover:bg-slate-750'}`}
                title="बोलकर यादें दर्ज करें"
              >
                <i className={`fas ${isListening ? 'fa-microphone-lines text-xl' : 'fa-microphone text-xl'}`}></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleCreateBiography('standard')}
                disabled={loading || !notes}
                className="bg-amber-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-amber-400 disabled:opacity-30 transition-all shadow-xl flex items-center justify-center space-x-3"
              >
                <i className="fas fa-wand-magic-sparkles text-xl"></i>
                <span>विस्तृत इतिहास (Full Story)</span>
              </button>
              <button
                onClick={() => handleCreateBiography('fast')}
                disabled={loading || !notes}
                className="bg-slate-800 text-amber-400 border border-amber-500/30 py-5 rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-slate-750 disabled:opacity-30 transition-all shadow-xl flex items-center justify-center space-x-3"
              >
                <i className="fas fa-bolt-lightning text-xl"></i>
                <span>तेज़ लिखें (Fast Write)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
          <div className="book"><div className="page"></div></div>
          <p className="text-amber-500 font-black text-lg uppercase tracking-[0.3em] mt-6 animate-pulse">आपकी यादों को संजोया जा रहा है...</p>
          <p className="text-slate-500 text-sm mt-2">AI आपकी कहानी का इतिहास रच रहा है</p>
        </div>
      )}

      {biography && !loading && (
        <div className="bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-amber-500/10 animate-slideUp relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
            <i className="fas fa-scroll text-[250px] text-amber-500"></i>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-white/5 pb-10 relative z-10">
            <div className="flex items-center space-x-4">
              <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">आपका जीवन वृत्तांत (Your Autobiography)</h3>
            </div>
            <button 
              onClick={handleSpeak}
              className={`flex items-center space-x-4 px-8 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-xl scale-105 animate-pulse' : 'bg-slate-800 text-amber-500 hover:bg-slate-750 border border-amber-500/20'}`}
            >
              <i className={`fas ${isSpeaking ? 'fa-stop-circle text-xl' : 'fa-play-circle text-xl'}`}></i>
              <span>{isSpeaking ? 'सुनना बंद करें' : 'कहानी सुनें (Listen)'}</span>
            </button>
          </div>

          <div className="prose prose-invert prose-amber max-w-none text-slate-200 text-xl leading-relaxed font-serif italic relative z-10 mb-12 px-4 md:px-10 border-l-2 border-amber-500/20">
             <ReactMarkdown>{biography}</ReactMarkdown>
          </div>

          <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-10 relative z-10 gap-6">
            <div className="flex items-center space-x-3 bg-amber-500/5 px-6 py-3 rounded-2xl border border-amber-500/10">
              <i className="fas fa-shield-heart text-amber-500"></i>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Digital History Archive V1.0</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(biography);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'text-amber-500/50 hover:text-amber-500 border-amber-500/10 hover:border-amber-500/30 bg-slate-800/50'}`}
              >
                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
              </button>
              <button 
                onClick={() => window.print()}
                className="text-amber-500/50 hover:text-amber-500 bg-slate-800/50 border border-amber-500/10 hover:border-amber-500/30 px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center transition-all shadow-lg"
              >
                <i className="fas fa-print mr-2"></i>
                प्रिंट करें (Print/PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStorySection;
