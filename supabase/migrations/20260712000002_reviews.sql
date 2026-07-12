create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  author text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text not null,
  content text not null,
  vehicle text,
  tire_size text,
  photos text[] default '{}',
  verified boolean not null default false,
  helpful_count integer not null default 0,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_reviews_approved on public.reviews(is_approved, created_at desc);

alter table public.reviews enable row level security;

-- Public: read all reviews (admin pages need access to unapproved ones too)
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

-- Service role: full access
create policy "Service role full access on reviews"
  on public.reviews for all
  using (auth.role() = 'service_role');

create trigger set_updated_at before update on public.reviews
  for each row execute function public.handle_updated_at();
