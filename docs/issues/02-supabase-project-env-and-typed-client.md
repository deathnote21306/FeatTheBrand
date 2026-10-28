---
title: "Supabase project, env and typed client"
milestone: "M0 Foundations"
labels: "area:infra,area:backend,type:chore,priority:p0"
---

Create Supabase project on FEAT's account (staging + prod), wire env vars, server and browser clients, generated DB types.

**Acceptance criteria**
- [ ] `.env.example` lists every variable from TECHNICAL_PLAN section 6
- [ ] Types generated from schema via script
- [ ] Server client never exposed to the browser

**Depends on:** none (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
