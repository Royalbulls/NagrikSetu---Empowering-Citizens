
import { LeaderboardEntry, UserState, ContestHistory, AssistanceRecord, PublishedNews } from "../types.ts";

// विकास के दौरान हम LocalStorage का उपयोग करेंगे
const STORAGE_PREFIX = 'nagrik_dev_v1_';
const CURRENT_USER_KEY = 'nagriksetu_current_uid';
const PUBLIC_FEED_KEY = STORAGE_PREFIX + 'public_news_feed';

// ऑथेंटिकेशन स्टेट बदलने पर सूचना देने के लिए सब्सक्राइबर्स की सूची
let authSubscribers: ((user: any | null) => void)[] = [];

const notifyAuthChange = (user: any | null) => {
  authSubscribers.forEach(cb => cb(user));
};

export const firebaseService = {
  isCloudConnected() {
    return false; 
  },

  async logAssistanceRecord(record: AssistanceRecord) {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'records') || '[]');
      existing.push({ ...record, serverTimestamp: Date.now() });
      localStorage.setItem(STORAGE_PREFIX + 'records', JSON.stringify(existing));
    } catch (e) {
      console.warn("LocalStorage access failed in logAssistanceRecord", e);
    }
  },

  async syncUserData(uid: string, data: Partial<UserState>) {
    try {
      const key = STORAGE_PREFIX + uid;
      const existing = localStorage.getItem(key);
      const parsed = existing ? JSON.parse(existing) : { points: 0, streak: 1, level: 'New Citizen' };
      const merged = { ...parsed, ...data, uid };
      localStorage.setItem(key, JSON.stringify(merged));
      localStorage.setItem(CURRENT_USER_KEY, uid);
    } catch (e) {
      console.warn("LocalStorage access failed in syncUserData", e);
    }
  },

  // 📰 Public Feed Service
  async publishNews(news: Omit<PublishedNews, 'id' | 'timestamp' | 'likes' | 'shares'>) {
    try {
      const feed = JSON.parse(localStorage.getItem(PUBLIC_FEED_KEY) || '[]');
      const newEntry: PublishedNews = {
        ...news,
        id: 'news-' + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        likes: 0,
        shares: 0
      };
      feed.unshift(newEntry);
      localStorage.setItem(PUBLIC_FEED_KEY, JSON.stringify(feed.slice(0, 50))); // Keep last 50
      return newEntry;
    } catch (e) {
      console.error("Publishing failed", e);
      throw e;
    }
  },

  async getPublicFeed(): Promise<PublishedNews[]> {
    try {
      return JSON.parse(localStorage.getItem(PUBLIC_FEED_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  onAuthChange(callback: (user: any | null) => void) {
    authSubscribers.push(callback);
    
    try {
      const lastUid = localStorage.getItem(CURRENT_USER_KEY);
      if (lastUid) {
        const localData = localStorage.getItem(STORAGE_PREFIX + lastUid);
        if (localData) {
          const parsed = JSON.parse(localData);
          callback({ uid: lastUid, displayName: parsed.name || 'Citizen', email: parsed.email });
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    } catch (e) {
      console.warn("LocalStorage access failed during onAuthChange", e);
      callback(null);
    }

    // अनसब्सक्राइब फंक्शन
    return () => {
      authSubscribers = authSubscribers.filter(cb => cb !== callback);
    };
  },

  async loginWithEmail(email: string, pass: string) {
    const uid = btoa(email).substring(0, 10);
    let existingData = null;
    try {
      const existing = localStorage.getItem(STORAGE_PREFIX + uid);
      if (existing) existingData = JSON.parse(existing);
    } catch (e) {}
    
    if (existingData) {
      localStorage.setItem(CURRENT_USER_KEY, uid);
      notifyAuthChange({ uid, displayName: existingData.name, email: existingData.email });
      return { user: existingData };
    } else {
      // ऑटो-साइनअप (डेवलपमेंट के लिए)
      const newUser = { uid, name: email.split('@')[0], email, points: 250, level: 'Scholar' };
      await this.syncUserData(uid, newUser);
      try { localStorage.setItem(CURRENT_USER_KEY, uid); } catch (e) {}
      notifyAuthChange({ uid, displayName: newUser.name, email: newUser.email });
      return { user: newUser };
    }
  },

  async signUpWithEmail(email: string, pass: string, name: string) {
    const uid = btoa(email).substring(0, 10);
    const newUser = { uid, name, email, points: 250, level: 'Scholar' };
    await this.syncUserData(uid, newUser);
    try { localStorage.setItem(CURRENT_USER_KEY, uid); } catch (e) {}
    notifyAuthChange({ uid, displayName: newUser.name, email: newUser.email });
    return { user: newUser };
  },

  async logout() {
    try { localStorage.removeItem(CURRENT_USER_KEY); } catch (e) {}
    notifyAuthChange(null);
  },

  onLeaderboardUpdate(callback: (entries: LeaderboardEntry[]) => void) {
    callback([
      { rank: 1, name: "Krishna", points: 5400, badge: "Grand Master" },
      { rank: 2, name: "Aura AI", points: 4200, badge: "Legal Sentinel" },
      { rank: 3, name: "Rahul Jain", points: 3100, badge: "Rights Advocate" }
    ]);
    return () => {};
  },

  async submitScore(uid: string, name: string, points: number, badge: string, contestDetails?: ContestHistory) {
    await this.syncUserData(uid, { name, points, level: badge });
  }
};
