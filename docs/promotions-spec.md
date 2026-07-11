# Spec: Promotions & Discounts System

## Objective

Build a premium promotions system comparable to Shopify/Tire Rack/Amazon — supporting percentage discounts, fixed discounts, bundle deals, flash sales, free shipping progress, and product badges — all reusable and backend-ready.

## Assumptions

1. Cart pricing (subtotal, tax, shipping, discount) stays in `cart-context.tsx` — promotion engine feeds computed values into it, not replaces it
2. Existing `coupon-service.ts` interface is kept — promotion engine wraps it with stacking, priority, and type support
3. All promotions are currently mock/data-driven — admin panel integration is prepared but not built
4. Existing `formatPrice`, `computeDiscount`, `getProductBadges`, `Product.comparePrice` are reused — not duplicated
5. No existing page layouts are redesigned — only augmented with promotion sections

## Architecture

```
src/lib/promotions/
├── types.ts              # Promotion, PromotionType, PromotionResult, BundlePrice
├── engine.ts             # Core engine: evaluate(), bestPromotions(), getApplicablePromotions()
├── constants.ts          # Configured promotions data (mock, replaceable with DB)
└── helpers.ts            # computeSavings, formatDiscountLabel, isExpired

src/lib/services/
└── promotion-service.ts  # Service interface + mock implementation

src/hooks/
├── use-promotions.ts            # Main hook: auto-applies promotions, returns results
├── use-flash-sale.ts            # Countdown timer hook
└── use-free-shipping.ts         # Free shipping progress tracking

src/components/promotions/
├── AnnouncementBar.tsx           # Top announcement bar
├── PromotionBanner.tsx          # Hero/section banner
├── FlashSaleCountdown.tsx       # Countdown timer
├── FreeShippingProgress.tsx     # Shipping progress bar
├── PromotionBadge.tsx           # Product badges
├── PromotionCard.tsx            # Reusable promo card
├── BundlePricing.tsx            # Bundle price display
├── ProductPromotions.tsx        # Product page callouts
├── CartPromotions.tsx           # Cart drawer/upsell
├── CheckoutPromotions.tsx       # Checkout promotion summary
├── HomepageDeals.tsx            # Homepage deals section
└── index.ts                     # Re-exports

src/components/promotions/
└── __tests__/                   # (future)
```

## Promotion Types

| Type | Key | Behavior |
|------|-----|----------|
| Percentage Discount | `percentage` | `price * (percentage / 100)` off |
| Fixed Amount | `fixed` | `amount` off |
| Buy 4 Tires | `bundle_tires` | `amount` off when cart has 4+ tires |
| Bundle Discount | `bundle` | `amount` off when specific items are together |
| Free Shipping | `free_shipping` | Sets shipping to 0 |
| Category Discount | `category` | `percentage` off items in category |
| Brand Discount | `brand` | `percentage` off items from brand |
| Product Discount | `product` | `percentage` off specific product |
| Flash Sale | `flash_sale` | Time-bound percentage off |
| Clearance | `clearance` | Deep discount on marked items |
| First Order | `first_order` | (future) `percentage` off first purchase |

## Data Flow

```
Promotion constants/DB
       │
       ▼
promotion-engine.ts (evaluate, filter, sort, stack)
       │
       ▼
use-promotions hook (memoized)
       │
       ▼
Cart context (discount, total)
UI components (badges, banners, progress)
```

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/promotions/types.ts` | All promotion interfaces |
| `src/lib/promotions/engine.ts` | Evaluation engine |
| `src/lib/promotions/constants.ts` | Configured promotions |
| `src/lib/promotions/helpers.ts` | Formatting utilities |
| `src/lib/services/promotion-service.ts` | Service layer |
| `src/hooks/use-promotions.ts` | Main hook |
| `src/hooks/use-flash-sale.ts` | Countdown hook |
| `src/hooks/use-free-shipping.ts` | Free shipping hook |
| `src/components/promotions/index.ts` | Re-exports |
| `src/components/promotions/AnnouncementBar.tsx` | Announcement bar |
| `src/components/promotions/PromotionBanner.tsx` | Banner |
| `src/components/promotions/FlashSaleCountdown.tsx` | Countdown |
| `src/components/promotions/FreeShippingProgress.tsx` | Progress bar |
| `src/components/promotions/PromotionBadge.tsx` | Badge |
| `src/components/promotions/PromotionCard.tsx` | Card |
| `src/components/promotions/BundlePricing.tsx` | Bundle |
| `src/components/promotions/ProductPromotions.tsx` | Product |
| `src/components/promotions/CartPromotions.tsx` | Cart |
| `src/components/promotions/CheckoutPromotions.tsx` | Checkout |
| `src/components/promotions/HomepageDeals.tsx` | Homepage |
| `docs/promotions-implementation-report.md` | Report |

## Files to Modify

| File | Change |
|------|--------|
| `src/contexts/cart-context.tsx` | Integrate promotion engine, add `activePromotions`, `savings` |
| `src/components/cart/CartDrawer.tsx` | Add FreeShippingProgress, CartPromotions |
| `src/components/cart/CartSummary.tsx` | Add promotion suggestions, savings breakdown |
| `src/components/home-screen.tsx` | Add AnnouncementBar, HomepageDeals |
| `src/components/product/PurchasePanel.tsx` | Add PromotionBadge, ProductPromotions |
| `src/app/checkout/page.tsx` | Add CheckoutPromotions |
| `src/lib/services/service-registry.ts` | Register promotion service |

## Success Criteria

- All promotion types evaluate correctly (percentage, fixed, bundle, free shipping, category, brand, product, flash sale, clearance)
- Free shipping progress bar shows real-time progress from cart totals
- Countdown timer renders days/hours/minutes/seconds and auto-expires
- Badges appear on ProductCard, ProductInfo, PurchasePanel, search results, wishlist, compare
- Bundle pricing shows original, bundle, savings
- Cart shows applied promotions, savings summary, and promotion suggestions
- Checkout shows promotion summary
- Homepage renders announcement bar and deals section
- All components responsive (desktop, tablet, mobile)
- Keyboard navigation + ARIA labels on all interactive elements
- Build passes with zero errors

## Commands

```
Build: npx tsc --noEmit
Dev: npm run dev
```

## Boundaries

- **Always**: Reuse `formatPrice`, `computeDiscount`, `useCart`, cart totals
- **Ask first**: Changing cart context totals calculation, modifying checkout flow
- **Never**: Duplicate pricing logic, redesign existing pages, remove existing features
