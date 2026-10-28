---
title: "Admin auth and shell"
milestone: "M7 Admin: catalog and costs"
labels: "area:admin,type:feature,priority:p0"
---

`/admin` behind magic link + `admins` table check. Dark admin layout reusing tokens, nav: Drops, Commandes, Statistiques, Réglages.

**Acceptance criteria**
- [ ] Non-admins get 404
- [ ] 1 to 3 admins manageable from Réglages

**Depends on:** #03, #06 (local issue numbers in `docs/issues/`)
**Refs:** `docs/TECHNICAL_PLAN.md`, `docs/DECISIONS.md`
