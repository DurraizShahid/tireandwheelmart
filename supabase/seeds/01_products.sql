-- =============================================
-- Tire & Wheel Mart - Seed Data
-- =============================================

-- =============================================
-- CATEGORIES
-- =============================================
INSERT INTO public.categories (id, name, slug, description, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'All-Season Tires', 'all-season', 'Year-round tires for reliable performance in various weather conditions', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Summer Tires', 'summer', 'High-performance tires optimized for warm weather and dry/wet roads', 2),
  ('a1000000-0000-0000-0000-000000000003', 'Winter Tires', 'winter', 'Cold-weather tires with specialized rubber compounds and tread patterns', 3),
  ('a1000000-0000-0000-0000-000000000004', 'Performance Tires', 'performance', 'Ultra-high performance tires for maximum grip and handling', 4),
  ('a1000000-0000-0000-0000-000000000005', 'Alloy Wheels', 'alloy-wheels', 'Lightweight aluminum alloy wheels for improved aesthetics and performance', 5),
  ('a1000000-0000-0000-0000-000000000006', 'Steel Wheels', 'steel-wheels', 'Durable steel wheels for winter use and budget-friendly replacements', 6),
  ('a1000000-0000-0000-0000-000000000007', 'Wheel Accessories', 'wheel-accessories', 'Spacers, lug nuts, center caps, and other wheel accessories', 7),
  ('a1000000-0000-0000-0000-000000000008', 'Tire Accessories', 'tire-accessories', 'TPMS, repair kits, inflators, and tire maintenance tools', 8)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- PRODUCTS - All-Season Tires
-- =============================================
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, image_url, category_id, brand, in_stock, stock_quantity, featured, specs) VALUES

-- Michelin CrossClimate2
('b1000000-0000-0000-0000-000000000001',
 'Michelin CrossClimate2', 'michelin-crossclimate2',
 'All-season tire with exceptional wet and dry braking performance. Designed for crossover, SUV, and sedan drivers.',
 250.00, 280.00, 'TIR-MIC-CC2-001',
 '/tires/Michelin CrossClimate2/mi_crossclimate2_suv_full.webp',
 'a1000000-0000-0000-0000-000000000001', 'Michelin', true, 24, false,
 '{"width": 225, "aspect_ratio": 65, "rim_diameter": 17, "load_index": "102", "speed_rating": "H", "tire_type": "Passenger", "season": "All-Season", "runflat": false, "treadwear": 640, "traction": "A", "temperature": "A", "noise_level": "68 dB", "warranty_miles": 60000}'),

-- Continental ExtremeContact
('b1000000-0000-0000-0000-000000000002',
 'Continental ExtremeContact', 'continental-extremecontact',
 'Premium all-season tire with excellent grip and long tread life. Features Continental Comfort Ride Technology.',
 180.00, 210.00, 'TIR-CON-EC-002',
 '/tires/Continental ExtremeContact/conraj_ang_l.jpg',
 'a1000000-0000-0000-0000-000000000001', 'Continental', true, 32, true,
 '{"width": 225, "aspect_ratio": 60, "rim_diameter": 16, "load_index": "98", "speed_rating": "V", "tire_type": "Passenger", "season": "All-Season", "runflat": false, "treadwear": 700, "traction": "A", "temperature": "A", "noise_level": "70 dB", "warranty_miles": 80000}'),

-- Goodyear Assurance WeatherReady
('b1000000-0000-0000-0000-000000000003',
 'Goodyear Assurance WeatherReady', 'goodyear-assurance-weatherready',
 'Weather-ready all-season tire with Weather Reactive technology for confident driving in rain, snow, and sun.',
 200.00, 230.00, 'TIR-GOO-AWR-003',
 '/tires/Goodyear Eagle F1/images.jpg',
 'a1000000-0000-0000-0000-000000000001', 'Goodyear', true, 28, false,
 '{"width": 215, "aspect_ratio": 65, "rim_diameter": 17, "load_index": "99", "speed_rating": "H", "tire_type": "Passenger", "season": "All-Season", "runflat": false, "treadwear": 620, "traction": "A", "temperature": "A", "noise_level": "71 dB", "warranty_miles": 60000}'),

-- Bridgestone Blizzak WS90
('b1000000-0000-0000-0000-000000000004',
 'Bridgestone Blizzak WS90', 'bridgestone-blizzak-ws90',
 'Winter tire with Multi-Cell compound and NanoPro-Tech for superior ice grip and braking.',
 230.00, 260.00, 'TIR-BRI-BSW-004',
 '/tires/Bridgestone Blizzak WS90/bs_blizzak_ws90_full.webp',
 'a1000000-0000-0000-0000-000000000001', 'Bridgestone', true, 20, true,
 '{"width": 225, "aspect_ratio": 60, "rim_diameter": 17, "load_index": "99", "speed_rating": "T", "tire_type": "Passenger", "season": "Winter", "runflat": false, "treadwear": 500, "traction": "B", "temperature": "B", "noise_level": "72 dB", "warranty_miles": 40000}'),

-- Bridgestone Turanza QuietTrack
('b1000000-0000-0000-0000-000000000026',
 'Bridgestone Turanza QuietTrack', 'bridgestone-turanza-quiettrack',
 'Ultra-quiet grand touring tire with adaptive contact patch for a smooth, comfortable ride.',
 270.00, 300.00, 'TIR-BRI-TQT-026',
 '/tires/Bridgestone Blizzak WS90/bs_blizzak_ws90_full.webp',
 'a1000000-0000-0000-0000-000000000001', 'Bridgestone', true, 18, true,
  '{"width": 225, "aspect_ratio": 55, "rim_diameter": 17, "load_index": "97", "speed_rating": "V", "tire_type": "Passenger", "season": "All-Season", "runflat": false, "treadwear": 720, "traction": "A", "temperature": "A", "noise_level": "65 dB", "warranty_miles": 80000}'),

-- Firestone Destination LE3
('b1000000-0000-0000-0000-000000000027',
 'Firestone Destination LE3', 'firestone-destination-le3',
 'All-season highway tire for SUVs and light trucks. Delivers a quiet ride and long tread life.',
 190.00, 220.00, 'TIR-FIR-DEL-027',
 '/tires/Continental ExtremeContact/conraj_ang_l.jpg',
 'a1000000-0000-0000-0000-000000000001', 'Firestone', true, 22, false,
 '{"width": 235, "aspect_ratio": 65, "rim_diameter": 17, "load_index": "104", "speed_rating": "T", "tire_type": "Light Truck", "season": "All-Season", "runflat": false, "treadwear": 680, "traction": "A", "temperature": "A", "noise_level": "73 dB", "warranty_miles": 70000}'),

