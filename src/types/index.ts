// ============================================
// 사용자
// ============================================
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 사용자 프로필
// ============================================
export interface UserProfile {
  id: string;
  userId: string;
  mbti?: string;
  birthYear?: number;
  gender?: 'male' | 'female' | 'other';
  loveStyle?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 전 애인 정보
// ============================================
export interface ExPartner {
  id: string;
  userId: string;
  nickname: string;
  mbti?: string;
  personality?: string;
  conflictTypes: string[];
  breakupReason?: string;
  satisfactionScore: number;
  relationshipDuration?: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 현재 관계 (썸 또는 연인)
// ============================================
export interface CurrentRelationship {
  id: string;
  userId: string;
  nickname: string;
  mbti?: string;
  personality?: string;
  stage: 'some' | 'dating' | 'serious';
  startDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 갈등 기록
// ============================================
export interface ConflictRecord {
  id: string;
  userId: string;
  relationshipId: string;
  title: string;
  description: string;
  conflictType: string;
  severity: 1 | 2 | 3 | 4 | 5;
  isResolved: boolean;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 감정 기록
// ============================================
export type Mood = 'happy' | 'sad' | 'angry' | 'anxious' | 'confused' | 'peaceful';

export interface EmotionRecord {
  id: string;
  userId: string;
  relationshipId?: string;
  mood: Mood;
  score: number;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// AI 분석 결과
// ============================================
export type AnalysisModuleType = 'compatibility' | 'mediator' | 'breakup' | 'some' | 'report';

export interface AnalysisResult {
  id: string;
  userId: string;
  moduleType: AnalysisModuleType;
  inputData: Record<string, unknown>;
  result: Record<string, unknown>;
  score?: number;
  createdAt: string;
}

// ============================================
// 구독 정보
// ============================================
export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium';
  stripePaymentLinkId?: string;
  stripeCustomerId?: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  analysisUsedCount: number;
  analysisResetDate: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 콘텐츠 사용 로그
// ============================================
export interface UsageLog {
  id: string;
  userId: string;
  moduleType: AnalysisModuleType;
  createdAt: string;
}

// ============================================
// AI 분석 입력/출력 타입
// ============================================
export interface CompatibilityInput {
  myMbti: string;
  partnerMbti: string;
  myPersonality: string;
  partnerPersonality: string;
  conflictHistory: string[];
  relationshipId?: string;
}

export interface CompatibilityResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  cautions: string[];
  advice: string;
  analysisId: string;
}

export interface MediatorInput {
  situation: string;
  partnerMbti: string;
  relationshipStage: string;
  conflictType: string;
}

export interface MediatorResult {
  dontSay: string[];
  reconciliationSteps: { step: number; action: string }[];
  cooldownTime: string;
  contactTiming: string;
  recoveryProbability: number;
  analysisId: string;
}

export interface BreakupInput {
  recentConflicts: string;
  repeatCount: number;
  satisfactionScore: number;
  futureAlignmentScore: number;
  relationshipDuration: number;
}

export interface BreakupResult {
  continueProbability: number;
  improvementPossibility: string;
  longTermRisks: string[];
  recommendation: string;
  thirdPersonComment: string;
  analysisId: string;
}

export interface SomeInput {
  meetCount: number;
  contactFrequency: string;
  replySpeed: string;
  partnerBehavior: string;
}

export interface SomeResult {
  successProbability: number;
  interestLevel: string;
  pushPullStrategy: string;
  nextAction: string;
  analysisId: string;
}

export interface LoveReportResult {
  loveType: string;
  emotionalDependency: number;
  obsessionIndex: number;
  avoidanceIndex: number;
  longTermCompatibility: number;
  idealTypeRecommendation: string;
  summary: string;
  analysisId: string;
}
