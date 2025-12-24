
export interface Message {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingLinks?: Array<{ title: string; uri: string }>;
  images?: string[];
}

export interface AuraStats {
  history: number;
  law: number;
  ethics: number;
  finance: number;
  culture: number;
}

export interface SearchEntry {
  id: string;
  query: string;
  section: string;
  timestamp: number;
}

export interface ContestHistory {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  pointsEarned: number;
  timestamp: number;
}

export interface UserState {
  uid?: string;
  points: number;
  level: string;
  streak: number;
  name?: string;
  email?: string;
  dob?: string;
  place?: string;
  photo?: string;
  detectedCountry?: string;
  detectedCity?: string;
  detectedLanguage?: string;
  contests?: ContestHistory[];
  searchHistory?: SearchEntry[];
  auraStats?: AuraStats;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TimelineEvent {
  year: string;
  event: string;
  description: string;
}

export interface LocalContext {
  language: string;
  country: string;
  city?: string;
  lat?: number;
  lng?: number;
}

export interface SavedSession {
  id: string;
  timestamp: number;
  title: string;
  content: string;
  section: string;
}

export interface Competition {
  title: string;
  description: string;
  theme: string;
  rules: string[];
  prizePoints: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface SchemerInsight {
  name: string;
  era: string;
  tactic: string;
  lesson: string;
  warningSigns: string[];
}

export enum AppSection {
  HUB = 'hub',
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
  LAW = 'law',
  CONSTITUTION = 'constitution',
  FINANCE = 'finance',
  CITIZEN_RIGHTS = 'citizen_rights',
  CURRENT_AFFAIRS = 'current_affairs',
  LIVE_TUTOR = 'live_tutor',
  IMAGE_STUDY = 'image_study',
  CRIMINOLOGY = 'criminology',
  MY_STORY = 'my_story',
  DAILY_PRACTICE = 'daily_practice',
  COMPETITION = 'competition',
  GLOBAL_SCHEMERS = 'global_schemers',
  MARKET_VISION = 'market_vision',
  RELIGIONS = 'religions',
  CULTURE = 'culture',
  SAVED_SESSIONS = 'saved_sessions',
  SUPPORT = 'support',
  ABOUT_US = 'about_us',
  EXPLORER = 'explorer',
  WEEKLY_TIMELINE = 'weekly_timeline',
  APPLICATION_WRITER = 'application_writer',
  EXPERT_CONNECT = 'expert_connect',
  POLICIES = 'policies',
  RBA_SERVICES = 'rba_services',
  AURA_CHAMBER = 'aura_chamber'
}