-- Cooper CS5 Ultra Touring
('b1000000-0000-0000-0000-000000000028',
 'Cooper CS5 Ultra Touring', 'cooper-cs5-ultra-touring',
 'Touring tire with excellent wet traction and comfortable highway ride. Great value for daily drivers.',
 210.00, 240.00, 'TIR-COO-CS5-028',
 '/tires/Goodyear Eagle F1/images.jpg',
 'a1000000-0000-0000-0000-000000000001', 'Cooper', true, 26, false,
 '{"width": 225, "aspect_ratio": 60, "rim_diameter": 17, "load_index": "99", "speed_rating": "V", "tire_type": "Passenger", "season": "All-Season", "runflat": false, "treadwear": 740, "traction": "A", "temperature": "A", "noise_level": "71 dB", "warranty_miles": 80000}'),

-- Toyo Extensa A/S II
('b1000000-0000-0000-0000-000000000029',
 'Toyo Extensa A/S II', 'toyo-extensa-as-ii',
 'All-season tire with wide ribs for improved stability and comfort. Backed by 65,000-mile warranty.',
 165.00, 190.00, 'TIR-TOY-EAS-029',
 '/tires/Continental ExtremeContact/p3-conti.png',
 'a1000000-0000-0000-0000-000000000001', 'Toyo', true, 30, false,
 '{"width": 205, "aspect_ratio": 65, "rim_diameter": 16, "load_index": "95", "speed_rating": "T", "tire_type": "Passenger", "season": "All-Season", "runflat": false, "treadwear": 680, "traction": "A", "temperature": "A", "noise_level": "72 dB", "warranty_miles": 65000}'),

-- Hankook Kinergy GT
('b1000000-0000-0000-0000-000000000030',
 'Hankook Kinergy GT', 'hankook-kinergy-gt',
 'Grand touring all-season tire with 3D waffle blocks for enhanced braking and handling.',
 175.00, 200.00, 'TIR-HAN-KGT-030',
 '/tires/Michelin CrossClimate2/mi_crossclimate2_suv_full.webp',
 'a1000000-0000-0000-0000-000000000001', 'Hankook', true, 34, false,
 '{"width": 215, "aspect_ratio": 55, "rim_diameter": 17, "load_index": "94", "speed_rating": "V", "tire_type": "Passenger", "season": "All-Season", "runflat": false, "treadwear": 700, "traction": "A", "temperature": "A", "noise_level": "69 dB", "warranty_miles": 70000}'),

-- General Altimax RT43
('b1000000-0000-0000-0000-000000000031',
 'General Altimax RT43', 'general-altimax-rt43',
 'Affordable all-season tire with Comfort Ride Technology for a quiet, smooth ride.',
 155.00, 180.00, 'TIR-GEN-AR4-031',
 '/tires/Bridgestone Blizzak WS90/bs_blizzak_ws90_full.webp',
 'a1000000-0000-0000-0000-000000000001', 'General', true, 40, false,
 '{"width": 205, "aspect_ratio": 60, "rim_diameter": 16, "load_index": "92", "speed_rating": "T", "tire_type": "Passenger", "season": "All-Season", "runflat": false, "treadwear": 700, "traction": "A", "temperature": "A", "noise_level": "72 dB", "warranty_miles": 75000}');

-- =============================================
-- PRODUCTS - Summer Tires
-- =============================================
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, image_url, category_id, brand, in_stock, stock_quantity, featured, specs) VALUES

-- Michelin Pilot Sport 4S
('b1000000-0000-0000-0000-000000000005',
 'Michelin Pilot Sport 4S', 'michelin-pilot-sport-4s',
 'Ultra-high performance summer tire with exceptional dry and wet grip. The benchmark for sports cars.',
 290.00, 330.00, 'TIR-MIC-PS4-005',
 '/tires/Michelin Pilot Sport 4S/pss_fiche.webp',
 'a1000000-0000-0000-0000-000000000002', 'Michelin', true, 16, false,
 '{"width": 245, "aspect_ratio": 40, "rim_diameter": 18, "load_index": "97", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 300, "traction": "AA", "temperature": "A", "noise_level": "72 dB", "warranty_miles": 0}'),

-- Goodyear Eagle F1
('b1000000-0000-0000-0000-000000000006',
 'Goodyear Eagle F1', 'goodyear-eagle-f1',
 'Asymmetric summer performance tire with Active Braking technology for shorter stopping distances.',
 240.00, 270.00, 'TIR-GOO-EF1-006',
 '/tires/Goodyear Eagle F1/images.jpg',
 'a1000000-0000-0000-0000-000000000002', 'Goodyear', true, 20, true,
 '{"width": 245, "aspect_ratio": 45, "rim_diameter": 18, "load_index": "100", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 280, "traction": "AA", "temperature": "A", "noise_level": "73 dB", "warranty_miles": 0}'),

-- Pirelli P Zero
('b1000000-0000-0000-0000-000000000007',
 'Pirelli P Zero', 'pirelli-p-zero',
 'Iconic ultra-high performance summer tire. Original equipment on many luxury and sports cars.',
 280.00, 320.00, 'TIR-PIR-PZ-007',
 '/tires/Pirelli P Zero/pzero.png',
 'a1000000-0000-0000-0000-000000000002', 'Pirelli', true, 14, false,
 '{"width": 255, "aspect_ratio": 35, "rim_diameter": 19, "load_index": "96", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 260, "traction": "AA", "temperature": "A", "noise_level": "74 dB", "warranty_miles": 0}'),

-- Continental ExtremeContact Sport
('b1000000-0000-0000-0000-000000000008',
 'Continental ExtremeContact Sport', 'continental-extremecontact-sport',
 'Max performance summer tire with Sport+Technology for precise steering and maximum grip.',
 250.00, 290.00, 'TIR-CON-ECS-008',
 '/tires/Continental ExtremeContact Sport/p3-conti.png',
 'a1000000-0000-0000-0000-000000000002', 'Continental', true, 18, false,
 '{"width": 235, "aspect_ratio": 40, "rim_diameter": 18, "load_index": "95", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 280, "traction": "AA", "temperature": "A", "noise_level": "73 dB", "warranty_miles": 0}'),

-- Bridgestone Potenza RE-71R
('b1000000-0000-0000-0000-000000000032',
 'Bridgestone Potenza RE-71R', 'bridgestone-potenza-re-71r',
 'Extreme performance summer tire for track and street. Exceptional dry grip and turn-in response.',
 300.00, 340.00, 'TIR-BRI-PR7-032',
 '/tires/Michelin Pilot Sport 4S/pss_fiche.webp',
 'a1000000-0000-0000-0000-000000000002', 'Bridgestone', true, 12, false,
 '{"width": 245, "aspect_ratio": 40, "rim_diameter": 17, "load_index": "94", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 200, "traction": "AA", "temperature": "A", "noise_level": "75 dB", "warranty_miles": 0}'),

