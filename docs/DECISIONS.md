# FEAT V2: Decisions log

Source: PRD (`docs/PRD_FEAT_V2.pdf`), mockup board (`assets/reference/mockup-board.jpg`), discovery Q&A with Williams (decision maker), 2026-10-24.

## Project
- Engagement: favor, no fixed deadline. Milestones set by us.
- Team: Williams + Claude now, others will join later, so issues must be self-contained with acceptance criteria.
- Accounts: services run on FEAT's own accounts (Vercel, Supabase, Stripe, domain). Williams gets access.
- Repo: Williams's GitHub account, transferred to a FEAT org later.

## Stack
- Next.js (App Router, TypeScript) + Tailwind
- Supabase: Postgres, Auth (magic link), Realtime (live stock), Storage (product images)
- Stripe for France (card, Apple Pay, Google Pay, Revolut Pay). FEAT Stripe account status: unknown.
- Mobile money provider for Gabon (Airtel Money, Moov Money), e.g. CinetPay. Needs FEAT merchant account.
- Resend for email. Vercel hosting.

## Product rules
- Access: shared drop access code to enter + email magic link to identify buyer and see orders.
- Stock: optional cap per product variant. Empty cap = unlimited pre-order. Show "27 / 50" bars only when capped.
- Reservation: piece held 15 min during checkout, released if unpaid.
- Currency: price set in EUR. Gabon sees FCFA at the fixed peg (1 EUR = 655.957 XAF).
- Shipping: flat fee per country, set by admin.
- Refunds: admin only, case by case, from dashboard. No customer cancel button.
- Emails: order confirmation, drop opening alerts (opt-in checkbox). WhatsApp: simple contact link only.
- Admins: 1 to 3 people, same rights.
- Language: French only.
- First drop: unknown, use mockup products as demo data (LS-01 T-shirt manches longues 45 EUR, HD-01 Hoodie 70 EUR, PT-01 Pantalon 65 EUR, BN-01 Bonnet 25 EUR; colors black and white; sizes S to XL).

## Visual direction
- Faithful reproduction of the mockup board: dark, cinematic, thin borders, squared tech display font, wide letter spacing, white primary CTA.
- Backgrounds: the provided AI renders (monolith, light slit, podium, FEAT cube, rocks). Subtle animated loops in V1 with static fallback.
- Brand assets (logo SVG, font, full-res backgrounds): not yet received. Use placeholders; the logo must never be redrawn in production.

## Product viewer ("3D")
- FEAT only has regular photos (front, back, detail), no turntable shoot.
- Desktop: fake 3D. Cutout garment + AI depth map + WebGL tilt following the mouse, floating above glowing podium ring, front/back flip.
- Mobile: no motion. Static hero, swipe between front, back, detail.
- Also prototype AI image-to-3D (Meshy, Tripo, Hunyuan3D) and compare with the fake 3D before deciding.
- Viewer component must accept either image sets or a GLB model.

## Background asset map (`assets/backgrounds`, WhatsApp-compressed, 1080px wide)
- bg-01: corridor with golden light slit (good for access page)
- bg-02: plain black cube on rocks
- bg-03: 4x2 contact sheet (portrait crops)
- bg-04, bg-05: FEAT engraved cube (confirmation page)
- bg-06: doorway with light slit (drop home hero)
- bg-07: glowing podium (product page)
- bg-08: corridor, light slit
- bg-09: 3x3 contact sheet
- bg-10: 4x2 contact sheet incl. confirmation screen

## Prototype review (2026-10-27)
- Direction approved: overall look, backgrounds, relief photo viewer (viewer A). Prototype in `prototype/` is the visual reference for the build.
- Image quality (backgrounds, garments) is fixed by real assets from FEAT, not by design work.
- Viewer must stay true to the real product photos; add more motion on desktop: tilt widened to about ±25° and a slow idle sway when the mouse is still.
- After entering the code: a short cinematic intro (about 2 s, door or light reveal, skippable, shown once per session, off under reduced motion), then the drop home.
- Desktop product page layout (info panel on the right vs info under the garment): decide during the build by trying both.
- Price format: `45,00 €`.
