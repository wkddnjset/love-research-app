'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, MessageSquareHeart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Question {
  id: string;
  question: string;
  keyword: string;
  scheduled_date: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminDailyQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [open, setOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestions = async () => {
    const res = await fetch('/api/admin/daily-questions');
    if (res.ok) {
      setQuestions(await res.json());
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async () => {
    if (!newQuestion.trim() || !newKeyword.trim()) {
      toast.error('질문과 키워드를 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/daily-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQuestion.trim(),
          keyword: newKeyword.trim(),
          scheduledDate: newDate || null,
        }),
      });

      if (!res.ok) throw new Error('Failed');

      toast.success('질문이 등록되었습니다');
      setNewQuestion('');
      setNewKeyword('');
      setNewDate('');
      setOpen(false);
      fetchQuestions();
    } catch {
      toast.error('등록에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/daily-questions?id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      toast.success('삭제되었습니다');
      fetchQuestions();
    } else {
      toast.error('삭제에 실패했습니다');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">데일리 질문 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            매일 유저에게 표시되는 연애 질문을 관리합니다
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="shadow-neo hover-neo h-10 px-5">
          <Plus className="mr-2 h-4 w-4" aria-hidden />
          질문 추가
        </Button>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card className="border border-border shadow-neo">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquareHeart className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
              <p className="font-semibold text-foreground">등록된 질문이 없습니다</p>
              <p className="mt-1 text-sm text-muted-foreground">첫 질문을 추가해보세요</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <Card key={q.id} className="border border-border shadow-neo overflow-hidden rounded-lg p-0">
                <CardContent className="flex items-start justify-between gap-6 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">#{q.keyword}</Badge>
                      {q.scheduled_date && (
                        <Badge variant="secondary" className="text-xs">{q.scheduled_date}</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{q.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                      {new Date(q.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive shrink-0 h-9 px-3"
                    onClick={() => handleDelete(q.id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>데일리 질문 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>키워드 *</Label>
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="예: 이상형, 첫사랑, 연락"
              />
            </div>
            <div className="space-y-2">
              <Label>질문 *</Label>
              <Textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="예: 연인에게 가장 중요하게 생각하는 가치는 무엇인가요?"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>예약 날짜 (선택)</Label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">비워두면 랜덤으로 표시됩니다</p>
            </div>
            <Button
              onClick={handleAdd}
              disabled={isSubmitting}
              className="w-full shadow-neo hover-neo"
            >
              {isSubmitting ? '등록 중...' : '질문 등록'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
