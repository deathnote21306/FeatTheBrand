---
title: "Mobile money adapter"
milestone: "M5 Gabon payments"
labels: "area:payments,area:backend,type:feature,priority:p0"
---

Implement the chosen provider behind `PaymentProvider`: push or redirect flow, webhook verification, status polling fallback, FCFA amounts.

**Acceptance criteria**
- [ ] Sandbox payment marks order paid via webhook
- [ ] Timeout and cancel paths release holds

**Depends on:** #23, #21 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
