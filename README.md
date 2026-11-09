# FEAT V2

Private pre-order portal for FEAT drops: private access, limited-time drops, orders and payments (France and Gabon), and a drop dashboard (ordered vs collected, costs, estimated profit).

- `docs/TECHNICAL_PLAN.md`: architecture, data model, milestones, risks
- `docs/DECISIONS.md`: product and design decisions
- `docs/issues/`: issue sources (pushed with `scripts/create-github-issues.sh owner/repo`)
- `docs/DESIGN_TOKENS.md`: colors, type scale, spacing (preview at `/dev/tokens`)
- `prototype/`: throwaway visual prototype, the visual reference for the build (see `prototype/NOTES.md`)

Placeholder assets: the LS-01 garment in the prototype is from Wikimedia Commons (CC BY-SA 4.0, by User:Bodhisattwa), modified. Credits in `prototype/NOTES.md`.

## Setup

Requirements: Node 20+ and pnpm (`corepack enable` picks up the version pinned in `package.json`).

```bash
pnpm install
cp .env.example .env.local   # fill in values (Supabase, Stripe, Resend…)
pnpm dev                     # http://localhost:3000
```

| Script              | What it does                     |
| ------------------- | -------------------------------- |
| `pnpm dev`          | Dev server                       |
| `pnpm build`        | Production build                 |
| `pnpm lint`         | ESLint                           |
| `pnpm typecheck`    | Generate route types, run `tsc`  |
| `pnpm format`       | Prettier (with Tailwind sorting) |
| `pnpm format:check` | Prettier check (for CI)          |

## Layout

```
app/(store)/   storefront routes (access gate, drop, product, cart, checkout)
app/admin/     admin routes
components/    shared UI components
lib/           server and client helpers (Supabase, payments, money…)
supabase/      migrations and config
prototype/     Vite visual prototype, separate package, not part of the app
```

Imports use the `@/` alias from the repo root, e.g. `import { x } from "@/lib/x"`.
