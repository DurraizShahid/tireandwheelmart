-- Enhance leads table with additional fields
alter table public.leads add column if not exists assigned_to text;
alter table public.leads add column if not exists priority text not null default 'medium';
alter table public.leads add column if not exists tags text[] not null default '{}';
alter table public.leads add column if not exists last_contacted_at timestamptz;
alter table public.leads add column if not exists next_follow_up_at timestamptz;
alter table public.leads add column if not exists converted_to_customer_id uuid references public.customers(id) on delete set null;
alter table public.leads add column if not exists converted_at timestamptz;
alter table public.leads add column if not exists deleted_at timestamptz;

drop index if exists idx_leads_status;
drop index if exists idx_leads_created_at;
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_source on public.leads(source);
create index if not exists idx_leads_priority on public.leads(priority);
create index if not exists idx_leads_assigned_to on public.leads(assigned_to);
create index if not exists idx_leads_next_follow_up on public.leads(next_follow_up_at);
create index if not exists idx_leads_deleted_at on public.leads(deleted_at);
create index if not exists idx_leads_is_active on public.leads(is_active);

-- Lead activities timeline
create table if not exists public.lead_activities (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  type text not null,
  description text not null,
  metadata jsonb not null default '{}',
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lead_activities_lead on public.lead_activities(lead_id);
create index if not exists idx_lead_activities_created on public.lead_activities(created_at desc);

-- Lead call records
create table if not exists public.lead_calls (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  status text not null default 'scheduled',
  duration_seconds integer not null default 0,
  outcome text,
  summary text,
  transcript jsonb,
  conversation jsonb,
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lead_calls_lead on public.lead_calls(lead_id);
create index if not exists idx_lead_calls_status on public.lead_calls(status);

-- Lead linked vehicles
create table if not exists public.lead_vehicles (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  make text not null,
  model text not null,
  year integer,
  vin text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lead_vehicles_lead on public.lead_vehicles(lead_id);

-- Lead notifications queue
create table if not exists public.lead_notifications (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  channel text not null default 'internal',
  status text not null default 'pending',
  read boolean not null default false,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists idx_lead_notifications_lead on public.lead_notifications(lead_id);
create index if not exists idx_lead_notifications_status on public.lead_notifications(status);

alter table public.lead_activities enable row level security;
alter table public.lead_calls enable row level security;
alter table public.lead_vehicles enable row level security;
alter table public.lead_notifications enable row level security;

create policy "Service role full access on lead_activities"
  on public.lead_activities for all using (auth.role() = 'service_role');

create policy "Service role full access on lead_calls"
  on public.lead_calls for all using (auth.role() = 'service_role');

create policy "Service role full access on lead_vehicles"
  on public.lead_vehicles for all using (auth.role() = 'service_role');

create policy "Service role full access on lead_notifications"
  on public.lead_notifications for all using (auth.role() = 'service_role');
