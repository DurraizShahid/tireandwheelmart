# Tire&Wheel Mart — Complete Project Audit

> **Generated**: Comprehensive analysis of all edge cases, corner cases, race conditions,
> failure scenarios, exception scenarios, business scenarios, business rules, use cases,
> abuse cases, and misuse cases across the entire codebase.

---

## Table of Contents

1. [Business Rules](#1-business-rules)
2. [Business Scenarios & Use Cases](#2-business-scenarios--use-cases)
3. [Edge Cases & Corner Cases](#3-edge-cases--corner-cases)
4. [Race Conditions](#4-race-conditions)
5. [Failure Scenarios](#5-failure-scenarios)
6. [Exception Scenarios](#6-exception-scenarios)
7. [Abuse Cases](#7-abuse-cases)
8. [Misuse Cases](#8-misuse-cases)
9. [Data Integrity & Constraints](#9-data-integrity--constraints)
10. [Security Analysis](#10-security-analysis)
11. [Cross-Cutting Concerns](#11-cross-cutting-concerns)

---

## 1. Business Rules

### 1.1 Pricing & Discounts

| # | Rule | Source | Risk Level |
|---|------|--------|------------|
| BR-01 | Discounts can reduce subtotal below zero. `Math.max(0, sub - disc)` clamps at 0. | `cart-context.tsx:205`, `cart-service.ts:95` | **HIGH** — Negates all further calculations if total is negative |
| BR-02 | TAX_RATE is hardcoded at 8% (`TAX_RATE = 0.08`). No per-state or per-country logic. | `cart-context.tsx:56` | **MEDIUM** — Wrong tax for most US states/CA provinces |
| BR-03 | Free shipping threshold is hardcoded at $200 (`FREE_SHIPPING_THRESHOLD = 200`). | `cart-context.tsx:58` | **LOW** — Acceptable MVP, but not configurable |
| BR-04 | SHIPPING_RATE is hardcoded at $15 flat. | `cart-context.tsx:57` | **MEDIUM** — No weight/dimension/zone-based shipping |
| BR-05 | Tax is computed on discounted subtotal (`discountedSubtotal * TAX_RATE`). | `cart-context.tsx:206` | **MEDIUM** — Tax on discount is jurisdiction-dependent |
| BR-06 | Promotions evaluate on client side. Date checks use `Date.now()` (client clock). | `promotions/engine.ts:4` | **HIGH** — Client clock manipulation can activate/expire promotions early |
| BR-07 | Coupon validation also uses client-side date comparison. | `coupon-service.ts:42-43` | **HIGH** — Same clock manipulation risk |
| BR-08 | Free shipping in cart context uses `subtotal >= 200` but promotions engine may grant `hasFreeShipping()` independently. These are not synchronized. | `cart-context.tsx:207`, `engine.ts:102-104` | **MEDIUM** — Double free-shipping logic paths may conflict |
| BR-09 | `MIN_SUBTOTAL` on promotions is checked against raw `subtotal`, not discounted subtotal. | `engine.ts:13` | **LOW** — Intentional: subtotal before discounts |
| BR-10 | Non-stackable promotions are skipped once any non-stackable has been applied. Only the first non-stackable (by priority) applies. | `engine.ts:79-81` | **LOW** — By design, but may surprise users |
| BR-11 | `clearance` and `percentage` promotion types apply to the entire subtotal, not clearance-flagged items only. | `engine.ts:57,21` | **HIGH** — 30% off entire cart, not just clearance items |
| BR-12 | `flash_sale` applies to entire subtotal with no per-item check. | `engine.ts:54` | **LOW** — By design |
| BR-13 | `first_order` promotion type exists but has no mechanism to verify first-order status. | `engine.ts:59-60` | **HIGH** — Any user can claim it repeatedly |
| BR-14 | `bundle_tires` checks if any item has category including "tire". Can match non-tire items incorrectly. | `engine.ts:27` | **MEDIUM** — Fuzzy match: "tire" in "accessories" won't hit, but "tire" in "all-terrain" will |
| BR-15 | `bundle` type is declared in PromotionType but has no evaluation logic in engine.ts (falls through to `default: return 0`). | `engine.ts:62-63` | **HIGH** — Bundle promotions silently produce $0 discount |

### 1.2 Order Management

| # | Rule | Source | Risk Level |
|---|------|--------|------------|
| BR-16 | Order statuses: `pending, confirmed, processing, shipped, delivered, cancelled, refunded`. No explicit lifecycle state machine. | `initial_schema.sql:85` | **MEDIUM** — No validation that transitions are legal |
| BR-17 | Only "cancelled" and "confirmed" statuses are used by the code. The rest are manually set via DB. | Order service, Admin routes | **MEDIUM** — Hard to programmatically advance status |
| BR-18 | Order number format: `ORD-<timestamp_base36>-<random>`. Relies on client-side generation. | `checkout-utils.ts:84-88` | **MEDIUM** — No server-side validation/guarantee of uniqueness |
| BR-19 | Order submission in `use-checkout-form.ts` does NOT call any service — uses `setTimeout` + mock. | `use-checkout-form.ts:109-120` | **CRITICAL** — No actual order persistence |
| BR-20 | `canProceedToStep` function is defined but never called anywhere. | `checkout-utils.ts:56-71` | **LOW** — Dead code |
| BR-21 | `generateOrderNumber` exists but order service generates its own number (`ORD-${ts}`). | `checkout-utils.ts`, `order-service.ts:80` | **LOW** — Duplicated logic, different formats |

### 1.3 Inventory

| # | Rule | Source | Risk Level |
|---|------|--------|------------|
| BR-22 | `maxQuantity` is optional. When absent, `Infinity` is used — no stock cap. | `cart-context.tsx:128,153` | **MEDIUM** — Users can add unlimited quantity |
| BR-23 | Stock is never decremented on order placement (order service is mock). | `order-service.ts` | **CRITICAL** — Overselling in production |
| BR-24 | `in_stock` flag is derived from `stock_quantity > 0` on create but must be manually managed on update. | `products/route.ts:40` | **MEDIUM** — Can have `in_stock=true` with `stock_quantity=0` |
| BR-25 | Product PUT endpoint only sets `in_stock` from `stock_quantity` if `in_stock` was not explicitly provided. | `products/[id]/route.ts:37-38` | **MEDIUM** — Conflicting update semantics |

### 1.4 Authentication & Authorization

| # | Rule | Source | Risk Level |
|---|------|--------|------------|
| BR-26 | Admin check: `role !== "admin"` redirects to `/`. No error message. | `middleware.ts:37-39` | **LOW** — Silent redirect may confuse users |
| BR-27 | Vendor routes allow both `vendor` and `admin` roles. | `middleware.ts:52` | **LOW** — By design |
| BR-28 | Role resolution: `sessionClaims` checked first, fallback to Clerk API. Two different time-of-check sources. | `middleware.ts:19-27` | **LOW** — Acceptable design |
| BR-29 | Admin API routes have NO middleware — rely entirely on `SUPABASE_SERVICE_ROLE_KEY` being server-side. | All `api/admin/*/route.ts` | **HIGH** — No auth check on admin APIs themselves |

### 1.5 Cart & Wishlist

| # | Rule | Source | Risk Level |
|---|------|--------|------------|
| BR-30 | Cart persists to localStorage AND Supabase. LocalStorage is source of truth; Supabase is sync target. | `cart-context.tsx:104-119` | **MEDIUM** — Dual-write can diverge |
| BR-31 | Cart sync: on every items change, clear Supabase cart and re-add all items. No merge/sync strategy. | `cart-context.tsx:108-116` | **MEDIUM** — Multi-tab loss if one tab saves stale state |
| BR-32 | On user sign-in, cart is loaded from Supabase ONLY if localStorage was empty. No merge with local cart. | `cart-context.tsx:94-98` | **MEDIUM** — Cart items added before login are lost |
| BR-33 | Same cart/wishlist sync pattern replicated identically in WishlistProvider. | `wishlist-context.tsx:79-94` | **MEDIUM** — Duplicated sync bug surface |

### 1.6 Promotion/Coupon Interaction

| # | Rule | Source | Risk Level |
|---|------|--------|------------|
| BR-34 | Coupons are applied as a flat `discount` value in cart context — not integrated with promotion engine. | `cart-context.tsx:201-217` | **HIGH** — Promotions and coupons compute separately |
| BR-35 | `appliedCoupon` is never checked by the promotion engine (engine ignores `ctx.appliedCouponCode`). | `engine.ts` | **MEDIUM** — Unused context field |
| BR-36 | Coupon service queries DB promotions with `name` match = coupon code. This means any promotion name works as a coupon code. | `coupon-service.ts:27-28` | **HIGH** — Coupon and promotion systems conflated |
| BR-37 | `usePromotions` hook fires two parallel requests (`getActivePromotions` + `evaluate`) — no deduplication. | `use-promotions.ts:23-34` | **LOW** — Minor performance concern |

---

## 2. Business Scenarios & Use Cases

### 2.1 Positive Use Cases (Happy Path)

| # | Scenario | Coverage |
|---|----------|----------|
| UC-01 | Unregistered user browses products, filters by category/brand/price, sorts results | Catalog pages, FilterSidebar, SortDropdown |
| UC-02 | User views product detail page with specs, images, reviews, and purchase panel | `product/[slug]/page.tsx`, `ProductDetailClient` |
| UC-03 | Unregistered user adds items to cart (localStorage-based) | `CartProvider`, `CartContext` |
| UC-04 | User creates account, cart persists to Supabase on sign-in (partial) | `cart-context.tsx:90-102` |
| UC-05 | Full checkout flow: info → shipping → method → billing → payment → review → confirmation | `use-checkout-form.ts`, `checkout/page.tsx` |
| UC-06 | User applies coupon code at checkout | `applyCoupon` in `cart-context.tsx` |
| UC-07 | Free shipping promotion auto-applies when subtotal exceeds threshold | `cart-context.tsx:207` |
| UC-08 | Admin creates/edits/deletes products, categories, brands, suppliers | Admin CRUD routes |
| UC-09 | Admin views analytics dashboard with revenue, orders, customers KPIs | `admin/analytics/page.tsx`, `analytics/route.ts` |
| UC-10 | Vendor manages their own products and orders | Vendor routes |
| UC-11 | User adds/removes items to wishlist | `WishlistProvider` |
| UC-12 | User compares up to 4 products | `CompareProvider` |
| UC-13 | User searches products by name, brand, SKU, category, description | `SearchModal`, `search-service.ts` |
| UC-14 | User submits a product review | `WriteReviewDialog`, `review-service.ts` |
| UC-15 | Admin manages featured deals on the homepage | `admin/featured-deals/page.tsx` |
| UC-16 | User tracks order by order number | `track-order/page.tsx` |

### 2.2 Failure Use Cases

| # | Scenario | Current Handling |
|---|----------|-----------------|
| UC-F01 | Database unreachable during homepage load | Caught by try/catch, renders empty arrays (`page.tsx:33-35`) |
| UC-F02 | Product slug not found in DB | Falls through to catalog product fetch, then `notFound()` |
| UC-F03 | Cart localStorage is corrupted | Caught by try/catch, localStorage key removed, cart reset |
| UC-F04 | Payment provider unavailable | Mock service always succeeds — no real failure path tested |
| UC-F05 | User submits order with empty cart | Checkout redirects back to shop (`checkout/page.tsx:28-39`) |
| UC-F06 | Coupon code does not exist | Returns validation error, toast displayed |
| UC-F07 | Promotion end date passed | Filtered out by `isPromotionActive()` |
| UC-F08 | Clerk authentication fails on admin route | Redirects to `/sign-in` |

---

## 3. Edge Cases & Corner Cases

### 3.1 Pricing & Financial

| # | Case | Impact | Location |
|---|------|--------|----------|
| EC-01 | `price = 0` or negative price. No validation prevents $0 or negative price on product creation. | Free/negative-cost products | `products/route.ts:20` |
| EC-02 | `compare_at_price < price`. Creates negative discount. `computeDiscount` returns `undefined` but badges check `comparePrice > price`. | No "sale" badge for valid sale items | `catalog-helpers.ts:4-6` |
| EC-03 | `compare_at_price = 0`. Division by zero in `computeDiscount`. | `1 - price/0 = Infinity` → `Math.round(Infinity) = Infinity` | `catalog-helpers.ts:5` |
| EC-04 | Subtotal is 0 (empty cart). Shipping is $0 (because `items.length === 0`), tax is $0. But `total = 0 + 0 + 0 = 0`. | Order with $0 total gets placed | `cart-context.tsx:207` |
| EC-05 | Extremely large quantity (e.g., 9999 tires). `maxQuantity` may be undefined = unlimited. | Price overflow or absurd totals | `cart-context.tsx:128` |
| EC-06 | `stock_quantity = 0` but `in_stock = true` (manually set). Users can add out-of-stock items to cart. | Overselling | `products/route.ts:40` |
| EC-07 | Multiple promotions with same priority. Sort is stable (spread copy), but undefined ordering. | Unpredictable promotion application | `engine.ts:73` |
| EC-08 | 100% off promotion (`value = 100`, type=percentage). Makes entire order free, including tax. | Zero-dollar orders | `engine.ts:21` |
| EC-09 | Discount exceeds subtotal. `Math.max(0, subtotal - discount)` = 0. Shipping may still apply. | Items free but user still pays shipping | `cart-context.tsx:205,207` |
| EC-10 | Tax on $0 discounted subtotal = $0. But shipping is $15 (if under threshold). Total = $15 shipping only. | Shipping-only order possible with large coupon | `cart-context.tsx:206-207` |

### 3.2 Data & Validation

| # | Case | Impact | Location |
|---|------|--------|----------|
| EC-11 | Product slug collision: auto-generated slug from name may conflict with existing slug. | Constraint violation (500 error) | `products/route.ts:24` |
| EC-12 | `email` in customers table is NOT unique. Multiple records can share the same email. | Order history fragmentation | `initial_schema.sql:52` |
| EC-13 | `clerk_user_id` in customers IS unique but order service searches by `email` only. | Orders linked to wrong customer if email shared | `order-service.ts:29` |
| EC-14 | Address model: `postal_code` uses US ZIP regex (`^\d{5}(-\d{4})?$`). Canadian postal codes (A1A 1A1) rejected. | Canadian customers cannot complete checkout | `checkout-utils.ts:12` |
| EC-15 | `phone` validation: `[\d\s\-+().]{7,20}`. Accepts `"123"` (too short for valid number). | Invalid phone numbers stored | `checkout-utils.ts:8` |
| EC-16 | `cardNumber` validation: only checks length >= 13. No Luhn algorithm. | Invalid card numbers accepted | `checkout-utils.ts:47` |
| EC-17 | `expiry` validation: `MM/YY` format only. No check for past dates, month > 12, or year boundary. | Expired/invalid expiry dates accepted | `checkout-utils.ts:49` |
| EC-18 | `firstName`/`lastName` validation: only checks `.trim()` is non-empty. Accepts whitespace-only names like `"  "`. | Empty-looking names stored | `checkout-utils.ts:17-18` |
| EC-19 | `streetAddress` validation: only checks `.trim()` is non-empty. Single character `"a"` accepted. | Garbage address data | `checkout-utils.ts:33` |
| EC-20 | `country` default is `"United States"` but hardcoded `"US"` in order service. | Country name/code mismatch | `order-service.ts:49` |

### 3.3 Product Catalog

| # | Case | Impact | Location |
|---|------|--------|----------|
| EC-21 | Products with no brand set. `filterProducts` checks `p.brand && ...filters.brands.includes(p.brand)` — null-safe but unnamed products in brand filter. | Brandless products hidden when any brand filter active | `catalog-helpers.ts:38` |
| EC-22 | `tireSize` filter: `p.size?.includes(filter)`. Partial match — `"225"` matches `"225/45R17"` AND `"1225/..."`. | False positive filter matches | `catalog-helpers.ts:41` |
| EC-23 | `filterProducts` does not handle `categories` and `brands` being empty arrays correctly: `[].includes(x)` is always false, so all products are filtered out. | Empty category array filter yields 0 results | `catalog-helpers.ts:37-38` |
| EC-24 | Sort by `bestselling`: uses `reviewCount` as proxy for sales. Items with 0 reviews sort to bottom. | Misleading sort if review count ≠ sales | `catalog-helpers.ts:75` |
| EC-25 | `getFeaturedProducts` in product service: filters `featured || isNew`. Homepage query uses separate `supabase/queries.ts`. | Two different "featured" definitions | `product-service.ts:59` |
| EC-26 | Product page rendering: tries `getDbProductBySlug` first (DB product type), falls back to `getCatalogProduct` (catalog type), renders different components. | Two parallel product rendering paths | `product/[slug]/page.tsx:54-60` |

### 3.4 Timing & Scheduling

| # | Case | Impact | Location |
|---|------|--------|----------|
| EC-27 | Flash sale crossing midnight. `useFlashSale` uses 1-second interval; expiration clears interval. | Client-side only — no server enforcement | `use-flash-sale.ts:32-36` |
| EC-28 | Flash sale with no `endDate`. `computeTimeLeft` with empty string: `new Date("")` = Invalid Date, `getTime()` = `NaN`. diff = `NaN`, all fields `NaN`. | Broken countdown display | `use-flash-sale.ts:15` |
| EC-29 | Promotion with `startDate` in the future and `endDate` in the past (inverted range). `isPromotionActive` checks both — correctly returns false. | Promotions can never be active if misconfigured | `engine.ts:4-8` |
| EC-30 | Promotion with no `startDate` or `endDate` (never-ending). Always active. | Permanent promotions | `engine.ts:7` |

---

## 4. Race Conditions

| # | Case | Description | Impact | Location |
|---|------|-------------|--------|----------|
| RC-01 | **Concurrent cart modification (same user, two tabs)** | Each tab loads cart from localStorage on mount, then writes full state on every change. Tab B writes after Tab A's add — Tab A's item is lost. | Cart item loss | `cart-context.tsx:104-119` |
| RC-02 | **Concurrent cart modification (two sessions, same user)** | Same pattern via Supabase sync — `clear()` then re-add all items. If two tabs both sync, one tab's clear can wipe the other tab's items. | Complete cart loss | `cart-context.tsx:108-116` |
| RC-03 | **Wishlist race condition (two tabs)** | Identical pattern to cart. Two tabs' wishlist data can collide and overwrite. | Wishlist item loss | `wishlist-context.tsx:79-94` |
| RC-04 | **Checkout submit with stale cart** | `submitOrder` reads `items` from closure. If items change during the mock 1500ms delay, submitted items differ from checkout page. | Wrong items ordered | `use-checkout-form.ts:109-120` |
| RC-05 | **Admin: concurrent product updates** | Two admin users editing the same product simultaneously. Last write wins (no optimistic locking). | Silent data loss | `products/[id]/route.ts:47` |
| RC-06 | **Admin: concurrent order status update** | Same as RC-05 but for orders. No version/ETag mechanism. | Duplicate processing | Admin order routes |
| RC-07 | **`usePromotions` hook fires per keystroke** | Dependencies: `ctx.subtotal, ctx.items.length, ctx.appliedCouponCode`. Frequent changes cause rapid re-evaluation. | Rate of hook fires tied to unrelated state | `use-promotions.ts:35` |
| RC-08 | **Cart subtotal change during coupon application** | `applyCoupon` captures `subtotal` at call time. If subtotal changes before async completion, discount amount may be wrong. | Mismatched coupon discount | `cart-context.tsx:219-232` |
| RC-09 | **Analytics queries race with data** | Dashboard loads latest data but queries are not transactional. Order totals and counts may be slightly inconsistent. | Slightly off KPIs | `dashboard/route.ts:12-51` |
| RC-10 | **Cart/Wishlist hydration vs. Clerk load** | `hydrated` and `clerkLoaded` are separate flags. User data sync races against localStorage loading. | Premature/excessive Supabase sync | `cart-context.tsx:90-102` |

---

## 5. Failure Scenarios

### 5.1 Infrastructure Failures

| # | Scenario | Impact | Current Mitigation |
|---|----------|--------|-------------------|
| FS-01 | **Supabase service unavailable** | All data-dependent pages (home, product, shop, admin) break | Home has try/catch; admin returns 500; product detail returns 404 |
| FS-02 | **Clerk authentication service down** | No user can sign in/sign up; middleware can't resolve roles; admin/vendor inaccessible | Existing sessions may still work (claims cached in token) |
| FS-03 | **LocalStorage disabled/silently fails** | Cart, wishlist, compare, recent searches all fail silently | Cached data unavailable; Supabase sync may still work for logged-in users |
| FS-04 | **Apify-scraped data contains invalid/malformed products** | Products may have null names, prices, or broken images | Seed SQL may fail on constraint violation; no data validation layer |
| FS-05 | **PNPM lockfile mismatch in CI** | Build fails due to dependency resolution | None — standard npm/pnpm issue |
| FS-06 | **Turbopack build failure** | Next.js build fails on unsupported webpack features | Fallback to non-turbo build may work |

### 5.2 Data Integrity Failures

| # | Scenario | Impact | Current Mitigation |
|---|----------|--------|-------------------|
| FS-07 | **Orphaned cart_items (cart deleted, items remain)** | `cart_id` FK with CASCADE delete — handled by DB | Proper FK constraint |
| FS-08 | **Orphaned wishlist_items** | Same as FS-07 — CASCADE handles deletion | Proper FK constraint |
| FS-09 | **Product deletion with existing orders** | `on delete restrict` on `order_items.product_id` — prevents deletion | Safe, but admin cannot remove discontinued products with order history |
| FS-10 | **Customer deletion with existing orders** | `on delete restrict` on `orders.customer_id` — prevents deletion | Safe |
| FS-11 | **Address set null on deletion** | `on delete set null` on `orders.shipping_address_id` — lose shipping info | Shipping address lost from order record |
| FS-12 | **Concurrent promotion creation with same priority** | Two admins create promotions with same priority value | No conflict detection |
| FS-13 | **Product slug duplication** | Auto-generated slug may collide with existing slug after name change | DB unique constraint catches it, but error is opaque |

### 5.3 Payment & Order Failures

| # | Scenario | Impact | Current Mitigation |
|---|----------|--------|-------------------|
| FS-14 | **Payment processing fails** | `createMockPaymentService` always succeeds — no real failure path | **NONE** — No retry or fallback logic |
| FS-15 | **Bank transfer payment (3-5 days)** | Order submitted immediately as "confirmed" before payment clears | No payment verification before order confirmation |
| FS-16 | **Order submission DB insert fails** | Mock service doesn't actually persist — no error handling for real DB failures | **NONE** — User sees success toast but order not saved |
| FS-17 | **Shipping address insert fails** | Order created with `shipping_address_id = null` | Partial data loss — no rollback |
| FS-18 | **Customer create succeeds, address insert fails** | Customer created but order link broken | No transaction — inconsistent state |

---

## 6. Exception Scenarios

### 6.1 Unhandled Exceptions

| # | Exception | Trigger | Impact | Location |
|---|-----------|---------|--------|----------|
| EX-01 | `JSON.parse` failure on cart localStorage | Malformed localStorage entry | Cart shown as empty (handled) | `cart-context.tsx:79-86` |
| EX-02 | `new Date(invalidDate).getTime()` → `NaN` | Empty/malformed date strings in promotions | All comparisons with `NaN` return `false` — promotions always "inactive" | `engine.ts:5-6` |
| EX-03 | `getServices()` returns null/undefined | Circular dependency or early import | Crash | `service-registry.ts:38-42` |
| EX-04 | Division by zero in `computeSavingsPercentage` | `original = 0` (free item) | Returns 0 (handled) | `promotions/helpers.ts:9` |
| EX-05 | `Math.max()` with non-numeric values | `discount = NaN` from invalid calculation | Returns `NaN`, cascades through totals | `cart-context.tsx:205` |
| EX-06 | `recharts` chart rendering with empty data | No orders in analytics | Empty chart (handled — empty array) | `analytics/route.ts:94-97` |
| EX-07 | `reduce` on empty array | `items = []` | `getTotalPrice` returns 0 (correct) | `cart-context.tsx:194` |
| EX-08 | `INTL.NumberFormat` with `NaN`/`Infinity` | Price is NaN/Infinity | Formats as `"$NaN"` or `"$∞"` | `catalog-helpers.ts:26` |
| EX-09 | `Promise.all` partial rejection in analytics | One sub-query fails, others succeed | Entire response fails with 500 | `analytics/route.ts:12-47` |

### 6.2 Boundary Conditions

| # | Condition | Behavior |
|---|-----------|----------|
| BC-01 | Page 0 or negative page number | `start = (-1) * 12 = -12`, returns items from index -12 (end-of-array, works but wrong) |
| BC-02 | `pageSize = 0` | Division by zero in `Math.ceil(totalItems / 0)` = `Infinity` |
| BC-03 | `pageSize = 1` | Works correctly but terrible UX |
| BC-04 | `page > totalPages` | Returns empty array |
| BC-05 | `quantity = 0` in `updateQuantity` | Removes item from cart |
| BC-06 | `quantity = -1` in `updateQuantity` | Removes item from cart (>0 check fails, -1 > 0 is false, then `quantity <= 0` triggers remove) |
| BC-07 | Max compare items = 4. Users cannot add 5th. | Toast error, item not added |
| BC-08 | Adding already-existing wishlist item | Silently ignored (no-op) |
| BC-09 | Adding already-existing cart item | Quantity increased by `item.quantity` (not set to `item.quantity`) |
| BC-10 | Rating validation: 0 or 6 (out of 1-5 range) | DB CHECK constraint blocks it; UI may not validate before submit |

---

## 7. Abuse Cases

### 7.1 Financial Abuse

| # | Attack Vector | Method | Impact | Feasibility |
|---|---------------|--------|--------|-------------|
| AB-01 | **System clock manipulation to activate expired promotions** | User sets system clock back to a date when a promotion was active | Applies expired discounts | **HIGH** — Client-side `Date.now()` |
| AB-02 | **System clock manipulation to skip flash sale countdown** | User sets clock forward past `endDate` | "Expired" flash sale still applies on server (no server validation) | **HIGH** |
| AB-03 | **Stacking non-stackable promotions via race** | Send rapid sequential requests that may circumvent non-stackable exclusion | Multiple large discounts applied | **MEDIUM** |
| AB-04 | **Coupon brute-forcing** | Try random coupon codes via the `applyCoupon` function | Free discounts via discovered codes | **LOW** (rate-limiting via Clerk but none on API) |
| AB-05 | **Repeated first_order promotion** | Clear cookies/localStorage, create new account, use first_order discount repeatedly | Unlimited first-order discounts | **MEDIUM** — No server-side first-order check |
| AB-06 | **Negative price via API** | POST/PUT to admin products API with negative price value | Products that "pay" the buyer | **HIGH** — No validation on `price` |
| AB-07 | **Set `stock_quantity` to extremely high value** | Admin API accepts any integer | Infinite inventory | **MEDIUM** |
| AB-08 | **Cart total manipulation** | Modify localStorage cart data directly (price, quantity) | Order with tampered prices | **HIGH** — Client-side trust |

### 7.2 Authorization Abuse

| # | Attack Vector | Method | Impact | Feasibility |
|---|---------------|--------|--------|-------------|
| AB-09 | **Direct admin API access** | Call `/api/admin/*` endpoints directly without proper role check | Unauthorized admin actions | **HIGH** — No auth middleware on admin API routes |
| AB-10 | **Vendor accessing other vendor's products** | Vendor API may not filter by supplier_id — guess other supplier's product IDs | View/modify competitor products | **MEDIUM** |
| AB-11 | **Customer accessing other customer's orders** | Guess order ID in tracking page | View other customers' orders | **LOW** (UUIDs are unguessable) |
| AB-12 | **Order number enumeration** | Sequential-looking `ORD-*` pattern | View all orders | **MEDIUM** — Base36 timestamp pattern is predictable |
| AB-13 | **Admin impersonation via stale session claims** | Clerk session token with outdated role claims still accepted | Persistent admin access after role revocation | **LOW** (tokens have expiry) |

### 7.3 Data Abuse

| # | Attack Vector | Method | Impact | Feasibility |
|---|---------------|--------|--------|-------------|
| AB-14 | **Review spam** | Submit unlimited reviews for any product | Reputation manipulation | **HIGH** — No rate limiting |
| AB-15 | **Review self-verification** | No mechanism to verify purchase → set `verified=false, is_approved=false` | Unverified/unmoderated reviews | **MEDIUM** — Requires admin approval |
| AB-16 | **Testimonial injection** | Submit testimonials with malicious content (XSS, profanity) | Stored XSS if displayed without sanitization | **MEDIUM** |
| AB-17 | **Cart storage exhaustion** | Fill localStorage with many large cart items | localStorage quota exceeded (5MB) | **LOW** |
| AB-18 | **Search query injection** | SQL-like patterns in search (`.ilike.${term}` uses parameterized queries) | Safe — Supabase JS client parameterizes | **LOW** |

### 7.4 Inventory Abuse

| # | Attack Vector | Method | Impact | Feasibility |
|---|---------------|--------|--------|-------------|
| AB-19 | **Cart hoarding** | Add large quantities of in-demand items to cart without purchasing | Artificial scarcity, prevents legitimate purchases | **MEDIUM** — No cart expiry |
| AB-20 | **Wishlist hoarding** | Add unlimited items to wishlist (no max limit) | Performance degradation on wishlist load | **LOW** |
| AB-21 | **Bundle exploitation** | Add 4 cheap tires + expensive single tire — bundle discount applies to average/cheapest | Disproportionate discount on premium items | **LOW** (bundle discount is fixed $100) |

---

## 8. Misuse Cases

### 8.1 Admin Misuse

| # | Case | Description | Impact |
|---|------|-------------|--------|
| MU-01 | **Delete category with active products** | FK constraint `on delete restrict` prevents this | Category cannot be deleted; admin gets opaque error |
| MU-02 | **Delete brand used in promotions** | Brand promotions reference `brand_name` (string, not FK) — no constraint | Promotion silently becomes a no-op (brand name references nothing) |
| MU-03 | **Set duplicate slugs manually** | Admin creates two products with same slug | 500 error on second insert |
| MU-04 | **Assign promotion to non-existent product** | `product_id` FK with `on delete set null` — deleting product sets null | Promotion becomes orphaned |
| MU-05 | **Delete a product that has reviews** | Reviews FK: `on delete cascade` — deleting product deletes all its reviews | Inadvertent review deletion |
| MU-06 | **Toggle show_on_homepage on inactive promotion** | UI allows toggling even when `is_active = false` | Deals section shows nothing useful |
| MU-07 | **Set homepage_order to same value for multiple promos** | No unique constraint on `homepage_order` | Display order is ambiguous |

### 8.2 User Misuse

| # | Case | Description | Impact |
|---|------|-------------|--------|
| MU-08 | **Refresh/back button during checkout** | Browser navigation during checkout steps | Cart state preserved but form state reset |
| MU-09 | **Double-click "Place Order"** | Two rapid clicks before `isSubmitting` state propagates | Two orders submitted | 
| MU-10 | **Add same product to cart multiple times before state update** | Rapid clicking "Add to Cart" on product page | Multiple entries or single item with wrong quantity |
| MU-11 | **Submit blank review** | UI may allow submission of empty title/content | Empty reviews in system |
| MU-12 | **Open product link in new tab while logged in as different user** | Clerk handles multi-session | Cart/wishlist/compare may show previous user's data (mixed context) |
| MU-13 | **Use non-ASCII characters in address** | US ZIP regex rejects non-ASCII postal codes | Form validation error for legitimate foreign addresses |
| MU-14 | **Enter apartment number in street address field** | No separate field for unit/apt | Address normalization issue |
| MU-15 | **Use VPN to access region-locked content** | No region restriction exists | Works fine — no impact |

---

## 9. Data Integrity & Constraints

### 9.1 Missing Constraints

| # | Issue | Table | Risk |
|---|-------|-------|------|
| CI-01 | No unique constraint on `customers.email` | customers | Duplicate customer records |
| CI-02 | No CHECK constraint on `products.price > 0` | products | Negative/zero prices |
| CI-03 | No CHECK constraint on `products.stock_quantity >= 0` | products | Negative stock |
| CI-04 | No CHECK constraint on `products.compare_at_price > 0` | products | Zero compare-at prices causing division by zero |
| CI-05 | No CHECK constraint on `promotions.value >= 0` | promotions | Negative discount values |
| CI-06 | No unique constraint on `carts.user_id, status` for active carts | carts | Multiple active carts for same user |
| CI-07 | No unique constraint on `cart_items.cart_id, product_id` | cart_items | Duplicate product entries in same cart |
| CI-08 | No CHECK constraint on `orders.total >= 0` | orders | Negative order totals |
| CI-09 | No CHECK constraint on `orders.subtotal >= 0` | orders | Negative subtotals |
| CI-10 | No CHECK constraint on `reviews.helpful_count >= 0` | reviews | Negative helpful counts |
| CI-11 | No CHECK constraint on `promotions.value` upper bound for percentage types | promotions | 1000% off discounts |
| CI-12 | No FK constraint from `orders.order_number` to anything (no `order_number` column) | orders | Cannot query orders by order number |

### 9.2 Schema Discrepancies

| # | Catalog Type Field | DB Column | Issue |
|---|-------------------|-----------|-------|
| SD-01 | `Product.images: string[]` | `products.images: text[]` | Aligned — OK |
| SD-02 | `Product.specifications: Record<string, string \| number \| boolean>` | `products.specs: jsonb` | Aligned — OK |
| SD-03 | `Product.stock: number` | `products.stock_quantity: integer` | Different name — mapping required |
| SD-04 | `Product.comparePrice?: number` | `products.compare_at_price: numeric` | Different name — mapping required |
| SD-05 | `Product.isNew: boolean` | `products.is_new: boolean` | Different name — mapping required |
| SD-06 | `Product.isBestSeller: boolean` | `products.is_best_seller: boolean` | Different name — mapping required |
| SD-07 | `Product.reviewCount?: number` | `products.review_count: integer` | Different name — mapping required |
| SD-08 | `Product.category: string` (slug) | `products.category_id: uuid` (FK) | Type mismatch — needs join |
| SD-09 | No `vendor_id` on products table | Products have no vendor ownership | Vendor feature is incomplete |

---

## 10. Security Analysis

### 10.1 Critical Issues

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| SE-01 | **Admin API routes have no authentication** | **CRITICAL** | All `/api/admin/*` routes use only the Supabase service role key — no Clerk auth check. Anyone who discovers the route URL can access admin functionality if the anon key allows it. |
| SE-02 | **Vendor API routes have no authentication** | **CRITICAL** | Same as SE-01 — `/api/vendor/*` routes have no server-side auth. |
| SE-03 | **No CSRF protection on POST/PUT/DELETE** | **HIGH** | All mutation endpoints accept JSON with no CSRF token. |
| SE-04 | **API routes use `createServerClient` which uses service_role key** | **HIGH** | Service role bypasses all RLS. Any middleware compromise grants full DB access. |
| SE-05 | **Card number stored in memory as plain text** | **HIGH** | PaymentInfo interface holds raw `cardNumber`, `expiry`, `cvv`. Not PCI-compliant. |
| SE-06 | **No input sanitization on admin API fields** | **MEDIUM** | Product name, description, and other text fields accept any input. Potential XSS vector. |

### 10.2 Information Disclosure

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| SE-07 | **Error messages expose DB schema details** | **LOW** | Supabase error messages are returned directly in API responses (`error.message`). |
| SE-08 | **Environment variables in `.env.local`** | **HIGH** | Secret keys committed to repo (though `.env.local` is in `.gitignore`). |
| SE-09 | **Analytics endpoint exposes all order data** | **MEDIUM** | No filtering — any authenticated Clerk user with anon key can potentially access `/api/admin/analytics`. |

### 10.3 Rate Limiting & DoS

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| SE-10 | **No rate limiting on any endpoint** | **MEDIUM** | All API routes vulnerable to request flooding. |
| SE-11 | **No pagination limit on admin product list** | **LOW** | GET `/api/admin/products` returns all products without pagination. |
| SE-12 | **No request size limit** | **LOW** | POST/PUT accept arbitrarily large request bodies. |

---

## 11. Cross-Cutting Concerns

### 11.1 Mock vs. Production

| # | Concern | Current State | Risk |
|---|---------|---------------|------|
| CC-01 | `NEXT_PUBLIC_USE_MOCK_SERVICES` flag controls mock vs. real | Not set in `.env.local` → defaults to `"true"` for product, `"false"` for order, inconsistent for others (`service-registry.ts:49-61`) | Production using mocks |
| CC-02 | Payment service is ALWAYS mock | `createMockPaymentService()` always used | No real payment processing |
| CC-03 | Shipping service is ALWAYS mock | `createMockShippingService()` always used | No real shipping integration |
| CC-04 | Cart service is ALWAYS mock | `createMockCartService()` regardless of flag (`service-registry.ts:52`) | No Supabase cart sync |

### 11.2 Performance Concerns

| # | Concern | Location |
|---|---------|----------|
| PC-01 | Product service loads ALL products into memory, client-side | `product-service.ts:18-30` |
| PC-02 | Admin analytics queries all orders (no date range limit for monthlySales) | `analytics/route.ts:43-47` |
| PC-03 | Featured deals page queries PROMOTIONS twice on every load | `featured-deals/page.tsx:25-35` |
| PC-04 | Cart re-syncs ALL items to Supabase on EVERY change | `cart-context.tsx:104-119` |
| PC-05 | `usePromotions` hook re-evaluates on every render with new object reference | `use-promotions.ts:35` |

### 11.3 Accessibility Concerns

| # | Concern | Location |
|---|---------|----------|
| AC-01 | Skip-to-content link present (good) | `layout.tsx:62-66` |
| AC-02 | Sonner toasts may not be screen-reader accessible | `sonner.tsx` |
| AC-03 | Price formatting uses `en-US` locale hardcoded | `catalog-helpers.ts:26` |
| AC-04 | No `aria-label` on interactive cart/wishlist/compare controls | Component files |

### 11.4 Internationalization (i18n)

| # | Concern | Details |
|---|---------|---------|
| I18N-01 | All currency is hardcoded to USD | `formatPrice` |
| I18N-02 | Countries limited to US and Canada | `checkout-types.ts:111` |
| I18N-03 | ZIP code validation is US-only | `checkout-utils.ts:12` |
| I18N-04 | State list is US-only | `checkout-types.ts:113-122` |
| I18N-05 | Canada provinces defined but unused | `checkout-types.ts:124-127` |
| I18N-06 | All UI text is hardcoded English | Entire app |

### 11.5 State Synchronization Issues

| # | Synchronization Gap | Impact |
|---|---------------------|--------|
| SY-01 | Cart localStorage and Supabase sync are unidirectional (local → remote). Multi-tab can cause loss. | Cart data loss |
| SY-02 | Wishlist same pattern as cart | Wishlist data loss |
| SY-03 | Compare state is localStorage only — lost on browser clear | Compare data loss |
| SY-04 | No cross-tab sync via `storage` events | Stale data in other tabs |
| SY-05 | Admin UI uses direct `supabase` import (client-side), not `createServerClient` | RLS policies apply to admin UI differently than API routes |

---

## Summary of Most Critical Issues

### 🔴 Critical Priority (Fix Immediately)

1. **CRITICAL**: `use-checkout-form.ts` — Order submission is a mock `setTimeout`. No real order is created.
2. **CRITICAL**: Admin API routes have no authentication — `api/admin/*` and `api/vendor/*` are wide open.
3. **CRITICAL**: Client-side `Date.now()` for promotion/coupon validation — clock manipulation bypasses discounts.
4. **CRITICAL**: Stock is never decremented on order placement — overselling guaranteed in production.
5. **CRITICAL**: No actual payment integration — `createMockPaymentService` always succeeds.
6. **CRITICAL**: Card details stored in memory as plain text — not PCI-compliant.

### 🟠 High Priority

1. Service registry has inconsistent mock/production configuration.
2. Tax is hardcoded at 8% with no per-jurisdiction logic.
3. Cart sync strategy (clear-and-re-add) causes race conditions in multi-tab scenarios.
4. `bundle` promotion type is never evaluated — silently returns $0.
5. `first_order` promotion has no first-order verification — can be abused repeatedly.
6. Product price validation missing — negative/zero prices accepted via admin API.

### 🟡 Medium Priority

1. No data validation layer between API input and database.
2. Multiple string-based matching instead of FK relationships (brand, category promotions).
3. Postal code validation breaks Canadian addresses.
4. Cart state not shared across browser tabs.
5. No order status lifecycle state machine.
6. No rate limiting on any endpoint.
7. `clearance`/`percentage` promos apply to entire cart, not targeted items.

### 🟢 Low Priority (Nice to Have)

1. Canadian provinces defined but unused.
2. `canProceedToStep` is dead code.
3. No tests anywhere in the project.
4. No Docker/deployment configuration committed.
5. Country name "United States" vs code "US" mismatch.
