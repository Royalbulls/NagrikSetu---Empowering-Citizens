
import React from 'react';

const AboutUsPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const company = "Royal Bulls Advisory Private Limited";

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-20 font-sans selection:bg-amber-100">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b-[8px] border-slate-900 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">Nagrik <span className="text-amber-500">Setu</span></h1>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Operated by Royal Bulls Advisory Private Limited</p>
          </div>
          {onBack && (
            <button onClick={onBack} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">Back to App</button>
          )}
        </header>

        <section className="space-y-12 leading-relaxed text-lg text-slate-700">
          <div className="bg-slate-50 p-10 border-l-8 border-amber-500 rounded-r-[3rem] shadow-sm space-y-6">
            <h2 className="text-3xl font-black text-slate-950 uppercase italic">About Nagrik Setu</h2>
            <p className="font-medium text-slate-700">
              Nagrik Setu is a digital citizen awareness and legal literacy platform operated by <strong>Royal Bulls Advisory Private Limited</strong>.
              The platform is designed to help citizens understand basic legal rights, constitutional processes, and civic responsibilities in simple and accessible language.
            </p>
            <p>
              Nagrik Setu focuses on legal awareness, procedural guidance, and responsible use of lawful mechanisms such as RTI, complaints, and representations.
              We believe that informed citizens strengthen democracy and reduce confusion, misuse, and conflict within public systems.
            </p>
          </div>

          <div className="bg-rose-50 p-10 rounded-[2.5rem] border-2 border-rose-100 shadow-inner space-y-4">
            <h3 className="text-xl font-black uppercase text-rose-600 flex items-center gap-3">
              <i className="fas fa-scale-balanced"></i> Legal Declaration
            </h3>
            <div className="space-y-2 text-rose-900 font-bold italic">
              <p>• Nagrik Setu is not a law firm, legal authority, court, or media organization.</p>
              <p>• It does not provide legal advice or representation.</p>
              <p>• The platform offers informational and educational guidance only, aimed at improving legal awareness and civic understanding among citizens.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-slate-900 text-white p-10 rounded-[3rem] space-y-6">
                <h3 className="text-xl font-black text-amber-500 uppercase tracking-widest">Our Mission</h3>
                <p className="text-slate-300 font-medium italic">"To empower citizens with clear, accurate, and responsible knowledge of laws and civic processes, so that they can interact with institutions confidently, lawfully, and respectfully."</p>
             </div>
             <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 space-y-4">
                <h3 className="text-xl font-black text-slate-900 uppercase">Our Core Work</h3>
                <ul className="space-y-2 text-sm font-bold text-slate-600">
                   <li className="flex gap-2"><i className="fas fa-check text-emerald-500 mt-1"></i> Legal awareness in simple language</li>
                   <li className="flex gap-2"><i className="fas fa-check text-emerald-500 mt-1"></i> Step-by-step procedure explanation</li>
                   <li className="flex gap-2"><i className="fas fa-check text-emerald-500 mt-1"></i> RTI and complaint drafting assistance</li>
                </ul>
             </div>
          </div>

          <div className="bg-blue-50 p-10 rounded-[3rem] border-2 border-blue-100 text-center space-y-4">
             <p className="text-blue-900 font-black text-xl italic">
               "Nagrik Setu is a citizen education and legal awareness platform that helps people understand correct legal procedures, reducing confusion and unnecessary administrative pressure."
             </p>
          </div>

          <div className="pt-20 border-t border-slate-100 text-center opacity-40 font-mono">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">© 2025 Nagrik Setu | Operated by Royal Bulls Advisory Private Limited</p>
            <p className="text-[8px] font-black uppercase mt-2">Legal Awareness & Civic Education Platform</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
