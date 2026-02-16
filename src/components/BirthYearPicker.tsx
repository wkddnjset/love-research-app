'use client';

import { useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const currentYear = new Date().getFullYear();
const MIN_YEAR = 1960;
const MAX_YEAR = currentYear - 14; // at least 14 years old

interface BirthYearPickerProps {
  value: string;
  onChange: (year: string) => void;
}

export default function BirthYearPicker({ value, onChange }: BirthYearPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const year = value ? Number(value) : null;

  const handleIncrement = () => {
    const next = year ? Math.min(year + 1, MAX_YEAR) : 1995;
    onChange(String(next));
  };

  const handleDecrement = () => {
    const next = year ? Math.max(year - 1, MIN_YEAR) : 1995;
    onChange(String(next));
  };

  const decades = ['60s', '70s', '80s', '90s', '00s'];
  const decadeStarts = [1960, 1970, 1980, 1990, 2000];

  return (
    <div className="space-y-2">
      <Label>출생연도</Label>

      {/* Decade quick select */}
      <div className="flex gap-1.5">
        {decades.map((label, i) => {
          const start = decadeStarts[i];
          const isActive = year !== null && year >= start && year < start + 10;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(String(start + 5))}
              className={cn(
                'flex-1 rounded-lg border py-1.5 text-xs font-semibold transition-all',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground shadow-neo'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Year spinner */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronDown className="h-4 w-4" />
        </button>

        <div className="relative" ref={scrollRef}>
          <div className="flex h-12 w-28 items-center justify-center rounded-xl border-2 border-primary/30 bg-card text-2xl font-bold text-foreground shadow-neo">
            {year ?? '----'}
          </div>
          <p className="mt-1 text-center text-[10px] text-muted-foreground">년생</p>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>

      {/* Fine-grained year row */}
      {year !== null && (
        <div className="flex justify-center gap-1 pt-1">
          {Array.from({ length: 5 }, (_, i) => year - 2 + i)
            .filter((y) => y >= MIN_YEAR && y <= MAX_YEAR)
            .map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => onChange(String(y))}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                  y === year
                    ? 'bg-primary text-primary-foreground shadow-neo'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {y}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
