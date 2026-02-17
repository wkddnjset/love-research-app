# 사랑연구소 v2 - 서비스 리뉴얼 Planning Document

> **Summary**: 5개 분석 모듈 → 2개(연애성향/궁합) + 매칭 서비스 전환, 유저 고유코드 기반 소셜 분석 체계 구축
>
> **Project**: 사랑연구소 (Love Research)
> **Version**: 2.0.0
> **Author**: User
> **Date**: 2026-02-17
> **Status**: Draft
> **Previous**: `love-research.plan.md` (v1 - 5개 분석 모듈 + 구독형)

---

## 1. Overview

### 1.1 Purpose

기존 5개 AI 분석 모듈 중심의 구독형 서비스를 **유저 데이터 확보 중심의 그로스 모델**로 전환한다.

- 핵심 분석 2개(나의 연애 성향 리포트 + 궁합 분석기)를 **무료 제공**
- **유저 고유 코드** 기반으로 타 유저 데이터를 활용한 궁합 분석
- **매칭 서비스**(유료)를 통한 수익화
- 궁합 분석기의 **공유 링크**를 통한 바이럴 가입 유도

### 1.2 Background

- v1은 5개 AI 분석 모듈 + 구독형(월 3회 무료) 모델이었으나, 유저 확보가 우선 과제로 판단
- 무료 서비스로 전환하여 **유저 데이터 풀**을 먼저 확보하는 전략
- 확보된 유저 데이터를 기반으로 **매칭 서비스**로 수익화
- 궁합 분석기를 소셜 기능으로 확장 (1명이 분석하면 상대방에게도 결과 공유)

### 1.3 Related Documents

- v1 Plan: `docs/01-plan/features/love-research.plan.md`
- v1 Design: `docs/02-design/features/love-research.design.md`
- DB Migration v1: `supabase/migrations/001_initial_schema.sql`

---

## 2. Scope

### 2.1 In Scope (v2 변경사항)

**신규 기능:**
- [ ] 유저 고유 코드(invite code) 부여 시스템
- [ ] 마이페이지에서 고유 코드 확인 및 복사
- [ ] 궁합 분석기: 고유 코드 기반 타 유저 데이터 연동 분석
- [ ] 궁합 분석 결과 양방향 공유 (분석 요청자 + 대상 유저 모두 열람 가능)
- [ ] 궁합 분석기 링크 공유 기능 (미가입 유저 → 가입 유도)
- [ ] 매칭 서비스 안내 페이지 (정가 49,000원/회, 얼리버드 29,000원/회)
- [ ] 얼리버드 매칭 티켓 선결제 (최대 10건)
- [ ] 나의 연애 성향 리포트 하단 "소개 받기" CTA 버튼
- [ ] 연애 성향 리포트 주 1회 업데이트 제한

**수정 기능:**
- [ ] 분석 모듈 5개 → 2개로 축소 (나의 연애 성향 리포트 + 궁합 분석기)
- [ ] 결제 모델 변경: 구독형 → 매칭 티켓 단건 구매
- [ ] 분석 모듈 무료화 (기존 월 3회 제한 해제)

**삭제 기능:**
- [ ] 싸움 중재기 (mediator) 모듈 삭제
- [ ] 헤어져야 할까 (breakup) 모듈 삭제
- [ ] 썸 성공 확률 (some) 모듈 삭제
- [ ] 구독형 결제 (premium plan) 삭제

### 2.2 Out of Scope

