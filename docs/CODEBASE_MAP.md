# 🗺️ Codebase Map — Roy Otieno Portfolio

> **Auto-generated** on every push to `main` by `.github/workflows/update-codebase-map.yml`
> Last updated: **2026-05-25T18:32:00.076Z**
> Repo: [rauell1/portfolio](https://github.com/rauell1/portfolio)

---

## 📁 Root

| File | Purpose |
|---|---|
| `.env.example` | Env var template — Supabase URL/key, EmailJS keys, reCAPTCHA |
| `.gitignore` | Ignores node_modules, dist, .env, build artifacts, auto-generated files |
| `README.md` | Project overview, setup instructions, deployment guide |
| `components.json` | shadcn/ui config — component registry, aliases, style defaults |
| `eslint.config.js` | ESLint — TypeScript + React hooks rules |
| `index.html` | SPA entry point — meta tags, OG tags, JSON-LD structured data, font preloads |
| `package.json` | Dependencies + bun scripts (dev, build, lint, preview) |
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
| `src/App.tsx` | Router root — React Router v6 routes, <ThemeProvider>, lazy page imports |
| `src/index.css` | Global styles — CSS variables, Tailwind layers, Satoshi font import, custom animations |
| `src/main.tsx` | React DOM root — wraps <App /> with <StrictMode> |
| `src/utils/supabase/client.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/utils/supabase/middleware.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/utils/supabase/server.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/vite-env.d.ts` | Vite env type declarations |

---

## 📁 src/pages/

| File | Purpose |
|---|---|
| `src/pages/Admin.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/pages/Blog.tsx` | Blog listing — fetches posts from Supabase, search + tag filter |
| `src/pages/BlogPost.tsx` | Individual blog post view — MDX/HTML rendering, TOC |
| `src/pages/CaseStudies.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/pages/CaseStudy.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/pages/Index.tsx` | Home page — assembles all section components |
| `src/pages/NotFound.tsx` | 404 fallback page |
| `src/pages/Projects.tsx` | Full projects listing page with filters and modals |
| `src/pages/Resume.tsx` | Interactive resume — PDF download, experience timeline |

---

## 📁 src/components/ — Section & Layout

| File | Purpose |
|---|---|
| `src/components/About.tsx` | About section — bio, photo, fun facts, downloadable resume button |
| `src/components/Contact.tsx` | Contact form — EmailJS integration, reCAPTCHA v3, validation |
| `src/components/Experience.tsx` | Work experience timeline — roles, companies, dates, bullet points |
| `src/components/Footer.tsx` | Site footer — copyright, social links, quick nav |
| `src/components/Hero.tsx` | Landing hero — animated headline, CTA buttons, social links |
| `src/components/Leadership.tsx` | Leadership & community section — volunteer roles, initiatives |
| `src/components/NavLink.tsx` | Smooth-scroll anchor link primitive used inside Navbar.tsx |
| `src/components/Navbar.tsx` | Responsive sticky navbar — desktop links, mobile hamburger, scroll spy |
| `src/components/ParticleBackground.tsx` | Canvas-based animated particle network used in Hero background |
| `src/components/ProgressBar.tsx` | Scroll progress indicator bar fixed to top of viewport |
| `src/components/Projects.tsx` | Home projects preview — card grid with 3 featured projects |
| `src/components/Skills.tsx` | Skills section — categorised tech stack with proficiency indicators |
| `src/components/SkillsRadarChart.tsx` | Recharts radar chart visualising skill levels by category |
| `src/components/Testimonials.tsx` | Testimonials carousel — quotes, avatars, roles (Supabase-sourced) |
| `src/components/ThemeProvider.tsx` | Context provider — light/dark/system theme state |
| `src/components/ThemeToggle.tsx` | Sun/moon icon button — toggles ThemeProvider theme |

### 📁 src/components/admin/

| File | Purpose |
|---|---|
| `src/components/admin/AdminLayout.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/components/admin/sections/AdminBlogPosts.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/components/admin/sections/AdminCaseStudies.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/components/admin/sections/AdminNewsletter.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/components/admin/sections/AdminOverview.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/components/admin/sections/AdminPageSections.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/components/admin/sections/AdminProjects.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/components/admin/sections/AdminSync.tsx` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |

### 📁 src/components/ui/ — shadcn/ui Primitives

> ⚠️ Do not edit manually — regenerate via `npx shadcn-ui add <component>`

| File | Purpose |
|---|---|
| `src/components/ui/accordion.tsx` | Collapsible accordion |
| `src/components/ui/alert-dialog.tsx` | Modal confirmation dialog |
| `src/components/ui/alert.tsx` | Inline alert / banner |
| `src/components/ui/aspect-ratio.tsx` | Aspect ratio box |
| `src/components/ui/avatar.tsx` | User avatar with fallback |
| `src/components/ui/badge.tsx` | Status / label chip |
| `src/components/ui/breadcrumb.tsx` | Page breadcrumb trail |
| `src/components/ui/button.tsx` | Primary UI button (variants: default, outline, ghost, link) |
| `src/components/ui/calendar.tsx` | Date picker calendar |
| `src/components/ui/card.tsx` | Surface card with header/content/footer slots |
| `src/components/ui/carousel.tsx` | Embla-powered slide carousel |
| `src/components/ui/chart.tsx` | Recharts wrapper with theme tokens |
| `src/components/ui/checkbox.tsx` | Checkbox input |
| `src/components/ui/collapsible.tsx` | Radix collapsible primitive |
| `src/components/ui/command.tsx` | cmdk command palette |
| `src/components/ui/context-menu.tsx` | Right-click context menu |
| `src/components/ui/dialog.tsx` | Modal dialog |
| `src/components/ui/drawer.tsx` | Vaul bottom sheet drawer |
| `src/components/ui/dropdown-menu.tsx` | Dropdown action menu |
| `src/components/ui/form.tsx` | React Hook Form + Zod field wrapper |
| `src/components/ui/hover-card.tsx` | Hover tooltip card |
| `src/components/ui/input-otp.tsx` | One-time password input |
| `src/components/ui/input.tsx` | Text input field |
| `src/components/ui/label.tsx` | Form field label |
| `src/components/ui/menubar.tsx` | Horizontal menu bar |
| `src/components/ui/navigation-menu.tsx` | Radix navigation menu |
| `src/components/ui/pagination.tsx` | Page number controls |
| `src/components/ui/popover.tsx` | Floating popover |
| `src/components/ui/progress.tsx` | Progress bar |
| `src/components/ui/radio-group.tsx` | Radio button group |
| `src/components/ui/resizable.tsx` | Resizable panel group |
| `src/components/ui/scroll-area.tsx` | Custom scrollbar area |
| `src/components/ui/select.tsx` | Dropdown select |
| `src/components/ui/separator.tsx` | Horizontal/vertical divider |
| `src/components/ui/sheet.tsx` | Side-drawer sheet |
| `src/components/ui/sidebar.tsx` | Full sidebar with collapse/expand (used in admin) |
| `src/components/ui/skeleton.tsx` | Loading skeleton shimmer |
| `src/components/ui/slider.tsx` | Range slider |
| `src/components/ui/sonner.tsx` | Sonner toast integration |
| `src/components/ui/switch.tsx` | Toggle switch |
| `src/components/ui/table.tsx` | Data table |
| `src/components/ui/tabs.tsx` | Tabbed content panels |
| `src/components/ui/textarea.tsx` | Multi-line text input |
| `src/components/ui/toast.tsx` | Toast notification |
| `src/components/ui/toaster.tsx` | Toast provider/container |
| `src/components/ui/toggle-group.tsx` | Group of toggle buttons |
| `src/components/ui/toggle.tsx` | Two-state toggle button |
| `src/components/ui/tooltip.tsx` | Hover tooltip |
| `src/components/ui/use-toast.ts` | shadcn/ui primitive |

---

## 📁 src/hooks/

| File | Purpose |
|---|---|
| `src/hooks/use-blog-posts.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/hooks/use-case-studies.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/hooks/use-mobile.tsx` | Breakpoint hook — returns isMobile boolean |
| `src/hooks/use-projects.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/hooks/use-toast.ts` | Toast state manager (shadcn/ui pattern) |

---

## 📁 src/lib/

| File | Purpose |
|---|---|
| `src/lib/config.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/lib/renderMarkdown.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/lib/smoothScroll.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/lib/utils.ts` | cn() helper — merges Tailwind classes with clsx + tailwind-merge |

---

## 📁 src/data/

| File | Purpose |
|---|---|
| `src/data/blogPosts.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `src/data/portfolioProjects.ts` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |

---

## 📁 src/integrations/

| File | Purpose |
|---|---|
| `src/integrations/supabase/client.ts` | Supabase JS client initialised with env vars |
| `src/integrations/supabase/types.ts` | Auto-generated DB types from supabase gen types typescript |

---

## 📁 public/

| File | Purpose |
|---|---|
| `public/MyPortfolioFinal.html` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/Roam_Point_Partnership_Opportunity.pdf` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/Roy_Otieno_CV.pdf` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/favicon.ico` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/favicon.png` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/favicon.svg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/Roam Motorbike x Roam Bus.jpg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/Roam Motorbike x Roam Bus1.jpg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/SafariCharge_DailyGraph_2026-01-07.jpg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/basigo-buses.jpeg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/basigo-charging.png` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/basigo-leading-the-charge.webp` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/borehole-irrigation-ai.jpg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/charging basigo.jpg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/dj-kimchi-screenshot.jpg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/og-image.png` | Open Graph / social preview image (1200×630px) |
| `public/images/roam-charger-1.jpeg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/roam-charger-2.jpeg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/roam-charger-3.jpeg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/roam-charger-4.jpeg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/roam-electric.webp` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/roam-motorbike-x-roam-bus-alt.jpg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/roam-motorbike-x-roam-bus.jpg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/roam-point-ai.jpg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/images/solar-cooling-ai.jpg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/placeholder.svg` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `public/robots.txt` | Search engine crawl rules — sitemap pointer |
| `public/sitemap.xml` | XML sitemap for all routes + section anchors |

---

## 📁 api/ — Vercel Serverless Functions

| File | Purpose |
|---|---|
| `api/_lib/security.ts` | Vercel Serverless Function |
| `api/admin-auth.ts` | Vercel Serverless Function |
| `api/contact.ts` | Vercel Serverless Function |
| `api/newsletter.ts` | Vercel Serverless Function |
| `api/webhooks/inbound.ts` | Vercel Serverless Function |

---

## 📁 supabase/

| File | Purpose |
|---|---|
| `supabase/config.toml` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `supabase/functions/send-contact-email/index.ts` | Supabase Edge Function (Deno) |
| `supabase/functions/send-newsletter-welcome/index.ts` | Supabase Edge Function (Deno) |
| `supabase/migrations/20240001_testimonials.sql` | Supabase SQL migration |
| `supabase/migrations/20260127084747_c02e73d2-84de-4407-b016-83d598ee3bd5.sql` | Supabase SQL migration |
| `supabase/migrations/20260131005236_9c5f7b10-bf56-444f-a7df-a1c635211bb7.sql` | Supabase SQL migration |
| `supabase/migrations/20260131060952_44fff40e-b922-4bde-b6f8-c8a3d79bec21.sql` | Supabase SQL migration |
| `supabase/migrations/20260311074534_4c2e8a61-2069-4d54-b40d-ed7dbce36670.sql` | Supabase SQL migration |
| `supabase/migrations/20260315074656_projects_slug_rls_and_seed.sql` | Supabase SQL migration |
| `supabase/migrations/20260316000000_case_studies.sql` | Supabase SQL migration |
| `supabase/migrations/20260317000000_page_sections_and_project_status.sql` | Supabase SQL migration |
| `supabase/migrations/20260414000000_schema_and_rls_hardening.sql` | Supabase SQL migration |
| `supabase/migrations/20260414010000_blog_share_access_controls.sql` | Supabase SQL migration |

---

## 📁 .github/

| File | Purpose |
|---|---|
| `.github/CODEOWNERS` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/dependabot.yml` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/daily-updates-checker/PROMPT.md` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/PROMPT.md` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/charts.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/colors.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/icons.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/landing.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/products.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/react-performance.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/astro.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/flutter.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/html-tailwind.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/jetpack-compose.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/nextjs.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/nuxt-ui.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/nuxtjs.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/react-native.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/react.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/shadcn.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/svelte.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/swiftui.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/stacks/vue.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/styles.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/typography.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/ui-reasoning.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/ux-guidelines.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/data/web-interface.csv` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/scripts/__pycache__/core.cpython-314.pyc` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/scripts/__pycache__/design_system.cpython-314.pyc` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/scripts/__pycache__/search.cpython-314.pyc` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/scripts/core.py` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/scripts/design_system.py` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/prompts/ui-ux-pro-max/scripts/search.py` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/pull_request_template.md` | _(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_ |
| `.github/scripts/generate-codebase-map.mjs` | Node.js script that walks the repo and writes docs/CODEBASE_MAP.md |
| `.github/workflows/auto-readme-updater.yml` | GitHub Actions workflow |
| `.github/workflows/safe-rollback.yml` | GitHub Actions workflow |
| `.github/workflows/sync-lockfile.yml` | GitHub Actions workflow |
| `.github/workflows/update-codebase-map.yml` | GitHub Actions — auto-regenerates docs/CODEBASE_MAP.md on every push to main |
| `.github/workflows/workflow-guard.yml` | GitHub Actions workflow |

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

_Auto-regenerated by `.github/scripts/generate-codebase-map.mjs`. Manual edits will be overwritten on next push to `main`._