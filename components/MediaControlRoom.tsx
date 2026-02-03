
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { LocalContext, TrendItem, AuditLogEntry } from '../types';
import ReactMarkdown from 'react-markdown';

interface PostDraft {
  id: string;
  topic: string;
  content: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Draft' | 'Approved' | 'Rejected' | 'Template';
  timestamp: number;
  suggestedPlatforms: string[];
}

const MediaControlRoom: React.FC<{ context: LocalContext; onEarnPoints: (v: number) => void }> = ({ context, onEarnPoints }) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'drafts' | 'campaigns' | 'audit' | 'tokens'>('trends');
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [drafts, setDrafts] = useState<PostDraft[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [tokens, setTokens] = useState({ meta: '••••••••', youtube: '••••••••' });
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const officialCampaigns: PostDraft[] = [
    {
      id: 'CMP-001',
      topic: 'Consumer Rights Awareness',
      content: `**Hook:** क्या आप जानते हैं कि एक जागरूक ग्राहक के रूप में आपकी आवाज़ में कितनी ताकत है? ⚖️🛍️\n\n**Body:**\n**पहले (Pehle):** अगर दुकानदार खराब सामान देता था, तो हम उसे अपनी किस्मत समझ लेते थे।\n\n**आज (Aaj):** **उपभोक्ता संरक्षण अधिनियम (Consumer Protection Act)** आपको वह कवच देता है जिससे आप अपनी मेहनत की कमाई का हिसाब मांग सकते हैं।\n\n**CTA:** अधिक जानकारी के लिए **नागरिक सेतु** पोर्टल पर आएं।\n\n#ConsumerRights #NagrikSetu #RBAAdvisor #JagoGrahakJago`,
      riskLevel: 'Low',
      status: 'Template',
      timestamp: Date.now(),
      suggestedPlatforms: ['FB', 'IG', 'WA']
    },
    {
      id: 'CMP-002',
      topic: 'RTI Empowerment',
      content: `**Hook:** प्रशासन से सवाल पूछना आपका संवैधानिक हक है! 📝🏛️\n\n**Body:**\n**पहले (Pehle):** फाइलों की जानकारी मिलना नामुमकिन था।\n\n**आज (Aaj):** **सूचना का अधिकार (RTI)** सरकारी पारदर्शिता की कुंजी है।\n\n**CTA:** नागरिक सेतु पर RTI ड्राफ्ट करना सीखें।`,
      riskLevel: 'Low',
      status: 'Template',
      timestamp: Date.now(),
      suggestedPlatforms: ['FB', 'X']
    }
  ];

  const scanTrends = async () => {
    setLoading(true);
    try {
      const data = await geminiService.scanTrends(context);
      setTrends(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateDraft = async (topic: string, risk: 'Low' | 'Medium' | 'High') => {
    setLoading(true);
    try {
      const content = await geminiService.generateSocialPost(topic, context);
      const newDraft: PostDraft = {
        id: 'DFT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        topic,
        content,
        riskLevel: risk,
        status: 'Draft',
        timestamp: Date.now(),
        suggestedPlatforms: risk === 'Low' ? ['FB', 'IG'] : ['FB']
      };
      setDrafts(prev => [newDraft, ...prev]);
      setActiveTab('drafts');
      logAudit('generate', newDraft.id, risk);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string, status: 'Approved' | 'Rejected') => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    const draft = drafts.find(d => d.id === id);
    if (draft) {
      logAudit(status === 'Approved' ? 'approve' : 'reject', id, draft.riskLevel);
      if (status === 'Approved') onEarnPoints(20);
    }
  };

  const logAudit = (action: AuditLogEntry['action'], targetId: string, risk: string) => {
    const entry: AuditLogEntry = {
      id: 'LOG-' + Date.now(),
      action,
      targetId,
      userId: 'Admin-01',
      timestamp: Date.now(),
      riskLevel: risk
    };
    setAuditLog(prev => [entry, ...prev]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  useEffect(() => {
    scanTrends();
  }, []);

  return (
    <div className="space-y-10 animate-fadeIn pb-32 max-w-7xl mx-auto">
      {/* 🚀 Tactical Header */}
      <div className="bg-slate-900 border-b-4 border-amber-500 p-10 md:p-14 rounded-[4rem] shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 rotate-12">
          <i className="fas fa-tower-observation text-[250px] text-white"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4">
              <div className="flex items-center space-x-6">
                 <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl">
                    <i className="fas fa-satellite-dish text-2xl"></i>
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-white uppercase italic leading-none">मीडिया <span className="text-amber-500">कंट्रोल</span> रूम</h2>
                    <p className="text-amber-500/60 font-black text-[10px] uppercase tracking-[0.4em] mt-2">Strategic Content Governance & Audit Hub</p>
                 </div>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-[2.5rem] border border-white/10 italic max-w-3xl">
                 <p className="text-slate-400 text-sm leading-relaxed">
                   "NagrikSetu में AI केवल सुझाव देता है। सभी संवेदनशील सामग्री मानव अनुमोदन के बाद ही प्रकाशित होती है।"
                 </p>
              </div>
           </div>
           
           <div className="flex bg-slate-950 p-2 rounded-2xl border border-white/5 shadow-inner shrink-0 overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('trends')} className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${activeTab === 'trends' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Active Trends</button>
              <button onClick={() => setActiveTab('campaigns')} className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${activeTab === 'campaigns' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Campaigns</button>
              <button onClick={() => setActiveTab('drafts')} className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${activeTab === 'drafts' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Drafts ({drafts.filter(d=>d.status==='Draft').length})</button>
              <button onClick={() => setActiveTab('audit')} className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${activeTab === 'audit' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Audit Logs</button>
           </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
           <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-amber-500 font-black uppercase tracking-[0.5em] text-[10px] mt-8 animate-pulse">Accessing Global Media Nodes...</p>
        </div>
      )}

      {/* 📊 Trends View */}
      {activeTab === 'trends' && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slideUp">
           {trends.map((t, i) => (
             <div key={i} className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col justify-between group hover:border-amber-500/30 transition-all h-[420px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><i className="fas fa-bolt-lightning text-7xl text-white"></i></div>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${t.riskLevel === 'High' ? 'bg-rose-600 text-white' : t.riskLevel === 'Medium' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'}`}>
                        {t.riskLevel} Risk
                      </span>
                      <i className="fas fa-circle-nodes text-slate-700"></i>
                   </div>
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight line-clamp-3">"{t.topic}"</h3>
                   <p className="text-slate-500 text-sm font-medium italic border-l-2 border-white/5 pl-4 line-clamp-3">"{t.relevance}"</p>
                </div>
                <button 
                  onClick={() => generateDraft(t.topic, t.riskLevel)}
                  className="w-full mt-10 bg-slate-950 border border-white/10 hover:bg-amber-500 text-amber-500 hover:text-slate-950 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                >
                   <i className="fas fa-wand-magic-sparkles"></i>
                   Create Compliant Draft
                </button>
             </div>
           ))}
        </div>
      )}

      {/* 🏆 Official Campaigns View */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
           {officialCampaigns.map((camp) => (
             <div key={camp.id} className="bg-slate-900 p-10 rounded-[4rem] border-2 border-amber-500/20 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5"><i className="fas fa-star text-7xl"></i></div>
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Featured Awareness Campaign</span>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mt-1">{camp.topic}</h3>
                   </div>
                   <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase">Low Risk</div>
                </div>
                <div className="bg-slate-950 p-8 rounded-[3rem] border border-white/5 mb-8 relative">
                   <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic font-medium whitespace-pre-wrap">
                      <ReactMarkdown>{camp.content}</ReactMarkdown>
                   </div>
                   <button 
                     onClick={() => copyToClipboard(camp.content, camp.id)}
                     className={`absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${copyStatus === camp.id ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
                   >
                      <i className={`fas ${copyStatus === camp.id ? 'fa-check' : 'fa-copy'}`}></i>
                   </button>
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex gap-2">
                      {camp.suggestedPlatforms.map(p => <span key={p} className="bg-slate-850 px-3 py-1 rounded-lg text-[9px] font-black text-slate-500">#{p}</span>)}
                   </div>
                   <button className="bg-amber-500 text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400">Deploy Post</button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* 📜 Drafts Library */}
      {activeTab === 'drafts' && !loading && (
        <div className="space-y-8 animate-slideUp">
           {drafts.length > 0 ? drafts.map((draft) => (
             <div key={draft.id} className={`bg-slate-900 p-10 md:p-14 rounded-[4rem] border-2 shadow-3xl transition-all relative overflow-hidden ${draft.status === 'Approved' ? 'border-emerald-600/30' : draft.status === 'Rejected' ? 'border-rose-600/30' : 'border-white/10'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                   <div className="space-y-1">
                      <div className="flex items-center gap-4">
                         <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Post ID: {draft.id}</span>
                         <span className={`px-3 py-0.5 rounded text-[8px] font-black uppercase ${draft.riskLevel === 'High' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>{draft.riskLevel} Risk</span>
                      </div>
                      <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Topic: {draft.topic}</h4>
                   </div>
                   
                   <div className="flex gap-4">
                      {draft.status === 'Draft' ? (
                        <>
                           <button onClick={() => handleStatusChange(draft.id, 'Approved')} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-xl transition-all"><i className="fas fa-check-double mr-3"></i> Approve</button>
                           <button onClick={() => handleStatusChange(draft.id, 'Rejected')} className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 shadow-xl transition-all"><i className="fas fa-ban mr-3"></i> Reject</button>
                        </>
                      ) : (
                        <div className={`px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-inner flex items-center gap-3 ${draft.status === 'Approved' ? 'bg-emerald-600/20 text-emerald-500' : 'bg-rose-600/20 text-rose-500'}`}>
                           <i className={`fas ${draft.status === 'Approved' ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                           {draft.status}
                        </div>
                      )}
                   </div>
                </div>

                <div className="bg-slate-950 p-10 md:p-14 rounded-[3rem] border border-white/5 relative group cursor-text">
                   <div className="prose prose-invert max-w-none text-slate-300 text-xl leading-relaxed italic font-medium">
                      <ReactMarkdown>{draft.content}</ReactMarkdown>
                   </div>
                   <div className="absolute top-6 right-8 flex gap-4">
                      <button 
                        onClick={() => copyToClipboard(draft.content, draft.id)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${copyStatus === draft.id ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-white shadow-xl'}`}
                        title="Copy to Clipboard"
                      >
                         <i className={`fas ${copyStatus === draft.id ? 'fa-check' : 'fa-copy'} text-xl`}></i>
                      </button>
                   </div>
                </div>
             </div>
           )) : (
             <div className="py-40 text-center opacity-30 grayscale flex flex-col items-center gap-6">
                <i className="fas fa-folder-open text-7xl text-slate-700"></i>
                <p className="font-black uppercase tracking-[0.5em] text-sm">Draft Library is currently empty.</p>
             </div>
           )}
        </div>
      )}

      {/* 🔐 API Tokens View */}
      {activeTab === 'tokens' && (
        <div className="max-w-4xl mx-auto space-y-10 animate-slideUp">
           <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-3xl space-y-12">
              <div className="flex items-center space-x-6">
                 <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                    <i className="fas fa-key text-2xl"></i>
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Social API <span className="text-blue-500">Gateway</span></h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Permission-based access configuration</p>
                 </div>
              </div>
              <div className="space-y-8">
                 {[
                   { name: 'Meta Business API', id: 'meta', icon: 'fa-facebook', color: 'bg-blue-600', val: tokens.meta },
                   { name: 'YouTube Data API v3', id: 'youtube', icon: 'fa-youtube', color: 'bg-rose-600', val: tokens.youtube }
                 ].map((t) => (
                   <div key={t.id} className="bg-slate-950 p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 ${t.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-xl`}><i className={`fab ${t.icon}`}></i></div>
                         <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.name}</p>
                            <p className="text-white font-mono text-lg">{t.val}</p>
                         </div>
                      </div>
                      <button className="bg-slate-800 text-slate-300 hover:text-white px-10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/5">Update Key</button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* 📋 Audit Logs View */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden animate-slideUp">
           <div className="p-10 border-b border-white/5 bg-slate-950/50 flex justify-between items-center">
              <div className="flex items-center space-x-6">
                 <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-amber-500 shadow-xl"><i className="fas fa-file-shield"></i></div>
                 <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Governance Audit Trail</h3>
              </div>
              <button className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors"><i className="fas fa-download mr-2"></i> Export PDF</button>
           </div>
           <div className="divide-y divide-white/5">
              {auditLog.length > 0 ? auditLog.map((log) => (
                <div key={log.id} className="p-10 flex items-center justify-between hover:bg-white/5 transition-all">
                   <div className="flex items-center space-x-8">
                      <div className={`w-3 h-3 rounded-full ${log.action === 'approve' ? 'bg-emerald-500' : log.action === 'generate' ? 'bg-blue-500' : 'bg-rose-600'} shadow-lg animate-pulse`}></div>
                      <div>
                         <p className="text-white font-black uppercase text-sm tracking-tight">{log.action.toUpperCase()} CONTENT</p>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Audit ID: {log.id} • Target: {log.targetId}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-white font-mono text-sm">{new Date(log.timestamp).toLocaleString()}</p>
                      <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest mt-1">By User: {log.userId}</p>
                   </div>
                </div>
              )) : (
                <div className="p-24 text-center text-slate-700 italic font-black uppercase tracking-[0.5em] text-xs">No audit records in current session.</div>
              )}
           </div>
        </div>
      )}

      {/* 🔐 Admin Compliance Footer */}
      <div className="bg-slate-950 p-12 rounded-[4rem] border-2 border-dashed border-white/10 text-center opacity-60">
         <h4 className="text-amber-500 font-black text-xs uppercase tracking-[0.5em] mb-4 flex items-center justify-center gap-4">
            <i className="fas fa-shield-halved"></i>
            GOVERNMENT-SAFE PROTOCOL v5.2
         </h4>
         <p className="text-slate-500 italic text-sm leading-relaxed max-w-5xl mx-auto font-medium">
            "नागरिक सेतु का मीडिया कंट्रोल रूम केवल 'सूचनात्मक' (Educational) कंटेंट हेतु है। प्रत्येक पोस्ट के लिए 'मानव अनुमोदन' अनिवार्य है।"
         </p>
      </div>
    </div>
  );
};

export default MediaControlRoom;
