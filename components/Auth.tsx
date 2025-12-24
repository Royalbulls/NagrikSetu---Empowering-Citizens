
import React, { useState } from 'react';
import { firebaseService } from '../services/firebaseService';

interface AuthProps {
  onGuestAccess: () => void;
  onBackToHome?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onGuestAccess, onBackToHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await firebaseService.loginWithEmail(email, password);
      } else {
        await firebaseService.signUpWithEmail(email, password, name);
      }
    } catch (err: any) {
      console.error("Auth Error Detail:", err);
      // Map specific error messages to localized user-friendly versions
      if (err.message?.includes('Local account not found') || err.message?.includes('account not found')) {
        setError("आपका स्थानीय खाता नहीं मिला। क्या आपने पहले 'Sign Up' किया था? कृपया एक नया खाता बनाएँ।");
      } else if (err.message?.includes('Wrong password') || err.message?.includes('गलत पासवर्ड')) {
        setError("गलत पासवर्ड! कृपया पुनः प्रयास करें।");
      } else {
        setError(err.message || "प्रवेश करने में समस्या आई। कृपया पुनः प्रयास करें।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      
      {onBackToHome && (
        <button 
          onClick={onBackToHome}
          className="absolute top-8 left-8 text-slate-500 hover:text-white flex items-center space-x-3 transition-all group z-20"
        >
          <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-amber-500/30">
            <i className="fas fa-arrow-left"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
        </button>
      )}

      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative z-10 animate-stagger">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-slate-900">
            <i className="fas fa-bridge text-slate-950 text-3xl"></i>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 italic">नागरिक सेतु</h1>
          <p className="text-amber-500/60 font-black uppercase tracking-[0.4em] text-[9px]">Local First • Global Knowledge</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-5 rounded-2xl mb-8 text-xs flex flex-col gap-2 animate-shake">
            <div className="flex items-center gap-3">
              <i className="fas fa-circle-exclamation text-lg shrink-0"></i>
              <span className="font-bold">{error}</span>
            </div>
            {error.includes('Sign Up') && isLogin && (
              <button 
                onClick={() => { setIsLogin(false); setError(null); }}
                className="text-[10px] uppercase tracking-widest font-black text-amber-500 hover:text-amber-400 text-left ml-8 underline underline-offset-4"
              >
                Create Account Now →
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-800 font-medium"
                placeholder="आपका नाम दर्ज करें"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Address</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-800 font-medium"
              placeholder="example@mail.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Secure Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-800 font-medium"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-amber-400 shadow-2xl transition-all disabled:opacity-50 mt-6 h-18 text-xs border-b-4 border-amber-700 active:border-b-0 active:translate-y-1"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : (isLogin ? 'Login Now' : 'Join the Mission')}
          </button>
        </form>

        <div className="mt-10 flex items-center space-x-4">
          <div className="h-[1px] bg-white/5 flex-1"></div>
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">or continue as</span>
          <div className="h-[1px] bg-white/5 flex-1"></div>
        </div>

        <button 
          onClick={onGuestAccess}
          className="w-full mt-8 bg-slate-900/80 border border-white/5 text-slate-400 py-5 rounded-2xl font-black uppercase tracking-widest hover:border-amber-500/30 hover:text-amber-500 transition-all flex items-center justify-center space-x-4 group"
        >
          <i className="fas fa-user-secret text-lg group-hover:animate-pulse"></i>
          <span>Local Citizen Mode</span>
        </button>

        <div className="mt-10 text-center">
           <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em]">
            {isLogin ? "खाता नहीं है?" : "पहले से सदस्य हैं?"}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-amber-500 hover:text-amber-400 ml-2 font-black underline decoration-2 underline-offset-8"
            >
              {isLogin ? 'अभी रजिस्टर करें' : 'लॉगिन करें'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
