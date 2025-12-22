
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'https://esm.sh/react-markdown';
import { QuizQuestion, TimelineEvent, LocalContext } from '../types';

interface CriminologySectionProps {
  onUpdatePoints: (amount: number) => void;
  context: LocalContext;
}

const CriminologySection: React.FC<CriminologySectionProps> = ({ onUpdatePoints, context }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [pointPopup, setPointPopup] = useState<{ val: number; id: number } | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const triggerPointFeedback = (val: number) => {
    setPointPopup({ val, id: Date.now() });
    onUpdatePoints(val);
    setTimeout(() => setPointPopup(null), 1500);
  };

  const handleStudy = async (topic?: string) => {
    const finalQuery = topic || query;
    if (!finalQuery) return;

    setLoading(true);
    setResponse('');
    setQuiz(null);
    setQuizFinished(false);

    try {
      const prompt = `Provide a detailed psychological analysis and criminological study of: "${finalQuery}". 
      Explain the behavioral patterns, possible motivations (motive), and psychological theories (like social learning or biological factors) that apply. 
      Answer in ${context.language}. Use structured Markdown.`;
      
      const result = await geminiService.askComplexQuestion(prompt, context);
      setResponse(result.text || "No insights found.");
      triggerPointFeedback(15);
    } catch (error) {
      setResponse("विवरण प्राप्त करने में विफल।");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!response) return;
    setIsQuizLoading(true);
    try {
      const questions = await geminiService.generateQuiz(`Criminal Psychology and Criminology based on: ${response}`, context);
      setQuiz(questions);
      setCurrentQuestionIndex(0);
      setQuizScore(0);
      setShowExplanation(false);
      setSelectedOption(null);
      setQuizFinished(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === quiz![currentQuestionIndex].correctAnswerIndex) {
      setQuizScore(prev => prev + 1);
      triggerPointFeedback(40);
    } else {
      triggerPointFeedback(-15);
    }
  };

  const presets = [
    { label: "Serial Killers Mind", icon: "fa-skull" },
    { label: "White Collar Crime", icon: "fa-user-tie" },
    { label: "Cyber Psychology", icon: "fa-network-wired" },
    { label: "Juvenile Delinquency", icon: "fa-child" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-20 relative">
      {pointPopup && (
        <div 
          key={pointPopup.id}
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] font-black text-6xl animate-bounce pointer-events-none ${pointPopup.val > 0 ? 'text-indigo-500' : 'text-rose-500'}`}
        >
          {pointPopup.val > 0 ? `+${pointPopup.val}` : pointPopup.val}
        </div>
      )}

      <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-indigo-500/20">
        <h3 className="text-3xl font-black text-white mb-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <i className="fas fa-brain text-xl"></i>
          </div>
          <span>अपराधी मानस (Criminal Psychology Hub)</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleStudy(p.label)}
              className="flex items-center justify-center space-x-2 bg-slate-800/50 hover:bg-indigo-600 hover:text-white border border-indigo-500/10 hover:border-indigo-500 px-4 py-3 rounded-2xl text-[10px] font-black transition-all group uppercase tracking-widest"
            >
              <i className={`fas ${p.icon} group-hover:rotate-12 transition-transform`}></i>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col space-y-4">
          <div className="relative group">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="किसी अपराध या अपराधी प्रवृति के मनोवैज्ञानिक पहलुओं के बारे में पूछें..."
              className="w-full p-6 pr-20 rounded-3xl bg-slate-950/80 border border-indigo-900/30 text-slate-200 placeholder:text-slate-600 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all min-h-[140px] text-lg"
            />
          </div>
          <button
            onClick={() => handleStudy()}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center space-x-3 shadow-xl hover:shadow-indigo-600/20 uppercase tracking-widest"
          >
            <i className="fas fa-fingerprint text-xl"></i>
            <span>Analyze Criminal Mind</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-20 space-y-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <i className="fas fa-eye absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse"></i>
          </div>
          <p className="text-indigo-400 text-xl font-black animate-pulse tracking-widest uppercase">Profiling Behavioral Data...</p>
        </div>
      )}

      {response && !loading && !quiz && (
        <div className="bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-indigo-500/10 animate-slideUp relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <i className="fas fa-user-secret text-[300px] text-indigo-500"></i>
          </div>
          
          <div className="flex justify-end mb-8 relative z-10">
            <button 
              onClick={startQuiz} 
              disabled={isQuizLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-8 py-4 rounded-2xl transition-all flex items-center space-x-3 shadow-lg hover:shadow-indigo-600/40 uppercase tracking-widest"
            >
              <i className="fas fa-brain"></i>
              <span>{isQuizLoading ? 'Generating Test...' : 'Start Psychology Quiz'}</span>
            </button>
          </div>
          
          <div className="prose prose-invert prose-indigo max-w-none text-slate-200 text-lg relative z-10">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}

      {quiz && (
        <div className="bg-slate-900 p-12 rounded-[3.5rem] border-2 border-indigo-500/20 animate-slideUp shadow-2xl max-w-4xl mx-auto">
          {!quizFinished ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[12px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">Analysis {currentQuestionIndex + 1} / {quiz.length}</span>
                <span className="text-xl font-black text-white">Score: {quizScore}</span>
              </div>
              <p className="text-2xl font-black text-white leading-snug">{quiz[currentQuestionIndex].question}</p>
              <div className="grid grid-cols-1 gap-4 mt-8">
                {quiz[currentQuestionIndex].options.map((option, idx) => {
                  const isCorrect = idx === quiz[currentQuestionIndex].correctAnswerIndex;
                  const isSelected = idx === selectedOption;
                  
                  let buttonClass = "bg-slate-800 border-white/5 hover:border-indigo-500/30 hover:bg-slate-750";
                  let icon = <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center mr-4 text-xs font-bold text-slate-500">{idx + 1}</div>;

                  if (showExplanation) {
                    if (isCorrect) {
                      buttonClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.2)]";
                      icon = <i className="fas fa-check-circle text-emerald-500 text-2xl mr-4"></i>;
                    } else if (isSelected) {
                      buttonClass = "bg-rose-500/20 border-rose-500 text-rose-400";
                      icon = <i className="fas fa-times-circle text-rose-500 text-2xl mr-4"></i>;
                    } else {
                      buttonClass = "bg-slate-900 border-white/5 opacity-30 grayscale";
                    }
                  }

                  return (
                    <button 
                      key={idx} 
                      onClick={() => handleOptionSelect(idx)} 
                      disabled={showExplanation} 
                      className={`w-full text-left p-6 rounded-3xl border transition-all duration-300 flex items-center ${buttonClass}`}
                    >
                      {icon}
                      <span className="font-bold text-lg">{option}</span>
                    </button>
                  );
                })}
              </div>
              
              {showExplanation && (
                <div className="mt-12 p-10 bg-indigo-950/20 rounded-[2.5rem] border border-indigo-500/20 animate-fadeIn">
                  <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-4">Psychological Insight</p>
                  <p className="text-slate-200 text-lg leading-relaxed mb-8">{quiz[currentQuestionIndex].explanation}</p>
                  <button 
                    onClick={() => currentQuestionIndex + 1 < quiz.length ? (setCurrentQuestionIndex(c => c + 1), setShowExplanation(false), setSelectedOption(null)) : setQuizFinished(true)} 
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center space-x-3 shadow-xl"
                  >
                    <span>{currentQuestionIndex + 1 < quiz.length ? 'Continue Profile' : 'Final Assessment'}</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 animate-fadeIn">
              <div className="w-32 h-32 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-10 border-2 border-indigo-500/40 shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                <i className="fas fa-microscope text-indigo-400 text-6xl"></i>
              </div>
              <h4 className="text-4xl font-black text-white mb-4">Assessment Complete</h4>
              <p className="text-slate-400 text-xl mb-12 font-medium">You identified {quizScore} / {quiz.length} behavioral patterns correctly.</p>
              <div className="text-8xl font-black text-indigo-500 mb-16 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                {Math.round((quizScore/quiz.length) * 100)}%
              </div>
              <button 
                onClick={() => setQuiz(null)} 
                className="bg-indigo-600 text-white px-16 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl"
              >
                Back to Profiling
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CriminologySection;
