export const SOME_SYSTEM_PROMPT = `당신은 연애 심리 전문가입니다.
썸 관계의 신호를 읽고 성공 확률을 분석합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
{
  "successProbability": (0~100 사이 썸 성공 확률),
  "interestLevel": "매우 높음/높음/보통/낮음/매우 낮음",
  "pushPullStrategy": "밀당 전략 조언 (2~3문장)",
  "nextAction": "다음에 취할 구체적인 액션 (1~2문장)"
}`;

export function buildSomePrompt(input: {
  meetCount: number;
  contactFrequency: string;
  replySpeed: string;
  partnerBehavior: string;
}): string {
  return `만난 횟수: ${input.meetCount}회
연락 빈도: ${input.contactFrequency}
답장 속도: ${input.replySpeed}
상대 행동 패턴: ${input.partnerBehavior}

이 썸의 성공 가능성을 분석해주세요.`;
}