-- Toyo Proxes Sport A/S
('b1000000-0000-0000-0000-000000000033',
 'Toyo Proxes Sport A/S', 'toyo-proxes-sport-as',
 'Ultra-high performance all-season tire with sport-oriented tread for year-round performance driving.',
 260.00, 300.00, 'TIR-TOY-PSA-033',
 '/tires/Pirelli P Zero/pzero.png',
 'a1000000-0000-0000-0000-000000000002', 'Toyo', true, 15, false,
 '{"width": 235, "aspect_ratio": 45, "rim_diameter": 18, "load_index": "98", "speed_rating": "W", "tire_type": "Passenger", "season": "All-Season", "runflat": false, "treadwear": 400, "traction": "AA", "temperature": "A", "noise_level": "73 dB", "warranty_miles": 0}'),

-- Hankook Ventus V12 evo2
('b1000000-0000-0000-0000-000000000034',
 'Hankook Ventus V12 evo2', 'hankook-ventus-v12-evo2',
 'Ultra-high performance summer tire with optimized tread stiffness for precise handling.',
 225.00, 260.00, 'TIR-HAN-VV1-034',
 '/tires/Goodyear Eagle F1/images.jpg',
 'a1000000-0000-0000-0000-000000000002', 'Hankook', true, 20, false,
 '{"width": 225, "aspect_ratio": 40, "rim_diameter": 18, "load_index": "92", "speed_rating": "W", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 280, "traction": "AA", "temperature": "A", "noise_level": "73 dB", "warranty_miles": 0}'),

-- Firehawk Indy 500
('b1000000-0000-0000-0000-000000000035',
 'Firehawk Indy 500', 'firestone-firehawk-indy-500',
 'Ultra-high performance summer tire inspired by racing technology. Excellent wet and dry grip.',
 195.00, 230.00, 'TIR-FIR-FHI-035',
 '/tires/Continental ExtremeContact Sport/p3-conti.png',
 'a1000000-0000-0000-0000-000000000002', 'Firestone', true, 22, false,
 '{"width": 225, "aspect_ratio": 45, "rim_diameter": 17, "load_index": "94", "speed_rating": "W", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 300, "traction": "AA", "temperature": "A", "noise_level": "74 dB", "warranty_miles": 0}'),

-- Kumho Ecsta PS31
('b1000000-0000-0000-0000-000000000036',
 'Kumho Ecsta PS31', 'kumho-ecsta-ps31',
 'Ultra-high performance summer tire at an affordable price. Great grip and handling for sports cars.',
 180.00, 210.00, 'TIR-KUM-PS3-036',
 '/tires/Pirelli P Zero/pzero.png',
 'a1000000-0000-0000-0000-000000000002', 'Kumho', true, 24, false,
 '{"width": 225, "aspect_ratio": 45, "rim_diameter": 17, "load_index": "94", "speed_rating": "W", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 300, "traction": "AA", "temperature": "A", "noise_level": "74 dB", "warranty_miles": 0}');

-- =============================================
-- PRODUCTS - Winter Tires
-- =============================================
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, image_url, category_id, brand, in_stock, stock_quantity, featured, specs) VALUES

-- Michelin X-Ice Snow
('b1000000-0000-0000-0000-000000000009',
 'Michelin X-Ice Snow', 'michelin-x-ice-snow',
 'Premium winter tire with Flex-Ice compound for outstanding ice grip and snow traction.',
 220.00, 250.00, 'TIR-MIC-XIS-009',
 '/tires/Michelin X-Ice Snow/500x_michelin_x-ice_snow.jpg',
 'a1000000-0000-0000-0000-000000000003', 'Michelin', true, 18, false,
 '{"width": 225, "aspect_ratio": 65, "rim_diameter": 17, "load_index": "102", "speed_rating": "T", "tire_type": "Passenger", "season": "Winter", "runflat": false, "treadwear": 450, "traction": "B", "temperature": "B", "noise_level": "71 dB", "warranty_miles": 40000, "three_peak_mountain_snowflake": true}'),

-- Continental WinterContact SI
('b1000000-0000-0000-0000-000000000010',
 'Continental WinterContact SI', 'continental-wintercontact-si',
 'Winter tire with Adaptive Grip+ silica compound for excellent cold-weather performance.',
 190.00, 220.00, 'TIR-CON-WCS-010',
 '/tires/Continental WinterContact SI/wintercontactsi_white_top.webp',
 'a1000000-0000-0000-0000-000000000003', 'Continental', true, 22, false,
 '{"width": 215, "aspect_ratio": 60, "rim_diameter": 17, "load_index": "96", "speed_rating": "T", "tire_type": "Passenger", "season": "Winter", "runflat": false, "treadwear": 480, "traction": "B", "temperature": "B", "noise_level": "70 dB", "warranty_miles": 40000, "three_peak_mountain_snowflake": true}'),

-- Nokian Hakkapeliitta R3
('b1000000-0000-0000-0000-000000000011',
 'Nokian Hakkapeliitta R3', 'nokian-hakkapeliitta-r3',
 'Premium Nordic winter tire with Cryo Crystal particles for unmatched ice grip.',
 250.00, 280.00, 'TIR-NOK-HR3-011',
 '/tires/Nokian Hakkapeliitta R3/1.jpg',
 'a1000000-0000-0000-0000-000000000003', 'Nokian', true, 14, true,
 '{"width": 205, "aspect_ratio": 55, "rim_diameter": 16, "load_index": "91", "speed_rating": "R", "tire_type": "Passenger", "season": "Winter", "runflat": false, "treadwear": 400, "traction": "B", "temperature": "B", "noise_level": "72 dB", "warranty_miles": 0, "three_peak_mountain_snowflake": true, "studdable": true}'),

-- Bridgestone Blizzak DM-V2
('b1000000-0000-0000-0000-000000000037',
 'Bridgestone Blizzak DM-V2', 'bridgestone-blizzak-dm-v2',
 'Winter truck/SUV tire with Multi-Cell compound for superior traction on ice and snow.',
 240.00, 270.00, 'TIR-BRI-DMV-037',
 '/tires/Bridgestone Blizzak WS90/bs_blizzak_ws90_full.webp',
 'a1000000-0000-0000-0000-000000000003', 'Bridgestone', true, 16, false,
 '{"width": 265, "aspect_ratio": 60, "rim_diameter": 17, "load_index": "110", "speed_rating": "R", "tire_type": "Light Truck", "season": "Winter", "runflat": false, "treadwear": 450, "traction": "B", "temperature": "B", "noise_level": "74 dB", "warranty_miles": 0, "three_peak_mountain_snowflake": true}'),

