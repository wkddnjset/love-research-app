import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = ['/', '/login', '/auth/callback', '/api/webhooks'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일, _next, favicon 등은 통과
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/manifest') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 공개 경로는 세션 갱신만 하고 통과
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  }

  // 인증 필요한 경로: 세션 갱신 + 인증 확인
  const { supabaseResponse, user } = await updateSession(request);

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
