
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
    incorpDate: "02/09/2020"
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
            "NagrikSetu (by Royal Bulls Advisory) is committed to protecting citizen data on {companyInfo.domain}."
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
                <p>This policy is provided by <strong>{companyInfo.name}</strong>, officially registered with CIN {companyInfo.cin}. We are the sole owners of the information collected on the domain <strong>{companyInfo.domain}</strong> and through the <strong>NagrikSetu</strong> application.</p>
              </div>

              <div>
                <h4 className="text-white font-black uppercase text-sm tracking-widest mb-4">2. Collection of Google User Data</h4>
                <p>When you use 'Sign in with Google', NagrikSetu accesses your Google User Profile information through OAuth 2.0. We collect and store:</p>
                <ul className="list-disc ml-8 mt-4 space-y-2">
                  <li><strong>Your Name:</strong> To personalize your 'ePaper' and 'Nagrik Ticket' experience.</li>
                  <li><strong>Your Email Address:</strong> To uniquely identify your account and synchronize your 'Knowledge Points' across multiple devices.</li>
                  <li><strong>Your Profile Picture:</strong> To display within your private Dashboard.</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-8 rounded-3xl border border-white/5">
                <h4 className="text-emerald-500 font-black uppercase text-sm tracking-widest mb-4">3. Use and Storage of Data</h4>
                <p>Your Google data is used exclusively for the core functionality of the application (Authentication and Profile Personalization). <strong>We DO NOT share, sell, or trade your Google user data with any third-party marketing agencies or external organizations.</strong></p>
                <p className="mt-4">Data is stored securely using encrypted cloud infrastructure. We retain your profile information only as long as your account remains active.</p>
              </div>

              <div>
                <h4 className="text-white font-black uppercase text-sm tracking-widest mb-4">4. User Rights and Deletion</h4>
                <p>You have full control over your data. At any time, you may request the permanent deletion of your profile and associated knowledge points by contacting us at <strong>{companyInfo.email}</strong>. Once requested, your PII (Personally Identifiable Information) will be purged from our systems within 30 days.</p>
              </div>

              <div className="p-6 border-l-4 border-amber-500 bg-slate-800/50 italic text-sm">
                Last updated: January 2025. Any changes to this policy will be notified prominently on the application login screen.
              </div>
            </section>
          )}

          {activeTab === 'terms' && (
            <section className="animate-slideUp space-y-8">
              <h3 className="text-4xl font-black text-white mb-8 border-b border-white/10 pb-4 uppercase italic">Terms of Service</h3>
              <div className="space-y-8 leading-relaxed">
                <p>By accessing <strong>NagrikSetu</strong>, you agree to be bound by these Terms of Service, all applicable laws and regulations in India, and agree that you are responsible for compliance with any applicable local laws.</p>
                
                <div>
                  <h4 className="text-amber-500 font-black uppercase text-sm tracking-widest mb-4">1. Intellectual Property</h4>
                  <p>All AI-generated insights, historical analysis, and software code provided on NagrikSetu are the intellectual property of <strong>{companyInfo.name}</strong>. Reproduction without written consent is strictly prohibited.</p>
                </div>

                <div>
                  <h4 className="text-amber-500 font-black uppercase text-sm tracking-widest mb-4">2. Accuracy of Information</h4>
                  <p>While we use advanced Google Gemini AI models for civic empowerment, the legal information provided is for educational purposes and does not constitute formal legal advice. For critical court matters, always consult a licensed advocate.</p>
                </div>

                <div className="bg-slate-950 p-8 rounded-3xl border border-white/5">
                   <p className="text-xs italic font-bold">Jurisdiction: All legal matters are subject to the exclusive jurisdiction of the courts in Sagar, Madhya Pradesh, India.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'disclaimer' && (
            <section className="animate-slideUp space-y-8">
              <h3 className="text-4xl font-black text-white mb-8 border-b border-white/10 pb-4 uppercase italic">AI & Ad Disclosure</h3>
              <div className="space-y-8 leading-relaxed">
                <div className="bg-rose-500/10 p-10 rounded-[3rem] border border-rose-500/20">
                   <h4 className="text-rose-400 font-black text-2xl uppercase tracking-tighter mb-4 italic">Google AdSense Disclosure</h4>
                   <p className="text-slate-200 text-lg font-medium">NagrikSetu displays contextual advertisements via Google AdSense to fund AI computation costs and maintain free access for citizens. AdSense may use cookies to serve ads based on your visits to this and other websites.</p>
                </div>

                <div className="bg-blue-500/10 p-10 rounded-[3rem] border border-blue-500/20">
                   <h4 className="text-blue-400 font-black text-2xl uppercase tracking-tighter mb-4 italic">AI Reliability Notice</h4>
                   <p className="text-slate-200 text-lg font-medium">Insights provided by 'Sanskriti' (AI) are generated using state-of-the-art LLMs. Users are encouraged to cross-reference historical dates and specific legal sections with official government gazettes.</p>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="mt-20 pt-12 border-t border-white/10 text-center space-y-4">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Authorized Corporate Office</p>
           <p className="text-white font-black text-sm italic">{companyInfo.name}</p>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">CIN: {companyInfo.cin}</p>
           <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">{companyInfo.address}</p>
           <div className="pt-8 flex justify-center space-x-8">
              <button onClick={() => window.print()} className="text-amber-500 hover:text-amber-400 text-[10px] font-black uppercase tracking-widest border-b border-amber-500/20 pb-1">Download Copy</button>
              <a href={`mailto:${companyInfo.email}`} className="text-amber-500 hover:text-amber-400 text-[10px] font-black uppercase tracking-widest border-b border-amber-500/20 pb-1">Legal Inquiry</a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyHub;
