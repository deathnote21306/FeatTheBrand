---
title: "Drop opening alerts"
milestone: "M6 Orders and email"
labels: "area:backend,type:feature,priority:p1"
---

Cron at `opens_at` sends an email to opted-in members with the drop link. Unsubscribe link.

**Acceptance criteria**
- [ ] Sent once per drop
- [ ] Unsubscribe removes the opt-in

**Depends on:** #10 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
