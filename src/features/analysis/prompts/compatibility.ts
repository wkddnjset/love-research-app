export const COMPATIBILITY_SYSTEM_PROMPT = `당신은 전문 연애 상담사이자 MBTI 전문가입니다.
사용자의 MBTI, 성향, 갈등 이력을 분석하여 정확한 궁합 점수와 조언을 제공합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
{
  "score": (0~100 사이 궁합 점수),
  "strengths": ["강점1", "강점2", ...],
  "weaknesses": ["약점1", "약점2", ...],
  "cautions": ["주의할 점1", ...],
  "advice": "구체적이고 실질적인 조언 (3~5문장)"
}`;

export function buildCompatibilityPrompt(input: {
  myMbti: string;
  partnerMbti: string;
  myPersonality: string;
  partnerPersonality: string;
  conflictHistory: string[];
}): string {
  return `나의 MBTI: ${input.myMbti}
상대 MBTI: ${input.partnerMbti}
나의 성향: ${input.myPersonality || '미입력'}
상대 성향: ${input.partnerPersonality || '미입력'}
과거 갈등 이력: ${input.conflictHistory.length > 0 ? input.conflictHistory.join(', ') : '없음'}

이 정보를 바탕으로 연애 궁합을 분석해주세요.`;
}
