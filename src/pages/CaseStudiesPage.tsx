import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Sun, Battery, Zap, Leaf, TrendingUp, Users,
  MapPin, Calendar, X, ChevronRight, BarChart3,
  Droplets, Thermometer, ArrowLeft, Wifi, Shield,
  Download, Crown, Map, Edit, Archive, Cpu
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isAdminEmail } from "@/lib/config";
import CaseStudiesManager from "@/components/admin/CaseStudiesManager";

// Icon map for resolving icon names from the database
const ICON_MAP: Record<string, typeof Sun> = {
  Sun, Battery, Zap, Leaf, TrendingUp, Users, MapPin, Calendar,
  BarChart3, Droplets, Thermometer, Wifi, Shield, Map, Cpu,
};

const resolveIcon = (name: string): typeof Sun => ICON_MAP[name] ?? Zap;

// Case study images
const CASE_STUDY_IMAGES = {
  solarMicrogrid: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80",
  roamPoint: "/images/roam-electric.webp",
  siteFeasibility: "/images/basigo-buses.jpeg",
  solarColdStorage: "https://images.unsplash.com/photo-1698752822107-69f8973936e4?w=800&q=80",
  energyDemand: "/images/basigo-charging.png",
  safaricharge: "/images/og-image.png",
};

interface Metric {
  label: string;
  value: string;
  icon: typeof TrendingUp;
}

