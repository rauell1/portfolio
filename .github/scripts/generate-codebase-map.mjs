/**
 * generate-codebase-map.mjs
 *
 * Walks the repo and regenerates docs/CODEBASE_MAP.md.
 * Run by the GitHub Actions workflow on every push to main.
 *
 * Design goals:
 *  - Zero external dependencies (pure Node.js built-ins only)
 *  - Preserves hand-written descriptions for known files
 *  - Auto-discovers new files and marks them as "(no description yet)"
 *  - Skips ignored directories (node_modules, dist, .git, etc.)
 */

import { readdir, writeFile, mkdir } from 'fs/promises';
import { join, relative, basename } from 'path';

const ROOT = process.cwd();
const OUTPUT = join(ROOT, 'docs', 'CODEBASE_MAP.md');

// Directories to skip entirely
const SKIP_DIRS = new Set([
  'node_modules', 'dist', '.git', '.next', 'coverage',
  'build', '.turbo', '.cache', 'old', 'docs',
]);

// Files to skip
const SKIP_FILES = new Set([
  'bun.lock', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
]);

// Known file descriptions — extend this map as the project grows
const DESCRIPTIONS = {
  // Root
  'index.html': 'SPA entry point — meta tags, OG tags, JSON-LD structured data, font preloads',
  'vite.config.ts': 'Vite build config — path aliases (`@/`), React plugin, chunk splitting',
  'tailwind.config.ts': 'Tailwind v3 theme — custom colors, animations, shadcn-ui preset',
  'tsconfig.json': 'Root TS config — references tsconfig.app.json + tsconfig.node.json',
  'tsconfig.app.json': 'App TS config — strict mode, path aliases, React JSX transform',
  'tsconfig.node.json': 'Node/tooling TS config — for Vite config file',
  'postcss.config.js': 'PostCSS — Tailwind + Autoprefixer',
  'eslint.config.js': 'ESLint — TypeScript + React hooks rules',
  'components.json': 'shadcn/ui config — component registry, aliases, style defaults',
  'vercel.json': 'Vercel routing — SPA fallback rewrite (`/*` → `/index.html`)',
  'package.json': 'Dependencies + bun scripts (dev, build, lint, preview)',
  '.env.example': 'Env var template — Supabase URL/key, EmailJS keys, reCAPTCHA',
  '.gitignore': 'Ignores node_modules, dist, .env, build artifacts, auto-generated files',
  'README.md': 'Project overview, setup instructions, deployment guide',

  // src/
  'src/main.tsx': 'React DOM root — wraps <App /> with <StrictMode>',
  'src/App.tsx': 'Router root — React Router v6 routes, <ThemeProvider>, lazy page imports',
  'src/index.css': 'Global styles — CSS variables, Tailwind layers, Satoshi font import, custom animations',
  'src/vite-env.d.ts': 'Vite env type declarations',

  // Pages
  'src/pages/Index.tsx': 'Home page — assembles all section components',
  'src/pages/Projects.tsx': 'Full projects listing page with filters and modals',
  'src/pages/CaseStudiesPage.tsx': 'Detailed case study pages with tabs, metrics, timeline',
  'src/pages/Blog.tsx': 'Blog listing — fetches posts from Supabase, search + tag filter',
  'src/pages/BlogPost.tsx': 'Individual blog post view — MDX/HTML rendering, TOC',
  'src/pages/Resume.tsx': 'Interactive resume — PDF download, experience timeline',
  'src/pages/AdminLogin.tsx': 'Admin auth gate — Supabase email/password login',
  'src/pages/AdminPostEditor.tsx': 'Blog post CRUD editor — RichTextEditor, image upload, publish',
  'src/pages/NotFound.tsx': '404 fallback page',

  // Section components
  'src/components/Hero.tsx': 'Landing hero — animated headline, CTA buttons, social links',
  'src/components/About.tsx': 'About section — bio, photo, fun facts, downloadable resume button',
  'src/components/Skills.tsx': 'Skills section — categorised tech stack with proficiency indicators',
  'src/components/SkillsRadarChart.tsx': 'Recharts radar chart visualising skill levels by category',
  'src/components/Projects.tsx': 'Home projects preview — card grid with 3 featured projects',
  'src/components/CaseStudies.tsx': 'Home case studies preview — highlight cards linking to full page',
  'src/components/Experience.tsx': 'Work experience timeline — roles, companies, dates, bullet points',
  'src/components/Leadership.tsx': 'Leadership & community section — volunteer roles, initiatives',
  'src/components/Testimonials.tsx': 'Testimonials carousel — quotes, avatars, roles (Supabase-sourced)',
  'src/components/Contact.tsx': 'Contact form — EmailJS integration, reCAPTCHA v3, validation',
  'src/components/Navbar.tsx': 'Responsive sticky navbar — desktop links, mobile hamburger, scroll spy',
  'src/components/NavLink.tsx': 'Smooth-scroll anchor link primitive used inside Navbar.tsx',
  'src/components/Footer.tsx': 'Site footer — copyright, social links, quick nav',
  'src/components/ThemeProvider.tsx': 'Context provider — light/dark/system theme state',
  'src/components/ThemeToggle.tsx': 'Sun/moon icon button — toggles ThemeProvider theme',
  'src/components/ParticleBackground.tsx': 'Canvas-based animated particle network used in Hero background',
  'src/components/ProgressBar.tsx': 'Scroll progress indicator bar fixed to top of viewport',
  'src/components/NewsletterForm.tsx': 'Email newsletter signup — EmailJS or Supabase Edge Function',
  'src/components/RichTextEditor.tsx': 'Tiptap-based WYSIWYG editor used in AdminPostEditor',

  // Hooks
  'src/hooks/use-toast.ts': 'Toast state manager (shadcn/ui pattern)',
  'src/hooks/use-mobile.tsx': 'Breakpoint hook — returns isMobile boolean',

  // Lib
  'src/lib/utils.ts': 'cn() helper — merges Tailwind classes with clsx + tailwind-merge',

  // Integrations
  'src/integrations/supabase/client.ts': 'Supabase JS client initialised with env vars',
  'src/integrations/supabase/types.ts': 'Auto-generated DB types from supabase gen types typescript',

  // Public
  'public/robots.txt': 'Search engine crawl rules — sitemap pointer',
  'public/sitemap.xml': 'XML sitemap for all routes + section anchors',
  'public/images/og-image.png': 'Open Graph / social preview image (1200×630px)',

  // Config / CI
  '.github/workflows/update-codebase-map.yml': 'GitHub Actions — auto-regenerates docs/CODEBASE_MAP.md on every push to main',
  '.github/scripts/generate-codebase-map.mjs': 'Node.js script that walks the repo and writes docs/CODEBASE_MAP.md',
};

