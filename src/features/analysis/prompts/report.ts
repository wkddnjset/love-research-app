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
    nickname?: string;
    mbti?: string;
    styleAnswers?: Record<string, string>;
    goodPoints?: string;
    breakupReason?: string;
    conflictTypes?: string[];
  }>;
  dailyAnswers: Array<{
    keyword: string;
    question: string;
    answer: string;
  }>;
}): string {
  const exSummary = userData.exPartners.map((p, i) => {
    const parts = [`전 애인 ${i + 1}: ${p.nickname || '익명'}`];
    if (p.mbti) parts.push(`MBTI: ${p.mbti}`);
    if (p.breakupReason) parts.push(`이별 사유: ${p.breakupReason}`);
    if (p.goodPoints) parts.push(`좋았던 점: ${p.goodPoints}`);
    if (p.conflictTypes?.length) parts.push(`갈등 유형: ${p.conflictTypes.join(', ')}`);
    if (p.styleAnswers && Object.keys(p.styleAnswers).length > 0) {
      parts.push(`소통 스타일: ${JSON.stringify(p.styleAnswers)}`);
    }
    return parts.join(' | ');
  }).join('\n');

  const dailySummary = userData.dailyAnswers.map((a) =>
    `[${a.keyword}] Q: ${a.question} → A: ${a.answer}`
  ).join('\n');

  return `나의 MBTI: ${userData.mbti || '미입력'}
전 애인 수: ${userData.exPartners.length}명
${exSummary || '과거 연애 데이터 없음'}

최근 데일리 연애 질문 답변:
${dailySummary || '답변 데이터 없음'}

위 데이터를 바탕으로 나의 연애 성향을 종합 분석해주세요.`;
}
