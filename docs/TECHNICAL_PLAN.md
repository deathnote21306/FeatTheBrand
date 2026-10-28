# FEAT V2: Technical plan (V1)

Inputs: `PRD_FEAT_V2.pdf`, `assets/reference/mockup-board.jpg`, `DECISIONS.md`.
Issues: one file per issue in `docs/issues/`, pushed to GitHub with `scripts/create-github-issues.sh`.

---

## 1. What V1 is

A private, mobile-first drop portal where FEAT:
1. creates a drop (products, variants, optional caps, open and close times),
2. lets members in with a code, sells during the window, takes payment (Stripe for France, mobile money for Gabon),
3. sees, live, what was ordered vs what was actually collected, enters costs, and gets an estimated profit,
4. keeps clean history by product, size and color to size future stock orders.

Out of V1: WhatsApp automation, multiple languages, roles and permissions, real 3D garment pipeline (unless the prototype shows AI image-to-3D is good enough), customer self-service cancellation.

---

## 2. Architecture

```
Browser (Next.js App Router, RSC + client islands)
  ├─ Storefront  /            access gate
  │              /drop/[slug] drop home, countdown, products
  │              /p/[code]    product page + viewer
  │              /panier, /paiement, /commande/[id]
  │              /mes-commandes (magic link session)
  └─ Admin       /admin/...   drops, products, costs, orders, stats

Next.js server (Vercel)
  ├─ Server actions / route handlers (cart, reserve, checkout, admin CRUD)
  ├─ /api/webhooks/stripe, /api/webhooks/mobile-money
  └─ Cron: close drops, expire reservations, send opening alerts

Supabase
  ├─ Postgres (+ RLS) — single source of truth, timestamps, money in integer cents
  ├─ Auth — magic link for customers and admins
  ├─ Realtime — variant availability broadcast
  └─ Storage — product images, depth maps, GLB files, backgrounds

Third parties: Stripe, Gabon mobile money provider (TBD), Resend (email)
```

### Key technical choices
| Topic | Choice | Why |
|---|---|---|
| Money | integer minor units (EUR cents), XAF computed at the fixed peg 655.957 and stored on the order | Peg is fixed, no FX API; store the rate on each order for audit |
| Fairness under caps | Postgres function `reserve_variant()` with row lock, inside one transaction | First come first served must hold under concurrent checkouts |
| Drop close | enforced in the DB function (`now() < closes_at`), cron only cleans up | A late cron can never let an order through |
| Payment truth | only provider webhooks set `paid` | PRD: unpaid orders never count as collected |
| Payments | `PaymentProvider` interface (`createPayment`, `verifyWebhook`, `refund`) with Stripe and mobile money adapters | Gabon provider unknown, swap without touching checkout |
| Stripe UI | Payment Element embedded, Appearance API dark theme | Keeps the checkout inside the FEAT look (mockup screen 6) |
| Viewer | `<ProductViewer>` accepting `images` (front, back, detail, depth maps) or `glb` | Decision pending prototype; same component either way |
| Motion | WebGL only on desktop with fine pointer, static on mobile and `prefers-reduced-motion` | Requested by Williams, also protects mobile perf |

---

## 3. Data model (Postgres)

```
drops            id, slug, name, status(draft|scheduled|open|closed|in_production|done),
                 access_code_hash, opens_at, closes_at, delivery_estimate_fr, delivery_estimate_ga,
                 hero_background, created_at
products         id, drop_id, code (LS-01), name, subtitle, description, details (fit, material),
                 price_eur_cents, viewer_kind(images|glb), media jsonb, sort
variants         id, product_id, color, color_hex, size, sku, cap (nullable = unlimited)
countries        code (FR|GA), name, currency (EUR|XAF), shipping_fee_minor, payment_provider, active
profiles         user_id, email, full_name, phone, drop_alerts_opt_in
reservations     id, variant_id, qty, cart_id, expires_at  (15 min)
carts            id, user_id nullable, drop_id, created_at
orders           id, number (FEAT-0001), drop_id, user_id, country, currency, fx_rate,
                 subtotal_minor, shipping_minor, total_minor, total_eur_cents,
                 status(awaiting_payment|paid|in_production|preparing|shipped|cancelled|refunded),
                 shipping_address jsonb, created_at (horodatage), paid_at
order_items      id, order_id, variant_id, product_code, product_name, color, size, qty, unit_price_eur_cents
payments         id, order_id, provider, provider_ref, amount_minor, currency, status, raw jsonb, created_at
refunds          id, order_id, amount_minor, reason, provider_ref, created_by, created_at
drop_costs       id, drop_id, kind(production_unit|production_total|shipping|packaging|payment_fees|other),
                 label, amount_eur_cents, per_unit bool
admins           user_id
drop_alert_signups email, created_at
```

