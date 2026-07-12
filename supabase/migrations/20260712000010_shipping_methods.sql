create table if not exists public.shipping_methods (
  id uuid primary key default uuid_generate_v4(),
  method_id text not null unique,
  label text not null,
  description text,
  cost numeric(10,2) not null default 0,
  estimated_days text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_shipping_methods_active on public.shipping_methods(is_active, display_order);

alter table public.shipping_methods enable row level security;

create policy "Anyone can view shipping methods"
  on public.shipping_methods for select
  using (true);

create policy "Service role full access on shipping_methods"
  on public.shipping_methods for all
  using (auth.role() = 'service_role');

create trigger set_updated_at before update on public.shipping_methods
  for each row execute function public.handle_updated_at();

insert into public.shipping_methods (method_id, label, description, cost, estimated_days, display_order) values
  ('standard', 'Standard Shipping', 'Reliable delivery at no extra cost', 0, '5-7 business days', 1),
  ('express', 'Express Shipping', 'Faster delivery for urgent orders', 14.99, '2-3 business days', 2),
  ('priority', 'Priority Shipping', 'Next-business-day delivery', 29.99, '1-2 business days', 3),
  ('pickup', 'Local Pickup', 'Free pickup at our warehouse (ready in 2hrs)', 0, 'Same day', 4)
on conflict (method_id) do nothing;
