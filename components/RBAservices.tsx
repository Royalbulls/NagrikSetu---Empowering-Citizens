
import React, { useState } from 'react';

type RBACategory = 'finance' | 'legal' | 'career' | 'vision';

interface LegalService {
  title: string;
  items: string[];
  icon: string;
  color: string;
}

export default function RBAservices() {
  const [activeCat, setActiveCat] = useState<RBACategory>('finance');
  const [expandedLegal, setExpandedLegal] = useState<string | null>(null);
  const [feedbackService, setFeedbackService] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  // External Links
  const fiLoanUrl = "https://fi.money/personal-loan-eligibility?utm_source=dsa_individual&utm_medium=dsa_individual&utm_campaign=dsa_royalbullsadvisoryprivatelimited";
  const werizeBusinessUrl = "https://application.werize.com/unsecuredBusinessLoanViral?partnerId=0c3c1920-519c-447c-8239-d02685a241ad";
  const werizePersonalUrl = "https://application.werize.com/home?partnerId=0c3c1920-519c-447c-8239-d02685a241ad";
  const voltMoneyUrl = "https://voltmoney.in/check-loan-eligibility-against-mutual-funds?ref=BXQE8M";

  const legalServices: LegalService[] = [
    { title: "Income Tax (ITR)", icon: "fa-file-invoice-dollar", color: "text-blue-400", items: ["Aadhaar Card", "PAN Card", "Email ID & Mobile", "Bank Statement", "Form 16 (If Salaried)"] },
    { title: "GST Registration", icon: "fa-receipt", color: "text-emerald-400", items: ["PAN & Aadhaar", "Bank Details", "Rent Agreement / Electricity Bill", "Passport Photo"] },
    { title: "Company Setup", icon: "fa-building", color: "text-purple-400", items: ["Pvt Ltd / Public Co", "One Person Company (OPC)", "LLP / Partnership Firm", "Section-8 (NGO) Co"] },
    { title: "Business Licenses", icon: "fa-certificate", color: "text-amber-400", items: ["MSME / Udyam Reg.", "Startup India Reg.", "TradeMark Reg.", "FSSAI Food License", "Digital Signature (DSC)"] }
  ];

  const bankersJobs = [
    { title: "Bank Officer", ctc: "₹3.5 LPA", fee: "₹2L + GST", link: "https://aubankbo.crack-ed.com/portal/register?utm_campaign=AWIPV3477G" },
    { title: "Relationship Officer", ctc: "₹2.7 LPA", fee: "₹1.5L + GST", link: "https://aubank.ro.crack-ed.com/portal/register?utm_campaign=AWIPV3477G" },
    { title: "Sales Officer MBL", ctc: "₹2.7 LPA", fee: "₹1L + GST", link: "https://aubankso.crack-ed.com/portal/register?utm_campaign=AWIPV3477G" }
  ];

  const submitFeedback = (ans: 'yes' | 'no') => {
    setFeedbackService(null);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      {/* Premium RBA Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[4rem] p-12 border-2 border-amber-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[140%] bg-amber-500/5 blur-[120px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center text-slate-950 shadow-2xl border-4 border-slate-900">
                <i className="fas fa-bullseye text-2xl"></i>
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Royal Bulls Advisory</h2>
                <p className="text-amber-500 font-black text-[9px] uppercase tracking-[0.5em] mt-2">Expert Solutions • Premium Dashboard</p>
              </div>
            </div>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl border-l-4 border-amber-500/30 pl-6 italic">
              "हम लाते हैं आपके लिए विशेषज्ञ परामर्श। ऋण, करियर और कानूनी अनुपालन तक, हर कदम पर आपका भरोसेमंद साथी।"
            </p>
          </div>
          <div className="bg-slate-950/80 p-6 rounded-[2rem] border border-white/5 text-center space-y-2 shadow-2xl shrink-0">
             <p className="text-white font-black uppercase text-[10px] tracking-widest italic">Contact Expert</p>
             <p className="text-amber-500 text-xl font-black tracking-tighter">+91 7869690819</p>
             <p className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">Krishna Vishwakrma</p>
          </div>
        </div>
      </div>

      {/* Modern Category Selector */}
      <div className="sticky top-24 z-[40] flex items-center justify-center">
         <div className="bg-slate-900/60 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-white/10 shadow-3xl flex flex-wrap justify-center gap-2">
            {[
              { id: 'finance', label: 'Financing', icon: 'fa-sack-dollar' },
              { id: 'legal', label: 'Legal Clinic', icon: 'fa-gavel' },
              { id: 'career', label: 'Career Hub', icon: 'fa-briefcase' },
              { id: 'vision', label: 'Our Vision', icon: 'fa-eye' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCat(tab.id as RBACategory)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeCat === tab.id ? 'bg-amber-500 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
         </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="min-h-[500px]">
        {activeCat === 'finance' && (
          <div className="space-y-12 animate-slideUp">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* WeRize Business */}
                <div className="bg-slate-900/80 border border-white/5 p-8 rounded-[3rem] space-y-6 hover:border-purple-500/40 transition-all group flex flex-col justify-between shadow-xl">
                   <div className="space-y-4">
                      <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                         <i className="fas fa-briefcase text-xl"></i>
                      </div>
                      <h4 className="text-2xl font-black text-white italic">Unsecured Business Loan</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Up to ₹25 Lakhs • No ITR Required</p>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-1">
                         <p className="text-[9px] text-slate-500 uppercase tracking-widest">Eligibility</p>
                         <p className="text-xs text-white font-bold">Turnover: ₹25k+/mo</p>
                      </div>
                   </div>
                   <a href={werizeBusinessUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-purple-500 shadow-xl transition-all text-center">Apply Now</a>
                </div>

                {/* WeRize Personal */}
                <div className="bg-slate-900/80 border border-white/5 p-8 rounded-[3rem] space-y-6 hover:border-indigo-500/40 transition-all group flex flex-col justify-between shadow-xl">
                   <div className="space-y-4">
                      <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                         <i className="fas fa-user-shield text-xl"></i>
                      </div>
                      <h4 className="text-2xl font-black text-white italic">WeRize Personal Loan</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">₹50K - ₹5 Lakhs • No Collateral</p>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-1">
                         <p className="text-[9px] text-slate-500 uppercase tracking-widest">Salaried</p>
                         <p className="text-xs text-white font-bold">Salary: ₹12k+/mo</p>
                      </div>
                   </div>
                   <a href={werizePersonalUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-indigo-500 shadow-xl transition-all text-center">Check Eligibility</a>
                </div>

                {/* Volt Money */}
                <div className="bg-slate-900/80 border border-white/5 p-8 rounded-[3rem] space-y-6 hover:border-emerald-500/40 transition-all group flex flex-col justify-between shadow-xl">
                   <div className="space-y-4">
                      <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                         <i className="fas fa-chart-line text-xl"></i>
                      </div>
                      <h4 className="text-2xl font-black text-white italic">Credit against MF</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Interest starts 10.49% • 5 Min</p>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-1">
                         <p className="text-[9px] text-slate-500 uppercase tracking-widest">Short-term</p>
                         <p className="text-xs text-white font-bold">Don't sell your MF</p>
                      </div>
                   </div>
                   <a href={voltMoneyUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-emerald-500 shadow-xl transition-all text-center">Empanel Now</a>
                </div>

                {/* Fi Money */}
                <div className="bg-slate-900/80 border border-white/5 p-8 rounded-[3rem] space-y-6 hover:border-emerald-400/40 transition-all group flex flex-col justify-between shadow-xl">
                   <div className="space-y-4">
                      <div className="w-14 h-14 bg-[#00d09c] rounded-2xl flex items-center justify-center text-slate-950 shadow-xl group-hover:scale-110 transition-transform">
                         <i className="fas fa-money-bill-trend-up text-xl"></i>
                      </div>
                      <h4 className="text-2xl font-black text-white italic">Fi Instant Loan</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">₹5 Lakh Max • Digital Process</p>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-1">
                         <p className="text-[9px] text-slate-500 uppercase tracking-widest">Requirement</p>
                         <p className="text-xs text-white font-bold">Salary Account Req.</p>
                      </div>
                   </div>
                   <a href={fiLoanUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#00d09c] text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-emerald-300 shadow-xl transition-all text-center">Apply Fi Money</a>
                </div>
             </div>
          </div>
        )}

        {activeCat === 'legal' && (
          <div className="space-y-8 animate-slideUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {legalServices.map((service, idx) => (
                <div key={idx} className="bg-slate-900 border border-white/5 rounded-[3rem] shadow-xl overflow-hidden group">
                  <button 
                    onClick={() => setExpandedLegal(expandedLegal === service.title ? null : service.title)}
                    className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center space-x-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-slate-950 ${service.color}`}>
                          <i className={`fas ${service.icon}`}></i>
                       </div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{service.title}</h3>
                    </div>
                    <i className={`fas fa-chevron-${expandedLegal === service.title ? 'up' : 'down'} text-slate-700`}></i>
                  </button>
                  
                  {expandedLegal === service.title && (
                    <div className="p-8 pt-0 space-y-8 animate-fadeIn">
                       <div className="h-[1px] bg-white/5 w-full"></div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Checklist:</p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {service.items.map((item, i) => (
                               <li key={i} className="flex items-center text-slate-400 font-bold text-sm bg-slate-950 p-4 rounded-2xl border border-white/5">
                                  <i className="fas fa-circle-check text-emerald-500/50 mr-3 text-[10px]"></i>
                                  {item}
                               </li>
                             ))}
                          </ul>
                       </div>
                       <button 
                         onClick={() => setFeedbackService(service.title)}
                         className="w-full bg-slate-950 border border-amber-500/20 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition-all shadow-lg"
                       >
                         Contact Legal Clinic Agent
                       </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-blue-600/10 border-2 border-blue-500/30 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10">
               <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white uppercase italic">Complete Document Support</h4>
                  <p className="text-slate-400 text-sm">IEC Code, MSME, Startup India, Trademark, DSC, and FSSAI Registration support.</p>
               </div>
               <button onClick={() => setFeedbackService('Custom Compliance')} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shrink-0">Request Full Report</button>
            </div>
          </div>
        )}

        {activeCat === 'career' && (
          <div className="space-y-12 animate-slideUp">
             {/* Corporate Partners Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-[3rem] p-10 border border-blue-500/20 shadow-xl space-y-6 group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-150 transition-transform">
                      <img src="https://static.lenskart.com/media/desktop/img/site-images/logo.svg" className="w-40 grayscale" />
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase italic">Lenskart Career Portal</h4>
                   <p className="text-slate-400 text-sm leading-relaxed">Join India's leading eyewear brand. Roles in Sales & Customer Success. Open for 12th & Graduates.</p>
                   <a href="https://lenskart.crack-ed.com/portal/register?utm_campaign=AWIPV3477G" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all">
                      <span>Register for Lenskart</span>
                      <i className="fas fa-arrow-right"></i>
                   </a>
                </div>

                <div className="bg-slate-900 rounded-[3rem] p-10 border border-purple-500/20 shadow-xl space-y-6 group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-150 transition-transform">
                      <i className="fas fa-building-ngo text-[100px]"></i>
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase italic">Piramal Finance Hub</h4>
                   <p className="text-slate-400 text-sm leading-relaxed">Career opportunities in Banking and Relationship management. Build your professional future with Piramal.</p>
                   <a href="https://piramal.crack-ed.com/portal/register?utm_campaign=AWIPV3477G" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-500 transition-all">
                      <span>Register for Piramal</span>
                      <i className="fas fa-arrow-right"></i>
                   </a>
                </div>
             </div>

             {/* Aurum Bankers Section */}
             <div className="bg-slate-900 p-10 md:p-14 rounded-[4rem] border-2 border-amber-500/10 shadow-2xl space-y-10">
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xs shadow-lg">AU</div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Aurum Bankers Program</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {bankersJobs.map((job, i) => (
                     <div key={i} className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-white/5 space-y-4 hover:border-amber-500/20 transition-all flex flex-col justify-between">
                        <div className="space-y-3">
                           <h5 className="text-lg font-black text-white uppercase">{job.title}</h5>
                           <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest">{job.ctc}</p>
                           <p className="text-slate-500 text-[8px] font-bold uppercase">Fee: {job.fee}</p>
                        </div>
                        <a href={job.link} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-900 text-amber-500 py-3 rounded-xl font-black uppercase text-[8px] tracking-widest text-center border border-amber-500/20 hover:bg-amber-500 hover:text-slate-950 transition-all">Apply to Program</a>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeCat === 'vision' && (
          <div className="space-y-12 animate-slideUp">
             <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent"></div>
                <div className="relative z-10 space-y-6 max-w-2xl text-center md:text-left">
                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">विज़न और उपलब्धता</h3>
                   <p className="text-slate-400 text-xl leading-relaxed">
                     RBA केवल एक डिजिटल प्लेटफॉर्म नहीं है, बल्कि हमारा सागर स्थित कार्यालय स्थानीय रूप से भी उपलब्ध है। हम तकनीक और व्यक्तिगत स्पर्श (Offline Presence) को जोड़कर आपको सर्वोत्तम सेवा देते हैं।
                   </p>
                   <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 pt-4">
                      <div className="flex items-center space-x-3 bg-slate-950 p-4 rounded-2xl border border-white/5">
                         <i className="fas fa-location-dot text-amber-500"></i>
                         <span className="text-[10px] text-slate-300 font-bold uppercase">Sagar, MP (Hardaul Temple)</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-slate-950 p-4 rounded-2xl border border-white/5">
                         <i className="fas fa-globe text-blue-500"></i>
                         <span className="text-[10px] text-slate-300 font-bold uppercase">Online Support: 24/7</span>
                      </div>
                   </div>
                </div>
                <div className="w-48 h-48 bg-slate-950 rounded-full border border-white/5 flex items-center justify-center text-slate-700 animate-spin-slow relative shrink-0">
                   <i className="fas fa-dna text-6xl opacity-20"></i>
                   <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full border-dashed"></div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackService && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/30 p-12 rounded-[4rem] max-w-md w-full shadow-3xl text-center space-y-10">
             <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center text-slate-950 text-3xl mx-auto shadow-2xl">
                <i className="fas fa-user-tie"></i>
             </div>
             <div className="space-y-3">
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Checklist Request</h4>
                <p className="text-slate-400 text-lg leading-relaxed">
                  क्या आपको <span className="text-amber-500 font-black">{feedbackService}</span> के लिए आवश्यक दस्तावेजों की पूरी चेकलिस्ट चाहिए?
                </p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => submitFeedback('yes')}
                  className="bg-amber-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl"
                >
                  हाँ (Yes)
                </button>
                <button 
                  onClick={() => setFeedbackService(null)}
                  className="bg-slate-800 text-slate-400 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-750 transition-all border border-white/5"
                >
                  नहीं (No)
                </button>
             </div>
             <button onClick={() => setFeedbackService(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* Thank You Notification */}
      {showThankYou && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl animate-slideUp">
           <i className="fas fa-check-circle mr-3"></i>
           आपकी रुचि दर्ज की गई! विशेषज्ञ आपसे संपर्क करेंगे।
        </div>
      )}
    </div>
  );
}
