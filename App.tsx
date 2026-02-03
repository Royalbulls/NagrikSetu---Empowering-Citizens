
import React, { Component, useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { AppSection, UserState, LocalContext, UserProfile } from './types.ts';
import { firebaseService } from './services/firebaseService.ts';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import KnowledgeHub from './components/KnowledgeHub.tsx';
import HistorySection from './components/HistorySection.tsx';
import LawSection from './components/LawSection.tsx';
import Dashboard from './components/Dashboard.tsx';
import Auth from './components/Auth.tsx';
import SahayataKendra from './components/SahayataKendra.tsx';
import Launcher from './components/Launcher.tsx';
import VoiceAssistant from './components/VoiceAssistant.tsx';
import ProfileEditor from './components/ProfileEditor.tsx';
import FamilyTree from './components/FamilyTree.tsx';
import PortalDirectory from './components/PortalDirectory.tsx';
import RBAservices from './components/RBAservices.tsx';
import LandingPage from './components/LandingPage.tsx';
import PolicyHub from './components/PolicyHub.tsx';
import ContactUsPage from './components/ContactUsPage.tsx';
import DocumentationHub from './components/DocumentationHub.tsx';
import ExpertConnect from './components/ExpertConnect.tsx';
import SupportSection from './components/SupportSection.tsx';
import OmiLink from './components/OmiLink.tsx';
import ApplicationWriter from './components/ApplicationWriter.tsx';
import GovtPitch from './components/GovtPitch.tsx';
import TrendScanner from './components/TrendScanner.tsx';
import EPaper from './components/EPaper.tsx';
import NyayDarpan from './components/NyayDarpan.tsx';
import RewardCenter from './components/RewardCenter.tsx';
import Footer from './components/Footer.tsx';

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error?: Error; }

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError(error: Error): ErrorBoundaryState { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("System crash log captured:", error, errorInfo); }
  
  handleSelfRepair = () => {
    localStorage.removeItem('nagrik_dev_v2_guest');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 text-center space-y-10">
          <div className="w-32 h-32 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/20 animate-pulse">
             <i className="fas fa-wrench text-amber-500 text-5xl"></i>
          </div>
          <div className="space-y-4">
             <h2 className="text-4xl md:text-6xl font-black text-white italic royal-serif uppercase tracking-tighter">सिस्टम <span className="text-amber-500">मरम्मत</span> मोड</h2>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Self-Healing Protocol Active: Auto-repair sequence initiated.</p>
          </div>
          <button onClick={this.handleSelfRepair} className="bg-amber-500 text-slate-950 px-14 py-5 rounded-2xl font-black uppercase text-xs shadow-3xl hover:scale-105 transition-all">REPAIR & RELOAD</button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.LAUNCHER);
  const [policyTab, setPolicyTab] = useState<'privacy' | 'terms' | 'disclaimer'>('terms');
  const [recentSections, setRecentSections] = useState<AppSection[]>([]);
  const [user, setUser] = useState<UserState>({
    uid: 'guest',
    points: 0,
    level: 'New Citizen',
    stage: 1,
    streak: 1,
    unlockedFeatures: [],
    profile: { fullName: '', fatherName: '', dob: '', mobile: '', email: '', address: '', city: '', pinCode: '', familyTree: [] },
    role: 'citizen'
  });
  const [language, setLanguage] = useState('Hindi');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [portalStarted, setPortalStarted] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseService.onAuthChange((authUser) => {
      if (authUser) {
        setUser(prev => ({
          ...prev,
          uid: authUser.uid,
          name: authUser.displayName,
          email: authUser.email,
          points: prev.points > 0 ? prev.points : 500,
          level: 'Scholar',
          role: authUser.email?.endsWith('@rbaadvisor.com') ? 'admin' : 'citizen'
        }));
        setShowAuth(false);
        setPortalStarted(true);
      } else {
        setUser(prev => ({ ...prev, uid: 'guest', role: 'citizen' }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdatePoints = (amount: number) => {
    setUser(prev => ({ ...prev, points: prev.points + amount }));
  };

  const checkAccess = (section: AppSection, tab?: string) => {
    if (user.uid === 'guest' && ![AppSection.LAUNCHER, AppSection.HUB, AppSection.DOCS, AppSection.POLICIES, AppSection.SUPPORT_MISSION, AppSection.GOVT_PITCH].includes(section)) {
      setShowAuth(true);
      return;
    }
    if (section === AppSection.POLICIES && tab) {
      setPolicyTab(tab as any);
    }
    setRecentSections(prev => {
      const filtered = prev.filter(s => s !== section);
      return [section, ...filtered].slice(0, 3);
    });
    setActiveSection(section);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSection = () => {
    const context: LocalContext = { language, country: 'India', city: user.profile?.city || 'India' };
    const profile = user.profile || { fullName: '', fatherName: '', dob: '', mobile: '', email: '', address: '', city: '', pinCode: '', familyTree: [] };

    switch (activeSection) {
      case AppSection.LAUNCHER:
        return !portalStarted ? 
          <LandingPage onStart={() => setPortalStarted(true)} onNavigate={checkAccess} /> : 
          <Launcher onSelectApp={checkAccess} points={user.points} language={language} userProfile={profile} />;
      case AppSection.SUPPORT_MISSION:
        return <SupportSection />;
      case AppSection.EXPERT_CONNECT:
        return <ExpertConnect context={context} />;
      case AppSection.PROFILE_EDITOR:
        return <ProfileEditor profile={profile} language={language} onSave={(d) => setUser(prev => ({...prev, profile: d}))} />;
      case AppSection.SAHAYATA_KENDRA:
        return <SahayataKendra context={context} onEarnPoints={handleUpdatePoints} userProfile={profile} />;
      case AppSection.HUB:
        return <KnowledgeHub setActiveSection={(s) => checkAccess(s)} language={language} onEarnPoints={handleUpdatePoints} />;
      case AppSection.HISTORY:
        return <HistorySection context={context} onUpdatePoints={handleUpdatePoints} />;
      case AppSection.CONSTITUTION:
        return <LawSection onEarnPoints={handleUpdatePoints} section={activeSection} context={context} />;
      case AppSection.DASHBOARD:
        return <Dashboard user={user} context={context} onLogout={()=>firebaseService.logout()} />;
      case AppSection.FINANCE:
        return <RBAservices />;
      case AppSection.OMI_INTEGRATION:
        return <OmiLink context={context} onEarnPoints={handleUpdatePoints} />;
      case AppSection.APPLICATION_WRITER:
        return <ApplicationWriter context={context} userName={user.name || 'Citizen'} onEarnPoints={handleUpdatePoints} />;
      case AppSection.GOVT_PITCH:
        return <GovtPitch />;
      case AppSection.TREND_SCANNER:
        return <TrendScanner context={context} onEarnPoints={handleUpdatePoints} />;
      case AppSection.EPAPER:
        return <EPaper context={context} onEarnPoints={handleUpdatePoints} user={user} />;
      case AppSection.NYAY_DARPAN:
        return <NyayDarpan context={context} onEarnPoints={handleUpdatePoints} />;
      case AppSection.POLICIES:
        return <PolicyHub initialTab={policyTab} />;
      case AppSection.CONTACT_US:
        return <ContactUsPage />;
      case AppSection.DOCS:
        return <DocumentationHub />;
      case AppSection.VOICE_ASSISTANT:
        return <VoiceAssistant language={language} onEarnPoints={handleUpdatePoints} />;
      case AppSection.PARIVAR_VRUKSH:
        return <FamilyTree profile={profile} onUpdateTree={(tree) => setUser(prev => ({...prev, profile: {...prev.profile!, familyTree: tree}}))} />;
      case AppSection.LOCAL_LAWS_EXPOSED:
        return <HistorySection context={context} onUpdatePoints={handleUpdatePoints} mode="exposed" />;
      case AppSection.JIGYASA_HUB:
        return <RewardCenter onEarnPoints={handleUpdatePoints} />;
      default:
        return <Launcher onSelectApp={checkAccess} points={user.points} language={language} userProfile={profile} />;
    }
  };

  if (showAuth) return <Auth onBackToHome={() => setShowAuth(false)} />;

  return (
    <GlobalErrorBoundary>
      <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden">
        <Sidebar 
          activeSection={activeSection} setActiveSection={checkAccess} 
          language={language} points={user.points} 
          unlockedFeatures={user.unlockedFeatures} isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} isGuest={user.uid === 'guest'} 
          onLoginClick={() => setShowAuth(true)} userRole={user.role}
          recentSections={recentSections}
        />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <Header 
            user={user} onOpenDashboard={() => checkAccess(AppSection.DASHBOARD)} 
            language={language} onUpdateLanguage={setLanguage}
            onLoginClick={() => setShowAuth(true)} 
            onBackToLauncher={() => checkAccess(AppSection.LAUNCHER)} 
            activeSection={activeSection} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950">
            <div className="p-4 md:p-10 min-h-[calc(100vh-6rem)]">
               {renderSection()}
            </div>
            {activeSection !== AppSection.LAUNCHER && <Footer onNavigate={checkAccess} />}
          </main>
        </div>
      </div>
    </GlobalErrorBoundary>
  );
};

export default App;
