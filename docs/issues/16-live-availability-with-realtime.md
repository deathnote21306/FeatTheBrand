---
title: "Live availability with Realtime"
milestone: "M3 Product page and viewer"
labels: "area:storefront,area:backend,type:feature,priority:p1"
---

Mockup screen 8. `variant_availability` view broadcast via Supabase Realtime, stock bars update for everyone, low stock turns red, 'Épuisé' state.

**Acceptance criteria**
- [ ] Two browsers see the same count within 2 seconds of a payment
- [ ] No bar shown for uncapped variants

**Depends on:** #12, #19 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
