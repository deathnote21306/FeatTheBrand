---
title: "reserve_variant() and 15 min holds"
milestone: "M4 Cart and checkout (France)"
labels: "area:backend,type:feature,priority:p0"
---

Postgres function: locks variant row, checks drop open and `paid + reserved + qty <= cap`, inserts reservation with `expires_at = now() + 15 min`. Release on payment failure or expiry (cron + lazy cleanup).

**Acceptance criteria**
- [ ] Concurrency test: 50 parallel reservations on cap 10 yields exactly 10
- [ ] Expired holds free stock
- [ ] Uncapped variants never block

**Depends on:** #03 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
