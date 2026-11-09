<p align="center">
  <img src="https://img.shields.io/badge/HOMIQ-Residential%20Experience-234F43?style=for-the-badge&labelColor=1B2927" alt="HOMIQ" />
</p>

<h1 align="center">🏡 HOMIQ</h1>

<p align="center">
  <strong>A more thoughtful first step towards finding a home.</strong><br/>
  Residential discovery · Multilingual conversations · Lead management · Site visits
</p>

<p align="center">
  <a href="https://isocode-homiq.vercel.app/"><img src="https://img.shields.io/badge/Live%20Website-Visit%20HOMIQ-234F43?style=for-the-badge&logo=vercel&logoColor=white" alt="Visit HOMIQ" /></a>
  <a href="https://github.com/MadhuTiwari-345/IsoCode"><img src="https://img.shields.io/badge/Source-GitHub-1B2927?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-1B2927?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-234F43?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Payload_CMS-4-A27B45?style=for-the-badge&logo=payloadcms&logoColor=white" alt="Payload CMS 4" />
  <img src="https://img.shields.io/badge/MongoDB-Database-234F43?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-1B2927?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
</p>

---

<p align="center"><em>Thoughtful homes deserve thoughtful conversations.</em></p>

## Product status

HOMIQ is a residential discovery and sales-operations product for a developer managing multiple projects. It connects buyer enquiries, multilingual assistance, visit scheduling and sales follow-up in one workflow.

