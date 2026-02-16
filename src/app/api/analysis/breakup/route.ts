import { NextRequest, NextResponse } from 'next/server';
import { breakupInputSchema } from '@/types/schemas/analysis';
import { analyzeWithClaude } from '@/services/ai/claude';
import {
  BREAKUP_SYSTEM_PROMPT,
  buildBreakupPrompt,
} from '@/features/analysis/prompts/breakup';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = breakupInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: '입력값을 확인해주세요', details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const prompt = buildBreakupPrompt(parsed.data);
    const aiResponse = await analyzeWithClaude(BREAKUP_SYSTEM_PROMPT, prompt);

    const result = JSON.parse(aiResponse);
    return NextResponse.json({ ...result, analysisId: crypto.randomUUID() });
  } catch (error) {
    console.error('Breakup analysis error:', error);
    return NextResponse.json(
      { error: { code: 'ANALYSIS_ERROR', message: '분석 중 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
