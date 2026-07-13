-- Seed data for brands
insert into public.brands (name, slug, image_url, website_url, description, display_order, is_active) values
  ('Michelin', 'michelin', '/brands/logo_michelin.png', 'https://www.michelinman.com', 'Premium tire manufacturer known for innovation and quality', 1, true),
  ('Bridgestone', 'bridgestone', '/brands/logo_bridgestone.png', 'https://www.bridgestonetire.com', 'World''s largest tire and rubber manufacturer', 2, true),
  ('Continental', 'continental', '/brands/logo_continental.png', 'https://www.continentaltire.com', 'German engineering excellence in tire technology', 3, true),
  ('Toyo', 'toyo', '/brands/logo_toyo.png', 'https://www.toyotires.com', 'Performance tires trusted by enthusiasts worldwide', 4, true),
  ('Cooper', 'cooper', '/brands/logo_cooper.png', 'https://www.coopertire.com', 'American-made tires with over 100 years of heritage', 5, true),
  ('Firestone', 'firestone', '/brands/logo_firestone.png', 'https://www.firestonecompleteautocare.com', 'Trusted American brand since 1900', 6, true),
  ('Hercules', 'hercules', '/brands/logo_hercules.png', 'https://www.herculestire.com', 'Value-driven tires with performance pedigree', 7, true)
on conflict (slug) do nothing;

-- Seed data for testimonials
insert into public.testimonials (author, role, company, avatar_url, content, rating, display_order, is_approved, is_active) values
  ('Sarah Johnson', 'Fleet Manager', 'Johnson Logistics', 'https://api.dicebear.com/7.x/initials/svg?seed=SJ', 'Outstanding service and fast delivery. We outfit our entire fleet of 50+ trucks with tires from Tire&Wheel Mart and couldn''t be happier with the quality and pricing.', 0, 1, true, true),
  ('Mike Rodriguez', 'Automotive Technician', 'Rodriguez Auto Shop', 'https://api.dicebear.com/7.x/initials/svg?seed=MR', 'I recommend Tire&Wheel Mart to all my customers. The product selection is unmatched and their customer support team really knows tires.', 0, 2, true, true),
  ('Emily Chen', 'Retail Customer', '', 'https://api.dicebear.com/7.x/initials/svg?seed=EC', 'Found the perfect set of winter tires at an incredible price. Installation was smooth and the team was incredibly helpful throughout the process.', 0, 3, true, true),
  ('James Thompson', 'Store Owner', 'Thompson Automotive', 'https://api.dicebear.com/7.x/initials/svg?seed=JT', 'Reliable supplier with consistent quality. Their wholesale program has been a game changer for our business. Fast shipping and great communication.', 0, 4, true, true),
  ('David Lee', 'Happy Customer', '', 'https://api.dicebear.com/7.x/initials/svg?seed=DL', 'Best tire shopping experience online. The fitment guide made it easy to find exactly what I needed for my vehicle. Highly recommended!', 0, 5, true, true),
  ('Lisa Martinez', 'Fleet Director', 'Martinez Transportation', 'https://api.dicebear.com/7.x/initials/svg?seed=LM', 'We''ve been sourcing all our fleet tires through Tire&Wheel Mart for 3 years. The durability and value are exceptional.', 0, 6, true, true),
  ('Robert Kim', 'Auto Enthusiast', '', 'https://api.dicebear.com/7.x/initials/svg?seed=RK', 'Amazing selection of performance tires. Got my Michelin Pilot Sport 4S delivered in 2 days. Will definitely order again.', 0, 7, true, true),
  ('Amanda Foster', 'Service Manager', 'Foster Tire & Auto', 'https://api.dicebear.com/7.x/initials/svg?seed=AF', 'Their wholesale pricing and bulk ordering make Tire&Wheel Mart our go-to supplier. Professional service every time.', 0, 8, true, true)
on conflict do nothing;

-- Add homepage_category column to categories table
alter table public.categories add column if not exists homepage_category boolean not null default false;
alter table public.categories add column if not exists homepage_description text;

-- Seed homepage categories
update public.categories set
  homepage_category = true,
  homepage_description = description
where slug in ('all-season', 'summer', 'winter', 'performance', 'alloy-wheels', 'steel-wheels');