-- Goodyear Ultra Grip Ice WRT
('b1000000-0000-0000-0000-000000000038',
 'Goodyear Ultra Grip Ice WRT', 'goodyear-ultra-grip-ice-wrt',
 'Winter tire with Wear Restricting Technology for longer tread life in cold conditions.',
 210.00, 240.00, 'TIR-GOO-UGI-038',
 '/tires/Michelin X-Ice Snow/500x_michelin_x-ice_snow.jpg',
 'a1000000-0000-0000-0000-000000000003', 'Goodyear', true, 18, false,
 '{"width": 225, "aspect_ratio": 60, "rim_diameter": 17, "load_index": "99", "speed_rating": "T", "tire_type": "Passenger", "season": "Winter", "runflat": false, "treadwear": 460, "traction": "B", "temperature": "B", "noise_level": "72 dB", "warranty_miles": 40000, "three_peak_mountain_snowflake": true}'),

-- Pirelli Winter Sottozero 3
('b1000000-0000-0000-0000-000000000039',
 'Pirelli Winter Sottozero 3', 'pirelli-winter-sottozero-3',
 'Ultra-high performance winter tire for powerful cars. Original equipment on Porsche, BMW, Mercedes.',
 260.00, 300.00, 'TIR-PIR-WS3-039',
 '/tires/Continental WinterContact SI/wintercontactsi_white_top.webp',
 'a1000000-0000-0000-0000-000000000003', 'Pirelli', true, 10, false,
 '{"width": 245, "aspect_ratio": 40, "rim_diameter": 19, "load_index": "98", "speed_rating": "V", "tire_type": "Passenger", "season": "Winter", "runflat": false, "treadwear": 400, "traction": "B", "temperature": "B", "noise_level": "73 dB", "warranty_miles": 0, "three_peak_mountain_snowflake": true}'),

-- Toyo Observe GSi-6
('b1000000-0000-0000-0000-000000000040',
 'Toyo Observe GSi-6', 'toyo-observe-gsi-6',
 'Winter tire with Microbit technology for excellent ice braking. Great value winter performer.',
 235.00, 265.00, 'TIR-TOY-OG6-040',
 '/tires/Nokian Hakkapeliitta R3/1.jpg',
 'a1000000-0000-0000-0000-000000000003', 'Toyo', true, 16, false,
 '{"width": 225, "aspect_ratio": 65, "rim_diameter": 17, "load_index": "102", "speed_rating": "T", "tire_type": "Passenger", "season": "Winter", "runflat": false, "treadwear": 470, "traction": "B", "temperature": "B", "noise_level": "72 dB", "warranty_miles": 40000, "three_peak_mountain_snowflake": true}'),

-- Yokohama IceGuard IG53
('b1000000-0000-0000-0000-000000000041',
 'Yokohama IceGuard IG53', 'yokohama-iceguard-ig53',
 'Studless winter tire with Nano-blend compound for reliable cold-weather performance.',
 200.00, 230.00, 'TIR-YOK-IG5-041',
 '/tires/Michelin X-Ice Snow/500x_michelin_x-ice_snow.jpg',
 'a1000000-0000-0000-0000-000000000003', 'Yokohama', true, 18, false,
 '{"width": 215, "aspect_ratio": 60, "rim_diameter": 16, "load_index": "96", "speed_rating": "T", "tire_type": "Passenger", "season": "Winter", "runflat": false, "treadwear": 460, "traction": "B", "temperature": "B", "noise_level": "71 dB", "warranty_miles": 0, "three_peak_mountain_snowflake": true}'),

-- General Altimax Arctic 12
('b1000000-0000-0000-0000-000000000042',
 'General Altimax Arctic 12', 'general-altimax-arctic-12',
 'Studdable winter tire for severe snow and ice conditions. Great value for northern climates.',
 185.00, 215.00, 'TIR-GEN-AA1-042',
 '/tires/Continental WinterContact SI/wintercontactsi_white_top.webp',
 'a1000000-0000-0000-0000-000000000003', 'General', true, 24, false,
 '{"width": 205, "aspect_ratio": 60, "rim_diameter": 16, "load_index": "92", "speed_rating": "R", "tire_type": "Passenger", "season": "Winter", "runflat": false, "treadwear": 430, "traction": "B", "temperature": "B", "noise_level": "73 dB", "warranty_miles": 0, "three_peak_mountain_snowflake": true, "studdable": true}');

-- =============================================
-- PRODUCTS - Performance Tires
-- =============================================
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, image_url, category_id, brand, in_stock, stock_quantity, featured, specs) VALUES

-- Pirelli P Zero Trofeo R
('b1000000-0000-0000-0000-000000000015',
 'Pirelli P Zero Trofeo R', 'pirelli-p-zero-trofeo-r',
 'Track-focused performance tire with extreme dry grip. DOT-approved for street use.',
 320.00, 370.00, 'TIR-PIR-PZT-015',
 '/tires/Pirelli P Zero Trofeo R/Trofeo R-02_i.webp',
 'a1000000-0000-0000-0000-000000000004', 'Pirelli', true, 8, false,
 '{"width": 265, "aspect_ratio": 35, "rim_diameter": 19, "load_index": "98", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 180, "traction": "AA", "temperature": "A", "noise_level": "76 dB", "warranty_miles": 0}'),

-- Michelin Pilot Sport Cup 2
('b1000000-0000-0000-0000-000000000016',
 'Michelin Pilot Sport Cup 2', 'michelin-pilot-sport-cup-2',
 'Track-day tire with dual-compound technology. Original equipment on Porsche 911 GT3 RS.',
 280.00, 330.00, 'TIR-MIC-PSC-016',
 '/tires/Michelin Pilot Sport Cup 2/4w-368_3528703112235_tire_michelin_pilot-sport-cup-2-r_325-slash-30-zr21-108y-xl_n0_a_main_5-quarterzoom_nopad.webp',
 'a1000000-0000-0000-0000-000000000004', 'Michelin', true, 6, true,
 '{"width": 255, "aspect_ratio": 35, "rim_diameter": 19, "load_index": "96", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 160, "traction": "AA", "temperature": "A", "noise_level": "77 dB", "warranty_miles": 0}'),

-- Bridgestone Potenza S007A
('b1000000-0000-0000-0000-000000000043',
 'Bridgestone Potenza S007A', 'bridgestone-potenza-s007a',
 'Ultra-high performance summer tire for luxury sports cars. Original equipment on Audi RS models.',
 310.00, 360.00, 'TIR-BRI-PS7-043',
 '/tires/Pirelli P Zero Trofeo R/Trofeo R-02_i.webp',
 'a1000000-0000-0000-0000-000000000004', 'Bridgestone', true, 10, false,
 '{"width": 265, "aspect_ratio": 30, "rim_diameter": 20, "load_index": "94", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 220, "traction": "AA", "temperature": "A", "noise_level": "75 dB", "warranty_miles": 0}'),

