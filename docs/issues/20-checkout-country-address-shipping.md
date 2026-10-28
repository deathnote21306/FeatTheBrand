---
title: "Checkout: country, address, shipping"
milestone: "M4 Cart and checkout (France)"
labels: "area:storefront,type:feature,priority:p0"
---

Mockup screen 6 first part. Country (France or Gabon) sets currency, flat shipping fee and payment methods. Address form per country (Gabon: city, quartier, phone). Fees and delivery estimate shown before paying.

**Acceptance criteria**
- [ ] Totals shown in the right currency with shipping
- [ ] Validation per country
- [ ] Order created as `awaiting_payment` with timestamp and stored fx_rate

**Depends on:** #18, #19 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
