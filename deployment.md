# HOMIQ deployment and reviewer guide

**GitHub:** https://github.com/MadhuTiwari-345/IsoCode  
**Production:** https://isocode-homiq.vercel.app

## Stack

- Node.js 24.x and pnpm 10.28.0
- Next.js 16, React 19, TypeScript 6
- Payload CMS 4 with MongoDB
- Gemini API for constrained, server-side fact-sheet answers
- Vercel hosting
- GitHub Actions for CI and five-minute mock reminder polling

## 1. Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/MadhuTiwari-345/IsoCode.git
   cd IsoCode
   ```

2. Install the pinned package manager and dependencies:

   ```bash
   corepack enable
   corepack prepare pnpm@10.28.0 --activate
   pnpm install --frozen-lockfile
   ```

3. Create `.env.local` in the repository root. Supply your own development credentials:

   ```dotenv
   DATABASE_URL=
   PAYLOAD_SECRET=
   GEMINI_API_KEY=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   CRON_SECRET=
   ```

   Never commit this file. The Gemini key and database credentials must remain server-side.

4. Generate Payload artifacts:

   ```bash
   pnpm generate:types
   pnpm generate:importmap
   ```

5. Start the application:

   ```bash
   pnpm dev
   ```

6. Open:
   - Buyer website: http://localhost:3000
   - Buyer chat: http://localhost:3000/chat
   - Sign in: http://localhost:3000/login
   - Payload admin: http://localhost:3000/admin

7. Create the first Payload administrator using the Payload initialization flow. The Payload administrator manages project records, staff records and reviewer account provisioning. Website accounts cannot grant themselves staff roles.

## 2. Seed the interview sample data

The seed script expects two project records already created in Payload and sorted as Project 01 and Project 02. It marks those records as demo-only, seeds only facts stated in the brief, and creates/upserts the three sample leads:

- LD-58210 — Hardik Patel
- LD-58211 — Nidhi Shah
- LD-58224 — Kavita Joshi

The lead phone values are deliberately non-contactable placeholders and consent is false. The seed also creates future simulated visit slots, explicitly marked demo-only. These are not a real Company A calendar.

Run only against a disposable demo database or after reviewing its existing records:

```bash
pnpm seed:demo
```

The seed does not import all 18 rows from the separately supplied PDF. Do not describe the complete 18-row dataset as imported.

## 3. Provision reviewer accounts

The app supports three website roles: `buyer`, `executive`, and `head`. Public sign-up creates buyer accounts only. Staff roles are assigned by an administrator.

A provisioning script is included. It creates or resets one account for each role using the Payload authentication API, so Payload hashes passwords using its normal auth implementation.

Set the following variables in a **private local shell or untracked local env file** connected to the database you intend reviewers to use:

| Variable | Purpose |
| --- | --- |
| `HOMIQ_REVIEWER_BUYER_EMAIL` | Reviewer buyer email |
| `HOMIQ_REVIEWER_BUYER_PASSWORD` | Reviewer buyer password (14+ characters) |
| `HOMIQ_REVIEWER_EXECUTIVE_EMAIL` | Reviewer executive email |
| `HOMIQ_REVIEWER_EXECUTIVE_PASSWORD` | Reviewer executive password (14+ characters) |
| `HOMIQ_REVIEWER_HEAD_EMAIL` | Reviewer sales-head email |
| `HOMIQ_REVIEWER_HEAD_PASSWORD` | Reviewer sales-head password (14+ characters) |

Optional display-name variables:

- `HOMIQ_REVIEWER_BUYER_NAME`
- `HOMIQ_REVIEWER_EXECUTIVE_NAME`
- `HOMIQ_REVIEWER_HEAD_NAME`

Then run:

```bash
pnpm provision:reviewers
```

The script is idempotent by email. If an account already exists, it updates the name, role and password to the supplied values. **This intentionally resets the password for matching emails.** It prints account emails and roles, never passwords. Share the generated credentials with the reviewer only through a private channel. Do not place passwords in README, deployment docs, GitHub issues, source code or chat.

The connected GitHub/Vercel tools cannot safely create reviewer credentials without the intended email addresses and passwords. No shared credentials have been invented or embedded in the repository.

## 4. Run tests

```bash
pnpm test
pnpm exec tsc --noEmit
```

A GitHub Actions workflow at `.github/workflows/ci.yml` runs these checks on pushes and pull requests to `main`. Confirm the workflow run is green before treating the latest commit as verified. Unit tests and type checking do not replace browser-based end-to-end tests or a concurrency test against the target MongoDB database.

## 5. Vercel deployment

Connect `MadhuTiwari-345/IsoCode` to the Vercel project `isocode-homiq`, using the repository root and Node.js 24.x.

Required Vercel environment variable names:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MongoDB connection |
| `PAYLOAD_SECRET` | Payload authentication/session signing |
| `GEMINI_API_KEY` | Server-side Gemini API key |
| `NEXT_PUBLIC_SITE_URL` | Canonical application URL |
| `CRON_SECRET` | Bearer secret for reminder endpoint |

Configure the variables for Production and Preview as appropriate. Never include their values in this document. After changing `GEMINI_API_KEY`, trigger a new Production deployment so the new server-side environment value is applied to the running functions. The current Vercel project has an entry for this variable; confirm the rotated key was saved there without revealing it.

The latest previously verified successful production build was commit `306749bef0cb10e8af6d853999e7a3d360ef59a5a`. Subsequent README, reviewer-provisioning and CI changes need their own green CI result and successful Vercel deployment.

## 6. Reminder worker

The endpoint is:

```
GET /api/cron/reminders
Authorization: Bearer <CRON_SECRET>
```

The endpoint creates idempotent reminder audit records and checks buyer consent and opt-out status. Delivery is **mock-only**; it does not send WhatsApp or SMS.

The workflow `.github/workflows/homiq-reminders.yml` runs every five minutes and can also be started manually. Add these two repository Actions secrets at:

https://github.com/MadhuTiwari-345/IsoCode/settings/secrets/actions

| GitHub Actions secret | Value to configure |
| --- | --- |
| `HOMIQ_BASE_URL` | `https://isocode-homiq.vercel.app` |
| `CRON_SECRET` | The exact same secret value configured in Vercel |

