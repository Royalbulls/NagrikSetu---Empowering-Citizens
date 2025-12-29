
import React, { useState, useEffect, useCallback, ErrorInfo, ReactNode, Component } from 'react';
import { AppSection, UserState, LocalContext, AuraStats } from './types.ts';
import { firebaseService } from './services/firebaseService.ts';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import KnowledgeHub from './components/KnowledgeHub.tsx';
import HistorySection from './components/HistorySection.tsx';
import LawSection from './components/LawSection.tsx';
import Dashboard from './components/Dashboard.tsx';
import Auth from './components/Auth.tsx';
import LandingPage from './components/LandingPage.tsx';
import SahayataKendra from './components/SahayataKendra.tsx';
import NyayDarpan from './components/NyayDarpan.tsx';
import JigyasaHub from './components/JigyasaHub.tsx';
import FinancialShield from './components/FinancialShield.tsx';
import EmergencyRoadLegal from './components/EmergencyRoadLegal.tsx';
import EPaper from './components/EPaper.tsx';
import PrivacyPage from './components/PrivacyPage.tsx';
import TermsPage from './components/TermsPage.tsx';
import RefundPolicyPage from './components/RefundPolicyPage.tsx';
import AboutUsPage from './components/AboutUsPage.tsx';
import ContactUsPage from './components/ContactUsPage.tsx';
import ApplicationWriter from './components/ApplicationWriter.tsx';
import Launcher from './components/Launcher.tsx';
import RBAservices from './components/RBAservices.tsx';

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error?: Error; }

/**
 * Global Error Boundary to catch UI crashes and offer recovery.
 * Fix: Explicitly extending Component directly from 'react' ensures TypeScript correctly inherits generic 'props' and 'state' types.
 */
