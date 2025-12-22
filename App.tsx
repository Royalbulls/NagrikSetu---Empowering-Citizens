
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AppSection, UserState, LocalContext } from './types';
import { geminiService } from './services/geminiService';
import { firebaseService } from './services/firebaseService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import HistorySection from './components/HistorySection';
import LawSection from './components/LawSection';
import CurrentAffairs from './components/CurrentAffairs';
import LiveTutor from './components/LiveTutor';
import ImageStudy from './components/ImageStudy';
import CriminologySection from './components/CriminologySection';
import MyStorySection from './components/MyStorySection';
import DailyPractice from './components/DailyPractice';
import CompetitionSection from './components/CompetitionSection';
import GlobalSchemers from './components/GlobalSchemers';
import CrimeSceneExplainer from './components/CrimeSceneExplainer';
import KnowledgeHub from './components/KnowledgeHub';
import MarketVision from './components/MarketVision';
import ReligionSection from './components/ReligionSection';
import CultureSection from './components/CultureSection';
import SavedArchives from './components/SavedArchives';
import SupportSection from './components/SupportSection';
import AboutSection from './components/AboutSection';
import ExplorerSection from './components/ExplorerSection';
import WeeklyTimeline from './components/WeeklyTimeline';
import Auth from './components/Auth';