- 실제 매칭 알고리즘 구현 (유저 300명 이상 확보 후 진행)
- 채팅/메시지 기능
- 네이티브 앱 (iOS/Android)
- 카카오톡 외 소셜 로그인

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status | 변경 |
|----|-------------|----------|--------|------|
| **유저 코드 시스템** | | | | |
| FR-01 | 회원가입 시 유저 고유 코드 자동 생성 (6자리 영숫자, 예: `LR-A3X9K2`) | High | Pending | **신규** |
| FR-02 | 마이페이지에서 고유 코드 표시 및 복사 기능 | High | Pending | **신규** |
| FR-03 | 고유 코드로 타 유저 검색 가능 (궁합 분석기에서 사용) | High | Pending | **신규** |
| **나의 연애 성향 리포트** | | | | |
| FR-10 | 누적 연애 데이터 기반 AI 성향 분석 (무료) | High | 수정 | **무료화** |
| FR-11 | 주 1회 업데이트 제한 (마지막 업데이트 후 7일 경과 시 재분석 가능) | High | Pending | **신규** |
| FR-12 | 리포트 하단 "소개 받기" CTA 버튼 → 매칭 서비스 안내 페이지 이동 | High | Pending | **신규** |
| FR-13 | 성향 결과: 연애 유형, 감정 의존도, 집착 지수, 회피 지수, 장기 연애 적합도, 이상형 추천 | High | 유지 | v1 유지 |
| **궁합 분석기** | | | | |
| FR-20 | 상대방 유저 코드 입력으로 실제 가입 유저 데이터 기반 궁합 분석 (무료) | High | Pending | **신규** |
| FR-21 | 분석 결과 양방향 열람: 분석 요청자 + 대상 유저 모두 결과 조회 가능 | High | Pending | **신규** |
| FR-22 | 궁합 분석 링크 공유: URL 복사/카카오톡 공유 (미가입 유저에게 가입 유도 문구 포함) | High | Pending | **신규** |
| FR-23 | 궁합 결과: 종합 궁합 점수(%), 강점/약점, 주의 포인트, 조언 | High | 수정 | v1 기반 |
| FR-24 | 미가입 코드 입력 시 "아직 가입하지 않은 사용자입니다. 링크를 공유해 초대하세요!" 안내 | Medium | Pending | **신규** |
| **매칭 서비스** | | | | |
| FR-30 | 매칭 서비스 안내 페이지 (서비스 설명, 가격, 시작 조건) | High | Pending | **신규** |
| FR-31 | 정가 49,000원/1회 매칭, 성별 동일 가격 | High | Pending | **신규** |
| FR-32 | 얼리버드 가격 29,000원/1회 매칭 (서비스 오픈 전 선결제) | High | Pending | **신규** |
| FR-33 | 매칭 티켓 최대 10건 선구매 가능 | High | Pending | **신규** |
| FR-34 | 매칭 시작 조건 안내: 남/여 각 300명 이상 가입 시 서비스 오픈 | Medium | Pending | **신규** |
| FR-35 | 결제 완료 시 매칭 티켓 DB에 기록 (사용 전까지 보유) | High | Pending | **신규** |
| FR-36 | 마이페이지에서 보유 매칭 티켓 수 확인 | Medium | Pending | **신규** |
| **삭제 대상** | | | | |
| ~~FR-21~~ | ~~싸움 중재기~~ | - | 삭제 | **삭제** |
| ~~FR-22~~ | ~~헤어져야 할까~~ | - | 삭제 | **삭제** |
| ~~FR-23~~ | ~~썸 성공 확률~~ | - | 삭제 | **삭제** |
| ~~FR-30~~ | ~~Stripe 구독형 결제~~ | - | 삭제 | **삭제** |
| **인증 (v1 유지)** | | | | |
| FR-40 | 카카오톡 OAuth 로그인/회원가입 | High | 완료 | v1 유지 |
| FR-41 | 로그아웃 및 회원탈퇴 | Medium | 완료 | v1 유지 |
| **연애 데이터 (v1 유지)** | | | | |
| FR-50 | 전 애인 정보 CRUD | High | 완료 | v1 유지 |
| FR-51 | 현재 관계 정보 CRUD | High | 완료 | v1 유지 |
| FR-52 | 갈등 기록 입력/조회 | High | 완료 | v1 유지 |
| FR-53 | 감정 기록 입력/조회 | Medium | 완료 | v1 유지 |
| **관리자 (v1 유지 + 확장)** | | | | |
| FR-60 | 관리자 대시보드 - 유저 현황 | High | 완료 | v1 유지 |
| FR-61 | 매칭 티켓 판매 현황 모니터링 | High | Pending | **신규** |
| FR-62 | 남/여 가입자 수 실시간 표시 (매칭 오픈 기준 추적) | Medium | Pending | **신규** |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | API 응답시간 < 500ms (AI 분석 제외) | API 모니터링 |
| Performance | AI 분석 응답시간 < 10s | 로그 측정 |
| Security | 유저 코드로 개인정보 노출 방지 (코드 → 프로필 매핑 시 최소 정보만 반환) | 코드 리뷰 |
| Security | OWASP Top 10 준수 | 보안 검토 |
| UX | 모바일 퍼스트 반응형 UI | 디바이스 테스트 |
| Sharing | 카카오톡/URL 공유 시 OG 메타태그 적용 | 공유 테스트 |
| Growth | 궁합 분석 공유 → 신규 가입 전환 추적 가능 | Analytics |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 유저 고유 코드 자동 생성 및 마이페이지 표시
- [ ] 나의 연애 성향 리포트 무료 제공 + 주 1회 업데이트 제한
- [ ] 궁합 분석기: 코드 기반 타 유저 연동 분석 동작
- [ ] 궁합 분석 결과 양방향(요청자 + 대상) 열람 가능
- [ ] 궁합 분석기 링크 공유 기능 동작
- [ ] 매칭 서비스 안내 페이지 + 얼리버드 결제 동작
- [ ] 매칭 티켓 선구매(최대 10건) 및 마이페이지 확인
- [ ] 싸움 중재기/헤어져야할까/썸 성공확률 페이지 및 API 삭제
- [ ] 구독형 결제 모델 제거 → 매칭 티켓 단건 결제로 전환
- [ ] 모바일 UI 최적화 완료
- [ ] 빌드 성공

