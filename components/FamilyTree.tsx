
import React, { useState } from 'react';
import { FamilyMember, UserProfile } from '../types';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface FamilyTreeProps {
  profile: UserProfile;
  onUpdateTree: (tree: FamilyMember[]) => void;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ profile, onUpdateTree }) => {
  const [newMember, setNewMember] = useState<Omit<FamilyMember, 'id'>>({ 
    name: '', 
    relation: 'Son', 
    gender: 'Male', 
    isAlive: true, 
    isMinor: false 
  });
  const [customRelation, setCustomRelation] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const relations = [
    "Father", "Mother", "Spouse", "Son", "Daughter", "Brother", "Sister", 
    "Paternal Grandfather", "Paternal Grandmother", "Maternal Grandfather", "Maternal Grandmother",
    "Other (Custom)"
  ];

  const addMember = () => {
    if (!newMember.name.trim()) return;
    
    const finalRelation = newMember.relation === "Other (Custom)" 
      ? (customRelation || "Relation") 
      : newMember.relation;

    const member: FamilyMember = {
      id: Math.random().toString(36).substr(2, 9),
      ...newMember,
      relation: finalRelation
    };
    
    onUpdateTree([...profile.familyTree, member]);
    setNewMember({ name: '', relation: 'Son', gender: 'Male', isAlive: true, isMinor: false });
    setCustomRelation('');
  };

  const removeMember = (id: string) => {
    onUpdateTree(profile.familyTree.filter(m => m.id !== id));
  };

  const handleAnalyzeInheritance = async () => {
    setLoading(true);
    try {
      const audit = await geminiService.analyzeFamilyInheritance(
        profile.fullName, 
        profile.familyTree, 
        { language: 'Hindi', country: 'India' }
      );
      setReport(audit);
    } catch (e) {
      setReport("विश्लेषण विफल रहा।");
    } finally {
      setLoading(false);
    }
  };

  const generations = {
    ancestors: profile.familyTree.filter(m => m.relation.includes('Grand') || m.relation === "Paternal Grandfather" || m.relation === "Paternal Grandmother"),
    parents: profile.familyTree.filter(m => m.relation === 'Father' || m.relation === 'Mother'),
    siblings: profile.familyTree.filter(m => m.relation === 'Brother' || m.relation === 'Sister'),
    descendants: profile.familyTree.filter(m => m.relation === 'Son' || m.relation === 'Daughter'),
    spouses: profile.familyTree.filter(m => m.relation === 'Spouse'),
    others: profile.familyTree.filter(m => 
      !m.relation.includes('Grand') && 
      !['Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter', 'Spouse'].includes(m.relation)
    )
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-40 max-w-7xl mx-auto px-4 md:px-0">
      <div className="bg-slate-900 p-10 md:p-14 rounded-[4rem] border-2 border-emerald-500/20 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><i className="fas fa-tree text-[300px] text-emerald-500"></i></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-6">
             <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl">
                <i className="fas fa-sitemap text-2xl"></i>
             </div>
             <div>
                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter royal-serif">वंश <span className="text-emerald-500 font-sans tracking-normal">वृक्ष</span></h2>
                <p className="text-emerald-500/60 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Official Succession & Mutation Utility</p>
             </div>
          </div>
          <p className="text-slate-400 text-xl font-medium border-l-4 border-emerald-500/40 pl-8 italic max-w-4xl">
            "बड़े परिवारों के लिए अब आप 'कस्टम रिलेशन' (जैसे ताऊ जी, बुआ जी) भी जोड़ सकते हैं। यह वंशावली आपके उत्तराधिकार दावों को मजबूती प्रदान करेगी।"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 bg-slate-900 p-8 rounded-[3rem] border border-white/5 space-y-8 h-fit shadow-2xl sticky top-32">
           <h3 className="text-xl font-black text-white uppercase italic border-b border-white/10 pb-4 flex items-center gap-3">
              <i className="fas fa-user-plus text-emerald-500"></i> सदस्य जोड़ें
           </h3>
           <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">पूरा नाम</label>
                <input 
                  type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})}
                  placeholder="उदा: स्व. हरिओम जी"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">संबंध (Relation)</label>
                    <select 
                      value={newMember.relation} onChange={e => {
                        const rel = e.target.value;
                        setNewMember({...newMember, relation: rel});
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 appearance-none"
                    >
                      {relations.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">लिंग</label>
                    <select 
                      value={newMember.gender} onChange={e => setNewMember({...newMember, gender: e.target.value as any})}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 appearance-none"
                    >
                      <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                 </div>
              </div>

              {newMember.relation === "Other (Custom)" && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2">कस्टम संबंध लिखें (e.g. Tau Ji)</label>
                  <input 
                    type="text" value={customRelation} onChange={e => setCustomRelation(e.target.value)}
                    placeholder="जैसे: ताऊ जी, बुआ जी, चाचा"
                    className="w-full bg-slate-950 border-2 border-amber-500/20 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-4 p-4 bg-slate-950 rounded-2xl border border-white/5">
                 <label className="flex items-center space-x-3 text-slate-400 font-bold text-[10px] uppercase cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" checked={newMember.isAlive} onChange={e => setNewMember({...newMember, isAlive: e.target.checked})} className="w-5 h-5 rounded border-white/10 bg-slate-950 text-emerald-500 focus:ring-0" />
                    <span>क्या सदस्य अभी जीवित हैं?</span>
                 </label>
                 <label className="flex items-center space-x-3 text-slate-400 font-bold text-[10px] uppercase cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" checked={newMember.isMinor} onChange={e => setNewMember({...newMember, isMinor: e.target.checked})} className="w-5 h-5 rounded border-white/10 bg-slate-950 text-emerald-500 focus:ring-0" />
                    <span>क्या सदस्य नाबालिग (Minor) हैं?</span>
                 </label>
              </div>

              <button onClick={addMember} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-500 transition-all shadow-xl border-b-4 border-emerald-800 active:translate-y-1">वृक्ष में जोड़ें (Add Member)</button>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
           <div className="bg-slate-900 p-10 md:p-14 rounded-[4rem] border border-white/5 shadow-2xl relative min-h-[600px] overflow-hidden">
              <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                    <i className="fas fa-network-wired text-emerald-500"></i> वंशावली (Visual Tree)
                 </h3>
              </div>

              <div className="space-y-16">
                 {generations.ancestors.length > 0 && (
                   <div className="space-y-6">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center mb-4">Ancestors</p>
                      <div className="flex flex-wrap justify-center gap-4">
                         {generations.ancestors.map(m => <MemberCard key={m.id} member={m} onRemove={removeMember} />)}
                      </div>
                      <div className="w-px h-10 bg-slate-800 mx-auto"></div>
                   </div>
                 )}

                 <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center mb-4">Core Family</p>
                    <div className="flex flex-wrap justify-center gap-6">
                       {generations.parents.map(m => <MemberCard key={m.id} member={m} onRemove={removeMember} />)}
                       <div className="bg-emerald-600 p-6 rounded-[2rem] border-4 border-emerald-400/30 text-center shadow-2xl relative transform scale-110 min-w-[160px]">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-emerald-700 px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-lg">SELF (YOU)</div>
                          <p className="text-slate-950 font-black text-lg italic uppercase tracking-tighter">{profile.fullName || "Citizen"}</p>
                       </div>
                       {generations.spouses.map(m => <MemberCard key={m.id} member={m} onRemove={removeMember} />)}
                       {generations.siblings.map(m => <MemberCard key={m.id} member={m} onRemove={removeMember} />)}
                    </div>
                    <div className="w-px h-10 bg-slate-800 mx-auto"></div>
                 </div>

                 {(generations.descendants.length > 0 || generations.others.length > 0) && (
                   <div className="space-y-6">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center mb-4">Extended & Descendants</p>
                      <div className="flex flex-wrap justify-center gap-4">
                         {generations.descendants.map(m => <MemberCard key={m.id} member={m} onRemove={removeMember} />)}
                         {generations.others.map(m => <MemberCard key={m.id} member={m} onRemove={removeMember} />)}
                      </div>
                   </div>
                 )}

                 {profile.familyTree.length === 0 && (
                    <div className="py-24 text-center space-y-6 opacity-30 grayscale">
                       <i className="fas fa-users-slash text-6xl text-slate-700"></i>
                       <p className="text-xl font-bold uppercase italic tracking-widest text-slate-500">अभी तक कोई सदस्य नहीं जोड़ा गया</p>
                    </div>
                 )}
              </div>

              {profile.familyTree.length > 0 && (
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row gap-4">
                   <button 
                    onClick={handleAnalyzeInheritance} 
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-3xl hover:bg-blue-500 transition-all border-b-4 border-blue-800 active:translate-y-1"
                   >
                     {loading ? <i className="fas fa-dharmachakra fa-spin text-xl"></i> : <><i className="fas fa-gavel mr-3"></i> उत्तराधिकार ऑडिट (Succession Audit)</>}
                   </button>
                   <button onClick={() => window.print()} className="bg-slate-800 text-white px-8 rounded-2xl border border-white/10 hover:bg-slate-700"><i className="fas fa-print"></i></button>
                </div>
              )}
           </div>

           {report && !loading && (
             <div className="bg-white rounded-[4rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] animate-slideUp border-l-[16px] border-blue-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><i className="fas fa-stamp text-[200px] text-slate-900"></i></div>
                <div className="flex items-center justify-between mb-10 border-b pb-6">
                   <div className="space-y-1">
                      <h4 className="text-slate-900 font-black text-3xl italic uppercase tracking-tighter royal-serif">कानूनी वंशावली रिपोर्ट</h4>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">SUCCESSION ANALYSIS FOR {profile.fullName.toUpperCase()}</p>
                   </div>
                   <button onClick={() => setReport('')} className="text-slate-300 hover:text-slate-600 transition-colors"><i className="fas fa-times-circle text-2xl"></i></button>
                </div>
                <div className="prose prose-slate max-w-none text-slate-800 text-xl leading-relaxed font-medium mb-12">
                   <ReactMarkdown>{report}</ReactMarkdown>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const MemberCard: React.FC<{ member: FamilyMember, onRemove: (id: string) => void }> = ({ member, onRemove }) => (
  <div className={`p-5 rounded-3xl border transition-all group relative min-w-[150px] ${member.isAlive ? 'bg-slate-950 border-white/5 hover:border-emerald-500/50' : 'bg-slate-900/50 border-white/5 grayscale opacity-60'}`}>
     <button 
      onClick={() => onRemove(member.id)}
      className="absolute -top-2 -right-2 w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all shadow-lg"
     >
        <i className="fas fa-times"></i>
     </button>
     
     <div className="flex flex-col items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${member.isAlive ? (member.gender === 'Male' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500') : 'bg-slate-800 text-slate-600'}`}>
           <i className={`fas ${member.isAlive ? (member.gender === 'Male' ? 'fa-user' : 'fa-user-tie') : 'fa-dove'} text-lg`}></i>
        </div>
        <div className="text-center">
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{member.relation}</p>
           <h5 className={`text-sm font-black italic tracking-tight ${member.isAlive ? 'text-white' : 'text-slate-400'}`}>{member.name}</h5>
           {member.isMinor && <p className="text-[7px] font-black text-amber-500 uppercase mt-1 flex items-center justify-center gap-1"><i className="fas fa-child"></i> Minor Heir</p>}
        </div>
     </div>
  </div>
);

export default FamilyTree;
