import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithClaude } from '@/services/ai/claude';
import { createClient } from '@/lib/supabase/server';
import {
  REPORT_SYSTEM_PROMPT,
  buildReportPrompt,
} from '@/features/analysis/prompts/report';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();

    // 최근 7일 데일리 답변 조회
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: answers } = await supabase
      .from('daily_answers')
      .select('*, daily_questions(*)')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false });

    const dailyAnswers = (answers ?? []).map((a: Record<string, unknown>) => {
      const q = a.daily_questions as Record<string, unknown> | null;
      return {
        keyword: (q?.keyword as string) || '',
        question: (q?.question as string) || '',
        answer: a.answer as string,
      };
    });

    const prompt = buildReportPrompt({
      mbti: body.mbti,
      exPartners: body.exPartners || [],
      dailyAnswers,
    });

    const aiResponse = await analyzeWithClaude(REPORT_SYSTEM_PROMPT, prompt);

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
