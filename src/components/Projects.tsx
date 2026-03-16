import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, X, ChevronLeft, ChevronRight, Zap, Sun, Battery, Leaf, BarChart3, Download, MapPin, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { portfolioProjects, type Project as SharedProject } from "../data/portfolioProjects";
import { supabase } from "@/integrations/supabase/client";

interface Project extends Omit<SharedProject, "iconName"> {
  icon: LucideIcon;
}

const iconMap: Record<string, LucideIcon> = {
  Zap, Battery, Sun, Leaf, BarChart3, Globe,
};

// Fallback to hardcoded portfolio projects
const fallbackProjects: Project[] = portfolioProjects.map((p) => ({
  ...p,
  icon: iconMap[p.iconName] ?? Zap,
}));

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data && data.length > 0) {
        // Map database projects to the Project interface
        const mapped: Project[] = data.map((proj: any) => ({
          id: proj.id,
          title: proj.title,
          description: proj.description || "",
          longDescription: proj.description || "",
          category: proj.project_type || "Other",
          tags: [], // Database projects don't have tags in the same format
          gradient: "from-primary/20 to-primary/5",
          icon: Zap, // Default icon for database projects
          link: undefined,
          images: proj.images || [],
          specs: proj.location ? [{ label: "Location", value: proj.location }] : undefined,
          role: undefined,
          pdfDownload: undefined,
          isFounder: false,
          isFlagship: false,
        }));
        // Combine database projects with fallback projects for a complete display
        setProjects([...mapped, ...fallbackProjects].slice(0, 6));
      }
      // On error or empty, keep fallback
    };

    fetchProjects();
  }, []);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentIndex(projects.findIndex(p => p.id === project.id));
  };

  const closeModal = () => setSelectedProject(null);

  const navigate = (direction: "prev" | "next") => {
    const newIndex = direction === "prev"
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

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
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
                    <span className="text-xs font-medium text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full">
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
                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 text-muted-foreground">
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
            className="fixed inset-0 z-50 p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-card rounded-2xl border border-border overflow-hidden my-8 mx-auto"
            >
              {/* Header - image or gradient */}
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <div className="relative h-56">
                  <img
                    src={selectedProject.images[0]}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
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
                      <div key={spec.label} className="bg-black/5 dark:bg-white/5 rounded-lg p-3 text-center">
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
                        className="w-full h-20 object-cover rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                        loading="lazy"
                        decoding="async"
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

                  {/* Navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate("prev")}
                      className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-muted-foreground px-2">
                      {currentIndex + 1} / {projects.length}
                    </span>
                    <button
                      onClick={() => navigate("next")}
                      className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
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
