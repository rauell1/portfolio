-- ============================================================
-- 1. Add status column to projects table
--    Supports: 'published' | 'draft' | 'archived'
-- ============================================================
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published'
  CHECK (status IN ('published', 'draft', 'archived'));

-- ============================================================
-- 2. Create page_sections table for homepage CMS
--    Each row stores the editable content for one homepage section.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.page_sections (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page        TEXT NOT NULL DEFAULT 'home',
  section     TEXT NOT NULL,
  content     JSONB NOT NULL DEFAULT '{}',
  sort_order  INTEGER DEFAULT 0,
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (page, section)
);

-- Enable Row Level Security
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Public can read all page sections (homepage content must be visible)
CREATE POLICY "Page sections are publicly readable"
  ON public.page_sections
  FOR SELECT
  USING (true);

-- Admin can manage page sections
CREATE POLICY "Admin can manage page sections"
  ON public.page_sections
  FOR ALL
  USING  (auth.jwt() ->> 'email' = 'royokola3@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'royokola3@gmail.com');

-- Auto-update updated_at on changes
CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 3. Seed default homepage sections with current hardcoded content
-- ============================================================
INSERT INTO public.page_sections (page, section, sort_order, content)
VALUES
(
  'home', 'hero', 1,
  '{
    "availability": "Available for opportunities",
    "name": "Roy Otieno",
    "title": "Clean Energy Engineer & E-Mobility Specialist",
    "description": "Driving Africa''s sustainable transition through solar infrastructure, EV charging networks, and innovative energy solutions.",
    "cta_primary": "View My Work",
    "cta_secondary": "Let''s Connect",
    "stats": [
      { "value": "10+", "label": "Solar Projects" },
      { "value": "3+",  "label": "Years Experience" },
      { "value": "5+",  "label": "EV Hub Sites" }
    ]
  }'::jsonb
),
(
  'home', 'about', 2,
  '{
    "tagline": "About Me",
    "heading": "Powering Africa''s",
    "heading_highlight": "Clean Future",
    "paragraphs": [
      "I''m a renewable-energy and e-mobility specialist with hands-on experience in distributed energy infrastructure, EV-charging technology, and battery-swap system deployment across East Africa.",
      "My expertise spans technical operations, system-uptime management, feasibility analysis, and cross-functional coordination with contractors, utilities, and regulatory agencies. I''m passionate about delivering practical solutions that enhance infrastructure reliability and accelerate the transition to sustainable energy."
    ],
    "highlights": [
      { "icon": "MapPin",        "title": "Based in",   "value": "Nairobi, Kenya" },
      { "icon": "GraduationCap", "title": "Education",  "value": "MBA Candidate & BSc. Engineering" },
      { "icon": "Zap",           "title": "Focus",      "value": "Clean Energy & E-Mobility" },
      { "icon": "Leaf",          "title": "Mission",    "value": "Sustainable Africa" }
    ]
  }'::jsonb
),
(
  'home', 'experience', 3,
  '{
    "tagline": "My Journey",
    "heading": "Work",
    "heading_highlight": "Experience",
    "items": [
      {
        "company": "SafariCharge",
        "role": "Founder",
        "location": "Nairobi, Kenya",
        "period": "2024 - Present",
        "current": true,
        "isFounder": true,
        "externalUrl": "https://safaricharge-website.vercel.app/",
        "description": [
          "Founded an EV charging infrastructure startup focused on expanding access to sustainable mobility across East Africa",
          "Leading strategic partnerships and market development for EV charging solutions"
        ]
      },
      {
        "company": "Roam Electric Ltd",
        "role": "Junior Sales Consultant",
        "location": "Nairobi, Kenya",
        "period": "Jun 2025 - Present",
        "current": true,
        "description": [
          "Increased sales pipeline opportunities by 25% through targeted promotion of solar equipment and EV charging hubs across Nairobi and Kiambu counties",
          "Generated over KES 10 million in monthly sales by cultivating strong relationships with EPCs, transport operators, and energy distributors"
        ]
      },
      {
        "company": "EVChaja",
        "role": "Business Strategy & Operations Consultant",
        "location": "Remote - Nairobi",
        "period": "Jan 2025 - Jun 2025",
        "current": false,
        "description": [
          "Delivered market intelligence reports that shaped EV charging hub expansion, contributing to 3 investment-ready projects",
          "Engaged with regulators and NGOs (EPRA, EMAK) to influence policy discussions, securing compliance for proposed projects",
          "Facilitated stakeholder consultations that attracted KES 50M+ in potential investment toward EV infrastructure"
        ]
      },
      {
        "company": "Frisco Engineering Limited",
        "role": "Technical Sales Engineer Intern",
        "location": "Nairobi, Kenya",
        "period": "Feb 2024 - Jul 2024",
        "current": false,
        "description": [
          "Designed and sized 10+ solar PV backup systems worth KES 3M+, closing multiple agricultural and residential sales",
          "Conducted 15+ energy audits and feasibility studies, providing clients with evidence-based investment decisions",
          "Facilitated training workshops with a 95% client satisfaction rate, strengthening adoption of renewable energy systems"
        ]
      },
      {
        "company": "HomeBiogas Kenya",
        "role": "Technical Sales Engineer Intern",
        "location": "Nairobi, Kenya",
        "period": "Jan 2023 - Feb 2024",
        "current": false,
        "description": [
          "Supported the installation of 10+ household biogas systems, reducing reliance on biomass and LPG fuels",
          "Led community engagement sessions that cut system failures by 30% through effective after-sales training",
          "Expanded reach by building 5+ local partnerships, accelerating market adoption of biogas in peri-urban communities"
        ]
      },
      {
        "company": "Farmers Choice Limited",
        "role": "Production Intern",
        "location": "Nairobi, Kenya",
        "period": "Jun 2022 - Aug 2022",
        "current": false,
        "description": [
          "Supported operations in a large-scale food processing environment, gaining exposure to industrial processes and quality control"
        ]
      }
    ]
  }'::jsonb
),
(
  'home', 'skills', 4,
  '{
    "tagline": "My Toolkit",
    "heading": "Technical",
    "heading_highlight": "Expertise",
    "items": [
      { "name": "Solar PV Design",        "level": 95 },
      { "name": "EV Charging Systems",    "level": 90 },
      { "name": "Energy Audits",          "level": 88 },
      { "name": "Sales Strategy",         "level": 92 },
      { "name": "Policy Advocacy",        "level": 85 },
      { "name": "Project Management",     "level": 88 },
      { "name": "Data Analysis",          "level": 82 },
      { "name": "Community Engagement",   "level": 95 }
    ]
  }'::jsonb
),
(
  'home', 'leadership', 5,
  '{
    "tagline": "Making an Impact",
    "heading": "Leadership &",
    "heading_highlight": "Engagement",
    "description": "Committed to driving positive change through community engagement, policy advocacy, and knowledge sharing.",
    "items": [
      {
        "title": "Africa Fellowship for Young Energy Leaders",
        "subtitle": "Cohort 5 - General Track & Solar PV Engineering",
        "year": "2025",
        "icon": "Award"
      },
      {
        "title": "World Youth Parliament for Water",
        "subtitle": "Global Member advocating for water sustainability",
        "year": "2024-2027",
        "icon": "Globe"
      },
      {
        "title": "Community Trainer",
        "subtitle": "Solar irrigation & circular economy workshops",
        "year": "Ongoing",
        "icon": "Users"
      },
      {
        "title": "Student Leader - JKUAT",
        "subtitle": "Engineering Outreach & Peer-Learning Coordinator",
        "year": "2018-2023",
        "icon": "GraduationCap"
      }
    ]
  }'::jsonb
),
(
  'home', 'contact', 6,
  '{
    "tagline": "Get In Touch",
    "heading": "Let''s Work",
    "heading_highlight": "Together",
    "description": "Whether you''re building clean energy infrastructure, exploring EV mobility solutions, or looking for a driven specialist to join your team — I''d love to connect.",
    "email": "royokola3@gmail.com",
    "phone": "",
    "location": "Nairobi, Kenya",
    "linkedin": "https://www.linkedin.com/in/roy-okola-otieno",
    "github": ""
  }'::jsonb
)
ON CONFLICT (page, section) DO NOTHING;
