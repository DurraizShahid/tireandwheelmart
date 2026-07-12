export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  hero_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  content: Record<string, unknown>;
  homepage_category: boolean;
  homepage_description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  clerk_user_id: string;
  business_name: string;
  business_email: string | null;
  business_phone: string | null;
  commission_rate: number;
  order_handling: "admin" | "self";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  image_url: string;
  images: string[];
  category_id: string;
  supplier_id: string | null;
  brand: string | null;
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  tags: string[];
  rating: number | null;
  review_count: number | null;
  specs: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  categories: Category;
}

export interface ProductWithSupplier extends Product {
  categories: Category;
  suppliers: Supplier | null;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  website_url: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string | null;
  company: string | null;
  avatar_url: string | null;
  content: string;
  rating: number;
  display_order: number;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string | null;
  author: string;
  rating: number;
  title: string;
  content: string;
  vehicle: string | null;
  tire_size: string | null;
  photos: string[];
  verified: boolean;
  helpful_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string | null;
  type: "percentage" | "fixed" | "bundle_tires" | "bundle" | "free_shipping" | "category" | "brand" | "product" | "flash_sale" | "clearance" | "first_order";
  value: number;
  min_subtotal: number | null;
  min_quantity: number | null;
  category_slug: string | null;
  brand_name: string | null;
  product_id: string | null;
  start_date: string | null;
  end_date: string | null;
  stackable: boolean;
  priority: number;
  badge_text: string | null;
  badge_color: string | null;
  banner_image: string | null;
  banner_bg: string | null;
  is_active: boolean;
  show_on_homepage: boolean;
  homepage_order: number;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
