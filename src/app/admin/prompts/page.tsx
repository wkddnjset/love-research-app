'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, RotateCcw, FileText, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  REPORT_SYSTEM_PROMPT,
  REPORT_USER_PROMPT_TEMPLATE,
} from '@/features/analysis/prompts/report';
import {
  COMPATIBILITY_SYSTEM_PROMPT,
  COMPATIBILITY_USER_PROMPT_TEMPLATE,
} from '@/features/analysis/prompts/compatibility';

type ModuleType = 'report' | 'compatibility';

interface ModuleConfig {
  label: string;
  defaultSystem: string;
  defaultUser: string;
  variables: { name: string; description: string }[];
  outputFormat: string;
}

const MODULE_CONFIGS: Record<ModuleType, ModuleConfig> = {
  report: {
    label: '연애성향 분석',
    defaultSystem: REPORT_SYSTEM_PROMPT,
    defaultUser: REPORT_USER_PROMPT_TEMPLATE,
    variables: [
      { name: 'mbti', description: '사용자의 MBTI (미입력 시 "미입력")' },
      { name: 'exPartnerCount', description: '전 애인 수' },
      { name: 'exSummary', description: '전 애인 정보 요약 (MBTI, 이별사유, 갈등유형 등)' },
      { name: 'dailySummary', description: '최근 7일 데일리 질문 답변 요약' },
    ],
    outputFormat: `{
  "loveType": "연애 유형 이름",
  "emotionalDependency": 0~100,
  "obsessionIndex": 0~100,
  "avoidanceIndex": 0~100,
  "longTermCompatibility": 0~100,
  "idealTypeRecommendation": "이상형 추천",
  "summary": "종합 분석 요약"
}`,
  },
  compatibility: {
    label: '궁합 분석',
    defaultSystem: COMPATIBILITY_SYSTEM_PROMPT,
    defaultUser: COMPATIBILITY_USER_PROMPT_TEMPLATE,
    variables: [
      { name: 'myMbti', description: '유저 A의 MBTI' },
      { name: 'myGender', description: '유저 A의 성별' },
      { name: 'myLoveStyle', description: '유저 A의 연애 스타일' },
      { name: 'myExData', description: '유저 A의 과거 연애 데이터' },
      { name: 'partnerMbti', description: '유저 B의 MBTI' },
      { name: 'partnerGender', description: '유저 B의 성별' },
      { name: 'partnerLoveStyle', description: '유저 B의 연애 스타일' },
      { name: 'partnerExData', description: '유저 B의 과거 연애 데이터' },
    ],
    outputFormat: `{
  "score": 0~100,
  "strengths": ["강점1", "강점2", "강점3"],
  "weaknesses": ["약점1", "약점2"],
  "cautions": ["주의할 점1", "주의할 점2"],
  "advice": "구체적인 조언"
}`,
  },
};

