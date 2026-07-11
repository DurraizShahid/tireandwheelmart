export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
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
