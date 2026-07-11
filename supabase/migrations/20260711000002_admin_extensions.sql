-- =============================================
-- Admin Management Extensions
-- Adds missing columns and tables needed for
-- full admin CRUD of storefront content.
-- =============================================

-- =============================================
-- PRODUCTS: Add missing columns
-- =============================================
alter table public.products
  add column if not exists tags text[] default '{}',
  add column if not exists is_new boolean not null default false,
  add column if not exists is_best_seller boolean not null default false,
  add column if not exists rating numeric(3,2) default 0,
  add column if not exists review_count integer default 0;

create index if not exists idx_products_tags on public.products using gin(tags);
create index if not exists idx_products_is_new on public.products(is_new);
create index if not exists idx_products_is_best_seller on public.products(is_best_seller);

-- =============================================
-- CATEGORIES: Add content management columns
-- =============================================
alter table public.categories
  add column if not exists hero_image text,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists content jsonb default '{}';

comment on column public.categories.content is 'JSON object containing: buying_guide, faq, featured_brands, related_categories, seo_content';

-- =============================================
-- PROMOTIONS TABLE
-- =============================================
create table if not exists public.promotions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  type text not null check (type in (
    'percentage', 'fixed', 'bundle_tires', 'bundle',
    'free_shipping', 'category', 'brand', 'product',
    'flash_sale', 'clearance', 'first_order'
  )),
  value numeric(10,2) not null,
  min_subtotal numeric(10,2),
  min_quantity integer,
  category_slug text,
  brand_name text,
  product_id uuid references public.products(id) on delete set null,
  start_date timestamptz,
  end_date timestamptz,
  stackable boolean not null default true,
  priority integer not null default 0,
  badge_text text,
  badge_color text,
  banner_image text,
  banner_bg text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_promotions_type on public.promotions(type);
create index if not exists idx_promotions_active on public.promotions(is_active) where is_active = true;
create index if not exists idx_promotions_dates on public.promotions(start_date, end_date);

-- Updated at trigger for promotions
create trigger set_updated_at before update on public.promotions
  for each row execute function public.handle_updated_at();

-- RLS
alter table public.promotions enable row level security;

-- Promotions: public read (so storefront can display them)
create policy "Promotions are viewable by everyone"
  on public.promotions for select
  using (true);

-- Promotions: service role full access
create policy "Service role full access on promotions"
  on public.promotions for all
  using (auth.role() = 'service_role');
