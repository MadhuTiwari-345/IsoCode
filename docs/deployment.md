# HOMIQ deployment guide

Repository: https://github.com/MadhuTiwari-345/IsoCode  
Live app: https://isocode-homiq.vercel.app

## Prerequisites

- Node.js 24.22.1 or a compatible Node 24 release
- pnpm 10.x
- A MongoDB database reachable from the application (MongoDB Atlas is suitable)
- Git

## Run locally

1. Clone the public repository:

   ```bash
   git clone https://github.com/MadhuTiwari-345/IsoCode.git
   cd IsoCode
   ```

2. Install the pinned dependencies:

   ```bash
   corepack enable
   pnpm install
   ```

3. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

4. Set the following variables in `.env`:

   - `DATABASE_URL`: MongoDB connection string for a development database.
   - `PAYLOAD_SECRET`: a unique random secret (for example, generate one with `openssl rand -base64 48`).
   - `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000`.

   Do not commit `.env` or paste credentials into issues, screenshots or documentation.

5. Start the development server:

   ```bash
   pnpm dev
   ```

6. Open:
   - Buyer website: http://localhost:3000
   - Sign in / buyer account: http://localhost:3000/login and http://localhost:3000/signup
   - Payload administration: http://localhost:3000/admin

7. Create the first Payload administrator through the supported Payload initialization flow if the database is empty. Use the admin interface to create sales executives, project records, fact-sheet entries and visit slots. A buyer can create an account through the public sign-up page.

## Production deployment

The application is a Next.js and Payload application deployed on Vercel. Connect the GitHub repository to the Vercel project, set the production environment variables below, and deploy the `main` branch. Vercel creates a deployment for each pushed commit.

Required production environment variables (names only):

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS application origin. Use a production MongoDB database and a different `PAYLOAD_SECRET` from local development. Never place variable values in this file.

## Accounts for review

- **Buyer:** use the public sign-up flow at `/signup`, then sign in at `/login`.
- **Sales executive / sales head:** staff roles are not self-selectable. A Payload administrator must create the website account and set its role and linked sales-executive record in the admin interface.

No shared demo password is published in this repository. A reviewer-specific account must be provisioned in the connected review database and shared through a private channel. This avoids committing reusable credentials to a public repository.

## Data setup

Create only client-approved project records. Public project pages and buyer recommendations require `approvedForPublic = true`. Before enabling that flag, verify the project's official name, address, map coordinates, RERA registration number, price range, possession details and images against client-approved material.

Create fact-sheet entries for supported topics and translations. Create future visit slots with a positive capacity and assign active sales executives. The app does not manufacture project registration details or real inventory.

## Operational limitations

- Portal and hoarding lead ingestion is not connected; the current buyer web flow records web-originated enquiries.
- The assistant is a deterministic, fact-sheet-grounded guided assistant, not a configured generative LLM agent.
- Reminder timestamps are stored on bookings. A production scheduler and messaging provider must be configured before reminders are considered delivered.
- WhatsApp Business is not enabled. It requires a business provider, credentials, approved templates and buyer opt-in.
- Review the live deployment and its connected database before using it with real buyers.
