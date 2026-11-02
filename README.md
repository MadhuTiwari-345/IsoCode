# HOMIQ

HOMIQ is a real-estate lead management platform for residential developers. It combines a public property discovery experience, multilingual lead capture, customer conversations, visit scheduling, and a staff workspace with Payload CMS.

## Stack

- Next.js 16 and React 19
- Payload CMS 4
- PostgreSQL through Payload's official Drizzle adapter
- Tailwind CSS 4

## Local setup

Requirements: Node.js 24.22.1 or newer and pnpm 10.

1. Install dependencies:

   ```bash
   corepack enable
   pnpm install
   ```

2. Create a local PostgreSQL database and copy `.env.example` to `.env`. Set `DATABASE_URL` and generate a strong `PAYLOAD_SECRET`.

3. Generate the Payload admin import map and TypeScript types:

   ```bash
   pnpm generate:importmap
   pnpm generate:types
   ```

4. Create and apply the initial database migration:

   ```bash
   pnpm db:migrate:create
   pnpm db:migrate
   ```

   Commit the generated migration files. Apply migrations to each environment before starting the application.

5. Start the app:

   ```bash
   pnpm dev
   ```

The public site runs at http://localhost:3000 and the Payload admin is at http://localhost:3000/admin. Create the first administrator in the Payload admin.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (use the provider's pooled URL for serverless runtime and a direct URL for migrations if the provider supplies both) |
| `PAYLOAD_SECRET` | Yes | Long, random secret used to sign Payload authentication tokens |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical public site URL, e.g. `https://your-domain.vercel.app` |

Never commit real environment values. See `.env.example`.

## Vercel deployment

Connect the GitHub repository to Vercel with the repository root as the Root Directory and Node.js 24.x. Add the production and preview environment variables above. Provision a managed PostgreSQL database (Neon or another PostgreSQL provider), configure its connection string, and run the committed Payload migrations against it before routing real users to the deployment.

The Vercel build command is `pnpm build`. The app uses Next.js standalone output and Payload's Next.js integration.

## Important production checks

- Configure a persistent PostgreSQL database before enabling signups or lead capture.
- Keep `PAYLOAD_SECRET` encrypted in Vercel and use different secrets for production and preview.
- Configure database backups and restrict database network access.
- Configure trusted image hosts if you later re-enable Next.js image optimization.
- Verify staff roles and collection access policies before inviting sales staff.
