
import React from 'react';

const GovtPitch: React.FC = () => {
  const budgetData = [
    { area: "AI & Tech Infra", desc: "Cloud, LLM Infrastructure, Security", cost: "₹10 Cr" },
    { area: "Expert Panel", desc: "Legal & Academic Consultants", cost: "₹12 Cr" },
    { area: "Public Outreach", desc: "Digital & Grassroots Awareness", cost: "₹15 Cr" },
    { area: "Research & Data", desc: "Continuous Content Validation", cost: "₹08 Cr" }
  ];

  const roadmap = [
    { year: "वर्ष 1", task: "पायलट लॉन्च", detail: "सागर (म.प्र.) को मॉडल डिस्ट्रिक्ट बनाकर 10 लाख नागरिकों को जोड़ना।" },
    { year: "वर्ष 2", task: "क्षेत्रीय विस्तार", detail: "मध्य प्रदेश के सभी 52 जिलों और बुंदेली/मालवी बोलियों में विस्तार।" },
    { year: "वर्ष 3", task: "प्रशासनिक तालमेल", detail: "CM हेल्पलाइन और डिजिटल इंडिया पोर्टल्स के साथ 'डेटा-शेयरिंग' एकीकरण।" },
    { year: "वर्ष 4", task: "उन्नत निर्णय सहायता", detail: "ग्राम पंचायत स्तर पर डिजिटल विधिक सेवा केंद्रों की स्थापना।" },
    { year: "वर्ष 5", task: "राष्ट्रीय बेंचमार्क", detail: "भारत सरकार के 'E-Governance' मॉडल के रूप में वैश्विक पहचान।" }
  ];

  const sagarSpecials = [
    { title: "स्मार्ट सिटी सागर एकीकरण", icon: "fa-city", desc: "सागर स्मार्ट सिटी प्रोजेक्ट के तहत नागरिकों को प्रशासनिक सेवाओं (नगर निगम, जल, बिजली) के लिए AI-आधारित त्वरित गाइड उपलब्ध कराना।" },
    { title: "सागर रोज़गार सेतु", icon: "fa-people-group", desc: "सागर के स्थानीय कारीगरों, मजदूरों और छोटे व्यापारियों के लिए एक निःशुल्क 'स्किल मार्केट' जहाँ स्थानीय मांग और आपूर्ति का सीधा मिलन हो।" },
    { title: "म.प्र. योजना सहायता", icon: "fa-hand-holding-heart", desc: "लाड़ली बहना, किसान कल्याण और संबल जैसी राज्य की योजनाओं के लिए सरल बुंदेली/हिंदी में पात्रता जाँच और फॉर्म भरने का मार्गदर्शन।" },
    { title: "बुंदेली वॉयस कमांड", icon: "fa-microphone-lines", desc: "शिक्षा के अभाव को दूर करने के लिए बुंदेली बोली में वॉयस-आधारित प्रश्नोत्तर प्रणाली, ताकि ग्रामीण बुजुर्ग भी सशक्त बन सकें।" },
    { title: "पुलिस-नागरिक समन्वय", icon: "fa-building-shield", desc: "सागर पुलिस के लिए FIR ड्राफ्टिंग और प्राथमिक कानूनी जानकारी का टूल, जो थानों में अनावश्यक भीड़ और भ्रम को कम करेगा।" }
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-32 max-w-6xl mx-auto">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 bg-blue-500/10 px-6 py-2 rounded-full border border-blue-500/20 mb-4 shadow-xl">
           <i className="fas fa-landmark text-blue-500 animate-pulse"></i>
           <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Official Stakeholder Presentation (Target: Madhya Pradesh)</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter royal-serif">मिशन <span className="text-amber-500">प्रस्ताव</span></h1>
        <p className="text-slate-500 text-xl font-medium italic">"नागरिक सेतु: आधुनिक प्रशासन और जन-जागरूकता का अभूतपूर्व संगम"</p>
      </header>

      {/* 🏙️ NEW: Sagar & MP Special Proposal Section */}
      <section className="space-y-10">
         <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center text-slate-950 text-4xl shadow-3xl">
               <i className="fas fa-map-location-dot"></i>
            </div>
            <div className="text-center md:text-left">
               <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">सागर एवं म.प्र. <span className="text-amber-500">विशेष विज़न</span></h3>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2 italic">Regional Specialization & Local Impact Strategy</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sagarSpecials.map((item, i) => (
              <div key={i} className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] space-y-6 hover:border-amber-500/30 transition-all group shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><i className={`fas ${item.icon} text-6xl`}></i></div>
                 <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    <i className={`fas ${item.icon}`}></i>
                 </div>
                 <h4 className="text-xl font-black text-white italic uppercase leading-tight">{item.title}</h4>
                 <p className="text-slate-400 text-sm leading-relaxed italic font-medium">"{item.desc}"</p>
              </div>
            ))}
         </div>
      </section>

      <section className="bg-slate-900/50 p-10 md:p-16 rounded-[4rem] border-2 border-white/5 space-y-10 shadow-3xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><i className="fas fa-shield-halved text-[200px]"></i></div>
         <div className="space-y-6 relative z-10">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-widest border-l-4 border-amber-500 pl-6">कार्यकारी सारांश (Executive Summary)</h3>
            <p className="text-slate-300 text-xl leading-relaxed italic font-medium">
               नागरिक सेतु केवल एक सॉफ्टवेयर नहीं है, यह **'Sovereign Intelligence'** का एक माध्यम है जो मध्य प्रदेश के नागरिकों को सशक्त बनाने के लिए तैयार है। यह प्रशासन और जनता के बीच के 'ट्रस्ट गैप' को तकनीक के जरिए भरता है।
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="bg-slate-950 p-8 rounded-[2.5rem] space-y-4 border border-white/5 shadow-xl">
               <h4 className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-3">
                  <i className="fas fa-check-circle text-emerald-500"></i> डिजिटल ई-गवर्नेंस
               </h4>
               <p className="text-slate-500 text-sm italic font-medium leading-relaxed">बिचौलियों और एजेंटों पर निर्भरता खत्म कर सीधे प्रशासन तक पहुँच।</p>
            </div>
            <div className="bg-slate-950 p-8 rounded-[2.5rem] space-y-4 border border-white/5 shadow-xl">
               <h4 className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-3">
                  <i className="fas fa-arrow-up-right-dots text-blue-500"></i> प्रशासनिक दक्षता
               </h4>
               <p className="text-slate-500 text-sm italic font-medium leading-relaxed">सही जानकारी होने से सरकारी दफ्तरों में अनावश्यक भीड़ और गलत आवेदनों में 40% तक की कमी।</p>
            </div>
         </div>
      </section>

      <section className="space-y-12">
         <div className="text-center md:text-left">
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">विकास <span className="text-amber-500">रोडमैप</span> (Strategic Plan)</h3>
         </div>
         <div className="relative pl-8 md:pl-0">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-800 shadow-[0_0_15px_rgba(255,255,255,0.05)]"></div>
            {roadmap.map((item, i) => (
              <div key={i} className={`relative mb-16 md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto md:text-left'}`}>
                 <div className="absolute left-[-42px] md:left-auto md:right-[-12px] top-0 w-6 h-6 rounded-full bg-amber-500 shadow-[0_0_20px_#fbbf24] z-10 animate-pulse"></div>
                 <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-white/5 hover:border-amber-500/40 transition-all shadow-2xl group overflow-hidden">
                    <span className="text-amber-500 font-black text-xs uppercase mb-3 block tracking-widest">{item.year}</span>
                    <h4 className="text-white font-black text-2xl uppercase mb-3 tracking-tight italic group-hover:text-amber-400 transition-colors">{item.task}</h4>
                    <p className="text-slate-400 text-base italic leading-relaxed font-medium">"{item.detail}"</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      <div className="bg-amber-500/10 p-12 md:p-16 rounded-[4rem] border-2 border-dashed border-amber-500/20 text-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50"></div>
         <p className="text-slate-200 italic text-2xl md:text-3xl leading-relaxed font-medium max-w-5xl mx-auto relative z-10">
           "हमारा लक्ष्य किसी भी सरकारी प्रणाली को बदलना नहीं, बल्कि उसे और अधिक पारदर्शी और नागरिक-अनुकूल बनाना है।"
         </p>
      </div>

      <section className="bg-slate-900 p-10 md:p-16 rounded-[4rem] border-2 border-blue-500/20 shadow-3xl">
         <h3 className="text-3xl md:text-4xl font-black text-white italic uppercase mb-12 text-center">वित्तीय <span className="text-blue-500">संसाधन</span> (Implementation Budget)</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {budgetData.map((b, i) => (
              <div key={i} className="bg-slate-950 p-8 rounded-[2.5rem] text-center space-y-5 border border-white/5 shadow-inner group hover:border-blue-500/30 transition-all">
                 <p className="text-white font-black text-xl italic uppercase tracking-tighter">{b.area}</p>
                 <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{b.desc}</p>
                 <div className="text-4xl font-black text-blue-500 tracking-tighter royal-serif">{b.cost}</div>
              </div>
            ))}
         </div>
      </section>

      <div className="flex flex-col md:flex-row gap-6 justify-center">
         <button onClick={() => window.print()} className="bg-white text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl hover:bg-slate-200 transition-all flex items-center gap-3">
            <i className="fas fa-print"></i>
            PRINT DETAILED PROPOSAL
         </button>
         <a href="mailto:royalbullsadvisory412@gmail.com" className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl hover:bg-blue-500 text-center transition-all flex items-center gap-3">
            <i className="fas fa-paper-plane"></i>
            CONTACT MISSION DIRECTORATE
         </a>
      </div>
    </div>
  );
};

export default GovtPitch;
