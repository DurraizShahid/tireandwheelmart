import { ApifyClient } from 'apify-client';
import { randomUUID } from 'crypto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

const API_TOKEN = 'apify_api_8pGdvvardVKK0d2ar4OoL9eS9P8zqe2KsWGF';

const client = new ApifyClient({ token: API_TOKEN });

const TIRE_CATEGORIES = [
  {
    url: 'https://www.canadiantire.ca/en/cat/automotive/tires-wheels/tires/all-season-tires-DC0000421.html;store=650',
    categoryId: 'a1000000-0000-0000-0000-000000000001',
    categorySlug: 'all-season',
    categoryName: 'All-Season Tires',
  },
  {
    url: 'https://www.canadiantire.ca/en/cat/automotive/tires-wheels/tires/winter-tires-DC0000417.html;store=650',
    categoryId: 'a1000000-0000-0000-0000-000000000003',
    categorySlug: 'winter',
    categoryName: 'Winter Tires',
  },
  {
    url: 'https://www.canadiantire.ca/en/cat/automotive/tires-wheels/tires/performance-tires-DC0000418.html;store=650',
    categoryId: 'a1000000-0000-0000-0000-000000000002',
    categorySlug: 'summer',
    categoryName: 'Summer Tires',
  },
  {
    url: 'https://www.canadiantire.ca/en/cat/automotive/tires-wheels/tires/light-truck-suv-tires-DC0000423.html;store=650',
    categoryId: 'a1000000-0000-0000-0000-000000000001',
    categorySlug: 'all-season',
    categoryName: 'All-Season Tires',
  },
  {
    url: 'https://www.canadiantire.ca/en/cat/automotive/tires-wheels/tires/all-terrain-tires-DC0000413.html;store=650',
    categoryId: 'a1000000-0000-0000-0000-000000000001',
    categorySlug: 'all-season',
    categoryName: 'All-Season Tires',
  },
];

const COMMON_TIRE_SIZES = {
  passenger: [
    { width: 185, aspect: 65, rim: 15 },
    { width: 195, aspect: 65, rim: 15 },
    { width: 195, aspect: 60, rim: 16 },
    { width: 205, aspect: 65, rim: 16 },
    { width: 205, aspect: 60, rim: 16 },
    { width: 205, aspect: 55, rim: 16 },
    { width: 215, aspect: 65, rim: 16 },
    { width: 215, aspect: 60, rim: 17 },
    { width: 215, aspect: 55, rim: 17 },
    { width: 225, aspect: 65, rim: 17 },
    { width: 225, aspect: 60, rim: 17 },
    { width: 225, aspect: 55, rim: 17 },
    { width: 225, aspect: 50, rim: 17 },
    { width: 225, aspect: 45, rim: 17 },
    { width: 235, aspect: 65, rim: 17 },
    { width: 235, aspect: 60, rim: 17 },
    { width: 235, aspect: 55, rim: 17 },
    { width: 235, aspect: 45, rim: 18 },
    { width: 245, aspect: 60, rim: 18 },
    { width: 245, aspect: 55, rim: 18 },
    { width: 245, aspect: 50, rim: 18 },
    { width: 245, aspect: 45, rim: 18 },
    { width: 245, aspect: 40, rim: 18 },
    { width: 255, aspect: 60, rim: 18 },
    { width: 255, aspect: 55, rim: 18 },
    { width: 255, aspect: 50, rim: 18 },
    { width: 255, aspect: 45, rim: 18 },
    { width: 255, aspect: 40, rim: 19 },
    { width: 255, aspect: 35, rim: 19 },
    { width: 265, aspect: 60, rim: 18 },
    { width: 265, aspect: 50, rim: 19 },
    { width: 265, aspect: 45, rim: 19 },
    { width: 265, aspect: 40, rim: 20 },
    { width: 265, aspect: 35, rim: 20 },
    { width: 275, aspect: 55, rim: 19 },
    { width: 275, aspect: 45, rim: 20 },
    { width: 275, aspect: 40, rim: 20 },
    { width: 275, aspect: 35, rim: 20 },
    { width: 285, aspect: 45, rim: 19 },
    { width: 285, aspect: 40, rim: 20 },
    { width: 285, aspect: 35, rim: 20 },
  ],
  suv: [
    { width: 215, aspect: 75, rim: 15 },
    { width: 225, aspect: 75, rim: 16 },
    { width: 225, aspect: 70, rim: 16 },
    { width: 225, aspect: 65, rim: 17 },
    { width: 235, aspect: 75, rim: 17 },
    { width: 235, aspect: 70, rim: 17 },
    { width: 235, aspect: 65, rim: 17 },
    { width: 235, aspect: 60, rim: 18 },
    { width: 245, aspect: 75, rim: 17 },
    { width: 245, aspect: 70, rim: 17 },
    { width: 245, aspect: 65, rim: 18 },
    { width: 245, aspect: 60, rim: 18 },
    { width: 255, aspect: 70, rim: 18 },
    { width: 255, aspect: 65, rim: 18 },
    { width: 255, aspect: 60, rim: 18 },
    { width: 255, aspect: 55, rim: 18 },
    { width: 265, aspect: 70, rim: 17 },
    { width: 265, aspect: 65, rim: 17 },
    { width: 265, aspect: 60, rim: 18 },
    { width: 265, aspect: 55, rim: 19 },
    { width: 265, aspect: 50, rim: 19 },
    { width: 275, aspect: 65, rim: 18 },
    { width: 275, aspect: 60, rim: 18 },
    { width: 275, aspect: 55, rim: 19 },
    { width: 275, aspect: 50, rim: 20 },
    { width: 285, aspect: 65, rim: 18 },
    { width: 285, aspect: 60, rim: 18 },
    { width: 285, aspect: 55, rim: 19 },
    { width: 285, aspect: 50, rim: 20 },
    { width: 295, aspect: 60, rim: 18 },
  ],
};

