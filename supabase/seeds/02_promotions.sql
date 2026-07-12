-- =============================================
-- Promotions Seed Data
-- =============================================

INSERT INTO public.promotions (id, name, description, type, value, min_subtotal, stackable, priority, badge_text, badge_color, is_active, show_on_homepage, homepage_order) VALUES

  ('c1000000-0000-0000-0000-000000000001',
   'Buy 4 Tires, Save $100', 'Save $100 when you purchase 4 or more tires',
   'bundle_tires', 100, null, true, 10, 'Buy 4 Save $100', 'bg-blue-600', true, true, 1),

  ('c1000000-0000-0000-0000-000000000002',
   'Free Shipping', 'Free shipping on orders over $200',
   'free_shipping', 0, 200, true, 1, 'Free Shipping', 'bg-green-600', true, true, 2),

  ('c1000000-0000-0000-0000-000000000003',
   'Winter Tire Sale', '20% off all winter tires',
   'category', 20, null, false, 5, 'Winter Sale', 'bg-sky-600', true, true, 3),

  ('c1000000-0000-0000-0000-000000000004',
   'Summer Tire Event', '15% off all summer tires',
   'category', 15, null, false, 5, 'Summer Event', 'bg-orange-600', true, true, 4),

  ('c1000000-0000-0000-0000-000000000005',
   'Wheel Clearance', '25% off all alloy wheels',
   'category', 25, null, false, 5, 'Clearance', 'bg-red-600', true, false, 0),

  ('c1000000-0000-0000-0000-000000000006',
   'Michelin Manufacturer Offer', '10% off Michelin tires',
   'brand', 10, null, true, 8, 'Manufacturer Offer', 'bg-purple-600', true, false, 0),

  ('c1000000-0000-0000-0000-000000000007',
   'Accessory Bundle & Save', 'Save 15% on wheel & tire accessory bundles',
   'category', 15, null, false, 5, 'Bundle & Save', 'bg-amber-600', true, false, 0),

  ('c1000000-0000-0000-0000-000000000008',
   'Flash Sale: 20% Off', '20% off your entire purchase — limited time!',
   'flash_sale', 20, 100, false, 3, 'Limited Time', 'bg-red-500', true, false, 0),

  ('c1000000-0000-0000-0000-000000000009',
   'Clearance: Up to 30% Off', '30% off clearance-eligible items',
   'clearance', 30, null, true, 15, 'Clearance', 'bg-red-700', true, false, 0),

  ('c1000000-0000-0000-0000-000000000010',
   'Winter Package Deal', 'Save $200 on winter tire & wheel packages',
   'category', 200, null, false, 4, 'Package Deal', 'bg-indigo-600', true, false, 0),

  ('c1000000-0000-0000-0000-000000000011',
   'Steel Wheel Special', '$50 off steel wheel sets',
   'category', 50, null, false, 6, 'Wheel Special', 'bg-teal-600', true, false, 0)
ON CONFLICT (id) DO NOTHING;
