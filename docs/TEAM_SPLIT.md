# FEAT V2: Who does what

Two lanes, so nobody waits on the other and nobody edits the same files.

- **Williams (owner):** accounts, keys, client contact, business decisions, anything FEAT has to sign or provide.
- **Partner (builder):** all application code. Works fully on a local setup (local Supabase via `supabase start`, Stripe test mode), so he is never blocked by missing accounts.

## Williams: 10 issues

| # | Issue | Why it's Williams |
|---|---|---|
| 2 | Supabase project, env and typed client | Creates the Supabase projects, shares keys. Partner writes the client code locally in #1 and #3 |
| 4 | CI and preview deployments | Vercel account and repo settings |
| 8 | Logo slot and brand asset intake | Collecting logo, font, full-res backgrounds from FEAT |
| 17 | Photo guide for FEAT | Client-facing document |
| 23 | Spike: Gabon mobile money provider | Business decision and merchant onboarding with FEAT |
| 41 | Legal pages and consent | Legal texts come from FEAT |
| 44 | Monitoring and handoff docs | Monitoring accounts and the French admin guide for FEAT |
| (no issue) | Stripe account | FEAT creates it; Williams gets test keys to the partner on day one |
| (no issue) | Domain | Ask FEAT if they own one |
| (no issue) | Reviews | Williams reviews and merges the partner's PRs |

## Partner: 34 issues, in order

Start top to bottom. Items in the same step can run in any order.

| Step | Issues | Notes |
|---|---|---|
| 1. Foundations | #1, #3 | #3 runs on local Supabase, does not wait for #2 |
| 2. Design system | #5, #6, #7 | Copy the look from `prototype/`, it is the approved reference |
| 3. Access and drop | #9, #10, #11 | |
| 4. Product page | #12, #13, #14, #15, #16 | Port `prototype/src/viewer/` for #13 and #14 |
| 5. Checkout | #18, #19, #20, #21, #22 | #21 uses Stripe test keys from Williams |
| 6. Orders and email | #26, #27, #28, #29, #30 | #27 and #28 need a Resend key from Williams |
| 7. Admin | #31, #32, #33, #34, #35 | |
| 8. Dashboard and stats | #36, #37, #38, #39, #40 | |
| 9. Gabon | #24, #25 | #24 waits for Williams's decision in #23; #25 can be built any time after #21 |
| 10. Launch | #42, #43 | |

## Hand-off points (where one lane unblocks the other)

| Williams delivers | Unblocks partner on |
|---|---|
| Repo access | Everything |
| Stripe test keys | #21 |
| Resend API key | #27, #28 |
| Supabase staging keys + Vercel preview (#2, #4) | Deploying previews; local work continues without them |
| Gabon provider choice + sandbox keys (#23) | #24 |
| Logo SVG, font (#8) | Swapping placeholders in #5 and the `<Logo>` component |
| Legal texts (#41) | Linking them at checkout in #20 |

## Working rules

- One branch and one PR per issue, named `feat/<issue-number>-short-name`, with `Closes #N` in the PR.
- Williams reviews before merge. `main` stays deployable.
- Keys travel through a password manager or direct message, never in the repo. The repo is public.
- Questions about product rules: check `docs/DECISIONS.md` first, then ask Williams. Don't guess on money or stock logic.

## Partner onboarding checklist

1. Accept the GitHub repo invite.
2. Read, in order: `docs/DECISIONS.md`, `docs/TECHNICAL_PLAN.md`, this file, `prototype/NOTES.md`.
3. Run the prototype (`cd prototype && npm install && npm run dev`) and click through every screen.
4. Install Docker and the Supabase CLI for local development.
5. Pick up #1.
