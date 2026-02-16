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
    if (s >= 80) return 'text-green-500 border-green-200 bg-green-50';
    if (s >= 60) return 'text-blue-500 border-blue-200 bg-blue-50';
    if (s >= 40) return 'text-yellow-500 border-yellow-200 bg-yellow-50';
    return 'text-red-500 border-red-200 bg-red-50';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-4 font-bold',
          sizeClasses[size],
          getColor(score)
        )}
      >
        {score}%
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
