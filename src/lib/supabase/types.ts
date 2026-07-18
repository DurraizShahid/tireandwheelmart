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
  show_on_homepage: boolean;
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

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  source: string | null;
  notes: string | null;
  is_active: boolean;
  assigned_to: string | null;
  priority: string;
  tags: string[];
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  converted_to_customer_id: string | null;
  converted_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: string;
  description: string;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
}

export interface LeadCall {
  id: string;
  lead_id: string;
  status: string;
  duration_seconds: number;
  outcome: string | null;
  summary: string | null;
  transcript: string | null;
  conversation: Record<string, unknown> | null;
  scheduled_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface LeadVehicle {
  id: string;
  lead_id: string;
  make: string;
  model: string;
  year: number | null;
  vin: string | null;
  notes: string | null;
  created_at: string;
}

export interface LeadNotification {
  id: string;
  lead_id: string;
  type: string;
  title: string;
  message: string;
  channel: string;
  status: string;
  read: boolean;
  created_at: string;
  sent_at: string | null;
}

export interface VehicleFitment {
  id: string;
  make: string;
  model: string;
  year_start: number;
  year_end: number;
  tire_size: string;
  bolt_pattern: string | null;
  offset_range: string | null;
  created_at: string;
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

export interface Opportunity {
  id: string;
  name: string;
  customer_id: string | null;
  lead_id: string | null;
  converted_from_lead_id: string | null;
  assigned_to: string | null;
  estimated_value: number;
  currency: string;
  expected_close_date: string | null;
  win_probability: number;
  stage: "discovery" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  notes: string | null;
  tags: string[];
  priority: string;
  lost_reason: string | null;
  won_at: string | null;
  lost_at: string | null;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Inventory Types
export type InventoryStatus = "in_stock" | "low_stock" | "out_of_stock" | "overstock" | "reserved" | "unknown";

export type InventoryTransactionType =
  | "sale" | "return" | "reservation" | "release"
  | "manual_adjustment" | "import" | "restock"
  | "cancel" | "refund" | "transfer_out" | "transfer_in";

export interface InventoryTransaction {
  id: string;
  product_id: string;
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  transaction_type: InventoryTransactionType;
  user_id: string | null;
  source_module: string;
  source_reference_id: string | null;
  notes: string | null;
  created_at: string;
}

export type InventoryAlertType = "low_stock" | "out_of_stock" | "overstock" | "reorder_reminder";
export type AlertSeverity = "info" | "warning" | "critical";

export interface InventoryAlert {
  id: string;
  product_id: string;
  alert_type: InventoryAlertType;
  message: string;
  severity: AlertSeverity;
  dismissed: boolean;
  dismissed_at: string | null;
  dismissed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryReorderPoint {
  id: string;
  product_id: string;
  reorder_level: number;
  low_stock_threshold: number;
  overstock_threshold: number;
  preferred_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWarehouseStock {
  id: string;
  product_id: string;
  warehouse_id: string;
  quantity: number;
  reserved_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryDashboardData {
  totalInventoryValue: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  overstockCount: number;
  recentTransactions: InventoryTransaction[];
  movementChart: { date: string; sales: number; returns: number; adjustments: number }[];
  topMovingProducts: { product_id: string; product_name: string; total_qty: number }[];
}
