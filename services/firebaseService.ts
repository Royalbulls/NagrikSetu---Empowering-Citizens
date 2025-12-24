
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, Auth, updateProfile } from "firebase/auth";
import { LeaderboardEntry, UserState, ContestHistory, SearchEntry } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyC5ezP0LDYe5rCCx9M4fb39YLDeafyWwF8",
  authDomain: "studio-1007781369-dd9ce.firebaseapp.com",
  projectId: "studio-1007781369-dd9ce",
  storageBucket: "studio-1007781369-dd9ce.firebasestorage.app",
  messagingSenderId: "858306481014",
  appId: "1:858306481014:web:1528d0e2caa2c7cd730857",
  databaseURL: "https://studio-1007781369-dd9ce-default-rtdb.firebaseio.com"
};

const STORAGE_PREFIX = 'nagrik_local_v1_';
const CURRENT_USER_KEY = 'nagriksetu_current_uid';

// Helper to get safe Auth instance
const getSafeAuth = (): Auth | null => {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    return getAuth(app);
  } catch (e) {
    console.warn("Firebase Auth hidden from local mode.");
    return null;
  }
};

export const firebaseService = {
  isCloudConnected() {
    return !!getSafeAuth();
  },

  getInitError() {
    return null;
  },

  retryConnection() {
    window.location.reload();
  },

  async syncUserData(uid: string, data: Partial<UserState>) {
    const key = STORAGE_PREFIX + uid;
    const existing = localStorage.getItem(key);
    const parsed = existing ? JSON.parse(existing) : {};
    const merged = { ...parsed, ...data };
    localStorage.setItem(key, JSON.stringify(merged));
    localStorage.setItem(CURRENT_USER_KEY, uid);
  },

  async getUserData(uid: string): Promise<Partial<UserState> | null> {
    const local = localStorage.getItem(STORAGE_PREFIX + uid);
    return local ? JSON.parse(local) : null;
  },

  async saveSearchHistory(uid: string, entry: SearchEntry) {
    const current = await firebaseService.getUserData(uid) || { points: 0 };
    const history = [entry, ...(current.searchHistory || [])].slice(0, 50);
    await firebaseService.syncUserData(uid, { ...current, searchHistory: history });
  },

  async submitScore(uid: string, name: string, points: number, badge: string, contestDetails?: ContestHistory) {
    const current = await firebaseService.getUserData(uid) || { points: 0 };
    const contests = contestDetails ? [...(current.contests || []), contestDetails] : (current.contests || []);
    await firebaseService.syncUserData(uid, { name, points, contests, level: badge });
  },

  onAuthChange(callback: (user: any | null) => void) {
    // 1. Initial check from Local Storage for zero-latency response
    const lastUid = localStorage.getItem(CURRENT_USER_KEY);
    if (lastUid) {
      const userData = localStorage.getItem(STORAGE_PREFIX + lastUid);
      if (userData) {
        const parsed = JSON.parse(userData);
        callback({ uid: lastUid, displayName: parsed.name, email: parsed.email });
      }
    } else {
      callback(null);
    }

    // 2. Setup Firebase listener if cloud is active
    const auth = getSafeAuth();
    if (auth) {
      return onAuthStateChanged(auth, (user) => {
        if (user) {
          firebaseService.syncUserData(user.uid, { name: user.displayName || 'Citizen', email: user.email || '' });
          callback({ uid: user.uid, displayName: user.displayName, email: user.email });
        } else {
          if (!localStorage.getItem(CURRENT_USER_KEY)) {
            callback(null);
          }
        }
      });
    }

    return () => { /* No-op unsubscribe if auth isn't available */ };
  },

  async loginWithEmail(email: string, pass: string) {
    const auth = getSafeAuth();
    const normalizedEmail = email.trim().toLowerCase();
    
    // Attempt Cloud Login
    if (auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
        // Ensure local sync happens immediately on cloud success
        await firebaseService.syncUserData(cred.user.uid, { 
          name: cred.user.displayName || 'Citizen', 
          email: normalizedEmail 
        });
        return cred;
      } catch (e: any) {
        // Handle specific cloud errors that shouldn't trigger local fallback
        if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
          throw new Error("Wrong password. Please try again.");
        }
        console.warn("Cloud login failed, trying local fallback", e.code);
      }
    }

    // Local Logic Fallback
    const localUid = 'local_' + btoa(normalizedEmail).substring(0, 8);
    const data = await firebaseService.getUserData(localUid);
    if (data) {
      localStorage.setItem(CURRENT_USER_KEY, localUid);
      window.location.reload();
      return { user: { uid: localUid, displayName: data.name, email: normalizedEmail } };
    }
    
    throw new Error("Local account not found. Please sign up first.");
  },

  async signUpWithEmail(email: string, pass: string, name: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const localUid = 'local_' + btoa(normalizedEmail).substring(0, 8);
    
    // Setup local record first
    await firebaseService.syncUserData(localUid, { 
      name, 
      points: 250, 
      streak: 1, 
      email: normalizedEmail, 
      level: 'Citizen Scholar' 
    });

    const auth = getSafeAuth();
    if (auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
        await updateProfile(cred.user, { displayName: name });
        return cred;
      } catch (e) {
        console.error("Cloud signup failed", e);
      }
    }
    
    localStorage.setItem(CURRENT_USER_KEY, localUid);
    window.location.reload();
    return { user: { uid: localUid, displayName: name, email: normalizedEmail } };
  },

  async logout() {
    const auth = getSafeAuth();
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {}
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('nagriksetu_user_guest');
    window.location.reload();
  },

  onLeaderboardUpdate(callback: (entries: LeaderboardEntry[]) => void) {
    callback([]);
    return () => {};
  }
};
