# 🗺️ Codebase Map — Roy Otieno Portfolio

> **Auto-generated** on every push to `main` by `.github/workflows/update-codebase-map.yml`
> This file lives in `docs/` and is regenerated automatically. Manual edits will be overwritten.

---

## 📁 Root

| File | Purpose |
|---|---|
| `.env.example` | Env var template — Supabase URL/key, EmailJS keys, reCAPTCHA |
| `.gitignore` | Ignores node_modules, dist, .env, build artifacts |
| `README.md` | Project overview, setup instructions, deployment guide |
| `components.json` | shadcn/ui config — component registry, aliases, style defaults |
| `eslint.config.js` | ESLint — TypeScript + React hooks rules |
| `index.html` | SPA entry point — meta tags, OG tags, JSON-LD structured data, font preloads |
| `package.json` | Dependencies + scripts (dev, build, lint, preview) |
| `postcss.config.js` | PostCSS — Tailwind + Autoprefixer |
| `tailwind.config.ts` | Tailwind v3 theme — custom colors, animations, shadcn-ui preset |
| `tsconfig.app.json` | App TS config — strict mode, path aliases, React JSX transform |
| `tsconfig.json` | Root TS config — references tsconfig.app.json + tsconfig.node.json |
| `tsconfig.node.json` | Node/tooling TS config — for Vite config file |
| `vercel.json` | Vercel routing — SPA fallback rewrite (`/*` → `/index.html`) |
| `vite.config.ts` | Vite build config — path aliases (`@/`), React plugin, chunk splitting |

---

## 📁 src/ — Entry Points

| File | Purpose |
|---|---|
| `src/App.tsx` | Router root — React Router v6 routes, ThemeProvider, lazy page imports |
| `src/index.css` | Global styles — CSS variables, Tailwind layers, Satoshi font import, custom animations |
| `src/main.tsx` | React DOM root — wraps App with StrictMode |
| `src/vite-env.d.ts` | Vite env type declarations |

---

## 📁 src/pages/

| File | Purpose |
|---|---|
| `src/pages/AdminLogin.tsx` | Admin auth gate — Supabase email/password login |
| `src/pages/AdminPostEditor.tsx` | Blog post CRUD editor — RichTextEditor, image upload, publish |
| `src/pages/Blog.tsx` | Blog listing — fetches posts from Supabase, search + tag filter |
| `src/pages/BlogPost.tsx` | Individual blog post view — MDX/HTML rendering, TOC |
| `src/pages/CaseStudiesPage.tsx` | Detailed case study pages with tabs, metrics, timeline |
| `src/pages/Index.tsx` | Home page — assembles all section components |
| `src/pages/NotFound.tsx` | 404 fallback page |
| `src/pages/Projects.tsx` | Full projects listing page with filters and modals |
| `src/pages/Resume.tsx` | Interactive resume — PDF download, experience timeline |

---

## 📁 src/components/ — Section & Layout

| File | Purpose |
|---|---|
| `src/components/About.tsx` | About section — bio, photo, fun facts, downloadable resume button |
| `src/components/CaseStudies.tsx` | Home case studies preview — highlight cards linking to full page |
| `src/components/Contact.tsx` | Contact form — EmailJS integration, reCAPTCHA v3, validation |
| `src/components/Experience.tsx` | Work experience timeline — roles, companies, dates, bullet points |
| `src/components/Footer.tsx` | Site footer — copyright, social links, quick nav |
| `src/components/Hero.tsx` | Landing hero — animated headline, CTA buttons, social links |
| `src/components/Leadership.tsx` | Leadership & community section — volunteer roles, initiatives |
| `src/components/NavLink.tsx` | Smooth-scroll anchor link primitive used inside Navbar.tsx |
| `src/components/Navbar.tsx` | Responsive sticky navbar — desktop links, mobile hamburger, scroll spy |
| `src/components/NewsletterForm.tsx` | Email newsletter signup — EmailJS or Supabase Edge Function |
| `src/components/ParticleBackground.tsx` | Canvas-based animated particle network used in Hero background |
| `src/components/ProgressBar.tsx` | Scroll progress indicator bar fixed to top of viewport |
| `src/components/Projects.tsx` | Home projects preview — card grid with 3 featured projects |
| `src/components/RichTextEditor.tsx` | Tiptap-based WYSIWYG editor used in AdminPostEditor |
| `src/components/Skills.tsx` | Skills section — categorised tech stack with proficiency indicators |
| `src/components/SkillsRadarChart.tsx` | Recharts radar chart visualising skill levels by category |
| `src/components/Testimonials.tsx` | Testimonials carousel — quotes, avatars, roles (Supabase-sourced) |
| `src/components/ThemeProvider.tsx` | Context provider — light/dark/system theme state |
| `src/components/ThemeToggle.tsx` | Sun/moon icon button — toggles ThemeProvider theme |

---

## 📁 src/integrations/

| File | Purpose |
|---|---|
| `src/integrations/supabase/client.ts` | Supabase JS client initialised with env vars |
| `src/integrations/supabase/types.ts` | Auto-generated DB types from supabase gen types typescript |

---

## 🔑 Key Aliases

| Alias | Resolves to |
|---|---|
| `@/` | `src/` |
| `@/components` | `src/components/` |
| `@/pages` | `src/pages/` |
| `@/hooks` | `src/hooks/` |
| `@/lib` | `src/lib/` |
| `@/data` | `src/data/` |
| `@/integrations` | `src/integrations/` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 + CSS variables |
| UI Primitives | shadcn/ui (Radix UI + Tailwind) |
| Routing | React Router v6 |
| Data / Auth | Supabase (PostgreSQL + Auth + Storage) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Email | EmailJS + Supabase Edge Functions |
| Animation | Custom CSS + Canvas particles |
| Fonts | Satoshi (Fontshare) |
| Deployment | Vercel (SPA routing via vercel.json) |
| Package Manager | Bun |

---

_Auto-regenerated by `.github/scripts/generate-codebase-map.mjs`. Manual edits will be overwritten on the next push to `main`._
