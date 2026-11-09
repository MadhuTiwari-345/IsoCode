# HOMIQ — Technical Design Document

**GitHub repository:** https://github.com/MadhuTiwari-345/IsoCode  
**Live application:** https://isocode-homiq.vercel.app  
**Candidate:** Software Engineering internship  
**Prepared:** 9 November 2026

## 1. Executive summary

HOMIQ is a mobile-first lead response and site-visit workflow for Company A, an Ahmedabad residential developer. The core product slice connects the buyer's first enquiry to a qualified lead, an approved-fact answer, a site-visit reservation and a human sales handoff.

The brief's operational baseline is 3,000 leads per month, ₹30 lakh monthly spend, ₹1,000 per lead, 14-hour median first response, 35% unreached within 48 hours and 6% lead-to-site-visit conversion. These are client-supplied planning assumptions, not measured results from this prototype.

## 2. Scope and outcome

The core slice implements:
- One source-tagged lead inbox and duplicate detection.
- Buyer chat in English, Hindi and Gujarati.
- Guided capture of configuration and budget.
- Approved fact-sheet lookup with constrained Gemini fallback and human escalation.
- Future slot discovery and a database-enforced seat claim for booking.
- Persisted chat transcript, summary and executive assignment.
- Sales workspace, visit outcome management and source dashboard.
- Consent-aware mock reminder processing.

The target outcomes in the brief are median first response under five minutes, fewer than 5% unreached within 48 hours and 8% lead-to-visit conversion within three months. The prototype does not claim those outcomes have been achieved.

## 3. Architecture

| Layer | Implementation | Reason |
|---|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 | One responsive application for buyer and staff screens |
| Application | TypeScript server actions and route handlers | Keep validation and privileged operations server-side |
| Authentication | Payload auth collection plus application session cookie | Buyer, executive and sales-head roles |
| CMS/data layer | Payload CMS 4 | Collections, admin editor and access rules |
| Database | MongoDB via Payload Mongoose adapter | Persistent leads, facts, slots, bookings and audit records |
| AI | Server-side Gemini API | Bounded fact-sheet answer fallback |
| Hosting | Vercel | Next.js production deployment |
| Scheduled work | GitHub Actions | Five-minute polling of the protected reminder endpoint |

A single Next.js/Payload application keeps the solo-built scope small and avoids a separate backend service. MongoDB's unique index on booking seat claims provides a final concurrency guard beyond the availability check in the UI.

## 4. Data model

| Collection | Main data | Relationships |
|---|---|---|
| Users | Name, email, phone, role | Optional sales-executive record |
| Projects | Project label, locality, address, map coordinates, RERA, price range, configurations, public approval and demo flags | Visit slots and fact sheet |
| Fact Sheet | Topic and approved English/Hindi/Gujarati answer | Project |
| Leads | Lead code, contact, source, language, preferences, stage, consent, opt-out, duplicate link, assignee, response timestamps and handoff summary | User, project, executive |
| Chat Messages | Role, message text and timestamp | Lead |
| Sales Executives | Name, phone, language coverage, project coverage and active state | Leads |
| Visit Slots | Start time, duration, capacity, open and demo-only flags | Project |
| Bookings | Booking code, seat claim key, status and reminder timestamps | Lead, slot and project |
| Reminder Deliveries | Idempotency key, channel, status, schedule and mock body | Booking and lead |
| Source Spend | Source and spend for reporting period | Source dashboard |

The source tags cover property portal, 99acres, MagicBricks, social ads, website and hoarding. The sample brief's generic "Property portal" is represented by its own source value.

## 5. Main workflows

### 5.1 Buyer registration and qualification

1. Buyer opens chat and chooses English, Hindi or Gujarati.
2. Buyer enters name and mobile number and explicitly consents to processing.
3. WhatsApp opt-in is recorded separately; DPDP consent does not imply WhatsApp consent.
4. Lead is created with a source tag and normalized contact data.
5. Duplicate lookup compares normalized phone/email and links a likely duplicate to the earlier record.
6. Guided prompts capture 2/3 BHK and budget range.

### 5.2 Fact-sheet assistant

1. Deterministic topic detection checks the selected project's approved fact-sheet rows first.
2. If no deterministic answer is available, the server sends only the selected project's approved fact-sheet content and the buyer's question to Gemini.
3. The model is required to return a structured supported/unsupported response.
4. Unsupported, malformed, failed or uncertain answers are not guessed: the buyer is told a person will confirm, and the lead is flagged for handoff.
5. A buyer can request a person at any point.

The assistant must not invent project amenities, possession, location, RERA, approvals, inventory or availability. It must not quote final prices or discounts. The combined portfolio price range in the brief is not a project-specific offer.

**Implementation distinction:** the chat is a guided conversational flow with a constrained Gemini fallback. Booking is a separate validated server action with database seat claims; the current implementation is not an autonomous LLM function-calling agent.

### 5.3 Site-visit booking

