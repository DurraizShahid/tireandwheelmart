# Promotions & Discounts System — Implementation Report

## Architecture

```
src/lib/promotions/           → Core engine (types, evaluation, constants, helpers)
src/lib/services/             → Promotion service (interface + mock)
src/hooks/                    → React hooks (use-promotions, use-flash-sale, use-free-shipping)
src/components/promotions/    → 11 reusable components + barrel export
contexts/ + components/       → Wired into existing cart, checkout, product, home
```

## Files Created

### Core Engine (4 files)
| File | Purpose |
|------|---------|
| `src/lib/promotions/types.ts` | 11 promotion types, `Promotion`, `PromotionResult`, `PromotionContext`, `BundlePrice`, `ProductPromotionBadge` |
| `src/lib/promotions/engine.ts` | `getApplicablePromotions()`, `evaluatePromotions()`, `computeTotalPromotionDiscount()`, `hasFreeShipping()` — stacking, priority, condition evaluation |
| `src/lib/promotions/constants.ts` | 11 configured promotions: buy-4-tires, free-shipping, winter-sale, summer-event, wheel-clearance, michelin-offer, accessory-bundle, flash-sale, clearance, winter-package, steel-wheel-special |
| `src/lib/promotions/helpers.ts` | `computeSavings()`, `formatDiscountLabel()`, `isExpired()`, `formatPromotionValue()`, `getProductBadgesFromPromotions()`, `computeBundleSavings()` |

### Service Layer (1 file)
| File | Purpose |
|------|---------|
| `src/lib/services/promotion-service.ts` | `PromotionService` interface with `getActivePromotions()`, `evaluate(ctx)`, `getBannerPromotions()` + mock implementation |
| `src/lib/services/service-registry.ts` | **Modified** — registered `promotion: PromotionService` in `Services` interface |

### Hooks (3 files)
| File | Purpose |
|------|---------|
| `src/hooks/use-promotions.ts` | Evaluates active promotions against cart context, returns `results`, `totalDiscount`, `hasFreeShipping` |
| `src/hooks/use-flash-sale.ts` | Countdown timer returning `days/hours/minutes/seconds/expired`, updates every 1s, auto-stops on expiry |
| `src/hooks/use-free-shipping.ts` | Computes `remaining`, `progress%`, `unlocked` from subtotal vs threshold |

### Components (12 files)
| File | Purpose | Used In |
|------|---------|---------|
| `AnnouncementBar.tsx` | Top announcement banner with dismiss | Homepage |
| `PromotionBanner.tsx` | Gradient promotion banner with optional flash sale countdown | Future category pages |
| `PromotionBadge.tsx` | Individual badge + `BadgeGroup` component | Product cards, detail, search, wishlist, compare |
| `FlashSaleCountdown.tsx` | Days/hrs/mins/secs countdown, 3 variants | Banners, cards |
| `FreeShippingProgress.tsx` | Animated progress bar with truck icon | CartDrawer |
| `PromotionCard.tsx` | Reusable promo card with icon, description, CTA | Homepage deals grid |
| `BundlePricing.tsx` | Bundle price display (original, bundle, savings %) | Product page |
| `ProductPromotions.tsx` | Badges + bundle + free shipping + warranty callouts | PurchasePanel |
| `CartPromotions.tsx` | Free shipping progress + applied promotions + available deals | CartSummary |
| `CheckoutPromotions.tsx` | Promotional savings, free shipping badge, promotion list | Checkout sidebar |
| `HomepageDeals.tsx` | Featured deals section with countdown + card grid | Homepage |
| `index.ts` | Barrel re-exports | — |

## Files Modified (6 files)

