# 사랑연구소 (Love Research) Design Document

> **Summary**: AI 기반 연애 데이터 분석 및 맞춤형 연애 컨설팅 모바일 웹 서비스
>
> **Project**: 사랑연구소 (Love Research)
> **Version**: 0.1.0
> **Author**: User
> **Date**: 2026-02-16
> **Status**: Draft
> **Planning Doc**: [love-research.plan.md](../../01-plan/features/love-research.plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | Schema Definition | N/A (본 문서에 포함) |
| Phase 2 | Coding Conventions | N/A (본 문서에 포함) |
| Phase 3 | Mockup | N/A (구현 시 반영) |
| Phase 4 | API Spec | N/A (본 문서에 포함) |

---

## 1. Overview

### 1.1 Design Goals

- **모바일 퍼스트**: 모든 UI를 375px 기준 모바일 웹으로 설계
- **모듈형 확장**: AI 분석 모듈을 독립적으로 추가/수정 가능한 구조
- **데이터 축적형**: 사용할수록 정밀해지는 개인 맞춤 분석 기반
- **빠른 MVP**: BaaS(bkend.ai) 활용으로 백엔드 구축 시간 최소화
- **PWA 지원**: 앱 스토어 없이 홈 화면 설치 가능

### 1.2 Design Principles

- **Feature-based 모듈 구조**: 각 기능을 독립 모듈로 분리
- **Server-side 보안**: AI API 키, 결제 키 등은 반드시 서버 사이드에서 처리
- **점진적 데이터 수집**: 사용자에게 한번에 많은 입력을 요구하지 않음
- **관심사 분리**: UI / 비즈니스 로직 / 데이터 접근 레이어 분리

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                       │
│  ┌───────────────────────────────────────────────────┐   │
│  │           Next.js App (PWA)                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │   │
│  │  │  Auth    │ │ Love Data│ │  AI Analysis     │  │   │
│  │  │  Module  │ │  Module  │ │  Modules (5)     │  │   │
│  │  └────┬─────┘ └────┬─────┘ └────────┬─────────┘  │   │
│  │       │             │                │             │   │
│  │  ┌────▼─────────────▼────────────────▼─────────┐  │   │
│  │  │        TanStack Query + Zustand             │  │   │
│  │  └────────────────────┬────────────────────────┘  │   │
│  └───────────────────────┼───────────────────────────┘   │
│                          │                                │
└──────────────────────────┼────────────────────────────────┘
                           │
              ┌────────────┼────────────────┐
              │            │                │
     ┌────────▼───┐  ┌────▼──────┐  ┌──────▼────────┐
     │ bkend.ai   │  │ Next.js   │  │ Stripe        │
     │ (BaaS)     │  │ API Routes│  │ Payment Links │
     │            │  │           │  │               │
     │ - Auth     │  │ - AI Proxy│  │ - 구독 결제   │
     │ - Database │  │ - Webhook │  │ - Webhook     │
     │ - Storage  │  │           │  │               │
     └────────────┘  └─────┬────┘  └───────────────┘
                           │
                    ┌──────▼──────┐
                    │ Claude API  │
                    │ (Anthropic) │
                    │ - AI 분석   │
                    └─────────────┘
```

### 2.2 Data Flow

```
[사용자] ──입력──▶ [React Form] ──유효성검사──▶ [API Route / bkend.ai]
                                                        │
                       ┌────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   데이터 저장    │ (bkend.ai DB)
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  AI 분석 요청    │ (Claude API)
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  분석 결과 저장   │ (bkend.ai DB)
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  결과 표시       │ (Client UI)
              └─────────────────┘
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| Auth Module | bkend.ai Auth + Kakao OAuth | 로그인/회원가입 |
| Love Data Module | bkend.ai Database | 연애 데이터 CRUD |
| AI Analysis Modules | Claude API (via API Routes) | AI 분석 처리 |
| Payment Module | Stripe Payment Links + Webhook | 구독 결제 |
| Admin Dashboard | bkend.ai Database | 관리자 데이터 조회 |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
// ============================================
// 사용자 (bkend.ai auth에서 관리)
// ============================================
interface User {
  id: string;                // bkend.ai user ID
  email: string;             // 카카오 이메일
  nickname: string;          // 카카오 닉네임
  profileImage?: string;     // 카카오 프로필 이미지
  role: 'user' | 'admin';   // 역할
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 사용자 프로필 (추가 연애 관련 정보)
// ============================================
interface UserProfile {
  id: string;
  userId: string;            // FK: User
  mbti?: string;             // 나의 MBTI (예: "ENFP")
  birthYear?: number;        // 출생연도
  gender?: 'male' | 'female' | 'other';
  loveStyle?: string;        // 연애 스타일 (자유텍스트)
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 전 애인 정보
// ============================================
interface ExPartner {
  id: string;
  userId: string;            // FK: User
  nickname: string;          // 식별용 별명 (예: "첫사랑")
  mbti?: string;             // 상대 MBTI
  personality?: string;      // 성향 키워드 (예: "내향적, 감성적")
  conflictTypes: string[];   // 갈등 유형 (예: ["연락빈도", "질투"])
  breakupReason?: string;    // 이별 사유
  satisfactionScore: number; // 만족도 (1~10)
  relationshipDuration?: number; // 교제 기간 (개월)
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 현재 관계 (썸 또는 연인)
// ============================================
interface CurrentRelationship {
  id: string;
  userId: string;            // FK: User
  nickname: string;          // 식별용 별명
  mbti?: string;
  personality?: string;
  stage: 'some' | 'dating' | 'serious'; // 관계 단계
  startDate?: Date;          // 시작일
  isActive: boolean;         // 현재 진행 중 여부
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 갈등 기록
// ============================================
interface ConflictRecord {
  id: string;
  userId: string;            // FK: User
  relationshipId: string;    // FK: CurrentRelationship
  title: string;             // 갈등 제목
  description: string;       // 상세 내용
  conflictType: string;      // 갈등 유형
  severity: 1 | 2 | 3 | 4 | 5; // 심각도
  isResolved: boolean;       // 해결 여부
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 감정 기록 (일기형)
// ============================================
interface EmotionRecord {
  id: string;
  userId: string;            // FK: User
  relationshipId?: string;   // FK: CurrentRelationship (선택)
  mood: 'happy' | 'sad' | 'angry' | 'anxious' | 'confused' | 'peaceful';
  score: number;             // 감정 점수 (1~10, 10=매우 좋음)
  content: string;           // 일기 내용
  tags: string[];            // 태그 (예: ["불안", "설렘"])
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// AI 분석 결과
// ============================================
interface AnalysisResult {
  id: string;
  userId: string;            // FK: User
  moduleType: 'compatibility' | 'mediator' | 'breakup' | 'some' | 'report';
  inputData: Record<string, unknown>; // 입력 데이터 스냅샷
  result: Record<string, unknown>;    // AI 분석 결과
  score?: number;            // 주요 점수 (%)
  createdAt: Date;
}

// ============================================
// 구독 정보
// ============================================
interface Subscription {
  id: string;
  userId: string;            // FK: User
  plan: 'free' | 'premium';
  stripePaymentLinkId?: string;
  stripeCustomerId?: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  analysisUsedCount: number; // 이번 달 분석 사용 횟수
  analysisResetDate: Date;   // 다음 리셋일
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 콘텐츠 사용 로그 (관리자용)
// ============================================
interface UsageLog {
  id: string;
  userId: string;            // FK: User
  moduleType: 'compatibility' | 'mediator' | 'breakup' | 'some' | 'report';
  createdAt: Date;
}
```

### 3.2 Entity Relationships

```
[User] 1 ──── 1 [UserProfile]
  │
  ├── 1 ──── N [ExPartner]
  │
  ├── 1 ──── N [CurrentRelationship]
  │                    │
  │                    ├── 1 ──── N [ConflictRecord]
  │                    │
  │                    └── 1 ──── N [EmotionRecord]
  │
  ├── 1 ──── N [AnalysisResult]
  │
  ├── 1 ──── 1 [Subscription]
  │
  └── 1 ──── N [UsageLog]
```

### 3.3 bkend.ai Table Design

| Table Name | Key Fields | RLS Policy |
|------------|-----------|------------|
| `user_profiles` | userId, mbti, gender, birthYear | user: self only |
| `ex_partners` | userId, nickname, mbti, satisfactionScore | user: self only |
| `current_relationships` | userId, nickname, stage, isActive | user: self only |
| `conflict_records` | userId, relationshipId, severity, isResolved | user: self only |
| `emotion_records` | userId, mood, score, content | user: self only |
| `analysis_results` | userId, moduleType, result, score | user: self only |
| `subscriptions` | userId, plan, status, analysisUsedCount | user: self only, admin: all |
| `usage_logs` | userId, moduleType | admin: all |

> **RLS (Row Level Security)**: 모든 유저 데이터는 본인만 접근 가능. 관리자는 subscriptions, usage_logs 전체 접근 가능.

---

## 4. API Specification

### 4.1 bkend.ai 자동 생성 API (CRUD)

bkend.ai에서 테이블 생성 시 자동으로 REST API가 생성됨. 별도 구현 불필요.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/tables/{table}/rows` | 목록 조회 (필터/정렬/페이지네이션) |
| GET | `/api/v1/tables/{table}/rows/:id` | 상세 조회 |
| POST | `/api/v1/tables/{table}/rows` | 생성 |
| PUT | `/api/v1/tables/{table}/rows/:id` | 수정 |
| DELETE | `/api/v1/tables/{table}/rows/:id` | 삭제 |

### 4.2 Custom API Routes (Next.js)

AI 분석과 결제는 서버 사이드에서 처리해야 하므로 Next.js API Routes 사용.

#### AI 분석 API

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/analysis/compatibility` | 궁합 분석 | Required |
| POST | `/api/analysis/mediator` | 싸움 중재 | Required |
| POST | `/api/analysis/breakup` | 이별 분석 | Required |
| POST | `/api/analysis/some` | 썸 성공 확률 | Required |
| POST | `/api/analysis/report` | 연애 성향 리포트 | Required |

#### `POST /api/analysis/compatibility` (궁합 분석기)

**Request:**
```json
{
  "myMbti": "ENFP",
  "partnerMbti": "INTJ",
  "myPersonality": "외향적, 감성적",
  "partnerPersonality": "내향적, 논리적",
  "conflictHistory": ["연락빈도", "생활패턴"],
  "relationshipId": "optional-id"
}
```

**Response (200):**
```json
{
  "score": 78,
  "strengths": ["서로 보완적 성격", "지적 대화 가능"],
  "weaknesses": ["소통 방식 차이", "에너지 충전 방식 상이"],
  "cautions": ["상대의 혼자만의 시간을 존중할 것"],
  "advice": "INTJ는 논리적 설명에 반응합니다...",
  "analysisId": "result-uuid"
}
```

#### `POST /api/analysis/mediator` (싸움 중재기)

**Request:**
```json
{
  "situation": "약속 시간에 30분 늦었는데 사과를 안 해서 싸움",
  "partnerMbti": "ISTJ",
  "relationshipStage": "dating",
  "conflictType": "시간 약속"
}
```

**Response (200):**
```json
{
  "dontSay": ["넌 항상 그래", "나도 바빴어"],
  "reconciliationSteps": [
    { "step": 1, "action": "2시간 정도 서로 진정할 시간 갖기" },
    { "step": 2, "action": "먼저 자신의 감정을 솔직하게 전달" },
    { "step": 3, "action": "구체적인 개선 방안 함께 논의" }
  ],
  "cooldownTime": "2시간",
  "contactTiming": "오늘 저녁 8시 이후",
  "recoveryProbability": 85,
  "analysisId": "result-uuid"
}
```

#### `POST /api/analysis/breakup` (헤어져야 할까 분석기)

**Request:**
```json
{
  "recentConflicts": "같은 문제로 3번째 싸움. 상대가 변할 의지가 없어 보임",
  "repeatCount": 3,
  "satisfactionScore": 4,
  "futureAlignmentScore": 3,
  "relationshipDuration": 18
}
```

**Response (200):**
```json
{
  "continueProbability": 35,
  "improvementPossibility": "낮음",
  "longTermRisks": ["반복되는 갈등 패턴", "소통 단절 심화"],
  "recommendation": "breakup_consider",
  "thirdPersonComment": "객관적으로 볼 때, 3회 이상 반복되는 갈등은...",
  "analysisId": "result-uuid"
}
```

#### `POST /api/analysis/some` (썸 성공 확률 계산기)

**Request:**
```json
{
  "meetCount": 5,
  "contactFrequency": "매일",
  "replySpeed": "30분 이내",
  "partnerBehavior": "먼저 연락 자주 함, 이모티콘 많이 사용"
}
```

**Response (200):**
```json
{
  "successProbability": 72,
  "interestLevel": "높음",
  "pushPullStrategy": "현재 밀당 비율 적절. 약간의 밀기 추천",
  "nextAction": "다음 만남에서 가벼운 스킨십 시도",
  "analysisId": "result-uuid"
}
```

#### `POST /api/analysis/report` (나의 연애 성향 리포트)

**Request:**
```json
{
  "userId": "user-uuid"
}
```

> 서버에서 해당 유저의 전체 데이터(전 애인, 갈등, 감정 기록 등)를 조회하여 분석

**Response (200):**
```json
{
  "loveType": "헌신적 낭만가",
  "emotionalDependency": 65,
  "obsessionIndex": 30,
  "avoidanceIndex": 20,
  "longTermCompatibility": 75,
  "idealTypeRecommendation": "안정적이면서 감성적 소통이 가능한 INFJ/ENFJ 유형",
  "summary": "당신은 관계에서 헌신적이며...",
  "analysisId": "result-uuid"
}
```

#### Stripe Webhook

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/webhooks/stripe` | Stripe 이벤트 수신 | Stripe Signature |

**처리할 이벤트:**
- `checkout.session.completed` → 구독 활성화
- `customer.subscription.updated` → 구독 상태 업데이트
- `customer.subscription.deleted` → 구독 취소
- `invoice.payment_failed` → 결제 실패 처리

---

## 5. UI/UX Design

### 5.1 Screen Layout (모바일 기준: 375px)

```
┌─────────────────────────┐
│  Header (로고/메뉴)      │  ← 56px 고정
├─────────────────────────┤
│                         │
│                         │
│    Main Content         │  ← 스크롤 영역
│    (페이지별 콘텐츠)     │
│                         │
│                         │
├─────────────────────────┤
│  Bottom Nav (4탭)       │  ← 64px 고정
│  홈 | 분석 | 기록 | MY   │
└─────────────────────────┘
```

### 5.2 Page Structure

```
/ (랜딩/로그인)
├── /auth
│   └── /kakao/callback        # 카카오 OAuth 콜백
│
├── /home                       # 홈 (대시보드)
│   ├── 최근 분석 결과 요약
│   ├── 오늘의 감정 기록 CTA
│   └── 추천 분석 모듈
│
├── /analysis                   # 분석 모듈 목록
│   ├── /compatibility          # 궁합 분석기
│   ├── /mediator              # 싸움 중재기
│   ├── /breakup               # 헤어져야 할까
│   ├── /some                  # 썸 성공 확률
│   └── /report                # 연애 성향 리포트
│
├── /data                       # 연애 기록
│   ├── /ex-partners           # 전 애인 목록/입력
│   ├── /relationships         # 현재 관계
│   ├── /conflicts             # 갈등 기록
│   └── /emotions              # 감정 일기
│
├── /mypage                     # 마이페이지
│   ├── /profile               # 프로필 편집
│   ├── /subscription          # 구독 관리
│   └── /history               # 분석 히스토리
│
└── /admin                      # 관리자 (별도 레이아웃)
    ├── /dashboard             # 대시보드
    ├── /users                 # 유저 관리
    └── /payments              # 결제 관리
```

### 5.3 User Flow

```
[랜딩 페이지] ──카카오 로그인──▶ [온보딩(프로필 입력)]
                                        │
                                   ┌────▼────┐
                                   │   홈    │ ◀───────────────────────┐
                                   └────┬────┘                        │
                          ┌─────────────┼─────────────┐               │
                     ┌────▼────┐  ┌─────▼────┐  ┌─────▼────┐         │
                     │  분석   │  │   기록    │  │   MY    │         │
                     └────┬────┘  └────┬─────┘  └────┬─────┘         │
                          │            │              │               │
                     모듈 선택    데이터 입력    프로필/구독          │
                          │            │                              │
                     입력 폼 ───▶ AI 분석 ───▶ 결과 표시 ───────────┘
                                       │
                                  (무료 3회 소진 시)
                                       │
                                  ┌────▼──────┐
                                  │  구독 안내  │
                                  │  (Payment  │
                                  │   Link)    │
                                  └───────────┘
```

### 5.4 Component List

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `BottomNav` | `src/components/layout/` | 하단 네비게이션 (4탭) |
| `MobileHeader` | `src/components/layout/` | 상단 헤더 (뒤로가기, 타이틀) |
| `AnalysisCard` | `src/components/ui/` | 분석 모듈 선택 카드 |
| `ResultCard` | `src/components/ui/` | 분석 결과 표시 카드 |
| `ScoreGauge` | `src/components/ui/` | 점수/확률 시각화 (원형) |
| `MoodSelector` | `src/components/forms/` | 감정 선택 UI |
| `MBTISelector` | `src/components/forms/` | MBTI 선택 드롭다운 |
| `DataInputForm` | `src/components/forms/` | 공통 데이터 입력 폼 |
| `PartnerCard` | `src/features/love-data/` | 애인/썸 정보 카드 |
| `ConflictTimeline` | `src/features/love-data/` | 갈등 기록 타임라인 |
| `EmotionCalendar` | `src/features/love-data/` | 감정 캘린더 뷰 |
| `SubscriptionBanner` | `src/features/payment/` | 구독 유도 배너 |
| `AdminStats` | `src/features/admin/` | 관리자 통계 위젯 |
| `PaymentTable` | `src/features/admin/` | 결제 현황 테이블 |

---

## 6. Error Handling

### 6.1 Error Code Definition

| Code | Message | Cause | Handling |
|------|---------|-------|----------|
| 400 | 입력값을 확인해주세요 | 유효성 검증 실패 | Toast 알림 + 폼 필드 하이라이트 |
| 401 | 로그인이 필요합니다 | 인증 만료/미인증 | 로그인 페이지 리다이렉트 |
| 403 | 구독이 필요한 기능입니다 | 무료 분석 횟수 소진 | 구독 안내 모달 |
| 404 | 데이터를 찾을 수 없습니다 | 리소스 없음 | 빈 상태 UI 표시 |
| 429 | 잠시 후 다시 시도해주세요 | AI API Rate Limit | 재시도 안내 Toast |
| 500 | 서버 오류가 발생했습니다 | 서버 내부 오류 | 에러 페이지 + 재시도 버튼 |

### 6.2 Error Response Format

```json
{
  "error": {
    "code": "ANALYSIS_LIMIT_EXCEEDED",
    "message": "이번 달 무료 분석 횟수(3회)를 모두 사용했습니다.",
    "details": {
      "usedCount": 3,
      "maxCount": 3,
      "resetDate": "2026-03-01"
    }
  }
}
```

### 6.3 Client-side Error Handling

```
Global Error Boundary
  └── Page Level Error Boundary
        └── Component Level try/catch
              └── TanStack Query onError
                    └── Toast Notification (sonner)
```

---

## 7. Security Considerations

- [x] **입력 검증**: react-hook-form + zod 스키마 기반 클라이언트/서버 양측 검증
- [x] **인증/인가**: bkend.ai JWT 토큰 + RLS 정책으로 데이터 접근 제어
- [x] **민감 데이터**: 연애 데이터는 RLS로 본인만 접근, API 키는 서버사이드 전용
- [x] **HTTPS**: Next.js 배포 시 자동 적용 (Vercel)
- [x] **Rate Limiting**: AI API Route에 rate limiter 적용 (분당 10회)
- [x] **XSS 방지**: React 기본 이스케이핑 + DOMPurify 추가 (사용자 입력 렌더링 시)
- [x] **CSRF**: Next.js API Routes 기본 CSRF 보호
- [x] **Stripe Webhook**: Signature 검증 필수

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool |
|------|--------|------|
| Unit Test | AI 프롬프트 유틸리티, 데이터 변환 | Vitest |
| Integration Test | API Routes (AI 분석, Webhook) | Vitest + MSW |
| E2E Test | 로그인 → 데이터 입력 → 분석 플로우 | Playwright |
| Manual QA | 모바일 UI, PWA 설치, 결제 플로우 | 실기기 테스트 |

### 8.2 Test Cases (Key)

- [ ] Happy path: 카카오 로그인 → 프로필 생성 → 전 애인 등록 → 궁합 분석 → 결과 확인
- [ ] Happy path: 무료 3회 분석 후 → 구독 안내 → Payment Link → 구독 활성화
- [ ] Error: 잘못된 MBTI 입력 시 유효성 검증 에러 표시
- [ ] Error: AI API 장애 시 사용자 안내 메시지 표시
- [ ] Edge case: 전 애인 데이터 없이 연애 성향 리포트 요청 시 최소 데이터 안내
- [ ] Admin: 관리자 로그인 → 유저 목록 → 결제 현황 확인

---

## 9. Clean Architecture

### 9.1 Layer Structure

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Presentation** | 페이지, UI 컴포넌트, 훅 | `src/app/`, `src/components/`, `src/features/*/components/` |
| **Application** | 비즈니스 로직, 서비스 훅 | `src/features/*/hooks/`, `src/features/*/services/` |
| **Domain** | 엔티티 타입, 검증 스키마 | `src/types/`, `src/features/*/types/` |
| **Infrastructure** | API 클라이언트, 외부 서비스 | `src/services/`, `src/lib/` |

### 9.2 Dependency Rules

```
┌─────────────────────────────────────────────────────────────┐
│                    Dependency Direction                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Presentation ──▶ Application ──▶ Domain ◀── Infrastructure│
│                          │                                   │
│                          └──▶ Infrastructure                 │
│                                                              │
│   Rule: Inner layers MUST NOT depend on outer layers         │
│         Domain is independent (no external dependencies)     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| 분석 결과 카드 | Presentation | `src/features/analysis/components/` |
| 데이터 입력 폼 | Presentation | `src/features/love-data/components/` |
| useAnalysis 훅 | Application | `src/features/analysis/hooks/` |
| useLoveData 훅 | Application | `src/features/love-data/hooks/` |
| AI 분석 서비스 | Application | `src/features/analysis/services/` |
| Entity 타입 정의 | Domain | `src/types/` |
| Zod 스키마 | Domain | `src/types/schemas/` |
| bkend 클라이언트 | Infrastructure | `src/services/bkend/` |
| Claude API 클라이언트 | Infrastructure | `src/services/ai/` |
| Stripe 연동 | Infrastructure | `src/services/stripe/` |

---

## 10. Coding Convention Reference

### 10.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| Components | PascalCase | `AnalysisCard`, `MoodSelector` |
| Functions/Hooks | camelCase | `useAnalysis()`, `handleSubmit()` |
| Constants | UPPER_SNAKE_CASE | `MAX_FREE_ANALYSIS`, `MBTI_OPTIONS` |
| Types/Interfaces | PascalCase | `ExPartner`, `AnalysisResult` |
| Files (component) | PascalCase.tsx | `AnalysisCard.tsx` |
| Files (utility) | camelCase.ts | `formatScore.ts` |
| Folders | kebab-case | `love-data/`, `ex-partners/` |
| API Routes | kebab-case | `/api/analysis/compatibility` |

### 10.2 Import Order

```typescript
// 1. React/Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. External libraries
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

// 3. Internal absolute imports
import { Button } from '@/components/ui/button'
import { useAnalysis } from '@/features/analysis/hooks'

// 4. Relative imports
import { ResultSection } from './ResultSection'

// 5. Type imports
import type { AnalysisResult } from '@/types'
```

### 10.3 Environment Variables

| Variable | Purpose | Scope |
|----------|---------|-------|
| `NEXT_PUBLIC_BKEND_URL` | bkend.ai API 엔드포인트 | Client |
| `BKEND_API_KEY` | bkend.ai 서버 API 키 | Server |
| `NEXT_PUBLIC_KAKAO_CLIENT_ID` | 카카오 OAuth ID | Client |
| `KAKAO_CLIENT_SECRET` | 카카오 OAuth 시크릿 | Server |
| `ANTHROPIC_API_KEY` | Claude AI API 키 | Server |
| `STRIPE_SECRET_KEY` | Stripe 시크릿 키 | Server |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 시크릿 | Server |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Payment Link URL | Client |
| `NEXT_PUBLIC_APP_URL` | 앱 기본 URL | Client |

### 10.4 This Feature's Conventions

| Item | Convention Applied |
|------|-------------------|
| Component naming | PascalCase, feature 디렉토리 기반 |
| File organization | Dynamic 레벨 feature-based 구조 |
| State management | Zustand (모듈별 스토어), TanStack Query (서버 상태) |
| Error handling | Error Boundary + Toast (sonner) + TanStack Query onError |
| Validation | Zod 스키마 (클라이언트/서버 공유) |
| Language | 코드: English, UI 텍스트: Korean |

---

## 11. Implementation Guide

### 11.1 File Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (PWA meta, fonts)
│   ├── page.tsx                      # Landing page
│   ├── manifest.ts                   # PWA manifest
│   ├── (auth)/
│   │   ├── login/page.tsx            # 카카오 로그인 페이지
│   │   └── kakao/callback/page.tsx   # OAuth 콜백
│   ├── (main)/
│   │   ├── layout.tsx                # Bottom nav 포함 레이아웃
│   │   ├── home/page.tsx             # 홈 대시보드
│   │   ├── analysis/
│   │   │   ├── page.tsx              # 분석 모듈 목록
│   │   │   ├── compatibility/page.tsx
│   │   │   ├── mediator/page.tsx
│   │   │   ├── breakup/page.tsx
│   │   │   ├── some/page.tsx
│   │   │   └── report/page.tsx
│   │   ├── data/
│   │   │   ├── page.tsx              # 연애 기록 메인
│   │   │   ├── ex-partners/page.tsx
│   │   │   ├── relationships/page.tsx
│   │   │   ├── conflicts/page.tsx
│   │   │   └── emotions/page.tsx
│   │   └── mypage/
│   │       ├── page.tsx
│   │       ├── profile/page.tsx
│   │       ├── subscription/page.tsx
│   │       └── history/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                # Admin 전용 레이아웃
│   │   ├── page.tsx                  # Admin 대시보드
│   │   ├── users/page.tsx
│   │   └── payments/page.tsx
│   └── api/
│       ├── analysis/
│       │   ├── compatibility/route.ts
│       │   ├── mediator/route.ts
│       │   ├── breakup/route.ts
│       │   ├── some/route.ts
│       │   └── report/route.ts
│       └── webhooks/
│           └── stripe/route.ts
├── components/
│   ├── ui/                           # shadcn/ui 컴포넌트
│   ├── layout/
│   │   ├── BottomNav.tsx
│   │   ├── MobileHeader.tsx
│   │   └── AdminSidebar.tsx
│   └── forms/
│       ├── MBTISelector.tsx
│       ├── MoodSelector.tsx
│       └── DataInputForm.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/useAuth.ts
│   │   └── services/kakaoAuth.ts
│   ├── love-data/
│   │   ├── components/
│   │   │   ├── PartnerCard.tsx
│   │   │   ├── ConflictTimeline.tsx
│   │   │   └── EmotionCalendar.tsx
│   │   ├── hooks/
│   │   │   ├── useExPartners.ts
│   │   │   ├── useRelationships.ts
│   │   │   ├── useConflicts.ts
│   │   │   └── useEmotions.ts
│   │   └── types/
│   ├── analysis/
│   │   ├── components/
│   │   │   ├── AnalysisCard.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   └── ScoreGauge.tsx
│   │   ├── hooks/useAnalysis.ts
│   │   ├── services/aiClient.ts
│   │   └── prompts/                  # AI 프롬프트 템플릿
│   │       ├── compatibility.ts
│   │       ├── mediator.ts
│   │       ├── breakup.ts
│   │       ├── some.ts
│   │       └── report.ts
│   ├── payment/
│   │   ├── components/
│   │   │   └── SubscriptionBanner.tsx
│   │   ├── hooks/useSubscription.ts
│   │   └── services/stripeClient.ts
│   └── admin/
│       ├── components/
│       │   ├── AdminStats.tsx
│       │   └── PaymentTable.tsx
│       └── hooks/
│           ├── useAdminUsers.ts
│           └── useAdminPayments.ts
├── services/
│   ├── bkend/
│   │   ├── client.ts                 # bkend.ai 클라이언트 초기화
│   │   ├── auth.ts                   # 인증 관련
│   │   └── database.ts               # DB CRUD 헬퍼
│   ├── ai/
│   │   └── claude.ts                 # Claude API 클라이언트
│   └── stripe/
│       └── webhook.ts                # Stripe webhook 처리
├── stores/
│   ├── authStore.ts                  # 인증 상태
│   └── analysisStore.ts              # 분석 진행 상태
├── types/
│   ├── index.ts                      # 모든 엔티티 타입
│   └── schemas/
│       ├── auth.ts                   # 인증 관련 Zod 스키마
│       ├── love-data.ts              # 연애 데이터 Zod 스키마
│       └── analysis.ts               # 분석 입력 Zod 스키마
├── lib/
│   ├── utils.ts                      # 공통 유틸리티
│   └── constants.ts                  # 상수 (MBTI 목록 등)
└── styles/
    └── globals.css                   # Tailwind 글로벌 스타일
```

### 11.2 Implementation Order

**Phase 1: 프로젝트 초기화**
1. [ ] Next.js + TypeScript + Tailwind CSS 프로젝트 생성
2. [ ] shadcn/ui 설치 및 설정
3. [ ] PWA 설정 (manifest, service worker)
4. [ ] 기본 레이아웃 (MobileHeader, BottomNav)
5. [ ] 환경변수 설정 (.env.local)

**Phase 2: 인증**
6. [ ] bkend.ai 프로젝트 설정 및 테이블 생성
7. [ ] 카카오 OAuth 로그인 구현
8. [ ] 인증 미들웨어 (보호된 라우트)
9. [ ] 온보딩 (프로필 입력) 페이지

**Phase 3: 연애 데이터**
10. [ ] 타입 정의 + Zod 스키마
11. [ ] 전 애인 CRUD (폼 + 목록)
12. [ ] 현재 관계 CRUD
13. [ ] 갈등 기록 CRUD
14. [ ] 감정 기록 (일기) CRUD

**Phase 4: AI 분석 모듈**
15. [ ] Claude API 클라이언트 설정
16. [ ] 프롬프트 템플릿 작성 (5개 모듈)
17. [ ] API Routes 구현 (5개 분석 엔드포인트)
18. [ ] 분석 결과 UI (ScoreGauge, ResultCard)
19. [ ] 분석 히스토리 저장 및 조회

**Phase 5: 결제**
20. [ ] Stripe Payment Link 생성 (월간/연간)
21. [ ] Webhook 엔드포인트 구현
22. [ ] 구독 상태 관리 + 무료 분석 횟수 제한
23. [ ] 구독 안내 UI (SubscriptionBanner)

**Phase 6: 관리자**
24. [ ] Admin 레이아웃 (사이드바)
25. [ ] 유저 현황 대시보드
26. [ ] 결제 모니터링
27. [ ] 유저별 콘텐츠 사용량 조회

**Phase 7: 마무리**
28. [ ] PWA 최적화 (아이콘, 스플래시)
29. [ ] Lighthouse 점검 및 성능 최적화
30. [ ] 보안 점검 (Rate Limiting, 입력 검증)
31. [ ] 배포 (Vercel)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-16 | Initial draft | User |
