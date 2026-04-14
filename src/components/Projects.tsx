import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ExternalLink, X, ChevronLeft, ChevronRight,
  Zap, Sun, Battery, Leaf, BarChart3, Globe,
  Download, TrendingUp, Users, Thermometer, Crown,
  MapPin, Calendar, ArrowRight, Layers, BarChart2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { portfolioProjects, type Project as SharedProject } from "../data/portfolioProjects";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project extends Omit<SharedProject, "iconName"> {
  icon: LucideIcon;
}

interface ImpactMetric { label: string; value: string; icon: LucideIcon }
interface ImpactStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  date: string;
  gradient: string;
  icon: LucideIcon;
  isFlagship?: boolean;
  metrics: ImpactMetric[];
}

// ─── Icon maps ────────────────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = { Zap, Battery, Sun, Leaf, BarChart3, Globe };
const ICON_MAP: Record<string, LucideIcon> = {
  Sun, Battery, Zap, Leaf, TrendingUp, Users, MapPin, Calendar, BarChart3, Thermometer,
};
const resolveIcon = (name: string): LucideIcon => ICON_MAP[name] ?? Zap;

// ─── Fallback data ────────────────────────────────────────────────────────────
const fallbackProjects: Project[] = portfolioProjects.map((p) => ({
  ...p,
  icon: iconMap[p.iconName] ?? Zap,
}));

// Impact studies are the 3 projects with quantified outcomes — distinct from project cards
const fallbackImpact: ImpactStudy[] = [
  {
    id: "solar-microgrid-ev",
    title: "Solar Microgrid for EV Charging",
    subtitle: "Renewable energy integration for sustainable charging operations at SafariCharge pilot sites.",
    category: "E-Mobility Infrastructure",
    location: "Nairobi, Kenya",
    date: "2024–2026",
    gradient: "from-blue-500 to-cyan-400",
    icon: Zap,
    isFlagship: true,
    metrics: [
      { label: "Solar Capacity", value: "50 kW", icon: Sun },
      { label: "CO₂ Saved/Year", value: "45 tons", icon: Leaf },
      { label: "Pilot Sites", value: "2", icon: MapPin },
      { label: "Peak Efficiency", value: "94%", icon: TrendingUp },
    ],
  },
  {
    id: "evchaja-strategy",
    title: "EVChaja Hub Expansion Strategy",
    subtitle: "Market intelligence and stakeholder engagement that attracted KES 50M+ in potential investment.",
    category: "EV Infrastructure",
    location: "Nairobi, Kenya",
    date: "Jan–Jun 2025",
    gradient: "from-amber-500 to-orange-600",
    icon: Battery,
    metrics: [
      { label: "Investment Attracted", value: "KES 50M+", icon: TrendingUp },
      { label: "Investment-Ready Projects", value: "3", icon: BarChart3 },
      { label: "Regulators Engaged", value: "EPRA, EMAK", icon: Users },
      { label: "Charging Hubs Planned", value: "5+", icon: Zap },
    ],
  },
  {
    id: "solar-cold-storage",
    title: "Solar-Powered Cold Storage",
    subtitle: "Off-grid evaporative cooling system reducing post-harvest losses for smallholder farmers.",
    category: "AgriTech Solutions",
    location: "Machakos County, Kenya",
    date: "2023",
    gradient: "from-orange-500 to-yellow-400",
    icon: Sun,
    metrics: [
      { label: "Shelf Life Extended", value: "+7 days", icon: Thermometer },
      { label: "Farmers Benefited", value: "50+", icon: Users },
      { label: "Energy Source", value: "100% Solar", icon: Sun },
      { label: "Post-Harvest Loss ↓", value: "~40%", icon: TrendingUp },
    ],
  },
];

