import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Image, Calendar, MapPin,
  Loader2, ExternalLink, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Project {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  project_type: string;
  images: string[] | null;
  completed_at: string | null;
  created_at: string;
  slug?: string | null;
}

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

// ─── Fallback static project cards (shown only when not yet in DB) ────────────
const ROAM_POINT_PROJECT: Project = {
  id: "roam-point",
  slug: "roam-point",
  title: "Roam Point EV Charging Infrastructure",
  description:
    "Distributed fast-charging infrastructure designed to accelerate electric motorcycle adoption across African cities by providing accessible, high-speed charging hubs.",
  location: "Nairobi, Kenya",
  project_type: "ev",
  images: [
    "/images/roam-electric.webp",
    "/images/roam-charger-1.jpeg",
    "/images/roam-charger-2.jpeg",
    "/images/roam-charger-3.jpeg",
    "/images/roam-charger-4.jpeg",
  ],
  completed_at: null,
  created_at: "",
};

const SAFARICHARGE_PROJECT: Project = {
  id: "safaricharge-platform",
  slug: "safaricharge-platform",
  title: "SafariCharge Platform Development",
  description:
    "End-to-end platform work on SafariCharge — clean mobility product architecture, web experience, and operational tooling for EV charging deployment workflows.",
  location: "Nairobi, Kenya",
  project_type: "ev",
  images: ["/images/og-image.png"],
  completed_at: null,
  created_at: "",
};

// ─── Deep-link map: slug → { repo } ─────────────────────────────────────────
// Add any project slug here to wire up external repository links.
const PROJECT_DEEP_LINKS: Record<
  string,
  { repo?: string }
> = {
  "safaricharge-platform": {
    repo: "https://github.com/rauell1/safaricharge",
  },
};

const projectTypes = [
  { value: "solar", label: "Solar Installation" },
  { value: "ev", label: "EV Charging" },
  { value: "microgrid", label: "Microgrid" },
  { value: "biogas", label: "Biogas" },
  { value: "storage", label: "Energy Storage" },
  { value: "other", label: "Other" },
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects((data as Project[]) || []);
    } catch (error: unknown) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getProjectTypeLabel = (type: string) =>
    projectTypes.find((t) => t.value === type)?.label || type;

  const getProjectLinks = (p: Project) =>
    PROJECT_DEEP_LINKS[p.slug || p.id || ""];

  const hasRoamPointInDB = projects.some((p) => p.slug === "roam-point");
  const hasSafariChargeInDB = projects.some((p) => p.slug === "safaricharge-platform");
  const displayProjects = [
    ...(hasRoamPointInDB ? [] : [ROAM_POINT_PROJECT]),
    ...(hasSafariChargeInDB ? [] : [SAFARICHARGE_PROJECT]),
    ...projects,
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
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
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12"
          >
            <div>
              <span className="text-primary font-medium mb-2 block">My Work</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                Project <span className="gradient-text">Portfolio</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A showcase of renewable energy installations and sustainable projects I've worked on.
              </p>
            </div>
          </motion.div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map((project, index) => {
                const links = getProjectLinks(project);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="glass-card rounded-2xl overflow-hidden card-hover h-full flex flex-col">
                      {/* Image */}
                      <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center aspect-[4/3] w-full">
                        {project.images && project.images.length > 0 ? (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="text-center">
                            <Image className="w-12 h-12 text-primary/40 mx-auto mb-2" />
                            <span className="text-xs text-muted-foreground">No images yet</span>
                          </div>
                        )}

                        {/* Type badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/80 text-white font-medium">
                            {getProjectTypeLabel(project.project_type)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-display font-bold mb-2">{project.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                          {project.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          {project.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {project.location}
                            </span>
                          )}
                          {project.completed_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(project.completed_at).getFullYear()}
                            </span>
                          )}
                        </div>

                        {/* CTA row */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                          >
                            View Details
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          {links?.repo && (
                            <a
                              href={links.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                            >
                              Repo
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {displayProjects.length === 0 && !loading && (
            <div className="text-center py-20">
              <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Projects will appear here once added.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ── Lightweight detail modal (only for projects WITHOUT a case study link) ── */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-4 text-sm">
                  {selectedProject.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedProject.location}
                    </span>
                  )}
                  {selectedProject.completed_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedProject.completed_at).toLocaleDateString()}
                    </span>
                  )}
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary font-medium">
                    {getProjectTypeLabel(selectedProject.project_type)}
                  </span>
                </DialogDescription>
              </DialogHeader>

              {selectedProject.images && selectedProject.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                  {selectedProject.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${selectedProject.title} — image ${i + 1}`}
                      className="w-full h-64 object-cover object-center rounded-xl"
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center my-4">
                  <div className="text-center">
                    <Image className="w-16 h-16 text-primary/40 mx-auto mb-2" />
                    <span className="text-muted-foreground">No project images yet</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="font-display font-semibold text-lg mb-2 text-primary">
                    About This Project
                  </h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Projects;
