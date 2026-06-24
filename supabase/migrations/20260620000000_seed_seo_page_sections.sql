-- ============================================================
-- Seed default page SEO metadata into page_sections table
-- ============================================================

INSERT INTO public.page_sections (page, section, sort_order, content)
VALUES
(
  'home', 'seo', 0,
  '{
    "title": "Roy Okola Otieno | Clean Energy Engineer & E-Mobility Specialist, Nairobi",
    "description": "Clean energy and e-mobility engineer with 3+ years of experience in solar PV system design, EV charging infrastructure, and technical feasibility studies across East Africa. Founder of SafariCharge.",
    "keywords": "Roy Okola Otieno, clean energy engineer Kenya, EV charging infrastructure Africa, solar PV engineer Nairobi, SafariCharge, e-mobility East Africa, renewable energy consultant Kenya, electric vehicle charging Kenya"
  }'::jsonb
),
(
  'projects', 'seo', 0,
  '{
    "title": "Projects | Roy Okola Otieno — Solar PV & EV Charging Portfolio",
    "description": "Explore Roy Otieno''s portfolio of clean energy and e-mobility projects: solar microgrids, EV charging hubs, AI-powered engineering tools, and sustainable digital platforms across East Africa.",
    "keywords": "clean energy projects Kenya, EV charging portfolio Africa, solar PV projects Nairobi, SafariCharge, engineering portfolio East Africa"
  }'::jsonb
),
(
  'blog', 'seo', 0,
  '{
    "title": "Blog | Roy Okola Otieno — Clean Energy & E-Mobility Insights",
    "description": "Articles on clean energy, EV charging infrastructure, solar PV system design, and sustainable development across East Africa by Roy Okola Otieno.",
    "keywords": "clean energy blog Africa, EV charging articles Kenya, solar PV engineering insights, sustainable energy East Africa, electric mobility Africa"
  }'::jsonb
),
(
  'case-studies', 'seo', 0,
  '{
    "title": "Case Studies | Roy Okola Otieno — Clean Energy Impact Work",
    "description": "Documented outcomes and verified impact data from real-world deployments in clean energy, e-mobility, and sustainable agriculture across East Africa.",
    "keywords": "clean energy case studies Africa, EV charging deployment Kenya, solar energy impact East Africa, sustainable agriculture impact Kenya"
  }'::jsonb
),
(
  'resume', 'seo', 0,
  '{
    "title": "Resume | Roy Okola Otieno — Technical Operations & Clean Energy Engineer",
    "description": "Professional resume of Roy Okola Otieno — Technical Operations and Sales Engineer at Roam Electric Ltd, EV infrastructure specialist, and MBA candidate at University of East London.",
    "keywords": "Roy Okola Otieno CV, technical operations engineer Kenya, clean energy engineer resume, EV infrastructure consultant Africa"
  }'::jsonb
)
ON CONFLICT (page, section) DO NOTHING;
