
import React, { useState, useEffect, useCallback, ErrorInfo, ReactNode } from 'react';
import { AppSection, UserState, LocalContext, AuraStats } from './types';
import { firebaseService } from './services/firebaseService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KnowledgeHub from './components/KnowledgeHub';
import HistorySection from './components/HistorySection';
import LawSection from './components/LawSection';
import FinanceSection from './components/FinanceSection';
import CitizenRightsSection from './components/CitizenRightsSection';
import DailyPractice from './components/DailyPractice';
import CompetitionSection from './components/CompetitionSection';
import WeeklyTimeline from './components/WeeklyTimeline';
import ExplorerSection from './components/ExplorerSection';
import ApplicationWriter from './components/ApplicationWriter';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import ExpertConnect from './components/ExpertConnect';
import GlobalSchemers from './components/GlobalSchemers';
import MarketVision from './components/MarketVision';
import ReligionSection from './components/ReligionSection';
import CultureSection from './components/CultureSection';
import SavedArchives from './components/SavedArchives';
import SupportSection from './components/SupportSection';
import AboutSection from './components/AboutSection';
import CurrentAffairs from './components/CurrentAffairs';
import LiveTutor from './components/LiveTutor';
import ImageStudy from './components/ImageStudy';
import CriminologySection from './components/CriminologySection';
import PolicyHub from './components/PolicyHub';
import RBAservices from './components/RBAservices';
import AuraChamber from './components/AuraChamber';

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("NagrikSetu Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 text-4xl border border-rose-500/20">
            <i className="fas fa-plug-circle-exclamation"></i>
          </div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">सिस्टम में रुकावट आई है</h2>
          <button onClick={() => window.location.reload()} className="bg-amber-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-3xl">पन्ने दोबारा लोड करें</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HUB);
  const [user, setUser] = useState<UserState>({ 
    uid: 'guest', 
    points: 0, 
    level: 'Guest Citizen', 
    streak: 1,
    auraStats: { history: 0, law: 0, ethics: 0, finance: 0, culture: 0 }
  });
  const [showLanding, setShowLanding] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [context, setContext] = useState<LocalContext>({ language: 'Hindi', country: 'India', city: 'Delhi' });
  const [appPrefill, setAppPrefill] = useState<{ subject: string; details: string } | null>(null);

  useEffect(() => {
    const lastUid = localStorage.getItem('nagriksetu_current_uid');
    if (lastUid) {
      const localData = localStorage.getItem('nagrik_local_v1_' + lastUid);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          setUser({ 
            ...parsed, 
            uid: lastUid,
            auraStats: parsed.auraStats || { history: 0, law: 0, ethics: 0, finance: 0, culture: 0 }
          });
        } catch (e) { console.error("Local load failed"); }
      }
    }

    const unsubscribe = firebaseService.onAuthChange(async (fbUser) => {
      if (fbUser) {
        const localData = await firebaseService.getUserData(fbUser.uid);
        setUser({ 
          ...(localData || {}), 
          uid: fbUser.uid, 
          name: fbUser.displayName || (localData as any)?.name,
          auraStats: (localData as any)?.auraStats || { history: 0, law: 0, ethics: 0, finance: 0, culture: 0 }
        } as UserState);
        setShowAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEarnPoints = useCallback((amount: number = 20, category?: keyof AuraStats) => {
    const newPoints = (user.points || 0) + amount;
    const newAura = { ...(user.auraStats || { history: 0, law: 0, ethics: 0, finance: 0, culture: 0 }) };
    if (category) {
      newAura[category] = (newAura[category] || 0) + amount;
    }

    const updatedUser = { ...user, points: newPoints, auraStats: newAura };
    setUser(updatedUser);
    if (user.uid) {
      firebaseService.syncUserData(user.uid, { points: newPoints, auraStats: newAura });
    }
  }, [user]);

  const handleOpenApplicationWriter = (subject: string, details: string) => {
    setAppPrefill({ subject, details });
    setActiveSection(AppSection.APPLICATION_WRITER);
  };

  const startApp = () => {
    setShowLanding(false);
    setActiveSection(AppSection.HUB);
  };

  if (showLanding) return <LandingPage onStart={startApp} />;
  if (showAuth) return <Auth onGuestAccess={() => setShowAuth(false)} onBackToHome={() => setShowAuth(false)} />;

  const renderContent = () => {
    try {
      switch (activeSection) {
        case AppSection.HUB: return <KnowledgeHub setActiveSection={setActiveSection} language={context.language} />;
        case AppSection.EXPLORER: return <ExplorerSection context={context} onEarnPoints={(v) => handleEarnPoints(v, 'culture')} locationStatus="ready" refreshLocation={() => {}} />;
        case AppSection.WEEKLY_TIMELINE: return <WeeklyTimeline context={context} />;
        case AppSection.HISTORY: return <HistorySection context={context} onUpdatePoints={(v) => handleEarnPoints(v, 'history')} onDraftApplication={handleOpenApplicationWriter} />;
        case AppSection.LAW: return <LawSection context={context} onEarnPoints={(v) => handleEarnPoints(v, 'law')} section={AppSection.LAW} onDraftApplication={handleOpenApplicationWriter} />;
        case AppSection.FINANCE: return <FinanceSection context={context} onEarnPoints={(v) => handleEarnPoints(v, 'finance')} />;
        case AppSection.CITIZEN_RIGHTS: return <CitizenRightsSection context={context} onEarnPoints={(v) => handleEarnPoints(v, 'law')} onDraftApplication={handleOpenApplicationWriter} />;
        case AppSection.APPLICATION_WRITER: return <ApplicationWriter context={context} userName={user.name || 'Citizen'} onEarnPoints={(v) => handleEarnPoints(v, 'law')} prefill={appPrefill} clearPrefill={() => setAppPrefill(null)} />;
        case AppSection.CONSTITUTION: return <LawSection context={context} onEarnPoints={(v) => handleEarnPoints(v, 'law')} section={AppSection.CONSTITUTION} onDraftApplication={handleOpenApplicationWriter} />;
        case AppSection.DASHBOARD: return <Dashboard user={user} context={context} onSpendPoints={() => {}} onUpdateProfile={(d) => firebaseService.syncUserData(user.uid!, d)} onUpdateLanguage={(l) => setContext(p => ({...p, language: l}))} onLogout={() => { firebaseService.logout(); setShowLanding(true); }} onOpenAuth={() => setShowAuth(true)} />;
        case AppSection.DAILY_PRACTICE: return <DailyPractice context={context} onEarnPoints={(v) => handleEarnPoints(v, 'ethics')} />;
        case AppSection.COMPETITION: return <CompetitionSection user={user} context={context} onEarnPoints={(v) => handleEarnPoints(v, 'ethics')} />;
        case AppSection.EXPERT_CONNECT: return <ExpertConnect context={context} />;
        case AppSection.GLOBAL_SCHEMERS: return <GlobalSchemers context={context} onEarnPoints={(v) => handleEarnPoints(v, 'ethics')} />;
        case AppSection.MARKET_VISION: return <MarketVision context={context} />;
        case AppSection.RELIGIONS: return <ReligionSection context={context} onEarnPoints={(v) => handleEarnPoints(v, 'culture')} />;
        case AppSection.CULTURE: return <CultureSection context={context} onEarnPoints={(v) => handleEarnPoints(v, 'culture')} />;
        case AppSection.SAVED_SESSIONS: return <SavedArchives />;
        case AppSection.SUPPORT: return <SupportSection />;
        case AppSection.ABOUT_US: return <AboutSection />;
        case AppSection.CURRENT_AFFAIRS: return <CurrentAffairs context={context} onEarnPoints={(v) => handleEarnPoints(v, 'history')} />;
        case AppSection.LIVE_TUTOR: return <LiveTutor onEarnPoints={() => handleEarnPoints(50, 'ethics')} />;
        case AppSection.IMAGE_STUDY: return <ImageStudy onEarnPoints={() => handleEarnPoints(30, 'history')} />;
        case AppSection.CRIMINOLOGY: return <CriminologySection context={context} onUpdatePoints={(v) => handleEarnPoints(v, 'ethics')} />;
        case AppSection.POLICIES: return <PolicyHub />;
        case AppSection.RBA_SERVICES: return <RBAservices />;
        case AppSection.AURA_CHAMBER: return <AuraChamber user={user} context={context} />;
        default: return <KnowledgeHub setActiveSection={setActiveSection} language={context.language} />;
      }
    } catch (e) { return <KnowledgeHub setActiveSection={setActiveSection} language={context.language} />; }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-slate-950 text-slate-300 overflow-hidden font-['Inter']">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          language={context.language} 
          points={user.points}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isGuest={user.uid === 'guest'}
          onLoginClick={() => setShowAuth(true)}
        />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <header className="md:hidden h-16 bg-slate-900 border-b border-white/5 flex items-center px-4 shrink-0">
             <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center text-amber-500">
               <i className="fas fa-bars text-xl"></i>
             </button>
             <span className="ml-4 font-black uppercase italic text-white text-sm">नागरिक सेतु</span>
          </header>
          <Header user={user} onOpenDashboard={() => setActiveSection(AppSection.DASHBOARD)} language={context.language} onLoginClick={() => setShowAuth(true)} />
          <div className="flex-1 overflow-y-auto p-4 md:p-8 dark-scroll relative">
             <div className="max-w-7xl mx-auto animate-fadeIn">{renderContent()}</div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;