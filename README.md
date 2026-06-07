# Maison — Storefront

A production-grade luxury clothing e-commerce storefront built with Next.js 16,
React 19, and TypeScript. Browse a curated catalog across Men, Women, and
Children, manage a cart and wishlist, check out with Stripe, and review past
orders — all from a server-rendered, accessible, SEO-optimized UI.

> **Status:** feature-complete reference implementation (9 of 9 phases). Ready
> to deploy to Vercel.

---

## Demo account

The storefront ships with two pre-seeded users so you can explore authenticated
flows immediately. No real card is required — Stripe runs in mock mode when
keys are not provided.

| Role | Email | Password |
| --- | --- | --- |
| Primary demo user (orders, reviews) | `demo@maison.com` | `maison123` |
| Secondary user (alt wishlist, addresses) | `sophia@example.com` | `maison123` |

**Stripe test card** (when real keys are set): `4242 4242 4242 4242` — any
future expiry, any CVC, any postal code.

---

## Features

- **Storefront** — homepage, Men / Women / Children category landings, product
  listing with filters & sort, product detail pages with image gallery, variant
  picker, reviews, and related items
- **Editorial** — `/collections` index plus four curated collection landing
  pages (The Linen Edit, Quiet Tailoring, Family Pieces, Winter Cashmere) and
  a `/sale` destination
- **Search** — `Cmd/Ctrl + K` overlay with debounced live results, weighted
  ranking (name > brand > tag > description), recent searches, and a dedicated
  `/products?q=…` results page
- **Cart & wishlist** — slide-over cart drawer, full `/cart` page, persistent
  state (Zustand + localStorage), promo codes (`EDIT10`, `WELCOME15`,
  `FREESHIP`), free-shipping threshold logic
- **Auth** — NextAuth v5 with credentials provider, JWT session, Google OAuth
  ready, gated `/account/*` routes via `proxy.ts` middleware
- **Account** — order history, order detail with status timeline, reorder,
  write-a-review (verified-purchase gated), saved addresses, notification
  preferences, wishlist
- **Checkout** — multi-step flow (information → shipping → payment → review →
  success) with real Stripe Payment Intents and a working webhook handler;
  falls back to an in-app mock when Stripe keys are absent
- **Email** — order-confirmation and shipping-update emails via Resend REST
  (falls back to `data/email-log.json` in development)
- **SEO** — `sitemap.xml`, `robots.txt`, JSON-LD (`Organization`, `WebSite`,
  `Product`, `BreadcrumbList`), per-route metadata with canonical + Open Graph
- **Accessibility** — skip link, focus-visible styles, ARIA live regions for
  cart and wishlist counts, keyboard-navigable search overlay and menus,
  semantic landmarks, WCAG AA contrast
- **Performance** — `next/image` everywhere with `fill` + `sizes`, route-level
  loading skeletons, error boundaries, server components by default, React
  Compiler enabled
- **Security** — CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy` lockdown, `X-Powered-By` removed — all set in
  `next.config.ts`
- **Testing** — 82 unit tests (Vitest + jsdom) covering cart totals, shipping
  estimates, filter/sort/paginate logic, search ranking, Zod schemas, and
  utility helpers, plus Playwright E2E covering smoke, auth, cart, search,
  and checkout flows across Chromium and Firefox
- **CI** — GitHub Actions runs lint → typecheck → build → unit → E2E on every
  PR and push to `main`, with Playwright report artifacts on failure

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.2.7 (App Router, Turbopack, React Compiler) |
| UI | React 19.2.4, Tailwind CSS v4 (`@theme` block, no config file) |
| Components | Radix UI primitives, Lucide icons, custom `app/components/ui` |
| State | Zustand (persisted) for cart, wishlist, promo, checkout, user menu |
| Forms | react-hook-form + Zod (schemas in `lib/validations`) |
| Auth | NextAuth v5 (beta) — credentials + Google, JWT sessions |
| Payments | Stripe (Payment Intents + Webhooks + `@stripe/react-stripe-js`) |
| Email | Resend (REST `fetch`, no SDK) |
| Animation | Framer Motion (lazy-loaded where possible) |
| Testing | Vitest + Testing Library + jsdom (unit), Playwright (E2E) |
| Lint / Types | ESLint 9 (flat config), TypeScript 5 strict |
| Deploy target | Vercel |

---

## Quick start

```bash
# 1. Install
git clone <your-fork-url> maison-storefront
cd maison-storefront
npm install

# 2. Environment
cp .env.example .env.local
# Generate an AUTH_SECRET:
openssl rand -base64 32
# Paste it into .env.local. The app runs in mock mode for Stripe and
# falls back to console + data/email-log.json for email without keys.

# 3. Run
npm run dev
# → http://localhost:3000

