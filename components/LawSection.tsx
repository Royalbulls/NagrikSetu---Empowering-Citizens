
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { AppSection, LocalContext } from '../types';

interface LawSectionProps {
  onEarnPoints: (amount: number) => void;
  onSearch?: (query: string) => void;
  section: AppSection;
  context: LocalContext;
  onDraftApplication?: (subject: string, details: string) => void;
}

const LawSection: React.FC<LawSectionProps> = ({ onEarnPoints, onSearch, section, context, onDraftApplication }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleConsult = async (forcedQuery?: string) => {
    const activeQuery = forcedQuery || query;
    if (!activeQuery) return;
    setLoading(true);
    setResponse('');
    setSuggestions([]);
    setLinks([]);
    if (onSearch) onSearch(activeQuery);

    try {
      const isConstitution = section === AppSection.CONSTITUTION;
      const instruction = `Query: "${activeQuery}". SCOPE: ${isConstitution ? 'Constitution' : 'General Law'}. Language: ${context.language}.`;
      const result = await geminiService.getLocalInfo(instruction, undefined, context);
      
      const finalRes = result.text || "";
      setResponse(finalRes);

      if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(result.candidates[0].groundingMetadata.groundingChunks);
      }
      
      const followUps = await geminiService.getFollowUpSuggestions(activeQuery, finalRes, context);
      setSuggestions(followUps);

      onEarnPoints(50);
    } catch (error) { setResponse("त्रुटि हुई।"); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-24 relative">
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-blue-500/20 shadow-2xl relative">
        <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-8">
          {section === AppSection.CONSTITUTION ? 'संवैधानिक कवच' : 'स्थानीय कानूनी कवच'}
        </h3>
        <textarea 
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="अपनी कानूनी जिज्ञासा लिखें..."
          className="w-full bg-slate-950 border border-blue-900/20 rounded-[2rem] p-8 text-white min-h-[150px]"
        />
        <button onClick={() => handleConsult()} disabled={loading || !query} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase mt-6 shadow-xl hover:bg-blue-500">
          {loading ? "विश्लेषण जारी..." : "परामर्श लें"}
        </button>
      </div>

      {response && !loading && (
        <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 animate-slideUp">
           <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-xl leading-relaxed legal-content mb-10">
              <ReactMarkdown>{response}</ReactMarkdown>
           </div>

           {links.length > 0 && (
             <div className="pt-8 border-t border-white/5 mb-10">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">विधिक स्रोत (Legal Sources):</p>
                <div className="flex flex-wrap gap-3">
                   {links.map((link, i) => (
                     <a key={i} href={link.web?.uri || link.maps?.uri} target="_blank" rel="noopener noreferrer" className="bg-slate-950 px-4 py-2 rounded-xl text-[10px] text-slate-400 border border-white/5 hover:border-blue-500/30 transition-all font-bold">
                       <i className={`fas ${link.maps ? 'fa-location-dot' : 'fa-link'} mr-2`}></i> {link.web?.title || link.maps?.title || 'Resource'}
                     </a>
                   ))}
                </div>
             </div>
           )}
           
           {suggestions.length > 0 && (
             <div className="pt-10 border-t border-white/5">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6 text-center">संबंधित कानूनी विषय (Expert Suggestions)</p>
                <div className="flex flex-wrap justify-center gap-3">
                   {suggestions.map((s, i) => (
                     <button key={i} onClick={() => { setQuery(s); handleConsult(s); }} className="bg-slate-950 hover:bg-blue-600 text-slate-400 hover:text-white px-6 py-3 rounded-full text-xs font-black transition-all border border-white/5">
                        <i className="fas fa-plus-circle mr-2 opacity-50"></i>{s}
                     </button>
                   ))}
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default LawSection;
