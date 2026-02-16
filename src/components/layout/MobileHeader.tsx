'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export default function MobileHeader({
  title,
  showBack = false,
  rightAction,
  className,
}: MobileHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/80 backdrop-blur-md px-4',
        className
      )}
    >
      <div className="flex w-10 items-center">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-full p-1 transition-colors hover:bg-accent"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
        )}
      </div>
      <h1 className="flex-1 text-center text-lg font-bold tracking-tight text-foreground truncate">
        {title}
      </h1>
      <div className="flex w-10 items-center justify-end">{rightAction}</div>
    </header>
  );
}
