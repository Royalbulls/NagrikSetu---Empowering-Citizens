import React, { useState } from 'react';

type RBACategory = 'realestate' | 'invest' | 'loans' | 'legal' | 'career';

interface LegalService {
  id: string;
  title: string;
  checklist: string[];
  icon: string;
  color: string;
  priceTag?: string;
}

interface TrainingCourse {
  title: string;
  ct: string; // Classroom Training
  ojt: string; // On Job Training
  fee: string;
  eligibility: string;
  stipend: string;
  bonus: string;
  ctc: string;
  icon: string;
}

interface LoanService {
  title: string;
  desc: string;
  features: string[];
  link: string;
  icon: string;
  color: string;
}

export default function RBAservices() {
  const [activeCat, setActiveCat] = useState<RBACategory>('realestate');
  const [selectedLegal, setSelectedLegal] = useState<LegalService | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    problem: ''
  });

  const myWhatsApp = "917869690819";
  const rahulJainNumber = "919111002225";

  const openWhatsApp = (msg: string, number: string = myWhatsApp) => {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const callNumber = (number: string) => {
    window.location.href = `tel:+${number}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLegal) return;

    const fullMessage = `📝 *New Legal Inquiry from NagrikSetu*
---------------------------------------
👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email}
⚖️ *Service:* ${selectedLegal.title}
❓ *Issue/Details:* ${formData.problem}
---------------------------------------
_Inquiry via RBA Legal Portal._`;

    openWhatsApp(fullMessage);
    setShowForm(false);
    setFormData({ name: '', phone: '', email: '', problem: '' });
  };

  const legalServices: LegalService[] = [
    { id: 'itr', title: "Income Tax Return (ITR)", icon: "fa-file-invoice-dollar", color: "from-blue-600 to-indigo-700", priceTag: "Starts ₹199", checklist: ["Aadhar Card", "Pan Card", "Email ID", "Mobile Number", "Bank Statement"] },
    { id: 'gst', title: "GST Registration", icon: "fa-receipt", color: "from-emerald-600 to-teal-700", priceTag: "Consult ₹499", checklist: ["Aadhar Card", "Pan Card", "Email ID & Mobile", "Bank Details", "Rent Agreement / Electricity Bill", "Photograph"] },
    { id: 'pvt_ltd', title: "Private Limited Company", icon: "fa-building", color: "from-indigo-600 to-blue-800", priceTag: "Formation Elite", checklist: ["Digital Signature & DIN", "Self Attested PAN Card", "Address Proof (Aadhar/Passport/DL)", "Utility Bill (Not older than 2 months)", "1 Passport Photo", "Company Proposed Name (At least 2)", "Object of Business", "Paid up share capital info"] },
    { id: 'startup', title: "Startup Registration", icon: "fa-rocket", color: "from-rose-600 to-orange-700", priceTag: "DPIIT Expert", checklist: ["COI / Registration Certificate & PAN", "Email & Mobile", "Director's Aadhar Card", "Details of Authorised Rep.", "Business Brief & Innovation Notes", "Revenue Model / Pitch Deck", "Authorisation Letter (DPIIT format)"] },
    { id: 'trademark', title: "TradeMark Registration", icon: "fa-registered", color: "from-amber-600 to-yellow-700", priceTag: "Brand Shield", checklist: ["Applicant PAN Card", "Voter ID / Passport / DL", "Brand Name and/or Logo", "MSME/Startup Certificate"] },
    { id: 'fssai', title: "FSSAI (Food License)", icon: "fa-utensils", color: "from-orange-600 to-red-700", priceTag: "Safety Guard", checklist: ["Registration Certificate", "PAN Card", "Authorized Person Address Proof", "Passport Size Photo", "Rent Agreement & Electricity Bill", "Water Test Report (If applicable)", "Turnover Declaration"] },
    { id: 'dsc', title: "Digital Signature (Class-3)", icon: "fa-signature", color: "from-purple-600 to-violet-700", priceTag: "Secure ID", checklist: ["PAN Card", "Aadhar Card", "Photo", "Email ID & Mobile Number"] },
    { id: 'partnership', title: "Partnership Firm", icon: "fa-handshake", color: "from-emerald-500 to-green-700", priceTag: "Deed Expert", checklist: ["Self Attested PAN", "Address Proof of Partners", "1 Passport Photo", "Registered Office Address Proof", "Partnership Firm Name & Object", "Profit Sharing Ratio"] }
  ];

  const trainingCourses: TrainingCourse[] = [
    { title: "Bank Officer", ct: "2 Months", ojt: "2 Months", fee: "₹2,00,000 + GST", eligibility: "Any Graduate", stipend: "₹30,000 CT + ₹20,000 OJT", bonus: "₹1,50,000", ctc: "₹3.5 LPA + PLP", icon: "fa-building-columns" },
    { title: "Customer Service Officer (Valuation)", ct: "1.5 Months", ojt: "1 Month", fee: "₹1,50,000 + GST", eligibility: "Any Graduate", stipend: "₹20,000 CT + ₹10,000 OJT", bonus: "₹1,00,000", ctc: "₹2.7 LPA + PLP (Up to 4 LPA)", icon: "fa-person-circle-check" },
    { title: "Money Officer", ct: "1.5 Months", ojt: "1 Month", fee: "₹1,50,000 + GST", eligibility: "Any Graduate", stipend: "₹20,000 CT + ₹10,000 OJT", bonus: "₹1,50,000", ctc: "₹2.7 LPA (Fixed)", icon: "fa-sack-dollar" },
    { title: "Sales Officer MBL", ct: "1 Month", ojt: "1 Month", fee: "₹1,00,000 + GST", eligibility: "Any Graduate", stipend: "₹10,000 CT + ₹10,000 OJT", bonus: "₹80,000", ctc: "₹2.7 LPA + PLP", icon: "fa-chart-simple" },
    { title: "Relationship Officer GL", ct: "1 Month", ojt: "1 Month", fee: "₹1,00,000 + GST", eligibility: "Any Graduate", stipend: "₹10,000 CT + ₹10,000 OJT", bonus: "₹80,000", ctc: "₹2.7 LPA + PLP", icon: "fa-hand-holding-dollar" },
    { title: "Transaction Officer", ct: "1 Month", ojt: "1 Month", fee: "₹1,00,000 + GST", eligibility: "12th/Graduate", stipend: "₹10,000 CT + ₹10,000 OJT", bonus: "₹50,000", ctc: "₹1.8-2.7 LPA + PLP + Residence", icon: "fa-money-bill-transfer" },
    { title: "Deputy Late Recovery Officer", ct: "1 Month", ojt: "1 Month", fee: "₹80,000 + GST", eligibility: "12th/Graduate", stipend: "₹10,000 CT + ₹10,000 OJT", bonus: "₹50,000", ctc: "₹1.79-2.05 LPA + PLP + Residence", icon: "fa-user-ninja" },
    { title: "Deputy Center Manager (Rural Loans)", ct: "1 Month", ojt: "1 Month", fee: "₹80,000 + GST", eligibility: "12th/Graduate", stipend: "₹10,000 CT + ₹10,000 OJT", bonus: "₹50,000", ctc: "₹1.79-2.05 LPA + PLP + Residence", icon: "fa-wheat-awn" }
  ];

  const loanServices: LoanService[] = [
    {
      title: "Gold Loan",
      desc: "Get a Gold Loan of upto 100% of its value.",
      features: ["No Credit History Required", "Easy and Quick Digital Process", "Best Interest Rates"],
      link: "https://in.faircentpro.com/gold-loan?utm_source=wl&utm_medium=Mailer&campaign_name=Borrower_Partner&agf=WLA101384",
      icon: "fa-coins",
      color: "from-amber-400 to-yellow-600"
    },
    {
      title: "Personal / Business Loan",
      desc: "Get a Personal Loan of upto ₹15 Lakhs or Business Loan of upto ₹90 Lakhs.",
      features: ["No Collateral required", "Easy and Quick Digital Process", "Best Interest Rates"],
      link: "https://in.faircentpro.com/?utm_source=wl&utm_medium=Mailer&campaign_name=Borrower_Partner&agf=WLA101384",
      icon: "fa-sack-dollar",
      color: "from-blue-500 to-indigo-700"
    },
    {
      title: "Loan Against Property (LAP)",
      desc: "Get a Loan Against Property (LAP) of upto ₹20 Crores.",
      features: ["Unlock the value of your property", "Flexible Repayment Tenure", "Transparent Processing"],
      link: "https://in.faircentpro.com/lap?utm_source=wl&utm_medium=Mailer&campaign_name=Borrower_Partner&agf=WLA101384",
      icon: "fa-house-lock",
      color: "from-emerald-500 to-teal-700"
    }
  ];

  return (
    <div className="animate-fadeIn pb-32">
      {/* Premium RBA Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[140%] bg-amber-500/5 blur-[120px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center md:space-x-4 gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-2xl">
                <i className="fas fa-bullseye text-lg md:text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Royal Bulls Advisory</h2>
                <p className="text-amber-500 font-black text-[7px] md:text-[8px] uppercase tracking-[0.4em]">Premium Solutions • Starting @ ₹199</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl italic md:border-l-2 md:border-amber-500/30 md:pl-4">
              "आपकी प्रगति, हमारा संकल्प। रियल एस्टेट से लेकर करियर तक, हर मोड़ पर आपका भरोसेमंद साथी।"
            </p>
          </div>
          <div className="bg-slate-950/80 p-4 md:p-5 rounded-2xl border border-white/5 text-center shrink-0">
             <p className="text-slate-500 font-black uppercase text-[8px] tracking-widest mb-1">Direct Assistance</p>
             <p className="text-amber-500 text-base md:text-lg font-black tracking-tighter">+91 7869690819</p>
          </div>
        </div>
      </div>

      {/* Navigation HUD */}
      <div className="sticky top-0 z-[45] -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
         <div className="flex space-x-2 md:space-x-3 min-w-max pb-1">
            {[
              { id: 'realestate', label: 'Real Estate', icon: 'fa-house-flag' },
              { id: 'invest', label: 'Investment', icon: 'fa-chart-line' },
              { id: 'loans', label: 'Financial Loans', icon: 'fa-sack-dollar' },
              { id: 'legal', label: 'My Legal Clinic', icon: 'fa-gavel' },
              { id: 'career', label: 'Skill & Career', icon: 'fa-graduation-cap' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCat(tab.id as RBACategory)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${activeCat === tab.id ? 'bg-amber-500 text-slate-950 shadow-xl scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-1">
        {/* Real Estate Section */}
        {activeCat === 'realestate' && (
          <div className="space-y-6 md:space-y-10 animate-slideUp">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-slate-900 border-2 border-amber-500/30 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] space-y-6 md:space-y-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform hidden md:block">
                      <i className="fas fa-om text-[150px] text-white"></i>
                   </div>
                   <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between">
                         <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 text-xl shadow-lg">
                            <i className="fas fa-map-location-dot"></i>
                         </div>
                         <span className="bg-white/10 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Ujjain Special</span>
                      </div>
                      <div>
                         <h4 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">उज्जैन: सपनों का आशियाना</h4>
                         <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">महाकाल की नगरी में प्लॉट और मकान के लिए Mr. Rahul Jain (+91 9111002225) से संपर्क करें।</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => callNumber(rahulJainNumber)} className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg hover:bg-emerald-500 transition-all">Call Now</button>
                        <button onClick={() => openWhatsApp("उज्जैन में रियल एस्टेट इंक्वायरी।", rahulJainNumber)} className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg hover:bg-indigo-500 transition-all">WhatsApp</button>
                      </div>
                   </div>
                </div>
                <div className="bg-slate-900 border border-white/5 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] space-y-6 md:space-y-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform hidden md:block"><i className="fas fa-trowel-bricks text-[150px] text-white"></i></div>
                   <div className="space-y-6 relative z-10">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg"><i className="fas fa-building-circle-check"></i></div>
                      <h4 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">इंदौर और सागर: कंस्ट्रक्शन</h4>
                      <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">नक्शा पास और क्वालिटी कंस्ट्रक्शन। हम बनाते हैं घर जो पीढ़ियां याद रखें।</p>
                      <button onClick={() => openWhatsApp("इंदौर/सागर में कंस्ट्रक्शन या प्लॉट के लिए इंक्वायरी।")} className="w-full bg-blue-600 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-black uppercase text-[9px] tracking-widest shadow-3xl hover:bg-blue-500 transition-all">Enquire Now</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Legal Clinic - PRICE TAGGED */}
        {activeCat === 'legal' && (
          <div className="space-y-8 animate-slideUp">
             <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div className="space-y-2 w-full text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">My Legal <span className="text-amber-500">Clinic</span></h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Professional Compliance & Registration Hub • Starting @ ₹199</p>
                </div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {legalServices.map((service) => (
                  <button 
                    key={service.id}
                    onClick={() => { setSelectedLegal(service); setShowForm(true); }}
                    className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 text-left space-y-4 md:space-y-6 hover:border-amber-500/40 transition-all group relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                        <span className="bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{service.priceTag}</span>
                     </div>
                     <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${service.color} rounded-xl md:rounded-2xl flex items-center justify-center text-white text-lg md:text-xl shadow-lg`}>
                        <i className={`fas ${service.icon}`}></i>
                     </div>
                     <div className="space-y-1 relative z-10">
                        <h4 className="text-lg md:text-xl font-black text-white leading-tight uppercase italic">{service.title}</h4>
                        <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">See Documents & Consult</p>
                     </div>
                     <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest">Connect Now</span>
                        <i className="fab fa-whatsapp text-emerald-500 text-lg"></i>
                     </div>
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* Other Sections Placeholder */}
        {(activeCat === 'loans' || activeCat === 'career' || activeCat === 'invest') && (
          <div className="bg-slate-900/50 p-12 md:p-20 rounded-[2.5rem] md:rounded-[4rem] text-center border-2 border-dashed border-white/5 opacity-50">
             <i className="fas fa-hammer text-4xl md:text-6xl mb-6 md:mb-8"></i>
             <h4 className="text-xl md:text-3xl font-black text-white uppercase italic">Active Hub</h4>
             <p className="text-slate-500 max-w-md mx-auto mt-4 font-bold text-xs md:text-base">इस सेक्शन की अधिक जानकारी के लिए सीधे संपर्क करें।</p>
          </div>
        )}
      </div>
    </div>
  );
}