1. The server returns future, open slots for the selected project.
2. Remaining capacity is calculated from active bookings.
3. On selection, the server reloads the slot and active bookings.
4. A deterministic seat claim key is written with the booking.
5. A MongoDB unique index prevents two concurrent inserts from owning the same seat key.
6. On a duplicate-key race, the booking flow retries another seat or reports the slot as full.
7. Booking records receive reminder timestamps for 24 hours and two hours before the visit.

Demo slots are simulated because the brief contains no real client calendar. They are explicitly marked demo-only and must not be represented as confirmed Company A availability.

### 5.4 Human handoff

The transcript is persisted before the summary and assignment are saved. The lead is flagged for review and assigned to an active executive based on language/project fit and current lead load. The sales head can review flagged chats. No external notification integration is connected.

### 5.5 Reminder processing

A protected route finds due reminder timestamps. It checks DPDP consent and do-not-contact state, creates an idempotent delivery audit record and marks the reminder as processed. The delivery channel is mock-only. GitHub Actions polls every five minutes; actual SMS/WhatsApp delivery is out of scope.

## 6. UI and design

The design uses warm ivory surfaces, deep forest green primary actions, charcoal text and restrained brass accents. The visual direction is calm and residential rather than a dense generic CRM.

The key screens are:
1. Public residential discovery.
2. Buyer chat and consent.
3. Guided preference capture and fact answers.
4. Slot selection and booking confirmation.
5. Sales lead inbox with source and duplicate status.
6. Lead detail with transcript, handoff summary and assignment.
7. Visit management and attendance outcomes.
8. Sales dashboard and admin fact/slot maintenance.

Buyer chat is mobile-first, with short prompts and selectable options to reduce typing. Staff screens prioritize scanability and clear ownership. Missing facts, unavailable slots and empty records must be represented honestly rather than filled with invented content.

## 7. Security, privacy and compliance controls

- Gemini and database credentials are server-side environment variables.
- Buyer registration requires explicit consent; WhatsApp opt-in is separate.
- Reminder processing checks consent and opt-out before mock delivery.
- Staff roles are assigned by an administrator; public signup cannot grant staff roles.
- Server actions validate input and check staff roles.
- Project public approval defaults to false.
- No RERA identifier, map coordinate, project address or project-specific price is fabricated.
- Sample contacts use non-contactable placeholder phone values and false consent.
- The project does not claim legal compliance certification; client/legal review is required before production messaging.

## 8. Testing and deployment

The repository includes unit tests for key domain logic. GitHub Actions runs the unit tests and generates Payload types before TypeScript checking. The latest recorded CI run for commit `bacae9472af748c5f4b1078e9907a66002058793` completed successfully. Vercel reports the corresponding production deployment as READY.

These checks do not replace authenticated browser E2E tests or a concurrent booking integration test against a staging MongoDB database. Reminder scheduling remains unverified until the GitHub Actions secrets are configured and a workflow run succeeds.

See [deployment.md](../deployment.md) for local setup, environment variable names, reviewer account provisioning and deployment instructions.

## 9. Assumptions and limitations

| ID | Assumption or missing information | Treatment |
|---|---|---|
| A1 | The 420 apartments and ₹65 lakh–₹1.2 crore range describe the combined portfolio. | Never present as project-specific inventory or final quote. |
| A2 | Project 1 and Project 2 are anonymized labels. | Keep demo labels until the client provides approved identities. |
| A3 | No project-specific RERA number, address or map coordinates were supplied. | Public approval remains disabled; do not fabricate them. |
| A4 | No real visit calendar was supplied. | Future sample slots are simulated and labelled demo-only. |
| A5 | No real sales roster or executive contact details were supplied. | Do not invent named client staff; use clearly identified demo records. |
| A6 | The client supplied planning assumptions, not production analytics. | Show baseline context separately from measured application KPIs. |
| A7 | The brief provides three sample lead rows; an additional uploaded sample PDF contains 18 rows. | Current seed imports the three brief rows only; the additional PDF dataset is not fully imported. |
| A8 | Messaging integrations may be mocked. | Reminder audit records are mock-only; no WhatsApp/SMS is sent. |
| A9 | No reviewer emails/passwords were supplied. | A secure script provisions buyer, executive and head accounts from private environment variables; no default passwords are committed. |

## 10. What was cut and next steps

Cut by design: full CRM replacement, booking payments, allotment letters, outbound voice, live WhatsApp and external portal integrations.

Next:
1. Provision reviewer accounts and test each role.
2. Add the GitHub Actions reminder secrets and verify a successful worker run.
3. Import and validate the full anonymized 18-row sample.
4. Run browser-based buyer/staff E2E tests and a concurrent booking test against staging MongoDB.
5. Obtain verified project facts, RERA records, addresses, map pins and real visit capacity from Company A.
6. Connect portal/website ingestion and approved WhatsApp templates only after consent and provider setup.
7. Validate KPI definitions and source spend with the sales head.
