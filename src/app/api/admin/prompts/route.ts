import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const moduleType = searchParams.get('moduleType');

  const supabase = await createClient();

  if (moduleType) {
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('module_type', moduleType)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from('prompt_templates')
    .select('*')
    .order('module_type');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const { moduleType, systemPrompt, userPromptTemplate } = body;

  if (!moduleType || !systemPrompt || !userPromptTemplate) {
    return NextResponse.json(
      { error: 'moduleType, systemPrompt, userPromptTemplate are required' },
      { status: 400 }
    );
  }

  if (!['report', 'compatibility'].includes(moduleType)) {
    return NextResponse.json({ error: 'Invalid moduleType' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prompt_templates')
    .upsert(
      {
        module_type: moduleType,
        system_prompt: systemPrompt,
        user_prompt_template: userPromptTemplate,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'module_type' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const moduleType = searchParams.get('moduleType');

  if (!moduleType) {
    return NextResponse.json({ error: 'moduleType is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('prompt_templates')
    .delete()
    .eq('module_type', moduleType);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
