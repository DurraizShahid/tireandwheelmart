export type PromotionType =
  | "percentage"
  | "fixed"
  | "bundle_tires"
  | "bundle"
  | "free_shipping"
  | "category"
  | "brand"
  | "product"
  | "flash_sale"
  | "clearance"
  | "first_order";

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: PromotionType;
  value: number;
  minSubtotal?: number;
  minQuantity?: number;
  categorySlug?: string;
  brandName?: string;
  productId?: string;
  startDate?: string;
  endDate?: string;
  stackable: boolean;
  priority: number;
  badgeText?: string;
  badgeColor?: string;
  bannerImage?: string;
  bannerBg?: string;
}

export interface PromotionResult {
  promotionId: string;
  promotionName: string;
  discount: number;
  type: PromotionType;
  description: string;
}

export interface PromotionContext {
  items: Array<{ id: string; name: string; price: number; quantity: number; category?: string; brand?: string }>;
  subtotal: number;
  appliedCouponCode?: string | null;
}

export interface BundlePrice {
  label: string;
  originalTotal: number;
  bundleTotal: number;
  savings: number;
  percentageSaved: number;
  items: Array<{ name: string; price: number }>;
}

export type PromotionBadgeType =
  | "sale"
  | "clearance"
  | "limited-time"
  | "best-value"
  | "bundle-deal"
  | "hot-deal"
  | "manufacturer-offer"
  | "free-shipping"
  | "buy-4-save"
  | "new-arrival"
  | "premium-choice";

export interface ProductPromotionBadge {
  type: PromotionBadgeType;
  text: string;
  color: string;
  expiresAt?: string;
}
