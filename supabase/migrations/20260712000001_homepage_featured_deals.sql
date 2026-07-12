-- =============================================
-- Homepage Featured Deals
-- Adds columns to promotions table to control
-- which deals appear on the homepage and their
-- display order.
-- =============================================

alter table public.promotions
  add column if not exists show_on_homepage boolean not null default false,
  add column if not exists homepage_order integer not null default 0;

create index if not exists idx_promotions_homepage on public.promotions(show_on_homepage, homepage_order)
  where show_on_homepage = true;
