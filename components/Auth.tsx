
import React, { useState } from 'react';
import { firebaseService } from '../services/firebaseService';

interface AuthProps {
  onBackToHome?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onBackToHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agree, setAgree] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!agree) {
      setError("कृपया आगे बढ़ने के लिए प्राइवेसी पॉलिसी से सहमत हों।");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await firebaseService.loginWithEmail(email, password);
      } else {
        await firebaseService.signUpWithEmail(email, password, name);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "प्रवेश करने में समस्या आई।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[120px] rounded-full"></div>
      
      {onBackToHome && (
        <button 
          onClick={onBackToHome}
          className="absolute top-8 left-8 text-slate-500 hover:text-white flex items-center space-x-3 transition-all group z-20"
        >
          <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-amber-500/30">
            <i className="fas fa-arrow-left"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Portal Home</span>
        </button>
      )}

      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative z-10 animate-fadeIn">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-slate-900">
            <i className="fas fa-user-shield text-slate-950 text-3xl"></i>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 italic">सुरक्षित प्रवेश</h1>
          <p className="text-amber-500/60 font-black uppercase tracking-[0.4em] text-[9px]">Official Citizen Login</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 text-[10px] font-bold text-center italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all"
                placeholder="आपका नाम"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Address</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all"
              placeholder="example@mail.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Secure Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-start space-x-3 pt-2">
             <input 
               type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
               className="mt-1 w-4 h-4 rounded bg-slate-950 border-white/10 text-amber-500 focus:ring-amber-500/20"
             />
             <p className="text-[9px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
               By continuing, you agree to our <span className="text-amber-500">Privacy Policy</span> and authorize <strong>NagrikSetu</strong> to access your Google profile data for account synchronization.
             </p>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-amber-400 shadow-2xl transition-all disabled:opacity-50 mt-4 text-xs border-b-4 border-amber-700 active:border-b-0 active:translate-y-1"
          >
            {loading ? <i className="fas fa-dharmachakra fa-spin mr-2"></i> : (isLogin ? 'Login Now' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-8">
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
            {isLogin ? "खाता नहीं है?" : "पहले से सदस्य हैं?"}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-amber-500 hover:text-amber-400 ml-2 font-black underline decoration-2 underline-offset-8"
            >
              {isLogin ? 'अभी रजिस्टर करें' : 'लॉगिन करें'}
            </button>
           </p>
           <p className="mt-4 text-[8px] text-slate-700 font-bold uppercase tracking-widest">Powered by Royal Bulls Advisory • {window.location.hostname}</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
