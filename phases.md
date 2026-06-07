# Maison — Phases & Resume Guide

> Project: multi-page luxury clothing e-commerce store (Men / Women / Children).
> Working dir: `E:\VS-CODES\00-cloting`
> Stack: Next.js 16.2.7, React 19.2.4, TypeScript 5, Tailwind v4, Prisma (schema only), NextAuth v5, Stripe, Zustand, Framer Motion, Lucide, Radix UI, react-hook-form + Zod.

## How to resume

1. `cd E:\VS-CODES\00-cloting`
2. `npm run dev` (or `npm run build` to verify)
3. Paste this whole file (or relevant phase) as context, then say "Start Phase N".

## Status (9 of 9 phases complete)

| # | Phase | Status |
|---|---|---|
| 1 | Project setup, design system, layout, homepage | ✅ Done |
| 2 | Product listing, detail pages, filters | ✅ Done |
| 3 | Cart (drawer + page) + wishlist | ✅ Done |
| 4 | Auth (login, register, account) | ✅ Done |
| 5 | Checkout + Stripe | ✅ Done |
| 6 | Search, collections, sale page | ✅ Done |
| 7 | Reviews, order history, notifications | ✅ Done |
| 8 | Performance, SEO, a11y audit | ✅ Done |
| **9** | **Testing, CI/CD, deploy (Vercel)** | **✅ Done** |

**Build:** `npm run build` passes. `npm run lint` clean. `npm run typecheck` clean.
**Tests:** `npm run test` → 82 passing across 6 suites. `npm run test:e2e` (Playwright) covers smoke/auth/cart/search/checkout.
**CI:** `.github/workflows/ci.yml` runs lint → typecheck → build → unit → e2e on every PR + push to `main`.
**Deploy:** Security headers in `next.config.ts`. `SECURITY.md` published. `.env.example` documents required vs optional vars.

## Conventions (apply to all remaining work)

