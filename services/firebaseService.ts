
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set, push, query, orderByChild, limitToLast, get, Database, update } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, Auth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, AppCheck } from "firebase/app-check";
import { LeaderboardEntry, UserState, ContestHistory, SearchEntry } from "../types";

// Official NagrikSetu Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5ezP0LDYe5rCCx9M4fb39YLDeafyWwF8",
  authDomain: "studio-1007781369-dd9ce.firebaseapp.com",
  projectId: "studio-1007781369-dd9ce",
  storageBucket: "studio-1007781369-dd9ce.firebasestorage.app",
  messagingSenderId: "858306481014",
  appId: "1:858306481014:web:1528d0e2caa2c7cd730857",
  databaseURL: "https://studio-1007781369-dd9ce-default-rtdb.firebaseio.com"
};

let db: Database | null = null;
let auth: Auth | null = null;
let appCheck: AppCheck | null = null;
let isLive = false;
let initError: string | null = null;

const initialize = () => {
  try {
    // 1. Core Handshake - Independent of security layer
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getDatabase(app);
    
    // Core is active immediately
    isLive = true;
    initError = null;

    // 2. Intelligent Security Layer Gating
    // We only enable App Check on domains authorized in the reCAPTCHA console.
    // This prevents the "appCheck/recaptcha-error" on preview domains like .firebasestorage.app
    const hostname = window.location.hostname;
    const isProdDomain = hostname.endsWith('firebaseapp.com') || hostname.endsWith('web.app');
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    
    // Proactively skip if we are in a sandboxed preview environment
    const isPreview = hostname.includes('firebasestorage.app') || hostname.includes('preview');

    if (isProdDomain && !isPreview) {
      try {
        appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider('6LfZqzMsAAAAABuxCeh9OG11slCiPmdeqQ-6Fs9_'),
          isTokenAutoRefreshEnabled: true
        });
        console.log("NagrikSetu Security: Production App Check Active.");
      } catch (acErr: any) {
        console.warn("NagrikSetu Security: App Check initialization skipped or failed internally.");
      }
    } else {
      console.log(`NagrikSetu Security: App Check deferred (Environment: ${hostname}).`);
    }

    console.log("NagrikSetu Cloud: Uplink Online.");
  } catch (error: any) {
    isLive = false;
    initError = error?.message || "Critical Connection Error";
    console.error("NagrikSetu Cloud: Handshake Failed.", initError);
  }
};

// Start initialization immediately
initialize();

const MOCK_USER_PREFIX = 'nagriksetu_user_';

export const firebaseService = {
  isCloudConnected() { return isLive; },
  getInitError() { return initError; },
  retryConnection() { initialize(); return isLive; },

  async saveSearchHistory(uid: string, entry: SearchEntry) {
    const current = await this.getUserData(uid) || { points: 0, level: 'Beginner', streak: 0 };
    const history = [entry, ...(current.searchHistory || [])].slice(0, 30);
    await this.syncUserData(uid, { ...current, searchHistory: history });
  },

  async loginWithGoogle() {
    if (auth && isLive) {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      return await signInWithPopup(auth, provider);
    }
    throw new Error("Cloud Auth Unavailable (Network or Init Error)");
  },

  async signUpWithEmail(email: string, pass: string) {
    if (auth && isLive) {
      return await createUserWithEmailAndPassword(auth, email, pass);
    }
    throw new Error("Cloud Sign-up Unavailable");
  },

  async loginWithEmail(email: string, pass: string) {
    if (auth && isLive) {
      return await signInWithEmailAndPassword(auth, email, pass);
    }
    throw new Error("Cloud Login Unavailable");
  },

  async logout() {
    if (auth) await signOut(auth);
    localStorage.removeItem('nagriksetu_user_guest');
  },

  onAuthChange(callback: (user: any | null) => void) {
    if (auth) {
      return onAuthStateChanged(auth, (user) => {
        callback(user);
      });
    }
    callback(null);
    return () => {};
  },

  async syncUserData(uid: string, data: Partial<UserState>) {
    if (isLive && db && uid !== 'guest') {
      try {
        const userRef = ref(db, `users/${uid}`);
        await update(userRef, { ...data, lastSync: Date.now() });
      } catch (e) {
        console.warn("Cloud Sync Interrupted.");
      }
    }
    const existing = localStorage.getItem(MOCK_USER_PREFIX + uid);
    const merged = existing ? { ...JSON.parse(existing), ...data } : data;
    localStorage.setItem(MOCK_USER_PREFIX + uid, JSON.stringify(merged));
  },

  async getUserData(uid: string): Promise<Partial<UserState> | null> {
    if (isLive && db && uid !== 'guest') {
      try {
        const userRef = ref(db, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) return snapshot.val();
      } catch (error) {
        console.warn("Cloud Fetch Interrupted.");
      }
    }
    const localData = localStorage.getItem(MOCK_USER_PREFIX + uid);
    return localData ? JSON.parse(localData) : null;
  },

  async submitScore(uid: string, name: string, points: number, badge: string, contestDetails?: ContestHistory) {
    if (isLive && db) {
      try {
        const leaderboardRef = ref(db, 'leaderboard');
        const newEntryRef = push(leaderboardRef);
        await set(newEntryRef, { name, points, badge, timestamp: Date.now(), uid });
      } catch (error) {
        console.error("Cloud Leaderboard Submit Error");
      }
    }
    
    if (contestDetails) {
      const currentData = await this.getUserData(uid) || { points: 0, level: 'Beginner', streak: 0 };
      const updatedContests = [...(currentData.contests || []), contestDetails];
      await this.syncUserData(uid, { ...currentData, points, contests: updatedContests });
    }
  },

  onLeaderboardUpdate(callback: (entries: LeaderboardEntry[]) => void) {
    if (!isLive || !db) {
      callback([]);
      return () => {};
    }
    const leaderboardRef = ref(db, 'leaderboard');
    const q = query(leaderboardRef, orderByChild('points'), limitToLast(20));
    return onValue(q, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const entries: any[] = Object.keys(rawData).map(key => ({ ...rawData[key], id: key }));
        const sorted = entries.sort((a, b) => b.points - a.points);
        callback(sorted.map((entry, index) => ({ ...entry, rank: index + 1 })));
      }
    });
  }
};
