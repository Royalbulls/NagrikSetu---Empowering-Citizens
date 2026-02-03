
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { firebaseService } from '../services/firebaseService';
import { LocalContext, AssistanceRecord } from '../types';
import { translations } from '../utils/translations';

interface SahayataKendraProps {
  context: LocalContext;
  onEarnPoints: (v: number) => void;
  userProfile?: any;
}

const SahayataKendra: React.FC<SahayataKendraProps> = ({ context, onEarnPoints, userProfile }) => {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const t = translations[context.language] || translations['English'];
  const WHATSAPP_NUMBER = "917869690819";
  
  const [profile, setProfile] = useState({
    name: userProfile?.fullName || '',
    phone: userProfile?.mobile || '',
    email: userProfile?.email || '',
    address: userProfile?.address || ''
  });

  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.fullName,
        phone: userProfile.mobile,
        email: userProfile.email,
        address: userProfile.address
      });
    }
  }, [userProfile]);

  const handleResolve = async () => {
    if (!problem.trim() || !profile.name || !profile.phone) {
        alert(context.language === 'Hindi' ? "कृपया अपना नाम और मोबाइल नंबर ज़रूर भरें।" : "Please enter your name and phone number.");
        return;
    }
    setLoading(true);
    try {
      const data = await geminiService.findRightDepartment(problem, profile, context);
      setResult(data);
      onEarnPoints(100); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      <div className="bg-gradient-to-br from-blue-700 via-blue-900 to-slate-950 rounded-[3.5rem] p-10 md:p-14 border border-blue-500/30 shadow-3xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
           <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">{t.sections.help}</h2>
           <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mt-1">{t.hero.subtitle}</p>
        </div>
      </div>

      <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.forms.fullName} *</label>
                <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.forms.mobile} *</label>
                <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none" />
             </div>
          </div>
          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.forms.problemDesc}</label>
             <textarea value={problem} onChange={(e) => setProblem(e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 text-white outline-none min-h-[150px]" />
          </div>
          <button onClick={handleResolve} disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">
             {loading ? t.common.loading : t.common.submit}
          </button>
      </div>

      {result && (
        <div className="bg-slate-900 p-10 rounded-[3rem] border border-emerald-500/20 animate-slideUp">
           <p className="text-emerald-500 font-black uppercase text-[10px] mb-2">{t.forms.department}</p>
           <h3 className="text-white text-3xl font-black uppercase">{result.department}</h3>
           <p className="text-slate-400 mt-4 italic">"{result.tip}"</p>
        </div>
      )}
    </div>
  );
};

export default SahayataKendra;
