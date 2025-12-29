
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
  nature?: number;
}

export interface UserState {
  uid?: string;
  points: number;
  level: string;
  stage: number;
  streak: number;
  unlockedFeatures: string[];
  name?: string;
  email?: string;
  photo?: string;
  detectedCity?: string;
  auraStats?: AuraStats;
}

export enum AppSection {
  LAUNCHER = 'launcher',
  HUB = 'hub',
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
  LAW = 'law',
  CONSTITUTION = 'constitution',
  FINANCE = 'finance',
  CITIZEN_RIGHTS = 'citizen_rights',
  CURRENT_AFFAIRS = 'current_affairs',
  EPAPER = 'epaper',
  PRIVACY = 'privacy_policy',
  TERMS = 'terms_of_service',
  REFUND = 'refund_policy',
  ABOUT_US = 'about_us',
  CONTACT_US = 'contact_us',
  POLICIES = 'policies',
  GOV_SCHEMES = 'gov_schemes',
  ENTREPRENEUR_HUB = 'entrepreneur_hub',
  CULTURE_EXPLORER = 'culture_explorer',
  DAILY_PRACTICE = 'daily_practice',
  EXPLORER = 'explorer',
  WEEKLY_TIMELINE = 'weekly_timeline',
  APPLICATION_WRITER = 'application_writer',
  CLIMATE_SHIELD = 'climate_shield',
  EVOLUTION_HUB = 'evolution_hub',
  SAHAYATA_KENDRA = 'sahayata_kendra',
  NYAY_DARPAN = 'nyay_darpan',
  JIGYASA_HUB = 'jigyasa_hub',
  FINANCE_SHIELD = 'finance_shield',
  EMERGENCY_LEGAL = 'emergency_legal'
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
  domain?: string;
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

export interface SearchEntry {
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

export interface AssistanceRecord {
  caseId: string;
  timestamp: number;
  citizenName: string;
  citizenPhone: string;
  citizenAddress: string;
  problemSummary: string;
  departmentAssigned: string;
  legalStatutes: string;
  paymentStatus: 'completed' | 'pending';
  amount: number;
}

export interface PublicAlert {
  id: string;
  userName: string;
  location: string;
  issue: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}