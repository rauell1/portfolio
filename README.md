# Roy Okola Otieno — Portfolio

Personal portfolio and CMS for a renewable energy engineer, electric mobility specialist, and clean-tech leader based in Nairobi, Kenya.

**Live site:** https://royotieno.com

---

## Overview

A production-grade, full-stack portfolio site built with React, TypeScript, and Supabase. It showcases projects, case studies, a blog, and a resume — all editable via a built-in admin CMS.

---

## Features

- **Dynamic portfolio** — Projects and case studies pulled from Supabase with static fallbacks
- **Admin CMS** — Authenticated editor for blog posts, projects, case studies, and homepage sections
- **Blog** — Mix of static (pillar) posts and dynamic Supabase-backed posts
- **Contact form** — Email via Supabase Edge Functions + Resend, with rate limiting and input validation
- **Newsletter** — Subscriber management with welcome email automation
- **Dark / Light mode** — Theme toggle with system preference detection
- **Error boundary** — Graceful fallback UI on unexpected render errors
- **Lazy loading** — Non-home pages are code-split for fast initial load

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Bundler | Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Routing | React Router v6 |
| Data fetching | TanStack Query |
| Animations | Framer Motion |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Edge Functions | Deno (Supabase Functions) |
| Email | Resend |
| Deployment | Vercel |

---

## Folder Structure

```
src/
├── App.tsx                  # Root component: routing, providers, error boundary
├── main.tsx                 # Entry point
├── index.css                # Global styles and design tokens
├── components/
│   ├── admin/               # CMS editor components (auth-protected)
│   ├── ui/                  # shadcn/ui primitives (auto-generated)
│   └── *.tsx                # Page section components (Hero, About, etc.)
├── data/
│   ├── blogPosts.ts         # Static pillar blog posts
│   └── portfolioProjects.ts # Static project definitions (fallback)
├── hooks/
│   ├── use-mobile.tsx       # Responsive breakpoint hook
│   ├── use-toast.ts         # Toast notification hook
│   └── useAuth.tsx          # Supabase auth context + hook
├── integrations/
│   └── supabase/
│       ├── client.ts        # Supabase client (env-var configured)
│       └── types.ts         # Auto-generated DB type definitions
├── lib/
│   ├── config.ts            # App config constants (admin email, etc.)
│   ├── smoothScroll.ts      # Scroll utility
│   └── utils.ts             # Tailwind class merge utility
└── pages/
    ├── Index.tsx            # Homepage
    ├── Resume.tsx           # CV / resume page
    ├── Projects.tsx         # Projects list + admin editor
    ├── Blog.tsx             # Blog listing (admin-only)
    ├── BlogPost.tsx         # Blog post reader
    ├── CaseStudiesPage.tsx  # Case studies
    ├── AdminLogin.tsx       # Admin sign-in
    ├── AdminPostEditor.tsx  # Blog post editor
    └── NotFound.tsx         # 404 page

supabase/
├── config.toml              # Supabase project config
├── functions/
│   ├── send-contact-email/  # Edge function: contact form emails
│   └── send-newsletter-welcome/ # Edge function: welcome + admin notification
└── migrations/              # Database schema migrations
```

---

## Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://app.supabase.com) project (optional — site works with static fallback data)
- A [Resend](https://resend.com) account (optional — for contact/newsletter emails)

### 1. Clone and install

```bash
git clone https://github.com/rauell1/portfolio.git
cd portfolio
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Required for dynamic content (Supabase)
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Required for admin CMS access
VITE_ADMIN_EMAIL=your_admin_email@example.com
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes (for dynamic content) | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes (for dynamic content) | Supabase anon/public key |
| `VITE_ADMIN_EMAIL` | Yes (for CMS access) | Email address with admin privileges |

> **Note:** `VITE_` prefixed variables are bundled into the client. Only use public/anon keys here — never service-role keys.

### Supabase Edge Function Secrets

Set these in your Supabase project dashboard under **Settings → Edge Functions**:

| Secret | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key for sending emails |
| `ADMIN_EMAIL` | Admin email for new subscriber notifications |

---

## Database Migrations

Apply migrations using the Supabase CLI:

```bash
supabase db push
```

Migrations are in `supabase/migrations/` and set up:
- `page_sections` — CMS-editable homepage sections
- `blog_posts` — Blog articles
- `projects` — Portfolio projects
- `case_studies` — Detailed case studies
- `newsletter_subscribers` — Newsletter subscription list

---

## Build

```bash
npm run build       # Production build
npm run preview     # Preview the production build locally
npm run lint        # Run ESLint
```

---

## Deployment

### Vercel (recommended)

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set the environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_ADMIN_EMAIL`
3. Deploy settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Framework preset:** Vite

The `vercel.json` in the repo configures SPA routing (all paths → `index.html`).

### Supabase Edge Functions

```bash
supabase functions deploy send-contact-email
supabase functions deploy send-newsletter-welcome
```

Set secrets before deploying:

```bash
supabase secrets set RESEND_API_KEY=your_key
supabase secrets set ADMIN_EMAIL=your_email
```

---

## Admin CMS

1. Navigate to `/admin` and sign in with the configured admin email
2. After signing in, the navbar shows admin links to manage:
   - Blog posts (via `/admin/posts/new` or `/admin/posts/:id`)
   - Projects, case studies, and homepage sections (via inline editors on each page)

---

## Security

- **No secrets in source code** — Supabase credentials loaded from environment variables only
- **Admin access** — Controlled by Supabase Auth + email match against `VITE_ADMIN_EMAIL`
- **Rate limiting** — Contact and newsletter edge functions enforce per-IP rate limits
- **Input validation** — Zod schemas on the frontend; server-side validation in edge functions
- **XSS prevention** — All user input HTML-escaped in email templates
- **Error boundaries** — React error boundary prevents full app crashes

---

## License

Personal portfolio — content and code copyright Roy Okola Otieno.
