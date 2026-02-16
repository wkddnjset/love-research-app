'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/kakao/callback`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-8 flex flex-col items-center gap-3">
        <Heart className="h-12 w-12 text-pink-500" fill="currentColor" />
        <h1 className="text-2xl font-bold">사랑연구소</h1>
        <p className="text-sm text-gray-500">AI 연애 컨설팅 서비스</p>
      </div>

      <Button
        onClick={handleKakaoLogin}
        className="h-12 w-full max-w-xs bg-[#FEE500] text-[#191919] hover:bg-[#FDD835]"
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.041 5.897l-.953 3.49a.3.3 0 00.459.319l4.072-2.713c.776.106 1.57.162 2.381.162 5.523 0 10-3.477 10-7.655C22 6.477 17.523 3 12 3z" />
        </svg>
        카카오톡으로 로그인
      </Button>
    </div>
  );
}
