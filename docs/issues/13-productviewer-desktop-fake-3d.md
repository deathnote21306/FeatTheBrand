---
title: "ProductViewer: desktop fake 3D"
milestone: "M3 Product page and viewer"
labels: "area:storefront,area:design,type:feature,priority:p0"
---

Port the winning prototype approach. WebGL depth-map tilt following the mouse, garment floating above glowing podium ring, front/back flip. Accepts `media` (front, back, detail, depth maps) or a GLB if the prototype chose that.

**Acceptance criteria**
- [ ] Tilt about ±25°, slow idle sway when the pointer is still (prototype review)
- [ ] Rendered garment stays faithful to the source photo (no visible distortion of logos or prints)
- [ ] 60fps on a mid-range laptop
- [ ] Falls back to static image if WebGL unavailable
- [ ] Same component renders GLB when `viewer_kind = glb`

**Depends on:** #12 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