| File | Change |
|------|--------|
| `src/lib/services/service-registry.ts` | Added `PromotionService` import + registration |
| `src/components/cart/CartDrawer.tsx` | Added `FreeShippingProgress` between items and summary |
| `src/components/cart/CartSummary.tsx` | Added `CartPromotions` between discount line and subtotal |
| `src/components/product/PurchasePanel.tsx` | Added `ProductPromotions` above stock/shipping section |
| `src/components/home-screen.tsx` | Added `AnnouncementBar` at top, `HomepageDeals` after categories |
| `src/app/checkout/page.tsx` | Added `CheckoutPromotions` below order summary in sidebar |

## Promotion Engine Architecture

```
Promotion constants (11 promos)
       │
       ▼
evaluatePromotions(ctx)
       │
   1. Filter active (not expired, within date range)
   2. Sort by priority (lower = higher priority)
   3. For each promotion:
      ├── Skip if non-stackable and already applied one
      ├── Check conditions (minSubtotal, minQuantity)
      └── Calculate discount based on type:
           ├── percentage → subtotal * value%
           ├── fixed → value
           ├── bundle_tires → value if 4+ tires in cart
           ├── free_shipping → 0 (flag set)
           ├── category → category subtotal * value%
           ├── brand → brand subtotal * value%
           └── product → product subtotal * value%
       │
       ▼
    PromotionResult[] + totalDiscount + hasFreeShipping
```

## Promotion Types Supported

| Type | Example | Stackable | Priority Range |
|------|---------|-----------|----------------|
| `percentage` | 20% Off | ✓ | 1-20 |
| `fixed` | $50 Off | ✓ | 1-20 |
| `bundle_tires` | Buy 4 Save $100 | ✓ | 10 |
| `free_shipping` | Free Shipping | ✓ | 1 |
| `category` | 20% Winter Tires | ✗ | 4-6 |
| `brand` | 10% Michelin | ✓ | 8 |
| `product` | Product-specific | ✓ | 5-15 |
| `flash_sale` | 20% Limited Time | ✗ | 3 |
| `clearance` | 30% Off | ✓ | 15 |
| `first_order` | (future) | ✓ | 2 |
| `bundle` | Bundle & Save | ✗ | 5 |

## Reused Components & Utilities

- `formatPrice()` from `catalog-helpers.ts`
- `computeDiscount()` from `catalog-helpers.ts` 
- `cn()` from `utils.ts`
- `useCart` from `cart-context.tsx`
- `CartItem` type from `cart-context.tsx`
- `Product` type from `catalog-types.ts`
- `ServiceResult` from `services/types.ts`

## Future Backend Readiness

All promotions are defined as data in `constants.ts`. To switch to DB-driven:

1. Implement `PromotionService` interface with Supabase queries
2. Replace `PROMOTIONS` constant with DB fetch in `createMockPromotionService` → `createSupabasePromotionService`
3. The engine (`evaluatePromotions`) already works on pure data — no changes needed
4. Components consume via `usePromotions()` hook — no changes needed

Fields prepared for admin panel: `startDate`, `endDate`, `stackable`, `priority`, `minSubtotal`, `minQuantity`, `categorySlug`, `brandName`, `productId`, `badgeText`, `badgeColor`, `bannerImage`, `bannerBg`

## Configurable Promotions (11 active)

| Promotion | Type | Value | Conditions |
|-----------|------|-------|------------|
| Buy 4 Tires, Save $100 | bundle_tires | $100 | 4+ tires in cart |
| Free Shipping | free_shipping | — | Orders over $200 |
| Winter Tire Sale | category | 20% off | Winter tires |
| Summer Tire Event | category | 15% off | Summer tires |
| Wheel Clearance | category | 25% off | Alloy wheels |
| Michelin Offer | brand | 10% off | Michelin brand |
| Accessory Bundle | category | 15% off | Wheel accessories |
| Flash Sale: 20% Off | flash_sale | 20% off | Orders over $100 |
| Clearance: 30% Off | clearance | 30% off | Clearance items |
| Winter Package Deal | category | $200 off | Packages |
| Steel Wheel Special | category | $50 off | Steel wheels |
