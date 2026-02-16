export const REPORT_SYSTEM_PROMPT = `당신은 전문 연애 심리 분석가입니다.
사용자의 누적된 연애 데이터를 종합 분석하여 연애 성향 리포트를 작성합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
{
  "loveType": "연애 유형 이름 (예: 헌신적 낭만가)",
  "emotionalDependency": (0~100 사이 감정 의존도),
  "obsessionIndex": (0~100 사이 집착 지수),
  "avoidanceIndex": (0~100 사이 회피 지수),
  "longTermCompatibility": (0~100 사이 장기 연애 적합도),
  "idealTypeRecommendation": "이상형 추천 (MBTI 포함)",
  "summary": "종합 분석 요약 (5~7문장)"
}`;

export function buildReportPrompt(userData: {
  mbti?: string;
  exPartners: Array<{
    mbti?: string;
    satisfactionScore: number;
    conflictTypes: string[];
    breakupReason?: string;
  }>;
  conflictRecords: Array<{
    conflictType: string;
    severity: number;
  }>;
  emotionRecords: Array<{
    mood: string;
    score: number;
  }>;
}): string {
  const avgSatisfaction = userData.exPartners.length > 0
    ? (userData.exPartners.reduce((acc, p) => acc + p.satisfactionScore, 0) / userData.exPartners.length).toFixed(1)
    : '데이터 없음';

  const avgEmotionScore = userData.emotionRecords.length > 0
    ? (userData.emotionRecords.reduce((acc, e) => acc + e.score, 0) / userData.emotionRecords.length).toFixed(1)
    : '데이터 없음';

  return `나의 MBTI: ${userData.mbti || '미입력'}
전 애인 수: ${userData.exPartners.length}명
전 애인 MBTI: ${userData.exPartners.map((p) => p.mbti || '모름').join(', ') || '없음'}
평균 만족도: ${avgSatisfaction}
주요 이별 사유: ${userData.exPartners.map((p) => p.breakupReason).filter(Boolean).join(', ') || '미입력'}
주요 갈등 유형: ${[...new Set(userData.conflictRecords.map((c) => c.conflictType))].join(', ') || '없음'}
평균 감정 점수: ${avgEmotionScore}
기분 분포: ${userData.emotionRecords.map((e) => e.mood).join(', ') || '없음'}

위 데이터를 바탕으로 나의 연애 성향을 종합 분석해주세요.`;
}