// shadcn/ui primitive descriptions (short)
const SHADCN_DESCRIPTIONS = {
  'accordion.tsx': 'Collapsible accordion',
  'alert.tsx': 'Inline alert / banner',
  'alert-dialog.tsx': 'Modal confirmation dialog',
  'aspect-ratio.tsx': 'Aspect ratio box',
  'avatar.tsx': 'User avatar with fallback',
  'badge.tsx': 'Status / label chip',
  'breadcrumb.tsx': 'Page breadcrumb trail',
  'button.tsx': 'Primary UI button (variants: default, outline, ghost, link)',
  'calendar.tsx': 'Date picker calendar',
  'card.tsx': 'Surface card with header/content/footer slots',
  'carousel.tsx': 'Embla-powered slide carousel',
  'chart.tsx': 'Recharts wrapper with theme tokens',
  'checkbox.tsx': 'Checkbox input',
  'collapsible.tsx': 'Radix collapsible primitive',
  'command.tsx': 'cmdk command palette',
  'context-menu.tsx': 'Right-click context menu',
  'dialog.tsx': 'Modal dialog',
  'drawer.tsx': 'Vaul bottom sheet drawer',
  'dropdown-menu.tsx': 'Dropdown action menu',
  'form.tsx': 'React Hook Form + Zod field wrapper',
  'hover-card.tsx': 'Hover tooltip card',
  'input.tsx': 'Text input field',
  'input-otp.tsx': 'One-time password input',
  'label.tsx': 'Form field label',
  'menubar.tsx': 'Horizontal menu bar',
  'navigation-menu.tsx': 'Radix navigation menu',
  'pagination.tsx': 'Page number controls',
  'popover.tsx': 'Floating popover',
  'progress.tsx': 'Progress bar',
  'radio-group.tsx': 'Radio button group',
  'resizable.tsx': 'Resizable panel group',
  'scroll-area.tsx': 'Custom scrollbar area',
  'select.tsx': 'Dropdown select',
  'separator.tsx': 'Horizontal/vertical divider',
  'sheet.tsx': 'Side-drawer sheet',
  'sidebar.tsx': 'Full sidebar with collapse/expand (used in admin)',
  'skeleton.tsx': 'Loading skeleton shimmer',
  'slider.tsx': 'Range slider',
  'sonner.tsx': 'Sonner toast integration',
  'switch.tsx': 'Toggle switch',
  'table.tsx': 'Data table',
  'tabs.tsx': 'Tabbed content panels',
  'textarea.tsx': 'Multi-line text input',
  'toast.tsx': 'Toast notification',
  'toaster.tsx': 'Toast provider/container',
  'toggle.tsx': 'Two-state toggle button',
  'toggle-group.tsx': 'Group of toggle buttons',
  'tooltip.tsx': 'Hover tooltip',
};