-- Goodyear Eagle F1 SuperSport
('b1000000-0000-0000-0000-000000000044',
 'Goodyear Eagle F1 SuperSport', 'goodyear-eagle-f1-supersport',
 'Max performance summer tire with race-derived Compound Technology for ultimate grip.',
 295.00, 340.00, 'TIR-GOO-EFS-044',
 '/tires/Michelin Pilot Sport Cup 2/4w-368_3528703112235_tire_michelin_pilot-sport-cup-2-r_325-slash-30-zr21-108y-xl_n0_a_main_5-quarterzoom_nopad.webp',
 'a1000000-0000-0000-0000-000000000004', 'Goodyear', true, 8, false,
 '{"width": 255, "aspect_ratio": 35, "rim_diameter": 19, "load_index": "96", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 240, "traction": "AA", "temperature": "A", "noise_level": "75 dB", "warranty_miles": 0}'),

-- Continental SportContact 6
('b1000000-0000-0000-0000-000000000045',
 'Continental SportContact 6', 'continental-sportcontact-6',
 'Ultra-high performance tire with Adaptive Grip technology for maximum cornering stability.',
 275.00, 320.00, 'TIR-CON-SC6-045',
 '/tires/Pirelli P Zero Trofeo R/Trofeo R-02_i.webp',
 'a1000000-0000-0000-0000-000000000004', 'Continental', true, 12, false,
 '{"width": 245, "aspect_ratio": 35, "rim_diameter": 19, "load_index": "93", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 260, "traction": "AA", "temperature": "A", "noise_level": "74 dB", "warranty_miles": 0}'),

-- Hankook Ventus R-S4
('b1000000-0000-0000-0000-000000000046',
 'Hankook Ventus R-S4', 'hankook-ventus-rs4',
 'Extreme performance summer tire with racing-inspired tread for maximum dry grip.',
 265.00, 310.00, 'TIR-HAN-VR4-046',
 '/tires/Michelin Pilot Sport Cup 2/4w-368_3528703112235_tire_michelin_pilot-sport-cup-2-r_325-slash-30-zr21-108y-xl_n0_a_main_5-quarterzoom_nopad.webp',
 'a1000000-0000-0000-0000-000000000004', 'Hankook', true, 14, false,
 '{"width": 245, "aspect_ratio": 40, "rim_diameter": 18, "load_index": "97", "speed_rating": "Y", "tire_type": "Passenger", "season": "Summer", "runflat": false, "treadwear": 200, "traction": "AA", "temperature": "A", "noise_level": "76 dB", "warranty_miles": 0}');

-- =============================================
-- PRODUCTS - Alloy Wheels
-- =============================================
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, image_url, category_id, brand, in_stock, stock_quantity, featured, specs) VALUES

('b1000000-0000-0000-0000-000000000012',
 'BBS CH-R Alloy Wheels', 'bbs-ch-r-alloy-wheels',
 'Premium multi-spoke alloy wheel with flow-formed construction for lightweight strength.',
 2000.00, 2400.00, 'WHL-BBS-CHR-012',
 '/tires/BBS CH-R Alloy Wheels/5.jpg',
 'a1000000-0000-0000-0000-000000000005', 'BBS', true, 4, false,
 '{"diameter": 19, "width": 8.5, "bolt_pattern": "5x112", "offset": 45, "center_bore": 66.5, "finish": "Silver", "material": "Flow-Formed Aluminum", "weight_kg": 9.8, "load_rating_kg": 750}'),

('b1000000-0000-0000-0000-000000000013',
 'Rotiform RSE Alloy Wheels', 'rotiform-rse-alloy-wheels',
 'Clean five-spoke design with a concave profile. Perfect for stance and show builds.',
 1500.00, 1800.00, 'WHL-ROT-RSE-013',
 '/tires/Rotiform RSE Alloy Wheels/9.jpg',
 'a1000000-0000-0000-0000-000000000005', 'Rotiform', true, 6, true,
 '{"diameter": 18, "width": 9.5, "bolt_pattern": "5x114.3", "offset": 22, "center_bore": 73.1, "finish": "Matte Black", "material": "Cast Aluminum", "weight_kg": 10.5, "load_rating_kg": 700}'),

('b1000000-0000-0000-0000-000000000014',
 'Enkei RPF1 Alloy Wheels', 'enkei-rpf1-alloy-wheels',
 'Legendary lightweight racing wheel. One of the lightest production wheels available.',
 1200.00, 1500.00, 'WHL-ENK-RPF-014',
 '/tires/Enkei RPF1 Alloy Wheels/ENKEI-RPF1-BK-131-WEB.jpg',
 'a1000000-0000-0000-0000-000000000005', 'Enkei', true, 8, true,
 '{"diameter": 17, "width": 8, "bolt_pattern": "5x114.3", "offset": 35, "center_bore": 73, "finish": "Matte Black", "material": "MAT Aluminum", "weight_kg": 5.9, "load_rating_kg": 650}'),

('b1000000-0000-0000-0000-000000000047',
 'OZ Racing Superturismo GT', 'oz-racing-superturismo-gt',
 'Italian racing-inspired multi-spoke wheel. Rally heritage meets street style.',
 1800.00, 2200.00, 'WHL-OZ-STG-047',
 '/tires/BBS CH-R Alloy Wheels/5.jpg',
 'a1000000-0000-0000-0000-000000000005', 'OZ Racing', true, 5, false,
 '{"diameter": 18, "width": 8, "bolt_pattern": "5x114.3", "offset": 35, "center_bore": 73.1, "finish": "White", "material": "Cast Aluminum", "weight_kg": 9.2, "load_rating_kg": 700}'),

('b1000000-0000-0000-0000-000000000048',
 'Konig Oversteer Alloy Wheels', 'konig-oversteer-alloy-wheels',
 'Flow-formed performance wheel with a deep concave design. Great value for track builds.',
 950.00, 1200.00, 'WHL-KON-OVS-048',
 '/tires/Rotiform RSE Alloy Wheels/9.jpg',
 'a1000000-0000-0000-0000-000000000005', 'Konig', true, 10, false,
 '{"diameter": 18, "width": 9, "bolt_pattern": "5x114.3", "offset": 25, "center_bore": 73.1, "finish": "Bronze", "material": "Flow-Formed Aluminum", "weight_kg": 8.8, "load_rating_kg": 700}'),

