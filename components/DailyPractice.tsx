
import React, { useState, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext } from '../types';
import ReactMarkdown from 'react-markdown';

interface DailyChores {
  id: string;
  title: string;
  points: number;
  icon: string;
}

const DailyPractice: React.FC<{ context: LocalContext; onEarnPoints: (val: number) => void }> = ({ context, onEarnPoints }) => {
  const [growthData, setGrowthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [puzzleAnswered, setPuzzleAnswered] = useState<number | null>(null);
  const [commitment, setCommitment] = useState('');

  const citizenChores: DailyChores[] = [
    { id: 'chore_news', title: 'दुनिया की 5 बड़ी खबरें पढ़ें', points: 20, icon: 'fa-newspaper' },
    { id: 'chore_clean', title: 'अपने आसपास की सफाई का संकल्प', points: 15, icon: 'fa-broom' },
    { id: 'chore_law', title: 'संविधान की एक धारा को याद करें', points: 25, icon: 'fa-book-quran' },
    { id: 'chore_help', title: 'किसी नागरिक की निस्वार्थ मदद करें', points: 30, icon: 'fa-handshake-angle' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('nagriksetu_sadhana_v1');
    const savedCompleted = localStorage.getItem('nagriksetu_sadhana_completed');
    const savedDate = localStorage.getItem('nagriksetu_sadhana_date');
    const today = new Date().toDateString();

    if (savedCompleted && savedDate === today) {
      setCompletedTasks(JSON.parse(savedCompleted));
    } else if (savedDate !== today) {
      setCompletedTasks([]);
      localStorage.setItem('nagriksetu_sadhana_date', today);
      localStorage.setItem('nagriksetu_sadhana_completed', '[]');
    }

    if (saved) {
      setGrowthData(JSON.parse(saved));
    } else {
      fetchSadhana();
    }
  }, []);

  const fetchSadhana = async (isManualRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await geminiService.generateDailyGrowth(context);
      if (data && data.affirmation) {
        setGrowthData(data);
        localStorage.setItem('nagriksetu_sadhana_v1', JSON.stringify(data));
        localStorage.setItem('nagriksetu_sadhana_date', new Date().toDateString());
        if (isManualRefresh) {
            setPuzzleAnswered(null);
            onEarnPoints(5);
        }
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (err: any) {
      console.error("[NagrikSetu] Growth fetching failed", err);
      if (!growthData) {
          setError("AI सेवा अभी व्यस्त है। कृपया रोज़ के कार्यों से शुरुआत करें।");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId: string, points: number) => {
    if (!completedTasks.includes(taskId)) {
      const newCompleted = [...completedTasks, taskId];
      setCompletedTasks(newCompleted);
      localStorage.setItem('nagriksetu_sadhana_completed', JSON.stringify(newCompleted));
      onEarnPoints(points);
      
      const div = document.createElement('div');
      div.className = 'point-float';
      div.innerText = `+${points}`;
      div.style.left = '50%';
      div.style.top = '50%';
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 1500);
    }
  };

  const completionPercentage = ((completedTasks.length) / (citizenChores.length + 3)) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn pb-24 px-4">
      <div className="bg-slate-900/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-amber-500/20 shadow-3xl flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 opacity-[0.03] pointer-events-none">
          <i className="fas fa-dharmachakra text-[300px] text-amber-500 animate-spin-slow"></i>
        </div>
        
        <div className="flex-1 space-y-4 relative z-10 text-center lg:text-left">
          <div className="inline-flex items-center space-x-3 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20 mb-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Active Daily Ritual</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">दैनिक <span className="text-amber-500 font-serif">साधना</span></h2>
          <p className="text-slate-400 text-xl font-medium max-w-xl italic border-l-4 border-amber-500/30 pl-6 py-1">
             "{growthData?.affirmation || "आज का संकल्प: मैं एक जागरूक और शक्तिशाली नागरिक बनूँगा।"}"
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 relative z-10 shrink-0">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="64" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-800" />
              <circle 
                cx="72" cy="72" r="64" fill="transparent" stroke="currentColor" strokeWidth="12" 
                className="text-amber-500 transition-all duration-1000 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * Math.min(completionPercentage, 100)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-black text-white tracking-tighter">{Math.round(completionPercentage)}%</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sadhana Done</span>
            </div>
          </div>
          <button 
            onClick={() => fetchSadhana(true)}
            disabled={loading}
            className="flex items-center space-x-3 bg-slate-950 border border-white/10 hover:border-amber-500/50 px-6 py-2.5 rounded-2xl text-[9px] font-black text-slate-400 hover:text-amber-500 uppercase tracking-widest transition-all group"
          >
            <i className={`fas fa-dharmachakra ${loading ? 'fa-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`}></i>
            <span>Refresh Wisdom</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
             <i className="fas fa-list-check"></i>
           </div>
           <h3 className="text-2xl font-black text-white uppercase tracking-tighter">रोज़ के कार्य <span className="text-indigo-400">(Daily Chores)</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {citizenChores.map((chore) => (
            <button
              key={chore.id}
              onClick={() => toggleTask(chore.id, chore.points)}
              disabled={completedTasks.includes(chore.id)}
              className={`p-8 rounded-[2.5rem] border text-left transition-all duration-500 relative overflow-hidden group ${
                completedTasks.includes(chore.id) 
                ? 'bg-emerald-500/10 border-emerald-500/30 grayscale-[0.5]' 
                : 'bg-slate-900 border-white/5 hover:border-indigo-500/40 hover:scale-[1.03] shadow-xl'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${completedTasks.includes(chore.id) ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                <i className={`fas ${chore.icon} text-xl`}></i>
              </div>
              <h4 className={`text-lg font-black leading-tight ${completedTasks.includes(chore.id) ? 'text-emerald-400 line-through opacity-50' : 'text-white'}`}>
                {chore.title}
              </h4>
              <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-400 transition-colors">Reward: +{chore.points} Coins</p>
              {completedTasks.includes(chore.id) && (
                <i className="fas fa-circle-check absolute top-6 right-6 text-emerald-500 text-xl animate-bounce"></i>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5 w-full my-12"></div>

      <div className="space-y-8">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg">
             <i className="fas fa-brain"></i>
           </div>
           <h3 className="text-2xl font-black text-white uppercase tracking-tighter">गहन विकास <span className="text-amber-500">(AI Growth)</span></h3>
        </div>

        {growthData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`bg-slate-900 p-10 rounded-[3.5rem] border shadow-2xl transition-all duration-700 relative overflow-hidden group ${completedTasks.includes('strategy') ? 'border-amber-500/50' : 'border-white/5 hover:border-amber-500/30'}`}>
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
                <i className="fas fa-chess-knight text-[200px] text-amber-500"></i>
              </div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                   <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full border border-amber-500/20">रणनीति (Strategy)</span>
                   <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{growthData.strategy?.source || 'Historical'}</span>
                </div>
                <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{growthData.strategy?.title || 'रणनीति'}</h4>
                <div className="prose prose-invert prose-amber max-w-none text-slate-300 text-lg leading-relaxed">
                   {growthData.strategy?.content && <ReactMarkdown>{growthData.strategy.content}</ReactMarkdown>}
                </div>
                <button 
                  onClick={() => toggleTask('strategy', 50)}
                  disabled={completedTasks.includes('strategy')}
                  className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all flex items-center justify-center space-x-3 ${completedTasks.includes('strategy') ? 'bg-emerald-600/20 text-emerald-400 cursor-default' : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-xl'}`}
                >
                  <i className={`fas ${completedTasks.includes('strategy') ? 'fa-check-double' : 'fa-bolt-lightning'}`}></i>
                  <span>{completedTasks.includes('strategy') ? 'Life Principle Absorbed' : 'Adopt This Strategy'}</span>
                </button>
              </div>
            </div>

            <div className={`bg-slate-900 p-10 rounded-[3.5rem] border shadow-2xl transition-all duration-700 relative overflow-hidden group ${completedTasks.includes('puzzle') ? 'border-purple-500/50' : 'border-white/5 hover:border-purple-500/30'}`}>
              <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform">
                <i className="fas fa-puzzle-piece text-[200px] text-purple-500"></i>
              </div>
              <div className="relative z-10 space-y-8">
                <span className="px-4 py-1.5 bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase rounded-full border border-purple-500/20">तर्क युद्ध (Logic Duel)</span>
                <h4 className="text-2xl md:text-3xl font-black text-white leading-tight italic tracking-tight">"{growthData.logicPuzzle?.question || 'तर्क का सवाल...'}"</h4>
                
                <div className="space-y-3">
                  {growthData.logicPuzzle?.options?.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPuzzleAnswered(idx);
                        if (idx === growthData.logicPuzzle.correctIndex) {
                          toggleTask('puzzle', 75);
                        }
                      }}
                      disabled={puzzleAnswered !== null}
                      className={`w-full text-left p-6 rounded-3xl border-2 transition-all font-bold text-lg flex items-center justify-between group/opt ${
                        puzzleAnswered === idx 
                          ? (idx === growthData.logicPuzzle.correctIndex ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400')
                          : (puzzleAnswered !== null && idx === growthData.logicPuzzle.correctIndex ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-purple-500/30 hover:text-white')
                      }`}
                    >
                      <span className="pr-4">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPractice;