interface CaseStudy {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  date: string;
  role?: string;
  isFlagship?: boolean;
  sections: { heading: string; content: string }[];
  metrics: Metric[];
  gradient: string;
  icon: typeof Sun;
  partner?: string;
  image?: string;
  pdfDownload?: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "solar-microgrid-ev",
    title: "Solar Microgrid Integration for EV Charging Infrastructure",
    subtitle: "Renewable energy integration for sustainable charging operations",
    category: "E-Mobility Infrastructure",
    location: "Nairobi, Kenya",
    date: "2024-2026",
    partner: "Roam Electric",
    isFlagship: true,
    image: CASE_STUDY_IMAGES.solarMicrogrid,
    sections: [
      { heading: "Project Overview", content: "Electric mobility infrastructure introduces new electricity demand to urban energy systems. In regions where grid capacity may be constrained or where electricity costs fluctuate, integrating renewable energy into charging infrastructure becomes essential.\n\nThis project explores the integration of a solar photovoltaic microgrid with EV charging infrastructure to reduce reliance on grid electricity, lower operational costs, and reduce carbon emissions." },
      { heading: "Problem Statement", content: "Electric motorcycle adoption in East Africa is growing rapidly due to lower operational costs and increasing demand for clean mobility solutions. However, charging infrastructure introduces several challenges: increased electricity demand at charging sites; high operational costs when relying solely on grid electricity; limited renewable energy integration in mobility infrastructure; and potential grid instability in areas with weak electrical infrastructure." },
      { heading: "Objectives", content: "The key objectives were: evaluate the feasibility of solar PV integration for EV charging stations; analyze charging demand patterns for electric motorcycles; determine optimal solar system capacity for charging operations; estimate carbon emission reductions from renewable energy integration; and assess economic viability and operational savings." },
      { heading: "Methodology", content: "The study followed a structured engineering approach.\n\nCharging Demand Analysis: Charging patterns were analyzed (number of motorcycles charged per day, average energy per session, peak demand hours, charger output capacity).\n\nSolar Resource Assessment: Solar irradiation data was evaluated (average daily irradiation, seasonal variability, system performance ratios) to size the PV array correctly for the location.\n\nPV System Design: The solar photovoltaic system was sized (array capacity, inverter sizing, system efficiency, energy output simulations) to meet a target share of demand from solar." },
      { heading: "Technical System Design", content: "The proposed system included several integrated components.\n\nSolar PV System: Photovoltaic array on canopy structures, inverters for DC to AC conversion, and monitoring systems for performance tracking.\n\nCharging Infrastructure: DC fast chargers for electric motorcycles and load management systems to balance demand with available solar and grid supply.\n\nGrid Interconnection: Grid connection for supplemental supply and protection systems for safe operation and islanding where applicable." },
      { heading: "Results and Impact", content: "Operational benefits included reduction in grid electricity consumption, lower operating costs for charging infrastructure operators, and increased resilience during grid outages.\n\nEnvironmental impact: Reduction in carbon emissions associated with electricity consumption and contribution to sustainable mobility ecosystems.\n\nScalability: Solar-integrated charging systems can be replicated across urban mobility hubs and support distributed charging infrastructure deployment." },
    ],
    metrics: [
      { label: "Solar Capacity", value: "50 kW", icon: Sun },
      { label: "CO\u2082 Saved/Year", value: "45 tons", icon: Leaf },
      { label: "EVs Charged/Month", value: "200+", icon: Zap },
      { label: "Grid Independence", value: "70%", icon: Battery },
    ],
    gradient: "from-blue-500 to-cyan-400",
    icon: Zap,
  },
  {
    id: "roam-point-deployment",
    title: "Roam Point EV Charging Infrastructure Deployment",
    subtitle: "Product ownership and deployment of distributed fast charging for electric motorcycles",
    category: "EV Infrastructure",
    location: "Nairobi, Kenya",
    date: "2025-Present",
    role: "Product Owner - Roam Point Charging Infrastructure",
    partner: "Roam Electric",
    image: CASE_STUDY_IMAGES.roamPoint,
    pdfDownload: "/Roam_Point_Partnership_Opportunity.pdf",
    sections: [
      { heading: "Project Overview", content: "Roam Point is a distributed electric vehicle charging infrastructure designed to support the growing adoption of electric motorcycles across African cities. The project focuses on developing accessible charging infrastructure that allows riders to recharge quickly while enabling businesses and landowners to host charging stations." },
      { heading: "Problem Statement", content: "Electric motorcycle adoption is increasing rapidly, but infrastructure limitations remain a major barrier. Key challenges include: limited public charging stations; long travel distances between charging locations; infrastructure deployment costs; and lack of commercial incentives for charging site hosts." },
      { heading: "Objectives", content: "The project aimed to: deploy distributed EV charging infrastructure across urban environments; create partnership models that enable businesses to host charging stations; improve charging accessibility for electric motorcycle riders; and support scalable electric mobility ecosystems." },
      { heading: "Infrastructure Design", content: "Technical specifications include: 6.6 kW DC fast charging capability; high efficiency power electronics; connectivity for remote monitoring and management; and dual charging connectors for operational flexibility.\n\nThe infrastructure is compact and robust, suitable for environmental conditions commonly encountered across African urban environments." },
      { heading: "Deployment Models", content: "Wall Mounted Chargers: For secure walls within commercial spaces or workshops.\n\nMobile Chargers: Portable units for small businesses or repair workshops.\n\nPole Mounted Chargers: For open parking spaces and curbside locations.\n\nCanopy Charging Stations: For larger installations such as transport hubs or shopping centers." },
      { heading: "Business Model", content: "The project introduces a partnership model that allows landowners and businesses to host charging infrastructure. Partners benefit through monthly rental payments, revenue sharing from electricity sales, and increased customer foot traffic." },
      { heading: "Impact", content: "The Roam Point project contributes to increased accessibility of EV charging infrastructure, reduced operational barriers for electric motorcycle riders, expansion of electric mobility ecosystems, and new economic opportunities for local businesses." },
    ],
    metrics: [
      { label: "Charging Output", value: "6.6 kW", icon: Zap },
      { label: "Peak Efficiency", value: "94%", icon: TrendingUp },
      { label: "Connectivity", value: "4G+WiFi", icon: Wifi },
      { label: "Deployment", value: "4 Models", icon: Map },
    ],
    gradient: "from-amber-500 to-orange-600",
    icon: Zap,
  },
  {
    id: "site-feasibility",
    title: "EV Charging Site Feasibility Analysis Using Spatial Data",
    subtitle: "GIS-based site selection for charging infrastructure deployment",
    category: "Data & Analytics",
    location: "Nairobi Metropolitan Area",
    date: "2024-2025",
    image: CASE_STUDY_IMAGES.siteFeasibility,
    sections: [
      { heading: "Project Overview", content: "The deployment of EV charging infrastructure requires careful site selection to ensure accessibility, demand, and operational viability. This project focused on evaluating potential locations for charging infrastructure using spatial analysis and demand mapping." },
      { heading: "Problem Statement", content: "Charging infrastructure must be strategically located to ensure high utilization, accessibility for riders, reliable electricity supply, and operational safety. Without a structured approach, deployment can be driven by convenience rather than demand and grid readiness." },
      { heading: "Objectives", content: "The feasibility study aimed to: identify high-potential locations for charging infrastructure; evaluate energy supply availability; analyze mobility demand patterns; and prioritize locations for deployment." },
      { heading: "Methodology", content: "Mobility Demand Analysis: Locations with high motorcycle traffic were identified using available mobility and traffic data.\n\nInfrastructure Assessment: Potential sites were evaluated based on proximity to electricity infrastructure, land availability, and safety considerations.\n\nSpatial Mapping: GIS tools were used to map candidate locations and analyze proximity to transport hubs and commercial centers." },
      { heading: "Results", content: "The analysis identified several high-priority zones suitable for charging infrastructure deployment. Key findings: transport hubs present high charging demand; commercial centers offer strong partnership opportunities; and infrastructure clustering in key corridors improves accessibility for riders." },
    ],
    metrics: [
      { label: "Sites Analyzed", value: "50+", icon: MapPin },
      { label: "Priority Zones", value: "12", icon: Map },
      { label: "Hub Proposals", value: "10+", icon: BarChart3 },
      { label: "Data Points", value: "1,000+", icon: TrendingUp },
    ],
    gradient: "from-indigo-500 to-purple-500",
    icon: BarChart3,
  },
  {
    id: "solar-cold-storage",
    title: "Solar-Powered Cold Storage for Agricultural Supply Chains",
    subtitle: "Reducing post-harvest losses through renewable-powered refrigeration",
    category: "AgriTech Solutions",
    location: "Machakos County, Kenya",
    date: "2023",
    image: CASE_STUDY_IMAGES.solarColdStorage,
    sections: [
      { heading: "Project Overview", content: "Post-harvest losses remain a major challenge in agricultural supply chains across developing regions. This project explored the development of a solar-powered cold storage solution designed to extend shelf life for perishable produce, combining solar PV with evaporative cooling." },
      { heading: "Problem Statement", content: "Farmers often lack access to refrigeration infrastructure, leading to rapid spoilage of fresh produce, reduced farmer incomes, and food supply chain inefficiencies. Where grid power is unavailable or unreliable, conventional cold rooms are not an option." },
      { heading: "Solution", content: "The system integrates solar photovoltaic energy with an evaporative cooling system to provide off-grid refrigeration. Solar panels charge a battery bank that powers the cooling unit while the evaporative component reduces electrical demand." },
      { heading: "Impact", content: "The system demonstrated the ability to extend produce shelf life by several days while operating entirely on renewable energy. Measured outcomes included reduction in post-harvest loss and improved ability to hold produce for better prices." },
    ],
    metrics: [
      { label: "Shelf Life Extended", value: "+7 days", icon: Thermometer },
      { label: "Loss Reduction", value: "35%", icon: TrendingUp },
      { label: "Farmers Benefited", value: "50+", icon: Users },
      { label: "Income Increase", value: "$2K/yr", icon: BarChart3 },
    ],
    gradient: "from-orange-500 to-yellow-400",
    icon: Sun,
  },
  {
    id: "safaricharge-platform",
    slug: "safaricharge-platform",
    title: "SafariCharge Platform Buildout and Operations Workflow",
    subtitle: "Designing and shipping the SafariCharge platform stack for EV charging operations and growth.",
    category: "Platform Engineering",
    location: "Nairobi, Kenya",
    date: "2025-Present",
    role: "Founder & Product Lead",
    partner: "SafariCharge",
    image: CASE_STUDY_IMAGES.safaricharge,
    sections: [
      { heading: "Project Overview", content: "SafariCharge is a clean-mobility platform project focused on building practical software and operations tooling to support EV charging infrastructure growth in East Africa." },
      { heading: "Core Problem", content: "EV ecosystem growth requires coordination across infrastructure planning, partner onboarding, and reliable software operations. Fragmented workflows slow deployments and reduce operational visibility." },
      { heading: "Platform Work Delivered", content: "Implemented portfolio-facing product experience, operational workflow tooling, and integration-ready architecture to support expansion of charging deployments and partner operations." },
      { heading: "Current Focus", content: "Scaling content and project communication through linked project, case-study, and blog flows while strengthening platform reliability, security, and delivery velocity." },
    ],
    metrics: [
      { label: "Focus", value: "Platform + Ops", icon: Cpu },
      { label: "Model", value: "Product-led", icon: TrendingUp },
      { label: "Domain", value: "EV Charging", icon: Zap },
      { label: "Region", value: "East Africa", icon: MapPin },
    ],
    gradient: "from-cyan-500 to-blue-600",
    icon: Cpu,
  },
  {
    id: "energy-demand-modeling",
    title: "Energy Demand Modeling for Electric Mobility Infrastructure",
    subtitle: "Analyzing charging demand patterns to inform infrastructure planning",
    category: "Data & Analytics",
    location: "Nairobi, Kenya",
    date: "2024-2025",
    image: CASE_STUDY_IMAGES.energyDemand,
    sections: [
      { heading: "Project Overview", content: "Understanding electricity demand patterns is essential for planning EV charging infrastructure. This project analyzed charging demand for electric motorcycles to support infrastructure planning and energy system design." },
      { heading: "Methodology", content: "Data from charging stations and rider usage patterns was analyzed to estimate average energy consumption per session, peak charging periods, and infrastructure capacity requirements." },
      { heading: "Results", content: "The analysis revealed key charging patterns that influence infrastructure planning. Peak charging demand typically occurs during operational downtime periods for riders (midday or early evening), which has implications for grid peak loads and for the value of solar generation." },
    ],
    metrics: [
      { label: "Stations Analyzed", value: "15+", icon: Zap },
      { label: "Rider Patterns", value: "500+", icon: Users },
      { label: "Peak Hours ID'd", value: "3", icon: TrendingUp },
      { label: "Grid Planning", value: "Active", icon: Battery },
    ],
    gradient: "from-teal-500 to-cyan-400",
    icon: BarChart3,
  },
];