### 4.2 Quality Criteria

- [ ] Lighthouse Performance Score > 80
- [ ] Zero critical security vulnerabilities
- [ ] 유저 코드 중복 불가 보장
- [ ] 궁합 분석 결과 양방향 조회 정합성 검증

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 유저 코드 중복 생성 | High | Low | DB unique constraint + 생성 시 중복 체크 재시도 로직 |
| 궁합 분석 프라이버시 | High | Medium | 궁합 분석 시 최소 정보만 사용 (MBTI, 성향만), 개인 감정 데이터 미포함 |
| 매칭 티켓 환불 요청 | Medium | Medium | 환불 정책 명시, 서비스 오픈 전 환불 가능 안내 |
| 유저 300명 미달 시 장기 지연 | Medium | High | 얼리버드 할인으로 가입 유도, 궁합 링크 공유로 바이럴 극대화 |
| 얼리버드 결제 후 서비스 미오픈 | High | Medium | 서비스 미오픈 시 전액 환불 보장 문구 포함 |
| AI API 비용 (무료화로 인한 사용량 증가) | High | Medium | 주 1회 성향 업데이트 제한, 궁합 분석은 동일 조합 캐싱 |

---

## 6. Architecture Considerations

### 6.1 Project Level

- **Dynamic** 레벨 유지 (v1과 동일)
- Supabase BaaS + Next.js App Router

### 6.2 Key Architectural Changes (v1 → v2)

| 항목 | v1 | v2 | 비고 |
|------|-----|-----|------|
| 분석 모듈 | 5개 (궁합, 중재, 이별, 썸, 성향) | 2개 (성향, 궁합) | 3개 삭제 |
| 궁합 분석 | 수동 입력 데이터 기반 | 가입 유저 코드 기반 실제 데이터 | 핵심 변경 |
| 분석 결과 공유 | 없음 | 양방향 (요청자 + 대상) | 신규 |
| 결제 모델 | 구독형 (월 무료 3회 + 프리미엄) | 매칭 티켓 단건 구매 | 전환 |
| 결제 수단 | Paddle 구독 | Paddle 단건 결제 (Overlay) | 변경 |
| 유저 식별 | Supabase Auth ID만 | + 유저 고유 코드 (LR-XXXXXX) | 추가 |
| 바이럴 장치 | 없음 | 궁합 링크 공유 → 가입 유도 | 신규 |
| 가격 | 프리미엄 구독 (월 9,900원 등) | 매칭 49,000원/회, 얼리버드 29,000원/회 | 변경 |

### 6.3 New DB Tables/Columns

```
[신규 컬럼] user_profiles
  + user_code TEXT UNIQUE NOT NULL  -- 유저 고유 코드 (LR-XXXXXX)

[신규 테이블] compatibility_results
  - id UUID PK
  - requester_id UUID FK(auth.users)     -- 분석 요청자
  - target_id UUID FK(auth.users)        -- 분석 대상 (코드로 조회된 유저)
  - result JSONB                         -- AI 분석 결과
  - score INTEGER                        -- 종합 궁합 점수
  - created_at TIMESTAMPTZ

[신규 테이블] matching_tickets
  - id UUID PK
  - user_id UUID FK(auth.users)
  - purchase_type TEXT ('earlybird' | 'regular')
  - price INTEGER                        -- 결제 금액 (29000 or 49000)
  - status TEXT ('unused' | 'used' | 'refunded')
  - paddle_transaction_id TEXT
  - purchased_at TIMESTAMPTZ
  - used_at TIMESTAMPTZ NULL
  - created_at TIMESTAMPTZ

[수정 테이블] analysis_results
  - module_type CHECK 변경: ('compatibility', 'report') -- 'mediator', 'breakup', 'some' 제거

[삭제/비활성화 테이블] subscriptions
  - 구독형 결제 관련 테이블 비활성화 (기존 데이터 보존, 신규 사용 중단)
```

