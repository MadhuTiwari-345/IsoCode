<p align="center">
  <img src="https://img.shields.io/badge/HOMIQ-Residential%20Lead%20Experience-234F43?style=for-the-badge&labelColor=1B2927" alt="HOMIQ" />
</p>

<h1 align="center">🏡 HOMIQ</h1>

<p align="center">
  <strong>A calmer way to discover a home. A faster way to follow up.</strong><br/>
  Multilingual buyer conversations • Lead intelligence • Site-visit scheduling
</p>

<p align="center">
  <a href="https://isocode-homiq.vercel.app/"><img src="https://img.shields.io/badge/Live%20Demo-Open%20HOMIQ-234F43?style=for-the-badge&logo=vercel&logoColor=F7F7F4" alt="Live demo" /></a>
  <a href="https://github.com/MadhuTiwari-345/IsoCode"><img src="https://img.shields.io/badge/GitHub-Repository-A27B45?style=for-the-badge&logo=github&logoColor=F7F7F4" alt="GitHub repository" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-1B2927?style=for-the-badge&logo=next.js&logoColor=F7F7F4" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-234F43?style=for-the-badge&logo=react&logoColor=F7F7F4" alt="React 19" />
  <img src="https://img.shields.io/badge/Payload_CMS-4-A27B45?style=for-the-badge&logo=payloadcms&logoColor=F7F7F4" alt="Payload CMS 4" />
  <img src="https://img.shields.io/badge/MongoDB-Database-234F43?style=for-the-badge&logo=mongodb&logoColor=F7F7F4" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-1B2927?style=for-the-badge&logo=tailwindcss&logoColor=F7F7F4" alt="Tailwind CSS 4" />
</p>

---

<p align="center"><em>Thoughtful homes deserve a thoughtful first conversation.</em></p>

## 🏡 Overview

HOMIQ is a residential discovery and lead-management experience for a developer with two live projects in Ahmedabad. It brings buyer enquiries, project information, conversations, sales follow-up and site visits into one connected workflow.

The product is designed around a simple operational goal: respond quickly, understand what a buyer needs, and make it easy to arrange a site visit without losing the conversation along the way.

**Project context**
- 2 residential projects
- 420 apartments across 2 BHK and 3 BHK configurations
- Overall indicative price range supplied in the brief: ₹65 lakh–₹1.2 crore
- Buyer-facing experience designed for mobile, with English, Hindi and Gujarati language options

Project names, addresses, RERA registration numbers, project-wise inventory and exact unit prices are intentionally not fabricated. Those details must be entered and verified by the sales team before being published.

## ✨ Product experience

| Area | What it does |
| --- | --- |
| **Project discovery** | Presents the two developments and the supplied portfolio-level facts without inventing project-specific claims. |
| **Buyer concierge** | Guides buyers through language, contact, configuration and budget questions in English, Hindi or Gujarati. |
| **Fact-sheet answers** | Uses sales-managed project facts for supported answers; unanswered questions are flagged for human follow-up. |
| **Lead inbox** | Keeps enquiries in one place with source, stage, ownership and duplicate indicators. |
| **Visit scheduling** | Shows available visit slots and creates a booking record with reminder timestamps. |
| **Sales handoff** | Assigns a named sales executive and retains a concise buyer summary and conversation history. |
| **Sales overview** | Surfaces lead and visit activity to help the team understand source performance. |

> **Integration note:** WhatsApp delivery, outbound messages and payment/allotment workflows are not represented as live integrations. WhatsApp opt-in is captured separately; external messaging remains a future integration.

## 🎨 Design direction

HOMIQ uses a restrained residential identity rather than a generic property-listing template.

| Token | Value | Use |
| --- | --- | --- |
| Warm ivory | `#F7F7F4` | Main canvas |
| Deep forest | `#234F43` | Primary actions |
| Charcoal | `#1B2927` | Text and structure |
| Muted brass | `#A27B45` | Small accents |
| White | `#FFFFFF` | Cards and surfaces |

Editorial serif display typography is paired with a clean sans-serif interface. Layouts prioritize whitespace, clear hierarchy, accessible controls and compact mobile interactions.

## 🧰 Tech stack

- **Framework:** Next.js 16, React 19, TypeScript
- **CMS and server data:** Payload CMS 4
- **Database:** MongoDB through Payload's Mongoose adapter
- **Styling:** Tailwind CSS 4
- **Hosting:** Vercel

## 🗂️ Core data

The Payload collections organize the product around these records:

- **Projects** and **Fact Sheet** — sales-approved project information
- **Leads** — contact, source, preferences, consent, stage, duplicate reference and ownership
- **Chat Messages** — buyer and assistant transcript
- **Sales Executives** — staff assignment and language/project coverage
- **Visit Slots** and **Bookings** — availability, visit details and reminder timestamps
- **Source Spend** — marketing spend inputs for source-level reporting
- **Users** and **Admins** — buyer/staff accounts and CMS administration

The database may also contain legacy sample records. They are retained rather than destructively replaced during setup.

## 🚀 Run locally

### Prerequisites

- Node.js 24.22.1 or newer
- pnpm 10
- MongoDB connection string
- A Payload secret

### Setup

```bash
git clone https://github.com/MadhuTiwari-345/IsoCode.git
cd IsoCode

corepack enable
pnpm install

cp .env.example .env
```

Set the environment variables in `.env`:

```env
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
PAYLOAD_SECRET=<long-random-secret>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then generate Payload artifacts and start the application:

```bash
pnpm generate:importmap
pnpm generate:types
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The Payload admin is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## ☁️ Deployment

The project is configured for Vercel.

1. Import the GitHub repository into Vercel.
2. Set the Root Directory to the repository root and use Node.js 24.x.
3. Configure `DATABASE_URL`, `PAYLOAD_SECRET` and `NEXT_PUBLIC_SITE_URL` for the required environments.
4. Confirm the database is reachable from the deployment.
5. Deploy and verify the public pages and authenticated staff routes.

Never commit real environment values. Keep production secrets in Vercel's encrypted environment-variable settings.

## 🔐 Privacy and operational safeguards

- Buyer contact details are personal data. Capture consent before creating a buyer lead and respect opt-outs.
- WhatsApp communication must only be enabled after the relevant opt-in and approved template setup.
- Promotional project claims and RERA details must be verified by the sales head before publication.
- The concierge must not invent missing project facts, quote a final price or promise a discount.
- Unknown or sensitive buyer questions should be flagged for a human sales representative.

## 🧭 Scope

**Included in this slice:** lead capture, source tagging, duplicate indicators, multilingual guided chat, fact-sheet lookup, sales handoff, visit booking records and a sales workspace.

**Not included:** full CRM replacement, payment collection, allotment letters, outbound voice calling or a live WhatsApp Business integration.

Reminder delivery and external messaging require a configured delivery provider or scheduled worker; storing reminder timestamps alone does not send messages.

## 📌 Live project

<p align="center">
  <a href="https://isocode-homiq.vercel.app/">
    <img src="https://img.shields.io/badge/Visit-HOMIQ%20Live%20Site-234F43?style=for-the-badge&logo=vercel&logoColor=white" alt="Visit HOMIQ" />
  </a>
</p>

---

<p align="center">
  <strong>Built with care for better first conversations.</strong><br/>
  <sub>HOMIQ · Residential lead experience</sub>
</p>