The GitHub integration available to this project cannot write repository Actions secrets. A repository administrator must add them in GitHub. Then select **Actions → HOMIQ reminder worker → Run workflow** and verify a green run. Scheduled executions may be delayed by GitHub's scheduler. Until the secrets are present and a run succeeds, reminder scheduling is configured but not verified.

## 7. Demo login and reviewer handoff

There are no default demo passwords. Provision the three accounts using section 3, then privately share:

- Buyer: `/login`, role `buyer`
- Sales executive: `/login?next=/staff`, role `executive`
- Sales head: `/login?next=/staff`, role `head`

The login page redirects authenticated staff to the staff workspace. The executive account is for lead review and assignment workflows. The head account is for sales-head controls, including fact-sheet and visit-slot management.

## 8. Data, safety and honest limitations

- The brief supplies only Project 1/2 labels, Ahmedabad as the city, 2/3 BHK configurations and an overall portfolio price range. It does not supply actual project names, project-specific prices, RERA registration numbers, street addresses, map coordinates, verified inventory or a real sales calendar.
- Production project records are demo-only and not approved for public display. Do not fabricate RERA or location data to make a map pin appear complete.
- Demo visit slots are simulated. Do not represent them as real client availability.
- The reminder worker is a mock delivery audit, not a messaging provider.
- Portal, social advertising and hoarding source tags are supported, but live third-party ingestion is not connected.
- The brief's 3,000 leads/month, ₹30 lakh/month spend, ₹1,000 CPL, 14-hour response and 6% visit conversion are planning assumptions, not measured production outcomes.
- Cost-per-visit requires trustworthy source spend and attendance records. Do not infer missing spend or show-up data.
- The three sample lead names are demo data. The placeholder phone values cannot be contacted. Do not add real buyer contact information without consent.
- The uploaded 18-row sample PDF is not fully seeded by the current script.

## 9. Production verification checklist

- [ ] CI workflow green on the latest commit
- [ ] Vercel deployment for that commit is `READY`
- [ ] Rotated Gemini key is saved in Vercel and a fresh deployment is active
- [ ] Reviewer buyer, executive and head accounts are provisioned and login-tested
- [ ] GitHub Actions secrets are configured and reminder workflow run is green
- [ ] Buyer registration, consent capture and duplicate handling are tested
- [ ] English, Hindi and Gujarati fact-sheet answers and unsupported-question handoff are tested
- [ ] Booking concurrency test passes against a staging MongoDB database
- [ ] Reminder endpoint returns 401 without the secret and processes mock records with the secret
- [ ] Attendance and dashboard figures are checked against known seed records
- [ ] Client-approved project facts, RERA details, map pins and real availability are entered before public sales use
