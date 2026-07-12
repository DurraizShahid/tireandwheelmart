create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_site_settings_key on public.site_settings(key);

insert into public.site_settings (key, value) values
  ('stat_approval', '{"end": 98, "suffix": "%", "label": "of customers approve"}'),
  ('stat_growth', '{"end": "Top 500", "suffix": "", "label": "fastest growing company in US"}'),
  ('stat_installers', '{"end": 20000, "suffix": "+", "label": "certified installers"}'),
  ('stat_distributors', '{"end": 7000, "suffix": "+", "label": "local distributors"}'),
  ('stat_customers', '{"end": 6000000, "suffix": "+", "label": "customers served"}')
on conflict (key) do nothing;

alter table public.site_settings enable row level security;

-- Public: read site settings
create policy "Anyone can view site settings"
  on public.site_settings for select
  using (true);

-- Service role: full access
create policy "Service role full access on site_settings"
  on public.site_settings for all
  using (auth.role() = 'service_role');

create trigger set_updated_at before update on public.site_settings
  for each row execute function public.handle_updated_at();
