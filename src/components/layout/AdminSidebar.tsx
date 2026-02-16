'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard } from 'lucide-react';

import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { href: '/admin', label: '대시보드', Icon: LayoutDashboard },
  { href: '/admin/users', label: '유저 관리', Icon: Users },
  { href: '/admin/payments', label: '결제 관리', Icon: CreditCard },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-60 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-bold text-pink-500">사랑연구소 Admin</h2>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {ADMIN_NAV.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-pink-50 font-medium text-pink-600'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