Views:
- `variant_availability` (variant_id, cap, paid_qty, reserved_qty, remaining) → Realtime.
- `drop_summary` (orders_count, pieces, ordered_eur, collected_eur, refunded_eur, failed, pending, costs_eur, profit_eur, is_estimate).

### Profit (PRD reference formula)
```
collected   = sum(paid orders, total_eur_cents) - refunds
production  = production_total OR production_unit * paid pieces
profit_est  = collected - production - sum(other costs)
is_estimate = true if no production cost entered OR any cost category flagged "pending"
```
Shipping fees charged to customers are counted in `collected`; FEAT's real shipping cost is a separate cost line. Shown in EUR; Gabon orders converted at the stored rate.

---

## 4. Milestones

| # | Milestone | Outcome |
|---|---|---|
| M0 | Foundations | Repo, Next.js, Supabase, CI, envs, schema v1 |
| M1 | Design system | Tokens, fonts, components, background system matching the mockup |
| M2 | Access and drop | Code gate, magic link, drop home with countdown and product grid |
| M3 | Product page and viewer | Product page, fake-3D desktop viewer, mobile swipe, live stock |
| M4 | Cart and checkout (France) | Cart, reservations, country step, Stripe, confirmation |
| M5 | Gabon payments | Provider spike, adapter, FCFA display, webhook |
| M6 | Orders and email | Order lifecycle, confirmation email, opening alerts, customer order page |
| M7 | Admin: catalog and costs | Drops, products, variants, media upload, costs, countries |
| M8 | Admin: dashboard and stats | Drop dashboard, orders management, refunds, stats |
| M9 | Launch hardening | Legal pages, tests, perf, monitoring, handoff docs |

Critical path: M0 → M1 → M2 → M3 → M4 → M6 → M8 → M9. M5 starts early as a spike (merchant onboarding takes time). M7 can run in parallel with M3 and M4 once the schema exists.

---

## 5. Risks and things to unblock now

1. **Gabon mobile money provider** (highest risk). Need: which providers support Gabon with Airtel Money and Moov Money, onboarding time, fees, whether FEAT has a registered business in Gabon or France that qualifies. Spike issue in M5. Fallback for launch: Stripe card for Gabon + manual "awaiting payment" orders the admin marks paid.
2. **Stripe account** for FEAT: status unknown. Needs a legal entity and bank account.
3. **Brand assets**: logo SVG, font, full-resolution backgrounds. Current backgrounds are WhatsApp-compressed (1080px), too soft for desktop hero.
4. **Legal (France)**: mentions légales, CGV, privacy policy and cookie notice are mandatory. Note: EU distance selling gives a 14-day withdrawal right; the exception for custom-made goods may not cover standard pre-order pieces. "Admin-only refunds" must be checked against this before launch. Not legal advice; FEAT should validate.
5. **Product photos**: regular photos only. The viewer needs clean front and back shots on a plain background, consistent framing. A one-page shooting guide for FEAT is part of M3.

---

## 6. Environments and conventions
- `main` protected, PRs with preview deploys on Vercel, Supabase branching or a separate staging project.
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, mobile money keys, `CRON_SECRET`.
- Migrations in `supabase/migrations`, typed client generated from schema.
- Tests: Vitest for logic (profit, pricing, FX), Playwright for the purchase flow with Stripe test mode, SQL tests for `reserve_variant` concurrency.
- Labels: `area:storefront`, `area:admin`, `area:backend`, `area:design`, `area:payments`, `area:infra`, `type:feature`, `type:spike`, `type:chore`, `priority:p0|p1|p2`, `blocked:client`.
