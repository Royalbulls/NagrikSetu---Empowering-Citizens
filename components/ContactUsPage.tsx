
import React from 'react';

const ContactUsPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const company = "Royal Bulls Advisory Private Limited";
  const address = "Near Hardaul Temple, Ballabh Nagar Ward No. A, Sagar, Madhya Pradesh – 470002, India";
  const email = "royalbullsadvisory412@gmail.com";
  const phone = "7869690819";

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-20 font-sans selection:bg-amber-100">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b-[8px] border-slate-900 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">Contact <span className="text-amber-500">Us</span></h1>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Royal Bulls Advisory Support Hub</p>
          </div>
          {onBack && (
            <button onClick={onBack} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">Back to Home</button>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-10">
            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-400 border-l-4 border-amber-500 pl-4">Head Office</h2>
              <div className="bg-slate-950 text-white p-10 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5 rotate-12"><i className="fas fa-landmark text-[150px]"></i></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-amber-500/60 mb-2">Company Name</p>
                  <p className="font-black text-xl italic uppercase tracking-tighter">{company}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-amber-500/60 mb-2">Registered Address</p>
                  <p className="text-slate-300 font-medium leading-relaxed italic text-lg">"{address}"</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-400 border-l-4 border-amber-500 pl-4">Operating Hours</h2>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 flex items-center justify-between">
                 <div>
                    <p className="font-black text-slate-900 text-lg italic uppercase tracking-tight">Monday to Saturday</p>
                    <p className="font-bold text-amber-600">10:00 AM to 6:00 PM</p>
                 </div>
                 <i className="fas fa-clock text-slate-200 text-4xl"></i>
              </div>
            </section>
          </div>

          <div className="space-y-10">
            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-400 border-l-4 border-amber-500 pl-4">Direct Contact</h2>
              <div className="space-y-4">
                <a href={`tel:${phone}`} className="flex items-center space-x-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-amber-500 transition-all group">
                   <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-amber-500 group-hover:text-white transition-all"><i className="fas fa-phone"></i></div>
                   <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mobile</p><p className="font-black text-2xl tracking-tighter text-slate-900">{phone}</p></div>
                </a>
                <a href={`mailto:${email}`} className="flex items-center space-x-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-amber-500 transition-all group">
                   <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-amber-500 group-hover:text-white transition-all"><i className="fas fa-envelope"></i></div>
                   <div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</p><p className="font-bold text-lg lowercase truncate text-slate-900">{email}</p></div>
                </a>
              </div>
            </section>

            <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 space-y-6">
               <h2 className="text-2xl font-black uppercase italic text-slate-950">Inquiry Types</h2>
               <ul className="space-y-4 text-slate-600 font-bold uppercase text-[11px] tracking-[0.1em]">
                  <li className="flex items-center gap-4"><span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Membership & advisory support</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Payment or technical assistance</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Service-related information</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Partnership and business inquiries</li>
               </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
