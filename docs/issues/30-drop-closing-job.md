---
title: "Drop closing job"
milestone: "M6 Orders and email"
labels: "area:backend,type:feature,priority:p0"
---

Cron every minute: set status `closed` after `closes_at`, expire reservations, cancel stale `awaiting_payment` orders after grace period.

**Acceptance criteria**
- [ ] No order can be paid for a closed drop unless it started before close and pays within the hold
- [ ] Job is idempotent and protected by CRON_SECRET

**Depends on:** #20 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
