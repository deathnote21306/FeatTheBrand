---
title: "PaymentProvider interface + Stripe adapter"
milestone: "M4 Cart and checkout (France)"
labels: "area:payments,area:backend,type:feature,priority:p0,blocked:client"
---

Interface `createPayment`, `verifyWebhook`, `refund`. Stripe adapter with Payment Element (card, Apple Pay, Google Pay, Revolut Pay), dark Appearance theme. Webhook sets order `paid`, writes `payments`, converts reservation into a sale.

**Acceptance criteria**
- [ ] Test mode purchase marks order paid only via webhook
- [ ] Failed payment releases hold and shows retry
- [ ] Idempotent webhook handling

**Depends on:** #20 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
