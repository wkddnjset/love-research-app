import { NextRequest, NextResponse } from 'next/server';
import { someInputSchema } from '@/types/schemas/analysis';
import { analyzeWithClaude } from '@/services/ai/claude';
import {
  SOME_SYSTEM_PROMPT,
  buildSomePrompt,
} from '@/features/analysis/prompts/some';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = someInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: '입력값을 확인해주세요', details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const prompt = buildSomePrompt(parsed.data);
    const aiResponse = await analyzeWithClaude(SOME_SYSTEM_PROMPT, prompt);

    const result = JSON.parse(aiResponse);
    return NextResponse.json({ ...result, analysisId: crypto.randomUUID() });
  } catch (error) {
    console.error('Some analysis error:', error);
    return NextResponse.json(
      { error: { code: 'ANALYSIS_ERROR', message: '분석 중 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
