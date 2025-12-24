
import React, { useState } from 'react';

const PolicyHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'disclaimer'>('terms');

  const companyInfo = {
    name: "Royal Bulls Advisory Private Limited",
    address: "Near Hardaul Temple, Ballabh Nagar Ward, Sagar, Madhya Pradesh, India - 470002",
    email: "legal@nagriksetu.ai"
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      <div className="bg-slate-900 rounded-[3.5rem] p-12 border-2 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none scale-150 rotate-12">
          <i className="fas fa-file-shield text-[200px] text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">
            कानूनी <span className="text-amber-500">नीतियां</span> (Policies)
          </h2>
          <p className="text-slate-400 text-xl font-medium max-w-2xl border-l-4 border-amber-500/30 pl-6">
            "पारदर्शिता और विश्वास ही हमारे सेतु की नींव हैं। कृपया हमारी सेवा की शर्तों और गोपनीयता नीति को ध्यान से पढ़ें।"
          </p>
        </div>
      </div>

      <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-white/5 w-fit mx-auto md:mx-0">
         <button onClick={() => setActiveTab('terms')} className={`px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'terms' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Terms of Service</button>
         <button onClick={() => setActiveTab('privacy')} className={`px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'privacy' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Privacy Policy</button>
         <button onClick={() => setActiveTab('disclaimer')} className={`px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'disclaimer' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>AI Disclaimer</button>
      </div>

      <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-3xl border border-white/5 relative">
        <div className="prose prose-invert prose-amber max-w-none text-slate-300 space-y-12">
          {activeTab === 'terms' && (
            <section className="animate-slideUp">
              <h3 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4 uppercase italic">Terms and Conditions</h3>
              <div className="space-y-8 leading-relaxed">
                <p>Welcome to <strong>NagrikSetu</strong>. By accessing this platform, you agree to comply with the following terms, provided by <strong>{companyInfo.name}</strong>.</p>
                
                <div>
                  <h4 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">1. Use of Service</h4>
                  <p>NagrikSetu is an educational AI tool designed to promote citizen awareness. It is not a substitute for professional legal advice or government portals. You must use the service for lawful purposes only.</p>
                </div>

                <div>
                  <h4 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">2. Intellectual Property</h4>
                  <p>All content, algorithms, UI designs, and brand elements are the exclusive property of <strong>{companyInfo.name}</strong>. Reproduction without consent is strictly prohibited.</p>
                </div>

                <div>
                  <h4 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">3. Limitation of Liability</h4>
                  <p>While we strive for accuracy via Google Gemini AI, <strong>{companyInfo.name}</strong> is not responsible for any decisions made based on the information provided by the AI. Users are encouraged to verify critical legal information with certified professionals.</p>
                </div>

                <div className="bg-slate-950 p-8 rounded-3xl border border-white/5">
                   <p className="text-xs italic font-bold">Jurisdiction: These terms are governed by the laws of India, specifically the courts in Sagar, Madhya Pradesh.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'privacy' && (
            <section className="animate-slideUp">
              <h3 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4 uppercase italic">Privacy Policy</h3>
              <div className="space-y-8 leading-relaxed">
                <p>At NagrikSetu, your privacy is our priority. This policy outlines how <strong>{companyInfo.name}</strong> handles your data.</p>
                
                <div>
                  <h4 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">1. Data Collection</h4>
                  <p>We collect minimal data including your name, email (via Firebase Auth), and location (if granted) to provide personalized legal and historical context.</p>
                </div>

                <div>
                  <h4 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">2. AI Processing</h4>
                  <p>Your search queries are processed via Google Gemini API. These prompts are used to generate responses. We do not sell your personal search history to third-party advertisers.</p>
                </div>

                <div>
                  <h4 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">3. Data Security</h4>
                  <p>We utilize industry-standard encryption for data at rest and in transit. Your local data (saved sessions) remains on your device until synced with our secure cloud servers.</p>
                </div>

                <div className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/10">
                   <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest flex items-center">
                     <i className="fas fa-shield-check mr-3"></i> GDRP & Indian Data Protection Compliant (Alignment)
                   </p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'disclaimer' && (
            <section className="animate-slideUp">
              <h3 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4 uppercase italic">AI & Legal Disclaimer</h3>
              <div className="space-y-8 leading-relaxed">
                <div className="bg-rose-500/10 p-10 rounded-[3rem] border border-rose-500/20 mb-10">
                   <h4 className="text-rose-400 font-black text-2xl uppercase tracking-tighter mb-4 italic">Important Warning</h4>
                   <p className="text-slate-200 text-lg font-medium">NagrikSetu uses artificial intelligence (AI) to generate information. AI can occasionally produce "hallucinations" or incorrect facts. Information provided here regarding Indian Law, Property, or Finance is for <strong>GENERAL INFORMATION ONLY</strong>.</p>
                </div>

                <ul className="space-y-4">
                   <li className="flex items-start space-x-4">
                      <i className="fas fa-ban text-rose-500 mt-1.5"></i>
                      <span>This app does not provide binding legal counsel.</span>
                   </li>
                   <li className="flex items-start space-x-4">
                      <i className="fas fa-ban text-rose-500 mt-1.5"></i>
                      <span>We are not a law firm or a government agency.</span>
                   </li>
                   <li className="flex items-start space-x-4">
                      <i className="fas fa-check-circle text-amber-500 mt-1.5"></i>
                      <span>Always consult with a licensed lawyer or visit an official government office (like the Collectorate or Police Station) for legal proceedings.</span>
                   </li>
                </ul>
              </div>
            </section>
          )}
        </div>

        <div className="mt-20 pt-12 border-t border-white/10 text-center space-y-4">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Official Registered Address</p>
           <p className="text-white font-black text-sm italic">{companyInfo.name}</p>
           <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">{companyInfo.address}</p>
           <div className="pt-8 flex justify-center space-x-8">
              <button onClick={() => window.print()} className="text-amber-500 hover:text-amber-400 text-[10px] font-black uppercase tracking-widest border-b border-amber-500/20 pb-1">Print Policy</button>
              <a href={`mailto:${companyInfo.email}`} className="text-amber-500 hover:text-amber-400 text-[10px] font-black uppercase tracking-widest border-b border-amber-500/20 pb-1">Contact Legal</a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyHub;
