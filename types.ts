
export type UserRole = 'admin' | 'content' | 'citizen' | 'expert_volunteer';

export interface AuditLogEntry {
  id: string;
  action: 'approve' | 'reject' | 'generate' | 'repair' | 'volunteer_help';
  targetId: string;
  userId: string;
  timestamp: number;
  platform?: string;
  riskLevel: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingLinks?: Array<{ title: string; uri: string }>;
  images?: string[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string; 
  gender: 'Male' | 'Female' | 'Other';
  isAlive: boolean;
  isMinor: boolean;
  notes?: string;
}

export interface UserProfile {
  fullName: string;
  fatherName: string;
  dob: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  pinCode: string;
  profession?: string;
  education?: string;
  annualIncome?: string;
  familyTree: FamilyMember[];
}

export interface MiningState {
  isMining: boolean;
  lastStarted: number;
  balance: number;
  hashRate: number;
  referralCode: string;
  referralsCount: number;
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
  profile?: UserProfile;
  role: UserRole;
  auraStats?: {
    history: number;
    law: number;
    ethics: number;
    finance: number;
    culture: number;
  };
  impactStats?: {
    citizensHelped: number;
    freeSevaHours: number;
    activeAdvisors: number;
  };
  mining?: MiningState;
}

export enum AppSection {
  LAUNCHER = 'launcher',
  HUB = 'hub',
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
  LAW = 'law',
  CONSTITUTION = 'constitution',
  FINANCE = 'finance',
  EPAPER = 'epaper',
  SAHAYATA_KENDRA = 'sahayata_kendra',
  NYAY_DARPAN = 'nyay_darpan',
  LOCAL_LAWS_EXPOSED = 'local_laws_exposed',
  VOICE_ASSISTANT = 'voice_assistant',
  PARIVAR_VRUKSH = 'parivar_vruksh',
  PROFILE_EDITOR = 'profile_editor',
  TREND_SCANNER = 'trend_scanner',
  RISK_ANALYZER = 'risk_analyzer',
  MEDIA_CONTROL = 'media_control',
  PORTAL_DIRECTORY = 'portal_directory',
  COUNTRY_COMPARISON = 'country_comparison',
  CONTACT_US = 'contact_us',
  POLICIES = 'policies',
  OMI_INTEGRATION = 'omi_integration',
  DOCS = 'docs',
  SUPPORT_MISSION = 'support_mission',
  EXPERT_CONNECT = 'expert_connect',
  JIGYASA_HUB = 'jigyasa_hub',
  APPLICATION_WRITER = 'application_writer',
  GOVT_PITCH = 'govt_pitch'
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

export interface Testimonial {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: number;
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

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TrendItem {
  topic: string;
  relevance: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface SavedSession {
  id: string;
  title: string;
  content: string;
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
  id: string;
  userId: string;
  userName: string;
  problem: string;
  department: string;
  status: string;
  timestamp: number;
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

export interface PublicAlert {
  id: string;
  userName: string;
  location: string;
  issue: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}

export interface Web3Wallet {
  address: string;
  network: string;
  connected: boolean;
}
