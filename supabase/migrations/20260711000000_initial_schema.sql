-- =============================================
-- Tire & Wheel Mart - Initial Schema
-- Auth is handled by Clerk (not Supabase Auth)
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- CATEGORIES
-- =============================================
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================
-- PRODUCTS
-- =============================================
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  sku text unique,
  image_url text not null,
  images text[] default '{}',
  category_id uuid not null references public.categories(id) on delete restrict,
  brand text,
  in_stock boolean not null default true,
  stock_quantity integer not null default 0,
  featured boolean not null default false,
  specs jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================
-- CUSTOMERS (linked to Clerk, not Supabase Auth)
-- =============================================
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null unique,
  email text not null,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================
-- ADDRESSES
-- =============================================
create table public.addresses (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  label text not null default 'default',
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================
-- ORDERS
-- =============================================
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal numeric(10,2) not null,
  tax numeric(10,2) not null default 0,
  shipping_cost numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  shipping_address_id uuid references public.addresses(id) on delete set null,
  billing_address_id uuid references public.addresses(id) on delete set null,
  notes text,
  tracking_number text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================
-- ORDER ITEMS
-- =============================================
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- =============================================
-- INDEXES
-- =============================================
create index idx_products_category on public.products(category_id);
create index idx_products_slug on public.products(slug);
create index idx_products_featured on public.products(featured) where featured = true;
create index idx_customers_clerk_id on public.customers(clerk_user_id);
create index idx_addresses_customer on public.addresses(customer_id);
create index idx_orders_customer on public.orders(customer_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order on public.order_items(order_id);
create index idx_order_items_product on public.order_items(product_id);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.categories
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.products
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.customers
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.addresses
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.orders
  for each row execute function public.handle_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Categories: public read
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

-- Products: public read
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

-- Customers: users can only read/update their own data
create policy "Customers can view own profile"
  on public.customers for select
  using (auth.uid()::text = clerk_user_id);

create policy "Customers can update own profile"
  on public.customers for update
  using (auth.uid()::text = clerk_user_id);

-- Addresses: users can manage their own addresses
create policy "Users can view own addresses"
  on public.addresses for select
  using (
    customer_id in (
      select id from public.customers
      where clerk_user_id = auth.uid()::text
    )
  );

create policy "Users can insert own addresses"
  on public.addresses for insert
  with check (
    customer_id in (
      select id from public.customers
      where clerk_user_id = auth.uid()::text
    )
  );

create policy "Users can update own addresses"
  on public.addresses for update
  using (
    customer_id in (
      select id from public.customers
      where clerk_user_id = auth.uid()::text
    )
  );

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (
    customer_id in (
      select id from public.customers
      where clerk_user_id = auth.uid()::text
    )
  );

-- Orders: users can view their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (
    customer_id in (
      select id from public.customers
      where clerk_user_id = auth.uid()::text
    )
  );

-- Order Items: users can view items from their own orders
create policy "Users can view own order items"
  on public.order_items for select
  using (
    order_id in (
      select o.id from public.orders o
      join public.customers c on o.customer_id = c.id
      where c.clerk_user_id = auth.uid()::text
    )
  );

-- Service role policies (for admin/server-side operations)
create policy "Service role full access on categories"
  on public.categories for all
  using (auth.role() = 'service_role');

create policy "Service role full access on products"
  on public.products for all
  using (auth.role() = 'service_role');

create policy "Service role full access on customers"
  on public.customers for all
  using (auth.role() = 'service_role');

create policy "Service role full access on addresses"
  on public.addresses for all
  using (auth.role() = 'service_role');

create policy "Service role full access on orders"
  on public.orders for all
  using (auth.role() = 'service_role');

create policy "Service role full access on order_items"
  on public.order_items for all
  using (auth.role() = 'service_role');