- **Live application:** https://isocode-homiq.vercel.app
- **Source:** https://github.com/MadhuTiwari-345/IsoCode
- **Production deployment:** Latest deployment from `main`, commit `2a3183517351829b8e1265b38f17bb193558e5fc`, status **READY**.
- **Automated checks:** [GitHub Actions CI passed](https://github.com/MadhuTiwari-345/IsoCode/actions/runs/42621601251) on the latest commit. It ran unit tests, Payload type generation and TypeScript validation.
- **Reminder worker:** The protected endpoint has been invoked successfully by GitHub Actions. The verified run processed zero due reminders, so this confirms authentication and execution, not a real reminder delivery.
- **Repository:** `main` is the only active branch.
- **Reviewer journeys:** Buyer, executive and sales-head accounts and full authenticated end-to-end journeys are not yet verified.
- **Booking concurrency:** The unique seat-claim index is part of the implementation, but concurrent booking behavior still needs an integration test against a staging database.
- **Data integrity:** Project records remain unpublished until the client verifies RERA registration, addresses, location coordinates and other project facts.

The project deliberately distinguishes working product flows from integrations or client data that are not yet available. See [deployment.md](deployment.md) for setup and operational limits, and [the Technical Design Document](docs/Technical-Design-Document.md) for architecture and assumptions.

---

## 🏡 About HOMIQ

HOMIQ is a residential discovery and lead-management application for a developer with two live residential projects in Ahmedabad. It is designed to connect the buyer journey with the sales team's daily workflow, from the first enquiry to a site visit.

The client brief describes 420 apartments across 2 BHK and 3 BHK configurations, with an indicative portfolio range of ₹65 lakh to ₹1.2 crore. The brief also describes 3,000 monthly leads and ₹30 lakh in monthly marketing and portal spend. Those figures are client-provided planning assumptions, not live production analytics.

### What the client needs to improve

- Reduce the time between a buyer enquiry and the first useful response.
- Keep leads from portals, social ads, the website and hoarding calls in one inbox.
- Capture buyer needs, language, source and consent.
- Offer real visit availability and prevent overbooking.
- Give a named salesperson the buyer's context and conversation history.
- Measure response time, visit conversion, attendance and source-level cost.

### Current implementation status

This status is based on a review of the repository's `main` branch. A screen rendering successfully is not proof that its complete workflow has been tested in production.

| Requirement | Current implementation | Assessment |
| --- | --- | --- |
| Public residential discovery | Home, project list and project detail pages | Implemented with launch placeholders when project records are absent |
| Unified lead records | Payload Leads collection with source, stage, contact and ownership fields | Implemented for website-created and manually imported records; external portal/hoarding connectors are not connected |
| Duplicate checks | Normalized phone and email lookup on lead creation | Implemented as a pre-insert duplicate flag/link; concurrent submissions still need a database-level uniqueness strategy |
| English, Hindi and Gujarati chat | Language selection, translated prompts and fact-answer language selection | Implemented as guided chat |
| Answers from an approved fact sheet | Deterministic fact lookup plus Gemini fallback constrained to approved project fact-sheet entries | Implemented as a guarded generative fallback; empty/missing facts return unsupported and trigger human review |
| Budget and needs capture | BHK and budget choices update the lead | Implemented as a guided flow |
| Human handoff | Least-loaded active executive selection, lead summary, persisted transcript and review flag | Assignment and summary are implemented; there is no external staff notification integration |
| Real free visit slots | Future open-slot query plus unique per-seat claim key enforced by MongoDB's unique index; booking retries collisions | Server-side capacity guard is implemented; concurrency behavior still needs an integration test against the production database |
| Location pin | Visit confirmation page reads project coordinates | Depends on verified project address and coordinates being entered |
| Reminders at 1 day and 2 hours | Due-time fields, protected reminder endpoint and GitHub Actions five-minute schedule | Mock audit delivery only; requires `HOMIQ_BASE_URL` and `CRON_SECRET` GitHub Actions secrets; no SMS/WhatsApp provider is connected |
| Sales dashboard | Median first response, 48-hour unreached rate, visit conversion, show-up rate and source-level CPL/CPV | Calculations and UI are implemented; production accuracy depends on valid response timestamps, attendance updates and source-spend inputs |
| Admin fact sheet and slot editor | Sales-head-only fact and visit-slot management actions plus Payload collections | Implemented for the core editor flow; verify access with separate sales-executive and sales-head accounts |
| Sample client records | Idempotent seed script for LD-58210, LD-58211 and LD-58224 | Seed script is present; it must be run only after confirming Project 1/2 mapping. Uses non-contactable placeholder phones and consent=false |
| WhatsApp | Consent field exists | No live WhatsApp Business integration |

**Important distinction:** the chat combines a deterministic guided qualification flow with a Gemini fact-answer fallback. Gemini receives only approved fact-sheet entries for the selected project and must return a structured supported/unsupported result. Unsupported questions are escalated. Visit booking is a separate server-side action with database-enforced seat claims; it is not an LLM function-calling tool invocation. This satisfies a guarded AI assistant plus booking workflow, but should be described honestly as a constrained AI integration rather than a fully autonomous tool-calling agent.

The project catalogue includes clearly labelled launch placeholders for Project 01 and Project 02. They are not verified project identities. Real project names, addresses, map coordinates, RERA registration numbers, inventory and project-specific prices must be supplied by the client before public launch. Do not replace these placeholders with invented claims.

## 🎨 Visual identity

HOMIQ uses a calm, editorial visual direction inspired by residential spaces. The interface pairs warm neutral surfaces with a deep green primary colour, restrained brass accents and clear typography.

| Design token | Hex value | Role |
| --- | --- | --- |
| Warm ivory | `#F7F7F4` | Main background |
| Deep forest | `#234F43` | Primary actions and emphasis |
| Charcoal | `#1B2927` | Main text and structure |
| Muted brass | `#A27B45` | Secondary accents |
| White | `#FFFFFF` | Cards and raised surfaces |

The design prioritizes readable hierarchy, generous spacing, responsive layouts and accessible interactive states.

## 🧰 Technology

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Web framework | Next.js 16 | Application routing and rendering |
| UI | React 19 | Interactive interface |
| Language | TypeScript | Typed application code |
| Content and admin | Payload CMS 4 | Collections and administration |
| Database | MongoDB | Persistent application data |
| Database adapter | Payload Mongoose adapter | Payload database connection |
| Styling | Tailwind CSS 4 | Responsive styling |
| Hosting | Vercel | Web deployment |

## 🏗️ Architecture

HOMIQ is currently a Next.js application with Payload CMS as its application data layer and MongoDB as its database. The buyer interface and staff workspace use the same application and data model.

### System architecture

```mermaid
flowchart TB
    Buyer[Home buyer on mobile or desktop]
    Staff[Sales executive or sales head]
    Web[Next.js application on Vercel]
    Public[Public pages and buyer chat]
    Workspace[Protected sales workspace]
    Actions[Next.js server actions]
    Payload[Payload CMS and access rules]
    DB[(MongoDB)]
    Admin[Payload Admin]
    Facts[Projects and approved fact sheet]
    Leads[Leads and chat messages]
    Visits[Visit slots and bookings]
    Reports[Source spend and reporting data]

    Buyer --> Web
    Staff --> Web
    Web --> Public
    Web --> Workspace
    Public --> Actions
    Workspace --> Actions
    Actions --> Payload
    Admin --> Payload
    Payload --> DB
    DB --- Facts
    DB --- Leads
    DB --- Visits
    DB --- Reports
```

### Main application layers

| Layer | Responsibility | Main code locations |
| --- | --- | --- |
| Presentation | Public pages, buyer chat, visit confirmation and staff screens | `src/app/(frontend)`, `src/components` |
| Buyer workflow | Language selection, registration, qualification, fact lookup, handoff and booking actions | `src/app/(frontend)/chat/actions.ts` |
| Authentication | Buyer and staff application sessions | `src/lib/app-auth.ts`, `src/collections/Users.ts` |
| Business data | Leads, projects, facts, staff, slots, bookings and spend | `src/collections` |
| CMS and access | Payload configuration, collection permissions and admin interface | `src/payload.config.ts`, `src/collections` |
| Persistence | MongoDB through Payload's Mongoose adapter | `src/payload.config.ts` |
| Hosting | Next.js deployment and environment configuration | Vercel |

### Buyer chat sequence

```mermaid
sequenceDiagram
    actor Buyer
    participant UI as Chat interface
    participant SA as Server actions
    participant DB as Payload and MongoDB
    Buyer->>UI: Select English, Hindi or Gujarati
    UI->>Buyer: Ask for name, phone and consent
    Buyer->>UI: Submit registration
    UI->>SA: registerBuyer
    SA->>DB: Create lead with source and consent
    DB-->>SA: Lead ID
    SA-->>UI: Ask for BHK preference
    Buyer->>UI: Select BHK and budget
    UI->>SA: chooseOption
    SA->>DB: Read projects and approved facts
    DB-->>SA: Matching project facts
    SA-->>UI: Show guided answer and next actions
    Buyer->>UI: Ask a question or request a person
    UI->>SA: askQuestion or handoff action
    SA->>DB: Read fact sheet or flag and assign lead
    SA-->>UI: Answer from stored facts or request human follow-up
```

This sequence describes the guided qualification flow. Free-form questions first use deterministic approved facts, then a Gemini response constrained to the same project's approved fact sheet. Unknown topics, unsupported answers and model failures are flagged for human review rather than answered from general model knowledge.

### Site visit booking sequence

```mermaid
sequenceDiagram
    actor Buyer
    participant UI as Chat interface
    participant SA as Server actions
    participant DB as Payload and MongoDB
    Buyer->>UI: Ask to book a visit
    UI->>SA: Request open slots for selected project
    SA->>DB: Read future open slots
    SA->>DB: Count active bookings per slot
    SA-->>UI: Return slots with remaining capacity
    Buyer->>UI: Select a slot
    UI->>SA: bookVisit
    SA->>DB: Create booking
    DB->>DB: Claim unique slot seat key before insert
    SA->>DB: Save summary and salesperson assignment
    SA-->>UI: Return booking confirmation
```

**Booking reliability:** each slot capacity unit maps to a deterministic `claimKey` protected by a MongoDB unique index. Concurrent requests may race for the same seat, but only one insert can own that key; the booking action retries unique-key collisions and rechecks availability. This is the database-level no-double-claim guard. The pure helper tests pass only if run locally; a concurrent integration test against the configured MongoDB database is still required before claiming production concurrency has been verified.

### Data flow at a glance

1. A buyer enters through the website and selects a chat language.
2. The buyer submits contact information and DPDP consent.
3. The server creates a lead and records the source tag.
4. The guided chat collects configuration and budget preferences.
5. The assistant retrieves supported answers from the selected project's fact sheet.
6. A buyer can request a human at any time. The lead can be assigned to a sales executive and flagged for review.
7. The booking flow lists future slots and creates a booking record.
8. The visit confirmation page displays the booking, project map and stored reminder times.
9. Sales users review leads, chat history, bookings and source metrics in the staff workspace.

## 🗃️ Data model

The Payload configuration registers collections for the main application concepts:

- **Projects:** Residential project records.
- **Fact Sheet:** Sales-managed facts used to support buyer conversations.
- **Leads:** Buyer contact details, source, preferences, consent, stage and ownership.
- **Chat Messages:** Conversation history.
- **Sales Executives:** Sales-team records and assignment context.
- **Visit Slots:** Visit availability.
- **Bookings:** Scheduled visit records and reminder timestamps.
- **Source Spend:** Marketing spend inputs for source-level reporting.
- **Users and Admins:** Application users and administrative access.
- **Media, Folders and Tags:** Content organization.

## 🧩 Screen map and wireframes

The experience is organized around two entry points: a buyer-facing website and a protected sales workspace. The wireframes below are structural sketches, not pixel-perfect screenshots.

### Buyer-facing journey

| Screen | Purpose |
| --- | --- |
| Home | Introduce the residential offering and start a conversation |
| Residences | Browse the two project records |
| Project overview | Review approved project facts and continue to chat |
| Concierge chat | Select language, register, share needs, ask questions and book |
| Visit confirmation | Review date, time, location pin, advisor and reminder schedule |

### Sales workspace

| Screen | Purpose |
| --- | --- |
| Sales overview | Review response, visit, attendance and source performance |
| Lead inbox | Filter leads by source, duplicate status and review flag |
| Lead detail | Review buyer profile, duplicate links, handoff summary and chat history |
| Site visits | Review bookings and mark attendance, no-show or cancellation |

The Payload admin provides collection editors for project records, the fact sheet, visit slots, sales executives and source spend. Sales-head-only server actions also support the core fact and slot editing workflow. Reminder delivery is simulated and must not be presented as real SMS or WhatsApp delivery.

### Wireframe: buyer discovery

```text
┌──────────────────────────────────────────────────────────────┐
│ HOMIQ                                      Residences  FAQs   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Ahmedabad · 2 and 3 BHK residences                          │
│                                                              │
│  Homes made for the way you live.                             │
│  Ask a question in the language you think in.                 │
│                                                              │
│  [ English ] [ हिन्दी ] [ ગુજરાતી ] [ Book a visit ]          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  Current projects                                             │
│  ┌────────────────────────┐  ┌────────────────────────┐       │
│  │ Project 01             │  │ Project 02             │       │
│  │ Verified image/details │  │ Verified image/details │       │
│  │ Explore overview       │  │ Explore overview       │       │
│  └────────────────────────┘  └────────────────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

### Wireframe: guided chat and booking

```text
┌──────────────────────────────────────────────────────────────┐
│ HOMIQ concierge                    Verified project facts     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  HOMIQ: Welcome. Which language would you prefer?             │
│  [ English ] [ हिन्दी ] [ ગુજરાતી ]                            │
│                                                              │
│  HOMIQ: First, tell us your name and phone number.             │
│  [ Name __________________________________ ]                  │
│  [ Phone _________________________________ ]                  │
│  [ ] I agree to be contacted about this enquiry               │
│  [ ] I opt in to WhatsApp updates                             │
│  [ Continue ]                                                  │
│                                                              │
│  HOMIQ: Are you looking for a 2 BHK or 3 BHK?                 │
│  [ 2 BHK ] [ 3 BHK ]                                          │
│                                                              │
│  HOMIQ: What budget range should we consider?                 │
│  [ Range A ] [ Range B ] [ Range C ]                           │
│                                                              │
│  Available visit times                                         │
│  [ Slot 1 ] [ Slot 2 ] [ Slot 3 ]                              │
│                                                              │
│  [ Type a question __________________________ ] [ Send ]      │
│  Talk to a person                                              │
└──────────────────────────────────────────────────────────────┘
```

### Wireframe: sales workspace

```text
┌──────────────────────────────────────────────────────────────┐
│ HOMIQ Sales                         Overview  Leads  Visits   │
├───────────────┬──────────────────────────────────────────────┤
│ Navigation    │ Lead performance                              │
│               │                                                │
│ Overview      │ [Response time] [Unreached] [Visit rate]       │
│ Lead inbox    │ [Show-up rate] [Cost per visit]                │
│ Site visits   │                                                │
│ Fact sheet    │ Source performance                             │
│ Visit slots   │ ┌──────────────────────────────────────────┐   │
│               │ │ Source | Leads | Visits | Spend | Cost  │   │
│               │ └──────────────────────────────────────────┘   │
│               │                                                │
│               │ Flagged chats       Waiting for first contact  │
└───────────────┴──────────────────────────────────────────────┘
```

### Wireframe: lead detail and human handoff

```text
┌──────────────────────────────────────────────────────────────┐
│ Lead LD-XXXXX                         Assigned to [Executive]  │
│ Buyer name                                                     │
├───────────────────────────────┬──────────────────────────────┤
│ Buyer details                 │ Conversation history          │
│ Source and project            │                                │
│ BHK and budget                │ Buyer: ...                     │
│ Consent and response time     │ HOMIQ: ...                     │
│                               │ Buyer: ...                     │
│ Handoff summary               │ HOMIQ: ...                     │
│ Visit booking                 │                                │
└───────────────────────────────┴──────────────────────────────┘
```

## 🚀 Getting started

### Requirements

- Node.js **24.22.1 or newer**, as specified by the project package configuration
- pnpm 9, 10 or 11
- A reachable MongoDB database
- A Payload secret

### 1. Clone the repository

```bash
git clone https://github.com/MadhuTiwari-345/IsoCode.git
cd IsoCode
```

### 2. Install dependencies

```bash
corepack enable
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the repository root:

```env
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
PAYLOAD_SECRET=<long-random-secret>
GEMINI_API_KEY=<server-side-gemini-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=<long-random-cron-secret>
```

Use your own MongoDB connection string and a securely generated secret. Do not commit real credentials.

### 4. Generate Payload files

```bash
pnpm generate:importmap
pnpm generate:types
```

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The Payload admin interface is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## 📜 Available scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Build the Payload and Next.js application |
| `pnpm start` | Start the production server |
| `pnpm generate:importmap` | Generate the Payload import map |
| `pnpm generate:types` | Generate Payload TypeScript types |
| `pnpm payload` | Run the Payload CLI |
| `pnpm db:migrate` | Run Payload database migrations |
| `pnpm db:migrate:create` | Create a database migration |
| `pnpm format` | Format supported files with oxfmt |
| `pnpm test` | Run unit tests |
| `pnpm provision:reviewers` | Create/reset buyer, executive and sales-head reviewer accounts from private environment variables |

## ☁️ Deployment

HOMIQ is deployed on Vercel.

1. Import this GitHub repository into Vercel.
2. Set the project root to the repository root.
3. Select Node.js 24.x.
4. Add the required environment variables:
   - `DATABASE_URL`
   - `PAYLOAD_SECRET`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `CRON_SECRET`
5. Add GitHub Actions repository secrets `HOMIQ_BASE_URL` and `CRON_SECRET` to enable the five-minute mock reminder workflow. See [deployment.md](deployment.md).
6. Confirm that the MongoDB database accepts connections from the deployment environment.
7. Deploy and verify the public pages, buyer conversation flow and protected staff routes. A changed Gemini key requires a new deployment.

Keep production credentials in Vercel environment settings. Never add secrets to source control.

## 🔐 Privacy and AI safeguards

- Collect buyer consent before storing contact information for follow-up.
- Respect communication opt-outs.
- Enable WhatsApp communication only after the required opt-in and approved template setup.
- Use verified project facts for buyer-facing answers.
- Escalate unanswered questions to a human sales representative.
- Do not invent project details, RERA identifiers, inventory, final prices or discounts.
- Restrict access to buyer information according to each user's role.

These are product requirements and operating safeguards. Their presence in this README should not be interpreted as a legal compliance certification.

## 📦 Project scope

### In scope

- Residential discovery experience
- Lead capture and source context
- Guided multilingual conversation
- Sales-managed project facts
- Lead management and handoff concepts
- Visit-slot and booking workflows
- Sales operations workspace

### Outside the current scope

- Full enterprise CRM replacement
- Payment collection
- Apartment allotment and legal documentation
- Automated outbound voice calling
- Live WhatsApp Business messaging integration

Reminder timestamps are data only until a delivery provider and scheduled execution process are configured.

## 🧭 Operational roadmap

- [x] Production deployment from `main` is READY.
- [x] CI passed unit tests, Payload type generation and TypeScript validation on the current production commit.
- [x] Protected reminder endpoint was invoked successfully by GitHub Actions; response confirmed mock processing with zero due reminders.
- [x] GitHub Actions repository secrets are configured sufficiently for the successful manual reminder run.
- [ ] Provision reviewer accounts using private credentials and the documented script.
- [ ] Run authenticated buyer, executive and sales-head journeys against a disposable/staging dataset.
- [ ] Run a real concurrent booking test against the production-equivalent database and confirm the unique seat-claim index is deployed.
- [ ] Replace demo project facts with client-approved RERA identifiers, addresses, map coordinates, inventory and visit slots before enabling public project pages.
- [ ] Connect an approved WhatsApp/SMS provider only after consent, opt-in templates and delivery callbacks are configured.
- [ ] Validate dashboard metrics against verified operational spend and visit outcomes.
- [ ] Import and reconcile any additional client-provided sample dataset before using it in reporting.

## 🤝 Contributing

1. Work from the `main` branch (or use a temporary local branch if your workflow requires one).
2. Make and test your changes.
3. Commit with a clear message.
4. Merge reviewed changes back into `main`.

Please describe user-visible changes and include reproduction steps when reporting a bug.

## 🔗 Links

- **Live application:** [isocode-homiq.vercel.app](https://isocode-homiq.vercel.app/)
- **Repository:** [MadhuTiwari-345/IsoCode](https://github.com/MadhuTiwari-345/IsoCode)

---

<p align="center">
  <strong>HOMIQ</strong><br/>
  <sub>A thoughtful first conversation can make all the difference.</sub>
</p>