// Fix: Use the imported Component and pass generic types to fix "Property 'state' does not exist" and "Property 'props' does not exist" errors.
class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState { 
    return { hasError: true, error }; 
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) { 
    console.error("NagrikSetu System Exception:", error, errorInfo); 
  }

  render() {
    // Fix: Accessing this.state which is now properly recognized through direct generic Component extension
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 text-4xl mb-8 border border-rose-500/20 shadow-3xl"><i className="fas fa-plug-circle-exclamation animate-pulse"></i></div>
          <h2 className="text-4xl font-black text-white uppercase italic mb-4 tracking-tighter royal-serif">सिस्टम रिकवरी मोड</h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-8 max-w-sm">We encountered an unexpected error. Restoring your session.</p>
          <button onClick={() => window.location.reload()} className="bg-amber-500 text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 shadow-3xl transition-all border-b-4 border-amber-700">दोबारा शुरू करें</button>
        </div>
      );
    }
    // Fix: Accessing this.props which is now properly recognized through explicit inheritance
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.LAUNCHER);
  const [user, setUser] = useState<UserState>({ 
    uid: 'guest', points: 150, level: 'New Citizen', stage: 1, streak: 1,
    unlockedFeatures: ['hub', 'dashboard', 'epaper', 'history', 'constitution'],
    auraStats: { history: 0, law: 0, ethics: 0, finance: 0, culture: 0 }
  });
  const [showLanding, setShowLanding] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [context, setContext] = useState<LocalContext>({ language: 'Hindi', country: 'India', city: 'Sagar', domain: 'rbaadvisor.com' });
  const [isInitializing, setIsInitializing] = useState(true);

  const isAuthenticated = user.uid !== 'guest' && !!user.uid;

  useEffect(() => {
    // Robust initialization with a safety fallback
    const initTimer = setTimeout(() => {
      setIsInitializing(false);
    }, 2000);

    const unsubscribe = firebaseService.onAuthChange((fbUser) => {
      if (fbUser) {
        setUser(prev => ({ ...prev, uid: fbUser.uid, name: fbUser.displayName, email: fbUser.email }));
        setShowAuth(false);
        setShowLanding(false);
      } else {
        setUser(prev => ({ ...prev, uid: 'guest' }));
      }
      setIsInitializing(false);
      clearTimeout(initTimer);
    });

    return () => {
      unsubscribe();
      clearTimeout(initTimer);
    };
  }, []);

  const handleEarnPoints = useCallback((amount: number = 20, category?: keyof AuraStats) => {
    if (!isAuthenticated) return;
    const newPoints = (user.points || 0) + amount;
    setUser(prev => ({ ...prev, points: newPoints }));
    if (user.uid) firebaseService.syncUserData(user.uid, { points: newPoints });
  }, [user.uid, user.points, isAuthenticated]);

  const navigateToSection = (section: AppSection) => {
    setActiveSection(section);
    setShowLanding(false);
    setShowAuth(false);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center space-y-12 animate-fadeIn text-center p-6">
        <div className="relative">
           <div className="w-24 h-24 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
           <i className="fas fa-bullseye absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 text-2xl animate-pulse"></i>
        </div>
        <p className="text-amber-500 font-black uppercase tracking-[0.6em] text-[11px] royal-serif">NAGRIK SETU: LOADING MODULES...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.LAUNCHER: return <Launcher onSelectApp={navigateToSection} points={user.points} />;
      case AppSection.FINANCE: return <RBAservices />;
      case AppSection.HUB: return <KnowledgeHub setActiveSection={navigateToSection} language={context.language} onEarnPoints={handleEarnPoints} />;
      case AppSection.HISTORY: return <HistorySection context={context} onUpdatePoints={(v) => handleEarnPoints(v, 'history')} />;
      case AppSection.CONSTITUTION: return <LawSection context={context} onEarnPoints={(v) => handleEarnPoints(v, 'law')} section={AppSection.CONSTITUTION} />;
      case AppSection.EPAPER: return <EPaper context={context} onEarnPoints={(v) => handleEarnPoints(v, 'ethics')} />;
      case AppSection.SAHAYATA_KENDRA: return <SahayataKendra context={context} onEarnPoints={(v) => handleEarnPoints(v, 'ethics')} />;
      case AppSection.NYAY_DARPAN: return <NyayDarpan context={context} onEarnPoints={(v) => handleEarnPoints(v, 'law')} />;
      case AppSection.JIGYASA_HUB: return <JigyasaHub context={context} onEarnPoints={(v) => handleEarnPoints(v, 'ethics')} />;
      case AppSection.FINANCE_SHIELD: return <FinancialShield context={context} onEarnPoints={(v) => handleEarnPoints(v, 'finance')} />;
      case AppSection.EMERGENCY_LEGAL: return <EmergencyRoadLegal context={context} onEarnPoints={(v) => handleEarnPoints(v, 'law')} />;
      case AppSection.APPLICATION_WRITER: return <ApplicationWriter context={context} userName={user.name || 'Scholar'} onEarnPoints={(v) => handleEarnPoints(v, 'law')} />;
      case AppSection.DASHBOARD: return <Dashboard user={user} context={context} onSpendPoints={() => {}} onUpdateProfile={(d) => firebaseService.syncUserData(user.uid!, d)} onUpdateLanguage={(l) => setContext(p => ({...p, language: l}))} onLogout={() => firebaseService.logout()} onOpenAuth={() => setShowAuth(true)} />;
      case AppSection.PRIVACY: return <PrivacyPage onBack={() => navigateToSection(AppSection.HUB)} />;
      case AppSection.TERMS: return <TermsPage onBack={() => navigateToSection(AppSection.HUB)} />;
      case AppSection.REFUND: return <RefundPolicyPage onBack={() => navigateToSection(AppSection.HUB)} />;
      case AppSection.ABOUT_US: return <AboutUsPage onBack={() => navigateToSection(AppSection.HUB)} />;
      case AppSection.CONTACT_US: return <ContactUsPage onBack={() => navigateToSection(AppSection.HUB)} />;
      default: return <Launcher onSelectApp={navigateToSection} points={user.points} />;
    }
  };

  const currentView = showAuth 
    ? <Auth onBackToHome={() => { setShowAuth(false); setShowLanding(true); }} />
    : (showLanding && !isAuthenticated) 
      ? <LandingPage onStart={() => setShowAuth(true)} onNavigate={navigateToSection} />
      : (
        <div className="flex h-screen bg-[#020617] text-slate-300 overflow-hidden font-sans">
          {activeSection !== AppSection.LAUNCHER && (
            <Sidebar activeSection={activeSection} setActiveSection={navigateToSection} language={context.language} points={user.points} unlockedFeatures={user.unlockedFeatures} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isGuest={!isAuthenticated} onLoginClick={() => setShowAuth(true)} />
          )}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <Header 
              user={user} 
              onOpenDashboard={() => isAuthenticated ? navigateToSection(AppSection.DASHBOARD) : setShowAuth(true)} 
              language={context.language} 
              onLoginClick={() => setShowAuth(true)} 
              onBackToLauncher={() => navigateToSection(AppSection.LAUNCHER)}
              activeSection={activeSection}
            />
            <div className="flex-1 overflow-y-auto p-4 md:p-12 dark-scroll bg-[radial-gradient(circle_at_50%_-20%,_rgba(251,191,36,0.03),_transparent)]">
               <div className="max-w-7xl mx-auto min-h-[calc(100vh-180px)]">{renderContent()}</div>
            </div>
          </main>
        </div>
      );

  return <GlobalErrorBoundary>{currentView}</GlobalErrorBoundary>;
};

export default App;
