import { formatMbtiDetail } from './report';

export const COMPATIBILITY_SYSTEM_PROMPT = `당신은 전문 연애 상담사이자 MBTI 전문가입니다.
두 사용자의 실제 연애 데이터(MBTI, 연애 성향, 과거 연애 패턴)를 종합 분석하여 정확한 궁합 점수와 조언을 제공합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
{
  "score": (0~100 사이 궁합 점수),
  "strengths": ["강점1", "강점2", "강점3"],
  "weaknesses": ["약점1", "약점2"],
  "cautions": ["주의할 점1", "주의할 점2"],
  "advice": "구체적이고 실질적인 조언 (3~5문장)"
}`;

interface PartnerData {
  mbti?: string | null;
  personality?: string | null;
  conflictTypes?: string[] | null;
  styleAnswers?: Record<string, string> | null;
}

interface UserInputData {
  myMbti: string;
  myMbtiWeights?: number[];
  myGender: string;
  myLoveStyle: string;
  myExPartners: PartnerData[];
  partnerMbti: string;
  partnerMbtiWeights?: number[];
  partnerGender: string;
  partnerLoveStyle: string;
  partnerExPartners: PartnerData[];
}

export function buildCompatibilityPrompt(input: UserInputData): string {
  const formatExData = (exs: PartnerData[]) => {
    if (exs.length === 0) return '데이터 없음';
    return exs.map((ex, i) => {
      const styles = ex.styleAnswers
        ? Object.entries(ex.styleAnswers).map(([k, v]) => `${k}: ${v}`).join(', ')
        : '없음';
      return `  ${i + 1}번: MBTI ${ex.mbti || '모름'}, 성향 ${ex.personality || '미입력'}, 갈등유형 [${(ex.conflictTypes ?? []).join(', ')}], 스타일 [${styles}]`;
    }).join('\n');
  };

  return `[유저 A 정보]
MBTI: ${formatMbtiDetail(input.myMbti, input.myMbtiWeights)}
성별: ${input.myGender}
연애 스타일: ${input.myLoveStyle}
과거 연애 데이터:
${formatExData(input.myExPartners)}

[유저 B 정보]
MBTI: ${formatMbtiDetail(input.partnerMbti, input.partnerMbtiWeights)}
성별: ${input.partnerGender}
연애 스타일: ${input.partnerLoveStyle}
과거 연애 데이터:
${formatExData(input.partnerExPartners)}

두 사용자의 실제 연애 데이터를 바탕으로 궁합을 정밀 분석해주세요.
MBTI 호환성뿐 아니라, 각자의 과거 연애 패턴과 갈등 유형을 고려하여 현실적인 조언을 포함해주세요.`;
}

// 템플릿 변수 플레이스홀더를 사용하는 유저 프롬프트 템플릿
export const COMPATIBILITY_USER_PROMPT_TEMPLATE = `[유저 A 정보]
MBTI: {{myMbtiDetail}}
성별: {{myGender}}
연애 스타일: {{myLoveStyle}}
과거 연애 데이터:
{{myExData}}

[유저 B 정보]
MBTI: {{partnerMbtiDetail}}
성별: {{partnerGender}}
연애 스타일: {{partnerLoveStyle}}
과거 연애 데이터:
{{partnerExData}}

두 사용자의 실제 연애 데이터를 바탕으로 궁합을 정밀 분석해주세요.
MBTI 호환성뿐 아니라, 각자의 과거 연애 패턴과 갈등 유형을 고려하여 현실적인 조언을 포함해주세요.`;

// 데이터로부터 템플릿 변수 맵 생성
export function buildCompatibilityVariables(input: UserInputData): Record<string, string> {
  const formatExData = (exs: PartnerData[]) => {
    if (exs.length === 0) return '데이터 없음';
    return exs.map((ex, i) => {
      const styles = ex.styleAnswers
        ? Object.entries(ex.styleAnswers).map(([k, v]) => `${k}: ${v}`).join(', ')
        : '없음';
      return `  ${i + 1}번: MBTI ${ex.mbti || '모름'}, 성향 ${ex.personality || '미입력'}, 갈등유형 [${(ex.conflictTypes ?? []).join(', ')}], 스타일 [${styles}]`;
    }).join('\n');
  };

  return {
    myMbti: input.myMbti,
    myMbtiDetail: formatMbtiDetail(input.myMbti, input.myMbtiWeights),
    myGender: input.myGender,
    myLoveStyle: input.myLoveStyle,
    myExData: formatExData(input.myExPartners),
    partnerMbti: input.partnerMbti,
    partnerMbtiDetail: formatMbtiDetail(input.partnerMbti, input.partnerMbtiWeights),
    partnerGender: input.partnerGender,
    partnerLoveStyle: input.partnerLoveStyle,
    partnerExData: formatExData(input.partnerExPartners),
  };
}
