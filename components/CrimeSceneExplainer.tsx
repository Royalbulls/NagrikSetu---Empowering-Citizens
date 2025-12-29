
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'react-markdown';

interface CrimeSceneExplainerProps {
  context: LocalContext;
  onEarnPoints: (amount: number) => void;
}

const CrimeSceneExplainer: React.FC<CrimeSceneExplainerProps> = ({ context, onEarnPoints }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [missingLink, setMissingLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'investigate' | 'missing'>('investigate');

  const handleInvestigate = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);
    setMissingLink(null);
    try {
      if (activeTab === 'investigate') {
        const data = await geminiService.explainCrimeScene(query, context);
        setResult(data);
      } else {
        const data = await geminiService.analyzeMissingLink(query, context);
        setMissingLink(data);
      }
      onEarnPoints(40);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      {/* Investigation Header */}
      <div className="bg-slate-900 border-b-4 border-amber-500 p-8 rounded-t-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-amber-500 text-slate-950 font-black text-[10px] px-4 py-1 uppercase tracking-widest z-20">
          CRIME SCENE - DO NOT CROSS
        </div>
        <div className="space-y-2 relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tighter flex items-center">
            <i className="fas fa-fingerprint text-amber-500 mr-4"></i>
            क्राइम सीन इन्वेस्टिगेटर
          </h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">जटिल सिद्धांतों को आसान भाषा में समझें</p>
        </div>
        
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-white/5 relative z-10">
          <button 
            onClick={() => setActiveTab('investigate')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'investigate' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-amber-500'}`}
          >
            Investigate Case
          </button>
          <button 
            onClick={() => setActiveTab('missing')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'missing' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-400'}`}
          >
            The Missing Link
          </button>
        </div>
      </div>

      {/* Input Board */}
      <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="space-y-8">
          <div className="relative group">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === 'investigate' 
                ? "अपराध का दृश्य या थ्योरी लिखें (उदा: 'Blood Spatter analysis क्या है?' या 'कोई मर्डर केस जिसमें सुराग कम हों')..." 
                : "आज के युग की किस समस्या का हल इतिहास में ढूंढना है? (उदा: 'सोशल मीडिया फेक न्यूज़' या 'कानूनी देरी')..."
              }
              className={`w-full bg-slate-950 border rounded-[2rem] py-8 px-10 text-white focus:ring-4 outline-none transition-all text-xl placeholder:text-slate-700 min-h-[140px] resize-none ${activeTab === 'investigate' ? 'border-amber-900/30 focus:ring-amber-500/10' : 'border-indigo-900/30 focus:ring-indigo-500/10'}`}
            />
            <button 
              onClick={handleInvestigate}
              disabled={loading || !query}
              className={`absolute right-5 bottom-5 h-14 px-10 font-black rounded-2xl disabled:opacity-50 transition-all shadow-xl uppercase tracking-widest text-xs ${activeTab === 'investigate' ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : (activeTab === 'investigate' ? "Analyze Scene" : "Find Missing Link")}
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/20 mb-6">
            <i className="fas fa-magnifying-glass text-amber-500 text-2xl animate-pulse"></i>
          </div>
          <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-sm">कड़ियों को जोड़ा जा रहा है...</p>
        </div>
      )}

      {/* Result Display: Investigation Board Style */}
      {result && activeTab === 'investigate' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slideUp">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-slate-900 p-12 rounded-[3.5rem] border-2 border-amber-500/20 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8">
                  <div className="bg-amber-500 text-slate-950 px-4 py-1 font-black text-[10px] uppercase -rotate-12 shadow-lg">EVIDENCE #1</div>
               </div>
               
               <h3 className="text-4xl font-black text-white tracking-tighter mb-10 border-b border-white/5 pb-6">Case Summary: {result.title}</h3>
               
               <div className="space-y-10">
                  <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5">
                    <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center">
                      <i className="fas fa-book-open mr-3"></i> सरल व्याख्या (Easy Analogy)
                    </h4>
                    <p className="text-slate-300 text-2xl italic font-serif leading-relaxed">"{result.simpleAnalogy}"</p>
                  </div>

                  <div className="bg-white/5 p-8 rounded-3xl">
                    <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">The Theory (गहराई से समझें)</h4>
                    <p className="text-slate-200 text-lg leading-relaxed">{result.theoryExplained}</p>
                  </div>

                  <div className="bg-amber-500/5 p-10 rounded-[3rem] border border-amber-500/20">
                    <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">The Motive (इरादा)</h4>
                    <p className="text-white text-xl font-bold leading-relaxed">{result.motiveAnalysis}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-xl">
                <h4 className="text-amber-500 font-black text-xs uppercase tracking-widest mb-6 flex items-center">
                  <i className="fas fa-list-check mr-3"></i> Found Clues (सुराग)
                </h4>
                <div className="space-y-3">
                   {result.clues.map((clue: string, idx: number) => (
                     <div key={idx} className="bg-slate-950 p-4 rounded-xl border-l-4 border-amber-500 text-slate-300 text-sm font-bold">
                        {clue}
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-xl">
                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-6 flex items-center">
                  <i className="fas fa-flask mr-3"></i> Forensic Facts
                </h4>
                <div className="space-y-3">
                   {result.forensicFacts.map((fact: string, idx: number) => (
                     <div key={idx} className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10 text-slate-400 text-xs italic leading-relaxed">
                        <i className="fas fa-microscope mr-2 text-indigo-500"></i> {fact}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Result Display: Missing Link Style */}
      {missingLink && activeTab === 'missing' && (
        <div className="bg-slate-900 p-12 rounded-[4rem] border-2 border-indigo-500/30 shadow-2xl animate-slideUp relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"></div>
           <div className="flex items-center space-x-6 mb-12 relative z-10">
              <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                 <i className="fas fa-link-slash text-3xl"></i>
              </div>
              <div>
                 <h3 className="text-3xl font-black text-white tracking-tighter uppercase">लुप्त कड़ी विश्लेषण (The Missing Link)</h3>
                 <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">Bridging History and Future</p>
              </div>
           </div>
           <div className="prose prose-invert prose-indigo max-w-none text-slate-200 text-xl leading-relaxed relative z-10 font-medium">
              <ReactMarkdown>{missingLink}</ReactMarkdown>
           </div>
           <div className="mt-12 pt-8 border-t border-white/5 text-center relative z-10">
              <p className="text-slate-500 italic text-sm">"इतिहास की राख में दबे हीरे ही भविष्य को चमक देंगे।"</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default CrimeSceneExplainer;
