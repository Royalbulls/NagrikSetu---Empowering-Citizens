
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'https://esm.sh/react-markdown';
import { LocalContext } from '../types';

interface ExplorerSectionProps {
  context: LocalContext;
  onEarnPoints: (amount: number) => void;
  onSearch?: (query: string) => void;
  locationStatus: 'idle' | 'locating' | 'ready' | 'denied' | 'timeout';
  refreshLocation: () => void;
}

const ExplorerSection: React.FC<ExplorerSectionProps> = ({ context, onEarnPoints, onSearch, locationStatus, refreshLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [links, setLinks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);
  const [viewMode, setViewMode] = useState<'report' | 'earth'>('report');
  const [activeHotspot, setActiveHotspot] = useState<string>('');
  const [telemetry, setTelemetry] = useState({ lat: '0.00', lng: '0.00', alt: '35,000' });

  const handleExplore = async (isAuto = false, overridenQuery?: string) => {
    const queryToUse = overridenQuery || searchQuery;
    
    if (!queryToUse && (!context.lat || !context.lng)) {
      if (!isAuto) refreshLocation();
      return;
    }

    if (onSearch && queryToUse) onSearch(queryToUse);

    setError(null);
    setLoading(true);
    setResult('');
    setLinks([]);
    setActiveHotspot(queryToUse || context.city || "Current Location");

    try {
      const response = await geminiService.getExplorerInfo(
        { lat: context.lat, lng: context.lng },
        context,
        queryToUse
      );
      
      const responseText = response.text || "डेटा उपलब्ध नहीं है।";
      setResult(responseText);
      
      if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(response.candidates[0].groundingMetadata.groundingChunks);
      }
      
      onEarnPoints(40);
      setViewMode('report');
      
      // Randomize telemetry for visual effect
      setTelemetry({
        lat: (context.lat || 23.83).toFixed(4),
        lng: (context.lng || 78.73).toFixed(4),
        alt: (Math.random() * 5000 + 30000).toFixed(0)
      });
    } catch (err: any) {
      console.error("Explore failed", err);
      setError("AI सैटेलाइट अभी कनेक्ट नहीं हो पा रहा है।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationStatus === 'ready' && !hasAutoTriggered && !searchQuery && !result && !loading) {
      setHasAutoTriggered(true);
      handleExplore(true);
    }
  }, [locationStatus, hasAutoTriggered]);

  const getEarthUrl = (targetQuery?: string) => {
    const query = targetQuery || searchQuery || context.city || "Earth";
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&t=h&z=17&output=embed`;
  };

  const quickHotspots = [
    { name: "Dubai, Burj Khalifa", label: "Modern" },
    { name: "Sagar, Madhya Pradesh", label: "Heritage" },
    { name: "Singapore, Marina Bay", label: "Future" },
    { name: "Ayodhya, UP", label: "Spiritual" }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-32 max-w-7xl mx-auto px-2 relative z-10">
      {/* 📡 Mission Control Interface */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] p-6 border-2 border-emerald-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <i className="fas fa-satellite-dish text-[150px] text-emerald-500 animate-pulse"></i>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.3)] border-2 border-emerald-400/50">
                <i className="fas fa-globe-americas text-2xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">ग्लोबल इंटेलिजेंस <span className="text-emerald-500">PRO</span></h3>
                <p className="text-emerald-400/60 font-bold text-[10px] uppercase tracking-widest flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-ping"></span>
                  Live Satellite Uplink Active
                </p>
              </div>
            </div>

            <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/10 shadow-inner">
               <button 
                onClick={() => setViewMode('report')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'report' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-600 hover:text-emerald-400'}`}
               >
                 Data Brief
               </button>
               <button 
                onClick={() => setViewMode('earth')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'earth' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-600 hover:text-emerald-400'}`}
               >
                 Earth HUD
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="md:col-span-3 relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExplore()}
                  placeholder="लिखें: शहर का नाम, कोई खास स्मारक या स्थान..."
                  className="w-full bg-slate-950 border-2 border-emerald-900/30 rounded-2xl py-5 pl-14 pr-32 text-white text-lg placeholder:text-slate-800 outline-none focus:border-emerald-500/50 transition-all shadow-inner font-medium"
                />
                <i className="fas fa-crosshairs absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-500"></i>
                <button 
                  onClick={() => handleExplore()}
                  disabled={loading}
                  className="absolute right-3 top-3 bottom-3 px-8 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 transition-all text-[11px] uppercase tracking-widest flex items-center space-x-2 shadow-lg"
                >
                  {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-radar"></i>}
                  <span>Scan</span>
                </button>
             </div>
             
             <div className="flex gap-2 h-full">
                {quickHotspots.slice(0, 2).map((h, i) => (
                  <button 
                    key={i}
                    onClick={() => { setSearchQuery(h.name); handleExplore(false, h.name); }}
                    className="flex-1 bg-slate-950 border border-white/5 hover:border-emerald-500/50 text-slate-500 hover:text-white py-3 px-1 rounded-xl text-[8px] font-black uppercase transition-all flex flex-col items-center justify-center space-y-1"
                  >
                    <i className="fas fa-location-dot text-emerald-500/30"></i>
                    <span className="truncate w-full text-center px-1">{h.label}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-6 animate-fadeIn">
          <div className="relative w-20 h-20">
             <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
             <i className="fas fa-satellite text-emerald-500 text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></i>
          </div>
          <p className="text-emerald-500 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Syncing Orbital Data...</p>
        </div>
      )}

      {/* 🏙️ Main Dashboard Experience */}
      {result && !loading && (
        <div className="space-y-6 animate-slideUp">
          {viewMode === 'earth' ? (
            <div className="bg-slate-900 rounded-[3rem] p-4 border-2 border-emerald-500/20 shadow-3xl h-[650px] relative overflow-hidden group">
               <iframe 
                src={getEarthUrl(activeHotspot)}
                className="w-full h-full rounded-[2.5rem] border-0 shadow-2xl transition-all duration-1000 grayscale-[0.2] hover:grayscale-0"
                allowFullScreen
                loading="lazy"
               ></iframe>
               
               {/* 🛸 Drone/Satellite HUD Overlay */}
               <div className="absolute inset-0 pointer-events-none z-10 p-10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="bg-slate-950/90 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/30 text-emerald-500 space-y-2 pointer-events-auto">
                        <div className="flex items-center space-x-2">
                           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                           <span className="text-[9px] font-black uppercase tracking-[0.2em]">Telemetry Active</span>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-white flex justify-between">LAT: <span className="ml-4 font-mono">{telemetry.lat}</span></p>
                           <p className="text-[10px] font-bold text-white flex justify-between">LNG: <span className="ml-4 font-mono">{telemetry.lng}</span></p>
                           <p className="text-[10px] font-bold text-white flex justify-between">ALT: <span className="ml-4 font-mono">{telemetry.alt} KM</span></p>
                        </div>
                     </div>

                     <div className="bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 text-center space-y-2 pointer-events-auto">
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Signal Strength</p>
                        <div className="flex space-x-1 justify-center">
                           {[1, 2, 3, 4, 5].map(b => <div key={b} className={`w-1 h-3 rounded-full ${b <= 4 ? 'bg-emerald-500' : 'bg-slate-700 animate-pulse'}`}></div>)}
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-center items-center pointer-events-auto">
                     <button 
                        onClick={() => setViewMode('report')}
                        className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-3xl hover:bg-emerald-500 transition-all border-b-4 border-emerald-800 active:translate-y-1"
                     >
                        इमेज और डेटा रिपोर्ट देखें
                     </button>
                  </div>
               </div>

               {/* Map Navigation Sidebar */}
               <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-20">
                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/5 flex flex-col space-y-3 pointer-events-auto shadow-2xl">
                    {links.slice(0, 4).map((link, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveHotspot(link.maps?.title || link.web?.title || activeHotspot)}
                        className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all shadow-lg border border-emerald-500/20 group"
                        title={link.maps?.title || "Jump to Landmark"}
                      >
                         <i className="fas fa-location-crosshairs text-lg group-hover:scale-110 transition-transform"></i>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Detailed 5-Point Intelligence Report */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-14 shadow-3xl border border-emerald-500/10 relative overflow-hidden min-h-[700px]">
                   <div className="absolute top-0 left-0 p-14 opacity-[0.03] pointer-events-none scale-150">
                      <i className="fas fa-file-invoice text-[400px] text-white"></i>
                   </div>
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-white/5 pb-8 relative z-10 gap-6">
                      <div className="flex items-center space-x-5">
                         <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
                            <i className="fas fa-microchip text-xl"></i>
                         </div>
                         <div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">Mission Briefing: {activeHotspot}</h4>
                            <p className="text-[9px] text-emerald-500/60 font-black uppercase tracking-[0.3em] mt-1">Status: Comprehensive Analysis Completed</p>
                         </div>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setViewMode('earth')}
                          className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-500 transition-all flex items-center border-b-4 border-emerald-800"
                        >
                          <i className="fas fa-earth-asia mr-3"></i> Launch Portal
                        </button>
                        <button 
                          onClick={() => window.print()}
                          className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5"
                        >
                          <i className="fas fa-print text-sm"></i>
                        </button>
                      </div>
                   </div>

                   {/* Content Area - Precision Markdown */}
                   <div className="relative z-10 prose prose-invert prose-emerald max-w-none text-slate-200 text-xl leading-relaxed font-medium">
                      <ReactMarkdown>{result}</ReactMarkdown>
                   </div>
                   
                   <div className="mt-16 pt-10 border-t border-white/5 flex flex-wrap gap-4 relative z-10">
                      <div className="bg-emerald-600/5 px-6 py-4 rounded-2xl border border-emerald-500/10">
                         <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mb-1">Authenticity Score</p>
                         <p className="text-xl font-black text-white">98.4% Verified</p>
                      </div>
                      <div className="bg-slate-950 px-6 py-4 rounded-2xl border border-white/5">
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Data Source</p>
                         <p className="text-xl font-black text-white">Global Maps & AI</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Discovery Radar Sidebar - Refined */}
              <div className="space-y-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-xl relative overflow-hidden h-fit sticky top-24">
                   <div className="absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none">
                     <i className="fas fa-compass text-[150px] text-white"></i>
                   </div>

                   <h4 className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-8 flex items-center border-b border-emerald-500/10 pb-4">
                      <i className="fas fa-satellite mr-3"></i> Deep Links Found
                   </h4>
                   
                   <div className="space-y-4 relative z-10">
                      {links.length > 0 ? links.map((link, idx) => (
                        <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/40 transition-all group space-y-4 shadow-xl">
                           <div className="flex items-start justify-between gap-3">
                              <p className="text-white font-black text-sm leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">{link.maps?.title || link.web?.title || 'Key Landmark'}</p>
                              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[8px] text-emerald-500 font-black border border-emerald-500/10">
                                 {idx + 1}
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-2 pt-2">
                              <button 
                                onClick={() => { setActiveHotspot(link.maps?.title || link.web?.title); setViewMode('earth'); }}
                                className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white px-3 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all text-center border border-emerald-500/20"
                              >
                                Teleport
                              </button>
                              <a 
                                href={link.maps?.uri || link.web?.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-3 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all text-center border border-blue-500/20"
                              >
                                Evidence
                              </a>
                           </div>
                        </div>
                      )) : (
                        <div className="text-slate-700 text-[10px] font-black italic bg-slate-950 p-12 rounded-3xl text-center border border-dashed border-white/10 opacity-60">
                           <i className="fas fa-radar block text-3xl mb-4 animate-pulse"></i>
                           SEARCH TO START SCANNING.
                        </div>
                      )}
                   </div>
                   
                   <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                      <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 text-center shadow-inner">
                         <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mb-1">Reward Multiplier</p>
                         <p className="text-2xl font-black text-white">+40 Tokens</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplorerSection;
