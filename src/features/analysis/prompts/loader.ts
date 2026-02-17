import { createClient } from '@/lib/supabase/server';

interface PromptRow {
  system_prompt: string;
  user_prompt_template: string;
}

export async function getPromptTemplate(moduleType: 'report' | 'compatibility'): Promise<{
  systemPrompt: string;
  userPromptTemplate: string;
} | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('prompt_templates')
    .select('system_prompt, user_prompt_template')
    .eq('module_type', moduleType)
    .single<PromptRow>();

  if (!data) return null;

  return {
    systemPrompt: data.system_prompt,
    userPromptTemplate: data.user_prompt_template,
  };
}

export function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? `{{${key}}}`);
}
