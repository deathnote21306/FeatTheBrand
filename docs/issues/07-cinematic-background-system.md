---
title: "Cinematic background system"
milestone: "M1 Design system"
labels: "area:design,type:feature,priority:p1"
---

`<SceneBackground>` component: full-bleed image, gradient overlays for legibility, optional fog drift and light flicker layer (from prototype), static on mobile and reduced motion. Responsive image sizes from Storage.

**Acceptance criteria**
- [ ] Each page picks a background by key
- [ ] No layout shift on load, LCP image prioritized
- [ ] Motion off under prefers-reduced-motion

**Depends on:** #05 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
