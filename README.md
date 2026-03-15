# Roy Okola – Portfolio

A personal portfolio and thought-leadership site focused on renewable energy engineering, electric mobility infrastructure, and sustainable systems in Africa.

## What’s included

* **About** – Background, skills, and resume (CV download)
* **Projects** – Project portfolio with a featured Roam Point EV charging case study and admin-managed projects
* **Case studies** – Detailed case studies (solar microgrid, Roam Point, site feasibility, cold storage, energy demand modeling)
* **Blog** – Articles on solar, EV charging, and circular economy (Supabase-backed with static pillar content)
* **Contact** – Get in touch

## Tech stack

* **React 18** + **TypeScript** + **Vite**
* **Tailwind CSS** + **shadcn/ui** (Radix)
* **React Router** for client-side routing
* **Supabase** for blog posts and projects (optional; static content works without it)
* **Framer Motion** for animations

## Requirements

* Node.js 18+
* npm or yarn

## Setup

```bash
# Clone and enter the project
git clone <your-repo-url>
cd portfolio

# Install dependencies
npm install

# Optional: configure Supabase for blog/projects
# Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
# Without env, the app still runs with static blog and projects.

# Run locally
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start dev server         |
| `npm run build` | Production build      |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint              |

## Deployment

Build output is in `dist/`. Deploy that folder to any static host:

* **Vercel** – Connect the repo; build command `npm run build`, output directory `dist`
* **Netlify** – Same; add redirects for client-side routing: `/* /index.html 200`
* **GitHub Pages / other** – Run `npm run build` and upload `dist/`, and configure SPA fallback to `index.html`

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the host’s environment if you use Supabase for blog/projects.

## Project structure

```
portfolio/
├── public/          Static assets (CV, PDFs, images)
├── src/
│   ├── components/ UI components
│   ├── data/        Static blog posts and content
│   ├── hooks/       useAuth, etc.
│   ├── integrations/ Supabase client
│   ├── pages/       Route pages (Index, Blog, Projects, CaseStudies, etc.)
│   └── main.tsx     Entry point
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## License

Personal portfolio; content and code as specified in the repository.
