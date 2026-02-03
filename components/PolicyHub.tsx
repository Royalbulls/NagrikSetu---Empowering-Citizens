
import React, { useState, useEffect } from 'react';

interface PolicyHubProps {
  onBackToLanding?: () => void;
  initialTab?: 'privacy' | 'terms' | 'disclaimer';
}

const PolicyHub: React.FC<PolicyHubProps> = ({ onBackToLanding, initialTab = 'terms' }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'disclaimer'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const companyInfo = {
    name: "Royal Bulls Advisory Private Limited",
    address: "Near Hardaul Temple, Ballabh Nagar Ward, Sagar, Madhya Pradesh, India - 470002",
    email: "legal@rbaadvisor.com",
    domain: "rbaadvisor.com",
    cin: "U74999MP2020PTC052614",
    pan: "AAKCR4091D",
    incorpDate: "02/09/2020",
    omiAppId: "01KGFPDXQKX007MF9PHBQZD6PA"
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      <div className="bg-slate-900 rounded-[3.5rem] p-12 border-2 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none scale-150 rotate-12">
          <i className="fas fa-file-shield text-[200px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">
              कानूनी <span className="text-amber-500">अनुपालन</span>
            </h2>
            {onBackToLanding && (
              <button 
                onClick={onBackToLanding}
                className="bg-slate-800 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all border border-white/5"
              >
                Back to Portal Landing
              </button>
            )}
          </div>
          <p className="text-slate-400 text-xl font-medium max-w-2xl border-l-4 border-amber-500/30 pl-6">
            "NagrikSetu (by Royal Bulls Advisory) is committed to protecting citizen data across all nodes, including Omi Wearable Integration."
          </p>
        </div>
      </div>

      <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-white/5 w-fit mx-auto md:mx-0 overflow-x-auto no-scrollbar">
         <button onClick={() => setActiveTab('privacy')} className={`px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'privacy' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Privacy Policy</button>
         <button onClick={() => setActiveTab('terms')} className={`px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'terms' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Terms of Service</button>
         <button onClick={() => setActiveTab('disclaimer')} className={`px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'disclaimer' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Data & AI Disclosure</button>
      </div>

      <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-3xl border border-white/5 relative">
        <div className="prose prose-invert prose-amber max-w-none text-slate-300 space-y-12">
          
          {activeTab === 'privacy' && (
            <section className="animate-slideUp space-y-8">
              <h3 className="text-4xl font-black text-white mb-8 border-b border-white/10 pb-4 uppercase italic">Privacy Policy</h3>
              
              <div className="bg-amber-500/5 p-8 rounded-3xl border border-amber-500/20">
                <h4 className="text-amber-500 font-black uppercase text-sm tracking-widest mb-4">1. Data Ownership & Transparency</h4>
                <p>This policy is provided by <strong>{companyInfo.name}</strong> (CIN {companyInfo.cin}). We govern all information collected on <strong>{companyInfo.domain}</strong> and through the official Omi Application (ID: <code className="text-amber-500">{companyInfo.omiAppId}</code>).</p>
              </div>

              <div>
                <h4 className="text-white font-black uppercase text-sm tracking-widest mb-4">2. Wearable Audio Processing</h4>
                <p>For users of 'NagrikSetu on Omi', audio data is processed strictly for real-time educational context detection. We do not store raw ambient audio recordings. Only derived educational signals (e.g., detected legal keywords) are used to provide the 'Civic Shield' functionality.</p>
              </div>

              <div className="bg-slate-950 p-8 rounded-3xl border border-white/5">
                <h4 className="text-emerald-500 font-black uppercase text-sm tracking-widest mb-4">3. Use of Google & Platform Data</h4>
                <p>We access Google User Profile info exclusively for authentication and profile personalization. <strong>We DO NOT share your data with third-party agencies.</strong> All processing for App ID <code>{companyInfo.omiAppId}</code> adheres to these standards.</p>
              </div>

              <div className="p-6 border-l-4 border-amber-500 bg-slate-800/50 italic text-sm">
                Last updated: January 2025. Identification Token: {companyInfo.omiAppId}
              </div>
            </section>
          )}

          {activeTab === 'terms' && (
            <section className="animate-slideUp space-y-8">
              <h3 className="text-4xl font-black text-white mb-8 border-b border-white/10 pb-4 uppercase italic">Terms of Service</h3>
              <div className="space-y-8 leading-relaxed">
                <p>By accessing <strong>NagrikSetu</strong> or installing the Omi Application (ID: {companyInfo.omiAppId}), you agree to these Terms.</p>
                
                <div>
                  <h4 className="text-amber-500 font-black uppercase text-sm tracking-widest mb-4">1. Intellectual Property</h4>
                  <p>The 'Sanskriti' AI persona, the 'Pehle vs Aaj' framework, and the NagrikSetu software logic for Omi Node {companyInfo.omiAppId} are protected intellectual property of <strong>{companyInfo.name}</strong>.</p>
                </div>

                <div className="bg-slate-950 p-8 rounded-3xl border border-white/5">
                   <p className="text-xs italic font-bold">Jurisdiction: All legal matters involving Node {companyInfo.omiAppId} are subject to the courts in Sagar, MP, India.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'disclaimer' && (
            <section className="animate-slideUp space-y-8">
              <h3 className="text-4xl font-black text-white mb-8 border-b border-white/10 pb-4 uppercase italic">AI & Ad Disclosure</h3>
              <div className="space-y-8 leading-relaxed">
                <div className="bg-rose-500/10 p-10 rounded-[3rem] border border-rose-500/20">
                   <h4 className="text-rose-400 font-black text-2xl uppercase tracking-tighter mb-4 italic">NagrikSetu on Omi (Wearable)</h4>
                   <p className="text-slate-200 text-lg font-medium">Wearable interactions use the Gemini 2.5 Native Audio API. This service is designed to provide 'ambient civic protection' based on spoken context. Users should be aware that the AI identifies patterns, not individual secrets.</p>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="mt-20 pt-12 border-t border-white/10 text-center space-y-4">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Official Corporate Entity</p>
           <p className="text-white font-black text-sm italic">{companyInfo.name}</p>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Node Identification: {companyInfo.omiAppId}</p>
           <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">{companyInfo.address}</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyHub;