const uiTranslations: Record<string, any> = {
  Hindi: { welcome: "स्वागत है", scholar: "विद्वान", menu: "मेन्यू", stats: "आंकड़े", profile: "प्रोफाइल", location: "स्थान" },
  English: { welcome: "Welcome", scholar: "Scholar", menu: "Menu", stats: "Stats", profile: "Profile", location: "Location" }
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HUB);
  const [user, setUser] = useState<UserState | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [context, setContext] = useState<LocalContext>({ language: 'Hindi', country: 'India', city: 'Delhi' });
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'ready' | 'denied' | 'timeout'>('idle');
  const authProcessedRef = useRef(false);

  // Handle Authentication Lifecycle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authProcessedRef.current) {
        console.warn("Auth check deferred to background.");
        setAuthLoading(false);
      }
    }, 4500);

    const unsubscribe = firebaseService.onAuthChange(async (fbUser) => {
      authProcessedRef.current = true;
      try {
        if (fbUser) {
          const existingData = await firebaseService.getUserData(fbUser.uid);
          if (existingData) {
            setUser({ ...existingData, uid: fbUser.uid } as UserState);
          } else {
            const newData: UserState = {
              uid: fbUser.uid,
              points: 250,
              level: 'Citizen Scholar',
              streak: 1,
              name: fbUser.displayName || 'New Citizen',
              photo: fbUser.photoURL || '',
            };
            await firebaseService.syncUserData(fbUser.uid, newData);
            setUser(newData);
          }
        } else {
          // If was a guest, don't auto-overwrite, but if null clear.
          const guest = localStorage.getItem('nagriksetu_user_guest');
          if (guest) setUser(JSON.parse(guest));
          else setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setAuthLoading(false);
        clearTimeout(timer);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleGuestAccess = () => {
    const guestUser: UserState = {
      uid: 'guest',
      points: 100,
      level: 'Anonymous Explorer',
      streak: 0,
      name: 'Guest User',
    };
    localStorage.setItem('nagriksetu_user_guest', JSON.stringify(guestUser));
    setUser(guestUser);
  };

  const initLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setContext(prev => ({ ...prev, lat, lng }));
        setLocationStatus('ready');
        try {
          const region = await geminiService.getRegionalContext(lat, lng);
          if (region && region.country) {
            setContext(prev => ({ ...prev, country: region.country, city: region.city || prev.city, language: region.language || prev.language }));
            if (user?.uid) {
              updateProfile({ detectedCountry: region.country, detectedCity: region.city, detectedLanguage: region.language });
            }
          }
        } catch (e) {}
      },
      (err) => setLocationStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'timeout'),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  }, [user?.uid]);

  useEffect(() => { if (user) initLocation(); }, [user, initLocation]);

  const handleEarnPoints = useCallback((amount: number = 20) => {
    if (!user?.uid) return;
    const newPoints = user.points + amount;
    const update = { points: newPoints };
    setUser(prev => prev ? ({ ...prev, ...update }) : null);
    firebaseService.syncUserData(user.uid, update);
  }, [user]);

  const handleSpendPoints = (amount: number) => {
    if (!user?.uid) return;
    const newPoints = Math.max(0, user.points - amount);
    const update = { points: newPoints };
    setUser(prev => prev ? ({ ...prev, ...update }) : null);
    firebaseService.syncUserData(user.uid, update);
  };

  const updateProfile = (data: Partial<UserState>) => {
    if (!user?.uid) return;
    setUser(prev => prev ? ({ ...prev, ...data }) : null);
    firebaseService.syncUserData(user.uid, data);
  };

  const handleLogout = async () => {
    localStorage.removeItem('nagriksetu_user_guest');
    await firebaseService.logout();
    setUser(null);
    setActiveSection(AppSection.HUB);
  };

  const saveSearchHistory = useCallback((query: string, section: string) => {
    if (!user?.uid) return;
    const entry = { id: Date.now().toString(), query, section, timestamp: Date.now() };
    firebaseService.saveSearchHistory(user.uid, entry);
    // Local update
    setUser(prev => prev ? ({...prev, searchHistory: [entry, ...(prev.searchHistory || [])].slice(0, 30)}) : null);
  }, [user?.uid]);

  if (authLoading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center p-10">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/20 mb-8">
           <i className="fas fa-bridge text-amber-500 text-3xl animate-pulse"></i>
        </div>
        <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] text-center">Verifying Global ID...</p>
        <p className="text-slate-700 text-[9px] mt-4 font-bold uppercase tracking-widest">NagrikSetu Secure Uplink</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onGuestAccess={handleGuestAccess} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.HUB: return <KnowledgeHub setActiveSection={setActiveSection} language={context.language} />;
      case AppSection.EXPLORER: return <ExplorerSection context={context} onEarnPoints={handleEarnPoints} onSearch={(q) => saveSearchHistory(q, 'Explorer')} locationStatus={locationStatus} refreshLocation={initLocation} />;
      case AppSection.WEEKLY_TIMELINE: return <WeeklyTimeline context={context} />;
      case AppSection.HISTORY: return <HistorySection context={context} onUpdatePoints={handleEarnPoints} onSearch={(q) => saveSearchHistory(q, 'History')} />;
      case AppSection.LAW: return <LawSection context={context} onEarnPoints={handleEarnPoints} onSearch={(q) => saveSearchHistory(q, 'Law')} section={AppSection.LAW} />;
      case AppSection.CONSTITUTION: return <LawSection context={context} onEarnPoints={handleEarnPoints} onSearch={(q) => saveSearchHistory(q, 'Constitution')} section={AppSection.CONSTITUTION} />;
      case AppSection.DASHBOARD: return <Dashboard user={user} context={context} onSpendPoints={handleSpendPoints} onUpdateProfile={updateProfile} onUpdateLanguage={(l) => setContext(p => ({...p, language: l}))} onLogout={handleLogout} onRevisitSearch={(q, section) => {
        if (section === 'Law') setActiveSection(AppSection.LAW);
        else if (section === 'Constitution') setActiveSection(AppSection.CONSTITUTION);
        else if (section === 'History') setActiveSection(AppSection.HISTORY);
        else setActiveSection(AppSection.EXPLORER);
      }} />;
      default: return <KnowledgeHub setActiveSection={setActiveSection} language={context.language} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 overflow-hidden font-['Inter']">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} language={context.language} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header user={user} onOpenDashboard={() => setActiveSection(AppSection.DASHBOARD)} language={context.language} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 dark-scroll bg-slate-950">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-amber-900/30 flex justify-around p-4 z-50 shadow-2xl">
        <button onClick={() => setActiveSection(AppSection.HUB)} className={`flex flex-col items-center ${activeSection === AppSection.HUB ? 'text-amber-500' : 'text-slate-500'}`}><i className="fas fa-home text-lg"></i></button>
        <button onClick={() => setActiveSection(AppSection.WEEKLY_TIMELINE)} className={`flex flex-col items-center ${activeSection === AppSection.WEEKLY_TIMELINE ? 'text-emerald-500' : 'text-slate-500'}`}><i className="fas fa-timeline text-lg"></i></button>
        <button onClick={() => setActiveSection(AppSection.LAW)} className={`flex flex-col items-center ${activeSection === AppSection.LAW ? 'text-blue-500' : 'text-slate-500'}`}><i className="fas fa-balance-scale text-lg"></i></button>
        <button onClick={() => setActiveSection(AppSection.DASHBOARD)} className={`flex flex-col items-center ${activeSection === AppSection.DASHBOARD ? 'text-amber-500' : 'text-slate-500'}`}><i className="fas fa-user-circle text-lg"></i></button>
      </nav>
    </div>
  );
};

export default App;
