---
title: "Drop dashboard"
milestone: "M8 Admin: dashboard and stats"
labels: "area:admin,type:feature,priority:p0"
---

PRD page 4. Tiles: Commandes, Quantités, Encaissé, Bénéfice estimé. Plus ordered vs collected, pending, failed, refunded, costs breakdown, estimate badge. All from `drop_summary`.

**Acceptance criteria**
- [ ] Numbers match a hand calculation on seed data (unit test on the view)
- [ ] Ordered and collected never mixed
- [ ] Updates live during an open drop

**Depends on:** #34 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
