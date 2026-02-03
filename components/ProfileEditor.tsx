
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { translations } from '../utils/translations';

interface ProfileEditorProps {
  profile: UserProfile;
  onSave: (data: UserProfile) => void;
  language: string;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, language }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const t = translations[language] || translations['English'];

  const fields = [
    { label: t.forms.fullName, key: "fullName", icon: "fa-user" },
    { label: t.forms.fatherName, key: "fatherName", icon: "fa-person-breastfeeding" },
    { label: t.forms.dob, key: "dob", icon: "fa-calendar-day", type: "date" },
    { label: t.forms.profession, key: "profession", icon: "fa-briefcase" },
    { label: t.forms.mobile, key: "mobile", icon: "fa-phone", type: "tel" },
    { label: t.forms.email, key: "email", icon: "fa-envelope", type: "email" },
    { label: t.forms.city, key: "city", icon: "fa-city" },
    { label: t.forms.pinCode, key: "pinCode", icon: "fa-map-pin" },
    { label: t.forms.annualIncome, key: "annualIncome", icon: "fa-indian-rupee-sign" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn pb-32">
      <div className="bg-slate-950 p-10 rounded-[4rem] border-2 border-amber-500/20 shadow-3xl text-center relative overflow-hidden">
        <div className="relative z-10 space-y-6">
           <div className="w-28 h-28 mx-auto bg-amber-500 rounded-[2.5rem] flex items-center justify-center text-slate-950 text-4xl shadow-3xl">
              <i className="fas fa-id-card-clip"></i>
           </div>
           <div>
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter royal-serif">{t.sections.profile}</h2>
              <p className="text-amber-500/60 text-xs font-black uppercase tracking-[0.4em] mt-2">Verified Citizen Node v5.5</p>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 p-10 md:p-14 rounded-[4rem] border border-white/5 shadow-2xl space-y-12">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {fields.map((f) => (
              <div key={f.key} className="space-y-2 group">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 transition-colors group-focus-within:text-amber-500">{f.label}</label>
                 <div className="relative">
                    <i className={`fas ${f.icon} absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-all`}></i>
                    <input 
                      type={f.type || "text"}
                      value={(formData as any)[f.key] || ''}
                      onChange={e => setFormData({...formData, [f.key]: e.target.value})}
                      className="w-full bg-slate-950/80 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white focus:border-amber-500/50 outline-none transition-all shadow-inner font-medium"
                    />
                 </div>
              </div>
            ))}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.forms.address}</label>
              <textarea 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full bg-slate-950/80 border border-white/5 rounded-3xl p-8 text-white focus:border-amber-500/50 outline-none transition-all min-h-[140px] font-medium"
                placeholder="पूरी जानकारी लिखें ताकि AI सटीक कानूनी और वित्तीय रिपोर्ट दे सके..."
              />
            </div>
         </div>

         <div className="bg-amber-500/5 p-8 rounded-3xl border border-amber-500/10 flex items-center gap-6">
            <i className="fas fa-shield-halved text-amber-500 text-3xl opacity-50"></i>
            <p className="text-slate-400 text-xs font-bold uppercase leading-relaxed italic">
               * आपकी आय और व्यक्तिगत जानकारी पूरी तरह सुरक्षित है। यह डेटा केवल 'संस्कृति AI' को आपको सटीक सुझाव देने में मदद करता है।
            </p>
         </div>

         <div className="pt-6 border-t border-white/5">
            <button 
              onClick={() => onSave(formData)}
              className="w-full bg-amber-500 text-slate-950 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-amber-400 transition-all shadow-3xl active:scale-95 border-b-4 border-amber-700"
            >
              {t.common.save}
            </button>
         </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
