import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `사랑연구소 - 궁합 분석 초대`,
    description: `${code}님이 궁합 분석을 요청했어요! 지금 가입하고 나와의 궁합을 확인해보세요.`,
    openGraph: {
      title: '사랑연구소 - 궁합 분석 초대',
      description: '누군가 당신과의 궁합이 궁금해 해요! 가입하고 확인해보세요.',
      type: 'website',
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(`/analysis/compatibility?code=${code}`);
  } else {
    redirect(`/login?invite=${code}`);
  }
}
