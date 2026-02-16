'use client';

import { cn } from '@/lib/utils';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreGauge({ score, label, size = 'md' }: ScoreGaugeProps) {
  const sizeClasses = {
    sm: 'h-16 w-16 text-lg',
    md: 'h-24 w-24 text-2xl',
    lg: 'h-32 w-32 text-3xl',
  };

  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-600 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-950';
    if (s >= 60) return 'text-primary border-primary/30 bg-primary/5';
    if (s >= 40) return 'text-yellow-600 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-700 dark:bg-yellow-950';
    return 'text-destructive border-destructive/30 bg-destructive/5';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-4 font-bold shadow-neo',
          sizeClasses[size],
          getColor(score)
        )}
      >
        {score}%
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
