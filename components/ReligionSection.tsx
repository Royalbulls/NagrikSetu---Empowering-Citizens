
import React, { useState, useRef } from 'react';
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

interface ReligionSectionProps {
  onEarnPoints: (amount: number) => void;
  context: LocalContext;
}

const ReligionSection: React.FC<ReligionSectionProps> = ({ onEarnPoints, context }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const recognitionSessionRef = useRef<any>(null);

  const handleAsk = async (forcedQuery?: string) => {
    const finalQuery = forcedQuery || query;
    if (!finalQuery) return;
    
    setLoading(true);
    setResponse('');
    setIsSpeaking(false);
    if (sourceRef.current) sourceRef.current.stop();

    try {
      const result = await geminiService.askReligiousWisdom(finalQuery, context);
      setResponse(result.text || "गुरु का मौन इस विषय पर गहरा है। कृपया दोबारा पूछें।");
      onEarnPoints(30);
    } catch (error) {
      setResponse("विवेक के सेतु में बाधा आई है।");
    } finally {
      setLoading(false);
    }
  };

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
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
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
    } catch (err) {
      setIsListening(false);
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
      const buffer = await geminiService.speak(response, 'Kore');
      if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(new Uint8Array(buffer), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      sourceRef.current = source;
      source.start(0);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const presets = [
    { label: "सनातन धर्म और मानवता", icon: "fa-om" },
    { label: "इस्लाम का शांति संदेश", icon: "fa-moon" },
    { label: "ईसाई धर्म और क्षमा", icon: "fa-cross" },
    { label: "सिख धर्म और सेवा", icon: "fa-khanda" },
    { label: "बौद्ध धर्म और निर्वाण", icon: "fa-dharmachakra" }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-24 relative">
      <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <i className="fas fa-hand-holding-heart text-[180px] text-indigo-500"></i>
        </div>

        <div className="relative z-10 space-y-10">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
              <i className="fas fa-universal-access text-3xl"></i>
            </div>
            <div>
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase">सर्व धर्म संगम <span className="text-indigo-400">Wisdom Lab</span></h3>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">वसुधैव कुटुंबकम — एक विश्व, अनेक मार्ग</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => { setQuery(p.label); handleAsk(p.label); }}
                className="bg-slate-800/50 hover:bg-indigo-600 hover:text-white border border-indigo-500/10 px-4 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center space-x-2"
              >
                <i className={`fas ${p.icon}`}></i>
                <span>{p.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="किसी भी धर्म के बारे में पूछें, या दो रास्तों की तुलना करें..."
              className="w-full bg-slate-950/80 border border-indigo-900/20 rounded-[2.5rem] p-10 text-white text-xl placeholder:text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[180px]"
            />
            <button 
              onClick={toggleVoiceInput}
              className={`absolute top-10 right-10 w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-indigo-500 hover:bg-slate-750'}`}
            >
              <i className={`fas ${isListening ? 'fa-microphone-lines' : 'fa-microphone'} text-2xl`}></i>
            </button>
          </div>

          <button
            onClick={() => handleAsk()}
            disabled={loading || !query}
            className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-lg hover:bg-indigo-500 shadow-2xl shadow-indigo-600/20 flex items-center justify-center space-x-4 disabled:opacity-30"
          >
            <i className="fas fa-heart text-xl"></i>
            <span>दर्शन और समझ प्राप्त करें (Seek Wisdom)</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-400 font-black uppercase tracking-[0.4em]">सार्वभौमिक सत्य की खोज...</p>
        </div>
      )}

      {response && !loading && (
        <div className="bg-slate-900 rounded-[4rem] p-12 shadow-3xl border border-indigo-500/10 animate-slideUp relative overflow-hidden group">
           <div className="absolute top-0 left-0 p-12 opacity-[0.03] pointer-events-none scale-150">
              <i className="fas fa-dove text-[300px] text-white"></i>
           </div>

           <div className="relative z-10 flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-12">
              <div className="flex-shrink-0 flex flex-col items-center">
                 <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                    <i className="fas fa-hands-praying text-white text-2xl"></i>
                 </div>
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-4">Gyan Guru</p>
              </div>

              <div className="flex-1 min-w-0">
                 <div className="flex justify-end mb-10 space-x-4">
                    <button 
                      onClick={handleSpeak}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-indigo-500 text-slate-950 animate-bounce' : 'bg-slate-800 text-indigo-400'}`}
                    >
                       <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-volume-high'} text-xl`}></i>
                    </button>
                    <button 
                      onClick={() => { setCopied(true); navigator.clipboard.writeText(response); setTimeout(()=>setCopied(false), 2000); }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-800 ${copied ? 'text-emerald-500' : 'text-indigo-400'}`}
                    >
                       <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-xl`}></i>
                    </button>
                 </div>

                 <div className="prose prose-invert prose-indigo max-w-none text-slate-200 text-2xl leading-relaxed font-medium mb-12">
                    <ReactMarkdown>{response}</ReactMarkdown>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReligionSection;
