# 사랑연구소 (Love Research) Planning Document

> **Summary**: AI 기반 연애 데이터 분석 및 맞춤형 연애 컨설팅 모바일 웹 서비스
>
> **Project**: 사랑연구소 (Love Research)
> **Version**: 0.1.0
> **Author**: User
> **Date**: 2026-02-16
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

사용자의 연애 데이터(과거 연애 기록, 감정 패턴, 갈등 이력)를 축적/분석하여 시간이 지날수록 더 정밀해지는 **개인 맞춤형 AI 연애 컨설팅**을 제공한다.

### 1.2 Background

- 기존 연애 상담 서비스는 일회성 챗봇 수준에 머물러 개인화가 부족
- 데이터 기반 의사결정 보조를 통해 감정이 아닌 객관적 분석 제공
- B2C 구독형 모델로 지속적인 연애 성장 플랫폼 구축
- 모바일 웹(PWA) 기반으로 앱 스토어 없이 빠른 배포 가능

### 1.3 Related Documents

- Design: `docs/02-design/features/love-research.design.md` (예정)

---

## 2. Scope

### 2.1 In Scope

- [ ] 카카오톡 소셜 로그인
- [ ] 연애 데이터 입력/저장 시스템 (전 애인 정보, 현재 관계 정보)
- [ ] AI 연애 분석 모듈 5종
  - 궁합 분석기
  - 싸움 중재기
  - 헤어져야 할까 분석기
  - 썸 성공 확률 계산기
  - 나의 연애 성향 리포트 (나의 성향과 이상형 분석)
- [ ] 구독형 결제 시스템 (Stripe Payment Links)
- [ ] 관리자 대시보드 (유저 관리, 콘텐츠 사용량, 결제 확인)
- [ ] 모바일 웹 UI + PWA 설정

### 2.2 Out of Scope

- 네이티브 앱 (iOS/Android) 개발
- 실시간 채팅 상담 기능
- 매칭/소개팅 기능
- 카카오톡 외 소셜 로그인 (Google, Apple 등)
- AI 모델 자체 훈련 (기존 LLM API 활용)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| **인증** | | | |
| FR-01 | 카카오톡 OAuth 로그인/회원가입 | High | Pending |
| FR-02 | JWT 기반 세션 관리 | High | Pending |
| FR-03 | 로그아웃 및 회원탈퇴 | Medium | Pending |
| **연애 데이터** | | | |
| FR-10 | 전 애인 정보 CRUD (MBTI, 성향, 갈등유형, 이별사유, 만족도) | High | Pending |
| FR-11 | 현재 썸/연인 정보 CRUD | High | Pending |
| FR-12 | 갈등 기록 입력/조회 | High | Pending |
| FR-13 | 감정 기록 입력/조회 (일기형) | Medium | Pending |
| FR-14 | 반복 문제 패턴 자동 태깅 | Low | Pending |
| **AI 분석 모듈** | | | |
| FR-20 | 궁합 분석기 - MBTI/성향 기반 종합 궁합 점수 및 조언 | High | Pending |
| FR-21 | 싸움 중재기 - 화해 전략, 연락 타이밍, 회복 가능성 분석 | High | Pending |
| FR-22 | 헤어져야 할까 분석기 - 관계 지속 확률, 리스크 분석 | High | Pending |
| FR-23 | 썸 성공 확률 계산기 - 관심도 추정, 밀당 전략 | Medium | Pending |
| FR-24 | 나의 연애 성향 리포트 - 종합 분석 (의존도, 집착, 회피 지수) | Medium | Pending |
| **결제** | | | |
| FR-30 | Stripe Payment Links 기반 구독 결제 | High | Pending |
| FR-31 | 구독 상태 확인 및 관리 | High | Pending |
| FR-32 | 무료 체험 (제한된 분석 횟수) | Medium | Pending |
| **관리자** | | | |
| FR-40 | 관리자 대시보드 - 총 유저 수, 활성 유저 | High | Pending |
| FR-41 | 유저별 콘텐츠 사용 현황 조회 | Medium | Pending |
| FR-42 | 결제 상태 모니터링 (구독 현황, 매출) | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | API 응답시간 < 500ms (AI 분석 제외) | API 모니터링 |
| Performance | AI 분석 응답시간 < 10s | 로그 측정 |
| Security | 개인 연애 데이터 암호화 저장 | 보안 검토 |
| Security | OWASP Top 10 준수 | 코드 리뷰 |
| UX | 모바일 퍼스트 반응형 UI | 디바이스 테스트 |
| Availability | PWA 오프라인 기본 UI 지원 | Lighthouse 검사 |
| Scalability | 동시 사용자 1,000명 지원 | 부하 테스트 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 카카오톡 로그인으로 회원가입/로그인 가능
- [ ] 연애 데이터 입력/조회/수정/삭제 가능
- [ ] 5개 AI 분석 모듈 정상 동작
- [ ] Stripe 결제 연동 및 구독 관리 가능
- [ ] 관리자 대시보드에서 유저/결제 현황 확인 가능
- [ ] PWA로 홈 화면 추가 가능
- [ ] 모바일 UI 최적화 완료

