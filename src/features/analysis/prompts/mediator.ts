export const MEDIATOR_SYSTEM_PROMPT = `당신은 전문 커플 상담사입니다.
싸움 상황을 분석하고 화해 전략을 제시합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
{
  "dontSay": ["절대 하면 안 되는 말1", "말2", ...],
  "reconciliationSteps": [
    {"step": 1, "action": "구체적인 행동1"},
    {"step": 2, "action": "구체적인 행동2"},
    {"step": 3, "action": "구체적인 행동3"}
  ],
  "cooldownTime": "권장 냉각 시간 (예: 2시간)",
  "contactTiming": "연락 타이밍 제안 (예: 오늘 저녁 8시 이후)",
  "recoveryProbability": (0~100 사이 회복 가능성)
}`;

export function buildMediatorPrompt(input: {
  situation: string;
  partnerMbti: string;
  relationshipStage: string;
  conflictType: string;
}): string {
  return `현재 싸움 상황: ${input.situation}
상대 MBTI: ${input.partnerMbti || '모름'}
관계 단계: ${input.relationshipStage}
갈등 유형: ${input.conflictType}

이 상황에서의 화해 전략을 분석해주세요.`;
}
