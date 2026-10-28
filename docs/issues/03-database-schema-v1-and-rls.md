---
title: "Database schema v1 and RLS"
milestone: "M0 Foundations"
labels: "area:backend,type:feature,priority:p0"
---

Migrations for all tables in TECHNICAL_PLAN section 3, enums for statuses, money as integer minor units, RLS: customers read their own orders, public reads only open or scheduled drops after access, admins full access via `admins` table.

**Acceptance criteria**
- [ ] Migrations apply cleanly on a fresh DB
- [ ] RLS tests: a customer cannot read another customer's order
- [ ] Seed script creates DROP_01 with the 4 mockup products, 2 colors, S to XL, FR and GA countries

**Depends on:** #02 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
