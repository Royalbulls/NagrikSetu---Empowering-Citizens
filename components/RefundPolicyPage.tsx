
import React from 'react';

const RefundPolicyPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const company = "Royal Bulls Advisory Private Limited";

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-20 font-sans selection:bg-rose-50">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b-[8px] border-slate-900 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none text-slate-950">Refund <span className="text-rose-600">& Cancellation</span></h1>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Consumer Protection Protocols for {company}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="bg-slate-100 hover:bg-slate-200 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">Print</button>
            {onBack && (
              <button onClick={onBack} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">Portal</button>
            )}
          </div>
        </header>

        <section className="space-y-12 leading-relaxed text-lg text-slate-700">
          <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] border border-white/5 shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12"><i className="fas fa-hand-holding-dollar text-[150px]"></i></div>
            <p className="font-bold text-xl italic leading-relaxed relative z-10">
              <strong>{company}</strong> offers digital, advisory, and membership-based services. Due to the immediate delivery nature of digital consulting, the following rules apply:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
             <div className="space-y-8">
                <h2 className="text-2xl font-black uppercase border-b-2 border-slate-200 pb-2 text-slate-950 italic flex items-center gap-4">
                  <i className="fas fa-ban text-rose-500"></i>
                  Cancellation
                </h2>
                <ul className="space-y-6">
                   <li className="flex items-start space-x-4 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                      <i className="fas fa-clock text-slate-400 mt-1.5 shrink-0"></i>
                      <span className="font-bold text-slate-800">Cancellation requests may be submitted before service initiation.</span>
                   </li>
                   <li className="flex items-start space-x-4 bg-rose-50 p-8 rounded-3xl border border-rose-100">
                      <i className="fas fa-exclamation-triangle text-rose-600 mt-1.5 shrink-0"></i>
                      <span className="font-black text-rose-900 uppercase tracking-tight text-base">Once the service has started (advisory session or documentation), cancellation will not be accepted.</span>
                   </li>
                </ul>
             </div>

             <div className="space-y-8">
                <h2 className="text-2xl font-black uppercase border-b-2 border-slate-200 pb-2 text-slate-950 italic flex items-center gap-4">
                  <i className="fas fa-rotate-left text-emerald-500"></i>
                  Refund protocol
                </h2>
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 space-y-8 shadow-inner">
                   <div className="space-y-4">
                      <p className="font-black text-rose-600 uppercase tracking-widest text-xs border-b pb-2">Primary Rule</p>
                      <p className="font-bold text-slate-900 text-xl italic">No refunds are provided for digital or advisory services once initiated.</p>
                   </div>
                   
                   <div className="space-y-4">
                      <p className="font-black text-emerald-600 uppercase tracking-widest text-xs border-b pb-2">Eligible Scenarios</p>
                      <ul className="list-disc ml-6 space-y-2 font-bold text-slate-600">
                         <li>Duplicate payments for the same service.</li>
                         <li>Verified technical errors preventing service delivery.</li>
                      </ul>
                   </div>

                   <p className="text-base font-medium border-t pt-4">Eligible refunds are processed within <strong>7 working days</strong>. Payment gateway charges are non-refundable.</p>
                </div>
             </div>
          </div>

          <div className="space-y-6 pt-10">
            <h2 className="text-2xl font-black uppercase border-b-2 border-slate-200 pb-2 text-slate-950 italic">Contact for Disputes</h2>
            <div className="bg-slate-950 text-white p-8 rounded-3xl flex items-center justify-between group shadow-xl">
               <div>
                  <p className="text-[10px] font-black uppercase text-amber-500/60 mb-2">Dedicated Resolution Channel</p>
                  <p className="text-xl font-black tracking-tight italic">royalbullsadvisory412@gmail.com</p>
               </div>
               <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 border border-white/10 group-hover:scale-110 transition-transform">
                  <i className="fas fa-envelope-open-text text-xl"></i>
               </div>
            </div>
          </div>

          <div className="pt-20 border-t border-slate-200 text-center opacity-40 font-mono">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Revised: Jan 24, 2025</p>
            <p className="text-[10px] font-black uppercase mt-2">Royal Bulls Advisory Private Limited • SAGAR (MP)</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
