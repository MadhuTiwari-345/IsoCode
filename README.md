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

## 🏡 About HOMIQ

HOMIQ is a residential discovery and lead-management application designed around the journey from a buyer's first enquiry to a scheduled property visit.

The project brief describes a real estate developer with two active residential projects in Ahmedabad and a portfolio of 420 apartments across 2 BHK and 3 BHK configurations. HOMIQ brings buyer enquiries, project information, guided conversations and sales follow-up into one connected experience.

The goal is straightforward: help buyers get useful answers, help sales teams respond with context, and make the next step clear.

### Project context

| Brief detail | Supplied context |
| --- | --- |
| Location | Ahmedabad, Gujarat |
| Residential projects | 2 |
| Apartment portfolio | 420 homes |
| Configurations | 2 BHK and 3 BHK |
| Overall indicative range | ₹65 lakh to ₹1.2 crore |
| Enquiry sources | Property portals, social ads, website and hoardings |
| Languages | English, Hindi and Gujarati |

The price range above is portfolio-level context from the brief. It is not a quote for a particular project or apartment. Project names, addresses, RERA registration numbers, live inventory and unit-level prices must come from verified sales data. They are not guessed or fabricated in this repository.

## ✨ Product capabilities

### Buyer experience

- **Residential discovery:** A public-facing experience for exploring the developer's residential offering.
- **Guided buyer chat:** A conversational flow designed to understand configuration, budget and buyer requirements.
- **Language choices:** English, Hindi and Gujarati are part of the intended buyer journey.
- **Lead capture:** Buyer details and enquiry context can be collected for sales follow-up.
- **Visit planning:** The product includes visit-slot and booking concepts to support scheduling.

### Sales workspace

- **Lead inbox:** Bring enquiries from different sources into a shared workflow.
- **Lead context:** Keep source, preferences, stage and ownership alongside the buyer record.
- **Duplicate awareness:** Identify possible repeat enquiries instead of treating every submission as unrelated.
- **Sales handoff:** Preserve buyer context so a sales executive can continue the conversation.
- **Operational overview:** Organize lead and visit information for sales-team review.
- **Fact management:** Keep project information in a managed source rather than relying on invented AI answers.

### Product principles

| Principle | How HOMIQ approaches it |
| --- | --- |
| Accuracy first | The assistant should use approved project facts and escalate unanswered questions. |
| Human support | Buyers can request a sales representative instead of continuing with automation. |
| Responsible pricing | The assistant must not promise a final price or discount. |
| Consent | Buyer contact and messaging preferences must be handled transparently. |
| Clear operations | Lead ownership and visit information should remain available to the sales team. |

> **Integration status:** The repository includes application workflows and data structures for leads, chat, sales users, visit slots and bookings. A stored reminder timestamp does not itself send a reminder. Live WhatsApp delivery, outbound messaging, payment collection and allotment workflows are not claimed as active integrations.

## 🧭 How the workflow fits together

```text
Buyer enquiry
     |
     v
Lead capture and source context
     |
     v
Guided conversation
     |
     +---- Approved fact available ----> Answer from project information
     |
     +---- Fact missing / human requested -> Sales follow-up
     |
     v
Buyer requirements and preferences
     |
     v
Visit slot selection
     |
     v
Booking record and sales coordination
```

This is the intended product workflow. External message delivery and reminder execution require separately configured services.

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
NEXT_PUBLIC_SITE_URL=http://localhost:3000
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

## ☁️ Deployment

HOMIQ is deployed on Vercel.

1. Import this GitHub repository into Vercel.
2. Set the project root to the repository root.
3. Select Node.js 24.x.
4. Add the required environment variables:
   - `DATABASE_URL`
   - `PAYLOAD_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
5. Confirm that the MongoDB database accepts connections from the deployment environment.
6. Deploy and verify the public pages, buyer conversation flow and protected staff routes.

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

## 🛣️ Next steps

- [ ] Verify buyer registration and lead creation end to end in production
- [ ] Add verified project content, imagery, addresses and RERA details
- [ ] Test duplicate detection against concurrent submissions
- [ ] Verify visit-slot capacity under simultaneous booking attempts
- [ ] Configure and test reminder delivery
- [ ] Connect an approved WhatsApp Business provider after opt-in and template review
- [ ] Validate dashboard calculations against real operational data
- [ ] Add automated tests for the critical buyer and staff workflows

## 🤝 Contributing

1. Fork the repository.
2. Create a focused branch: `git checkout -b feature/your-change`.
3. Make and test your changes.
4. Commit with a clear message.
5. Push your branch and open a pull request.

Please describe user-visible changes and include reproduction steps when reporting a bug.

## 🔗 Links

- **Live application:** [isocode-homiq.vercel.app](https://isocode-homiq.vercel.app/)
- **Repository:** [MadhuTiwari-345/IsoCode](https://github.com/MadhuTiwari-345/IsoCode)

---

<p align="center">
  <strong>HOMIQ</strong><br/>
  <sub>A thoughtful first conversation can make all the difference.</sub>
</p>
