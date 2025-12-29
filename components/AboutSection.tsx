import React from 'react';

const AboutSection: React.FC = () => {
  const companyInfo = {
    name: "Royal Bulls Advisory Private Limited",
    cin: "U74999MP2020PTC052614",
    incorpDate: "02/09/2020",
    pan: "AAKCR4091D",
    address: "Near Hardaul Temple, Ballabh Nagar Ward, Sagar, Madhya Pradesh, India - 470002"
  };

  const directors = [
    { name: "Krishna Vishwakarma", role: "Managing Director", icon: "fa-user-tie" },
    { name: "Vandana Thakur", role: "Director", icon: "fa-user-shield" }
  ];

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      {/* Hero Banner */}
      <div className="bg-slate-900 rounded-[3rem] p-12 border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none scale-150">
          <i className="fas fa-users-gear text-[200px] text-blue-500"></i>
        </div>
        <div className="relative z-10 space-y-6 max-w-4xl">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-tight">
            NagrikSetu के <span className="text-blue-500">फाउंडर्स</span> और विज़न
          </h2>
          <p className="text-slate-300 text-xl font-medium leading-relaxed">
            "नागरिक सेतु" (NagrikSetu) केवल एक ऐप नहीं, बल्कि एक आधुनिक लोकतांत्रिक आंदोलन है। हमारा उद्देश्य तकनीक (AI) के माध्यम से हर उस नागरिक तक पहुँच बनाना है जो अपने अधिकारों और इतिहास से वंचित है।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Founders / Directors Card */}
        <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-xl space-y-8 hover:border-blue-500/30 transition-all group">
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white italic">Board of Directors</h3>
            <p className="text-blue-500 font-black uppercase tracking-widest text-xs">The Visionaries behind the platform</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {directors.map((director, i) => (
              <div key={i} className="bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-3">
                 <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-slate-950 text-xl shadow-lg">
                    <i className={`fas ${director.icon}`}></i>
                 </div>
                 <div>
                    <p className="text-white font-black text-sm">{director.name}</p>
                    <p className="text-slate-500 font-black uppercase text-[8px] tracking-widest">{director.role}</p>
                 </div>
              </div>
            ))}
          </div>

          <p className="text-slate-400 text-base leading-relaxed italic">
            इन्होंने इस डिजिटल सेतु की नींव रखी ताकि दुनिया भर का ज्ञान, विशेषकर कानून और इतिहास, एक साधारण मोबाइल यूज़र की पहुँच में हो। 
          </p>
        </div>

        {/* Corporate Identity Card */}
        <div className="bg-slate-950 p-10 rounded-[3rem] border-2 border-amber-500/20 shadow-xl space-y-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
              <i className="fas fa-certificate text-6xl text-amber-500"></i>
           </div>
           <div className="space-y-2">
             <h3 className="text-3xl font-black text-white italic">Legal Identity</h3>
             <p className="text-amber-500 font-black uppercase tracking-widest text-[9px]">Verified Corporate Entity</p>
           </div>
           <div className="space-y-4">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-600 uppercase">Registered Name</p>
                 <p className="text-white font-black">{companyInfo.name}</p>
              </div>
              <div className="flex gap-8">
                <div className="space-y-1 flex-1">
                   <p className="text-[10px] font-black text-slate-600 uppercase">CIN</p>
                   <p className="text-amber-500 font-mono font-bold text-xs">{companyInfo.cin}</p>
                </div>
                <div className="space-y-1 flex-1">
                   <p className="text-[10px] font-black text-slate-600 uppercase">Date of Inc.</p>
                   <p className="text-white font-mono font-bold text-xs">{companyInfo.incorpDate}</p>
                </div>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-600 uppercase">Registered Address</p>
                 <p className="text-slate-400 text-xs leading-relaxed">{companyInfo.address}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Company Philosophy */}
      <div className="bg-slate-900/50 p-12 rounded-[4rem] border border-white/5 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
           <div className="space-y-4">
              <i className="fas fa-eye text-blue-500 text-3xl"></i>
              <h4 className="text-xl font-black text-white uppercase">विज़न (Vision)</h4>
              <p className="text-slate-400 text-sm leading-relaxed">भारत के हर गाँव और शहर को एक 'जागरूक नागरिक केंद्र' बनाना जहाँ कानून की जानकारी उंगलियों पर हो।</p>
           </div>
           <div className="space-y-4 border-y lg:border-y-0 lg:border-x border-white/5 py-8 lg:py-0 lg:px-8">
              <i className="fas fa-bullseye text-amber-500 text-3xl"></i>
              <h4 className="text-xl font-black text-white uppercase">मिशन (Mission)</h4>
              <p className="text-slate-400 text-sm leading-relaxed">इतिहास की भूलों को सुधारना और भविष्य के लिए एक ऐसी पीढ़ी तैयार करना जो तर्कों और तथ्यों पर आधारित हो।</p>
           </div>
           <div className="space-y-4">
              <i className="fas fa-shield-halved text-emerald-500 text-3xl"></i>
              <h4 className="text-xl font-black text-white uppercase">मूल्य (Values)</h4>
              <p className="text-slate-400 text-sm leading-relaxed">सत्य, पारदर्शिता, और तकनीक का समावेशी उपयोग। हम डेटा प्राइवेसी और मानवीय सम्मान को सर्वोपरि रखते हैं।</p>
           </div>
        </div>
      </div>

      {/* Connect Section */}
      <div className="bg-blue-600 rounded-[3rem] p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
           <h3 className="text-3xl font-black text-white">NagrikSetu से जुड़ें</h3>
           <p className="text-blue-100 font-medium">क्या आपके पास हमारे लिए कोई सुझाव है? हम आपकी बात सुनना चाहते हैं।</p>
        </div>
        <div className="flex gap-4">
           <a href="mailto:support@nagriksetu.ai" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Email Us</a>
           <button className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Partner with Us</button>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;