const LOAD_SPEED_MAP = {
  passenger: { load: '94', speed: 'V', tireType: 'Passenger' },
  performance: { load: '96', speed: 'Y', tireType: 'Passenger' },
  suv: { load: '104', speed: 'T', tireType: 'Light Truck' },
};

function getTireType(description, name) {
  const lower = `${description || ''} ${name || ''}`.toLowerCase();
  if (lower.includes('truck') || lower.includes('suv') || lower.includes('cuv')) return 'suv';
  if (lower.includes('performance') || lower.includes('sport') || lower.includes('ultra')) return 'performance';
  return 'passenger';
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSpecs(product, categorySlug) {
  const tireType = getTireType(product.shortDescription || '', product.title);
  const size = pickRandom(tireType === 'suv' ? COMMON_TIRE_SIZES.suv : (tireType === 'performance' ? COMMON_TIRE_SIZES.passenger : COMMON_TIRE_SIZES.passenger));
  const ls = LOAD_SPEED_MAP[tireType] || LOAD_SPEED_MAP.passenger;

  const baseSpecs = {
    width: size.width,
    aspect_ratio: size.aspect,
    rim_diameter: size.rim,
    load_index: ls.load,
    speed_rating: ls.speed,
    tire_type: ls.tireType,
    season: categorySlug === 'winter' ? 'Winter' : categorySlug === 'summer' ? 'Summer' : 'All-Season',
    runflat: false,
    treadwear: categorySlug === 'winter' ? Math.floor(Math.random() * 100 + 400) : 
               categorySlug === 'summer' ? Math.floor(Math.random() * 100 + 260) : 
               Math.floor(Math.random() * 80 + 620),
    traction: categorySlug === 'winter' ? 'B' : (tireType === 'performance' ? 'AA' : 'A'),
    temperature: 'A',
    noise_level: `${Math.floor(Math.random() * 6 + 69)} dB`,
    warranty_miles: categorySlug === 'winter' ? 40000 : categorySlug === 'summer' ? 0 : 60000,
  };

  if (categorySlug === 'winter') {
    baseSpecs.three_peak_mountain_snowflake = true;
    if (Math.random() > 0.7) baseSpecs.studdable = true;
  }

  return baseSpecs;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function generateId(index) {
  const hex = index.toString(16).padStart(12, '0');
  return `b2000000-0000-0000-0000-${hex}`;
}

function cleanDesc(text) {
  return text
    .replace(/[�]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function buildProductSql(products) {
  const lines = [
    '-- =============================================',
    '-- Tire & Wheel Mart - Scraped Product Seed Data',
    `-- Generated: ${new Date().toISOString().split('T')[0]}`,
    '-- Source: Scraped from Canadian Tire via Apify',
    '-- =============================================',
    '',
  ];

  let globalIndex = 1;
  const globalDedup = new Set();
  const MAX_PER_GROUP = 120;

  for (const catProducts of products) {
    const catSlug = catProducts.categorySlug;

    const rows = [];
    let count = 0;

    for (const product of catProducts.items) {
      if (count >= MAX_PER_GROUP) break;

      const name = (product.title || product.name || '').trim();
      if (!name || globalDedup.has(name)) continue;
      if (name.toLowerCase().includes('halloween') || name.toLowerCase().includes('costume') || name.toLowerCase().includes('decor') || name.toLowerCase().includes('snowmobile')) continue;

      globalDedup.add(name);
      count++;

      const brand = product.brand?.label || 'Unknown';
      const slug = slugify(name);
      const price = product.currentPrice?.value || 49.99;
      const comparePrice = product.displayWasLabel && product.originalPrice?.value > price ? product.originalPrice.value : null;
      const imageUrl = product.mainImage || (product.images?.[0]?.url) || '';
      const rawDesc = product.shortDescription || (product.featureBullets?.map(f => f.description).join('. ') || '');
      const description = cleanDesc(rawDesc || `${brand} ${name} tire`);
      const rating = product.rating || null;
      const reviewCount = product.ratingsCount || null;
      const sku = product.code || null;
      const specs = generateSpecs(product, catSlug);

      const id = generateId(globalIndex);
      globalIndex++;

      const esc = (s) => `'${String(s).replace(/'/g, "''")}'`;
      const isNew = Math.random() > 0.8 ? 'true' : 'false';
      const isBestSeller = Math.random() > 0.9 ? 'true' : 'false';

      rows.push(`(${esc(id)}, ${esc(name)}, ${esc(slug)}, ${esc(description)}, ${price}, ${comparePrice || 'NULL'}, ${sku ? esc(sku) : 'NULL'}, ${esc(imageUrl)}, ${esc(catProducts.categoryId)}, ${esc(brand)}, true, ${Math.floor(Math.random() * 30 + 10)}, false, ${isNew}, ${isBestSeller}, '{}', ${rating !== null ? rating : 'NULL'}, ${reviewCount !== null ? reviewCount : 'NULL'}, ${esc(JSON.stringify(specs))})`);
    }

    if (rows.length > 0) {
      lines.push(`-- =============================================`);
      lines.push(`-- PRODUCTS - ${catProducts.categoryName} (${rows.length} products)`);
      lines.push(`-- =============================================`);
      lines.push(`INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, image_url, category_id, brand, in_stock, stock_quantity, featured, is_new, is_best_seller, tags, rating, review_count, specs) VALUES`);
      lines.push(rows.join(',\n') + '\nON CONFLICT (slug) DO NOTHING;');
      lines.push('');
    }
  }

  return lines.join('\n');
}

async function scrapeCategory(cat) {
  console.log(`Scraping ${cat.categorySlug} from ${cat.url}...`);

  const input = {
    startUrls: [{ url: cat.url }],
    language: 'en',
    deepSearch: false,
  };

  const run = await client.actor('azzouzana/canadiantire-ca-scraper').call(input);

  console.log(`  Run finished: ${run.status}`);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  return {
    categoryName: cat.categoryName,
    categoryId: cat.categoryId,
    categorySlug: cat.categorySlug,
    items,
  };
}

async function main() {
  console.log('Starting Canadian Tire product scrape...\n');

  const allProducts = [];

  for (const cat of TIRE_CATEGORIES) {
    try {
      const result = await scrapeCategory(cat);
      console.log(`  Got ${result.items.length} products from ${cat.categoryName}`);
      allProducts.push(result);
    } catch (err) {
      console.error(`  Failed to scrape ${cat.categorySlug}: ${err.message}`);
    }
  }

  // Merge same-category results (e.g., all-season from multiple URLs)
  const merged = new Map();
  for (const p of allProducts) {
    const key = p.categoryId;
    if (merged.has(key)) {
      merged.get(key).items.push(...p.items);
    } else {
      merged.set(key, p);
    }
  }

  const totalRaw = allProducts.reduce((sum, c) => sum + c.items.length, 0);
  console.log(`\nTotal raw products scraped: ${totalRaw} (merged into ${merged.size} category groups)`);

  const sql = buildProductSql([...merged.values()]);

  const outputDir = 'supabase/seeds';
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const outputPath = `${outputDir}/03_scraped_products.sql`;
  writeFileSync(outputPath, sql, 'utf-8');

  const insertCount = (sql.match(/b2000000/g) || []).length;
  console.log(`Generated ${insertCount} product inserts → ${outputPath}`);
}

main().catch(console.error);