- **Routing:** App Router, `proxy.ts` (not `middleware.ts`) in v16. `searchParams` and `params` are async — always `await` them in server components.
- **Styling:** Tailwind v4 with `@theme` block in `app/globals.css`. No `tailwind.config.ts`. Use `container-app` class for max-width wrappers.
- **Components:** Server by default; mark `"use client"` only when needed. Co-locate page-specific client components in `app/components/`.
- **Forms:** `react-hook-form` + `@hookform/resolvers/zod` + Zod schemas in `lib/validations/`.
- **State:** Zustand for global client state (cart, wishlist, promo, checkout, user menu). Persist to `localStorage` via `zustand/middleware`. Per-component state via `React.useState`.
- **Mock data:** `data/products.ts` (28 products), `data/categories.ts`, `data/reviews.ts`, `data/editorial.ts`. Swap to Prisma when DB is connected.
- **No DB yet:** all server-side persistence is in-memory in `lib/auth/users.ts` and `lib/checkout/orders.ts`. `prisma/schema.prisma` is the swap point.
- **Stripe:** real if `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `STRIPE_SECRET_KEY` are set; otherwise mock form runs (test cards: 4242/5555/3782).
- **Auth:** NextAuth v5 with credentials provider, JWT session. `proxy.ts` protects `/account`, `/account/orders`, `/account/addresses`, `/account/settings`. Demo user: `demo@maison.com` / `maison123`.
- **Lint gotchas:** escape apostrophes (`&apos;`) and quotes (`&ldquo;`/`&rdquo;`) in JSX. Don't call `setState` synchronously inside `useEffect` (use lazy `useState` initializers or `key`-driven remounts). Use `useWatch` from RHF (not `watch()`) for subscribed field values. Lucide-react brand icons (Instagram/Twitter/Facebook/YouTube) are not exported — use `app/components/shared/social-icons.tsx`.
- **Build verification:** Always run `npm run build` + `npm run lint` + `npx tsc --noEmit` at end of each phase. Report results in summary.

## Phase 6 — Search, Collections, Sale

**Priority:** 🟡 Medium

**Scope:**
- Search overlay (Cmd/Ctrl+K) with live results
- Dedicated `/collections` index page
- `/collections/[slug]` editorial landing pages (3–4 collections)
- `/sale` page (filterable, all products where `isBestseller`/`salePrice` set)

**Deliverables:**

1. **Search**
   - `lib/search/search.ts` — pure-function search: matches product name, brand, description, subCategory, tags. Weighted ranking.
   - `app/components/shared/search-overlay.tsx` — replaces the current placeholder input in Navbar. Cmd/Ctrl+K shortcut, arrow-key nav, recent searches (localStorage), debounced query.
   - Empty state, no-results state, popular categories shortcut.
   - `/api/search` route returning JSON for direct linking (optional, low priority).

2. **Collections**
   - `data/collections.ts` — add 3–4 editorial collections (e.g. "The Linen Edit", "Quiet Tailoring", "Family Pieces") with hero image, description, curated product list (`productIds: string[]`).
   - `app/collections/page.tsx` — index of all collections (3–4 cards in editorial grid).
   - `app/collections/[slug]/page.tsx` — single collection landing: hero, description, product grid, "Featured story" callout. Use `generateStaticParams` like PDPs.
   - `app/components/collections/collection-card.tsx`, `collection-hero.tsx`.
   - Add `/collections` to Navbar mega menu (already has placeholder link).

3. **Sale page**
   - `app/sale/page.tsx` — editorial landing with filtered product grid. Use existing PLP components (`ProductGrid`, `ProductFiltersPanel`, `ProductSort`).
   - Filter: `salePrice !== null OR tags includes 'sale'`. For 28 products, ~5–8 sale items.
   - `app/components/sale/sale-hero.tsx` — dark editorial hero with marquee badge, "Up to 40% off" copy.
   - Update Navbar mega menu Sale link to point to `/sale`.

**Files to know:**
- `app/components/layout/navbar.tsx` (has placeholder search input at line ~283)
- `data/products.ts` (28 products, has `salePrice` field)
- `app/products/page.tsx` (PLP pattern to reuse for /sale)
- `app/components/products/product-grid.tsx`, `product-card.tsx` (reusable)
- `app/components/shared/announcement-bar.tsx` (marquee pattern to mirror for sale hero)

**Build & verify:** `npm run build && npm run lint && npx tsc --noEmit`

## Phase 7 — Reviews, Order History, Notifications

**Priority:** 🟢 Low

**Scope:**
- "Write a review" form on PDP (gated to logged-in users with a past order)
- Order detail page at `/account/orders/[orderId]` with status timeline
- Email notifications via Resend (or console.log stub): order confirmation, shipping update
- Notification preferences in `/account/settings` (checkboxes that actually save — currently disabled)

**Deliverables:**

1. **Reviews**
   - `lib/validations/review.ts` — Zod schema (rating 1–5, title 3–80 chars, comment 10–2000)
   - `app/account/orders/[orderId]/write-review/[productId]/page.tsx` — review form (or modal from PDP)
   - "Verified purchase" badge logic
   - Update `data/reviews.ts` shape or wire to a new in-memory store

2. **Order detail**
   - `app/account/orders/[orderId]/page.tsx` — full order details: items, shipping/billing addresses, payment summary, status timeline (Pending → Processing → Shipped → Delivered)
   - Reorder CTA
   - "Track package" link (placeholder)

3. **Email notifications**
   - `lib/email/resend.ts` — lazy Resend client init (`RESEND_API_KEY`)
   - Email templates (React Email or HTML strings): order confirmation, shipping confirmation
   - Send from `placeOrderAction` in `app/checkout/actions.ts`
   - In demo mode (no `RESEND_API_KEY`), log to console and write to `data/email-log.json` (dev only)

4. **Notification preferences**
   - Replace disabled checkboxes in `app/account/settings/page.tsx` with functional state
   - Add `notificationPreferences` to user model (Prisma: `String[]` on User; or localStorage for demo)
   - Persist via existing `updateProfileAction` or new `updatePreferencesAction`

**Files to know:**
- `app/products/[slug]/page.tsx` (PDP — add review form)
- `app/components/products/reviews-section.tsx` (existing reviews display)
- `app/account/orders/page.tsx` (link to detail)
- `app/checkout/actions.ts` (hook for email)
- `lib/auth/users.ts` (user store for preferences)

## Phase 8 — Performance, SEO, Accessibility

**Priority:** 🟡 Medium

**Scope:**
- SEO: metadata for all dynamic routes, `sitemap.ts`, `robots.ts`, structured data (Product/BreadcrumbList/Organization JSON-LD)
- Performance: image optimization audit, bundle analysis, route-level loading.tsx, error.tsx, not-found.tsx polish
- Accessibility: focus management, ARIA audit, color contrast, keyboard nav, skip links

**Deliverables:**

1. **SEO**
   - `app/sitemap.ts` — generate from all products, categories, collections, static routes
   - `app/robots.ts` — disallow `/account/*`, `/checkout/*`, `/api/*`
   - JSON-LD: `Product` schema on PDPs, `BreadcrumbList` on PLP/PDP/Collection, `Organization` site-wide
   - `generateMetadata` improvements: OG images, Twitter cards, canonical URLs
   - Verify `robots.txt` and OpenGraph in dev tools

2. **Performance**
   - Audit `next/image` usage — all product images use `fill` + `sizes`. Add `priority` to above-the-fold hero images.
   - Add `loading.tsx` and `error.tsx` for major route segments (`app/products/loading.tsx`, etc.)
   - Replace any client component that doesn't need to be client (review Navbar, CartDrawer — only the interactive bits need `"use client"`)
   - Run `next build --profile` or `@next/bundle-analyzer` to find big chunks
   - Check Framer Motion usage — lazy-load where possible

3. **Accessibility**
   - Full keyboard nav pass (tab order, focus visible, escape to close menus/drawers)
   - ARIA labels on all icon-only buttons (already mostly done)
   - Color contrast — verify `text-muted` and `text-muted-foreground` meet WCAG AA against backgrounds
   - Form labels — confirm all inputs have associated `<label>` (already done in forms)
   - Live regions for cart count, wishlist count, toast notifications
   - Skip link in root layout (already added)

**Files to know:**
- `app/layout.tsx` (root metadata)
- `app/products/[slug]/page.tsx` (PDP metadata + JSON-LD opportunity)
- `app/globals.css` (focus-visible style)
- `app/components/layout/navbar.tsx` (focus management for menus)
- `app/components/cart/cart-drawer.tsx` (aria-modal, focus trap)

## Phase 9 — Testing, CI/CD, Deploy (DONE)

**What landed:**

- **Unit tests (Vitest + jsdom)** — 82 tests across 6 suites: `tests/unit/{review,totals,shipping,filterProducts,search,utils}.test.ts`. Config: `vitest.config.mts` with `vite-tsconfig-paths` for `@/*` alias resolution.
- **E2E tests (Playwright)** — Chromium + Firefox, baseURL `http://localhost:${PORT}`. Specs: `tests/e2e/{smoke,auth,cart,search,checkout}.spec.ts`.
- **CI** — `.github/workflows/ci.yml` on PR + push to `main`: `npm ci` → lint → typecheck → build → unit tests → install Playwright browsers → e2e. Uploads `playwright-report/` on failure. Concurrency cancels in-progress runs per ref.
- **Security headers** — `next.config.ts` `headers()` sets CSP (Stripe + Resend + Cloudinary allow-listed), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` lockdown, `Strict-Transport-Security` (2 years, preload), removes `X-Powered-By`. Loosened CSP for `/checkout/*` + `/account/*` to allow Stripe iframe.
- **Security policy** — `SECURITY.md` with reporting flow (security@maison.example), 3-day ack / 10-day triage SLA, coordinated disclosure, safe harbor.
- **Env documentation** — `.env.example` rewritten with required vs optional sections, real generation command for `AUTH_SECRET`, test-card note, placeholder values documented.
- **Gitignore** — added `coverage/`, `test-results/`, `playwright-report/`, `playwright/.cache`.

**New scripts (`package.json`):**
- `npm run typecheck` — `tsc --noEmit`
- `npm run test` / `test:watch` / `test:coverage`
- `npm run test:e2e` / `test:e2e:ui` / `test:e2e:headed` / `test:e2e:install`
- `npm run verify` — `lint && typecheck && test && build`

**Manual deployment steps (not in CI):**
1. Connect repo to Vercel.
2. Add the env vars from `.env.example` to the Vercel project. **Required in production:** `AUTH_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`. **Optional:** `CLOUDINARY_*`, Google OAuth.
3. Point Stripe webhook at `https://<domain>/api/checkout/webhook` and copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
4. First deploy — Vercel will build with the CSP headers from `next.config.ts`; verify `curl -I https://<domain>/` shows the security headers.

## Key existing files (don't recreate)

- `app/page.tsx` — homepage
- `app/products/page.tsx` + `app/products/[slug]/page.tsx` — PLP + PDP
- `app/men|women|children/page.tsx` — category landings (all use `CategoryPage`)
- `app/cart/page.tsx` + `app/cart/cart-view.tsx` — cart page
- `app/account/wishlist/page.tsx` — wishlist page
- `app/account/{orders,addresses,settings}/page.tsx` — account sections
- `app/auth/{login,register,forgot-password}/page.tsx` — auth pages
- `app/checkout/{information,shipping,payment,review,success}/page.tsx` — checkout steps
- `app/components/{layout,products,cart,account,auth,checkout,home,shared,ui}/*` — component library
- `lib/{store,utils,auth,checkout,validations}/*` — logic
- `data/{products,categories,reviews,editorial}.ts` — mock data
- `types/{product,cart,user,order,next-auth.d}.ts` — types
- `prisma/schema.prisma` — DB schema (not yet migrated)

## After all 9 phases

The app is a production-ready reference implementation. Swap points clearly marked:
- `lib/auth/users.ts` → Prisma User queries
- `lib/checkout/orders.ts` → Prisma Order/OrderItem/Address writes
- `lib/checkout/stripe.ts` → already real
- `data/products.ts` → Prisma Product queries
- `app/api/checkout/webhook/route.ts` → mark orders PAID in DB on `payment_intent.succeeded`
