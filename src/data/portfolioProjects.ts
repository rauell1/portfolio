export interface Project {
  id: string;
  title: string;
  sector: string;
  category: string;
  description: string;
  longDescription: string;
  role?: string;
  iconName: string;
  link?: string;
  repo?: string;
  gradient: string;
  tags: string[];
  isFounder?: boolean;
  isFlagship?: boolean;
  status?: "live" | "in-progress" | "completed";
  specs?: { label: string; value: string }[];
  /** Illustration image shown on the projects PAGE only (not the landing section) */
  image?: string;
}

export const sectors = [
  { value: "all", label: "All Projects" },
  { value: "clean-energy", label: "Clean Energy & E-Mobility" },
  { value: "environmental", label: "Environmental & Social Impact" },
  { value: "ai-tools", label: "AI & Productivity Tools" },
  { value: "digital-products", label: "Digital Products & Web" },
];

export const portfolioProjects: Project[] = [
  // ─── Clean Energy & E-Mobility ───────────────────────────────────────────────
  {
    id: "safaricharge-platform",
    title: "SafariCharge",
    sector: "clean-energy",
    category: "E-Mobility Platform",
    description:
      "Smart EV charging hubs powered by solar microgrids and second-life batteries - built for African cities.",
    longDescription:
      "SafariCharge is a full-stack Next.js 16 platform combining a real-time energy simulation dashboard, AI-assisted optimization insights, and operational tooling for solar, battery storage, grid interaction, and EV charging. The platform models Kenya-specific KPLC tariff logic, location-aware solar irradiance assumptions, and generates formal technical reports. Authentication is handled via Supabase magic links with RBAC, rate limiting, and request-signature verification on all API routes. Piloted at 2 sites and in active partnership discussions with Nairobi-area malls for grid-tied deployment.",
    role: "Founder & Lead Engineer",
    iconName: "Zap",
    link: "https://safaricharge.rauell.systems/",
    repo: "https://github.com/rauell1/safaricharge",
    gradient: "from-cyan-500 to-blue-600",
    image: "/images/SafariCharge_DailyGraph_2026-01-07.jpg",
    tags: ["Next.js 16", "TypeScript", "Solar", "EV Charging", "Battery Storage", "AI Analytics", "Supabase"],
    isFounder: true,
    isFlagship: true,
    status: "in-progress",
    specs: [
      { label: "Sites Piloted", value: "2" },
      { label: "Stack", value: "Next.js 16 + Supabase" },
      { label: "AI Integration", value: "Gemini / OpenAI" },
      { label: "Focus Region", value: "Nairobi, Kenya" },
    ],
  },
  {
    id: "roam-point",
    title: "Roam POINT Charging Infrastructure",
    sector: "clean-energy",
    category: "Infrastructure Research",
    description:
      "Distributed fast-charging infrastructure designed to accelerate electric motorcycle adoption across African cities.",
    longDescription:
      "Roam POINT is a distributed EV charging infrastructure initiative developed at Roam Electric, targeting the mass-market electric motorcycle segment in Nairobi and beyond. The project involved detailed feasibility studies, site-selection modelling, and partner engagement to identify optimal charging locations across key commuter corridors. The infrastructure design integrates solar PV, second-life battery storage, and grid tie-in to enable accessible, low-cost charging for boda-boda operators. The work also covered operational logistics, revenue modelling, and stakeholder coordination with EVChaja and other ecosystem partners.",
    role: "Project Lead - Infrastructure & Partnerships",
    iconName: "Battery",
    gradient: "from-emerald-500 to-teal-600",
    image: "/images/roam-point-ai.jpg",
    tags: ["EV Charging", "Solar PV", "Feasibility Studies", "Site Planning", "Nairobi", "Roam Electric"],
    isFlagship: true,
    status: "in-progress",
    specs: [
      { label: "Vehicle Segment", value: "Electric Motorcycles" },
      { label: "Partner", value: "Roam Electric & EVChaja" },
      { label: "Technology", value: "Solar + Second-life Batteries" },
      { label: "Coverage", value: "Nairobi Commuter Corridors" },
    ],
  },
  {
    id: "roam-energy",
    title: "Roam Energy",
    sector: "clean-energy",
    category: "Solar Solutions",
    description:
      "Marketing site and checkout platform for Roam Energy solar products, with automated order processing and WhatsApp follow-up.",
    longDescription:
      "Roam Energy is a production marketing and e-commerce site for solar solutions, built with static HTML/CSS/JS on the frontend and a Vercel/Next.js API backend. The checkout API saves orders to MongoDB, sends transactional email confirmations via Resend, and dispatches WhatsApp follow-up notifications via the WhatsApp Cloud API. The product catalogue supports PDF export and email handoff. The project is secured with API token authentication, origin allow-listing, rate limiting, and input sanitization.",
    role: "Full-Stack Developer",
    iconName: "Sun",
    link: "https://roam-energy.rauell.systems/",
    repo: "https://github.com/rauell1/roam-energy-page",
    gradient: "from-orange-500 to-yellow-500",
    image: "/images/roam-electric.webp",
    tags: ["Solar", "E-Commerce", "MongoDB", "WhatsApp API", "Resend", "Vercel"],
    status: "live",
    specs: [
      { label: "Database", value: "MongoDB Atlas" },
      { label: "Notifications", value: "WhatsApp + Email" },
      { label: "Deployment", value: "Vercel" },
      { label: "Auth", value: "API Token + CORS" },
    ],
  },
  {
    id: "solar-cooling",
    title: "Solar-Powered Cooling System",
    sector: "clean-energy",
    category: "AgriTech",
    description:
      "Engineered a solar evaporative cooling unit extending tomato shelf life by 7 days for off-grid smallholder farmers.",
    longDescription:
      "Designed and prototyped a solar-powered evaporative cooling system (ECS) tailored for off-grid agricultural settings. The unit addresses post-harvest losses - a critical income driver for smallholder farmers - by maintaining low temperatures without grid dependency. The system extended tomato shelf life by an average of 7 days in field trials, directly improving farmer income and reducing food waste. The design prioritised low-cost locally-sourced materials and ease of maintenance.",
    role: "Design Engineer",
    iconName: "Thermometer",
    link: "https://solar.rauell.systems/",
    gradient: "from-lime-500 to-green-600",
    image: "/images/solar-cooling-ai.jpg",
    tags: ["Solar PV", "Cold Chain", "Post-Harvest", "AgriTech", "Off-Grid"],
    status: "completed",
    specs: [
      { label: "Shelf Life Gain", value: "+7 days" },
      { label: "Crop", value: "Tomatoes" },
      { label: "Power Source", value: "Solar PV (off-grid)" },
    ],
  },
  {
    id: "borehole-irrigation",
    title: "Solarized Borehole Irrigation",
    sector: "clean-energy",
    category: "AgriTech",
    description:
      "Deployed off-grid solar pumping systems for 10+ smallholder farmers in semi-arid regions, eliminating diesel reliance.",
    longDescription:
      "Implemented over 10 solar-powered borehole irrigation pilots across semi-arid regions of Kenya. Each system replaced diesel generator-based pumping with a solar PV array and submersible pump, reducing operating costs and carbon emissions while improving water access reliability. The installations supported climate-smart agriculture practices and were designed for low-maintenance, long-service-life operation by smallholder farming communities.",
    role: "Installation Engineer",
    iconName: "Droplets",
    gradient: "from-blue-500 to-cyan-600",
    image: "/images/borehole-irrigation-ai.jpg",
    tags: ["Solar Pumping", "Irrigation", "Off-Grid", "Climate-Smart Agriculture"],
    status: "completed",
    specs: [
      { label: "Installations", value: "10+ pilots" },
      { label: "Region", value: "Semi-Arid Kenya" },
      { label: "Fuel Displaced", value: "Diesel generators" },
    ],
  },
  {
    id: "biogas",
    title: "Biogas for Circular Economy",
    sector: "clean-energy",
    category: "Renewable Energy",
    description:
      "Coordinated rural biogas installations at schools and communities, producing clean cooking gas and organic fertiliser.",
    longDescription:
      "Partnered with rural schools and farming communities to install biogas digesters that convert organic waste into clean cooking gas and nutrient-rich bio-slurry fertiliser. The initiative reduced dependence on firewood and charcoal, improved indoor air quality, and supported regenerative farming cycles. Each installation was coupled with community training on operation, maintenance, and safe use.",
    role: "Project Coordinator",
    iconName: "Leaf",
    gradient: "from-teal-500 to-green-500",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop",
    tags: ["Biogas", "Circular Economy", "Rural Development", "Clean Cooking"],
    status: "completed",
  },

  // ─── Environmental & Social Impact ──────────────────────────────────────────
  {
    id: "greenwave-society",
    title: "Greenwave Society",
    sector: "environmental",
    category: "Non-Profit Web Platform",
    description:
      "Official website for a Kenyan youth-led environmental non-profit - built with production-grade security, real-time impact metrics, and newsletter infrastructure.",
    longDescription:
      "Greenwave Society is a Kenyan non-profit empowering youth to conserve the environment and become agents of sustainable change. The website built for the organisation is a full-stack Next.js 16 platform with a contact form, newsletter subscription, real-time impact counters, and a programme showcase. Security was a first-class concern: all API endpoints are rate-limited, inputs are validated and sanitised via Zod, CORS is configured for production origins, and CSP/security headers guard against XSS and injection attacks. The project uses Prisma ORM with SQLite for persistence and is deployed on Vercel.",
    role: "Lead Developer",
    iconName: "Globe",
    link: "https://greenwave.rauell.systems/",
    repo: "https://github.com/rauell1/greenwave-society",
    gradient: "from-green-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    tags: ["Next.js 16", "TypeScript", "Non-Profit", "Prisma", "Rate Limiting", "Zod", "Framer Motion"],
    status: "live",
    specs: [
      { label: "Organisation", value: "Greenwave Society Kenya" },
      { label: "Stack", value: "Next.js 16 + Prisma" },
      { label: "Security", value: "CSP, Rate Limiting, Zod" },
      { label: "Deployment", value: "Vercel" },
    ],
  },
  {
    id: "dyness-roam-roundtable",
    title: "Dyness × ROAM Solar Roundtable",
    sector: "environmental",
    category: "Event Portal",
    description:
      "Invite-only event registration portal for a solar industry roundtable - with real-time capacity tracking, waitlisting, and automated branded email dispatch.",
    longDescription:
      "Built the end-to-end digital infrastructure for the Dyness & ROAM Solar Industry Breakfast, Roundtable & Partner Engagement event. The system featured a premium responsive landing page with light/dark mode, a dynamic registration form with a real-time seat capacity progress bar (refreshed every 15 seconds), and a serverless Google Apps Script backend. Strict concurrency control via LockService prevented race conditions and overbooking at the 110-seat limit. Overflow registrants were automatically waitlisted up to a 300-entry hard cap. Automated HTML emails were dispatched per registrant status: Confirmed, Pending Confirmation, or Information Requested.",
    role: "Developer & Event Coordinator",
    iconName: "Users",
    link: "https://events.rauell.systems/",
    repo: "https://github.com/rauell1/event-registration-page",
    gradient: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    tags: ["Event Tech", "Google Apps Script", "Real-time", "Email Automation", "Capacity Management"],
    status: "completed",
    specs: [
      { label: "Capacity", value: "110 confirmed seats" },
      { label: "Backend", value: "Google Apps Script" },
      { label: "Emails", value: "Automated HTML by status" },
      { label: "Partners", value: "Dyness & ROAM Electric" },
    ],
  },

  // ─── AI & Productivity Tools ─────────────────────────────────────────────────
  {
    id: "ai-cv-builder",
    title: "AI CV Builder",
    sector: "ai-tools",
    category: "AI Productivity Tool",
    description:
      "Full-featured AI-powered CV builder - parses CVs, analyses job descriptions, and generates tailored CVs and cover letters across 5 formats with 9 AI model options.",
    longDescription:
      "A sophisticated multi-step web application that takes a user's raw CV and a target job description, then uses AI to restructure, optimise, and score the CV against the role. Users choose from 9 AI models across 4 providers (GLM/Zhipu, OpenAI, Anthropic, Google). The tool generates CVs in 5 professional formats (Europass, ATS-Friendly, Modern, Creative Bold, Classic Traditional) and cover letters in 5 tones. Per-section AI insights provide scores, strengths, weaknesses, and one-click improvement application. An ATS simulation scores keyword match, experience relevance, achievement quality, and skills coverage. Built with Next.js 16, TypeScript, Zustand, Prisma, and pdf-lib for PDF generation.",
    role: "Full-Stack Developer",
    iconName: "FileText",
    link: "https://cv.rauell.systems/",
    repo: "https://github.com/rauell1/cv-builder",
    gradient: "from-indigo-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop",
    tags: ["AI", "Next.js 16", "TypeScript", "OpenAI", "Anthropic", "Gemini", "Zustand", "pdf-lib"],
    status: "live",
    specs: [
      { label: "AI Models", value: "9 across 4 providers" },
      { label: "CV Formats", value: "5 output formats" },
      { label: "Cover Letter Styles", value: "5 tones" },
      { label: "ATS Simulation", value: "Yes - scored 0-100" },
    ],
  },

  // ─── Digital Products & Web ──────────────────────────────────────────────────
  {
    id: "dj-kimchi",
    title: "DJ Kimchi",
    sector: "digital-products",
    category: "Artist Website",
    description:
      "Official website for DJ Kimchi - a full booking platform with music discovery, global audio player, and automated booking email notifications.",
    longDescription:
      "A complete digital presence and booking platform for DJ Kimchi. The single-page experience covers Hero, About, Music, Videos, Photos, and Bookings sections. A globally persistent audio player manages Mixcloud and HearThis track playback using Zustand state. The booking API validates submissions with Zod, enforces IP-based rate limiting, persists bookings in SQLite via Prisma, and dispatches branded email notifications via Resend. The site uses Framer Motion for section transitions and is deployed as a standalone Next.js 16 build.",
    role: "Full-Stack Developer",
    iconName: "Music",
    link: "https://dj-kimchi.rauell.systems/",
    repo: "https://github.com/rauell1/dj-kimchi",
    gradient: "from-pink-500 to-rose-600",
    image: "/images/dj-kimchi-screenshot.jpg",
    tags: ["Next.js 16", "TypeScript", "Prisma", "Resend", "Framer Motion", "Mixcloud", "Music"],
    status: "live",
    specs: [
      { label: "Stack", value: "Next.js 16 + Prisma + SQLite" },
      { label: "Audio", value: "Global player via Zustand" },
      { label: "Bookings", value: "API with Zod + Resend" },
      { label: "Deployment", value: "Standalone Vercel" },
    ],
  },
  {
    id: "rauell-systems-hub",
    title: "Rauell Systems Hub",
    sector: "digital-products",
    category: "Portfolio & Showcase",
    description:
      "Full-stack SSR portfolio and systems showcase built with TanStack Start, React 19, and Tailwind CSS v4 - deployed on Vercel.",
    longDescription:
      "A production-grade full-stack portfolio hub built with TanStack Start (SSR), React 19, TypeScript, Tailwind CSS v4, and deployed on Vercel via a custom SSR serverless handler. File-based routing is handled by TanStack Router; data fetching by TanStack Query; UI by Radix UI + shadcn/ui. The build pipeline compiles a Vite client bundle and a standalone SSR server artifact, which is then bundled by esbuild into a single Vercel serverless function (`api/ssr.js`). All routes are rewritten through this handler for server-side rendering.",
    role: "Developer",
    iconName: "LayoutDashboard",
    link: "https://royotieno.rauell.systems/",
    repo: "https://github.com/rauell1/rauell-systems-hub",
    gradient: "from-slate-500 to-gray-600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    tags: ["TanStack Start", "React 19", "TypeScript", "Tailwind v4", "SSR", "Radix UI", "Vite 7"],
    status: "in-progress",
    specs: [
      { label: "Framework", value: "TanStack Start (SSR)" },
      { label: "UI", value: "React 19 + Radix + shadcn" },
      { label: "Deployment", value: "Vercel SSR Serverless" },
      { label: "Build Tool", value: "Vite 7 + esbuild" },
    ],
  },
];