('b1000000-0000-0000-0000-000000000049',
 'Rays Gram Lights 57DR', 'rays-gram-lights-57dr',
 'Japanese motorsport-grade wheel with 6-spoke design. Popular in drift and time attack.',
 1400.00, 1700.00, 'WHL-RAY-57D-049',
 '/tires/Enkei RPF1 Alloy Wheels/ENKEI-RPF1-BK-131-WEB.jpg',
 'a1000000-0000-0000-0000-000000000005', 'Rays', true, 6, false,
 '{"diameter": 18, "width": 9.5, "bolt_pattern": "5x114.3", "offset": 22, "center_bore": 73.1, "finish": "Pressed Graphite", "material": "Cast Aluminum", "weight_kg": 9.5, "load_rating_kg": 700}'),

('b1000000-0000-0000-0000-000000000050',
 'Motegi MR131 Racing Wheels', 'motegi-mr131-racing',
 'Budget-friendly 10-spoke racing wheel. Lightweight and strong for everyday performance.',
 1100.00, 1400.00, 'WHL-MOT-131-050',
 '/tires/BBS CH-R Alloy Wheels/5.jpg',
 'a1000000-0000-0000-0000-000000000005', 'Motegi', true, 12, false,
 '{"diameter": 17, "width": 8, "bolt_pattern": "5x114.3", "offset": 35, "center_bore": 73.1, "finish": "Gloss Black", "material": "Cast Aluminum", "weight_kg": 8.2, "load_rating_kg": 680}'),

('b1000000-0000-0000-0000-000000000051',
 'Forgiato Maglia Wheels', 'forgiato-maglia-wheels',
 'Luxury multi-piece forged wheel. Hand-built in Italy for exotic and luxury vehicles.',
 3200.00, 3800.00, 'WHL-FOR-MAG-051',
 '/tires/Rotiform RSE Alloy Wheels/9.jpg',
 'a1000000-0000-0000-0000-000000000005', 'Forgiato', true, 2, false,
 '{"diameter": 20, "width": 10, "bolt_pattern": "5x112", "offset": 25, "center_bore": 66.5, "finish": "Brushed Silver", "material": "Forged Aluminum", "weight_kg": 11.2, "load_rating_kg": 800}'),

('b1000000-0000-0000-0000-000000000052',
 'TSW Nurburgring Wheels', 'tsw-nurburgring-wheels',
 'Rotary-forged wheel inspired by German motorsport. Clean split-spoke design.',
 1300.00, 1600.00, 'WHL-TSW-NUR-052',
 '/tires/Enkei RPF1 Alloy Wheels/ENKEI-RPF1-BK-131-WEB.jpg',
 'a1000000-0000-0000-0000-000000000005', 'TSW', true, 8, false,
 '{"diameter": 19, "width": 8.5, "bolt_pattern": "5x112", "offset": 35, "center_bore": 66.5, "finish": "Gunmetal", "material": "Rotary-Forged Aluminum", "weight_kg": 9.0, "load_rating_kg": 720}'),

('b1000000-0000-0000-0000-000000000053',
 'Work Emotion ZR10 Wheels', 'work-emotion-zr10',
 'Japanese prestige wheel with 10-spoke design. Popular in JDM and drift culture.',
 1600.00, 1900.00, 'WHL-WRK-ZR1-053',
 '/tires/BBS CH-R Alloy Wheels/5.jpg',
 'a1000000-0000-0000-0000-000000000005', 'Work', true, 4, false,
 '{"diameter": 18, "width": 9.5, "bolt_pattern": "5x114.3", "offset": 22, "center_bore": 73.1, "finish": "Dark Blue", "material": "Cast Aluminum", "weight_kg": 10.0, "load_rating_kg": 700}');

-- =============================================
-- PRODUCTS - Steel Wheels
-- =============================================
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, image_url, category_id, brand, in_stock, stock_quantity, featured, specs) VALUES

('b1000000-0000-0000-0000-000000000017',
 'Steel Wheel Set (15 inch)', 'steel-wheel-set-15',
 'Durable steel wheel set perfect for winter tires or budget replacements.',
 400.00, 480.00, 'WHL-STL-15-017',
 '/tires/steel Wheel Set (15 inch)/full_b6056fa1b2c4f87b93928efa9462e115_800x.webp',
 'a1000000-0000-0000-0000-000000000006', 'Generic', true, 30, false,
 '{"diameter": 15, "width": 6, "bolt_pattern": "4x100", "offset": 40, "center_bore": 54.1, "finish": "Black", "material": "Steel", "set_of": 4, "weight_kg": 8.5}'),

('b1000000-0000-0000-0000-000000000018',
 'Steel Wheel Set (16 inch)', 'steel-wheel-set-16',
 'Reliable steel wheel set for sedans and compact SUVs. Great for winter tire mounting.',
 450.00, 530.00, 'WHL-STL-16-018',
 '/tires/Steel Wheel Set (16 inch)/TFGRW012_NEW-02.jpg',
 'a1000000-0000-0000-0000-000000000006', 'Generic', true, 25, false,
 '{"diameter": 16, "width": 7, "bolt_pattern": "5x114.3", "offset": 40, "center_bore": 73.1, "finish": "Black", "material": "Steel", "set_of": 4, "weight_kg": 9.8}'),

('b1000000-0000-0000-0000-000000000019',
 'Steel Wheel Set (17 inch)', 'steel-wheel-set-17',
 'Heavy-duty steel wheel set for SUVs and light trucks. Corrosion-resistant finish.',
 500.00, 590.00, 'WHL-STL-17-019',
 '/tires/Steel Wheel Set (17 inch)/steel-rim-x99139n-17-inch-5x1143-557505.webp',
 'a1000000-0000-0000-0000-000000000006', 'Generic', true, 20, false,
 '{"diameter": 17, "width": 7.5, "bolt_pattern": "5x114.3", "offset": 35, "center_bore": 73.1, "finish": "Black", "material": "Steel", "set_of": 4, "weight_kg": 11.2}'),

('b1000000-0000-0000-0000-000000000054',
 'Steel Wheel Set (14 inch)', 'steel-wheel-set-14',
 'Compact steel wheel set for economy cars and subcompacts. Budget-friendly option.',
 350.00, 420.00, 'WHL-STL-14-054',
 '/tires/steel Wheel Set (15 inch)/full_b6056fa1b2c4f87b93928efa9462e115_800x.webp',
 'a1000000-0000-0000-0000-000000000006', 'Generic', true, 35, false,
 '{"diameter": 14, "width": 5.5, "bolt_pattern": "4x100", "offset": 40, "center_bore": 54.1, "finish": "Black", "material": "Steel", "set_of": 4, "weight_kg": 7.2}'),

('b1000000-0000-0000-0000-000000000055',
 'Steel Wheel Set (18 inch)', 'steel-wheel-set-18',
 'Full-size steel wheel set for trucks and large SUVs. Built for heavy loads.',
 550.00, 650.00, 'WHL-STL-18-055',
 '/tires/Steel Wheel Set (16 inch)/TFGRW012_NEW-02.jpg',
 'a1000000-0000-0000-0000-000000000006', 'Generic', true, 15, false,
 '{"diameter": 18, "width": 8, "bolt_pattern": "6x139.7", "offset": 30, "center_bore": 108, "finish": "Black", "material": "Steel", "set_of": 4, "weight_kg": 13.5}'),

