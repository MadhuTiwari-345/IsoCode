# HOMIQ

**A residential discovery and sales workspace for better buyer conversations.**

HOMIQ brings buyer enquiries, multilingual assistance, site-visit scheduling and sales follow-up into one calm, mobile-first experience.

[Live application](https://isocode-homiq.vercel.app) · [Source code](https://github.com/MadhuTiwari-345/IsoCode) · [Deployment guide](deployment.md) · [Technical design](docs/Technical-Design-Document.md)

## Product

For a residential developer managing enquiries across property portals, social campaigns, its website and offline campaigns, HOMIQ provides:

- **One lead inbox:** source attribution, buyer preferences, duplicate flags and consent status.
- **Multilingual concierge:** guided English, Hindi and Gujarati qualification with fact-sheet-grounded answers.
- **Human handoff:** a buyer can request a person; the lead, transcript and summary are routed for sales follow-up.
- **Visit scheduling:** future open slots, capacity-aware booking and booking confirmations.
- **Sales workspace:** lead review, visit outcomes, source reporting and sales-head fact/slot management.
- **Reminder audit:** a protected scheduled worker records mock reminder outcomes and respects consent and opt-outs.

## Stack

Next.js 16 · React 19 · TypeScript 6 · Payload CMS 4 · MongoDB · Tailwind CSS 4 · Gemini API · Vercel · GitHub Actions

## Current release

| Check | Verified state |
| --- | --- |
| Production deployment | [READY on `main`](https://vercel.com/mt1499961-2971s-projects/isocode-homiq/75n9HkS8x2Wzx1iQEBRRbY9uiZbh) |
| CI | [Latest run passed](https://github.com/MadhuTiwari-345/IsoCode/actions/runs/42618682477) |
| Reminder endpoint | Authenticated GitHub Actions invocation succeeded; last observed run processed 0 due reminders |
| Reminder channel | Mock audit only; no SMS/WhatsApp provider connected |
| Branches | `main` only |
| Reviewer accounts | Not provisioned; see [deployment guide](deployment.md) |
| Full authenticated E2E | Not yet verified |
| Booking unique-index/concurrency test | Not yet verified against staging |

## Local development

Requirements: Node.js 24.x, pnpm 10.28.0 and MongoDB.

```bash
git clone https://github.com/MadhuTiwari-345/IsoCode.git
cd IsoCode
corepack enable
corepack prepare pnpm@10.28.0 --activate
pnpm install --frozen-lockfile
```

Create an untracked `.env.local`:

```dotenv
DATABASE_URL=
PAYLOAD_SECRET=
GEMINI_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=
```

Then run:

```bash
pnpm generate:types
pnpm generate:importmap
pnpm dev
```

Open `http://localhost:3000`. Staff/admin access is at `/login` and `/admin`.

## Useful commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Local development |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests |
| `pnpm exec tsc --noEmit` | TypeScript check |
| `pnpm seed:demo` | Seed the three brief sample leads and clearly labelled demo availability |
| `pnpm provision:reviewers` | Create/reset reviewer accounts from private environment variables |
| `pnpm generate:types` | Regenerate Payload types |

See [deployment.md](deployment.md) before running seed or reviewer scripts. Use a disposable database for tests.

## AI, privacy and data integrity

The assistant uses deterministic approved facts first and a constrained Gemini fallback for supported fact-sheet content. It must not invent project details, availability, RERA identifiers, final prices or discounts. Unsupported questions and requests for a person are escalated.

Buyer contact data requires consent; opt-outs must be respected. WhatsApp is not active. Project records, RERA details, addresses, map coordinates, inventory and actual visit calendars must be verified by the client before public sales use.

## Design

A restrained residential palette (warm ivory, forest green, charcoal and muted brass), clear type, generous spacing and responsive layouts keep the buyer conversation focused and accessible.

## Scope and limitations

HOMIQ is a focused lead-to-visit workflow, not a full CRM. Payments, allotments and outbound voice are excluded. Portal ingestion and messaging-provider integrations are not connected. Demo slots are not a real sales calendar. Dashboard cost metrics require verified source spend and attendance data.

**Product principle:** show only what is known, make the next action clear, and hand off when a human is needed.
