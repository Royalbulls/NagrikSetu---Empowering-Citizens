
import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'react-markdown';

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
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface Template {
  id: string;
  category: 'Police' | 'Admin' | 'Bank' | 'Legal' | 'RTI';
  title: string;
  receiver: string;
  subject: string;
  hint: string;
  icon: string;
}

interface ApplicationWriterProps {
  context: LocalContext;
  userName: string;
  onEarnPoints: (val: number) => void;
  prefill?: { subject: string; details: string } | null;
  clearPrefill?: () => void;
}

const ApplicationWriter: React.FC<ApplicationWriterProps> = ({ context, userName, onEarnPoints, prefill, clearPrefill }) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'editor'>('templates');
  const [receiver, setReceiver] = useState('');
  const [subject, setSubject] = useState(prefill?.subject || '');
  const [details, setDetails] = useState(prefill?.details || '');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const templates: Template[] = [
    // Police
    { id: 'p1', category: 'Police', title: 'FIR / शिकायत पत्र', receiver: 'थाना प्रभारी (S.H.O.)', subject: 'अपराध/चोरी की सूचना एवं FIR दर्ज करने हेतु आवेदन', hint: 'घटना की तारीख, समय, स्थान और संदिग्ध व्यक्ति का हुलिया (यदि पता हो) ज़रूर लिखें।', icon: 'fa-shield-halved' },
    { id: 'p2', category: 'Police', title: 'चरित्र प्रमाण पत्र', receiver: 'पुलिस अधीक्षक (S.P.)', subject: 'पुलिस वेरिफिकेशन / चरित्र प्रमाण पत्र जारी करने हेतु', hint: 'अपने वर्तमान पते पर रहने की अवधि और आवेदन का उद्देश्य (जैसे नौकरी) लिखें।', icon: 'fa-user-check' },
    { id: 'p3', category: 'Police', title: 'खोया हुआ सामान', receiver: 'थाना प्रभारी', subject: 'दस्तावेज/सामान गुम होने की सूचना दर्ज कराने हेतु', hint: 'सामान का विवरण (जैसे मोबाइल का IMEI या मार्कशीट नंबर) और अंतिम स्थान लिखें।', icon: 'fa-box-open' },
    
    // Admin / Collectorate
    { id: 'a1', category: 'Admin', title: 'राशन कार्ड सुधार', receiver: 'जिला आपूर्ति अधिकारी', subject: 'राशन कार्ड में नाम जोड़ने/सुधारने हेतु आवेदन', hint: 'पुराना राशन कार्ड नंबर और जो नाम जोड़ना/हटाना है उसका स्पष्ट विवरण दें।', icon: 'fa-wheat-awn' },
    { id: 'a2', category: 'Admin', title: 'तिक्रमण की शिकायत', receiver: 'जिलाधिकारी / कलेक्टर', subject: 'सार्वजनिक मार्ग से अवैध अतिक्रमण हटाने हेतु', hint: 'अतिक्रमण वाले स्थान का सटीक पता और उससे होने वाली समस्या लिखें।', icon: 'fa-road-barrier' },
    { id: 'a3', category: 'Admin', title: 'पेयजल समस्या', receiver: 'नगर निगम आयुक्त / सरपंच', subject: 'क्षेत्र में नियमित जलापूर्ति सुनिश्चित करने हेतु', hint: 'अपने वार्ड/मोहल्ले का नाम और पिछले कितने दिनों से समस्या है, यह लिखें।', icon: 'fa-faucet-drip' },
    
    // Bank
    { id: 'b1', category: 'Bank', title: 'लोन आवेदन (KCC/Personal)', receiver: 'शाखा प्रबंधक (Branch Manager)', subject: 'ऋण (Loan) स्वीकृत करने हेतु प्रार्थना पत्र', hint: 'लोन का प्रकार, राशि और अपना खाता नंबर स्पष्ट रूप से लिखें।', icon: 'fa-sack-dollar' },
    { id: 'b2', category: 'Bank', title: 'ATM/कार्ड गुम होना', receiver: 'शाखा प्रबंधक', subject: 'खोए हुए ATM कार्ड को ब्लॉक करने एवं नया जारी करने हेतु', hint: 'कार्ड नंबर (यदि याद हो) और खाता नंबर ज़रूर दें।', icon: 'fa-credit-card' },
    
    // Legal / Affidavit
    { id: 'l1', category: 'Legal', title: 'नाम परिवर्तन (Affidavit)', receiver: 'तहसीलदार / नोटरी पब्लिक', subject: 'राजपत्र में नाम परिवर्तन हेतु शपथ पत्र का प्रारूप', hint: 'पुराना नाम, नया नाम और परिवर्तन का कारण (जैसे शादी या ज्योतिषी सलाह) लिखें।', icon: 'fa-file-signature' },
    { id: 'l2', category: 'Legal', title: 'आय प्रमाण पत्र', receiver: 'अनुविभागीय अधिकारी (S.D.M.)', subject: 'आय प्रमाण पत्र (Income Certificate) जारी करने हेतु', hint: 'परिवार के सभी स्रोतों से वार्षिक आय का विवरण दें।', icon: 'fa-indian-rupee-sign' },
    
    // RTI
    { id: 'r1', category: 'RTI', title: 'सूचना का अधिकार (RTI)', receiver: 'लोक सूचना अधिकारी (P.I.O.)', subject: 'सूचना का अधिकार अधिनियम 2005 के तहत जानकारी हेतु', hint: 'वह विशिष्ट जानकारी पूछें जो आप चाहते हैं (जैसे - सड़क निर्माण का बजट)।', icon: 'fa-info-circle' }
  ];

  useEffect(() => {
    if (prefill) {
      setSubject(prefill.subject);
      setDetails(prefill.details);
      setActiveTab('editor');
      if (clearPrefill) clearPrefill();
    }
  }, [prefill, clearPrefill]);

  const useTemplate = (t: Template) => {
    setSelectedTemplate(t);
    setReceiver(t.receiver);
    setSubject(t.subject);
    setActiveTab('editor');
    setResult('');
    if (isSpeaking && sourceRef.current) sourceRef.current.stop();
    setIsSpeaking(false);
  };

  const handleGenerate = async () => {
    if (!receiver || !subject || !details) return;
    setLoading(true);
    setResult('');
    if (isSpeaking && sourceRef.current) sourceRef.current.stop();
    setIsSpeaking(false);
    
    try {
      const letter = await geminiService.generateApplication({ receiver, subject, details, name: userName }, context);
      setResult(letter);
      onEarnPoints(30);
    } catch (error) {
      setResult("आवेदन पत्र बनाने में समस्या आई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      if (sourceRef.current) sourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    if (!result) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.speak(result, 'Kore');
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

  const categories = [
    { name: 'Police', label: 'पुलिस / सुरक्षा', icon: 'fa-building-shield', color: 'bg-rose-600' },
    { name: 'Admin', label: 'प्रशासन / राजस्व', icon: 'fa-landmark', color: 'bg-amber-600' },
    { name: 'Bank', label: 'बैंकिंग / वित्तीय', icon: 'fa-piggy-bank', color: 'bg-blue-600' },
    { name: 'Legal', label: 'कानूनी / शपथ पत्र', icon: 'fa-scale-balanced', color: 'bg-indigo-600' },
    { name: 'RTI', label: 'RTI (सूचना)', icon: 'fa-circle-info', color: 'bg-emerald-600' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-40">
      {/* 📝 Header */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 border border-amber-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 scale-150">
          <i className="fas fa-file-signature text-[300px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center text-slate-950 shadow-2xl border-4 border-white/10">
                   <i className="fas fa-pen-nib text-3xl"></i>
                </div>
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">दस्तावेज <span className="text-amber-500">जनरेटर</span></h2>
                   <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mt-2 italic">Professional Citizen Documentation • AI Powered</p>
                </div>
              </div>
              <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/10 shadow-inner overflow-x-auto no-scrollbar">
                 <button onClick={() => setActiveTab('templates')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'templates' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Template Library</button>
                 <button onClick={() => setActiveTab('editor')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'editor' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Manual Editor</button>
              </div>
           </div>
           <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-4xl border-l-4 border-amber-500/50 pl-8 py-2 italic">
             "आवेदन पत्र लिखना अब मुश्किल नहीं। टेंपलेट चुनें, विवरण भरें और अपनी बात संवैधानिक भाषा में रखें।"
           </p>
        </div>
      </div>

      {activeTab === 'templates' && (
        <div className="space-y-12 animate-slideUp">
           {categories.map((cat) => (
             <div key={cat.name} className="space-y-6">
                <div className="flex items-center gap-4 ml-4">
                   <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <i className={`fas ${cat.icon}`}></i>
                   </div>
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">{cat.label}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {templates.filter(t => t.category === cat.name).map((t) => (
                     <button 
                      key={t.id} 
                      onClick={() => useTemplate(t)}
                      className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 text-left space-y-4 hover:border-amber-500/40 transition-all group relative overflow-hidden shadow-xl"
                     >
                        <div className="absolute -top-4 -right-4 opacity-5 group-hover:scale-125 transition-transform"><i className={`fas ${t.icon} text-6xl`}></i></div>
                        <h4 className="text-white font-black text-lg group-hover:text-amber-500 transition-colors uppercase italic">{t.title}</h4>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">To: {t.receiver}</p>
                           <p className="text-[10px] text-slate-400 line-clamp-1 italic">Sub: {t.subject}</p>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                           <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Start Draft</span>
                           <i className="fas fa-arrow-right-long text-slate-700 group-hover:text-amber-500 group-hover:translate-x-2 transition-all"></i>
                        </div>
                     </button>
                   ))}
                </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slideUp">
           {/* Form Area */}
           <div className="lg:col-span-7 bg-slate-900 p-10 md:p-12 rounded-[3.5rem] border border-white/10 shadow-3xl space-y-10 relative overflow-hidden">
              {selectedTemplate && (
                 <div className="bg-amber-500/10 p-6 rounded-3xl border-2 border-dashed border-amber-500/20 mb-8 flex items-start gap-4">
                    <i className="fas fa-lightbulb text-amber-500 mt-1"></i>
                    <div className="space-y-1">
                       <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Sanskriti's Tip for {selectedTemplate.title}</p>
                       <p className="text-slate-300 text-sm italic leading-relaxed">{selectedTemplate.hint}</p>
                    </div>
                    <button onClick={() => setSelectedTemplate(null)} className="text-slate-600 hover:text-white ml-auto"><i className="fas fa-times"></i></button>
                 </div>
              )}

              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">सेवा में (पद/अधिकारी)</label>
                       <input 
                         type="text" value={receiver} onChange={(e) => setReceiver(e.target.value)}
                         placeholder="जैसे: थाना प्रभारी, जिलाधिकारी"
                         className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">विषय (Subject)</label>
                       <input 
                         type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                         placeholder="जैसे: बिजली की समस्या, राशन कार्ड"
                         className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">समस्या का विवरण (Problem Details)</label>
                    <textarea 
                      value={details} onChange={(e) => setDetails(e.target.value)}
                      placeholder="अपनी समस्या के बारे में विस्तार से लिखें. जितनी सटीक जानकारी होगी, आवेदन उतना ही प्रभावशाली बनेगा।"
                      className="w-full bg-slate-950 border border-white/5 rounded-[2.5rem] px-8 py-8 text-white focus:border-amber-500/50 outline-none transition-all min-h-[220px] shadow-inner font-medium"
                    />
                 </div>

                 <button 
                  onClick={handleGenerate} disabled={loading || !details || !receiver}
                  className="w-full bg-amber-500 text-slate-950 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-lg hover:bg-amber-400 shadow-3xl transition-all h-20 flex items-center justify-center border-b-4 border-amber-800 active:translate-y-1 disabled:opacity-30"
                 >
                   {loading ? <i className="fas fa-dharmachakra fa-spin text-2xl mr-4"></i> : <i className="fas fa-wand-magic-sparkles mr-4"></i>}
                   <span>{loading ? "प्रारूप तैयार हो रहा है..." : "आवेदन पत्र तैयार करें (+30)"}</span>
                 </button>
              </div>
           </div>

           {/* Result Area */}
           <div className="lg:col-span-5">
              {result ? (
                <div className="bg-white rounded-[4rem] p-10 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] animate-slideUp border border-slate-200 sticky top-32">
                   <div className="flex justify-between items-center mb-8 border-b pb-6">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Draft Completed</h3>
                      <div className="flex space-x-2">
                         <button 
                          onClick={handleSpeak}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                         >
                            <i className={`fas ${isSpeaking ? 'fa-stop-circle' : 'fa-volume-high'}`}></i>
                         </button>
                         <button 
                          onClick={handleCopy}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                         >
                           <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                         </button>
                         <button onClick={() => window.print()} className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                           <i className="fas fa-print"></i>
                         </button>
                      </div>
                   </div>
                   <div className="prose prose-slate max-w-none text-slate-800 text-lg leading-relaxed font-serif overflow-y-auto max-h-[500px] dark-scroll pr-4">
                      <ReactMarkdown>{result}</ReactMarkdown>
                   </div>
                   <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">RBA Advisor Citizen Utility V5.0</p>
                   </div>
                </div>
              ) : (
                <div className="h-full bg-slate-900/30 rounded-[4rem] border-4 border-dashed border-white/5 p-20 text-center flex flex-col items-center justify-center grayscale opacity-30 group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                   <i className="fas fa-file-invoice text-6xl text-slate-700 group-hover:text-amber-500 mb-6"></i>
                   <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">प्रतीक्षा सूची</h4>
                   <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-4">विवरण भरने के बाद यहाँ ड्राफ्ट दिखाई देगा।</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationWriter;
