import type { ProductService } from "./product-service";
import type { CartService } from "./cart-service";
import type { OrderService } from "./order-service";
import type { ReviewService } from "./review-service";
import type { CouponService } from "./coupon-service";
import type { ShippingService } from "./shipping-service";
import type { PaymentService } from "./payment-service";
import type { SearchService } from "./search-service";
import type { WishlistService } from "./wishlist-service";
import type { PromotionService } from "./promotion-service";

import { createSupabaseProductService, createMockProductService } from "./product-service";
import { createMockCartService } from "./cart-service";
import { createSupabaseOrderService } from "./order-service";
import { createSupabaseReviewService, createMockReviewService } from "./review-service";
import { createSupabaseCouponService, createMockCouponService } from "./coupon-service";
import { createMockShippingService } from "./shipping-service";
import { createMockPaymentService } from "./payment-service";
import { createSupabaseSearchService, createMockSearchService } from "./search-service";
import { createMockWishlistService } from "./wishlist-service";
import { createSupabasePromotionService } from "./promotion-service";

export interface Services {
  product: ProductService;
  cart: CartService;
  order: OrderService;
  review: ReviewService;
  coupon: CouponService;
  shipping: ShippingService;
  payment: PaymentService;
  search: SearchService;
  wishlist: WishlistService;
  promotion: PromotionService;
}

let instance: Services | null = null;

export function getServices(): Services {
  if (instance) return instance;
  instance = buildServices();
  return instance;
}

export function resetServices(): void {
  instance = null;
}

function buildServices(): Services {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === "true";
  return {
    product: useMock ? createMockProductService() : createSupabaseProductService(),
    cart: useMock ? createMockCartService() : createMockCartService(),
    order: useMock ? createSupabaseOrderService() : createSupabaseOrderService(),
    review: useMock ? createMockReviewService() : createSupabaseReviewService(),
    coupon: useMock ? createMockCouponService() : createSupabaseCouponService(),
    shipping: useMock ? createMockShippingService() : createMockShippingService(),
    payment: useMock ? createMockPaymentService() : createMockPaymentService(),
    search: useMock ? createMockSearchService() : createSupabaseSearchService(),
    wishlist: useMock ? createMockWishlistService() : createMockWishlistService(),
    promotion: useMock ? createSupabasePromotionService() : createSupabasePromotionService(),
  };
}

export function useServices(): Services {
  return getServices();
}
