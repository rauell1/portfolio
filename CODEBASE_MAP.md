# 🗺️ Codebase Map — Roy Otieno Portfolio

> **Auto-generated** on every push to `main` by `.github/workflows/update-codebase-map.yml`  
> Last updated: _(see git log for timestamp)_  
> Repo: [rauell1/portfolio](https://github.com/rauell1/portfolio)

---

## 📁 Root

| File | Purpose |
|---|---|
| `index.html` | SPA entry point — meta tags, OG tags, JSON-LD structured data, font preloads |
| `vite.config.ts` | Vite build config — path aliases (`@/`), React plugin, chunk splitting |
| `tailwind.config.ts` | Tailwind v3 theme — custom colors, animations, shadcn-ui preset |
| `tsconfig.json` | Root TS config — references `tsconfig.app.json` + `tsconfig.node.json` |
| `tsconfig.app.json` | App TS config — strict mode, path aliases, React JSX transform |
| `tsconfig.node.json` | Node/tooling TS config — for Vite config file |
| `postcss.config.js` | PostCSS — Tailwind + Autoprefixer |
| `eslint.config.js` | ESLint — TypeScript + React hooks rules |
| `components.json` | shadcn/ui config — component registry, aliases, style defaults |
| `vercel.json` | Vercel routing — SPA fallback rewrite (`/*` → `/index.html`) |
| `package.json` | Dependencies + npm scripts (`dev`, `build`, `lint`, `preview`) |
| `bun.lock` | Bun lockfile (fast installs in CI) |
| `.env.example` | Env var template — Supabase URL/key, EmailJS keys, reCAPTCHA |
| `.gitignore` | Ignores `node_modules`, `dist`, `.env`, build artifacts |
| `README.md` | Project overview, setup instructions, deployment guide |

---

## 📁 src/

### Entry Points

| File | Purpose |
|---|---|
| `src/main.tsx` | React DOM root — wraps `<App />` with `<StrictMode>` |
| `src/App.tsx` | Router root — React Router v6 routes, `<ThemeProvider>`, lazy page imports |
| `src/index.css` | Global styles — CSS variables, Tailwind layers, Satoshi font import, custom animations |
| `src/vite-env.d.ts` | Vite env type declarations |

---

### 📁 src/pages/

Full page-level route components.

| File | Route | Purpose |
|---|---|---|
| `Index.tsx` | `/` | Home page — assembles all section components |
| `Projects.tsx` | `/projects` | Full projects listing page with filters and modals |
| `CaseStudiesPage.tsx` | `/case-studies` | Detailed case study pages with tabs, metrics, timeline |
| `Blog.tsx` | `/blog` | Blog listing — fetches posts from Supabase, search + tag filter |
| `BlogPost.tsx` | `/blog/:slug` | Individual blog post view — MDX/HTML rendering, TOC |
| `Resume.tsx` | `/resume` | Interactive resume — PDF download, experience timeline |
| `AdminLogin.tsx` | `/admin` | Admin auth gate — Supabase email/password login |
| `AdminPostEditor.tsx` | `/admin/posts/:id` | Blog post CRUD editor — RichTextEditor, image upload, publish |
| `NotFound.tsx` | `*` | 404 fallback page |

---

### 📁 src/components/

Section and layout components used in pages.

| File | Purpose |
|---|---|
| `Hero.tsx` | Landing hero — animated headline, CTA buttons, social links |
| `About.tsx` | About section — bio, photo, fun facts, downloadable resume button |
| `Skills.tsx` | Skills section — categorised tech stack with proficiency indicators |
| `SkillsRadarChart.tsx` | Recharts radar chart visualising skill levels by category |
| `Projects.tsx` | Home projects preview — card grid with 3 featured projects |
| `CaseStudies.tsx` | Home case studies preview — highlight cards linking to full page |
| `Experience.tsx` | Work experience timeline — roles, companies, dates, bullet points |
| `Leadership.tsx` | Leadership & community section — volunteer roles, initiatives |
| `Testimonials.tsx` | Testimonials carousel — quotes, avatars, roles (Supabase-sourced) |
| `Contact.tsx` | Contact form — EmailJS integration, reCAPTCHA v3, validation |
| `Navbar.tsx` | Responsive sticky navbar — desktop links, mobile hamburger, scroll spy |
| `NavLink.tsx` | Smooth-scroll anchor link primitive used inside `Navbar.tsx` |
| `Footer.tsx` | Site footer — copyright, social links, quick nav |
| `ThemeProvider.tsx` | Context provider — light/dark/system theme state, localStorage persistence |
| `ThemeToggle.tsx` | Sun/moon icon button — toggles `ThemeProvider` theme |
| `ParticleBackground.tsx` | Canvas-based animated particle network used in Hero background |
| `ProgressBar.tsx` | Scroll progress indicator bar fixed to top of viewport |
| `NewsletterForm.tsx` | Email newsletter signup — EmailJS or Supabase Edge Function |
| `RichTextEditor.tsx` | Tiptap-based WYSIWYG editor used in `AdminPostEditor` |

#### 📁 src/components/admin/

Admin-only UI components (used within admin pages).

| File | Purpose |
|---|---|
| _(see directory for current files)_ | Admin dashboard panels, post list, image uploader |

#### 📁 src/components/ui/

shadcn/ui primitives — **do not edit manually**, regenerate via `npx shadcn-ui add <component>`.

| File | Primitive |
|---|---|
| `accordion.tsx` | Collapsible accordion |
| `alert.tsx` | Inline alert / banner |
| `alert-dialog.tsx` | Modal confirmation dialog |
| `aspect-ratio.tsx` | Aspect ratio box |
| `avatar.tsx` | User avatar with fallback |
| `badge.tsx` | Status / label chip |
| `breadcrumb.tsx` | Page breadcrumb trail |
| `button.tsx` | Primary UI button (variants: default, outline, ghost, link) |
| `calendar.tsx` | Date picker calendar |
| `card.tsx` | Surface card with header/content/footer slots |
| `carousel.tsx` | Embla-powered slide carousel |
| `chart.tsx` | Recharts wrapper with theme tokens |
| `checkbox.tsx` | Checkbox input |
| `collapsible.tsx` | Radix collapsible primitive |
| `command.tsx` | cmdk command palette |
| `context-menu.tsx` | Right-click context menu |
| `dialog.tsx` | Modal dialog |
| `drawer.tsx` | Vaul bottom sheet drawer |
| `dropdown-menu.tsx` | Dropdown action menu |
| `form.tsx` | React Hook Form + Zod field wrapper |
| `hover-card.tsx` | Hover tooltip card |
| `input.tsx` | Text input field |
| `input-otp.tsx` | One-time password input |
| `label.tsx` | Form field label |
| `menubar.tsx` | Horizontal menu bar |
| `navigation-menu.tsx` | Radix navigation menu |
| `pagination.tsx` | Page number controls |
| `popover.tsx` | Floating popover |
| `progress.tsx` | Progress bar |
| `radio-group.tsx` | Radio button group |
| `resizable.tsx` | Resizable panel group |
| `scroll-area.tsx` | Custom scrollbar area |
| `select.tsx` | Dropdown select |
| `separator.tsx` | Horizontal/vertical divider |
| `sheet.tsx` | Side-drawer sheet |
| `sidebar.tsx` | Full sidebar with collapse/expand (used in admin) |
| `skeleton.tsx` | Loading skeleton shimmer |
| `slider.tsx` | Range slider |
| `sonner.tsx` | Sonner toast integration |
| `switch.tsx` | Toggle switch |
| `table.tsx` | Data table |
| `tabs.tsx` | Tabbed content panels |
| `textarea.tsx` | Multi-line text input |
| `toast.tsx` | Toast notification |
| `toaster.tsx` | Toast provider/container |
| `toggle.tsx` | Two-state toggle button |
| `toggle-group.tsx` | Group of toggle buttons |
| `tooltip.tsx` | Hover tooltip |

---

### 📁 src/hooks/

Custom React hooks.

| File | Purpose |
|---|---|
| `use-toast.ts` | Toast state manager (shadcn/ui pattern) |
| `use-mobile.tsx` | Breakpoint hook — returns `isMobile` boolean |

---

### 📁 src/lib/

Shared utilities.

| File | Purpose |
|---|---|
| `utils.ts` | `cn()` helper — merges Tailwind classes with `clsx` + `tailwind-merge` |

---

### 📁 src/data/

Static data files (content used before Supabase CMS was added).

| File | Purpose |
|---|---|
| _(see directory)_ | Seed data arrays for projects, skills, experience, testimonials |

---

### 📁 src/integrations/

Third-party service clients.

| File | Purpose |
|---|---|
| `supabase/client.ts` | Supabase JS client initialised with env vars |
| `supabase/types.ts` | Auto-generated DB types from `supabase gen types typescript` |

---

### 📁 src/assets/

Static assets bundled by Vite (images, SVGs imported in components).

---

## 📁 public/

Static files served as-is (not processed by Vite).

| File | Purpose |
|---|---|
| `robots.txt` | Search engine crawl rules — sitemap pointer |
| `sitemap.xml` | XML sitemap for all routes + section anchors |
| `images/og-image.png` | Open Graph / social preview image (1200×630px) |
| `favicon.ico` | Browser favicon |

---

## 📁 api/

Vercel Serverless Functions (Node.js Edge/Serverless runtime).

| File | Route | Purpose |
|---|---|---|
| _(see directory)_ | `/api/*` | Any server-side endpoints (contact form fallback, webhooks) |

---

## 📁 supabase/

Local Supabase project config.

| File/Dir | Purpose |
|---|---|
| `config.toml` | Local Supabase project settings |
| `migrations/` | SQL migration files — schema changes, RLS policies |
| `functions/` | Supabase Edge Functions (Deno runtime) |

---

## 📁 .github/

GitHub Actions workflows.

| File | Trigger | Purpose |
|---|---|---|
| `workflows/update-codebase-map.yml` | Push to `main` | Regenerates this `CODEBASE_MAP.md` file automatically |
| _(other workflows)_ | Various | CI checks, Lighthouse audits, etc. |

---

## 🔑 Key Aliases & Paths

| Alias | Resolves to | Usage |
|---|---|---|
| `@/` | `src/` | `import { cn } from '@/lib/utils'` |
| `@/components` | `src/components/` | All component imports |
| `@/pages` | `src/pages/` | Page-level imports |
| `@/hooks` | `src/hooks/` | Hook imports |
| `@/lib` | `src/lib/` | Utility imports |
| `@/data` | `src/data/` | Static data imports |
| `@/integrations` | `src/integrations/` | Service clients |

---

## 🛠️ Tech Stack Summary

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
| Deployment | Vercel (SPA routing via `vercel.json`) |
| Package Manager | Bun (CI) / npm (local) |

---

_This file is auto-regenerated. Manual edits will be overwritten on the next push to `main`._
