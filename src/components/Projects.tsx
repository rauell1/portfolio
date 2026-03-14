import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, X, ChevronLeft, ChevronRight, Zap, Sun, Battery, Leaf, BarChart3, Download, MapPin, Crown } from "lucide-react";
import roamCharger1 from "@/assets/roam-charger-1.jpeg";
import roamCharger2 from "@/assets/roam-charger-2.jpeg";
import roamCharger3 from "@/assets/roam-charger-3.jpeg";
import roamCharger4 from "@/assets/roam-charger-4.jpeg";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  role?: string;
  icon: typeof Zap;
  link?: string;
  gradient: string;
  tags: string[];
  isFounder?: boolean;
  isFlagship?: boolean;
  images?: string[];
  specs?: { label: string; value: string }[];
  pdfDownload?: string;
}

const projects: Project[] = [
  {
    id: "roam-point",
    title: "Roam Point EV Charging Network",
    category: "EV Infrastructure",
    description: "Product ownership and deployment of distributed fast charging infrastructure for electric motorcycles across Nairobi.",
    longDescription: "Roam Point is a distributed EV charging infrastructure solution designed to accelerate electric motorcycle adoption across African cities by providing accessible and high-speed charging hubs. The system enables riders to recharge quickly while allowing businesses and landowners to host charging infrastructure and generate revenue through energy sales. The charging network supports Roam electric motorcycles and interoperable electric mobility platforms.",
    role: "Product Owner – Roam Point Charging Infrastructure",
    icon: Zap,
    link: "https://roam-electric.com",
    gradient: "from-amber-500 to-orange-600",
    tags: ["EV Infrastructure", "Clean Mobility", "Charging Networks", "Energy Systems", "Product Ownership"],
    isFlagship: true,
    images: [roamCharger1, roamCharger2, roamCharger3, roamCharger4],
    specs: [
      { label: "Output", value: "6.6 kW DC" },
      { label: "Efficiency", value: "94%" },
      { label: "Connectivity", value: "4G & WiFi" },
      { label: "Range/min", value: "2–3 km" },
    ],
    pdfDownload: "/Roam_Point_Partnership_Opportunity.pdf",
  },
  {
    id: "safaricharge",
    title: "SafariCharge Ltd",
    category: "E-Mobility",
    description: "Building smart EV charging hubs powered by solar microgrids and second-life batteries.",
    longDescription: "Piloted 2 sites and partnered with local malls for deployment. The project integrates solar PV, EV chargers, and repurposed EV batteries to create sustainable charging infrastructure.",
    icon: Zap,
    link: "https://safaricharge.com",
    gradient: "from-blue-500 to-cyan-400",
    tags: ["Solar", "EV Charging", "Battery Storage"],
    isFounder: true,
  },
  {
    id: "ev-hubs",
    title: "EV Charging Hub Expansion",
    category: "Infrastructure",
    description: "Contributed to feasibility studies and proposed 10+ hub sites across Nairobi.",
    longDescription: "Collaborated with Roam Electric & EVChaja to identify optimal locations for EV charging infrastructure, integrating solar power and second-life batteries to support Nairobi's growing e-mobility ecosystem.",
    icon: Battery,
    gradient: "from-purple-500 to-pink-500",
    tags: ["Feasibility Studies", "Site Planning", "E-Mobility"],
  },
  {
    id: "solar-cooling",
    title: "Solar-Powered Cooling System",
    category: "AgriTech",
    description: "Designed an evaporative cooling unit extending tomato shelf life by 7 days.",
    longDescription: "Engineered a solar-powered evaporative cooling system (ECS) for off-grid areas, addressing post-harvest losses and improving incomes for smallholder farmers.",
    icon: Sun,
    gradient: "from-orange-500 to-yellow-400",
    tags: ["Solar PV", "Cold Chain", "Post-Harvest"],
  },
  {
    id: "borehole-irrigation",
    title: "Solarized Borehole Irrigation",
    category: "AgriTech",
    description: "Engineered off-grid solar pumping systems for smallholder farmers.",
    longDescription: "Implemented 10+ pilot installations in semi-arid regions, reducing reliance on diesel generators and enhancing climate-smart agriculture practices.",
    icon: Sun,
    gradient: "from-green-500 to-emerald-400",
    tags: ["Solar Pumping", "Irrigation", "Off-Grid"],
  },
  {
    id: "biogas",
    title: "Biogas for Circular Economy",
    category: "Renewable Energy",
    description: "Coordinated rural biogas installations reducing biomass dependence.",
    longDescription: "Partnered with schools and communities to install biogas digesters that produce clean cooking gas and organic fertilizer from organic waste, supporting regenerative farming.",
    icon: Leaf,
    gradient: "from-teal-500 to-green-400",
    tags: ["Biogas", "Circular Economy", "Rural Development"],
  },
  {
    id: "data-analytics",
    title: "Sustainable Mobility Analytics",
    category: "Data & Analytics",
    description: "Data-driven insights for sustainable transport and energy systems.",
    longDescription: "Applied data analysis techniques to optimize energy consumption, track system performance, and generate actionable insights for sustainable mobility projects.",
    icon: BarChart3,
    gradient: "from-indigo-500 to-blue-400",
    tags: ["Data Analysis", "Mobility", "Performance Tracking"],
  },
];