# 4. Sign in with the demo account above to see authenticated flows.
```

**Verify the full pipeline locally:**

```bash
npm run verify   # lint + typecheck + unit tests + production build
```

---

## Project structure

```
app/
  (auth)/             login, register, forgot-password
  account/            orders, addresses, settings, wishlist
  api/                /api/auth, /api/checkout/*, /api/search
  cart/               cart page
  checkout/           information → shipping → payment → review → success
  collections/        index + 4 [slug] landings
  products/           PLP + PDP
  men | women | children/
  components/         layout, products, cart, account, auth, checkout, home, shared, ui, seo
  layout.tsx          root: fonts, metadata, JSON-LD, skip link
  sitemap.ts          16 static + 28 products + 4 collections
  robots.ts           disallows /account, /checkout, /api
  error.tsx           client boundary (uses unstable_retry in v16.2)
  not-found.tsx       branded 404
  loading.tsx         skeleton loaders (root + per route)

lib/
  auth/               NextAuth config + in-memory user store
  checkout/           orders, stripe client, server actions
  search/             ranked product search
  store/              Zustand stores (cart, wishlist, promo, checkout, user-menu)
  utils/              filterProducts, totals, shipping, slugify, formatPrice
  validations/        Zod schemas (auth, checkout, review, contact)
  email/              Resend client + HTML templates

data/                 mock data (28 products, categories, reviews, editorial, collections)
prisma/               schema.prisma (swap point for a real DB)
types/                product, cart, user, order, next-auth.d
proxy.ts              Next.js 16 middleware (replaces middleware.ts)

tests/
  unit/               Vitest specs (6 files, 82 tests)
  e2e/                Playwright specs (smoke, auth, cart, search, checkout)

.github/workflows/    ci.yml (lint → typecheck → build → unit → e2e)
```

---

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests (single run) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with v8 coverage |
| `npm run test:e2e` | Playwright (headless) |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:headed` | Playwright with a browser window |
| `npm run test:e2e:install` | Install Playwright browsers + OS deps |
| `npm run verify` | lint + typecheck + test + build (full CI parity) |

---

## Architecture notes

- **Server-first.** Pages and layouts are server components by default. Only
  interactive islands (`"use client"`) opt in — the cart drawer, search
  overlay, filter panel, etc.
- **`proxy.ts`, not `middleware.ts`.** Next.js 16 renamed the middleware
  convention. The current file gates `/account/*` and `/account/orders/*`.
- **In-memory persistence.** Orders, reviews, and users live in module-level
  Maps under `lib/auth/users.ts` and `lib/checkout/orders.ts`. The
  `prisma/schema.prisma` file is the swap point — replace the read/write
  helpers there, no UI changes required.
- **Stripe degrades gracefully.** When `STRIPE_SECRET_KEY` is missing, the
  checkout renders a mock card form so the full UI flow can be exercised
  end-to-end without keys.
- **Email degrades gracefully.** When `RESEND_API_KEY` is missing, the app
  logs the rendered email to the console and appends it to
  `data/email-log.json` (gitignored) for inspection.
- **Type-safe paths.** The `@/*` alias is configured in `tsconfig.json`,
  `vitest.config.mts` (via `vite-tsconfig-paths`), and Playwright specs.

---

## Environment variables

See [`.env.example`](./.env.example) for the canonical list. Summary:

| Variable | Required in prod? | Purpose |
| --- | --- | --- |
| `AUTH_SECRET` | **Yes** | NextAuth JWT signing key (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | **Yes** | Stripe client-side publishable key |
| `STRIPE_SECRET_KEY` | **Yes** | Stripe server-side secret key |
| `STRIPE_WEBHOOK_SECRET` | **Yes** | Signing secret for the Stripe webhook |
| `RESEND_API_KEY` | **Yes** | Resend API key for transactional email |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Public origin (used in emails + JSON-LD) |
| `NEXT_PUBLIC_CURRENCY` | No | Display currency (default `USD`) |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | No | Image uploads |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Google OAuth provider |
| `AUTH_URL` / `NEXTAUTH_URL` | No | Auto-detected on most hosts |

In development, only `AUTH_SECRET` is strictly required — the rest fall back
to mocks or console logging.

---

## Deployment

The app is configured for **Vercel**:

1. Push the repository to GitHub.
2. Import it in Vercel (framework preset: **Next.js**).
3. Add the env vars from the table above to the Vercel project.
4. After the first deploy, configure the Stripe webhook to point at
   `https://<your-domain>/api/checkout/webhook` and paste the signing secret
   into `STRIPE_WEBHOOK_SECRET`.
5. Verify security headers:
   ```bash
   curl -I https://<your-domain>/
   # Expect: Content-Security-Policy, Strict-Transport-Security,
   # X-Content-Type-Options, Referrer-Policy, Permissions-Policy
   ```
6. Every PR runs the full CI suite. Merges to `main` trigger a Vercel
   production deploy automatically.

To deploy elsewhere (Render, Fly, a custom Node host), run `npm run build`
and `npm run start` with the same env vars. Set `PORT` if not 3000.

---

## Security

See [`SECURITY.md`](./SECURITY.md) for the full policy. Highlights:

- Coordinated disclosure via `security@maison.example`
- 3-day acknowledgement / 10-day triage SLA
- CSP, HSTS, and `Permissions-Policy` lockdown by default
- Passwords hashed with `bcryptjs` (cost factor 10)
- All server actions validate input with Zod before touching state
- Stripe webhook verifies the `Stripe-Signature` header

---

## Testing strategy

- **Unit (Vitest + jsdom).** Pure-function logic: cart totals, shipping
  estimates, filter/sort/paginate, search ranking, Zod schemas, helpers.
  Run with `npm run test`.
- **E2E (Playwright).** Critical user journeys: browse, search, add to cart,
  full guest checkout, sign-in, sign-out. Run with `npm run test:e2e`
  (requires `npm run test:e2e:install` once).
- **CI.** GitHub Actions orchestrates all of the above on every PR.

When adding a new feature, add a unit test for any non-trivial helper and
extend the E2E suite for any user-facing flow.

---

## Roadmap / swap points

The following are intentionally left as seams for a production migration:

- `lib/auth/users.ts` → Prisma `User` queries
- `lib/checkout/orders.ts` → Prisma `Order` / `OrderItem` / `Address` writes
- `data/products.ts` → Prisma `Product` queries (with a search index like Meilisearch)
- `app/api/checkout/webhook/route.ts` → mark orders `PAID` in the DB on
  `payment_intent.succeeded`
- Local file uploads → S3 / R2 + Cloudinary
- Console + `data/email-log.json` email sink → real Resend production sending
- In-memory cart → server-side cart for cross-device persistence

---

## License

[MIT](./LICENSE) © 2026 Maison contributors.