### 4.2 Quality Criteria

- [ ] Lighthouse Performance Score > 80
- [ ] Lighthouse PWA Score > 90
- [ ] Zero critical security vulnerabilities
- [ ] 주요 플로우 E2E 테스트 통과

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| AI API 비용 증가 | High | Medium | 분석 횟수 제한, 캐싱, 프롬프트 최적화 |
| 카카오 OAuth 정책 변경 | Medium | Low | 추후 다른 소셜 로그인 확장 가능 구조 |
| 개인정보 유출 위험 | High | Low | 데이터 암호화, 접근 제어, 최소 수집 원칙 |
| Stripe 한국 결제 호환성 | Medium | Medium | Payment Links로 간소화, 테스트 우선 |
| AI 분석 정확도 불만족 | Medium | Medium | 프롬프트 엔지니어링 반복 개선, 사용자 피드백 수집 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | Static sites, portfolios | |
| **Dynamic** | Feature-based modules, BaaS integration | Web apps with backend, SaaS MVPs | **V** |
| **Enterprise** | Strict layer separation, microservices | High-traffic systems | |

> **Dynamic** 레벨 선택 이유: BaaS(bkend.ai) 활용한 풀스택 웹앱, 인증/DB/결제 통합 필요

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | **Next.js (App Router)** | SSR, PWA, 모바일 웹 최적화 |
| State Management | Context / Zustand / Redux | **Zustand** | 가볍고 간결, 모듈별 스토어 분리 |
| API Client | fetch / axios / react-query | **TanStack Query + fetch** | 캐싱, 로딩/에러 상태 관리 |
| Form Handling | react-hook-form / formik | **react-hook-form** | 성능 우수, 연애 데이터 입력 폼 다수 |
| Styling | Tailwind / CSS Modules | **Tailwind CSS** | 모바일 UI 빠른 개발, 유틸리티 기반 |
| UI Components | shadcn/ui / Radix | **shadcn/ui** | Tailwind 호환, 커스터마이징 용이 |
| AI Integration | OpenAI / Anthropic / Gemini | **Claude API (Anthropic)** | 한국어 이해도 우수, 연애 상담 품질 |
| Backend/BaaS | bkend.ai / Supabase / Firebase | **bkend.ai** | MCP 통합, 인증/DB 일체형 |
| Payment | Stripe / Toss Payments | **Stripe Payment Links** | 빠른 구축, 구독 모델 지원 |
| Auth | NextAuth / 카카오 SDK | **bkend.ai Auth + 카카오 OAuth** | BaaS 인증 시스템 활용 |

### 6.3 Clean Architecture Approach

