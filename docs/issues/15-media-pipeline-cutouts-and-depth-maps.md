---
title: "Media pipeline: cutouts and depth maps"
milestone: "M3 Product page and viewer"
labels: "area:backend,area:design,type:feature,priority:p1"
---

Admin uploads regular photos; pipeline removes background and generates a depth map (service chosen in prototype), stores results in Storage, writes `media` json.

**Acceptance criteria**
- [ ] Upload a photo, get cutout and depth map without manual steps
- [ ] Failures are visible in admin with retry

**Depends on:** #13 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
