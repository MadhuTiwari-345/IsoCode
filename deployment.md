# HOMIQ - deployment and verification

**Repository:** https://github.com/MadhuTiwari-345/IsoCode  
**Production:** https://isocode-homiq.vercel.app  
**Default branch:** `main`

This guide separates verified deployment checks from setup that still requires private credentials or client-approved information. Never commit secrets or reviewer passwords.

## 1. Stack and requirements

- Node.js 24.x
- pnpm 10.28.0
- Next.js 16 / React 19 / TypeScript 6
- Payload CMS 4 with MongoDB
- Gemini API for constrained fact-sheet answers
- Vercel hosting and GitHub Actions

## 2. Run locally

```bash
git clone https://github.com/MadhuTiwari-345/IsoCode.git
cd IsoCode
corepack enable
corepack prepare pnpm@10.28.0 --activate
pnpm install --frozen-lockfile
```

Create an untracked `.env.local` with your own development credentials:

```dotenv
DATABASE_URL=
PAYLOAD_SECRET=
GEMINI_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=
```

Generate Payload artifacts and start:

```bash
pnpm generate:types
pnpm generate:importmap
pnpm dev
```

Local URLs:

- Buyer site: http://localhost:3000
- Chat: http://localhost:3000/chat
- Login: http://localhost:3000/login
- Payload admin: http://localhost:3000/admin

Create the first Payload administrator through the admin initialization flow. Public sign-up is buyer-only; staff roles must be provisioned by an administrator.

## 3. Environment variables

Configure these names in Vercel (values are private and must never be added to this file):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MongoDB connection string |
| `PAYLOAD_SECRET` | Payload auth/session secret |
| `GEMINI_API_KEY` | Server-side Gemini API key |
| `NEXT_PUBLIC_SITE_URL` | Canonical application URL |
| `CRON_SECRET` | Bearer authentication for the reminder endpoint |

After rotating `GEMINI_API_KEY`, save the replacement in Vercel and redeploy Production. The running deployment does not inherit changed environment variables until redeployed.

## 4. Demo data

The seed script expects Project 01 and Project 02 records to exist. It seeds the three leads supplied in the original brief, a historical example booking, approved brief-backed facts, illustrative Ahmedabad map coordinates, a simulated advisor and future **demo** visit slots. The project, map, advisor and calendar values are synthetic reviewer fixtures, not verified Company A data.

```bash
pnpm seed:demo
```

Run this only against a disposable demo database or after reviewing existing records. It does not import the separate 18-row PDF dataset. Placeholder contact values are not contactable and have no consent. The seeded slots are persisted and bookable within the demo environment, but they are not Company A's real calendar or a confirmed real-world appointment. The map points are illustrative and must not be used for travel directions.

## 5. Reviewer accounts

No default reviewer credentials are stored in the repository. Create one account per role using private, untracked environment variables in the shell connected to the database reviewers will use:

| Variable | Role |
| --- | --- |
| `HOMIQ_REVIEWER_BUYER_EMAIL` / `HOMIQ_REVIEWER_BUYER_PASSWORD` | Buyer |
| `HOMIQ_REVIEWER_EXECUTIVE_EMAIL` / `HOMIQ_REVIEWER_EXECUTIVE_PASSWORD` | Sales executive |
| `HOMIQ_REVIEWER_HEAD_EMAIL` / `HOMIQ_REVIEWER_HEAD_PASSWORD` | Sales head |

Passwords must be at least 14 characters. Optional display-name variables are `HOMIQ_REVIEWER_BUYER_NAME`, `HOMIQ_REVIEWER_EXECUTIVE_NAME` and `HOMIQ_REVIEWER_HEAD_NAME`.

Run:

```bash
pnpm provision:reviewers
```

The script creates or resets accounts by email. **It resets the password and role for an existing matching email.** Use dedicated reviewer addresses, not an existing personal account. Share passwords only through a private channel.

Login routes:

- Buyer: `/login`
- Executive: `/login?next=/staff`
- Sales head: `/login?next=/staff`

## 6. CI and production deployment

GitHub Actions workflow `.github/workflows/ci.yml` runs unit tests, Payload type generation and TypeScript validation on pushes/PRs to `main`.

```bash
pnpm test
pnpm generate:types
pnpm exec tsc --noEmit
```

Vercel is connected to `MadhuTiwari-345/IsoCode` and deploys `main). Check the [Vercel deployment history](https://vercel.com/mt1499961-2971s-projects/isocode-homiq) after each change.

## 7. Reminder worker

Endpoint:

```
GET /api/cron/reminders
Authorization: Bearer <CRON_SECRET>
```

GitHub Actions workflow `.github/workflows/homiq-reminders.yml` polls every five minutes and supports manual dispatch. Repository secrets:

| Secret name | Value |
| --- | --- |
| `HOMIQ_BASE_URL` | `https://isocode-homiq.vercel.app` |
| `CRON_SECRET` | Exactly the same value as Vercel's `CRON_SECRET` |

Configure them at https://github.com/MadhuTiwari-345/IsoCode/settings/secrets/actions. Run **Actions → HOMIQ reminder worker → Run workflow**.

The last verified manual run authenticated successfully and returned `ok: true` with `processed: 0`. This proves endpoint authentication/execution only; it did not exercise a due reminder. Reminder delivery is **mock-only**. No SMS or WhatsApp provider is connected.

## 8. Verification status

Status checked against the current repository and connected service records on 9 November 2026.

