
import React from 'react';

const PrivacyPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const company = "Royal Bulls Advisory Private Limited";

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-20 font-sans selection:bg-amber-100">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-[8px] border-slate-900 pb-10 gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-slate-950 italic">Privacy <span className="text-amber-500">Policy</span></h1>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[11px]">Official Data Charter for {company}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="bg-slate-100 hover:bg-slate-200 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">Print</button>
            {onBack && (
              <button onClick={onBack} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg">Back</button>
            )}
          </div>
        </header>

        <section className="space-y-12 leading-relaxed text-lg text-slate-700">
          <div className="bg-slate-50 p-10 border-l-8 border-amber-500 rounded-r-[3rem] shadow-sm italic text-slate-900 font-medium">
            <p><strong>{company}</strong> respects and protects your privacy. We are dedicated to ensuring that your personal data is handled with absolute integrity and transparency.</p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase border-b-2 border-slate-200 pb-2 text-slate-950 italic flex items-center gap-4">
              <i className="fas fa-folder-open text-amber-500"></i>
              Information We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-3">
                <p className="font-black text-slate-950 uppercase text-xs tracking-widest border-b pb-2">Personal Identity</p>
                <p className="font-bold text-slate-600">Name, mobile number, and email address.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-3">
                <p className="font-black text-slate-950 uppercase text-xs tracking-widest border-b pb-2">Verification Docs</p>
                <p className="font-bold text-slate-600">Identity and KYC documents (where required for specific services).</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-3">
                <p className="font-black text-slate-950 uppercase text-xs tracking-widest border-b pb-2">Case Context</p>
                <p className="font-bold text-slate-600">Service-related information and advisory query details.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-3">
                <p className="font-black text-slate-950 uppercase text-xs tracking-widest border-b pb-2">Financial Records</p>
                <p className="font-bold text-slate-600">Payment reference and transaction details.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase border-b-2 border-slate-200 pb-2 text-slate-950 italic">Use of Information</h2>
            <p>Your collected information is used exclusively for:</p>
            <ul className="list-disc ml-8 space-y-4 font-bold text-slate-600">
              <li>To provide professional advisory and facilitation services across the NagrikSetu ecosystem.</li>
              <li>To offer responsive customer support and issue resolution.</li>
              <li>To meet mandatory legal, regulatory, and compliance requirements.</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-12 rounded-[3.5rem] border-2 border-amber-100 space-y-8 shadow-inner">
            <h2 className="text-2xl font-black uppercase text-amber-900 italic">Data Sharing & Security</h2>
            <div className="space-y-6">
               <p className="font-medium text-amber-800 italic leading-relaxed">
                 Your information may be shared with <strong>banks, NBFCs, insurance companies, payment gateways, regulators, or law-enforcement authorities</strong> when required by law or for service execution.
               </p>
               <div className="bg-white/60 p-6 rounded-2xl border border-amber-200">
                  <p className="font-black text-slate-900 uppercase tracking-tighter text-xl underline decoration-amber-500 underline-offset-8">
                    We do not sell or rent your personal information to third parties.
                  </p>
               </div>
               <p className="text-sm italic text-amber-700">Appropriate security measures (Encryption & Secure Nodes) are implemented to protect your data across our infrastructure.</p>
            </div>
          </div>

          <div className="pt-20 border-t border-slate-200 text-center opacity-40 font-mono">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Policy Revision: Jan 24, 2025</p>
            <p className="text-[10px] font-black uppercase mt-2">© {company} • सागर, मध्यप्रदेश</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
