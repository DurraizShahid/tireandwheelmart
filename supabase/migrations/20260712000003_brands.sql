create table if not exists public.brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  image_url text,
  website_url text,
  description text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_brands_active_order on public.brands(is_active, display_order);

alter table public.brands enable row level security;

-- Public: read all brands (admin pages need access to inactive ones too)
create policy "Brands are viewable by everyone"
  on public.brands for select
  using (true);

-- Service role: full access
create policy "Service role full access on brands"
  on public.brands for all
  using (auth.role() = 'service_role');

create trigger set_updated_at before update on public.brands
  for each row execute function public.handle_updated_at();
