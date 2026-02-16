export const MBTI_OPTIONS = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
] as const;

export const MOOD_OPTIONS = [
  { value: 'happy', label: '행복', emoji: '😊' },
  { value: 'sad', label: '슬픔', emoji: '😢' },
  { value: 'angry', label: '화남', emoji: '😠' },
  { value: 'anxious', label: '불안', emoji: '😰' },
  { value: 'confused', label: '혼란', emoji: '😵' },
  { value: 'peaceful', label: '평온', emoji: '😌' },
] as const;

export const RELATIONSHIP_STAGES = [
  { value: 'some', label: '썸' },
  { value: 'dating', label: '연애 중' },
  { value: 'serious', label: '진지한 관계' },
] as const;

export const CONFLICT_TYPES = [
  '연락 빈도',
  '질투/의심',
  '생활 패턴',
  '가치관 차이',
  '금전 문제',
  '시간 관리',
  '소통 부재',
  '가족 문제',
  '미래 계획',
  '기타',
] as const;

export const ANALYSIS_MODULES = [
  {
    type: 'compatibility' as const,
    title: '궁합 분석기',
    description: 'MBTI와 성향 기반 연애 궁합 분석',
    icon: '💕',
    color: 'bg-pink-50 border-pink-200',
  },
  {
    type: 'mediator' as const,
    title: '싸움 중재기',
    description: '갈등 상황 분석 및 화해 전략 제안',
    icon: '🕊️',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    type: 'breakup' as const,
    title: '헤어져야 할까',
    description: '관계 지속 가능성 객관적 분석',
    icon: '💔',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    type: 'some' as const,
    title: '썸 성공 확률',
    description: '현재 썸 관계의 성공 가능성 분석',
    icon: '🦋',
    color: 'bg-green-50 border-green-200',
  },
  {
    type: 'report' as const,
    title: '나의 연애 성향',
    description: '나의 성향과 이상형 종합 리포트',
    icon: '📊',
    color: 'bg-orange-50 border-orange-200',
  },
] as const;

export const MAX_FREE_ANALYSIS = 3;

export const NAV_ITEMS = [
  { href: '/home', label: '홈', icon: 'home' },
  { href: '/analysis', label: '분석', icon: 'sparkles' },
  { href: '/data', label: '기록', icon: 'heart' },
  { href: '/mypage', label: 'MY', icon: 'user' },
] as const;
