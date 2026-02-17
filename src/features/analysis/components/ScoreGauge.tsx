'use client';

import { cn } from '@/lib/utils';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreGauge({ score, label, size = 'md' }: ScoreGaugeProps) {
  const sizeClasses = {
    sm: 'h-20 w-20',
    md: 'h-28 w-28',
    lg: 'h-36 w-36',
  };

  const textClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const radius = size === 'sm' ? 32 : size === 'md' ? 46 : 60;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: 'stroke-green-500', text: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10' };
    if (s >= 60) return { stroke: 'stroke-primary', text: 'text-primary', bg: 'bg-primary/10' };
    if (s >= 40) return { stroke: 'stroke-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10' };
    return { stroke: 'stroke-destructive', text: 'text-destructive', bg: 'bg-destructive/10' };
  };

  const colors = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('relative flex items-center justify-center', sizeClasses[size])}>
        <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${(radius + 6) * 2} ${(radius + 6) * 2}`}>
          <circle
            cx={radius + 6}
            cy={radius + 6}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-muted/30"
            strokeWidth={size === 'sm' ? 4 : 6}
          />
          <circle
            cx={radius + 6}
            cy={radius + 6}
            r={radius}
            fill="none"
            className={colors.stroke}
            strokeWidth={size === 'sm' ? 4 : 6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <span className={cn('font-bold', textClasses[size], colors.text)}>
          {score}<span className={size === 'sm' ? 'text-xs' : 'text-sm'}>%</span>
        </span>
      </div>
      {label && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
    </div>
  );
}
