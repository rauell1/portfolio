-- Supabase Sync Script for 11 Canonical Projects
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/wbzrpzdkodmrqlvfkcbf/sql/new

-- ============================================================================
-- STEP 1: Existence Check
-- ============================================================================
SELECT slug, title, status, is_flagship, is_founder, sector, category,
       role, link, repo, gradient, icon_name, tags, specs, image
FROM projects
ORDER BY is_flagship DESC, sector, title;

-- ============================================================================
-- STEP 2: Upsert all 11 projects
-- ============================================================================
INSERT INTO projects (
  slug, title, sector, category, description, long_description,
  role, icon_name, link, repo, gradient, tags,
  is_founder, is_flagship, status, specs, image,
  project_type, updated_at
) VALUES
-- SafariCharge
(
  'safaricharge-platform',
  'SafariCharge',
  'clean-energy',
  'E-Mobility Platform',
  'Smart EV charging hubs powered by solar microgrids and second-life batteries - built for African cities.',
  'SafariCharge is a full-stack Next.js 16 platform combining a real-time energy simulation dashboard, AI-assisted optimization insights, and operational tooling for solar, battery storage, grid interaction, and EV charging. The platform models Kenya-specific KPLC tariff logic, location-aware solar irradiance assumptions, and generates formal technical reports. Authentication is handled via Supabase magic links with RBAC, rate limiting, and request-signature verification on all API routes. Piloted at 2 sites and in active partnership discussions with Nairobi-area malls for grid-tied deployment.',
  'Founder & Lead Engineer',
  'Zap',
  'https://safaricharge.rauell.systems/',
  'https://github.com/rauell1/safaricharge',
  'from-cyan-500 to-blue-600',
  ARRAY['Next.js 16','TypeScript','Solar','EV Charging','Battery Storage','AI Analytics','Supabase'],
  true, true, 'in-progress',
  '[{"label":"Sites Piloted","value":"2"},{"label":"Stack","value":"Next.js 16 + Supabase"},{"label":"AI Integration","value":"Gemini / OpenAI"},{"label":"Focus Region","value":"Nairobi, Kenya"}]',
  '/images/roam-charger-1.jpeg',
  'software', now()
),
-- Roam POINT
(
  'roam-point',
  'Roam POINT Charging Infrastructure',
  'clean-energy',
  'Infrastructure Research',
  'Distributed fast-charging infrastructure designed to accelerate electric motorcycle adoption across African cities.',
  'Roam POINT is a distributed EV charging infrastructure initiative developed at Roam Electric, targeting the mass-market electric motorcycle segment in Nairobi and beyond. The project involved detailed feasibility studies, site-selection modelling, and partner engagement to identify optimal charging locations across key commuter corridors. The infrastructure design integrates solar PV, second-life battery storage, and grid tie-in to enable accessible, low-cost charging for boda-boda operators. The work also covered operational logistics, revenue modelling, and stakeholder coordination with EVChaja and other ecosystem partners.',
  'Project Lead - Infrastructure & Partnerships',
  'Battery',
  NULL,
  NULL,
  'from-emerald-500 to-teal-600',
  ARRAY['EV Charging','Solar PV','Feasibility Studies','Site Planning','Nairobi','Roam Electric'],
  false, true, 'in-progress',
  '[{"label":"Vehicle Segment","value":"Electric Motorcycles"},{"label":"Partner","value":"Roam Electric & EVChaja"},{"label":"Technology","value":"Solar + Second-life Batteries"},{"label":"Coverage","value":"Nairobi Commuter Corridors"}]',
  '/images/roam-charger-3.jpeg',
  'infrastructure', now()
),
-- Roam Energy
(
  'roam-energy',
  'Roam Energy',
  'clean-energy',
  'Solar Solutions',
  'Marketing site and checkout platform for Roam Energy solar products, with automated order processing and WhatsApp follow-up.',
  'Roam Energy is a production marketing and e-commerce site for solar solutions, built with static HTML/CSS/JS on the frontend and a Vercel/Next.js API backend. The checkout API saves orders to MongoDB, sends transactional email confirmations via Resend, and dispatches WhatsApp follow-up notifications via the WhatsApp Cloud API. The product catalogue supports PDF export and email handoff. The project is secured with API token authentication, origin allow-listing, rate limiting, and input sanitization.',
  'Full-Stack Developer',
  'Sun',
  'https://roam-energy.rauell.systems/',
  'https://github.com/rauell1/roam-energy-page',
  'from-orange-500 to-yellow-500',
  ARRAY['Solar','E-Commerce','MongoDB','WhatsApp API','Resend','Vercel'],
  false, false, 'live',
  '[{"label":"Database","value":"MongoDB Atlas"},{"label":"Notifications","value":"WhatsApp + Email"},{"label":"Deployment","value":"Vercel"},{"label":"Auth","value":"API Token + CORS"}]',
  '/images/roam-charger-2.jpeg',
  'software', now()
),
-- Solar Cooling
(
  'solar-cooling',
  'Solar-Powered Cooling System',
  'clean-energy',
  'AgriTech',
  'Engineered a solar evaporative cooling unit extending tomato shelf life by 7 days for off-grid smallholder farmers.',
  'Designed and prototyped a solar-powered evaporative cooling system (ECS) tailored for off-grid agricultural settings. The unit addresses post-harvest losses - a critical income driver for smallholder farmers - by maintaining low temperatures without grid dependency. The system extended tomato shelf life by an average of 7 days in field trials, directly improving farmer income and reducing food waste. The design prioritised low-cost locally-sourced materials and ease of maintenance.',
  'Design Engineer',
  'Thermometer',
  'https://solar.rauell.systems/',
  NULL,
  'from-lime-500 to-green-600',
  ARRAY['Solar PV','Cold Chain','Post-Harvest','AgriTech','Off-Grid'],
  false, false, 'completed',
  '[{"label":"Shelf Life Gain","value":"+7 days"},{"label":"Crop","value":"Tomatoes"},{"label":"Power Source","value":"Solar PV (off-grid)"}]',
  '/images/solar-cooling-ai.jpg',
  'hardware', now()
),
-- Borehole Irrigation
(
  'borehole-irrigation',
  'Solarized Borehole Irrigation',
  'clean-energy',
  'AgriTech',
  'Deployed off-grid solar pumping systems for 10+ smallholder farmers in semi-arid regions, eliminating diesel reliance.',
  'Implemented over 10 solar-powered borehole irrigation pilots across semi-arid regions of Kenya. Each system replaced diesel generator-based pumping with a solar PV array and submersible pump, reducing operating costs and carbon emissions while improving water access reliability. The installations supported climate-smart agriculture practices and were designed for low-maintenance, long-service-life operation by smallholder farming communities.',
  'Installation Engineer',
  'Droplets',
  NULL,
  NULL,
  'from-blue-500 to-cyan-600',
  ARRAY['Solar Pumping','Irrigation','Off-Grid','Climate-Smart Agriculture'],
  false, false, 'completed',
  '[{"label":"Installations","value":"10+ pilots"},{"label":"Region","value":"Semi-Arid Kenya"},{"label":"Fuel Displaced","value":"Diesel generators"}]',
  '/images/borehole-irrigation-ai.jpg',
  'infrastructure', now()
),
-- Biogas
(
  'biogas',
  'Biogas for Circular Economy',
  'clean-energy',
  'Renewable Energy',
  'Coordinated rural biogas installations at schools and communities, producing clean cooking gas and organic fertiliser.',
  'Partnered with rural schools and farming communities to install biogas digesters that convert organic waste into clean cooking gas and nutrient-rich bio-slurry fertiliser. The initiative reduced dependence on firewood and charcoal, improved indoor air quality, and supported regenerative farming cycles. Each installation was coupled with community training on operation, maintenance, and safe use.',
  'Project Coordinator',
  'Leaf',
  NULL,
  NULL,
  'from-teal-500 to-green-500',
  ARRAY['Biogas','Circular Economy','Rural Development','Clean Cooking'],
  false, false, 'completed',
  NULL,
  'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop',
  'infrastructure', now()
),
-- Greenwave Society
(
  'greenwave-society',
  'Greenwave Society',
  'environmental',
  'Non-Profit Web Platform',
  'Official website for a Kenyan youth-led environmental non-profit - built with production-grade security, real-time impact metrics, and newsletter infrastructure.',
  'Greenwave Society is a Kenyan non-profit empowering youth to conserve the environment and become agents of sustainable change. The website built for the organisation is a full-stack Next.js 16 platform with a contact form, newsletter subscription, real-time impact counters, and a programme showcase. Security was a first-class concern: all API endpoints are rate-limited, inputs are validated and sanitised via Zod, CORS is configured for production origins, and CSP/security headers guard against XSS and injection attacks. The project uses Prisma ORM with SQLite for persistence and is deployed on Vercel.',
  'Lead Developer',
  'Globe',
  'https://greenwave.rauell.systems/',
  'https://github.com/rauell1/greenwave-society',
  'from-green-500 to-emerald-600',
  ARRAY['Next.js 16','TypeScript','Non-Profit','Prisma','Rate Limiting','Zod','Framer Motion'],
  false, false, 'live',
  '[{"label":"Organisation","value":"Greenwave Society Kenya"},{"label":"Stack","value":"Next.js 16 + Prisma"},{"label":"Security","value":"CSP, Rate Limiting, Zod"},{"label":"Deployment","value":"Vercel"}]',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
  'software', now()
),
-- Dyness x ROAM Roundtable
(
  'dyness-roam-roundtable',
  'Dyness × ROAM Solar Roundtable',
  'environmental',
  'Event Portal',
  'Invite-only event registration portal for a solar industry roundtable - with real-time capacity tracking, waitlisting, and automated branded email dispatch.',
  'Built the end-to-end digital infrastructure for the Dyness & ROAM Solar Industry Breakfast, Roundtable & Partner Engagement event. The system featured a premium responsive landing page with light/dark mode, a dynamic registration form with a real-time seat capacity progress bar (refreshed every 15 seconds), and a serverless Google Apps Script backend. Strict concurrency control via LockService prevented race conditions and overbooking at the 110-seat limit. Overflow registrants were automatically waitlisted up to a 300-entry hard cap. Automated HTML emails were dispatched per registrant status: Confirmed, Pending Confirmation, or Information Requested.',
  'Developer & Event Coordinator',
  'Users',
  'https://events.rauell.systems/',
  'https://github.com/rauell1/event-registration-page',
  'from-violet-500 to-purple-600',
  ARRAY['Event Tech','Google Apps Script','Real-time','Email Automation','Capacity Management'],
  false, false, 'completed',
  '[{"label":"Capacity","value":"110 confirmed seats"},{"label":"Backend","value":"Google Apps Script"},{"label":"Emails","value":"Automated HTML by status"},{"label":"Partners","value":"Dyness & ROAM Electric"}]',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
  'software', now()
),
-- AI CV Builder
(
  'ai-cv-builder',
  'AI CV Builder',
  'ai-tools',
  'AI Productivity Tool',
  'Full-featured AI-powered CV builder - parses CVs, analyses job descriptions, and generates tailored CVs and cover letters across 5 formats with 9 AI model options.',
  'A sophisticated multi-step web application that takes a user''s raw CV and a target job description, then uses AI to restructure, optimise, and score the CV against the role. Users choose from 9 AI models across 4 providers (GLM/Zhipu, OpenAI, Anthropic, Google). The tool generates CVs in 5 professional formats (Europass, ATS-Friendly, Modern, Creative Bold, Classic Traditional) and cover letters in 5 tones. Per-section AI insights provide scores, strengths, weaknesses, and one-click improvement application. An ATS simulation scores keyword match, experience relevance, achievement quality, and skills coverage. Built with Next.js 16, TypeScript, Zustand, Prisma, and pdf-lib for PDF generation.',
  'Full-Stack Developer',
  'FileText',
  'https://cv.rauell.systems/',
  'https://github.com/rauell1/cv-builder',
  'from-indigo-500 to-blue-600',
  ARRAY['AI','Next.js 16','TypeScript','OpenAI','Anthropic','Gemini','Zustand','pdf-lib'],
  false, false, 'live',
  '[{"label":"AI Models","value":"9 across 4 providers"},{"label":"CV Formats","value":"5 output formats"},{"label":"Cover Letter Styles","value":"5 tones"},{"label":"ATS Simulation","value":"Yes - scored 0-100"}]',
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
  'software', now()
),
-- DJ Kimchi
(
  'dj-kimchi',
  'DJ Kimchi',
  'digital-products',
  'Artist Website',
  'Official website for DJ Kimchi - a full booking platform with music discovery, global audio player, and automated booking email notifications.',
  'A complete digital presence and booking platform for DJ Kimchi. The single-page experience covers Hero, About, Music, Videos, Photos, and Bookings sections. A globally persistent audio player manages Mixcloud and HearThis track playback using Zustand state. The booking API validates submissions with Zod, enforces IP-based rate limiting, persists bookings in SQLite via Prisma, and dispatches branded email notifications via Resend. The site uses Framer Motion for section transitions and is deployed as a standalone Next.js 16 build.',
  'Full-Stack Developer',
  'Music',
  'https://dj-kimchi.rauell.systems/',
  'https://github.com/rauell1/dj-kimchi',
  'from-pink-500 to-rose-600',
  ARRAY['Next.js 16','TypeScript','Prisma','Resend','Framer Motion','Mixcloud','Music'],
  false, false, 'live',
  '[{"label":"Stack","value":"Next.js 16 + Prisma + SQLite"},{"label":"Audio","value":"Global player via Zustand"},{"label":"Bookings","value":"API with Zod + Resend"},{"label":"Deployment","value":"Standalone Vercel"}]',
  '/images/dj-kimchi-screenshot.jpg',
  'software', now()
),
-- Rauell Systems Hub
(
  'rauell-systems-hub',
  'Rauell Systems Hub',
  'digital-products',
  'Portfolio & Showcase',
  'Full-stack SSR portfolio and systems showcase built with TanStack Start, React 19, and Tailwind CSS v4 - deployed on Vercel.',
  'A production-grade full-stack portfolio hub built with TanStack Start (SSR), React 19, TypeScript, Tailwind CSS v4, and deployed on Vercel via a custom SSR serverless handler. File-based routing is handled by TanStack Router; data fetching by TanStack Query; UI by Radix UI + shadcn/ui. The build pipeline compiles a Vite client bundle and a standalone SSR server artifact, which is then bundled by esbuild into a single Vercel serverless function (api/ssr.js). All routes are rewritten through this handler for server-side rendering.',
  'Developer',
  'LayoutDashboard',
  'https://royotieno.rauell.systems/',
  'https://github.com/rauell1/rauell-systems-hub',
  'from-slate-500 to-gray-600',
  ARRAY['TanStack Start','React 19','TypeScript','Tailwind v4','SSR','Radix UI','Vite 7'],
  false, false, 'in-progress',
  '[{"label":"Framework","value":"TanStack Start (SSR)"},{"label":"UI","value":"React 19 + Radix + shadcn"},{"label":"Deployment","value":"Vercel SSR Serverless"},{"label":"Build Tool","value":"Vite 7 + esbuild"}]',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
  'software', now()
)
ON CONFLICT (slug) DO UPDATE SET
  title            = EXCLUDED.title,
  sector           = EXCLUDED.sector,
  category         = EXCLUDED.category,
  description      = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  role             = EXCLUDED.role,
  icon_name        = EXCLUDED.icon_name,
  link             = EXCLUDED.link,
  repo             = EXCLUDED.repo,
  gradient         = EXCLUDED.gradient,
  tags             = EXCLUDED.tags,
  is_founder       = EXCLUDED.is_founder,
  is_flagship      = EXCLUDED.is_flagship,
  status           = EXCLUDED.status,
  specs            = EXCLUDED.specs,
  image            = EXCLUDED.image,
  project_type     = EXCLUDED.project_type,
  updated_at       = now();