('b1000000-0000-0000-0000-000000000056',
 'Steel Wheel Set (19 inch)', 'steel-wheel-set-19',
 'Premium steel wheel set for modern SUVs. Clean black finish with hub-centric fitment.',
 600.00, 720.00, 'WHL-STL-19-056',
 '/tires/Steel Wheel Set (17 inch)/steel-rim-x99139n-17-inch-5x1143-557505.webp',
 'a1000000-0000-0000-0000-000000000006', 'Generic', true, 12, false,
 '{"diameter": 19, "width": 8.5, "bolt_pattern": "5x114.3", "offset": 30, "center_bore": 73.1, "finish": "Black", "material": "Steel", "set_of": 4, "weight_kg": 14.2}'),

('b1000000-0000-0000-0000-000000000057',
 'Steel Wheel Set (20 inch)', 'steel-wheel-set-20',
 'Heavy-duty steel wheel set for full-size trucks and commercial vehicles.',
 650.00, 780.00, 'WHL-STL-20-057',
 '/tires/steel Wheel Set (15 inch)/full_b6056fa1b2c4f87b93928efa9462e115_800x.webp',
 'a1000000-0000-0000-0000-000000000006', 'Generic', true, 10, false,
 '{"diameter": 20, "width": 9, "bolt_pattern": "6x139.7", "offset": 25, "center_bore": 108, "finish": "Black", "material": "Steel", "set_of": 4, "weight_kg": 15.8}');

-- =============================================
-- PRODUCTS - Wheel Accessories
-- =============================================
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, image_url, category_id, brand, in_stock, stock_quantity, featured, specs) VALUES

('b1000000-0000-0000-0000-000000000020',
 'Wheel Spacers', 'wheel-spacers',
 'CNC-machined aluminum wheel spacers for wider stance and improved handling.',
 80.00, 100.00, 'ACC-SPC-020',
 '/tires/Wheel Spacers/71Gpkkwl0KL._AC_UF1000,1000_QL80_.jpg',
 'a1000000-0000-0000-0000-000000000007', 'Generic', true, 50, false,
 '{"thickness_mm": 20, "bolt_pattern": "5x114.3", "center_bore": 73.1, "material": "6061 Aluminum", "thread_pitch": "M12x1.5", "set_of": 4}'),

('b1000000-0000-0000-0000-000000000021',
 'Wheel Lug Nuts Set', 'wheel-lug-nuts-set',
 'Closed-end acorn lug nuts in a complete set of 20. Chrome-plated for corrosion resistance.',
 50.00, 65.00, 'ACC-LUG-021',
 '/tires/Wheel Lug Nuts Set/DirtyLifeLugNutSet_1024x.jpg',
 'a1000000-0000-0000-0000-000000000007', 'Generic', true, 60, false,
 '{"thread_pitch": "M12x1.5", "seat_type": "Acorn", "hex_size": "19mm", "length": "26mm", "material": "Carbon Steel", "finish": "Chrome", "set_of": 20}'),

('b1000000-0000-0000-0000-000000000022',
 'Wheel Center Caps', 'wheel-center-caps',
 'Universal push-through center caps to protect wheel hub from dirt and moisture.',
 35.00, 45.00, 'ACC-CCP-022',
 '/tires/Wheel Center Caps/713GmHNUoHL.jpg',
 'a1000000-0000-0000-0000-000000000007', 'Generic', true, 80, false,
 '{"diameter_mm": 65, "fitment": "Push-Through", "material": "ABS Plastic", "finish": "Chrome", "logo": "Generic", "set_of": 4}'),

('b1000000-0000-0000-0000-000000000058',
 'Wheel Lock Kit', 'wheel-lock-kit',
 'Tamper-resistant wheel locks to protect against wheel theft. Includes key socket.',
 65.00, 80.00, 'ACC-LCK-058',
 '/tires/Wheel Lug Nuts Set/DirtyLifeLugNutSet_1024x.jpg',
 'a1000000-0000-0000-0000-000000000007', 'Generic', true, 40, false,
 '{"thread_pitch": "M12x1.5", "seat_type": "Acorn", "hex_size": "19mm", "key_pattern": "Spline", "material": "Chrome Molybdenum", "set_of": 5}'),

('b1000000-0000-0000-0000-000000000059',
 'Wheel Weights Set', 'wheel-weights-set',
 'Self-adhesive wheel weights for tire balancing. Clip-on and stick-on options.',
 30.00, 40.00, 'ACC-WWT-059',
 '/tires/Wheel Center Caps/713GmHNUoHL.jpg',
 'a1000000-0000-0000-0000-000000000007', 'Generic', true, 100, false,
 '{"weight_grams": 60, "type": "Adhesive", "material": "Zinc", "strip_length": "6 inches", "set_of": 100}'),

('b1000000-0000-0000-0000-000000000060',
 'Wheel Brush Cleaning Kit', 'wheel-brush-cleaning-kit',
 'Professional wheel cleaning brush set for all wheel types. Safe on all finishes.',
 25.00, 35.00, 'ACC-BCK-060',
 '/tires/Wheel Spacers/71Gpkkwl0KL._AC_UF1000,1000_QL80_.jpg',
 'a1000000-0000-0000-0000-000000000007', 'Generic', true, 70, false,
 '{"brush_count": 3, "handle_type": "Ergonomic", "bristle_type": "Nylon", "safe_for": ["Alloy", "Chrome", "Painted"], "set_of": 3}'),

('b1000000-0000-0000-0000-000000000061',
 'Wheel Bolts Set', 'wheel-bolts-set',
 'Standard wheel bolts for European vehicles. Chrome finish with washer seat.',
 45.00, 55.00, 'ACC-BLT-061',
 '/tires/Wheel Lug Nuts Set/DirtyLifeLugNutSet_1024x.jpg',
 'a1000000-0000-0000-0000-000000000007', 'Generic', true, 45, false,
 '{"thread_pitch": "M14x1.5", "seat_type": "Washer", "hex_size": "17mm", "length": "28mm", "material": "Carbon Steel", "finish": "Chrome", "set_of": 20}'),

('b1000000-0000-0000-0000-000000000062',
 'Wheel Adapters', 'wheel-adapters',
 'Hub-centric wheel adapters to convert bolt patterns. Allows fitting different wheel bolt patterns.',
 120.00, 150.00, 'ACC-ADP-062',
 '/tires/Wheel Spacers/71Gpkkwl0KL._AC_UF1000,1000_QL80_.jpg',
 'a1000000-0000-0000-0000-000000000007', 'Generic', true, 20, false,
 '{"thickness_mm": 25, "from_bolt_pattern": "4x100", "to_bolt_pattern": "5x114.3", "center_bore": 73.1, "material": "6061 Aluminum", "thread_pitch": "M12x1.5", "set_of": 4}');

