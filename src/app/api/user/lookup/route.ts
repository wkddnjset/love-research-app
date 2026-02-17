import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('user_id, mbti, gender, love_style, user_code')
    .eq('user_code', code.toUpperCase())
    .single();

  if (error || !data) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    user: {
      userId: data.user_id,
      mbti: data.mbti,
      gender: data.gender,
      loveStyle: data.love_style,
      userCode: data.user_code,
    },
  });
}
