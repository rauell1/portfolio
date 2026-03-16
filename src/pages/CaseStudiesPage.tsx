import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Sun, Battery, Zap, Leaf, TrendingUp, Users,
  MapPin, Calendar, X, ChevronRight, BarChart3,
  Droplets, Thermometer, ArrowLeft, Wifi, Shield,
  Download, Crown, Map, Edit, Archive
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Icon map for resolving icon names from the database
const ICON_MAP: Record<string, typeof Sun> = {
  Sun, Battery, Zap, Leaf, TrendingUp, Users, MapPin, Calendar,
  BarChart3, Droplets, Thermometer, Wifi, Shield, Map,
};

const resolveIcon = (name: string): typeof Sun => ICON_MAP[name] ?? Zap;

// Case study images: local images from public/images/
const CASE_STUDY_IMAGES = {
  solarMicrogrid: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80",  // Solar
  roamPoint: "/images/roam-electric.webp",        // Roam Electric bikes – EV charging
  siteFeasibility: "/images/basigo-buses.jpeg",   // BasiGo buses – EV infrastructure
  solarColdStorage: "https://images.unsplash.com/photo-1698752822107-69f8973936e4?w=800&q=80", // Solar, different from above
  energyDemand: "/images/basigo-charging.png",    // BasiGo charging infrastructure
};

interface Metric {
  label: string;
  value: string;
  icon: typeof TrendingUp;
}