export default function AdminPromptsPage() {
  const [activeTab, setActiveTab] = useState<ModuleType>('report');
  const [systemPrompts, setSystemPrompts] = useState<Record<ModuleType, string>>({
    report: REPORT_SYSTEM_PROMPT,
    compatibility: COMPATIBILITY_SYSTEM_PROMPT,
  });
  const [userPrompts, setUserPrompts] = useState<Record<ModuleType, string>>({
    report: REPORT_USER_PROMPT_TEMPLATE,
    compatibility: COMPATIBILITY_USER_PROMPT_TEMPLATE,
  });
  const [isCustom, setIsCustom] = useState<Record<ModuleType, boolean>>({
    report: false,
    compatibility: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchPrompt = useCallback(async (moduleType: ModuleType) => {
    const res = await fetch(`/api/admin/prompts?moduleType=${moduleType}`);
    if (!res.ok) return;
    const data = await res.json();
    if (data) {
      setSystemPrompts((prev) => ({ ...prev, [moduleType]: data.system_prompt }));
      setUserPrompts((prev) => ({ ...prev, [moduleType]: data.user_prompt_template }));
      setIsCustom((prev) => ({ ...prev, [moduleType]: true }));
    } else {
      const config = MODULE_CONFIGS[moduleType];
      setSystemPrompts((prev) => ({ ...prev, [moduleType]: config.defaultSystem }));
      setUserPrompts((prev) => ({ ...prev, [moduleType]: config.defaultUser }));
      setIsCustom((prev) => ({ ...prev, [moduleType]: false }));
    }
  }, []);

  useEffect(() => {
    fetchPrompt('report');
    fetchPrompt('compatibility');
  }, [fetchPrompt]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/prompts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleType: activeTab,
          systemPrompt: systemPrompts[activeTab],
          userPromptTemplate: userPrompts[activeTab],
        }),
      });

      if (!res.ok) throw new Error('Failed');

      setIsCustom((prev) => ({ ...prev, [activeTab]: true }));
      toast.success('프롬프트가 저장되었습니다');
    } catch {
      toast.error('저장에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestore = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/prompts?moduleType=${activeTab}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed');

      const config = MODULE_CONFIGS[activeTab];
      setSystemPrompts((prev) => ({ ...prev, [activeTab]: config.defaultSystem }));
      setUserPrompts((prev) => ({ ...prev, [activeTab]: config.defaultUser }));
      setIsCustom((prev) => ({ ...prev, [activeTab]: false }));
      toast.success('기본값으로 복원되었습니다');
    } catch {
      toast.error('복원에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  const config = MODULE_CONFIGS[activeTab];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">프롬프트 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI 분석 모듈의 시스템 프롬프트와 유저 프롬프트 템플릿을 관리합니다
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ModuleType)}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="report">연애성향 분석</TabsTrigger>
          <TabsTrigger value="compatibility">궁합 분석</TabsTrigger>
        </TabsList>

        {(['report', 'compatibility'] as ModuleType[]).map((moduleType) => (
          <TabsContent key={moduleType} value={moduleType} className="space-y-6">
            {isCustom[moduleType] && (
              <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
                <Info className="h-4 w-4 shrink-0" aria-hidden />
                커스텀 프롬프트가 적용 중입니다. 기본값 복원 버튼으로 되돌릴 수 있습니다.
              </div>
            )}

            {/* 시스템 프롬프트 */}
            <Card className="border border-border shadow-neo">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" aria-hidden />
                  시스템 프롬프트
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  AI의 역할, 응답 형식, JSON 출력 구조를 지시합니다
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={systemPrompts[moduleType]}
                  onChange={(e) =>
                    setSystemPrompts((prev) => ({
                      ...prev,
                      [moduleType]: e.target.value,
                    }))
                  }
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="시스템 프롬프트를 입력하세요..."
                />
              </CardContent>
            </Card>

            {/* 유저 프롬프트 템플릿 */}
            <Card className="border border-border shadow-neo">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" aria-hidden />
                  유저 프롬프트 템플릿
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {'{{변수명}} 형식으로 사용자 데이터가 자동 주입됩니다'}
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={userPrompts[moduleType]}
                  onChange={(e) =>
                    setUserPrompts((prev) => ({
                      ...prev,
                      [moduleType]: e.target.value,
                    }))
                  }
                  className="min-h-[250px] font-mono text-sm"
                  placeholder="유저 프롬프트 템플릿을 입력하세요..."
                />
              </CardContent>
            </Card>

            {/* 데이터 변수 가이드 */}
            <Card className="border border-border shadow-neo">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">사용 가능한 변수</CardTitle>
                <p className="text-xs text-muted-foreground">
                  유저 프롬프트 템플릿에서 사용할 수 있는 데이터 변수 목록
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                          변수명
                        </th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                          설명
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {config.variables.map((v) => (
                        <tr key={v.name} className="border-b border-border last:border-0">
                          <td className="px-4 py-2.5">
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">
                              {`{{${v.name}}}`}
                            </code>
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">{v.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 예상 출력 형식 */}
            <Card className="border border-border shadow-neo">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">예상 출력 형식</CardTitle>
                <p className="text-xs text-muted-foreground">
                  시스템 프롬프트에서 지시한 JSON 응답 형식
                </p>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm text-foreground">
                  {config.outputFormat}
                </pre>
              </CardContent>
            </Card>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="shadow-neo hover-neo"
              >
                <Save className="mr-2 h-4 w-4" aria-hidden />
                {isSaving ? '저장 중...' : '저장'}
              </Button>
              <Button
                variant="outline"
                onClick={handleRestore}
                disabled={isSaving || !isCustom[moduleType]}
              >
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
                기본값 복원
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
