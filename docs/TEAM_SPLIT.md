# FEAT V2: Who does what

22 issues each. Split by layer so you rarely touch the same files:

- **Williams (@deathnote21306): backend, money and client.** Database, payments, order logic, emails, costs and profit numbers, plus everything that involves accounts or FEAT.
- **Aymane (@theaboy): frontend and UI, code only.** Design system, every customer-facing page, the product viewer, cart and checkout screens, admin screens.

The contract between the two lanes is the database schema (#3) and the server functions Williams exposes (reserve, checkout, order status). Aymane builds screens against them.

## Williams: 22 issues

**Accounts and client (7)**

| # | Issue |
|---|---|
| 2 | Supabase project, env and typed client |
| 4 | CI and preview deployments |
| 8 | Logo slot and brand asset intake |
| 17 | Photo guide for FEAT |
| 23 | Spike: Gabon mobile money provider |
| 41 | Legal pages and consent |
| 44 | Monitoring and handoff docs |

**Backend and money code (15)**

| Step | Issues |
|---|---|
| 1. Data | #3 schema and RLS |
| 2. Stock | #19 reserve_variant and 15 min holds |
| 3. Payments | #21 Stripe adapter, #25 manual payment fallback, #24 mobile money adapter |
| 4. Orders | #26 order lifecycle, #30 drop closing job, #27 confirmation email, #28 drop opening alerts |
| 5. Money in admin | #34 costs entry, #35 countries and shipping settings, #36 drop dashboard, #38 refunds |
| 6. Stats | #39 global and per drop, #40 product, size, color |

## Aymane: 22 issues

| Step | Issues | Notes |
|---|---|---|
| 1. Foundations | #1 | Start here, Williams builds #3 on top |
| 2. Design system | #5, #6, #7 | Copy the look from `prototype/`, the approved reference |
| 3. Access and drop | #9, #10, #11 | Needs #3 merged |
| 4. Product page | #12, #13, #14, #15, #16 | Port `prototype/src/viewer/` for #13 and #14 |
| 5. Cart and checkout | #18, #20, #22 | #20 calls Williams's #19, #22 shows status from #21 |
| 6. Customer account | #29 | |
| 7. Admin screens | #31, #32, #33, #37 | #31 is the admin shell Williams's #34 to #36 plug into |
| 8. Launch | #42, #43 | End-to-end tests and the mobile performance pass |

## Hand-off points

| Who delivers | What | Unblocks |
|---|---|---|
| Williams | Repo access, local setup help | Everything for Aymane |
| Aymane | #1 app skeleton | Williams's #3 |
| Williams | #3 schema | Aymane's #9 onward |
| Aymane | #6 core components, #31 admin shell | Williams's admin screens #34, #35, #36 |
| Williams | #19 reserve function | Aymane's #20 checkout |
| Williams | #21 Stripe (test keys) | Aymane's #22 confirmation, #42 e2e tests |
| Williams | #26 order statuses | Aymane's #29 and #37 |
| Williams | #8 logo and font from FEAT | Swapping placeholders in Aymane's #5 |

## Working rules

- One branch and one PR per issue, named `feat/<issue-number>-short-name`, with `Closes #N` in the PR.
- Each of you reviews the other's PRs. `main` stays deployable.
- Keys travel through a password manager or direct message, never in the repo. The repo is public.
- Product rules live in `docs/DECISIONS.md`. Don't guess on money or stock logic, ask.

## Aymane's onboarding checklist

1. Accept the GitHub repo invite.
2. Read, in order: `docs/DECISIONS.md`, `docs/TECHNICAL_PLAN.md`, this file, `prototype/NOTES.md`.
3. Run the prototype (`cd prototype && npm install && npm run dev`) and click through every screen.
4. Install Docker and the Supabase CLI for local development.
5. Pick up #1.
