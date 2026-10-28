---
title: "Order lifecycle and status transitions"
milestone: "M6 Orders and email"
labels: "area:backend,type:feature,priority:p0"
---

Allowed transitions: awaiting_payment → paid | cancelled; paid → in_production → preparing → shipped; paid or later → refunded. Status history table with who and when.

**Acceptance criteria**
- [ ] Invalid transitions rejected server-side
- [ ] History visible in admin

**Depends on:** #21 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
