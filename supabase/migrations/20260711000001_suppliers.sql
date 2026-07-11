-- =============================================
-- Supplier/Vendor Management
-- =============================================

-- SUPPLIERS table
create table public.suppliers (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null unique,
  business_name text not null,
  business_email text,
  business_phone text,
  commission_rate numeric(5,2) not null default 10.00
    check (commission_rate >= 0 and commission_rate <= 100),
  order_handling text not null default 'admin'
    check (order_handling in ('admin', 'self')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add supplier_id to products
alter table public.products
  add column supplier_id uuid references public.suppliers(id) on delete set null;

create index idx_products_supplier on public.products(supplier_id);
create index idx_suppliers_clerk_id on public.suppliers(clerk_user_id);

-- Updated at trigger for suppliers
create trigger set_updated_at before update on public.suppliers
  for each row execute function public.handle_updated_at();

-- RLS
alter table public.suppliers enable row level security;

-- Suppliers: public read (so products can show supplier info)
create policy "Suppliers are viewable by everyone"
  on public.suppliers for select
  using (true);

-- Suppliers: service role full access
create policy "Service role full access on suppliers"
  on public.suppliers for all
  using (auth.role() = 'service_role');
