
import React, { useState } from 'react';

const DocumentationHub: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('impact');

  const docMenu = [
    { id: 'impact', title: 'पेशेवर एवं नागरिक लाभ', icon: 'fa-user-tie' },
    { id: 'casestudy', title: 'केस स्टडी (उदाहरण)', icon: 'fa-file-signature' },
    { id: 'intro', title: 'प्लेटफॉर्म परिचय', icon: 'fa-book-open' },
    { id: 'edu', title: 'Learn & Earn (पॉइंट्स)', icon: 'fa-graduation-cap' },
    { id: 'legal', title: 'सहायता केंद्र (Help Desk)', icon: 'fa-building-shield' },
    { id: 'rba', title: 'RBA प्रीमियम सेवाएं', icon: 'fa-crown' },
    { id: 'omi', title: 'ओमी वियरेबल (Omi)', icon: 'fa-microchip' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 animate-fadeIn pb-32 max-w-7xl mx-auto px-6">
      <div className="pt-24 space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-2 border-white/5 pb-10">
          <div className="space-y-4">
             <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter royal-serif">प्लेटफॉर्म <span className="text-amber-500">गाइड</span></h1>
             <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[11px]">Official Professional Manual & Citizen Handbook</p>
          </div>
          {onBack && (
            <button onClick={onBack} className="bg-white text-slate-950 px-10 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all shadow-xl">Back to Portal</button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Sidebar Menu */}
           <div className="lg:col-span-3 space-y-4">
              {docMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-left ${activeSection === item.id ? 'bg-amber-500 text-slate-950 font-black shadow-xl' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'}`}
                >
                  <i className={`fas ${item.icon} text-lg w-6`}></i>
                  <span className="text-xs uppercase tracking-widest">{item.title}</span>
                </button>
              ))}
           </div>

           {/* Content Area */}
           <div className="lg:col-span-9 bg-slate-900/50 p-10 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <i className="fas fa-file-invoice text-[400px] text-white"></i>
              </div>

              {activeSection === 'impact' && (
                <div className="animate-slideUp space-y-12 relative z-10">
                   <div className="space-y-4">
                      <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">किताबें नहीं, <span className="text-amber-500">सीधा समाधान</span></h2>
                      <p className="text-slate-400 text-lg leading-relaxed italic">
                        "नागरिक सेतु का लक्ष्य 140 करोड़ नागरिकों और लाखों पेशेवरों का काम आसान बनाना है। अब आपको कानून और नियमों के लिए मोटी किताबें नहीं खोलनी पड़ेंगी।"
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-slate-950 p-8 rounded-3xl border border-blue-500/20 shadow-xl group hover:border-blue-500/50 transition-all">
                         <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-2xl">
                            <i className="fas fa-scale-balanced"></i>
                         </div>
                         <h3 className="text-xl font-black text-white uppercase italic mb-4">वकीलों के लिए (For Advocates)</h3>
                         <ul className="space-y-4 text-sm text-slate-400 italic">
                            <li className="flex gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> <strong>त्वरित रिसर्च:</strong> धारा (Section) का नाम बोलें और उसका विस्तृत इतिहास एवं वर्तमान स्थिति जानें।</li>
                            <li className="flex gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> <strong>केस ड्राफ्टिंग:</strong> AI की मदद से कानूनी शब्दावली में सटीक आवेदन पत्र (Drafts) तैयार करें।</li>
                            <li className="flex gap-3"><i className="fas fa-check text-blue-500 mt-1"></i> <strong>समय की बचत:</strong> जो रिसर्च 5 घंटे लेती थी, वह अब 5 मिनट में संभव है।</li>
                         </ul>
                      </div>

                      <div className="bg-slate-950 p-8 rounded-3xl border border-emerald-500/20 shadow-xl group hover:border-emerald-500/50 transition-all">
                         <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-2xl">
                            <i className="fas fa-building-user"></i>
                         </div>
                         <h3 className="text-xl font-black text-white uppercase italic mb-4">सरकारी कर्मचारियों के लिए</h3>
                         <ul className="space-y-4 text-sm text-slate-400 italic">
                            <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> <strong>SOP की जानकारी:</strong> किसी भी प्रशासनिक प्रक्रिया के ताज़ा सरकारी नियम तुरंत देखें।</li>
                            <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> <strong>डिजिटल ऑडिट:</strong> सरकारी योजनाओं की पात्रता तुरंत जांचें।</li>
                         </ul>
                      </div>
                   </div>
                </div>
              )}

              {activeSection === 'casestudy' && (
                <div className="animate-slideUp space-y-12 relative z-10">
                   <div className="space-y-4">
                      <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">वास्तविक <span className="text-blue-500">प्रभावी उदाहरण</span></h2>
                      <p className="text-slate-400 text-lg leading-relaxed italic">"कैसे नागरिक सेतु ने एक जटिल समस्या को चुटकियों में सुलझाया।"</p>
                   </div>

                   <div className="bg-slate-950 p-10 rounded-[3rem] border border-blue-500/20 space-y-8">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic">1</div>
                         <h3 className="text-xl font-black text-white uppercase italic">प्रॉपर्टी और उत्तराधिकार विवाद</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">चुनौती (Problem)</p>
                            <p className="text-slate-300 italic leading-relaxed font-medium">"रामजी के दादाजी की ज़मीन थी, लेकिन उनके पास कोई कानूनी वंशावली नहीं थी। वकील को केस समझाने में हफ्तों लग रहे थे और मोटी किताबें पलटने के बाद भी सही धारा नहीं मिल रही थी।"</p>
                         </div>
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">समाधान (Solution)</p>
                            <p className="text-slate-300 italic leading-relaxed font-medium">"रामजी ने 'नागरिक सेतु' के वंश-वृक्ष (Family Tree) टूल का उपयोग किया। AI ने सभी वारिसों की सूची बनाई और 'Succession Audit' से बताया कि हिंदू उत्तराधिकार अधिनियम के तहत उनका क्या हिस्सा है। वकील ने बस उस रिपोर्ट को देखा और 5 मिनट में केस तैयार कर दिया।"</p>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeSection === 'intro' && (
                <div className="animate-slideUp space-y-10 relative z-10">
                   <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">नागरिक सेतु क्या है?</h2>
                   <div className="prose prose-invert prose-amber max-w-none text-slate-400 text-lg leading-relaxed">
                      <p>
                        <strong>नागरिक सेतु (NagrikSetu)</strong> एक बहुआयामी डिजिटल प्लेटफॉर्म है जिसे <strong>Royal Bulls Advisory Pvt Ltd</strong> द्वारा नागरिकों को कानूनी और ऐतिहासिक रूप से सशक्त बनाने के लिए बनाया गया है।
                      </p>
                   </div>
                </div>
              )}

              {activeSection === 'edu' && (
                <div className="animate-slideUp space-y-10 relative z-10">
                   <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Education: Learn & Earn</h2>
                   <div className="prose prose-invert max-w-none text-slate-400 text-lg leading-relaxed">
                      <p>हमारा 'पॉइंट्स' (Nagrik Power) सिस्टम यूज़र्स को सक्रिय रूप से सीखने के लिए प्रेरित करता है।</p>
                   </div>
                </div>
              )}

              {activeSection === 'legal' && (
                <div className="animate-slideUp space-y-10 relative z-10">
                   <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">कानूनी सहायता (Help Desk)</h2>
                   <div className="prose prose-invert max-w-none text-slate-400 text-lg leading-relaxed">
                      <p>यदि आप किसी प्रशासनिक समस्या में फंसे हैं, तो हमारा 'Help Desk' आपको सही विभाग और प्रक्रिया बताता है।</p>
                   </div>
                </div>
              )}

              {activeSection === 'rba' && (
                <div className="animate-slideUp space-y-10 relative z-10">
                   <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">RBA प्रीमियम सेवाएं</h2>
                   <div className="prose prose-invert max-w-none text-slate-400 text-lg leading-relaxed">
                      <p>रॉयल बुल्स एडवाइजरी (RBA) एक विश्वसनीय बिजनेस ग्रुप है जो कई सेक्टर में काम करता है।</p>
                   </div>
                </div>
              )}

              {activeSection === 'omi' && (
                <div className="animate-slideUp space-y-10 relative z-10">
                   <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">ओमी वियरेबल (Omi)</h2>
                   <div className="prose prose-invert max-w-none text-slate-400 text-lg leading-relaxed">
                      <p>हम गर्व के साथ 'Omi Wearable' प्लेटफॉर्म के साथ पार्टनर हैं।</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationHub;
