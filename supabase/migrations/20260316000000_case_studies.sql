-- ============================================================
-- Create case_studies table for managing portfolio case studies
-- ============================================================
CREATE TABLE public.case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL DEFAULT 'sustainability',
  location TEXT,
  date TEXT,
  role TEXT,
  partner TEXT,
  image TEXT,
  pdf_download TEXT,
  is_flagship BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  sections JSONB NOT NULL DEFAULT '[]',
  metrics JSONB NOT NULL DEFAULT '[]',
  gradient TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-400',
  icon_name TEXT NOT NULL DEFAULT 'Zap',
  sort_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Public can read published case studies
CREATE POLICY "Published case studies are publicly viewable"
  ON public.case_studies
  FOR SELECT
  USING (published = true);

-- Admin can manage all case studies
CREATE POLICY "Admin can manage case studies"
  ON public.case_studies
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'royokola3@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'royokola3@gmail.com');

-- Auto-update updated_at on changes
CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Seed existing case studies from the portfolio
-- ============================================================
INSERT INTO public.case_studies (slug, title, subtitle, category, location, date, partner, image, is_flagship, published, sections, metrics, gradient, icon_name, sort_order)
VALUES
(
  'solar-microgrid-ev',
  'Solar Microgrid Integration for EV Charging Infrastructure',
  'Renewable energy integration for sustainable charging operations',
  'E-Mobility Infrastructure',
  'Nairobi, Kenya',
  '2024-2026',
  'Roam Electric',
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
  true,
  true,
  '[
    {"heading": "Project Overview", "content": "Electric mobility infrastructure introduces new electricity demand to urban energy systems. In regions where grid capacity may be constrained or where electricity costs fluctuate, integrating renewable energy into charging infrastructure becomes essential.\n\nThis project explores the integration of a solar photovoltaic microgrid with EV charging infrastructure to reduce reliance on grid electricity, lower operational costs, and reduce carbon emissions."},
    {"heading": "Problem Statement", "content": "Electric motorcycle adoption in East Africa is growing rapidly due to lower operational costs and increasing demand for clean mobility solutions. However, charging infrastructure introduces several challenges: increased electricity demand at charging sites; high operational costs when relying solely on grid electricity; limited renewable energy integration in mobility infrastructure; and potential grid instability in areas with weak electrical infrastructure."},
    {"heading": "Objectives", "content": "The key objectives were: evaluate the feasibility of solar PV integration for EV charging stations; analyze charging demand patterns for electric motorcycles; determine optimal solar system capacity for charging operations; estimate carbon emission reductions from renewable energy integration; and assess economic viability and operational savings."},
    {"heading": "Methodology", "content": "The study followed a structured engineering approach.\n\nCharging Demand Analysis: Charging patterns were analyzed (number of motorcycles charged per day, average energy per session, peak demand hours, charger output capacity).\n\nSolar Resource Assessment: Solar irradiation data was evaluated to size the PV array correctly for the location.\n\nPV System Design: The solar photovoltaic system was sized to meet a target share of demand from solar.\n\nGrid Integration: The system was designed as a grid-tied hybrid where solar supplies the load first and the grid provides additional power when solar is insufficient."},
    {"heading": "Technical System Design", "content": "The proposed system included several integrated components.\n\nSolar PV System: Photovoltaic array on canopy structures, inverters for DC to AC conversion, and monitoring systems for performance tracking.\n\nCharging Infrastructure: DC fast chargers for electric motorcycles and load management systems to balance demand with available solar and grid supply.\n\nGrid Interconnection: Grid connection for supplemental supply and protection systems for safe operation and islanding where applicable.\n\nEnergy Management: Smart controllers to prioritize solar utilization and monitoring platforms for energy analytics."},
    {"heading": "Results and Impact", "content": "Operational benefits included reduction in grid electricity consumption, lower operating costs for charging infrastructure operators, and increased resilience during grid outages.\n\nEnvironmental impact: Reduction in carbon emissions associated with electricity consumption and contribution to sustainable mobility ecosystems.\n\nScalability: Solar-integrated charging systems can be replicated across urban mobility hubs and support distributed charging infrastructure deployment."}
  ]'::jsonb,
  '[
    {"label": "Solar Capacity", "value": "50 kW", "icon_name": "Sun"},
    {"label": "CO₂ Saved/Year", "value": "45 tons", "icon_name": "Leaf"},
    {"label": "EVs Charged/Month", "value": "200+", "icon_name": "Zap"},
    {"label": "Grid Independence", "value": "70%", "icon_name": "Battery"}
  ]'::jsonb,
  'from-blue-500 to-cyan-400',
  'Zap',
  1
),
(
  'roam-point-deployment',
  'Roam Point EV Charging Infrastructure Deployment',
  'Product ownership and deployment of distributed fast charging for electric motorcycles',
  'EV Infrastructure',
  'Nairobi, Kenya',
  '2025-Present',
  'Roam Electric',
  '/images/roam-electric.webp',
  false,
  true,
  '[
    {"heading": "Project Overview", "content": "Roam Point is a distributed electric vehicle charging infrastructure designed to support the growing adoption of electric motorcycles across African cities. The project focuses on developing accessible charging infrastructure that allows riders to recharge quickly while enabling businesses and landowners to host charging stations.\n\nAs Product Owner, the role involved supporting the development, deployment strategy, and partnership ecosystem required to scale charging infrastructure."},
    {"heading": "Problem Statement", "content": "Electric motorcycle adoption is increasing rapidly, but infrastructure limitations remain a major barrier. Key challenges include: limited public charging stations; long travel distances between charging locations; infrastructure deployment costs; and lack of commercial incentives for charging site hosts."},
    {"heading": "Objectives", "content": "The project aimed to: deploy distributed EV charging infrastructure across urban environments; create partnership models that enable businesses to host charging stations; improve charging accessibility for electric motorcycle riders; and support scalable electric mobility ecosystems."},
    {"heading": "Infrastructure Design", "content": "The Roam Point charging solution is designed for flexible deployment. Technical specifications include: 6.6 kW DC fast charging capability; high efficiency power electronics; connectivity for remote monitoring and management; and dual charging connectors for operational flexibility."},
    {"heading": "Deployment Models", "content": "The charging system supports multiple installation configurations:\n\nWall Mounted Chargers: For secure walls within commercial spaces or workshops.\n\nMobile Chargers: Portable units for small businesses or repair workshops.\n\nPole Mounted Chargers: For open parking spaces and curbside locations.\n\nCanopy Charging Stations: For larger installations such as transport hubs or shopping centers."},
    {"heading": "Business Model", "content": "The project introduces a partnership model that allows landowners and businesses to host charging infrastructure. Partner responsibilities include providing space and basic site support; in return, partners benefit through monthly rental payments, revenue sharing from electricity sales, and increased customer foot traffic."},
    {"heading": "Impact", "content": "The Roam Point project contributes to increased accessibility of EV charging infrastructure, reduced operational barriers for electric motorcycle riders, expansion of electric mobility ecosystems, and new economic opportunities for local businesses."}
  ]'::jsonb,
  '[
    {"label": "Charging Output", "value": "6.6 kW", "icon_name": "Zap"},
    {"label": "Peak Efficiency", "value": "94%", "icon_name": "TrendingUp"},
    {"label": "Connectivity", "value": "4G+WiFi", "icon_name": "Wifi"},
    {"label": "Deployment", "value": "4 Models", "icon_name": "Map"}
  ]'::jsonb,
  'from-amber-500 to-orange-600',
  'Zap',
  2
),
(
  'site-feasibility',
  'EV Charging Site Feasibility Analysis Using Spatial Data',
  'GIS-based site selection for charging infrastructure deployment',
  'Data & Analytics',
  'Nairobi Metropolitan Area',
  '2024-2025',
  NULL,
  '/images/basigo-buses.jpeg',
  false,
  true,
  '[
    {"heading": "Project Overview", "content": "The deployment of EV charging infrastructure requires careful site selection to ensure accessibility, demand, and operational viability. This project focused on evaluating potential locations for charging infrastructure using spatial analysis and demand mapping.\n\nThe work combined geographic information systems (GIS), mobility data, and infrastructure constraints to produce a shortlist of sites where charging stations would be both technically feasible and likely to achieve strong utilization."},
    {"heading": "Problem Statement", "content": "Charging infrastructure must be strategically located to ensure high utilization, accessibility for riders, reliable electricity supply, and operational safety. Poor site selection may result in underutilized infrastructure or operational inefficiencies.\n\nWithout a structured approach to site selection, deployment can be driven by convenience or availability of space rather than demand and grid readiness."},
    {"heading": "Objectives", "content": "The feasibility study aimed to: identify high-potential locations for charging infrastructure; evaluate energy supply availability; analyze mobility demand patterns; and prioritize locations for deployment."},
    {"heading": "Methodology", "content": "Mobility Demand Analysis: Locations with high motorcycle traffic were identified using available mobility and traffic data.\n\nInfrastructure Assessment: Potential sites were evaluated based on proximity to electricity infrastructure, land availability, and safety considerations.\n\nSpatial Mapping: GIS tools were used to map candidate locations and analyze proximity to transport hubs and commercial centers."},
    {"heading": "Results", "content": "The analysis identified several high-priority zones suitable for charging infrastructure deployment. Key findings included: transport hubs present high charging demand and are natural anchors for the network; commercial centers offer strong partnership opportunities and visibility; and infrastructure clustering in key corridors improves accessibility for riders and supports network effects."}
  ]'::jsonb,
  '[
    {"label": "Sites Analyzed", "value": "50+", "icon_name": "MapPin"},
    {"label": "Priority Zones", "value": "12", "icon_name": "Map"},
    {"label": "Hub Proposals", "value": "10+", "icon_name": "BarChart3"},
    {"label": "Data Points", "value": "1,000+", "icon_name": "TrendingUp"}
  ]'::jsonb,
  'from-indigo-500 to-purple-500',
  'BarChart3',
  3
),
(
  'solar-cold-storage',
  'Solar-Powered Cold Storage for Agricultural Supply Chains',
  'Reducing post-harvest losses through renewable-powered refrigeration',
  'AgriTech Solutions',
  'Machakos County, Kenya',
  '2023',
  NULL,
  'https://images.unsplash.com/photo-1698752822107-69f8973936e4?w=800&q=80',
  false,
  true,
  '[
    {"heading": "Project Overview", "content": "Post-harvest losses remain a major challenge in agricultural supply chains across developing regions. Limited access to refrigeration results in significant food waste and limits the ability of farmers to reach distant or higher-value markets.\n\nThis project explored the development of a solar-powered cold storage solution designed to extend shelf life for perishable produce."},
    {"heading": "Problem Statement", "content": "Farmers often lack access to refrigeration infrastructure, leading to rapid spoilage of fresh produce, reduced farmer incomes, and food supply chain inefficiencies. Where grid power is unavailable or unreliable, conventional cold rooms are not an option."},
    {"heading": "Solution", "content": "The system integrates solar photovoltaic energy with an evaporative cooling system to provide off-grid refrigeration. Solar panels charge a battery bank that powers the cooling unit, while the evaporative component reduces the need for high electrical demand and improves suitability for intermittent solar supply."},
    {"heading": "Impact", "content": "The system demonstrated the ability to extend produce shelf life by several days while operating entirely on renewable energy. Measured outcomes included reduction in post-harvest loss, improved ability to hold produce for better prices, and positive feedback from farmers on usability and reliability."}
  ]'::jsonb,
  '[
    {"label": "Shelf Life Extended", "value": "+7 days", "icon_name": "Thermometer"},
    {"label": "Loss Reduction", "value": "35%", "icon_name": "TrendingUp"},
    {"label": "Farmers Benefited", "value": "50+", "icon_name": "Users"},
    {"label": "Income Increase", "value": "$2K/yr", "icon_name": "BarChart3"}
  ]'::jsonb,
  'from-orange-500 to-yellow-400',
  'Sun',
  4
),
(
  'energy-demand-modeling',
  'Energy Demand Modeling for Electric Mobility Infrastructure',
  'Analyzing charging demand patterns to inform infrastructure planning',
  'Data & Analytics',
  'Nairobi, Kenya',
  '2024-2025',
  NULL,
  '/images/basigo-charging.png',
  false,
  true,
  '[
    {"heading": "Project Overview", "content": "Understanding electricity demand patterns is essential for planning EV charging infrastructure. This project analyzed charging demand for electric motorcycles to support infrastructure planning and energy system design.\n\nThe work aimed to answer questions such as: when and where do riders charge, how much energy do they use per session, and what does that imply for grid capacity and for the sizing of solar or storage at charging sites?"},
    {"heading": "Methodology", "content": "Data Collection: Charging session data was collected from operational charging stations including session duration, energy consumed, and time of day. This provided a real-world foundation for demand analysis.\n\nDemand Profile Analysis: Charging patterns were analyzed to identify peak hours, average load, and seasonal or day-of-week variations. This step was critical for sizing both the charging infrastructure and any on-site renewable or storage systems.\n\nInfrastructure Sizing: The demand profiles were used to model appropriate charging station capacity and to evaluate the feasibility of solar and storage integration at key sites."},
    {"heading": "Results", "content": "The demand analysis revealed distinct peak charging periods aligned with rider shift patterns, which informed the recommended capacity for new sites. The findings also showed that solar generation profiles could be well-matched to charging demand in several key locations, supporting the business case for solar-integrated charging infrastructure.\n\nDeliverable outputs included demand profiles, infrastructure sizing recommendations, and a framework for repeating the analysis as the charging network expands."}
  ]'::jsonb,
  '[
    {"label": "Sessions Analyzed", "value": "5,000+", "icon_name": "BarChart3"},
    {"label": "Peak Demand", "value": "85 kW", "icon_name": "Zap"},
    {"label": "Sites Modeled", "value": "15", "icon_name": "MapPin"},
    {"label": "Solar Match", "value": "65%", "icon_name": "Sun"}
  ]'::jsonb,
  'from-green-500 to-teal-400',
  'BarChart3',
  5
);
