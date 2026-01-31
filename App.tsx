import React, { Component, useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { AppSection, UserState, LocalContext } from './types.ts';
import { firebaseService } from './services/firebaseService.ts';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import KnowledgeHub from './components/KnowledgeHub.tsx';
import HistorySection from './components/HistorySection.tsx';
import LawSection from './components/LawSection.tsx';
import Dashboard from './components/Dashboard.tsx';
import Auth from './components/Auth.tsx';
import SahayataKendra from './components/SahayataKendra.tsx';
import NyayDarpan from './components/NyayDarpan.tsx';
import JigyasaHub from './components/JigyasaHub.tsx';
import EPaper from './components/EPaper.tsx';
import PublicFeed from './components/PublicFeed.tsx';
import PrivacyPage from './components/PrivacyPage.tsx';
import TermsPage from './components/TermsPage.tsx';
import AboutUsPage from './components/AboutUsPage.tsx';
import ContactUsPage from './components/ContactUsPage.tsx';
import Launcher from './components/Launcher.tsx';
import RBAservices from './components/RBAservices.tsx';
import FinanceSection from './components/FinanceSection.tsx';
import CountryComparison from './components/CountryComparison.tsx';

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error?: Error; }

// Fix: Using React.Component explicitly to resolve inheritance issues in some TypeScript environments
class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Explicitly declaring the state property to fix error: Property 'state' does not exist on type 'GlobalErrorBoundary'
  public state: ErrorBoundaryState = { hasError: false };

  // Fix: Explicitly declaring the props property to fix error: Property 'props' does not exist on type 'GlobalErrorBoundary'
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: Redundant initialization removed as state is declared above
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("NagrikSetu Critical Error:", error, errorInfo);
  }
  
  render() {
    // Fix: state and props are now correctly accessible due to explicit inheritance and declaration
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 text-4xl mb-8 border border-rose-500/20 shadow-3xl">
            <i className="fas fa-plug-circle-exclamation animate-pulse"></i>
          </div>
          <h2 className="text-4xl font-black text-white uppercase italic mb-4 tracking-tighter royal-serif">सिस्टम रिकवरी मोड</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">एक तकनीकी त्रुटि हुई है। कृपया पृष्ठ को पुनः लोड करें।</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-amber-500 text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 shadow-3xl transition-all border-b-4 border-amber-700"
          >
            दोबारा शुरू करें
          </button>
        </div>
      );
    }
    // Fix: Property 'props' is inherited from React.Component correctly now
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.LAUNCHER);
  const [user, setUser] = useState<UserState>({
    uid: 'guest',
    points: 0,
    level: 'New Citizen',
    stage: 1,
    streak: 1,
    unlockedFeatures: [],
    auraStats: { history: 0, law: 0, ethics: 0, finance: 0, culture: 0 }
  });
  const [language, setLanguage] = useState('Hindi');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseService.onAuthChange((authUser) => {
      if (authUser) {
        setUser({
          uid: authUser.uid,
          name: authUser.displayName,
          email: authUser.email,
          points: 500,
          level: 'Scholar',
          stage: 2,
          streak: 5,
          unlockedFeatures: ['HISTORY_AUDIT'],
          auraStats: { history: 120, law: 80, ethics: 50, finance: 200, culture: 40 }
        });
        setShowAuth(false);
      } else {
        setUser({
          uid: 'guest',
          points: 0,
          level: 'New Citizen',
          stage: 1,
          streak: 1,
          unlockedFeatures: [],
          auraStats: { history: 0, law: 0, ethics: 0, finance: 0, culture: 0 }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdatePoints = (amount: number) => {
    setUser(prev => ({ ...prev, points: prev.points + amount }));
  };

  const checkAccess = (section: AppSection) => {
    if (user.uid === 'guest') {
      setShowAuth(true);
      return;
    }
    setActiveSection(section);
  };

  const renderSection = () => {
    const context: LocalContext = { language, country: 'India', city: user.detectedCity || 'India' };

    switch (activeSection) {
      case AppSection.LAUNCHER:
        return <Launcher onSelectApp={checkAccess} points={user.points} isGuest={user.uid === 'guest'} onLogin={() => setShowAuth(true)} />;
      case AppSection.HUB:
        return <KnowledgeHub setActiveSection={checkAccess} language={language} onEarnPoints={handleUpdatePoints} />;
      case AppSection.HISTORY:
        return <HistorySection context={context} onUpdatePoints={handleUpdatePoints} />;
      case AppSection.LOCAL_LAWS_EXPOSED:
        return <HistorySection context={context} onUpdatePoints={handleUpdatePoints} mode="exposed" />;
      case AppSection.CONSTITUTION:
        return <LawSection context={context} onEarnPoints={handleUpdatePoints} section={activeSection} />;
      case AppSection.EPAPER:
        return <EPaper context={context} onEarnPoints={handleUpdatePoints} user={user} />;
      case AppSection.NEWS_FEED:
        return <PublicFeed />;
      case AppSection.SAHAYATA_KENDRA:
        return <SahayataKendra context={context} onEarnPoints={handleUpdatePoints} />;
      case AppSection.NYAY_DARPAN:
        return <NyayDarpan context={context} onEarnPoints={handleUpdatePoints} />;
      case AppSection.JIGYASA_HUB:
        return <JigyasaHub context={context} onEarnPoints={handleUpdatePoints} />;
      case AppSection.GLOBAL_COMPARISON:
        return <CountryComparison context={context} onEarnPoints={handleUpdatePoints} />;
      case AppSection.FINANCE_ADVISORY:
        return <FinanceSection context={context} onEarnPoints={handleUpdatePoints} />;
      case AppSection.BUSINESS_ADVISORY:
      case AppSection.LEGAL_COMPLIANCE:
        return <RBAservices />;
      case AppSection.DASHBOARD:
        return <Dashboard 
          user={user} 
          context={context} 
          onSpendPoints={() => {}} 
          onUpdateProfile={() => {}} 
          onUpdateLanguage={setLanguage} 
          onLogout={() => firebaseService.logout()} 
        />;
      case AppSection.PRIVACY:
        return <PrivacyPage onBack={() => setActiveSection(AppSection.LAUNCHER)} />;
      case AppSection.TERMS:
        return <TermsPage onBack={() => setActiveSection(AppSection.LAUNCHER)} />;
      case AppSection.ABOUT_US:
        return <AboutUsPage onBack={() => setActiveSection(AppSection.LAUNCHER)} />;
      case AppSection.CONTACT_US:
        return <ContactUsPage onBack={() => setActiveSection(AppSection.LAUNCHER)} />;
      default:
        return <Launcher onSelectApp={checkAccess} points={user.points} isGuest={user.uid === 'guest'} onLogin={() => setShowAuth(true)} />;
    }
  };

  if (showAuth) {
    return <Auth onBackToHome={() => setShowAuth(false)} />;
  }

  return (
    <GlobalErrorBoundary>
      <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden">
        {user.uid !== 'guest' && (
          <Sidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            language={language} 
            points={user.points} 
            unlockedFeatures={user.unlockedFeatures} 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen}
            isGuest={false}
            onLoginClick={() => {}}
          />
        )}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header 
            user={user} 
            onOpenDashboard={() => setActiveSection(AppSection.DASHBOARD)} 
            language={language} 
            onLoginClick={() => setShowAuth(true)}
            onBackToLauncher={() => setActiveSection(AppSection.LAUNCHER)}
            activeSection={activeSection}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            {renderSection()}
          </main>
        </div>
      </div>
    </GlobalErrorBoundary>
  );
};

export default App;