---
title: "Access gate with drop code"
milestone: "M2 Access and drop"
labels: "area:storefront,type:feature,priority:p0"
---

Mockup screen 1. Code entry verifies against `access_code_hash` server-side, sets a signed httpOnly cookie scoped to the drop, rate limited. 'Accéder avec votre email' leads to screen 2.

**Acceptance criteria**
- [ ] Wrong code shows an error, 5 failed tries per minute max
- [ ] Valid code lands on the drop home
- [ ] Direct URL to a drop without cookie redirects to the gate

**Depends on:** #03, #06, #07 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
