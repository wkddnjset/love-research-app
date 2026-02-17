'use client';

import BottomNav from '@/components/layout/BottomNav';
import AuthGuard from '@/components/AuthGuard';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="mx-auto min-h-screen max-w-screen-sm pb-16">
        {children}
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
