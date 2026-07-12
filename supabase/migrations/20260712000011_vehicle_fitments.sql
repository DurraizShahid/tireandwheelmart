create table if not exists public.vehicle_fitments (
  id uuid primary key default uuid_generate_v4(),
  make text not null,
  model text not null,
  year_start integer not null,
  year_end integer not null,
  tire_size text not null,
  bolt_pattern text,
  offset_range text,
  created_at timestamptz not null default now()
);

create index if not exists idx_vehicle_fitments_tire_size on public.vehicle_fitments(tire_size);
create index if not exists idx_vehicle_fitments_make on public.vehicle_fitments(make, model);

alter table public.vehicle_fitments enable row level security;

create policy "Anyone can view vehicle fitments"
  on public.vehicle_fitments for select
  using (true);

create policy "Service role full access on vehicle_fitments"
  on public.vehicle_fitments for all
  using (auth.role() = 'service_role');

-- Sample fitment data for common tire sizes
insert into public.vehicle_fitments (make, model, year_start, year_end, tire_size, bolt_pattern, offset_range) values
  ('BMW', '3 Series', 2019, 2025, '225/45R17', '5x120', '30-45'),
  ('BMW', '3 Series', 2019, 2025, '225/40R18', '5x120', '30-45'),
  ('BMW', '5 Series', 2018, 2025, '245/40R18', '5x120', '25-40'),
  ('BMW', '5 Series', 2018, 2025, '245/35R19', '5x120', '25-40'),
  ('BMW', 'X3', 2018, 2025, '225/60R17', '5x120', '35-50'),
  ('BMW', 'X5', 2019, 2025, '255/50R19', '5x120', '35-50'),
  ('Mercedes-Benz', 'C-Class', 2018, 2025, '225/45R17', '5x112', '30-45'),
  ('Mercedes-Benz', 'C-Class', 2018, 2025, '225/40R18', '5x112', '30-45'),
  ('Mercedes-Benz', 'E-Class', 2017, 2025, '245/40R18', '5x112', '30-45'),
  ('Mercedes-Benz', 'GLC', 2016, 2025, '235/55R18', '5x112', '35-50'),
  ('Audi', 'A3', 2015, 2025, '225/40R18', '5x112', '35-50'),
  ('Audi', 'A4', 2017, 2025, '245/40R18', '5x112', '30-45'),
  ('Audi', 'Q5', 2018, 2025, '235/60R18', '5x112', '30-45'),
  ('Lexus', 'IS', 2014, 2025, '225/40R18', '5x114.3', '35-50'),
  ('Lexus', 'ES', 2019, 2025, '215/55R17', '5x114.3', '35-50'),
  ('Lexus', 'RX', 2016, 2025, '235/55R19', '5x114.3', '30-45'),
  ('Acura', 'TLX', 2015, 2025, '225/50R17', '5x114.3', '35-50'),
  ('Acura', 'MDX', 2014, 2025, '255/50R19', '5x114.3', '35-50'),
  ('Porsche', '911', 2012, 2025, '235/40R18', '5x130', '40-55'),
  ('Porsche', 'Cayenne', 2018, 2025, '255/55R18', '5x130', '30-45'),
  ('Volkswagen', 'Golf GTI', 2015, 2025, '225/40R18', '5x112', '35-50'),
  ('Volkswagen', 'Jetta', 2019, 2025, '205/55R16', '5x112', '35-50'),
  ('Volkswagen', 'Tiguan', 2018, 2025, '215/65R16', '5x112', '30-45'),
  ('Toyota', 'Camry', 2018, 2025, '215/55R17', '5x114.3', '35-50'),
  ('Toyota', 'Corolla', 2020, 2025, '205/55R16', '5x114.3', '35-50'),
  ('Toyota', 'RAV4', 2019, 2025, '225/60R17', '5x114.3', '30-45'),
  ('Toyota', 'Tacoma', 2016, 2025, '265/70R16', '6x139.7', '0-25'),
  ('Honda', 'Accord', 2018, 2025, '225/50R17', '5x114.3', '35-50'),
  ('Honda', 'Civic', 2016, 2025, '235/40R18', '5x114.3', '35-50'),
  ('Honda', 'CR-V', 2017, 2025, '235/65R17', '5x114.3', '30-45'),
  ('Ford', 'Mustang', 2015, 2025, '255/40R19', '5x114.3', '20-35'),
  ('Ford', 'F-150', 2015, 2025, '275/65R18', '6x135', '0-20'),
  ('Ford', 'Explorer', 2020, 2025, '255/65R18', '5x114.3', '30-45'),
  ('Chevrolet', 'Silverado', 2014, 2025, '275/65R18', '6x139.7', '0-25'),
  ('Chevrolet', 'Camaro', 2016, 2025, '245/40R20', '5x120.65', '15-35'),
  ('Nissan', 'Altima', 2019, 2025, '215/55R17', '5x114.3', '35-50'),
  ('Nissan', 'Rogue', 2014, 2025, '225/65R17', '5x114.3', '30-45'),
  ('Hyundai', 'Sonata', 2020, 2025, '215/55R17', '5x114.3', '35-50'),
  ('Hyundai', 'Tucson', 2020, 2025, '225/60R17', '5x114.3', '30-45'),
  ('Subaru', 'Outback', 2015, 2025, '225/65R17', '5x100', '35-50'),
  ('Subaru', 'WRX', 2015, 2025, '245/40R18', '5x114.3', '35-50')
on conflict do nothing;
