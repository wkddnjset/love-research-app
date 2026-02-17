import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithClaude } from '@/services/ai/claude';
import { createClient } from '@/lib/supabase/server';
import {
  COMPATIBILITY_SYSTEM_PROMPT,
  buildCompatibilityPrompt,
  buildCompatibilityVariables,
} from '@/features/analysis/prompts/compatibility';
import { getPromptTemplate, renderTemplate } from '@/features/analysis/prompts/loader';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetCode } = body;

    if (!targetCode || !/^LR-[A-Z0-9]{6}$/.test(targetCode)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: '올바른 코드 형식이 아닙니다' } },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 현재 유저 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'AUTH_ERROR', message: '로그인이 필요합니다' } }, { status: 401 });
    }

    // 현재 유저 프로필
    const { data: myProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 대상 유저 프로필
    const { data: targetProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_code', targetCode)
      .single();

    if (!targetProfile) {
      return NextResponse.json({ found: false, message: '아직 가입하지 않은 사용자입니다' });
    }

    if (targetProfile.user_id === user.id) {
      return NextResponse.json(
        { error: { code: 'SELF_ANALYSIS', message: '자신과의 궁합은 분석할 수 없어요' } },
        { status: 400 }
      );
    }

    // 나의 연애 데이터 로드
    const { data: myExPartners } = await supabase
      .from('ex_partners')
      .select('mbti, personality, conflict_types, style_answers, good_points')
      .eq('user_id', user.id);

    // 대상 연애 데이터 로드
    const { data: targetExPartners } = await supabase
      .from('ex_partners')
      .select('mbti, personality, conflict_types, style_answers, good_points')
      .eq('user_id', targetProfile.user_id);

    const inputData = {
      myMbti: myProfile?.mbti || '미입력',
      myGender: myProfile?.gender || '미입력',
      myLoveStyle: myProfile?.love_style || '미입력',
      myExPartners: (myExPartners ?? []).map((p) => ({
        mbti: p.mbti,
        personality: p.personality,
        conflictTypes: p.conflict_types,
        styleAnswers: p.style_answers,
      })),
      partnerMbti: targetProfile.mbti || '미입력',
      partnerGender: targetProfile.gender || '미입력',
      partnerLoveStyle: targetProfile.love_style || '미입력',
      partnerExPartners: (targetExPartners ?? []).map((p) => ({
        mbti: p.mbti,
        personality: p.personality,
        conflictTypes: p.conflict_types,
        styleAnswers: p.style_answers,
      })),
    };

    let systemPrompt: string;
    let userMessage: string;

    const dbTemplate = await getPromptTemplate('compatibility');
    if (dbTemplate) {
      systemPrompt = dbTemplate.systemPrompt;
      userMessage = renderTemplate(dbTemplate.userPromptTemplate, buildCompatibilityVariables(inputData));
    } else {
      systemPrompt = COMPATIBILITY_SYSTEM_PROMPT;
      userMessage = buildCompatibilityPrompt(inputData);
    }

    const aiResponse = await analyzeWithClaude(systemPrompt, userMessage);
    const result = JSON.parse(aiResponse);

    // compatibility_results에 양방향 저장
    await supabase.from('compatibility_results').insert({
      requester_id: user.id,
      target_id: targetProfile.user_id,
      result,
      score: result.score,
    });

    return NextResponse.json({
      found: true,
      targetCode,
      targetMbti: targetProfile.mbti,
      ...result,
      analysisId: crypto.randomUUID(),
    });
  } catch (error) {
    console.error('Compatibility analysis error:', error);
    return NextResponse.json(
      { error: { code: 'ANALYSIS_ERROR', message: '분석 중 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
