'use client';

import { Card, CardContent } from '@/components/ui/card';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

export default function ResultCard({ title, children, icon }: ResultCardProps) {
  return (
    <Card className="shadow-neo">
      <CardContent className="p-4">
        <h3 className="flex items-center gap-2 font-bold text-foreground">
          {icon && <span>{icon}</span>}
          {title}
        </h3>
        <div className="mt-3 text-sm text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  );
}
