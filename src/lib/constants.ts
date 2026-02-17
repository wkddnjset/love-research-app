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

export const RELATIONSHIP_STYLE_QUESTIONS = [
  {
    id: 'conflict',
    title: '갈등 대응',
    question: '의견 충돌이 생겼을 때, 상대는 주로 어떻게 반응했나요?',
    options: [
      { value: 'talk', label: '즉시 대화로 해결하려 함' },
      { value: 'think', label: '시간을 두고 생각한 뒤 대화' },
      { value: 'emotional', label: '화를 내거나 감정적으로 반응' },
      { value: 'avoid', label: '회피하거나 침묵' },
    ],
  },
  {
    id: 'affection',
    title: '애정 표현',
    question: '상대의 주된 애정 표현 방식은 어땠나요?',
    options: [
      { value: 'words', label: '말로 표현 (칭찬, 사랑 고백)' },
      { value: 'touch', label: '스킨십과 신체 접촉' },
      { value: 'gifts', label: '선물이나 깜짝 이벤트' },
      { value: 'time', label: '함께하는 시간' },
      { value: 'service', label: '도움과 배려 행동' },
    ],
  },
  {
    id: 'contact',
    title: '연락 패턴',
    question: '떨어져 있을 때 상대의 연락 스타일은?',
    options: [
      { value: 'proactive', label: '자주 먼저 연락함' },
      { value: 'meetFocused', label: '연락은 적지만 만남을 중시' },
      { value: 'slow', label: '답장이 느리고 연락이 적음' },
      { value: 'moody', label: '기분에 따라 연락 빈도가 다름' },
    ],
  },
  {
    id: 'jealousy',
    title: '질투와 신뢰',
    question: '나의 이성 친구나 다른 약속에 대해 어떻게 반응했나요?',
    options: [
      { value: 'trusting', label: '신뢰하며 편하게 대함' },
      { value: 'mildJealous', label: '약간의 질투를 표현하지만 존중' },
      { value: 'strongJealous', label: '강한 질투와 불안을 표현' },
      { value: 'indifferent', label: '무관심하거나 신경 쓰지 않음' },
    ],
  },
  {
    id: 'future',
    title: '미래 대화',
    question: '함께하는 미래에 대한 태도는 어땠나요?',
    options: [
      { value: 'concrete', label: '구체적인 계획을 세우려 함' },
      { value: 'positive', label: '긍정적이지만 구체적이진 않음' },
      { value: 'avoidant', label: '미래 대화를 회피하거나 불편해함' },
      { value: 'divergent', label: '서로 다른 방향을 원함' },
    ],
  },
  {
    id: 'stress',
    title: '스트레스 반응',
    question: '스트레스를 받았을 때 상대의 모습은?',
    options: [
      { value: 'lean', label: '나에게 의지하고 대화로 풂' },
      { value: 'alone', label: '혼자만의 시간이 필요' },
      { value: 'irritable', label: '짜증이나 화를 주변에 표출' },
      { value: 'withdraw', label: '과묵해지고 감정을 숨김' },
    ],
  },
  {
    id: 'apology',
    title: '사과 방식',
    question: '잘못했을 때 상대는 어떻게 사과했나요?',
    options: [
      { value: 'direct', label: '솔직하게 잘못을 인정하고 사과' },
      { value: 'action', label: '행동으로 보여주되 말은 잘 안 함' },
      { value: 'excuse', label: '변명이나 합리화가 많음' },
      { value: 'wait', label: '상대가 먼저 풀어주길 기다림' },
    ],
  },
  {
    id: 'dateStyle',
    title: '데이트 스타일',
    question: '함께 시간을 보내는 방식은?',
    options: [
      { value: 'lead', label: '적극적으로 계획하고 이끌어감' },
      { value: 'mutual', label: '서로 맞춰가며 자연스럽게' },
      { value: 'passive', label: '내가 주로 계획하고 상대는 따라옴' },
      { value: 'independent', label: '각자의 공간을 중시하며 적당히' },
    ],
  },
  {
    id: 'support',
    title: '감정적 지지',
    question: '내가 힘들 때 상대는 어떻게 반응했나요?',
    options: [
      { value: 'empathy', label: '공감하고 들어주며 위로' },
      { value: 'solution', label: '해결책을 제시하려 함' },
      { value: 'tryButLack', label: '공감은 부족하지만 나름 노력' },
      { value: 'distant', label: '무관심하거나 부담스러워함' },
    ],
  },
  {
    id: 'space',
    title: '개인 공간',
    question: '관계에서 개인 시간에 대한 태도는?',
    options: [
      { value: 'balanced', label: '적절하게 존중하며 각자 시간을 가짐' },
      { value: 'together', label: '함께하는 시간을 최우선' },
      { value: 'tooMuch', label: '지나치게 개인 시간을 원함' },
      { value: 'irregular', label: '불규칙적 - 때에 따라 다름' },
    ],
  },
] as const;

export const ANALYSIS_MODULES = [
  {
    type: 'report' as const,
    title: '나의 연애 성향',
    description: '나의 연애 패턴과 이상형을 AI가 종합 분석',
    icon: '💖',
    gradient: 'from-pink-400 to-rose-500',
    bgStyle: 'from-pink-500/5 to-rose-500/5 dark:from-pink-500/10 dark:to-rose-500/10',
  },
  {
    type: 'compatibility' as const,
    title: '궁합 분석기',
    description: '상대방 코드를 입력하면 실제 데이터 기반 궁합 분석',
    icon: '💕',
    gradient: 'from-violet-500 to-purple-600',
    bgStyle: 'from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/10',
  },
] as const;

export const SEVERITY_LEVELS = [
  { value: 1, label: '가벼운 다툼', emoji: '💬' },
  { value: 2, label: '신경쓰임', emoji: '😤' },
  { value: 3, label: '심각한 대화 필요', emoji: '⚡' },
  { value: 4, label: '큰 싸움', emoji: '🔥' },
  { value: 5, label: '관계 위기', emoji: '💔' },
] as const;

export const EMOTION_TAGS = [
  '연인', '썸', '이별', '재회', '데이트',
  '연락', '질투', '신뢰', '외로움', '설렘',
  '불안', '감사', '후회', '성장', '기타',
] as const;

export const NAV_ITEMS = [
  { href: '/home', label: '홈', icon: 'home' },
  { href: '/analysis', label: '분석', icon: 'sparkles' },
  { href: '/data', label: '기록', icon: 'heart' },
  { href: '/mypage', label: 'MY', icon: 'user' },
] as const;

// 매칭 서비스 상수
export const MATCHING_REGULAR_PRICE = 49000;
export const MATCHING_EARLYBIRD_PRICE = 29000;
export const MATCHING_MAX_TICKETS = 10;
export const MATCHING_MIN_USERS = 300;
