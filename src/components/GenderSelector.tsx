'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const GENDER_OPTIONS = [
  { value: 'male', label: '남성', icon: '♂' },
  { value: 'female', label: '여성', icon: '♀' },
  { value: 'other', label: '기타', icon: '⚧' },
] as const;

interface GenderSelectorProps {
  value: string;
  onChange: (gender: string) => void;
}

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>성별</Label>
      <div className="grid grid-cols-3 gap-2">
        {GENDER_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl border-2 py-3 transition-all',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary shadow-neo'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              <span className="text-lg">{option.icon}</span>
              <span className="text-sm font-bold">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
