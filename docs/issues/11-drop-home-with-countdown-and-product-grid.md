---
title: "Drop home with countdown and product grid"
milestone: "M2 Access and drop"
labels: "area:storefront,type:feature,priority:p0"
---

Mockup screen 3. Drop name, PRIVATE ACCESS, taglines, countdown to close (or to open when scheduled), delivery estimate, product cards with image, code, name, price. Closed state: 'Drop fermé' and no buy buttons.

**Acceptance criteria**
- [ ] After a valid code: ~2 s cinematic intro (light or door reveal), skippable, once per session, skipped under prefers-reduced-motion, then drop home
- [ ] Countdown uses server time offset, not only client clock
- [ ] Scheduled, open and closed states all render
- [ ] Mobile layout matches mockup

**Depends on:** #06, #07, #09 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
