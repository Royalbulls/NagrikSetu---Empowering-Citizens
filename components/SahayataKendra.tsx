
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { firebaseService } from '../services/firebaseService';
import { LocalContext, AssistanceRecord } from '../types';

const SahayataKendra: React.FC<{ context: LocalContext; onEarnPoints: (v: number) => void }> = ({ context, onEarnPoints }) => {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showToken, setShowToken] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleResolve = async () => {
    if (!problem.trim() || !profile.name || !profile.phone) {
        alert("कृपया अपना नाम और मोबाइल नंबर ज़रूर भरें। यह डेटा सरकारी रिकॉर्ड के लिए अनिवार्य है।");
        return;
    }
    setLoading(true);
    setResult(null);
    setShowToken(false);
    setIsLogged(false);

    try {
      const data = await geminiService.findRightDepartment(problem, profile, context);
      setResult(data);
      
      // 🛡️ DATA LOGGING PROTOCOL
      const caseId = `NS-${Math.floor(Math.random()*90000 + 10000)}`;
      const record: AssistanceRecord = {
        caseId,
        timestamp: Date.now(),
        citizenName: profile.name,
        citizenPhone: profile.phone,
        citizenAddress: profile.address,
        problemSummary: problem,
        departmentAssigned: data.department,
        legalStatutes: data.law,
        paymentStatus: 'completed',
        amount: 1
      };
      
      // Save to Firebase for Government/Admin Audit
      await firebaseService.logAssistanceRecord(record);
      setIsLogged(true);
      onEarnPoints(100); 
    } catch (e) {
      console.error(e);
      alert("डेटा सिंक करने में त्रुटि आई। कृपया इंटरनेट चेक करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      {/* 🏥 Help Desk Banner */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-900 to-slate-950 rounded-[3.5rem] p-10 md:p-14 border border-blue-500/30 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.08] pointer-events-none scale-150 rotate-12">
          <i className="fas fa-handshake-angle text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl border-4 border-white/10">
                   <i className="fas fa-phone-volume text-2xl md:text-3xl animate-pulse"></i>
                </div>
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">नागरिक <span className="text-amber-500 underline decoration-white/20">सहायता</span> केंद्र</h2>
                   <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Professional Citizen Guidance • Audit Compliant</p>
                </div>
              </div>
              <div className="bg-amber-500 text-slate-950 px-8 py-3 rounded-2xl font-black text-lg shadow-3xl border-b-4 border-amber-700 flex items-center gap-3">
                 <i className="fas fa-coins text-xl"></i>
                 <span>मात्र ₹1 में समाधान</span>
              </div>
           </div>
           <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-4xl border-l-4 border-blue-500/50 pl-8 py-2">
             "सटीक समाधान के लिए अपना पूरा विवरण भरें। AI आपके नाम और समस्या से स्वतः आपकी पात्रता पहचान लेगा।"
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-10">
              
              {/* Step 1: Citizen Profile */}
              <div className="space-y-6">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                    <i className="fas fa-id-card text-blue-500"></i>
                    नागरिक प्रोफाइल (Professional Entry)
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">पूरा नाम (Full Name with Surname) *</label>
                       <input 
                         type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}
                         className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none" placeholder="अपना पूरा नाम लिखें (उदा: राहुल कुमार वर्मा)"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">मोबाइल नंबर *</label>
                       <input 
                         type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})}
                         className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none" placeholder="+91"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">पता (शहर/गाँव)</label>
                       <input 
                         type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})}
                         className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none" placeholder="शहर, जिला, राज्य"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                    <i className="fas fa-comment-medical text-amber-500"></i>
                    समस्या का विवरण
                 </h3>
                 <textarea 
                   value={problem}
                   onChange={(e) => setProblem(e.target.value)}
                   placeholder="अपनी समस्या का विवरण यहाँ दें..."
                   className="w-full bg-slate-950 border-2 border-white/5 rounded-[2.5rem] p-8 text-white text-lg placeholder:text-slate-800 outline-none focus:border-amber-500/50 min-h-[200px] shadow-inner font-medium leading-relaxed"
                 />
              </div>

              <button 
                onClick={handleResolve}
                disabled={loading || !problem.trim() || !profile.name || !profile.phone}
                className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-lg hover:bg-blue-500 shadow-3xl transition-all h-20 flex items-center justify-center border-b-4 border-blue-800 active:translate-y-1 disabled:opacity-30"
              >
                {loading ? (
                  <div className="flex flex-col items-center">
                    <i className="fas fa-dharmachakra fa-spin text-2xl mb-1"></i>
                    <span className="text-[8px] tracking-widest">विश्लेषण जारी: नाम और क्षेत्र की जाँच...</span>
                  </div>
                ) : "सबमिट एवं समाधान प्राप्त करें"}
              </button>
           </div>

           {result && !loading && (
             <div className="bg-slate-900 p-8 md:p-12 rounded-[4rem] border-2 border-blue-500/20 shadow-3xl animate-slideUp relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none scale-150">
                   <i className="fas fa-building text-[300px] text-white"></i>
                </div>
                
                <div className="space-y-10 relative z-10">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                      <div className="flex items-center space-x-3">
                         <div className={`w-3.5 h-3.5 rounded-full animate-ping ${isLogged ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                         <span className="text-emerald-400 font-black uppercase text-xs tracking-widest">
                            {isLogged ? 'Professional Data Secured' : 'Syncing Record...'}
                         </span>
                      </div>
                      <button onClick={() => setShowToken(true)} className="bg-amber-500 text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-amber-400 transition-all flex items-center gap-3"><i className="fas fa-ticket"></i><span>आधिकारिक पत्र (Referral Ticket)</span></button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h4 className="text-amber-500 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                           <i className="fas fa-map-pin"></i> कहाँ जाना है? (Target Office)
                         </h4>
                         <div className="bg-slate-950 p-8 rounded-3xl border border-white/5 shadow-inner">
                            <p className="text-white text-2xl font-black italic tracking-tighter uppercase mb-2">{result.department}</p>
                            <p className="text-slate-400 text-sm font-bold border-l-2 border-amber-500/40 pl-4">पहुँचें: "{result.officeLocation}"</p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-blue-400 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                           <i className="fas fa-phone"></i> हेल्पलाइन नंबर (Contact Details)
                         </h4>
                         <div className="bg-slate-950 p-8 rounded-3xl border border-white/5 shadow-inner flex flex-col justify-center">
                            <p className="text-white text-4xl font-black tracking-widest text-center">{result.helpline}</p>
                            <p className="text-slate-500 text-[9px] font-black uppercase text-center mt-3 tracking-widest">Official Helpline</p>
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5 space-y-4">
                      <h4 className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">दस्तावेज़ सूची (Checklist)</h4>
                      <div className="flex flex-wrap gap-3">
                         {result.docs.map((doc: string, i: number) => (
                           <span key={i} className="bg-white/5 px-4 py-2 rounded-xl text-slate-300 text-xs font-bold border border-white/5 flex items-center gap-2">
                             <i className="fas fa-check-double text-emerald-500"></i> {doc}
                           </span>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">प्रक्रिया (Action Plan)</h4>
                      <div className="grid grid-cols-1 gap-4">
                         {result.steps.map((step: string, i: number) => (
                           <div key={i} className="flex items-center gap-6 bg-slate-950 p-6 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                              <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0">{i+1}</span>
                              <p className="text-slate-200 text-lg font-medium">{step}</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-amber-500/5 p-8 rounded-[2.5rem] border-2 border-dashed border-amber-500/20 text-center italic">
                      <p className="text-amber-500 font-black text-xs uppercase tracking-widest mb-2">💡 प्रोफेशनल टिप</p>
                      <p className="text-slate-300 text-lg font-medium">"{result.tip}"</p>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-xl space-y-6">
              <div className="flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase">
                 <i className="fas fa-server"></i>
                 <span>Secure Record Log</span>
              </div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest border-b border-white/5 pb-4">जवाबदेही और सुरक्षा</h4>
              <p className="text-slate-500 text-sm leading-relaxed italic">
                हम आपके 'पूरे नाम' और 'समस्या' का विश्लेषण करके स्वतः यह पता लगाते हैं कि आप किन सरकारी लाभों के पात्र हैं। आपकी प्राइवेसी हमारी जिम्मेदारी है।
              </p>
           </div>

           <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-xl space-y-6 text-center">
              <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center mx-auto border-4 border-blue-500/20 shadow-2xl">
                 <i className="fas fa-building-shield text-blue-500 text-3xl"></i>
              </div>
              <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Audit Compliant</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                 रसीद पर दिया गया विवरण सरकारी रिकॉर्ड में सुरक्षित है। इसे आप अपनी सहायता के लिए इस्तेमाल कर सकते हैं।
              </p>
           </div>
        </div>
      </div>

      {/* 🎟️ Professional Ticket Modal */}
      {showToken && result && (
        <div className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-6 animate-fadeIn overflow-y-auto">
           <div className="max-w-xl w-full bg-white rounded-[3.5rem] p-1 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-slideUp my-auto">
              <div className="bg-white rounded-[3.3rem] overflow-hidden border-8 border-slate-50">
                 <div className="bg-slate-900 p-10 text-white space-y-4 relative">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">Official Assistance Referral</p>
                          <h4 className="text-3xl font-black uppercase tracking-tighter leading-none italic">नागरिक टिकट (Nagrik Ticket)</h4>
                       </div>
                       <i className="fas fa-landmark text-4xl text-white/20"></i>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                       <span>Secure Record Log</span>
                       <span>ID: #NS-{Math.floor(Math.random()*90000 + 10000)}</span>
                    </div>
                 </div>

                 <div className="bg-slate-50 p-8 border-b border-dashed border-slate-200 grid grid-cols-1 gap-6">
                    <div className="space-y-1"><p className="text-[8px] font-black text-slate-400 uppercase">नागरिक</p><p className="text-sm font-black text-slate-900">{profile.name}</p></div>
                 </div>

                 <div className="p-10 space-y-10 text-slate-900">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">सम्बन्धित विभाग (Assigned Dept)</p>
                       <p className="text-xl font-black uppercase text-slate-900 leading-tight">{result.department}</p>
                    </div>

                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">कार्यालय का पता (Office Address)</p>
                       <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{result.officeLocation}"</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">हेल्पलाइन नंबर</p>
                          <p className="text-2xl font-black text-blue-700 tracking-widest">{result.helpline}</p>
                       </div>
                       <i className="fas fa-phone-flip text-2xl text-slate-200"></i>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                       <i className="fas fa-qrcode text-6xl text-slate-200"></i>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase">दिनांक</p>
                          <p className="text-sm font-black">{new Date().toLocaleDateString()}</p>
                          <div className="bg-emerald-100 px-3 py-1 rounded mt-2 text-emerald-700 text-[10px] font-black uppercase italic">Professional Log Validated</div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-slate-950 p-6 flex gap-4">
                    <button onClick={() => window.print()} className="flex-1 bg-white text-slate-950 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-200 transition-all">Print Ticket</button>
                    <button onClick={() => setShowToken(false)} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl">Close</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SahayataKendra;
