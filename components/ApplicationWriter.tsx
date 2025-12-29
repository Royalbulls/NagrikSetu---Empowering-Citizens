
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'react-markdown';

interface ApplicationWriterProps {
  context: LocalContext;
  userName: string;
  onEarnPoints: (val: number) => void;
  prefill?: { subject: string; details: string } | null;
  clearPrefill?: () => void;
}

const ApplicationWriter: React.FC<ApplicationWriterProps> = ({ context, userName, onEarnPoints, prefill, clearPrefill }) => {
  const [receiver, setReceiver] = useState('');
  const [subject, setSubject] = useState(prefill?.subject || '');
  const [details, setDetails] = useState(prefill?.details || '');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefill) {
      setSubject(prefill.subject);
      setDetails(prefill.details);
      if (clearPrefill) clearPrefill();
    }
  }, [prefill, clearPrefill]);

  const handleGenerate = async () => {
    if (!receiver || !subject || !details) return;
    setLoading(true);
    setResult('');
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

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn pb-24">
      <div className="bg-slate-900 rounded-[3rem] p-10 border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
          <i className="fas fa-file-signature text-[150px] text-amber-500"></i>
        </div>
        
        <div className="relative z-10 space-y-8">
           <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-xl">
                 <i className="fas fa-pen-nib text-2xl"></i>
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter">आवेदन पत्र लेखक</h2>
                 <p className="text-amber-500 font-bold text-[10px] uppercase tracking-widest mt-1">Smart Application Drafts • Fast & Professional</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">सेवा में (पद/अधिकारी)</label>
                <input 
                  type="text" value={receiver} onChange={(e) => setReceiver(e.target.value)}
                  placeholder="जैसे: थाना प्रभारी, प्रिंसिपल, कलेक्टर"
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">विषय (Subject)</label>
                <input 
                  type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                  placeholder="जैसे: बिजली की समस्या, छुट्टी के लिए"
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all"
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">समस्या का विवरण (Problem Details)</label>
              <textarea 
                value={details} onChange={(e) => setDetails(e.target.value)}
                placeholder="अपनी समस्या के बारे में विस्तार से लिखें..."
                className="w-full bg-slate-950 border border-white/5 rounded-[2rem] px-8 py-6 text-white focus:border-amber-500/50 outline-none transition-all min-h-[150px] resize-none"
              />
           </div>

           <button 
            onClick={handleGenerate} disabled={loading || !details}
            className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-amber-400 shadow-2xl transition-all h-16 flex items-center justify-center disabled:opacity-30"
           >
             {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "आवेदन पत्र तैयार करें (+30 Coins)"}
           </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-[3rem] p-12 shadow-3xl animate-slideUp relative overflow-hidden border border-slate-200">
          <div className="flex justify-between items-center mb-8 border-b pb-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">तैयार आवेदन पत्र</h3>
            <div className="flex space-x-3">
               <button 
                onClick={handleCopy}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
               >
                 <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                 <span>{copied ? 'Copied' : 'Copy Text'}</span>
               </button>
               <button onClick={() => window.print()} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl hover:bg-slate-200 transition-all">
                 <i className="fas fa-print"></i>
               </button>
            </div>
          </div>
          <div className="prose prose-slate max-w-none text-slate-800 text-lg leading-relaxed font-serif">
             <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationWriter;
