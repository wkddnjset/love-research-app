import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithClaude } from '@/services/ai/claude';
import {
  REPORT_SYSTEM_PROMPT,
  buildReportPrompt,
} from '@/features/analysis/prompts/report';

export async function POST(request: NextRequest) {
  try {
    // TODO: 실제로는 bkend.ai에서 해당 유저의 전체 데이터를 조회
    const body = await request.json();

    const prompt = buildReportPrompt({
      mbti: body.mbti,
      exPartners: body.exPartners || [],
      conflictRecords: body.conflictRecords || [],
      emotionRecords: body.emotionRecords || [],
    });

    const aiResponse = await analyzeWithClaude(REPORT_SYSTEM_PROMPT, prompt);

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
