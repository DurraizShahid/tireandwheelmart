create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  author text not null,
  role text,
  company text,
  avatar_url text,
  content text not null,
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  display_order integer not null default 0,
  is_approved boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_testimonials_active_approved on public.testimonials(is_active, is_approved, display_order);

alter table public.testimonials enable row level security;

-- Public: read all testimonials (admin pages need access to unapproved ones too)
create policy "Testimonials are viewable by everyone"
  on public.testimonials for select
  using (true);

-- Service role: full access
create policy "Service role full access on testimonials"
  on public.testimonials for all
  using (auth.role() = 'service_role');

create trigger set_updated_at before update on public.testimonials
  for each row execute function public.handle_updated_at();
