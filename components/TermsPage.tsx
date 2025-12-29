
import React from 'react';

const TermsPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const company = "Royal Bulls Advisory Private Limited";

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-20 font-sans selection:bg-slate-100">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-[8px] border-slate-900 pb-10 gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-slate-950 italic">Terms <span className="text-amber-500">& Conditions</span></h1>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[11px]">Usage Framework for {company}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="bg-slate-100 hover:bg-slate-200 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">Print</button>
            {onBack && (
              <button onClick={onBack} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg">Home</button>
            )}
          </div>
        </header>

        <section className="space-y-12 leading-relaxed text-lg text-slate-700">
          <p className="italic text-2xl font-bold text-slate-900 border-l-8 border-slate-900 pl-8 py-4 bg-slate-50 rounded-r-[2rem]">
            <strong>{company}</strong> operates exclusively as an advisory and facilitation platform.
          </p>

          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase border-b-2 border-slate-200 pb-2 text-slate-950 italic flex items-center gap-4">
              <i className="fas fa-key text-amber-500"></i>
              Key Platform Terms
            </h2>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <i className="fas fa-info-circle text-amber-600 mt-1.5 shrink-0"></i>
                <span className="font-bold">We do not provide guarantees for approvals, returns, or outcomes of any third-party product or legal petition.</span>
              </li>
              <li className="flex items-start space-x-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <i className="fas fa-info-circle text-amber-600 mt-1.5 shrink-0"></i>
                <span className="font-bold">Final decisions rest solely with third-party institutions (Banks, NBFCs, Insurance Companies, or Government Authorities).</span>
              </li>
              <li className="flex items-start space-x-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <i className="fas fa-info-circle text-amber-600 mt-1.5 shrink-0"></i>
                <span className="font-bold">All information provided on NagrikSetu and by RBA Advisor is for guidance and educational purposes only.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-45"><i className="fas fa-user-check text-[150px]"></i></div>
            <h2 className="text-2xl font-black uppercase text-amber-500 italic relative z-10">User Responsibilities</h2>
            <ul className="space-y-4 relative z-10">
               <li className="flex items-start space-x-4 border-b border-white/10 pb-4">
                 <span className="w-6 h-6 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-1">1</span>
                 <span className="font-medium">Provide accurate, complete, and truthful information during consultation.</span>
               </li>
               <li className="flex items-start space-x-4 border-b border-white/10 pb-4">
                 <span className="w-6 h-6 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-1">2</span>
                 <span className="font-medium">Avoid misuse of the platform, its AI services, or trademarks.</span>
               </li>
               <li className="flex items-start space-x-4 border-b border-white/10 pb-4">
                 <span className="w-6 h-6 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-1">3</span>
                 <span className="font-medium">Comply with all applicable Indian laws and regulations during use.</span>
               </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase border-b-2 border-slate-200 pb-2 text-slate-950 italic">Liability & Venue</h2>
            <p className="font-medium leading-relaxed">The company shall not be liable for any indirect loss, delay, rejection, or third-party decision. Our role is limited to professional facilitation.</p>
            <div className="bg-rose-50 p-10 rounded-[2.5rem] border-2 border-rose-100">
               <p className="text-sm font-black uppercase tracking-[0.3em] text-rose-900 mb-2">Legal Jurisdiction</p>
               <p className="text-xl font-black italic text-slate-950">All disputes shall be subject to the exclusive jurisdiction of the courts in Sagar, Madhya Pradesh, India.</p>
            </div>
          </div>

          <div className="pt-20 border-t border-slate-200 text-center opacity-40 font-mono">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Updated: Jan 24, 2025</p>
            <p className="text-[10px] font-black uppercase mt-2">Royal Bulls Advisory Private Limited • Authorized Node</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
