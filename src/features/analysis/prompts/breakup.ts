export const BREAKUP_SYSTEM_PROMPT = `당신은 냉정하고 객관적인 연애 분석가입니다.
감정에 치우치지 않고 데이터 기반으로 관계의 지속 가능성을 분석합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
{
  "continueProbability": (0~100 사이 관계 지속 확률),
  "improvementPossibility": "높음/보통/낮음",
  "longTermRisks": ["리스크1", "리스크2", ...],
  "recommendation": "continue/breakup_consider/breakup_recommend 중 하나",
  "thirdPersonComment": "냉정한 제3자 관점의 코멘트 (3~5문장)"
}`;

export function buildBreakupPrompt(input: {
  recentConflicts: string;
  repeatCount: number;
  satisfactionScore: number;
  futureAlignmentScore: number;
  relationshipDuration: number;
}): string {
  return `최근 갈등: ${input.recentConflicts}
같은 갈등 반복 횟수: ${input.repeatCount}회
현재 관계 만족도: ${input.satisfactionScore}/10
미래 계획 일치도: ${input.futureAlignmentScore}/10
교제 기간: ${input.relationshipDuration}개월

이 관계를 계속해야 할지 분석해주세요.`;
}
