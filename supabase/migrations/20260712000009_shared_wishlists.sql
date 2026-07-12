create table if not exists public.shared_wishlists (
  id uuid primary key default uuid_generate_v4(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  token text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_shared_wishlists_token on public.shared_wishlists(token);

alter table public.shared_wishlists enable row level security;

create policy "Anyone can view shared wishlists"
  on public.shared_wishlists for select
  using (true);

create policy "Service role full access on shared_wishlists"
  on public.shared_wishlists for all
  using (auth.role() = 'service_role');
