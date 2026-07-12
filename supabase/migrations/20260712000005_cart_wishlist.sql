create table if not exists public.carts (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  status text not null default 'active',
  coupon_code text,
  discount numeric(10,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_carts_user on public.carts(user_id, status);

create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists idx_cart_items_cart on public.cart_items(cart_id);

create table if not exists public.wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default uuid_generate_v4(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_wishlist_items_wishlist on public.wishlist_items(wishlist_id);

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;

-- Service role: full access (all cart/wishlist operations go through server API routes)
create policy "Service role full access on carts"
  on public.carts for all
  using (auth.role() = 'service_role');
create policy "Service role full access on cart_items"
  on public.cart_items for all
  using (auth.role() = 'service_role');
create policy "Service role full access on wishlists"
  on public.wishlists for all
  using (auth.role() = 'service_role');
create policy "Service role full access on wishlist_items"
  on public.wishlist_items for all
  using (auth.role() = 'service_role');

create trigger set_updated_at before update on public.carts
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.wishlists
  for each row execute function public.handle_updated_at();