const flagship = projects[0];
const otherProjects = projects.slice(1);

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentIndex(projects.findIndex(p => p.id === project.id));
    setActiveImage(0);
  };

  const closeModal = () => setSelectedProject(null);

  const navigate = (direction: "prev" | "next") => {
    const newIndex = direction === "prev"
      ? (currentIndex - 1 + projects.length) % projects.length
      : (currentIndex + 1) % projects.length;
    setCurrentIndex(newIndex);
    setSelectedProject(projects[newIndex]);
    setActiveImage(0);
  };

  return (
    <section id="work" className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Innovative solutions powering Africa's sustainable future through clean energy and e-mobility.
          </p>
        </motion.div>

        {/* Flagship Project */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          onClick={() => openModal(flagship)}
          className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer card-hover mb-10 border border-amber-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5" />
          <div className="relative z-10 grid md:grid-cols-2 gap-0">
            {/* Image gallery */}
            <div className="relative h-64 md:h-auto md:min-h-[360px] overflow-hidden">
              <img
                src={flagship.images?.[activeImage] || roamCharger1}
                alt="Roam Point EV Charger"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Image dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {flagship.images?.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeImage ? "bg-white w-6" : "bg-white/50"}`}
                  />
                ))}
              </div>
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black px-3 py-1.5 rounded-full">
                  <Crown className="w-3 h-3" />
                  Flagship Project
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <span className="text-xs font-medium text-muted-foreground bg-white/5 px-3 py-1 rounded-full self-start mb-3">
                {flagship.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                {flagship.title}
              </h3>
              <p className="text-sm text-amber-400/80 font-medium mb-3">{flagship.role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {flagship.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {flagship.specs?.map((spec) => (
                  <div key={spec.label} className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-primary">{spec.value}</p>
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {flagship.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-md bg-amber-500/10 text-amber-400/80 border border-amber-500/20">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {flagship.pdfDownload && (
                  <a
                    href={flagship.pdfDownload}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-xs px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Partnership Deck
                  </a>
                )}
                {flagship.link && (
                  <a
                    href={flagship.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-xs px-4 py-2 bg-white/5 rounded-lg font-medium hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Roam Electric
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => openModal(project)}
              className="group relative glass-card rounded-2xl p-6 cursor-pointer card-hover overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
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
                    <span className="text-xs font-medium text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors flex items-center gap-2">
                  {project.title}
                  {project.link && <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-white/5 text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-card rounded-2xl border border-white/10 overflow-hidden my-8"
            >
              {/* Header - image or gradient */}
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <div className="relative h-56">
                  <img
                    src={selectedProject.images[0]}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
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
                        <h3 className="text-2xl font-display font-bold text-white">{selectedProject.title}</h3>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <div className={`h-32 bg-gradient-to-br ${selectedProject.gradient} relative`}>
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
                        <h3 className="text-2xl font-display font-bold text-white">{selectedProject.title}</h3>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {selectedProject.role && (
                  <p className="text-sm text-amber-400/80 font-medium mb-3">{selectedProject.role}</p>
                )}

                <p className="text-muted-foreground leading-relaxed mb-4">
                  {selectedProject.longDescription || selectedProject.description}
                </p>

                {/* Specs */}
                {selectedProject.specs && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {selectedProject.specs.map((spec) => (
                      <div key={spec.label} className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-primary">{spec.value}</p>
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Image gallery in modal */}
                {selectedProject.images && selectedProject.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {selectedProject.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${selectedProject.title} ${i + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-white/10 hover:border-primary/50 transition-colors cursor-pointer"
                      />
                    ))}
                  </div>
                )}

                {/* Tags */}
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

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
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
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg font-medium hover:bg-white/10 transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Project
                      </a>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate("prev")}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-muted-foreground px-2">
                      {currentIndex + 1} / {projects.length}
                    </span>
                    <button
                      onClick={() => navigate("next")}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
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
