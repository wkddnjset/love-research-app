'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const DIMENSIONS = [
  { left: 'E', right: 'I', leftLabel: '외향', rightLabel: '내향' },
  { left: 'N', right: 'S', leftLabel: '직관', rightLabel: '감각' },
  { left: 'F', right: 'T', leftLabel: '감정', rightLabel: '사고' },
  { left: 'J', right: 'P', leftLabel: '계획', rightLabel: '탐색' },
] as const;

function mbtiToValues(mbti: string): number[] {
  if (!mbti || mbti.length !== 4) return [2, 2, 2, 2];
  return DIMENSIONS.map((dim, i) => {
    const letter = mbti[i].toUpperCase();
    if (letter === dim.left) return 1;
    if (letter === dim.right) return 3;
    return 2;
  });
}

function valuesToMbti(values: number[]): string {
  return DIMENSIONS.map((dim, i) => {
    if (values[i] <= 1) return dim.left;
    if (values[i] >= 3) return dim.right;
    return dim.left;
  }).join('');
}

function getValueLabel(dim: typeof DIMENSIONS[number], val: number): string {
  switch (val) {
    case 0: return `강한 ${dim.left}`;
    case 1: return dim.left;
    case 2: return '중립';
    case 3: return dim.right;
    case 4: return `강한 ${dim.right}`;
    default: return '중립';
  }
}

interface MbtiSliderProps {
  value: string;
  onChange: (mbti: string) => void;
}

export default function MbtiSlider({ value, onChange }: MbtiSliderProps) {
  const [values, setValues] = useState(() => mbtiToValues(value));

  const handleChange = useCallback(
    (dimIndex: number, level: number) => {
      const next = [...values];
      next[dimIndex] = level;
      setValues(next);
      onChange(valuesToMbti(next));
    },
    [values, onChange],
  );

  return (
    <div className="space-y-2">
      <Label>MBTI 성향</Label>
      <p className="text-xs text-muted-foreground">각 성향의 정도를 선택해주세요</p>

      <div className="space-y-5 pt-2">
        {DIMENSIONS.map((dim, di) => {
          const val = values[di];
          // Position percentage for the filled bar (0=0%, 1=25%, 2=50%, 3=75%, 4=100%)
          const pos = val * 25;

          return (
            <div key={dim.left + dim.right} className="rounded-xl border border-border bg-card/50 p-4">
              {/* Dimension labels */}
              <div className="mb-3 flex items-center justify-between">
                <span className={cn(
                  'flex items-center gap-1.5 text-sm font-bold transition-colors',
                  val <= 1 ? 'text-primary' : 'text-muted-foreground',
                )}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-xs font-bold">
                    {dim.left}
                  </span>
                  {dim.leftLabel}
                </span>
                <span className={cn(
                  'flex items-center gap-1.5 text-sm font-bold transition-colors',
                  val >= 3 ? 'text-primary' : 'text-muted-foreground',
                )}>
                  {dim.rightLabel}
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-xs font-bold">
                    {dim.right}
                  </span>
                </span>
              </div>

              {/* Track */}
              <div className="relative mx-1 flex h-10 items-center">
                {/* Background track line */}
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />

                {/* Filled bar from center to selected position */}
                <div
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary/40 transition-all duration-200"
                  style={{
                    left: `${Math.min(pos, 50)}%`,
                    right: `${100 - Math.max(pos, 50)}%`,
                  }}
                />

                {/* 5 dot buttons - each in a fixed-size cell to prevent layout shift */}
                <div className="relative z-10 flex w-full items-center justify-between">
                  {[0, 1, 2, 3, 4].map((level) => {
                    const isSelected = val === level;
                    const isCenter = level === 2;

                    return (
                      <div key={level} className="flex h-8 w-8 items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleChange(di, level)}
                          className={cn(
                            'relative flex items-center justify-center rounded-full transition-all duration-200',
                            isSelected
                              ? 'h-8 w-8 border-2 border-primary bg-primary shadow-neo'
                              : isCenter
                                ? 'h-5 w-5 border-2 border-muted-foreground/40 bg-background hover:border-primary/60'
                                : 'h-4 w-4 border-2 border-muted-foreground/30 bg-background hover:border-primary/60',
                          )}
                          aria-label={getValueLabel(dim, level)}
                        >
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Value indicator */}
              <p className="mt-2 text-center text-xs font-semibold text-primary">
                {getValueLabel(dim, val)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Result badge */}
      <div className="flex items-center justify-center pt-2">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-bold text-primary shadow-neo">
          {valuesToMbti(values)}
        </span>
      </div>
    </div>
  );
}
