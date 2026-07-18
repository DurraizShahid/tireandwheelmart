-- AI Voice Agent extension
-- Adds tables for AI call logging, monitoring, and configuration

-- AI call sessions (tracks active and historical AI conversations)
create table if not exists public.ai_call_sessions (
  id uuid primary key default uuid_generate_v4(),
  call_sid text,
  lead_id uuid references public.leads(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'pending',
  direction text not null default 'outbound',
  conversation jsonb not null default '[]',
  transcript text,
  summary text,
  outcome text,
  ai_provider text not null default 'openai',
  speech_provider text not null default 'openai',
  model text not null default 'gpt-4o-realtime-preview',
  duration_seconds integer not null default 0,
  token_usage jsonb not null default '{"promptTokens":0,"completionTokens":0,"totalTokens":0,"inputAudioTokens":0,"outputAudioTokens":0,"estimatedCost":0}',
  metadata jsonb not null default '{}',
  error text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_call_sessions_lead on public.ai_call_sessions(lead_id);
create index if not exists idx_ai_call_sessions_status on public.ai_call_sessions(status);
create index if not exists idx_ai_call_sessions_created on public.ai_call_sessions(created_at desc);
create index if not exists idx_ai_call_sessions_call_sid on public.ai_call_sessions(call_sid);

-- AI call logs (audit trail with cost tracking)
create table if not exists public.ai_call_logs (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.ai_call_sessions(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  call_sid text,
  direction text not null,
  duration_seconds integer not null default 0,
  outcome text,
  summary text,
  token_usage jsonb not null default '{}',
  ai_provider text not null,
  speech_provider text not null,
  model text not null,
  status text not null,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_call_logs_lead on public.ai_call_logs(lead_id);
create index if not exists idx_ai_call_logs_created on public.ai_call_logs(created_at desc);

-- AI analytics aggregations (materialized for dashboards)
create table if not exists public.ai_analytics (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  total_calls integer not null default 0,
  total_duration_seconds integer not null default 0,
  total_tokens integer not null default 0,
  total_cost numeric(12,6) not null default 0,
  successful_calls integer not null default 0,
  failed_calls integer not null default 0,
  transferred_calls integer not null default 0,
  voicemails integer not null default 0,
  avg_sentiment numeric(4,2),
  outcomes jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(date)
);

create index if not exists idx_ai_analytics_date on public.ai_analytics(date desc);

-- RLS policies
alter table public.ai_call_sessions enable row level security;
alter table public.ai_call_logs enable row level security;
alter table public.ai_analytics enable row level security;

create policy "Service role full access on ai_call_sessions"
  on public.ai_call_sessions for all using (auth.role() = 'service_role');

create policy "Service role full access on ai_call_logs"
  on public.ai_call_logs for all using (auth.role() = 'service_role');

create policy "Service role full access on ai_analytics"
  on public.ai_analytics for all using (auth.role() = 'service_role');