-- =============================================
-- PRODUCTS - Tire Accessories
-- =============================================
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, image_url, category_id, brand, in_stock, stock_quantity, featured, specs) VALUES

('b1000000-0000-0000-0000-000000000023',
 'Tire Pressure Monitoring System', 'tire-pressure-monitoring-system',
 'Wireless TPMS with solar-powered display. Real-time tire pressure and temperature monitoring.',
 150.00, 180.00, 'ACC-TPM-023',
 '/tires/Tire Pressure Monitoring System/TPS10-4I.webp',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 25, false,
 '{"sensor_count": 4, "display_type": "LCD", "power_source": "Solar", "pressure_unit": "PSI", "temperature_unit": "Celsius", "battery_life": "2 years", "wireless_frequency": "433MHz"}'),

('b1000000-0000-0000-0000-000000000024',
 'Tire Valve Stems', 'tire-valve-stems',
 'Rubber snap-in tire valve stems with metal cores. Universal fit for passenger vehicles.',
 25.00, 32.00, 'ACC-VLV-024',
 '/tires/Tire Valve Stems/61wx-R63pFL.jpg',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 100, false,
 '{"valve_type": "Snap-In", "material": "Rubber", "core_type": "Metal", "max_pressure_psi": 200, "length_mm": 32, "set_of": 4}'),

('b1000000-0000-0000-0000-000000000025',
 'Tire Repair Kit', 'tire-repair-kit',
 'Complete tire plug kit for emergency flat tire repairs. Includes tools and plugs.',
 40.00, 50.00, 'ACC-RPK-025',
 '/tires/Tire Repair Kit/tire-plug-repair-kit-on-tire-1024x682.jpg',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 40, false,
 '{"plug_count": 35, "tool_count": 3, "includes": ["T-handle reamer", "T-handle plugger", "Rubber cement", "Repair plugs"], "suitable_for": "Tubeless tires", "emergency_use": true}'),

('b1000000-0000-0000-0000-000000000063',
 'Tire Inflator Portable', 'tire-inflator-portable',
 '12V portable tire inflator with digital gauge. Inflates a tire in under 5 minutes.',
 75.00, 95.00, 'ACC-INF-063',
 '/tires/Tire Pressure Monitoring System/TPS10-4I.webp',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 30, false,
 '{"power_source": "12V DC", "max_pressure_psi": 150, "flow_rate": "35L/min", "display": "Digital LED", "auto_shutoff": true, "includes": ["LED light", "Nozzle adapters", "Carrying case"], "weight_kg": 0.9}'),

('b1000000-0000-0000-0000-000000000064',
 'Tire Gauge Digital', 'tire-gauge-digital',
 'Precision digital tire pressure gauge with backlit display. Accurate to 0.5 PSI.',
 35.00, 45.00, 'ACC-DGA-064',
 '/tires/Tire Valve Stems/61wx-R63pFL.jpg',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 50, false,
 '{"range_psi": "0-150", "accuracy_psi": 0.5, "display": "Backlit LCD", "units": ["PSI", "BAR", "KPA", "KG/CM2"], "battery": "CR2032", "auto_off": true}'),

('b1000000-0000-0000-0000-000000000065',
 'Tire Chains Set', 'tire-chains-set',
 'Quick-install tire chains for emergency winter driving. SAE Class S compliant.',
 95.00, 120.00, 'ACC-CHN-065',
 '/tires/Tire Repair Kit/tire-plug-repair-kit-on-tire-1024x682.jpg',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 20, false,
 '{"chain_type": "Cable", "fitment_range": "205/55R16 - 265/70R17", "material": "Manganese Steel", "compliance": "SAE Class S", "installation": "Tool-Free", "set_of": 2}'),

('b1000000-0000-0000-0000-000000000066',
 'Tire Covers Set', 'tire-covers-set',
 'Waterproof tire covers for RV, trailer, and stored vehicle tire protection.',
 55.00, 70.00, 'ACC-CVR-066',
 '/tires/Tire Repair Kit/tire-plug-repair-kit-on-tire-1024x682.jpg',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 35, false,
 '{"material": "Polyester", "waterproof": true, "uv_resistant": true, "size_range": "24-30 inch", "closure": "Drawstring", "color": "Black", "set_of": 2}'),

('b1000000-0000-0000-0000-000000000067',
 'Tire Shine Spray', 'tire-shine-spray',
 'Premium tire shine spray with UV protection. Leaves a deep black, glossy finish.',
 18.00, 24.00, 'ACC-SHS-067',
 '/tires/Tire Valve Stems/61wx-R63pFL.jpg',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 60, false,
 '{"volume_ml": 710, "finish": "High Gloss", "uv_protection": true, "water_resistant": true, "application": "Spray", "coverage": "20+ tires"}'),

('b1000000-0000-0000-0000-000000000068',
 'Tire Mounting Lubricant', 'tire-mounting-lubricant',
 'Professional-grade tire mounting paste. Safe for all tire types and bead protectors.',
 15.00, 20.00, 'ACC-LUB-068',
 '/tires/Tire Repair Kit/tire-plug-repair-kit-on-tire-1024x682.jpg',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 45, false,
 '{"volume_g": 500, "type": "Paste", "base": "Water-Based", "safe_for": ["Rubber", "TPMS Sensors", "Aluminum Rims"], "application": "Brush"}'),

('b1000000-0000-0000-0000-000000000069',
 'Tire Storage Rack', 'tire-storage-rack',
 'Heavy-duty wall-mounted tire rack for seasonal tire storage. Holds up to 4 tires.',
 125.00, 150.00, 'ACC-RCK-069',
 '/tires/Tire Pressure Monitoring System/TPS10-4I.webp',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 15, false,
 '{"capacity_tires": 4, "max_weight_kg": 120, "material": "Powder-Coated Steel", "mount_type": "Wall-Medicated", "dimensions_cm": "60x40x35"}'),

('b1000000-0000-0000-0000-000000000070',
 'Tire Balance Beads', 'tire-balance-beads',
 'Ceramic tire balancing beads for vibration-free ride. Permanent internal balancing.',
 42.00, 55.00, 'ACC-BBE-070',
 '/tires/Tire Valve Stems/61wx-R63pFL.jpg',
 'a1000000-0000-0000-0000-000000000008', 'Generic', true, 30, false,
 '{"bead_material": "Ceramic", "bag_weight_oz": 2, "suitable_for": "13-17 inch tires", "application": "Internal", "lifespan": "Lifetime of tire", "replaces": "Lead weights"}');
