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

export interface MiningState {
  isMining: boolean;
  lastStarted: number;
  balance: number;
  hashRate: number; // RBC per hour
  referralCode: string;
  referralsCount: number;
}

export interface Web3Wallet {
  address?: string;
  network: 'polygon' | 'base';
  isConnected: boolean;
  balances: {
    native: number; // MATIC or ETH
    rbc: number;
  };
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
  mining?: MiningState;
  web3?: Web3Wallet;
}

export enum AppSection {
  LAUNCHER = 'launcher',
  HUB = 'hub',
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
  LAW = 'law',
  CONSTITUTION = 'constitution',
  FINANCE = 'finance',
  FINANCE_ADVISORY = 'finance_advisory',
  BUSINESS_ADVISORY = 'business_advisory',
  LEGAL_COMPLIANCE = 'legal_compliance',
  DIGITAL_TOOLS = 'digital_tools',
  EPAPER = 'epaper',
  NEWS_FEED = 'news_feed',
  SAHAYATA_KENDRA = 'sahayata_kendra',
  NYAY_DARPAN = 'nyay_darpan',
  JIGYASA_HUB = 'jigyasa_hub',
  PRIVACY = 'privacy_policy',
  TERMS = 'terms_of_service',
  REFUND = 'refund_policy',
  ABOUT_US = 'about_us',
  CONTACT_US = 'contact_us',
  CSR_MISSION = 'csr_mission',
  POLICIES = 'policies',
  LOCAL_LAWS_EXPOSED = 'local_laws_exposed',
  GLOBAL_COMPARISON = 'global_comparison'
}

export interface LocalContext {
  language: string;
  country: string;
  city?: string;
  domain?: string;
  lat?: number;
  lng?: number;
}

export interface TimelineEvent {
  year: string;
  event: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AssistanceRecord {
  caseId: string;
  timestamp: number;
  citizenName: string;
  citizenPhone: string;
  citizenAddress?: string;
  problemSummary: string;
  departmentAssigned: string;
  legalStatutes: string;
  paymentStatus: 'completed' | 'pending';
  amount: number;
}

export interface PublishedNews {
  id: string;
  publisherName: string;
  publisherUid: string;
  timestamp: number;
  likes: number;
  shares: number;
  data: any;
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

export interface SavedSession {
  id: string;
  section: string;
  title: string;
  timestamp: number;
  content: string;
}

export interface ContestHistory {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  pointsEarned: number;
  timestamp: number;
}

export interface PublicAlert {
  id: string;
  userName: string;
  location: string;
  issue: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}