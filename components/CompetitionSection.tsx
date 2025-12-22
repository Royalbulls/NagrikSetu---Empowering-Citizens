
import React, { useState, useEffect, useMemo } from 'react';
import { geminiService } from '../services/geminiService';
import { firebaseService } from '../services/firebaseService';
import { UserState, LocalContext, Competition, LeaderboardEntry, QuizQuestion, ContestHistory } from '../types';

interface CompetitionSectionProps {
  user: UserState;
  context: LocalContext;
  onEarnPoints: (amount: number) => void;
}

export default function CompetitionSection({ user, context, onEarnPoints }: CompetitionSectionProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'leaderboard' | 'challenge'>('details');
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeFinished, setChallengeFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contestStatus, setContestStatus] = useState<'win' | 'loss' | 'neutral' | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Weekly Timer Logic
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextSunday = new Date();
      nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
      nextSunday.setHours(23, 59, 59);
      
      const diff = nextSunday.getTime() - now.getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsSyncing(true);
    const unsubscribe = firebaseService.onLeaderboardUpdate((entries) => {
      if (entries.length > 0) {
        setLeaderboard(entries);
      } else {
        geminiService.getLeaderboardData(user.points, user.name || "Scholar").then(setLeaderboard);
      }
      setIsSyncing(false);
    });
    return () => unsubscribe();
  }, [user.points, user.name]);

  useEffect(() => {
    const fetchComp = async () => {
      setLoading(true);
      try {
        const comp = await geminiService.getWeeklyCompetition(context);
        setCompetition(comp);
      } catch (error) {
        console.error("Failed to fetch competition data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComp();
  }, [context.country]);

  const startChallenge = async () => {
    if (!competition) return;
    setActiveTab('challenge');
    setLoading(true);
    try {
      const questions = await geminiService.generateQuiz(`Topic: ${competition.theme}. Level: EXTREMELY HARD. Focus on complex historical intersections and international laws.`, context);
      setQuiz(questions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setChallengeFinished(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (index === quiz![currentQuestionIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
    if (currentQuestionIndex + 1 < quiz!.length) {
      setCurrentQuestionIndex(c => c + 1);
    } else {
      setChallengeFinished(true);
    }
  };

  const submitResults = async () => {
    if (!user.uid) return;
    setIsSubmitting(true);
    const percentage = (score / (quiz?.length || 5)) * 100;
    let earned = 0;
    
    if (percentage >= 80) {
      setContestStatus('win');
      earned = competition?.prizePoints || 500;
    } else if (percentage >= 50) {
      setContestStatus('neutral');
      earned = Math.floor((competition?.prizePoints || 500) / 4);
    } else {
      setContestStatus('loss');
      earned = 10;
    }

    const contestHistory: ContestHistory = {
      id: Date.now().toString(),
      title: competition?.title || "Weekly Challenge",
      score,
      totalQuestions: quiz?.length || 0,
      pointsEarned: earned,
      timestamp: Date.now()
    };

    // Update point system in App context
    onEarnPoints(earned);
    
    // Save to Database (Leaderboard + User Profile)
    await firebaseService.submitScore(
      user.uid,
      user.name || "Scholar", 
      user.points + earned, 
      user.level,
      contestHistory
    );

    setIsSubmitting(false);
  };

  if (loading && !quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/20 mb-8 relative">
           <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <i className="fas fa-crown text-amber-500 text-4xl animate-pulse"></i>
        </div>
        <p className="text-amber-500 font-black text-2xl uppercase tracking-[0.3em]">Preparing Global Arena...</p>
        <p className="text-slate-500 text-sm mt-3 font-bold uppercase">Connecting to World Knowledge Nodes</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      <div className="bg-gradient-to-br from-amber-600 via-amber-800 to-slate-950 rounded-[3.5rem] p-12 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
          <i className="fas fa-trophy text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
               <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/20 flex items-center">
                 <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></span>
                 Official Weekly Pratiyogita
               </span>
               <span className="bg-amber-500 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                 Prize: {competition?.prizePoints} Coins
               </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter italic uppercase">{competition?.title}</h2>
            <p className="text-amber-100/70 text-xl font-medium leading-relaxed italic border-l-4 border-amber-400/50 pl-6">
              "{competition?.description}"
            </p>
          </div>
          <div className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-center space-y-4 shadow-2xl">
             <p className="text-[11px] font-black text-amber-500 uppercase tracking-[0.5em]">Contest Window Closes In</p>
             <div className="text-4xl md:text-5xl font-black text-white font-mono tracking-widest">{timeLeft}</div>
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 animate-pulse w-3/4"></div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 bg-slate-900/50 p-2 rounded-2xl border border-amber-500/10 w-fit mx-auto md:mx-0">
        <button onClick={() => { setActiveTab('details'); setContestStatus(null); }} className={`px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'details' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-amber-500'}`}>Mission Brief</button>
        <button onClick={() => { setActiveTab('leaderboard'); setContestStatus(null); }} className={`px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'leaderboard' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-amber-500'}`}>World Standings {isSyncing && <i className="fas fa-sync fa-spin ml-2 text-[10px]"></i>}</button>
      </div>

      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
           <div className="bg-slate-900 p-12 rounded-[3rem] border border-amber-500/10 shadow-xl space-y-10 relative overflow-hidden">
              <h4 className="text-2xl font-black text-white flex items-center space-x-4"><i className="fas fa-shield-halved text-amber-500"></i><span className="uppercase tracking-tighter italic">Battle Rules</span></h4>
              <div className="space-y-6">
                {competition?.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start space-x-5 group">
                     <div className="w-8 h-8 bg-slate-950 rounded-xl flex items-center justify-center text-amber-500 font-black text-xs border border-white/5 group-hover:border-amber-500/30 transition-all">{idx+1}</div>
                     <p className="text-slate-400 font-bold leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
           </div>
           <div className="bg-slate-900 p-12 rounded-[3rem] border border-amber-500/10 shadow-xl flex flex-col items-center justify-center text-center space-y-10 group overflow-hidden">
              <div className="w-24 h-24 bg-amber-500 rounded-[2rem] flex items-center justify-center text-slate-950 text-4xl shadow-3xl group-hover:rotate-12 transition-all"><i className="fas fa-bolt"></i></div>
              <div className="space-y-3 relative z-10">
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter">अखाड़े में प्रवेश करें</h3>
                 <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">तैयार हो जाइये, यह मुकाबला आपकी बुद्धि और ज्ञान की असली परीक्षा है।</p>
              </div>
              <button onClick={startChallenge} className="w-full bg-amber-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-amber-500 shadow-3xl shadow-amber-500/20 transition-all active:scale-95 border-b-4 border-amber-800">ENTER CHALLENGE ARENA</button>
           </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-slate-900 rounded-[3.5rem] border border-amber-500/10 shadow-2xl overflow-hidden animate-slideUp">
           <div className="p-12 border-b border-white/5 flex items-center justify-between bg-amber-500/5">
              <div className="flex items-center space-x-5">
                 <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950"><i className="fas fa-ranking-star"></i></div>
                 <div><h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Global Hall of Fame</h3><p className="text-amber-500/60 font-black text-[9px] uppercase tracking-widest">Winners are updated every Sunday Night</p></div>
              </div>
           </div>
           <div className="divide-y divide-white/5">
              {leaderboard.length === 0 ? <div className="p-20 text-center space-y-4"><i className="fas fa-circle-notch fa-spin text-4xl text-amber-500/20"></i><p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Waiting for participants...</p></div> : leaderboard.map((entry) => (
                <div key={entry.rank} className={`flex items-center justify-between p-10 transition-all ${entry.isCurrentUser ? 'bg-amber-500/10' : 'hover:bg-white/5'}`}>
                   <div className="flex items-center space-x-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-2xl ${entry.rank === 1 ? 'bg-amber-500 text-slate-950 scale-110' : entry.rank === 2 ? 'bg-slate-400 text-slate-900' : entry.rank === 3 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-500'}`}>{entry.rank === 1 ? <i className="fas fa-crown"></i> : entry.rank}</div>
                      <div className="flex flex-col"><span className={`font-black tracking-tight ${entry.isCurrentUser ? 'text-amber-500 text-2xl' : 'text-white text-xl'}`}>{entry.name} {entry.isCurrentUser && '✨'}</span><span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">{entry.badge}</span></div>
                   </div>
                   <div className="text-right flex items-center space-x-6"><div><p className="text-3xl font-black text-white">{entry.points.toLocaleString()}</p><p className="text-[9px] text-amber-500 font-black uppercase tracking-widest">Points Secured</p></div></div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'challenge' && quiz && !challengeFinished && (
        <div className="max-w-4xl mx-auto bg-slate-950 p-12 md:p-16 rounded-[4rem] border-2 border-amber-500/30 shadow-3xl space-y-12 animate-slideUp relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-slate-950 px-10 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">Challenge In Progress</div>
           <div className="flex items-center justify-between gap-8"><div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5"><div className="h-full bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-500" style={{ width: `${((currentQuestionIndex+1)/quiz.length)*100}%` }}></div></div><span className="text-amber-500 font-black text-sm whitespace-nowrap">{currentQuestionIndex+1} / {quiz.length}</span></div>
           <div className="space-y-10"><h4 className="text-4xl font-black text-white leading-tight italic">"{quiz[currentQuestionIndex].question}"</h4><div className="grid grid-cols-1 gap-5">
                 {quiz[currentQuestionIndex].options.map((option, idx) => (
                   <button key={idx} onClick={() => handleAnswer(idx)} className="w-full text-left p-8 rounded-[2rem] bg-slate-900 border-2 border-white/5 hover:border-amber-500/50 hover:bg-slate-800 transition-all font-bold text-xl flex items-center group relative overflow-hidden"><div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center mr-6 text-sm font-black text-slate-500 group-hover:text-amber-500 border border-white/5">{String.fromCharCode(65 + idx)}</div><span className="relative z-10">{option}</span></button>
                 ))}
              </div></div>
        </div>
      )}

      {activeTab === 'challenge' && challengeFinished && !contestStatus && (
        <div className="max-w-2xl mx-auto bg-slate-900 p-20 rounded-[4rem] border-2 border-amber-500/20 shadow-3xl text-center space-y-12 animate-slideUp">
           <div className="w-32 h-32 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-amber-500/20 relative"><i className="fas fa-flag-checkered text-amber-500 text-5xl animate-bounce"></i></div>
           <div className="space-y-4"><h3 className="text-5xl font-black text-white italic">Finish Line!</h3><p className="text-slate-400 text-lg font-medium">सिस्टम आपके जवाबों का विश्लेषण कर रहा है...</p></div>
           <div className="text-8xl font-black text-amber-500 tracking-tighter">{score}<span className="text-slate-700 text-4xl">/</span>{quiz?.length}</div>
           <button onClick={submitResults} disabled={isSubmitting} className="w-full bg-amber-500 text-slate-950 py-6 rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-amber-400 shadow-2xl transition-all h-20 flex items-center justify-center">{isSubmitting ? <div className="flex items-center space-x-3"><i className="fas fa-circle-notch fa-spin"></i><span>Securing Global Status...</span></div> : 'Claim Global Status'}</button>
        </div>
      )}

      {contestStatus && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center p-8 animate-fadeIn">
           <div className={`max-w-2xl w-full p-16 rounded-[4rem] border-4 shadow-[0_0_80px_rgba(0,0,0,0.5)] text-center space-y-10 relative overflow-hidden ${contestStatus === 'win' ? 'border-emerald-500 bg-emerald-950/20' : contestStatus === 'neutral' ? 'border-amber-500 bg-amber-950/20' : 'border-rose-500 bg-rose-950/20'}`}>
              <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto text-5xl shadow-3xl ${contestStatus === 'win' ? 'bg-emerald-500 text-slate-950 animate-bounce' : contestStatus === 'neutral' ? 'bg-amber-500 text-slate-950' : 'bg-rose-500 text-white animate-pulse'}`}><i className={`fas ${contestStatus === 'win' ? 'fa-trophy' : contestStatus === 'neutral' ? 'fa-medal' : 'fa-circle-exclamation'}`}></i></div>
              <div className="space-y-4 relative z-10"><h3 className={`text-6xl font-black italic uppercase tracking-tighter ${contestStatus === 'win' ? 'text-emerald-500' : contestStatus === 'neutral' ? 'text-amber-500' : 'text-rose-500'}`}>{contestStatus === 'win' ? 'आप विजेता हैं!' : contestStatus === 'neutral' ? 'सराहनीय प्रयास!' : 'बेहतर प्रयास करें'}</h3><p className="text-white/70 text-xl font-bold italic">{contestStatus === 'win' ? 'आपने वैश्विक औसत को पछाड़ दिया है। आप एक "Nagrik Expert" हैं।' : contestStatus === 'neutral' ? 'आपने अच्छा प्रदर्शन किया, लेकिन अगले स्तर तक पहुँचने के लिए थोड़ी और मेहनत चाहिए।' : 'आज हार मिली, लेकिन यह कल की जीत की तैयारी है। इतिहास से सीखें।'}</p></div>
              <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5 space-y-1"><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Contest Reward</p><p className={`text-4xl font-black ${contestStatus === 'win' ? 'text-emerald-500' : 'text-amber-500'}`}>+{contestStatus === 'win' ? competition?.prizePoints : contestStatus === 'neutral' ? Math.floor((competition?.prizePoints || 0)/4) : 10} Coins</p></div>
              <button onClick={() => { setContestStatus(null); setActiveTab('leaderboard'); setQuiz(null); }} className="w-full bg-white text-slate-950 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-200 transition-all shadow-2xl h-20">Go To Global Standings</button>
           </div>
        </div>
      )}
    </div>
  );
}
