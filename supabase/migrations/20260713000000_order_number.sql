alter table public.orders add column order_number text;

create index idx_orders_order_number on public.orders(order_number);