```
Selected Level: Dynamic

Folder Structure Preview:
┌─────────────────────────────────────────────────────────────┐
│ src/                                                        │
│   app/                    # Next.js App Router pages        │
│     (auth)/               # 로그인/회원가입 라우트 그룹     │
│     (main)/               # 메인 서비스 라우트 그룹         │
│       data/               # 연애 데이터 입력/관리           │
│       analysis/           # AI 분석 모듈들                  │
│       mypage/             # 마이페이지/구독관리             │
│     admin/                # 관리자 페이지                   │
│     api/                  # API Routes                      │
│   components/             # 공통 UI 컴포넌트                │
│     ui/                   # shadcn/ui 기본 컴포넌트         │
│     layout/               # 레이아웃 컴포넌트               │
│     forms/                # 데이터 입력 폼 컴포넌트         │
│   features/               # 기능별 모듈                     │
│     auth/                 # 인증 (카카오 로그인)            │
│     love-data/            # 연애 데이터 관리                │
│     analysis/             # AI 분석 모듈                    │
│     payment/              # 결제/구독                       │
│     admin/                # 관리자 기능                     │
│   services/               # 외부 서비스 연동                │
│     bkend/                # bkend.ai 클라이언트             │
│     ai/                   # AI API 클라이언트               │
│     stripe/               # Stripe 결제 연동                │
│   lib/                    # 유틸리티                        │
│   types/                  # TypeScript 타입 정의            │
│   stores/                 # Zustand 스토어                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [ ] `CLAUDE.md` has coding conventions section
- [ ] `docs/01-plan/conventions.md` exists (Phase 2 output)
- [ ] ESLint configuration (`.eslintrc.*`)
- [ ] Prettier configuration (`.prettierrc`)
- [ ] TypeScript configuration (`tsconfig.json`)

> **참고**: 프로젝트 초기 상태이므로 모든 컨벤션을 새로 정의해야 함

### 7.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | missing | 컴포넌트: PascalCase, 함수: camelCase, 파일: kebab-case | High |
| **Folder structure** | missing | Dynamic 레벨 feature-based 구조 | High |
| **Import order** | missing | React > Next > 외부 > 내부 > types > styles | Medium |
| **Environment variables** | missing | NEXT_PUBLIC_ 접두사 규칙 | Medium |
| **Error handling** | missing | Error Boundary + Toast 알림 | Medium |
| **Korean/English** | missing | 코드: English, UI: Korean | High |

### 7.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `NEXT_PUBLIC_BKEND_URL` | bkend.ai API 엔드포인트 | Client | V |
| `BKEND_API_KEY` | bkend.ai 서버 API 키 | Server | V |
| `NEXT_PUBLIC_KAKAO_CLIENT_ID` | 카카오 OAuth 클라이언트 ID | Client | V |
| `KAKAO_CLIENT_SECRET` | 카카오 OAuth 시크릿 | Server | V |
| `ANTHROPIC_API_KEY` | Claude AI API 키 | Server | V |
| `STRIPE_SECRET_KEY` | Stripe 시크릿 키 | Server | V |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Stripe Payment Link URL | Client | V |

### 7.4 Pipeline Integration

| Phase | Status | Document Location | Command |
|-------|:------:|-------------------|---------|
| Phase 1 (Schema) | Pending | `docs/01-plan/schema.md` | `/phase-1-schema` |
| Phase 2 (Convention) | Pending | `docs/01-plan/conventions.md` | `/phase-2-convention` |

---

## 8. Feature Modules Detail

### 8.1 궁합 분석기

| 항목 | 설명 |
|------|------|
| **입력** | 나의 MBTI, 상대 MBTI, 성향 데이터, 갈등 이력 |
| **AI 처리** | MBTI 궁합 + 성향 호환성 + 과거 데이터 패턴 분석 |
| **출력** | 종합 궁합 점수(%), 강점/약점, 주의 포인트, 실질적 조언 |

### 8.2 싸움 중재기

| 항목 | 설명 |
|------|------|
| **입력** | 현재 싸움 상황, 상대 MBTI, 관계 단계 |
| **AI 처리** | 갈등 유형 분류 + 상대 성향 기반 전략 |
| **출력** | 하면 안 되는 말, 3단계 화해 전략, 감정 진정 시간, 연락 타이밍, 회복 가능성(%) |

### 8.3 헤어져야 할까 분석기

| 항목 | 설명 |
|------|------|
| **입력** | 최근 갈등, 반복 횟수, 관계 만족도, 미래 계획 일치도 |
| **AI 처리** | 관계 지속성 종합 평가 |
| **출력** | 관계 지속 확률(%), 개선 가능성, 리스크 분석, 이별 권고/보류, 제3자 관점 코멘트 |

### 8.4 썸 성공 확률 계산기

| 항목 | 설명 |
|------|------|
| **입력** | 만난 횟수, 연락 빈도, 답장 속도, 상대 말투/행동 패턴 |
| **AI 처리** | 상대 관심도 추정 + 성공 확률 모델링 |
| **출력** | 썸 성공 확률(%), 상대 관심도, 밀당 전략, 다음 액션 제안 |

### 8.5 나의 연애 성향 리포트

| 항목 | 설명 |
|------|------|
| **입력** | 누적된 전체 연애 데이터 |
| **AI 처리** | 종합 패턴 분석 |
| **출력** | 연애 유형, 감정 의존도(%), 집착 지수(%), 회피 지수(%), 장기 연애 적합도, 이상형 추천 |

---

## 9. Payment Model

| 항목 | 내용 |
|------|------|
| **무료 플랜** | AI 분석 월 3회, 데이터 입력 무제한 |
| **프리미엄 플랜** | AI 분석 무제한, 전체 리포트, 히스토리 분석 |
| **결제 방식** | Stripe Payment Links |
| **구독 주기** | 월간/연간 |

---

## 10. Admin Dashboard

| 기능 | 설명 | Priority |
|------|------|----------|
| 유저 현황 | 총 유저 수, 신규 가입, 활성 유저 | High |
| 콘텐츠 사용량 | 유저별 AI 분석 모듈 사용 현황 | Medium |
| 결제 모니터링 | 구독 현황, 매출, 결제 실패 알림 | High |
| 유저 상세 | 개별 유저 정보 및 활동 로그 | Medium |

---

## 11. Next Steps

1. [ ] Design 문서 작성 (`/pdca design love-research`)
2. [ ] 스키마 정의 (`/phase-1-schema`)
3. [ ] 컨벤션 정의 (`/phase-2-convention`)
4. [ ] 프로젝트 초기화 (Next.js + Tailwind + shadcn/ui)
5. [ ] bkend.ai 프로젝트 설정
6. [ ] 카카오 Developer 앱 등록

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-16 | Initial draft | User |
