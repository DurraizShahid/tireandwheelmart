create table if not exists public.faqs (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  question text not null,
  answer text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_faqs_category_order on public.faqs(category, display_order);

alter table public.faqs enable row level security;

create policy "Anyone can view faqs"
  on public.faqs for select
  using (true);

create policy "Service role full access on faqs"
  on public.faqs for all
  using (auth.role() = 'service_role');

create trigger set_updated_at before update on public.faqs
  for each row execute function public.handle_updated_at();

insert into public.faqs (category, question, answer, display_order) values
  ('Tire Selection', 'How do I choose the right tire for my vehicle?', 'The right tire depends on your vehicle type, driving habits, and local climate. All-season tires work well for most drivers, while winter tires are essential for cold climates. Performance tires are ideal for sports cars. Check your vehicle''s owner''s manual for recommended tire sizes and specifications.', 1),
  ('Tire Selection', 'What''s the difference between all-season, summer, and winter tires?', 'All-season tires provide balanced performance year-round but may not excel in extreme conditions. Summer tires offer superior dry and wet traction in warm weather but shouldn''t be used in freezing temperatures. Winter tires use special rubber compounds and tread patterns designed for snow, ice, and cold weather traction.', 2),
  ('Tire Selection', 'How often should I replace my tires?', 'Tires should typically be replaced every 6 years or when tread depth reaches 2/32 of an inch (check local regulations). However, driving conditions, maintenance, and tire quality can affect lifespan. Regular inspections are recommended.', 3),
  ('Tire Selection', 'Can I mix different tire brands or models?', 'While it''s possible, it''s not recommended. Different tire models have varying performance characteristics, which can affect handling, braking, and stability. For best results, use matching tires on all four wheels, or at least matching pairs on each axle.', 4),
  ('Wheel Selection', 'How do I know what size wheels fit my vehicle?', 'Check your vehicle''s owner''s manual or the tire placard on the driver''s door jamb for the original wheel size. When upgrading, ensure the new wheels match your vehicle''s bolt pattern, offset, center bore, and load capacity. Our team can help you find compatible wheels.', 1),
  ('Wheel Selection', 'What''s the difference between alloy and steel wheels?', 'Alloy wheels are lighter, offer better heat dissipation, and provide more aesthetic options. Steel wheels are more durable, less expensive, and often preferred for winter use. Both have their advantages depending on your needs and budget.', 2),
  ('Wheel Selection', 'Can I install larger wheels on my vehicle?', 'Yes, but you need to maintain the overall tire diameter to keep your speedometer accurate. Larger wheels typically require lower-profile tires. Always ensure proper clearance and that the wheels meet your vehicle''s load requirements.', 3),
  ('Installation & Services', 'Do you offer tire installation services?', 'Yes! We offer professional tire mounting and balancing services. Our certified technicians use state-of-the-art equipment to ensure proper installation. Contact us to schedule an appointment.', 1),
  ('Installation & Services', 'How long does tire installation take?', 'Standard tire installation typically takes 30-60 minutes for a set of four tires, depending on the vehicle and whether wheel alignment is included. We''ll provide an estimated time when you schedule your appointment.', 2),
  ('Installation & Services', 'Do you offer wheel alignment services?', 'Yes, we provide wheel alignment services to ensure your vehicle tracks properly and tires wear evenly. We recommend alignment when installing new tires or if you notice uneven tire wear or pulling.', 3),
  ('Shipping & Returns', 'How long does shipping take?', 'Shipping times vary by location and product availability. Most orders ship within 1-2 business days, with delivery typically taking 3-7 business days. Express shipping options are available for faster delivery.', 1),
  ('Shipping & Returns', 'What is your return policy?', 'We offer a 30-day return policy on unused tires and wheels in original packaging. Items must be in new, unused condition. Please see our Returns & Refunds page for complete details and return procedures.', 2),
  ('Shipping & Returns', 'Do you ship internationally?', 'Currently, we ship within the United States. For international shipping inquiries, please contact our customer service team to discuss options.', 3),
  ('Warranty & Support', 'Do tires come with a warranty?', 'Yes, most tires come with manufacturer warranties covering defects and tread wear. Warranty terms vary by manufacturer and tire model. We''ll provide warranty information with your purchase.', 1),
  ('Warranty & Support', 'What if I have issues with my purchase?', 'Contact our customer service team immediately. We''re committed to resolving any issues quickly and ensuring your satisfaction. You can reach us by phone, email, or through our contact form.', 2),
  ('Warranty & Support', 'Do you offer price matching?', 'Yes, we offer competitive pricing and will match prices from authorized dealers on identical in-stock items. Contact us with the competitor''s price and we''ll review your request.', 3),
  ('Warranty & Support', 'What payment methods do you accept?', 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and secure online payments. Financing options may also be available for qualified buyers.', 4)
on conflict do nothing;
