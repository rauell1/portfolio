# Roy Okola Otieno — Portfolio

Personal portfolio and CMS for a renewable energy engineer, electric mobility specialist, and clean-tech leader based in Nairobi, Kenya.

**Live site:** https://royotieno.com

---

## Quickstart

1) Install prerequisites: Node.js 18+ and the Supabase CLI (for migrations/functions).  
2) Install deps: `npm ci`  
3) Configure env: `cp .env.example .env` and fill the values below. Supabase credentials are required because the client is used across pages.  
4) Run locally: `npm run dev` then open http://localhost:5173  
5) (Optional) Sync the database: `supabase db push` from the project root.

> The UI ships with fallback content in `src/data/blogPosts.ts` and `src/data/portfolioProjects.ts`, but the Supabase client still needs valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to load without runtime errors.

---

## Scripts

- `npm run dev` — Vite dev server
- `npm run lint` — ESLint across the repo
- `npm run build` — Production build
- `npm run preview` — Serve the production build locally

---

## Architecture

- React 18 + TypeScript (Vite)
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- React Router v6 for routing and code-split pages
- TanStack Query for data fetching/caching
- Supabase (PostgreSQL + Auth + Edge Functions + Storage) as the backend
- Framer Motion for animation, Resend for transactional email

---

## Environment & Data

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/public key used by the client |
| `VITE_ADMIN_EMAIL` | Yes | Email with admin privileges in the CMS |

`VITE_`-prefixed values are exposed to the client; only use public/anon Supabase keys.

Data sources:
- Supabase tables: `projects`, `case_studies`, `blog_posts`, `page_sections`, `newsletter_subscribers`
- Static fallbacks: `src/data/blogPosts.ts` and `src/data/portfolioProjects.ts` (used when tables are empty or fetches fail)
- Supabase client configuration: `src/integrations/supabase/client.ts`

Supabase Edge Function secrets (set in the Supabase dashboard):
- `RESEND_API_KEY` — for contact/newsletter emails
- `ADMIN_EMAIL` — for admin notifications

---

## Admin CMS

- Create a Supabase Auth user whose email matches `VITE_ADMIN_EMAIL`
- Visit `/admin` to sign in; once authenticated, the navbar exposes admin routes:
  - Blog posts: `/admin/posts/new` and `/admin/posts/:id`
  - Projects, case studies, and homepage sections: inline editors on their respective pages
- Dynamic pages fetch from Supabase first and keep static fallback content if the query returns no rows.

---

## Database & Edge Functions

- Migrations live in `supabase/migrations/`; apply with `supabase db push`
- Edge functions live in `supabase/functions/`; deploy with:
  - `supabase functions deploy send-contact-email`
  - `supabase functions deploy send-newsletter-welcome`
- Configure `supabase/config.toml` per your project, and set the function secrets before deploying:
  - `supabase secrets set RESEND_API_KEY=your_key`
  - `supabase secrets set ADMIN_EMAIL=your_email`

---

## Deployment (Vercel)

1. Connect the repo to Vercel.  
2. Set env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_ADMIN_EMAIL`.  
3. Build command: `npm run build`  
4. Output directory: `dist`  
5. SPA routing is configured via `vercel.json`.

---

## Security

- No service-role keys in the client; use only anon/public keys
- Admin access is gated by Supabase Auth and `VITE_ADMIN_EMAIL`
- Edge functions enforce validation and rate limiting for contact/newsletter flows

---

## License

Personal portfolio — content and code copyright Roy Okola Otieno.