const CaseStudiesPage = () => {
  const { user } = useAuth();
  const isAdmin = isAdminEmail(user?.email);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [caseStudiesData, setCaseStudiesData] = useState<CaseStudy[]>(caseStudies);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  useEffect(() => {
    const fetchFromSupabase = async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: CaseStudy[] = data.map((cs: Tables<"case_studies">) => ({
          id: cs.id,
          slug: cs.slug || undefined,
          title: cs.title,
          subtitle: cs.subtitle || "",
          category: cs.category,
          location: cs.location || "",
          date: cs.date || "",
          role: cs.role || undefined,
          isFlagship: cs.is_flagship,
          partner: cs.partner || undefined,
          image: cs.image || undefined,
          pdfDownload: cs.pdf_download || undefined,
          sections: Array.isArray(cs.sections)
            ? (cs.sections as { heading: string; content: string }[])
            : [],
          metrics: Array.isArray(cs.metrics)
            ? (cs.metrics as { label: string; value: string; icon_name: string }[]).map((m) => ({
                label: m.label,
                value: m.value,
                icon: resolveIcon(m.icon_name || "Zap"),
              }))
            : [],
          gradient: cs.gradient || "from-blue-500 to-cyan-400",
          icon: resolveIcon(cs.icon_name || "Zap"),
        }));
        setCaseStudiesData(mapped);
      }
    };
    fetchFromSupabase();
  }, []);

  useEffect(() => {
    if (selectedStudy && modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [selectedStudy]);

  useEffect(() => {
    const study = searchParams.get("study");
    if (!study || selectedStudy) return;
    const matched = caseStudiesData.find((item) => item.id === study || item.slug === study);
    if (matched) setSelectedStudy(matched);
  }, [searchParams, caseStudiesData, selectedStudy]);

  const archiveCaseStudy = async (id: string, currentPublished: boolean) => {
    if (!supabase) return;
    try {
      let query = supabase.from("case_studies").update({ published: !currentPublished });
      query = isUuid(id) ? query.eq("id", id) : query.eq("slug", id);
      const { error } = await query;
      if (error) throw error;
      toast({ title: "Success", description: `Case study ${currentPublished ? "archived" : "restored"}` });
      setCaseStudiesData((prev) => (currentPublished ? prev.filter((s) => s.id !== id) : prev));
    } catch {
      toast({ title: "Error", description: "Failed to update case study", variant: "destructive" });
    }
  };

  const flagshipStudy = caseStudiesData.find((s) => s.isFlagship);
  const otherStudies = caseStudiesData.filter((s) => !s.isFlagship);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <span className="text-primary font-medium text-sm tracking-wide uppercase">Impact Stories</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Case <span className="gradient-text">Studies</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Engineering documentation of renewable energy and mobility infrastructure projects making measurable impact across Africa.
            </p>
          </motion.div>

          {/* Admin panel */}
          {isAdmin && (
            <motion.section
              id="admin-case-studies-manager"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="glass-card rounded-2xl p-6 border border-primary/20"
            >
              <h2 className="text-xl font-display font-bold mb-1">Manage Case Studies</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Add, edit, publish, archive, and remove case studies directly from this page.
              </p>
              <CaseStudiesManager />
            </motion.section>
          )}

          {/* Flagship Case Study */}
          {flagshipStudy && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div
                onClick={() => setSelectedStudy(flagshipStudy)}
                className="group glass-card rounded-2xl overflow-hidden cursor-pointer card-hover border border-amber-500/20"
              >
                <div className="grid md:grid-cols-2">
                  {/* Image: fixed aspect ratio, never stretches */}
                  {flagshipStudy.image && (
                    <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden bg-muted/20">
                      <img
                        src={flagshipStudy.image}
                        alt={flagshipStudy.title}
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 pointer-events-none" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black px-3 py-1.5 rounded-full shadow">
                          <Crown className="w-3 h-3" />
                          Flagship Case Study
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col justify-center gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">{flagshipStudy.category}</span>
                      <h3 className="text-xl md:text-2xl font-display font-bold mt-1 group-hover:text-primary transition-colors">
                        {flagshipStudy.title}
                      </h3>
                      {flagshipStudy.role && (
                        <p className="text-sm text-amber-400/80 font-medium mt-1">{flagshipStudy.role}</p>
                      )}
                      <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{flagshipStudy.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {flagshipStudy.metrics.slice(0, 4).map((m) => (
                        <div key={m.label} className="bg-black/5 dark:bg-white/5 rounded-lg p-3 text-center">
                          <p className="text-sm font-bold text-primary">{m.value}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <button className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                        Read Full Study <ChevronRight className="w-4 h-4" />
                      </button>
                      {flagshipStudy.pdfDownload && (
                        <a
                          href={flagshipStudy.pdfDownload}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other Case Studies Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {otherStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div
                  onClick={() => setSelectedStudy(study)}
                  className="glass-card rounded-2xl overflow-hidden cursor-pointer card-hover h-full flex flex-col"
                >
                  {/* Card image: consistent aspect ratio */}
                  {study.image ? (
                    <div className="relative aspect-video w-full overflow-hidden bg-muted/20 shrink-0">
                      <img
                        src={study.image}
                        alt={study.title}
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute top-3 right-3 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        <study.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-white/80 text-xs font-medium">{study.category}</span>
                        <h3 className="text-base font-display font-bold text-white leading-snug mt-0.5">{study.title}</h3>
                      </div>
                    </div>
                  ) : (
                    <div className={`relative aspect-video w-full bg-gradient-to-br ${study.gradient} p-5 flex flex-col justify-end shrink-0`}>
                      <div className="absolute top-3 right-3 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        <study.icon className="w-5 h-5 text-white" />
                      </div>
                      {study.partner && (
                        <span className="text-white/90 text-xs font-medium bg-white/20 px-2 py-1 rounded-full self-start mb-2">
                          {study.partner}
                        </span>
                      )}
                      <span className="text-white/80 text-xs font-medium">{study.category}</span>
                      <h3 className="text-base font-display font-bold text-white leading-snug mt-0.5">{study.title}</h3>
                    </div>
                  )}

                  {/* Card body */}
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{study.subtitle}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {study.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 shrink-0" />
                        {study.date}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      {study.metrics.slice(0, 2).map((metric) => (
                        <div key={metric.label} className="bg-black/5 dark:bg-white/5 rounded-lg p-3 text-center">
                          <p className="text-base font-bold text-primary">{metric.value}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{metric.label}</p>
                        </div>
                      ))}
                    </div>

                    <button className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                      Read Case Study <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      {/* ─── Detail Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            ref={modalScrollRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedStudy(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl my-6 flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-2xl"
            >
              {/* Modal header: image + title row */}
              {selectedStudy.image ? (
                <div className="shrink-0">
                  {/* Contained image – aspect-ratio so it never crops too aggressively */}
                  <div className="relative w-full aspect-[16/6] overflow-hidden bg-muted/20">
                    <img
                      src={selectedStudy.image}
                      alt={selectedStudy.title}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent pointer-events-none" />
                  </div>

                  {/* Title row below image */}
                  <div className="bg-card px-5 py-4 sm:px-7 sm:py-5 border-b border-border flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${selectedStudy.gradient} shrink-0`}>
                        <selectedStudy.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-muted-foreground text-xs">{selectedStudy.category}</span>
                          {selectedStudy.isFlagship && (
                            <span className="text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black px-2 py-0.5 rounded-full">
                              Flagship
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-xl font-display font-bold text-foreground mt-0.5 leading-snug">
                          {selectedStudy.title}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudy(null)}
                      className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground shrink-0 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`h-36 sm:h-44 bg-gradient-to-br ${selectedStudy.gradient} relative p-5 sm:p-7 flex flex-col justify-end shrink-0`}>
                  <button
                    onClick={() => setSelectedStudy(null)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-end gap-3">
                    <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
                      <selectedStudy.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="text-white/75 text-xs">{selectedStudy.category}</span>
                      <h3 className="text-lg sm:text-2xl font-display font-bold text-white leading-snug">{selectedStudy.title}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal body – scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0 max-h-[65vh] p-5 sm:p-7 bg-card space-y-6">

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    {selectedStudy.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    {selectedStudy.date}
                  </span>
                  {selectedStudy.partner && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                      {selectedStudy.partner}
                    </span>
                  )}
                </div>

                {/* Role badge */}
                {selectedStudy.role && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
                    <p className="text-xs sm:text-sm font-medium text-amber-400">{selectedStudy.role}</p>
                  </div>
                )}

                {/* Content sections */}
                <div className="space-y-6">
                  {selectedStudy.sections.map((section) => (
                    <div key={section.heading}>
                      <h4 className="font-display font-semibold text-sm sm:text-base text-primary mb-2">{section.heading}</h4>
                      <p className="text-foreground/90 text-sm sm:text-base leading-relaxed whitespace-pre-line">{section.content}</p>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border">
                  {selectedStudy.metrics.map((metric) => (
                    <div key={metric.label} className="bg-black/5 dark:bg-white/5 rounded-xl p-3 sm:p-4 text-center">
                      <metric.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1.5" />
                      <p className="text-lg sm:text-2xl font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{metric.label}</p>
                    </div>
                  ))}
                </div>

                {/* PDF download */}
                {selectedStudy.pdfDownload && (
                  <div className="pt-4 border-t border-border">
                    <a
                      href={selectedStudy.pdfDownload}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download Partnership Document
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
