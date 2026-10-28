---
title: "Manual payment fallback"
milestone: "M5 Gabon payments"
labels: "area:payments,area:admin,type:feature,priority:p1"
---

If the provider is not ready at launch: Gabon order stays `awaiting_payment` with instructions; admin marks it paid with a reference. Counts as collected only once marked.

**Acceptance criteria**
- [ ] Toggle per country in admin
- [ ] Manual payments are flagged in reports

**Depends on:** #21 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
