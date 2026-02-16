-- ============================================
-- 사랑연구소 (Love Research Lab) - Initial Schema
-- ============================================

-- 1. user_profiles
create table if not exists user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  mbti text,
  birth_year integer,
  gender text check (gender in ('male', 'female', 'other')),
  love_style text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table user_profiles enable row level security;
create policy "Users can manage own profile" on user_profiles
  for all using (auth.uid() = user_id);

-- 2. ex_partners
create table if not exists ex_partners (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  nickname text not null,
  mbti text,
  personality text,
  conflict_types text[] default '{}',
  breakup_reason text,
  satisfaction_score integer not null check (satisfaction_score between 1 and 10),
  relationship_duration integer,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table ex_partners enable row level security;
create policy "Users can manage own ex_partners" on ex_partners
  for all using (auth.uid() = user_id);

-- 3. current_relationships
create table if not exists current_relationships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  nickname text not null,
  mbti text,
  personality text,
  stage text not null check (stage in ('some', 'dating', 'serious')),
  start_date text,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table current_relationships enable row level security;
create policy "Users can manage own relationships" on current_relationships
  for all using (auth.uid() = user_id);

-- 4. conflict_records
create table if not exists conflict_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  relationship_id uuid references current_relationships(id) on delete cascade not null,
  title text not null,
  description text not null,
  conflict_type text not null,
  severity integer not null check (severity between 1 and 5),
  is_resolved boolean default false not null,
  resolved_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table conflict_records enable row level security;
create policy "Users can manage own conflicts" on conflict_records
  for all using (auth.uid() = user_id);

-- 5. emotion_records
create table if not exists emotion_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  relationship_id uuid references current_relationships(id) on delete set null,
  mood text not null check (mood in ('happy', 'sad', 'angry', 'anxious', 'confused', 'peaceful')),
  score integer not null check (score between 1 and 10),
  content text not null,
  tags text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table emotion_records enable row level security;
create policy "Users can manage own emotions" on emotion_records
  for all using (auth.uid() = user_id);

-- 6. analysis_results
create table if not exists analysis_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  module_type text not null check (module_type in ('compatibility', 'mediator', 'breakup', 'some', 'report')),
  input_data jsonb not null default '{}',
  result jsonb not null default '{}',
  score integer,
  created_at timestamptz default now() not null
);

alter table analysis_results enable row level security;
create policy "Users can manage own analysis_results" on analysis_results
  for all using (auth.uid() = user_id);

-- 7. subscriptions
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  stripe_payment_link_id text,
  stripe_customer_id text,
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  analysis_used_count integer default 0 not null,
  analysis_reset_date timestamptz default now() not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table subscriptions enable row level security;
create policy "Users can read own subscription" on subscriptions
  for select using (auth.uid() = user_id);

-- 8. usage_logs
create table if not exists usage_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  module_type text not null check (module_type in ('compatibility', 'mediator', 'breakup', 'some', 'report')),
  created_at timestamptz default now() not null
);

alter table usage_logs enable row level security;
create policy "Users can manage own usage_logs" on usage_logs
  for all using (auth.uid() = user_id);

-- ============================================
-- updated_at 자동 갱신 트리거
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on user_profiles
  for each row execute function update_updated_at();
create trigger set_updated_at before update on ex_partners
  for each row execute function update_updated_at();
create trigger set_updated_at before update on current_relationships
  for each row execute function update_updated_at();
create trigger set_updated_at before update on conflict_records
  for each row execute function update_updated_at();
create trigger set_updated_at before update on emotion_records
  for each row execute function update_updated_at();
create trigger set_updated_at before update on subscriptions
  for each row execute function update_updated_at();
