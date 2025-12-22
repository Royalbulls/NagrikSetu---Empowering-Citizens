
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'https://esm.sh/react-markdown';
import { LocalContext } from '../types';

const CurrentAffairs: React.FC<{ onEarnPoints: () => void; context: LocalContext }> = ({ onEarnPoints, context }) => {
  const [query, setQuery] = useState('');
  const [trending, setTrending] = useState<string>('');
  const [newsResult, setNewsResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    fetchTrending();
  }, [context.country]);

  const fetchTrending = async () => {
    setTrendingLoading(true);
    try {
      const result = await geminiService.searchCurrentEvents(`Top 5 news today in ${context.city || context.country}. Summarize in ${context.language}.`, context);
      setTrending(result.text || "");
    } catch (error) {
      console.error("Failed to fetch trending topics");
    } finally {
      setTrendingLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;
    setLoading(true);
    setNewsResult('');
    setLinks([]);

    try {
      const result = await geminiService.searchCurrentEvents(query, context);
      setNewsResult(result.text || "No results.");
      if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setLinks(result.candidates[0].groundingMetadata.groundingChunks);
      }
      onEarnPoints();
    } catch (error) {
      setNewsResult("Error searching news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Global News</h2>
          <p className="text-amber-500/60 font-bold uppercase tracking-widest text-xs mt-1">Updates for {context.country}</p>
        </div>
        <div className="flex items-center space-x-3 bg-amber-500/10 text-amber-500 px-6 py-2.5 rounded-full border border-amber-500/20">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
          <span className="text-xs font-black uppercase tracking-widest">LIVE IN {context.city || 'LOCAL REGION'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2rem] border border-amber-500/10">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${context.country} news in ${context.language}...`}
                className="w-full bg-slate-950 border border-amber-900/30 rounded-2xl py-5 px-6 text-white focus:ring-2 focus:ring-amber-500/50 outline-none"
              />
            </form>
          </div>

          {loading && <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>}

          {newsResult && !loading && (
            <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-amber-500/10 animate-slideUp">
              <div className="prose prose-invert prose-amber max-w-none text-slate-300">
                <ReactMarkdown>{newsResult}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2rem] border border-amber-500/10">
            <h3 className="font-black text-xl mb-6 text-white flex items-center space-x-3">
              <i className="fas fa-bolt text-amber-500"></i>
              <span>Trending in {context.country}</span>
            </h3>
            {trendingLoading ? <div className="h-20 animate-pulse bg-slate-800 rounded-xl"></div> : <div className="prose prose-invert prose-sm text-slate-400"><ReactMarkdown>{trending}</ReactMarkdown></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairs;
