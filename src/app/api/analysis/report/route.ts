import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithClaude } from '@/services/ai/claude';
import { createClient } from '@/lib/supabase/server';
import {
  REPORT_SYSTEM_PROMPT,
  buildReportPrompt,
  buildReportVariables,
} from '@/features/analysis/prompts/report';
import { getPromptTemplate, renderTemplate } from '@/features/analysis/prompts/loader';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();

    // 최근 답변 10개 조회 (날짜 기준이 아닌 실제 답변 기준)
    const { data: answers } = await supabase
      .from('daily_answers')
      .select('*, daily_questions(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const dailyAnswers = (answers ?? []).map((a: Record<string, unknown>) => {
      const q = a.daily_questions as Record<string, unknown> | null;
      return {
        keyword: (q?.keyword as string) || '',
        question: (q?.question as string) || '',
        answer: a.answer as string,
      };
    });

    const userData = {
      mbti: body.mbti,
      exPartners: body.exPartners || [],
      dailyAnswers,
    };

    let systemPrompt: string;
    let userMessage: string;

    const dbTemplate = await getPromptTemplate('report');
    if (dbTemplate) {
      systemPrompt = dbTemplate.systemPrompt;
      userMessage = renderTemplate(dbTemplate.userPromptTemplate, buildReportVariables(userData));
    } else {
      systemPrompt = REPORT_SYSTEM_PROMPT;
      userMessage = buildReportPrompt(userData);
    }

    const aiResponse = await analyzeWithClaude(systemPrompt, userMessage);

    // last_report_at 업데이트
    await supabase
      .from('user_profiles')
      .update({ last_report_at: new Date().toISOString() })
      .eq('user_id', user.id);

    const result = JSON.parse(aiResponse);
    return NextResponse.json({ ...result, analysisId: crypto.randomUUID() });
  } catch (error) {
    console.error('Report analysis error:', error);
    return NextResponse.json(
      { error: { code: 'ANALYSIS_ERROR', message: '분석 중 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
