import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sun, Battery, Zap, Leaf, TrendingUp, Users,
  MapPin, Calendar, X, ChevronRight, BarChart3,
  Droplets, Thermometer, ArrowLeft, Wifi, Shield,
  Download, Crown, Map
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import roamCharger1 from "@/assets/roam-charger-1.jpeg";
import roamCharger3 from "@/assets/roam-charger-3.jpeg";
import roamCharger4 from "@/assets/roam-charger-4.jpeg";

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
    date: "2024–2026",
    partner: "Roam Electric",
    image: roamCharger3,
    sections: [
      {
        heading: "Project Overview",
        content: "This project explores the integration of a solar photovoltaic microgrid with EV charging infrastructure to reduce reliance on grid electricity, lower operational costs, and reduce carbon emissions. The goal was to design a system capable of supporting electric motorcycle charging operations using solar power while maintaining grid connectivity as a backup energy source."
      },
      {
        heading: "Problem Statement",
        content: "Electric motorcycle adoption in East Africa is growing rapidly, but charging infrastructure introduces challenges: increased electricity demand, high operational costs from grid-only dependence, limited renewable energy integration, and potential grid instability in weak electrical infrastructure areas."
      },
      {
        heading: "Methodology",
        content: "The study followed a structured engineering approach: charging demand analysis (daily consumption, peak hours, charger capacity), solar resource assessment (irradiation data, seasonal variability, performance ratios), PV system design (array capacity, inverter sizing, energy output simulations), and grid integration as a hybrid backup system."
      },
      {
        heading: "Results & Impact",
        content: "The integration demonstrated reduced grid electricity consumption, lower operating costs, increased resilience during outages, and significant CO₂ reduction. Solar integrated charging systems can be replicated across urban mobility hubs, supporting distributed infrastructure deployment."
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
    date: "2025–Present",
    role: "Product Owner – Roam Point Charging Infrastructure",
    isFlagship: true,
    partner: "Roam Electric",
    image: roamCharger1,
    pdfDownload: "/Roam_Point_Partnership_Opportunity.pdf",
    sections: [
      {
        heading: "Project Overview",
        content: "Roam Point is a distributed EV charging infrastructure designed to support the growing adoption of electric motorcycles across African cities. The project focuses on developing accessible charging infrastructure that allows riders to recharge quickly while enabling businesses and landowners to host charging stations and generate revenue."
      },
      {
        heading: "My Role",
        content: "As Product Owner, responsibilities include leading deployment strategy for distributed EV charging infrastructure, identifying and securing charging site partnerships, conducting site feasibility assessments, managing stakeholder collaboration with property owners and businesses, and supporting infrastructure rollout and commercialization."
      },
      {
        heading: "Technical Solution",
        content: "Roam Point is a compact DC fast charging unit: 6.6 kW DC fast charging output, 94% peak efficiency, 4G and WiFi connectivity for remote monitoring, dual Type 6 charging cables (IEC 62196-6), over-voltage and surge protection, and OTA firmware updates. Riders gain 2–3 km of range per minute of charging."
      },
      {
        heading: "Deployment Models",
        content: "The system supports Wall Mount (secure locations), Mobile Mount (portable for small businesses), Pole Mount (curbside/open parking), and Canopy Charging Stations (malls, transport hubs). With a compact 2m × 2m footprint, it deploys across motorcycle stages, transport hubs, commercial centers, fleet depots, and public parking areas."
      },
      {
        heading: "Business Model",
        content: "Partners receive KES 1 per kWh sold and KES 5,000 monthly rent per charger, plus increased foot traffic and visibility. This model enables rapid expansion while aligning incentives between operators and property owners."
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
    subtitle: "Data-driven site selection for charging infrastructure deployment",
    category: "Data & Analytics",
    location: "Nairobi Metropolitan Area",
    date: "2024–2025",
    image: roamCharger4,
    sections: [
      {
        heading: "Project Overview",
        content: "Deployment of EV charging infrastructure requires careful site selection to ensure accessibility, demand, and operational viability. This project focused on evaluating potential locations using spatial analysis and demand mapping."
      },
      {
        heading: "Methodology",
        content: "Mobility demand analysis identified high motorcycle traffic locations. Infrastructure assessment evaluated proximity to electricity, land availability, and safety. GIS tools mapped candidate locations and analyzed proximity to transport hubs and commercial centers."
      },
      {
        heading: "Results",
        content: "The analysis identified high-priority zones for deployment. Transport hubs present high charging demand, commercial centers offer strong partnership opportunities, and infrastructure clustering improves accessibility for riders across the network."
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
    sections: [
      {
        heading: "Project Overview",
        content: "Post-harvest losses remain a major challenge in agricultural supply chains across developing regions. This project explored the development of a solar-powered cold storage solution designed to extend shelf life for perishable produce."
      },
      {
        heading: "Problem Statement",
        content: "Farmers often lack access to refrigeration infrastructure, leading to rapid spoilage of fresh produce, reduced farmer incomes, and food supply chain inefficiencies."
      },
      {
        heading: "Solution",
        content: "The system integrates solar photovoltaic energy with an evaporative cooling system to provide off-grid refrigeration. The design allows farmers to store produce immediately after harvest, reducing spoilage and improving market access."
      },
      {
        heading: "Impact",
        content: "The system extended produce shelf life by 7+ days while operating entirely on renewable energy. This supports both agricultural resilience and sustainable energy adoption, increasing farmer incomes by approximately $2,000/year."
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
    date: "2024–2025",
    sections: [
      {
        heading: "Project Overview",
        content: "Understanding electricity demand patterns is essential for planning EV charging infrastructure. This project analyzed charging demand for electric motorcycles to support infrastructure planning and energy system design."
      },
      {
        heading: "Methodology",
        content: "Data from charging stations and rider usage patterns was analyzed to estimate average energy consumption, peak charging periods, and infrastructure capacity requirements."
      },
      {
        heading: "Results",
        content: "The analysis revealed key charging patterns that influence infrastructure planning. Peak charging demand typically occurs during operational downtime periods for riders. These insights help inform infrastructure placement, grid capacity planning, and renewable energy integration strategies."
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
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  const flagshipStudy = caseStudies.find(s => s.isFlagship);
  const otherStudies = caseStudies.filter(s => !s.isFlagship);

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
                      <img src={flagshipStudy.image} alt={flagshipStudy.title} className="w-full h-full object-cover" />
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
                        <div key={m.label} className="bg-white/5 rounded-lg p-2 text-center">
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
                      <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
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
                        <div key={metric.label} className="bg-white/5 rounded-lg p-3 text-center">
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

      {/* Modal */}
      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedStudy(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-card rounded-2xl border border-white/10 overflow-hidden my-8"
            >
              {/* Header */}
              {selectedStudy.image ? (
                <div className="relative h-56">
                  <img src={selectedStudy.image} alt={selectedStudy.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent" />
                  <button
                    onClick={() => setSelectedStudy(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute bottom-4 left-6 flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedStudy.gradient}`}>
                      <selectedStudy.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/80 text-sm">{selectedStudy.category}</span>
                        {selectedStudy.isFlagship && (
                          <span className="text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black px-2 py-0.5 rounded-full">
                            Flagship
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-white">{selectedStudy.title}</h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`h-48 bg-gradient-to-br ${selectedStudy.gradient} relative p-6 flex flex-col justify-end`}>
                  <button
                    onClick={() => setSelectedStudy(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                      <selectedStudy.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <span className="text-white/80 text-sm">{selectedStudy.category}</span>
                      <h3 className="text-2xl font-display font-bold text-white">{selectedStudy.title}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedStudy.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {selectedStudy.date}
                  </span>
                  {selectedStudy.partner && (
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Partner: {selectedStudy.partner}
                    </span>
                  )}
                </div>

                {selectedStudy.role && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-amber-400">{selectedStudy.role}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {selectedStudy.sections.map((section) => (
                    <div key={section.heading}>
                      <h4 className="font-display font-semibold text-lg mb-2 text-primary">{section.heading}</h4>
                      <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                  {selectedStudy.metrics.map((metric) => (
                    <div key={metric.label} className="bg-white/5 rounded-xl p-4 text-center">
                      <metric.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                    </div>
                  ))}
                </div>

                {/* Download */}
                {selectedStudy.pdfDownload && (
                  <div className="mt-6 pt-4 border-t border-white/10">
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