/** Recursively walk a directory, returning all file paths */
async function walk(dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) await walk(full, results);
    } else {
      if (!SKIP_FILES.has(entry.name)) results.push(full);
    }
  }
  return results;
}

/** Get a description for a file path */
function getDescription(relPath) {
  if (DESCRIPTIONS[relPath]) return DESCRIPTIONS[relPath];
  if (relPath.startsWith('src/components/ui/')) {
    const name = basename(relPath);
    return SHADCN_DESCRIPTIONS[name] ?? 'shadcn/ui primitive';
  }
  if (relPath.startsWith('.github/workflows/')) return 'GitHub Actions workflow';
  if (relPath.startsWith('.github/scripts/')) return 'CI helper script';
  if (relPath.startsWith('supabase/migrations/')) return 'Supabase SQL migration';
  if (relPath.startsWith('supabase/functions/')) return 'Supabase Edge Function (Deno)';
  if (relPath.startsWith('api/')) return 'Vercel Serverless Function';
  return '_(no description yet — add to DESCRIPTIONS map in .github/scripts/generate-codebase-map.mjs)_';
}

/** Render a section as a markdown table */
function renderTable(files) {
  if (!files.length) return '_None_';
  const rows = files.map(f => `| \`${f}\` | ${getDescription(f)} |`);
  return ['| File | Purpose |', '|---|---|', ...rows].join('\n');
}