### 6.4 유저 고유 코드 생성 규칙

```
Format: LR-{6자리 영숫자 대문자}
예시: LR-A3X9K2, LR-7BN4M1

생성 로직:
1. 랜덤 6자리 영숫자 생성 (A-Z, 0-9)
2. "LR-" 접두사 추가
3. DB unique constraint 확인
4. 중복 시 재생성 (최대 5회)
5. user_profiles 테이블에 저장
```

### 6.5 궁합 분석 플로우

```
[궁합 분석 플로우]

1. 유저 A가 궁합 분석기 페이지 접속
2. 상대방 유저 코드 입력 (LR-XXXXXX)
3. 코드로 유저 B 조회
   - 존재: 유저 B의 MBTI/성향 데이터 로드 → 4단계
   - 미존재: "아직 가입하지 않은 사용자입니다" 안내 + 초대 링크 공유 버튼
4. AI 궁합 분석 실행 (유저 A + 유저 B 데이터)
5. 결과 compatibility_results 테이블에 저장
6. 유저 A: 즉시 결과 열람
7. 유저 B: 마이페이지 또는 알림에서 "누군가 당신과의 궁합을 분석했습니다" 확인 가능
```

### 6.6 링크 공유 플로우

```
[궁합 분석 링크 공유 플로우]

1. 유저 A가 궁합 분석기 페이지에서 "링크 공유" 클릭
2. 공유 URL 생성: https://사랑연구소.com/invite/{userCode}
3. URL 클릭 시:
   - 가입 유저: 궁합 분석기 페이지로 이동 (유저 A 코드 자동 입력)
   - 미가입 유저: 랜딩 페이지 → 가입 유도 → 가입 후 궁합 분석기로 리다이렉트
4. OG 메타태그로 카카오톡 미리보기 지원
```

### 6.7 매칭 서비스 결제 플로우

```
[매칭 티켓 결제 플로우]

1. 매칭 서비스 안내 페이지 접속
2. 서비스 설명, 가격(정가 49,000원), 시작 조건(남/여 각 300명) 확인
3. 얼리버드 가격 29,000원 안내 + 선결제 버튼
4. 수량 선택 (1~10매)
5. Paddle Overlay Checkout 실행
   - customData: { user_id, ticket_count, purchase_type: 'earlybird' }
   - price: 29,000원 × 수량
6. 결제 완료 → Paddle Webhook → matching_tickets 테이블에 티켓 생성
7. 마이페이지에서 보유 티켓 수 확인
```

---

## 7. 삭제 대상 정리

### 7.1 삭제할 페이지

| 경로 | 설명 |
|------|------|
| `src/app/(main)/analysis/mediator/page.tsx` | 싸움 중재기 페이지 |
| `src/app/(main)/analysis/breakup/page.tsx` | 헤어져야 할까 페이지 |
| `src/app/(main)/analysis/some/page.tsx` | 썸 성공 확률 페이지 |

### 7.2 삭제할 API Routes

| 경로 | 설명 |
|------|------|
| `src/app/api/analysis/mediator/route.ts` | 중재기 API |
| `src/app/api/analysis/breakup/route.ts` | 이별 분석 API |
| `src/app/api/analysis/some/route.ts` | 썸 분석 API |

### 7.3 삭제할 프롬프트

| 경로 | 설명 |
|------|------|
| `src/features/analysis/prompts/mediator.ts` | 중재기 프롬프트 |
| `src/features/analysis/prompts/breakup.ts` | 이별 프롬프트 |
| `src/features/analysis/prompts/some.ts` | 썸 프롬프트 |

### 7.4 수정할 상수/타입

| 파일 | 변경 내용 |
|------|-----------|
| `src/lib/constants.ts` | ANALYSIS_MODULES에서 mediator, breakup, some 제거 |
| `src/types/index.ts` | AnalysisModuleType에서 mediator, breakup, some 제거 |
| `src/types/schemas/analysis.ts` | mediator, breakup, some 스키마 제거 |
| `src/stores/analysisStore.ts` | 관련 타입 업데이트 |

