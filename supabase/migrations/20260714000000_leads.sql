create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  company text,
  status text not null default 'new',
  source text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_at on public.leads(created_at desc);

alter table public.leads enable row level security;

create policy "Public read"
  on public.leads for select using (true);

create policy "Service role full access"
  on public.leads for all using (auth.role() = 'service_role');

create trigger set_updated_at before update on public.leads
  for each row execute function public.handle_updated_at();
