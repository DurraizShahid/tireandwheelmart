export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  comparePrice?: number;
  discount?: number;
  images: string[];
  description?: string;
  specifications: Record<string, string | number | boolean>;
  brand?: string;
  size?: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  tags: string[];
  featured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  createdAt: string;
}

export type BadgeType = "featured" | "new" | "bestseller" | "sale";

export type ViewMode = "grid" | "list";

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "bestselling"
  | "name-asc"
  | "name-desc";

export interface ProductFilters {
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  tireSize?: string;
  wheelSize?: string;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  onSale?: boolean;
  search?: string;
}

export interface ProductQuery { // unused
  category?: string;
  subcategory?: string;
  sort?: SortOption;
  searchTerm?: string;
  filters?: ProductFilters;
  page: number;
  pageSize: number;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Category {
  title: string;
  slug: string;
  image: string;
  bgColor: string;
  subcategories?: { title: string; slug: string }[];
}

export interface ActiveFilterChip { // unused
  label: string;
  onRemove: () => void;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BuyingGuideSection {
  title: string;
  description: string;
  tips: { title: string; description: string }[];
  features: { title: string; description: string; icon?: string }[];
  recommendations: { title: string; description: string; link?: string }[];
}

export interface CategoryConfig {
  name: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  heroImage: string;
  heroBgFrom?: string;
  heroBgVia?: string;
  heroBgTo?: string;
  seoTitle: string;
  seoDescription: string;
  seoContent?: string[];
  faq: FAQItem[];
  buyingGuide?: BuyingGuideSection;
  featuredBrands: string[];
  relatedCategories: string[];
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}