| Check | Status | Evidence / next action |
| --- | --- | --- |
| Only `main` branch remains | **Verified** | GitHub branch API returned only `main`; obsolete `standard-payload-postgres` is absent |
| Latest CI | **Passed** | [Run 42621394254](https://github.com/MadhuTiwari-345/IsoCode/actions/runs/42621394254) |
| Latest Vercel production deployment | **Ready** | Commit `aa93b4e19625c3ae54bb519ee1722b7dffe441c6) |
| Reminder endpoint auth | **Passed** | Authenticated manual workflow returned `ok: true` |
| Due reminder processing | **Not exercised in last run** | Last run had zero due jobs; test with due demo records on staging |
| Reviewer accounts | **Not provisioned** | Run section 5 using dedicated private credentials |
| Buyer/executive/head login and journeys | **Not E2E verified** | Test on staging with the three accounts |
| Booking index uniqueness | **Not verified** | Atlas index listing exposes the key/name but not the unique option; inspect `listIndexes()` with a MongoDB client before claiming this guard is active |
| Concurrent booking test | **Not run against staging** | Run simultaneous claims against a disposable MongoDB database after confirming the unique index |
| Consent/opt-out reminder cases | **Partially verified** | Existing demo reminder audit records show no-consent skips; test both paths with due staging records |
| Dashboard metric reconciliation | **Not verified** | Add known test spend and attendance, then compare displayed totals to source records |
| Client-approved RERA/location/inventory/calendar data | **Unavailable** | Client must supply verified records before public project pages or real appointments |
| WhatsApp/SMS delivery | **Not connected** | Requires provider account, approved templates, opt-in and delivery callbacks |
| Additional 18-row PDF dataset | **Not imported** | Reconcile its fields and consent before importing; current seed is the original three-row brief |

## 9. End-to-end staging test plan

Use a separate staging MongoDB database and disposable reviewer accounts. Do not create test bookings or fake availability in the live client calendar.

1. Register a buyer, record consent and verify the lead/source record.
2. Repeat with the same normalized contact and verify duplicate detection.
3. Ask known fact-sheet questions in English, Hindi and Gujarati.
4. Ask for an absent project fact and verify the assistant declines to guess and flags/assigns human follow-up.
5. Request a person explicitly; verify a named test executive receives the lead, summary and transcript.
6. Book a future staging slot; verify confirmation, booking record and remaining capacity.
7. Submit simultaneous requests for the last seat; assert exactly one succeeds and the rest receive a full-slot response.
8. Mark attendance/no-show; compare dashboard visits, show-up rate and source metrics to the test data.
9. Create due reminder fixtures for consent=true, consent=false and doNotContact=true. Invoke the worker and verify mock-sent, skipped-no-consent and skipped-opt-out audit rows.
10. Call the reminder endpoint without a bearer secret and assert HTTP 401.

Do not run destructive or concurrency tests against the production customer dataset.

## 10. Data, assumptions and release limits

The problem statement supplies two project labels, Ahmedabad, 2/3 BHK, a combined ₹65 lakh–₹1.2 crore portfolio range and three sample leads. It does not supply real project names, project-specific pricing, RERA IDs, addresses, map coordinates, inventory, named staff, source-level spend or a live visit calendar.

Therefore:

- Keep project records unpublished until client facts are verified.
- Never fabricate RERA identifiers, project claims, final prices, discounts or map pins.
- Demo slots are simulated and cannot be represented as real availability.
- The brief's 3,000 leads/month, ₹30 lakh spend, ₹1,000 CPL, 14-hour response and 6% visit conversion are assumptions, not measured HOMIQ results.
- Cost per visit requires verified spend and attendance data.
- Store/contact buyers only with appropriate consent and honour opt-outs.
- WhatsApp must remain disabled until opt-in templates and provider callbacks are configured.
- The product is a focused lead-to-visit workflow, not a full CRM; payments, allotments and outbound voice are out of scope.


## 11. Reviewer walkthrough

The demo environment is intended to support a complete product walkthrough with separate role accounts:

1. Open the public website and browse both demo residences.
2. Register a buyer account, accept the enquiry consent and select a chat language.
3. Complete the guided needs/budget questions. Ask a supported question, then ask for a fact that is absent to verify the human fallback.
4. Request a site visit and choose a future seeded demo slot. Confirm that a booking reference is created and that the slot's remaining capacity changes.
5. Open **My visits** and inspect the assigned simulated advisor, saved conversation context and reminder schedule.
6. Sign in as the executive and inspect the assigned lead and transcript.
7. Sign in as the sales head and inspect flagged conversations, lead sources, visit outcomes and dashboard calculations.

Use the three separately provisioned accounts from section 5. Do not reuse the buyer account as a staff account. Reviewer passwords are intentionally not published in this repository.

## 12. Demo facts versus live operations

The demo is designed to be fully clickable and backed by the application database. Synthetic data exists to make the experience reviewable; it is not a substitute for client-authorized operating data.

| Capability | Demo behavior | Required before real customer use |
|---|---|---|
| Project details | Project 01 / Project 02 with brief-level portfolio facts | Verified project-specific fact sheets, RERA IDs and approved marketing copy |
| Map | Illustrative Ahmedabad map coordinates | Verified site address, entrance and coordinates |
| Visit booking | Persisted future slots with capacity enforcement | Live sales-head-maintained availability and operational confirmation |
| Sales handoff | Simulated advisor with saved lead context | Actual staff roster, assignment rules and contact channels |
| Reminders | Scheduled audit processing with mock delivery | Provider integration, approved templates, consent and delivery callbacks |
| Dashboard | Demo records and explicitly identified sample inputs | Reconciled production spend, response timestamps and attendance outcomes |

Do not tell a buyer that a synthetic slot, map point, RERA placeholder or simulated advisor is a verified Company A fact. Keep the booking flow demonstrable without presenting the demo appointment as a real-world visit commitment.
