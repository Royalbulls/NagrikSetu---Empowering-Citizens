
import React, { useState } from 'react';
import { firebaseService } from '../services/firebaseService';

interface AuthProps {
  onGuestAccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onGuestAccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);

  const executeRecaptcha = async (action: string): Promise<string> => {
    return new Promise((resolve) => {
      const hostname = window.location.hostname;
      const isProductionDomain = hostname.endsWith('firebaseapp.com') || hostname.endsWith('web.app');
      const isDevelopmentOrPreview = !isProductionDomain || hostname.includes('firebasestorage.app') || hostname.includes('preview');

      if (isDevelopmentOrPreview) {
        console.log("[NagrikSetu Security] Proactively bypassing reCAPTCHA on non-production domain.");
        return resolve('dev_silent_bypass');
      }

      const safetyTimeout = setTimeout(() => {
        resolve('timeout_bypass');
      }, 3000);

      const grecaptcha = (window as any).grecaptcha;
      if (grecaptcha && grecaptcha.enterprise) {
        grecaptcha.enterprise.ready(async () => {
          try {
            const token = await grecaptcha.enterprise.execute('6LfZqzMsAAAAABuxCeh9OG11slCiPmdeqQ-6Fs9_', { action });
            clearTimeout(safetyTimeout);
            resolve(token);
          } catch (e: any) {
            clearTimeout(safetyTimeout);
            resolve('error_bypass');
          }
        });
      } else {
        clearTimeout(safetyTimeout);
        resolve('library_missing');
      }
    });
  };

  const handleAuthError = (err: any) => {
    console.error("Auth Error Detail:", err);
    if (err.code === 'auth/unauthorized-domain') {
      setUnauthorizedDomain(window.location.hostname);
      setError("This domain is not authorized in Firebase. Please add it to your console.");
    } else {
      setError(err.message || "Cloud Handshake Failed. Please check your connection.");
    }
    
    if (err.message?.includes("Unavailable") && !firebaseService.isCloudConnected()) {
      firebaseService.retryConnection();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUnauthorizedDomain(null);
    
    try {
      const actionType = isLogin ? 'LOGIN' : 'SIGNUP';
      await executeRecaptcha(actionType);
      
      if (isLogin) {
        await firebaseService.loginWithEmail(email, password);
      } else {
        await firebaseService.signUpWithEmail(email, password);
      }
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setUnauthorizedDomain(null);
    try {
      await executeRecaptcha('GOOGLE_LOGIN');
      await firebaseService.loginWithGoogle();
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 md:p-10 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-subtle"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-amber-600/10 blur-[150px] rounded-full animate-pulse-subtle" style={{animationDelay: '1s'}}></div>

      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-3xl p-8 md:p-12 rounded-[4rem] border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.4)] relative z-10 animate-slideUp">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(245,158,11,0.3)] border-4 border-slate-900">
            <i className="fas fa-bridge text-slate-950 text-4xl"></i>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">नागरिक सेतु</h1>
          <p className="text-amber-500/60 font-black uppercase tracking-[0.3em] text-[10px]">Empowering Citizens Globally</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-5 rounded-3xl mb-8 text-[11px] font-black uppercase tracking-widest flex flex-col space-y-3">
            <div className="flex items-start">
              <i className="fas fa-circle-exclamation mt-1 mr-3 text-sm"></i>
              <div className="flex-1">
                <p className="font-bold mb-1">Authorization Error</p>
                <p className="opacity-80 leading-relaxed">{error}</p>
              </div>
            </div>
            
            {unauthorizedDomain && (
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-rose-500/20 mt-2 space-y-3">
                <p className="text-[9px] text-white/50">Add this to Firebase Console > Auth > Settings > Authorized Domains:</p>
                <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-white/5">
                  <code className="text-amber-500 lowercase text-[10px] truncate">{unauthorizedDomain}</code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(unauthorizedDomain)}
                    className="ml-2 text-white/40 hover:text-white transition-colors"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
                <p className="text-[8px] italic opacity-60">Wait 1-2 minutes after adding before retrying.</p>
              </div>
            )}

            {!firebaseService.isCloudConnected() && !unauthorizedDomain && (
              <button 
                onClick={() => { firebaseService.retryConnection(); setError(null); }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-[9px] font-black uppercase transition-all"
              >
                Reconnect to Cloud
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-7 py-5 text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-700 font-medium"
            placeholder="आपका ईमेल (Email)"
          />
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-7 py-5 text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-700 font-medium"
            placeholder="पासवर्ड (Password)"
          />

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-amber-400 shadow-2xl transition-all h-18 flex items-center justify-center disabled:opacity-50 active:scale-95 text-xs"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin text-lg"></i> : (isLogin ? 'Login Now' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-10 flex items-center space-x-4">
          <div className="h-[1px] bg-white/5 flex-1"></div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Or Continue</span>
          <div className="h-[1px] bg-white/5 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-slate-800 border border-white/5 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-750 transition-all flex items-center justify-center space-x-4 h-16 shadow-xl active:scale-95 text-[10px]"
          >
            <i className="fab fa-google text-amber-500 text-lg"></i>
            <span>Authenticate with Google</span>
          </button>

          <button 
            onClick={onGuestAccess}
            disabled={loading}
            className="w-full bg-transparent border-2 border-slate-700 text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest hover:border-amber-500/50 hover:text-amber-500 transition-all flex items-center justify-center space-x-4 h-16 active:scale-95 text-[10px] group"
          >
            <i className="fas fa-user-secret text-lg group-hover:text-amber-500 transition-colors"></i>
            <span>Guest Access (Skip Auth)</span>
          </button>
        </div>

        <p className="text-center mt-12 text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
          {isLogin ? "No account?" : "Have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-500 hover:text-amber-400 ml-2 font-black underline decoration-2 underline-offset-4"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
