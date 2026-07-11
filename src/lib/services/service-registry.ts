import type { ProductService } from "./product-service";
import type { CartService } from "./cart-service";
import type { OrderService } from "./order-service";
import type { ReviewService } from "./review-service";
import type { CouponService } from "./coupon-service";
import type { ShippingService } from "./shipping-service";
import type { PaymentService } from "./payment-service";
import type { SearchService } from "./search-service";
import type { WishlistService } from "./wishlist-service";

import { createMockProductService } from "./product-service";
import { createMockCartService } from "./cart-service";
import { createMockOrderService } from "./order-service";
import { createMockReviewService } from "./review-service";
import { createMockCouponService } from "./coupon-service";
import { createMockShippingService } from "./shipping-service";
import { createMockPaymentService } from "./payment-service";
import { createMockSearchService } from "./search-service";
import { createMockWishlistService } from "./wishlist-service";

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
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES !== "false";
  return {
    product: useMock ? createMockProductService() : createMockProductService(),
    cart: useMock ? createMockCartService() : createMockCartService(),
    order: useMock ? createMockOrderService() : createMockOrderService(),
    review: useMock ? createMockReviewService() : createMockReviewService(),
    coupon: useMock ? createMockCouponService() : createMockCouponService(),
    shipping: useMock ? createMockShippingService() : createMockShippingService(),
    payment: useMock ? createMockPaymentService() : createMockPaymentService(),
    search: useMock ? createMockSearchService() : createMockSearchService(),
    wishlist: useMock ? createMockWishlistService() : createMockWishlistService(),
  };
}

export function useServices(): Services {
  return getServices();
}