// ─── Tab button ───────────────────────────────────────────────────────────────
const TabBtn = ({
  active, onClick, icon: Icon, label,
}: { active: boolean; onClick: () => void; icon: LucideIcon; label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
      active
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
        : "bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────
export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<"projects" | "impact">("projects");
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [impact, setImpact] = useState<ImpactStudy[]>(fallbackImpact);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch projects from DB
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const mapped: Project[] = data
            .map((proj) => ({
              id: proj.id,
              title: proj.title,
              description: proj.description || "",
              longDescription: proj.description || "",
              category: proj.project_type || "Other",
              tags: [],
              gradient: "from-primary/20 to-primary/5",
              icon: Zap,
              link: undefined,
              images: proj.images || [],
              specs: proj.location ? [{ label: "Location", value: proj.location }] : undefined,
              role: undefined,
              pdfDownload: undefined,
              isFounder: false,
              isFlagship: false,
            }))
            .filter(
              (p) =>
                p.id !== "roam-energy-page" &&
                p.title !== "Roam Energy Marketing Site"
            );
          setProjects([...mapped, ...fallbackProjects].slice(0, 6));
        }
      });
  }, []);

  // Fetch case studies from DB
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("case_studies")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(3)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const mapped: ImpactStudy[] = data.map((cs) => ({
            id: cs.slug || cs.id,
            title: cs.title,
            subtitle: cs.subtitle || "",
            category: cs.category,
            location: cs.location || "",
            date: cs.date || "",
            isFlagship: cs.is_flagship,
            gradient: cs.gradient || "from-blue-500 to-cyan-400",
            icon: resolveIcon(cs.icon_name || "Zap"),
            metrics: Array.isArray(cs.metrics)
              ? (cs.metrics as { label: string; value: string; icon_name: string }[])
                  .slice(0, 4)
                  .map((m) => ({
                    label: m.label,
                    value: m.value,
                    icon: resolveIcon(m.icon_name || "TrendingUp"),
                  }))
              : [],
          }));
          setImpact(mapped);
        }
      });
  }, []);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentIndex(projects.findIndex((p) => p.id === project.id));
  };
  const closeModal = () => setSelectedProject(null);
  const navigate = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + projects.length) % projects.length
        : (currentIndex + 1) % projects.length;
    setCurrentIndex(newIndex);
    setSelectedProject(projects[newIndex]);
  };

  return (
    <section id="work" className="py-16 sm:py-24 lg:py-32 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-primary font-medium mb-4 block">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Work &amp; <span className="gradient-text">Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Innovative clean energy solutions and the measurable outcomes they created across East Africa.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center gap-3 mb-12"
        >
          <TabBtn
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
            icon={Layers}
            label="Projects"
          />
          <TabBtn
            active={activeTab === "impact"}
            onClick={() => setActiveTab("impact")}
            icon={BarChart2}
            label="Impact"
          />
        </motion.div>

        {/* ── PROJECTS TAB ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    onClick={() => openModal(project)}
                    className="group relative glass-card rounded-2xl p-6 cursor-pointer card-hover overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                    />
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${project.gradient}`}>
                          <project.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          {project.isFounder && (
                            <span className="text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-2 py-1 rounded-full animate-pulse">
                              Founder
                            </span>
                          )}
                          <span className="text-xs font-medium text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full">
                            {project.category}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors flex items-center gap-2">
                        {project.title}
                        {project.link && (
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── IMPACT TAB ───────────────────────────────────────────────────── */}
          {activeTab === "impact" && (
            <motion.div
              key="impact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {impact.map((study, index) => (
                  <motion.div
                    key={study.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                    className="group"
                  >
                    <div
                      className={`glass-card rounded-2xl overflow-hidden h-full flex flex-col card-hover ${
                        study.isFlagship ? "border border-amber-500/20" : ""
                      }`}
                    >
                      {/* Gradient header */}
                      <div
                        className={`h-36 bg-gradient-to-br ${study.gradient} relative p-6 flex flex-col justify-end`}
                      >
                        <div className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                          <study.icon className="w-5 h-5 text-white" />
                        </div>
                        {study.isFlagship && (
                          <span className="absolute top-4 left-4 inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black px-2 py-1 rounded-full">
                            <Crown className="w-3 h-3" />
                            Flagship
                          </span>
                        )}
                        <span className="text-white/80 text-xs font-medium">{study.category}</span>
                        <h3 className="text-xl font-display font-bold text-white">{study.title}</h3>
                      </div>

                      {/* Body */}
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {study.subtitle}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {study.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {study.date}
                          </span>
                        </div>

                        {/* Metrics 2×2 grid */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          {study.metrics.slice(0, 4).map((metric) => (
                            <div
                              key={metric.label}
                              className="bg-black/5 dark:bg-white/5 rounded-lg p-3 text-center"
                            >
                              <p className="text-lg font-bold text-primary">{metric.value}</p>
                              <p className="text-xs text-muted-foreground">{metric.label}</p>
                            </div>
                          ))}
                        </div>

                        <Link
                          to="/case-studies"
                          className="mt-5 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all"
                        >
                          Full Case Study <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="text-center mt-10"
              >
                <Link
                  to="/case-studies"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  View All Case Studies <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PROJECT MODAL ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto min-h-screen"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-2xl my-4 sm:my-8"
            >
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <div className="relative h-56 shrink-0">
                  <img
                    src={selectedProject.images[0]}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={672}
                    height={224}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedProject.gradient}`}>
                        <selectedProject.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white/70 text-sm">{selectedProject.category}</p>
                          {selectedProject.isFlagship && (
                            <span className="text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black px-2 py-0.5 rounded-full">
                              Flagship
                            </span>
                          )}
                          {selectedProject.isFounder && (
                            <span className="text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-2 py-0.5 rounded-full">
                              Founder
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white">
                          {selectedProject.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    aria-label="Close modal"
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <div className={`h-32 bg-gradient-to-br ${selectedProject.gradient} relative shrink-0`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                        <selectedProject.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white/70 text-sm">{selectedProject.category}</p>
                          {selectedProject.isFounder && (
                            <span className="text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-2 py-0.5 rounded-full">
                              Founder
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white">
                          {selectedProject.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    aria-label="Close modal"
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-6">
                  {selectedProject.role && (
                    <p className="text-sm text-amber-400/80 font-medium mb-3">{selectedProject.role}</p>
                  )}
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {selectedProject.longDescription || selectedProject.description}
                  </p>

                  {selectedProject.specs && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {selectedProject.specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="bg-black/5 dark:bg-white/5 rounded-lg p-3 text-center"
                        >
                          <p className="text-lg font-bold text-primary">{spec.value}</p>
                          <p className="text-xs text-muted-foreground">{spec.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedProject.images && selectedProject.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {selectedProject.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${selectedProject.title} ${i + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                          loading="lazy"
                          decoding="async"
                          width={160}
                          height={80}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      {selectedProject.pdfDownload && (
                        <a
                          href={selectedProject.pdfDownload}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Partnership Deck
                        </a>
                      )}
                      {selectedProject.link && (
                        <a
                          href={selectedProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-lg font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit Project
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate("prev")}
                        aria-label="Previous project"
                        className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-muted-foreground px-2">
                        {currentIndex + 1} / {projects.length}
                      </span>
                      <button
                        onClick={() => navigate("next")}
                        aria-label="Next project"
                        className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
