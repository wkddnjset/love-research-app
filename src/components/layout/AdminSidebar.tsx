'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, MessageSquareHeart, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { href: '/admin', label: '대시보드', Icon: LayoutDashboard },
  { href: '/admin/users', label: '유저 관리', Icon: Users },
  { href: '/admin/payments', label: '결제 관리', Icon: CreditCard },
  { href: '/admin/daily-questions', label: '데일리 질문', Icon: MessageSquareHeart },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card shadow-sm">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <h2 className="text-lg font-bold tracking-tight text-primary">사랑연구소 Admin</h2>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-4">
        {ADMIN_NAV.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-border px-4 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