-- ============================================================================
-- STEP 3: Post-upsert verification
-- ============================================================================

-- 1. Count check — must return exactly 11
SELECT COUNT(*) AS total_projects FROM projects WHERE slug IN (
  'safaricharge-platform','roam-point','roam-energy','solar-cooling',
  'borehole-irrigation','biogas','greenwave-society','dyness-roam-roundtable',
  'ai-cv-builder','dj-kimchi','rauell-systems-hub'
);

-- 2. Flagship check — must return 2 rows
SELECT slug, title FROM projects WHERE is_flagship = true;

-- 3. Status distribution
SELECT status, COUNT(*) FROM projects
WHERE slug IN (
  'safaricharge-platform','roam-point','roam-energy','solar-cooling',
  'borehole-irrigation','biogas','greenwave-society','dyness-roam-roundtable',
  'ai-cv-builder','dj-kimchi','rauell-systems-hub'
)
GROUP BY status;

-- 4. Missing critical fields check
SELECT slug, title,
  (description IS NULL) AS missing_description,
  (long_description IS NULL) AS missing_long_desc,
  (tags IS NULL OR array_length(tags,1) = 0) AS empty_tags,
  (specs IS NULL) AS missing_specs
FROM projects
WHERE slug IN (
  'safaricharge-platform','roam-point','roam-energy','solar-cooling',
  'borehole-irrigation','biogas','greenwave-society','dyness-roam-roundtable',
  'ai-cv-builder','dj-kimchi','rauell-systems-hub'
);

-- 5. Any orphaned rows not in the canonical set
SELECT slug, title, status FROM projects
WHERE slug NOT IN (
  'safaricharge-platform','roam-point','roam-energy','solar-cooling',
  'borehole-irrigation','biogas','greenwave-society','dyness-roam-roundtable',
  'ai-cv-builder','dj-kimchi','rauell-systems-hub'
)
ORDER BY created_at DESC;