async function main() {
  const allFiles = await walk(ROOT);
  const relFiles = allFiles
    .map(f => relative(ROOT, f).replace(/\\/g, '/'))
    .filter(f => !f.startsWith('docs/'))
    .sort();

  const now = new Date().toISOString();

  const uiFiles = relFiles.filter(f => f.startsWith('src/components/ui/'));
  const adminFiles = relFiles.filter(f => f.startsWith('src/components/admin/'));
  const sectionComponents = relFiles.filter(
    f => f.startsWith('src/components/') && !f.startsWith('src/components/ui/') && !f.startsWith('src/components/admin/')
  );
  const pageFiles = relFiles.filter(f => f.startsWith('src/pages/'));
  const hookFiles = relFiles.filter(f => f.startsWith('src/hooks/'));
  const libFiles = relFiles.filter(f => f.startsWith('src/lib/'));
  const dataFiles = relFiles.filter(f => f.startsWith('src/data/'));
  const integrationFiles = relFiles.filter(f => f.startsWith('src/integrations/'));
  const srcRootFiles = relFiles.filter(
    f => f.startsWith('src/') &&
    !f.startsWith('src/components/') && !f.startsWith('src/pages/') &&
    !f.startsWith('src/hooks/') && !f.startsWith('src/lib/') &&
    !f.startsWith('src/data/') && !f.startsWith('src/integrations/') &&
    !f.startsWith('src/assets/')
  );
  const publicFiles = relFiles.filter(f => f.startsWith('public/'));
  const apiFiles = relFiles.filter(f => f.startsWith('api/'));
  const supabaseFiles = relFiles.filter(f => f.startsWith('supabase/'));
  const githubFiles = relFiles.filter(f => f.startsWith('.github/'));
  const rootFiles = relFiles.filter(f => !f.includes('/'));

  const lines = [
    `# \uD83D\uDDFA\uFE0F Codebase Map \u2014 Roy Otieno Portfolio`,
    ``,
    `> **Auto-generated** on every push to \`main\` by \`.github/workflows/update-codebase-map.yml\``,
    `> Last updated: **${now}**`,
    `> Repo: [rauell1/portfolio](https://github.com/rauell1/portfolio)`,
    ``,
    `---`,
    ``,
    `## \uD83D\uDCC1 Root`,
    ``,
    renderTable(rootFiles),
    ``,
    `---`,
    ``,
    `## \uD83D\uDCC1 src/ \u2014 Entry Points`,
    ``,
    renderTable(srcRootFiles),
    ``,
    `---`,
    ``,
    `## \uD83D\uDCC1 src/pages/`,
    ``,
    renderTable(pageFiles),
    ``,
    `---`,
    ``,
    `## \uD83D\uDCC1 src/components/ \u2014 Section & Layout`,
    ``,
    renderTable(sectionComponents),
  ];

  if (adminFiles.length) {
    lines.push(``, `### \uD83D\uDCC1 src/components/admin/`, ``, renderTable(adminFiles));
  }

  lines.push(
    ``,
    `### \uD83D\uDCC1 src/components/ui/ \u2014 shadcn/ui Primitives`,
    ``,
    `> \u26A0\uFE0F Do not edit manually \u2014 regenerate via \`npx shadcn-ui add <component>\``,
    ``,
    renderTable(uiFiles),
  );

  if (hookFiles.length) lines.push(``, `---`, ``, `## \uD83D\uDCC1 src/hooks/`, ``, renderTable(hookFiles));
  if (libFiles.length) lines.push(``, `---`, ``, `## \uD83D\uDCC1 src/lib/`, ``, renderTable(libFiles));
  if (dataFiles.length) lines.push(``, `---`, ``, `## \uD83D\uDCC1 src/data/`, ``, renderTable(dataFiles));
  if (integrationFiles.length) lines.push(``, `---`, ``, `## \uD83D\uDCC1 src/integrations/`, ``, renderTable(integrationFiles));
  if (publicFiles.length) lines.push(``, `---`, ``, `## \uD83D\uDCC1 public/`, ``, renderTable(publicFiles));
  if (apiFiles.length) lines.push(``, `---`, ``, `## \uD83D\uDCC1 api/ \u2014 Vercel Serverless Functions`, ``, renderTable(apiFiles));
  if (supabaseFiles.length) lines.push(``, `---`, ``, `## \uD83D\uDCC1 supabase/`, ``, renderTable(supabaseFiles));
  if (githubFiles.length) lines.push(``, `---`, ``, `## \uD83D\uDCC1 .github/`, ``, renderTable(githubFiles));

  lines.push(
    ``,
    `---`,
    ``,
    `## \uD83D\uDD11 Key Aliases`,
    ``,
    `| Alias | Resolves to |`,
    `|---|---|`,
    `| \`@/\` | \`src/\` |`,
    `| \`@/components\` | \`src/components/\` |`,
    `| \`@/pages\` | \`src/pages/\` |`,
    `| \`@/hooks\` | \`src/hooks/\` |`,
    `| \`@/lib\` | \`src/lib/\` |`,
    `| \`@/data\` | \`src/data/\` |`,
    `| \`@/integrations\` | \`src/integrations/\` |`,
    ``,
    `---`,
    ``,
    `## \uD83D\uDEE0\uFE0F Tech Stack`,
    ``,
    `| Layer | Technology |`,
    `|---|---|`,
    `| Framework | React 18 + TypeScript + Vite |`,
    `| Styling | Tailwind CSS v3 + CSS variables |`,
    `| UI Primitives | shadcn/ui (Radix UI + Tailwind) |`,
    `| Routing | React Router v6 |`,
    `| Data / Auth | Supabase (PostgreSQL + Auth + Storage) |`,
    `| Forms | React Hook Form + Zod |`,
    `| Charts | Recharts |`,
    `| Email | EmailJS + Supabase Edge Functions |`,
    `| Animation | Custom CSS + Canvas particles |`,
    `| Fonts | Satoshi (Fontshare) |`,
    `| Deployment | Vercel (SPA routing via vercel.json) |`,
    `| Package Manager | Bun |`,
    ``,
    `---`,
    ``,
    `_Auto-regenerated by \`.github/scripts/generate-codebase-map.mjs\`. Manual edits will be overwritten on next push to \`main\`._`,
  );

  await mkdir(join(ROOT, 'docs'), { recursive: true });
  await writeFile(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`\u2705 docs/CODEBASE_MAP.md written (${relFiles.length} files indexed).`);
}

main().catch(err => { console.error(err); process.exit(1); });