interface CaseStudy {
  id: string;
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
      {
        heading: "Project Overview",
        content: "Electric mobility infrastructure introduces new electricity demand to urban energy systems. In regions where grid capacity may be constrained or where electricity costs fluctuate, integrating renewable energy into charging infrastructure becomes essential.\n\nThis project explores the integration of a solar photovoltaic microgrid with EV charging infrastructure to reduce reliance on grid electricity, lower operational costs, and reduce carbon emissions. The case study demonstrates how renewable energy can support the growth of electric mobility in African cities while maintaining reliable charging access for riders. The goal was to design a system capable of supporting electric motorcycle charging operations using solar power while maintaining grid connectivity as a backup energy source. The work combined energy systems engineering with mobility infrastructure planning to deliver a technically sound and economically viable solution."
      },
      {
        heading: "Problem Statement",
        content: "Electric motorcycle adoption in East Africa is growing rapidly due to lower operational costs and increasing demand for clean mobility solutions. However, charging infrastructure introduces several challenges: increased electricity demand at charging sites; high operational costs when relying solely on grid electricity; limited renewable energy integration in mobility infrastructure; and potential grid instability in areas with weak electrical infrastructure.\n\nWithout renewable integration, EV charging stations may still depend heavily on carbon-intensive electricity sources. The challenge was therefore to design a solar-integrated charging solution that could offset grid electricity demand while maintaining operational reliability. Addressing these issues was critical to scaling electric mobility in a sustainable and cost-effective way."
      },
      {
        heading: "Objectives",
        content: "The key objectives were: evaluate the feasibility of solar PV integration for EV charging stations; analyze charging demand patterns for electric motorcycles; determine optimal solar system capacity for charging operations; estimate carbon emission reductions from renewable energy integration; and assess economic viability and operational savings.\n\nSecondary goals included documenting technical design choices for replication at other sites and providing clear metrics (solar capacity, grid independence, CO2 savings) to support future investment and policy discussions."
      },
      {
        heading: "Methodology",
        content: "The study followed a structured engineering approach.\n\nCharging Demand Analysis: Charging patterns were analyzed (number of motorcycles charged per day, average energy per session, peak demand hours, charger output capacity). This step established the load profile that the solar system would need to serve.\n\nSolar Resource Assessment: Solar irradiation data was evaluated (average daily irradiation, seasonal variability, system performance ratios) to size the PV array correctly for the location.\n\nPV System Design: The solar photovoltaic system was sized (array capacity, inverter sizing, system efficiency, energy output simulations) to meet a target share of demand from solar.\n\nGrid Integration: The system was designed as a grid-tied hybrid where solar supplies the load first and the grid provides additional power when solar is insufficient, ensuring reliability in all weather conditions."
      },
      {
        heading: "Technical System Design",
        content: "The proposed system included several integrated components.\n\nSolar PV System: Photovoltaic array on canopy structures, inverters for DC to AC conversion, and monitoring systems for performance tracking.\n\nCharging Infrastructure: DC fast chargers for electric motorcycles and load management systems to balance demand with available solar and grid supply.\n\nGrid Interconnection: Grid connection for supplemental supply and protection systems for safe operation and islanding where applicable.\n\nEnergy Management: Smart controllers to prioritize solar utilization and monitoring platforms for energy analytics. Together, these elements form a replicable design for solar-backed EV charging sites."
      },
      {
        heading: "Results and Impact",
        content: "Operational benefits included reduction in grid electricity consumption, lower operating costs for charging infrastructure operators, and increased resilience during grid outages.\n\nEnvironmental impact: Reduction in carbon emissions associated with electricity consumption and contribution to sustainable mobility ecosystems. Quantified outcomes (e.g. CO2 saved per year, share of demand from solar) support both operational and reporting needs.\n\nScalability: Solar-integrated charging systems can be replicated across urban mobility hubs and support distributed charging infrastructure deployment. Lessons learned: renewable energy integration significantly improves sustainability of mobility infrastructure; charging demand patterns influence solar system sizing; and distributed microgrid approaches are suitable for emerging electric mobility ecosystems."
      },
    ],
    metrics: [
      { label: "Solar Capacity", value: "50 kW", icon: Sun },
      { label: "CO₂ Saved/Year", value: "45 tons", icon: Leaf },
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
      {
        heading: "Project Overview",
        content: "Roam Point is a distributed electric vehicle charging infrastructure designed to support the growing adoption of electric motorcycles across African cities. The project focuses on developing accessible charging infrastructure that allows riders to recharge quickly while enabling businesses and landowners to host charging stations.\n\nAs Product Owner, the role involved supporting the development, deployment strategy, and partnership ecosystem required to scale charging infrastructure. This included defining product requirements, coordinating with technical and commercial teams, and ensuring that deployment locations and partner agreements aligned with both rider demand and business objectives."
      },
      {
        heading: "Problem Statement",
        content: "Electric motorcycle adoption is increasing rapidly, but infrastructure limitations remain a major barrier. Key challenges include: limited public charging stations; long travel distances between charging locations; infrastructure deployment costs; and lack of commercial incentives for charging site hosts.\n\nWithout accessible charging infrastructure, riders may experience reduced operational efficiency and range anxiety. The Roam Point initiative was designed to address these gaps by offering a distributed, partner-hosted model that could scale quickly while sharing value with site owners and improving the rider experience."
      },
      {
        heading: "Objectives",
        content: "The project aimed to: deploy distributed EV charging infrastructure across urban environments; create partnership models that enable businesses to host charging stations; improve charging accessibility for electric motorcycle riders; and support scalable electric mobility ecosystems.\n\nSuccess was measured through the number of operational charging points, partner uptake, rider usage, and feedback from both hosts and riders. Clear objectives helped align technical, commercial, and operational efforts throughout the rollout."
      },
      {
        heading: "Infrastructure Design",
        content: "The Roam Point charging solution is designed for flexible deployment. Technical specifications include: 6.6 kW DC fast charging capability; high efficiency power electronics; connectivity for remote monitoring and management; and dual charging connectors for operational flexibility.\n\nThe infrastructure is compact and robust, suitable for environmental conditions commonly encountered across African urban environments. Design choices prioritized reliability, ease of installation, and the ability to operate in varied grid and space conditions, supporting deployment across different site types and partner locations."
      },
      {
        heading: "Deployment Models",
        content: "The charging system supports multiple installation configurations to suit different partner sites and use cases.\n\nWall Mounted Chargers: For secure walls within commercial spaces or workshops.\n\nMobile Chargers: Portable units for small businesses or repair workshops where a fixed installation is not suitable.\n\nPole Mounted Chargers: For open parking spaces and curbside locations.\n\nCanopy Charging Stations: For larger installations such as transport hubs or shopping centers.\n\nCharging stations are deployed in high-traffic mobility locations including motorcycle stages, transport hubs, commercial centers, fuel stations, and fleet depots. This variety allows the network to grow in line with rider demand and partner availability."
      },
      {
        heading: "Business Model",
        content: "The project introduces a partnership model that allows landowners and businesses to host charging infrastructure. Partner responsibilities include providing space and basic site support; in return, partners benefit through monthly rental payments, revenue sharing from electricity sales, and increased customer foot traffic.\n\nThis model enables rapid infrastructure expansion while aligning incentives between infrastructure operators and property owners. It also reduces upfront capital requirements for the network operator and creates a clear value proposition for host sites, which was essential for scaling deployment across Nairobi and beyond."
      },
      {
        heading: "Impact",
        content: "The Roam Point project contributes to increased accessibility of EV charging infrastructure, reduced operational barriers for electric motorcycle riders, expansion of electric mobility ecosystems, and new economic opportunities for local businesses.\n\nBy combining product ownership with a partner-led deployment model, the project demonstrates how EV charging networks can scale in emerging markets while supporting clean mobility and local economic activity. Ongoing monitoring of usage, partner satisfaction, and rider feedback informs further optimization and expansion."
      },
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
      {
        heading: "Project Overview",
        content: "The deployment of EV charging infrastructure requires careful site selection to ensure accessibility, demand, and operational viability. This project focused on evaluating potential locations for charging infrastructure using spatial analysis and demand mapping.\n\nThe work combined geographic information systems (GIS), mobility data, and infrastructure constraints to produce a shortlist of sites where charging stations would be both technically feasible and likely to achieve strong utilization. The output supported investment and rollout decisions for the broader charging network."
      },
      {
        heading: "Problem Statement",
        content: "Charging infrastructure must be strategically located to ensure high utilization, accessibility for riders, reliable electricity supply, and operational safety. Poor site selection may result in underutilized infrastructure or operational inefficiencies.\n\nWithout a structured approach to site selection, deployment can be driven by convenience or availability of space rather than demand and grid readiness. This project addressed that gap by applying a consistent, data-driven methodology to compare and rank candidate locations across the Nairobi metropolitan area."
      },
      {
        heading: "Objectives",
        content: "The feasibility study aimed to: identify high-potential locations for charging infrastructure; evaluate energy supply availability; analyze mobility demand patterns; and prioritize locations for deployment.\n\nA further objective was to document the methodology and criteria so that similar analyses could be repeated in other cities or as new data became available. Clear prioritization also helped align stakeholder expectations and focus rollout on the most promising sites first."
      },
      {
        heading: "Methodology",
        content: "Mobility Demand Analysis: Locations with high motorcycle traffic (e.g. stages, transit nodes, commercial corridors) were identified using available mobility and traffic data. This step ensured that candidate sites were aligned with where riders actually operate and park.\n\nInfrastructure Assessment: Potential sites were evaluated based on proximity to electricity infrastructure, land availability, and safety considerations. Only sites that could be connected to the grid and used safely were carried forward.\n\nSpatial Mapping: GIS tools were used to map candidate locations and analyze proximity to transport hubs and commercial centers. Overlays of demand, grid capacity, and land use helped rank and compare options in a consistent way."
      },
      {
        heading: "Results",
        content: "The analysis identified several high-priority zones suitable for charging infrastructure deployment. Key findings included: transport hubs present high charging demand and are natural anchors for the network; commercial centers offer strong partnership opportunities and visibility; and infrastructure clustering in key corridors improves accessibility for riders and supports network effects.\n\nThe resulting site shortlist and supporting maps were used to guide partnership discussions and rollout planning. The same approach can be extended to other regions as the charging network expands."
      },
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
      {
        heading: "Project Overview",
        content: "Post-harvest losses remain a major challenge in agricultural supply chains across developing regions. Limited access to refrigeration results in significant food waste and limits the ability of farmers to reach distant or higher-value markets.\n\nThis project explored the development of a solar-powered cold storage solution designed to extend shelf life for perishable produce. The goal was to demonstrate a technically feasible and economically viable option for smallholder farmers and aggregators who lack reliable grid power, combining solar PV with evaporative cooling to keep produce cool without dependence on the grid or diesel."
      },
      {
        heading: "Problem Statement",
        content: "Farmers often lack access to refrigeration infrastructure, leading to rapid spoilage of fresh produce, reduced farmer incomes, and food supply chain inefficiencies. Where grid power is unavailable or unreliable, conventional cold rooms are not an option.\n\nDiesel-powered cooling is costly and adds emissions; solar-powered alternatives must be appropriately sized, affordable, and easy to operate and maintain. This project addressed these constraints by focusing on a design that could be deployed in off-grid or weak-grid settings and that matched the cooling needs of typical smallholder harvests."
      },
      {
        heading: "Solution",
        content: "The system integrates solar photovoltaic energy with an evaporative cooling system to provide off-grid refrigeration. Solar panels charge a battery bank that powers the cooling unit, while the evaporative component reduces the need for high electrical demand and improves suitability for intermittent solar supply.\n\nThe design allows farmers to store produce immediately after harvest, reducing spoilage and improving market access. Sizing and operation were chosen to align with local climate, crop types, and typical harvest volumes, so that the solution could be replicated in similar contexts with minimal customization."
      },
      {
        heading: "Impact",
        content: "The system demonstrated the ability to extend produce shelf life by several days while operating entirely on renewable energy. Measured outcomes included reduction in post-harvest loss, improved ability to hold produce for better prices, and positive feedback from farmers on usability and reliability.\n\nThis approach supports both agricultural resilience and sustainable energy adoption. It also provides a reference design for solar cold storage in similar agro-climatic conditions and can inform future scaling or adaptation for other crops and regions."
      },
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
    id: "energy-demand-modeling",
    title: "Energy Demand Modeling for Electric Mobility Infrastructure",
    subtitle: "Analyzing charging demand patterns to inform infrastructure planning",
    category: "Data & Analytics",
    location: "Nairobi, Kenya",
    date: "2024-2025",
    image: CASE_STUDY_IMAGES.energyDemand,
    sections: [
      {
        heading: "Project Overview",
        content: "Understanding electricity demand patterns is essential for planning EV charging infrastructure. This project analyzed charging demand for electric motorcycles to support infrastructure planning and energy system design.\n\nThe work aimed to answer questions such as: when and where do riders charge, how much energy do they use per session, and what does that imply for grid capacity and for the sizing of solar or storage at charging sites? The results were used to inform both network rollout and the design of individual sites."
      },
      {
        heading: "Methodology",
        content: "Data from charging stations and rider usage patterns was analyzed to estimate average energy consumption per session, peak charging periods, and infrastructure capacity requirements. Where possible, data was disaggregated by time of day, day of week, and location to identify patterns and outliers.\n\nSimple models were used to project how demand might grow with more riders and more stations, and to test the sensitivity of capacity needs to assumptions about utilization and charging behavior. The methodology was documented so that it could be updated as more data became available."
      },
      {
        heading: "Results",
        content: "The analysis revealed key charging patterns that influence infrastructure planning. Peak charging demand typically occurs during operational downtime periods for riders (e.g. midday or early evening), which has implications for grid peak loads and for the value of solar generation that aligns with those windows.\n\nThese insights help inform infrastructure placement (e.g. where to add capacity first), grid capacity planning (e.g. upgrades or reinforcement needs), and renewable energy integration strategies (e.g. sizing of solar and storage at charging sites). The outputs were shared with technical and commercial teams to support decision-making and with partners where relevant."
      },
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
  const { toast } = useToast();
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [caseStudiesData, setCaseStudiesData] = useState<CaseStudy[]>(caseStudies);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFromSupabase = async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: CaseStudy[] = data.map((cs: Tables<"case_studies">) => ({
          id: cs.slug || cs.id,
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
          sections: Array.isArray(cs.sections) ? (cs.sections as { heading: string; content: string }[]) : [],
          metrics: Array.isArray(cs.metrics)
            ? (cs.metrics as { label: string; value: string; icon_name: string }[]).map(m => ({
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
      // On error or empty, keep hardcoded fallback
    };

    fetchFromSupabase();
  }, []);

  useEffect(() => {
    if (selectedStudy && modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [selectedStudy]);

  const archiveCaseStudy = async (id: string, currentPublished: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("case_studies")
        .update({ published: !currentPublished })
        .eq("id", id);
      if (error) throw error;
      toast({
        title: "Success",
        description: `Case study ${currentPublished ? "archived" : "restored"}`,
      });
      // Refresh
      setCaseStudiesData((prev) =>
        currentPublished ? prev.filter((s) => s.id !== id) : prev
      );
    } catch {
      toast({ title: "Error", description: "Failed to update case study", variant: "destructive" });
    }
  };

  const flagshipStudy = caseStudiesData.find(s => s.isFlagship);
  const otherStudies = caseStudiesData.filter(s => !s.isFlagship);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium mb-4 block">Impact Stories</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Case <span className="gradient-text">Studies</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Engineering documentation of renewable energy and mobility infrastructure projects making measurable impact across Africa.
            </p>
          </motion.div>

          {/* Flagship Case Study */}
          {flagshipStudy && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div
                onClick={() => setSelectedStudy(flagshipStudy)}
                className="group glass-card rounded-2xl overflow-hidden cursor-pointer card-hover border border-amber-500/20"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {flagshipStudy.image && (
                    <div className="relative h-64 md:h-auto md:min-h-[320px]">
                      <img src={flagshipStudy.image} alt={flagshipStudy.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black px-3 py-1.5 rounded-full">
                          <Crown className="w-3 h-3" />
                          Flagship Case Study
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <span className="text-xs text-muted-foreground mb-2">{flagshipStudy.category}</span>
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                      {flagshipStudy.title}
                    </h3>
                    {flagshipStudy.role && (
                      <p className="text-sm text-amber-400/80 font-medium mb-3">{flagshipStudy.role}</p>
                    )}
                    <p className="text-muted-foreground text-sm mb-4">{flagshipStudy.subtitle}</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {flagshipStudy.metrics.slice(0, 4).map((m) => (
                        <div key={m.label} className="bg-black/5 dark:bg-white/5 rounded-lg p-2 text-center">
                          <p className="text-sm font-bold text-primary">{m.value}</p>
                          <p className="text-xs text-muted-foreground">{m.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
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
          <div className="grid md:grid-cols-2 gap-8">
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
                  {study.image ? (
                    <div className="h-48 relative">
                      <img src={study.image} alt={study.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-black/30 to-transparent" />
                      <div className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        <study.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="text-white/80 text-xs font-medium">{study.category}</span>
                        <h3 className="text-lg font-display font-bold text-white">{study.title}</h3>
                      </div>
                    </div>
                  ) : (
                    <div className={`h-48 bg-gradient-to-br ${study.gradient} relative p-6 flex flex-col justify-end`}>
                      <div className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        <study.icon className="w-5 h-5 text-white" />
                      </div>
                      {study.partner && (
                        <span className="text-white/90 text-xs font-medium bg-white/20 px-2 py-1 rounded-full self-start mb-2">
                          Partner: {study.partner}
                        </span>
                      )}
                      <span className="text-white/80 text-xs font-medium">{study.category}</span>
                      <h3 className="text-lg font-display font-bold text-white">{study.title}</h3>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{study.subtitle}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {study.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {study.date}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      {study.metrics.slice(0, 2).map((metric) => (
                        <div key={metric.label} className="bg-black/5 dark:bg-white/5 rounded-lg p-3 text-center">
                          <p className="text-lg font-bold text-primary">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                      Read Case Study <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal: responsive, fits any screen, scrollable body */}
      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            ref={modalScrollRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto min-h-screen"
            onClick={() => setSelectedStudy(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] flex flex-col bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden shadow-2xl my-4 sm:my-8"
            >
              {/* Header: fixed height, no scroll */}
              {selectedStudy.image ? (
                <div className="relative shrink-0">
                  <div className="h-28 sm:h-36">
                    <img
                      src={selectedStudy.image}
                      alt={selectedStudy.title}
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                    />
                  </div>
                  <div className="bg-card px-4 py-3 sm:px-6 sm:py-4 border-b border-border flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br ${selectedStudy.gradient} shrink-0`}>
                        <selectedStudy.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-muted-foreground text-xs sm:text-sm">{selectedStudy.category}</span>
                          {selectedStudy.isFlagship && (
                            <span className="text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black px-2 py-0.5 rounded-full">
                              Flagship
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-xl md:text-2xl font-display font-bold text-foreground mt-0.5 truncate sm:whitespace-normal">{selectedStudy.title}</h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudy(null)}
                      className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white shrink-0 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`h-36 sm:h-40 bg-gradient-to-br ${selectedStudy.gradient} relative p-4 sm:p-6 flex flex-col justify-end shrink-0`}>
                  <button
                    onClick={() => setSelectedStudy(null)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                      <selectedStudy.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <span className="text-white/80 text-xs sm:text-sm">{selectedStudy.category}</span>
                      <h3 className="text-lg sm:text-2xl font-display font-bold text-white">{selectedStudy.title}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Content: scrollable, fits remaining height */}
              <div className="content-body flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 md:p-8 bg-card">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                    {selectedStudy.location}
                  </span>
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                    {selectedStudy.date}
                  </span>
                  {selectedStudy.partner && (
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                      Partner: {selectedStudy.partner}
                    </span>
                  )}
                </div>

                {selectedStudy.role && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm font-medium text-amber-400">{selectedStudy.role}</p>
                  </div>
                )}

                <div className="space-y-5 sm:space-y-6">
                  {selectedStudy.sections.map((section) => (
                    <div key={section.heading}>
                      <h4 className="font-display font-semibold text-base sm:text-lg mb-2 text-primary">{section.heading}</h4>
                      <p className="text-foreground/90 text-sm sm:text-base leading-relaxed whitespace-pre-line">{section.content}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 border-t border-border">
                  {selectedStudy.metrics.map((metric) => (
                    <div key={metric.label} className="bg-black/5 dark:bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                      <metric.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-lg sm:text-2xl font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">{metric.label}</p>
                    </div>
                  ))}
                </div>

                {selectedStudy.pdfDownload && (
                  <div className="mt-5 sm:mt-6 pt-4 border-t border-border">
                    <a
                      href={selectedStudy.pdfDownload}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-xs sm:text-sm"
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
