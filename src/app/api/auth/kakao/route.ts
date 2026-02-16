import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
  }

  try {
    // 1. 카카오 토큰 교환
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/kakao/callback`,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Kakao token exchange failed:', error);
      return NextResponse.json({ error: 'Token exchange failed' }, { status: 401 });
    }

    const tokenData = await tokenResponse.json();

    // 2. 카카오 사용자 정보 조회
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Failed to get user info' }, { status: 401 });
    }

    const kakaoUser = await userResponse.json();

    const user = {
      id: String(kakaoUser.id),
      email: kakaoUser.kakao_account?.email || '',
      nickname: kakaoUser.properties?.nickname || '사용자',
      profileImage: kakaoUser.properties?.profile_image || '',
      role: 'user' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TODO: bkend.ai 연동 시 사용자 DB 저장/조회 로직 추가
    // 현재는 카카오 정보를 그대로 반환

    return NextResponse.json({
      user,
      accessToken: tokenData.access_token,
    });
  } catch (error) {
    console.error('Kakao auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
