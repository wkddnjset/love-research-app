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
  userCode: string;
  mbti?: string;
  mbtiWeights?: number[];
  birthYear?: number;
  gender?: 'male' | 'female' | 'other';
  loveStyle?: string;
  lastReportAt?: string;
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
  conflictDetail?: string;
  breakupReason?: string;
  relationshipDuration?: number;
  styleAnswers: Record<string, string>;
  goodPoints?: string;
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
export type AnalysisModuleType = 'compatibility' | 'report';

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
// 궁합 분석 결과 (양방향)
// ============================================
export interface CompatibilityResult {
  id: string;
  requesterId: string;
  targetId: string;
  result: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    cautions: string[];
    advice: string;
  };
  score?: number;
  createdAt: string;
}

// ============================================
// 매칭 티켓
// ============================================
export interface MatchingTicket {
  id: string;
  userId: string;
  purchaseType: 'earlybird' | 'regular';
  price: number;
  status: 'unused' | 'used' | 'refunded';
  paddleTransactionId?: string;
  purchasedAt: string;
  usedAt?: string;
  createdAt: string;
}

// ============================================
// 데일리 연애 질문
// ============================================
export interface DailyQuestion {
  id: string;
  question: string;
  keyword: string;
  scheduledDate?: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyAnswer {
  id: string;
  userId: string;
  questionId: string;
  answer: string;
  createdAt: string;
  question?: DailyQuestion;
}

// ============================================
// 프롬프트 템플릿
// ============================================
export interface PromptTemplate {
  id: string;
  moduleType: 'report' | 'compatibility';
  systemPrompt: string;
  userPromptTemplate: string;
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
  requesterCode: string;
  targetCode: string;
}

export interface CompatibilityAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  cautions: string[];
  advice: string;
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