---

## 8. Implementation Order (우선순위)

### Phase 1: DB 마이그레이션 + 유저 코드 시스템
1. DB 마이그레이션 SQL 작성 (user_code 컬럼, compatibility_results, matching_tickets 테이블)
2. 기존 유저에 대한 코드 백필 로직
3. 회원가입 시 코드 자동 생성 로직 (onboarding 페이지 또는 auth callback)
4. 마이페이지 코드 표시 + 복사 기능

### Phase 2: 모듈 삭제 + 분석 무료화
1. mediator, breakup, some 페이지/API/프롬프트 삭제
2. 상수/타입 정리
3. 구독형 결제 로직 제거 (무료화)
4. 분석 페이지 UI 정리 (2개 모듈만 표시)

### Phase 3: 궁합 분석기 리뉴얼
1. 궁합 분석기 UI 변경 (코드 입력 방식)
2. 코드 기반 유저 조회 API
3. AI 궁합 분석 로직 수정 (실제 유저 데이터 활용)
4. compatibility_results 테이블 양방향 저장/조회
5. 상대방 열람 기능 (마이페이지)

### Phase 4: 링크 공유 + 바이럴
1. /invite/{userCode} 페이지 구현
2. 궁합 분석기 공유 버튼 (URL 복사, 카카오톡)
3. OG 메타태그 설정
4. 미가입 유저 리다이렉트 플로우

### Phase 5: 매칭 서비스 + 결제
1. 매칭 서비스 안내 페이지
2. 얼리버드 가격 + 수량 선택 UI
3. Paddle 단건 결제 연동
4. Webhook → matching_tickets 저장
5. 마이페이지 티켓 현황 표시

### Phase 6: 연애 성향 리포트 업데이트
1. 주 1회 업데이트 제한 로직
2. 리포트 하단 "소개 받기" CTA 버튼
3. CTA → 매칭 서비스 안내 페이지 연결

---

## 9. 매칭 서비스 비즈니스 모델

### 9.1 가격 정책

| 항목 | 가격 | 비고 |
|------|------|------|
| 정가 (서비스 오픈 후) | 49,000원 / 1회 매칭 | 남녀 동일 |
| 얼리버드 (서비스 오픈 전) | 29,000원 / 1회 매칭 | 선결제 할인 |
| 최대 구매 수량 | 10매 | 1인당 최대 |

### 9.2 서비스 오픈 조건

| 조건 | 기준 |
|------|------|
| 남성 가입자 | 300명 이상 |
| 여성 가입자 | 300명 이상 |
| 오픈 시점 | 양쪽 모두 충족 시 |

### 9.3 매칭 티켓 상태

```
unused    → 구매 완료, 사용 전
used      → 매칭 완료 (서비스 오픈 후)
refunded  → 환불 처리됨
```

---

## 10. Environment Variables (변경사항)

| Variable | Purpose | Scope | 변경 |
|----------|---------|-------|------|
| `NEXT_PUBLIC_PADDLE_EARLYBIRD_PRICE_ID` | 얼리버드 매칭 티켓 가격 ID | Client | **신규** |
| `NEXT_PUBLIC_PADDLE_REGULAR_PRICE_ID` | 정가 매칭 티켓 가격 ID | Client | **신규** |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | Paddle 클라이언트 토큰 | Client | 유지 |
| `PADDLE_API_KEY` | Paddle 서버 API 키 | Server | 유지 |
| `PADDLE_WEBHOOK_SECRET` | Paddle 웹훅 시크릿 | Server | 유지 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | Client | 유지 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase 키 | Client | 유지 |
| `ANTHROPIC_API_KEY` | Claude AI API 키 | Server | 유지 |
| ~~`NEXT_PUBLIC_PADDLE_PRICE_ID`~~ | ~~구독 가격 ID~~ | - | **삭제** |

---

## 11. Next Steps

1. [ ] Plan 리뷰 및 승인
2. [ ] Design 문서 작성 (`/pdca design love-research-v2`)
3. [ ] DB 마이그레이션 SQL 작성 (003_v2_migration.sql)
4. [ ] 구현 시작

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-17 | v2 리뉴얼 초안 - 유저코드/궁합리뉴얼/매칭서비스/모듈축소 | User |
