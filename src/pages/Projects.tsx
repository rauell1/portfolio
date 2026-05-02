import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  ArrowUpRight,
  X,
  CheckCircle2,
  Clock,
  Zap,
  Sun,
  Battery,
  Leaf,
  Globe,
  FileText,
  Music,
  Users,
  LayoutDashboard,
  Thermometer,
  Droplets,
  ImageOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { portfolioProjects, sectors, type Project } from "@/data/portfolioProjects";

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Sun,
  Battery,
  Leaf,
  Globe,
  FileText,
  Music,
  Users,
  LayoutDashboard,
  Thermometer,
  Droplets,
};

const StatusBadge = ({ status }: { status?: Project["status"] }) => {
  if (!status) return null;
  const map = {
    live: { label: "Live", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
    "in-progress": { label: "In Progress", cls: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
    completed: { label: "Completed", cls: "bg-sky-500/15 text-sky-400 border-sky-500/25" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {status === "live" && <CheckCircle2 className="w-3 h-3" />}
      {status === "in-progress" && <Clock className="w-3 h-3" />}
      {label}
    </span>
  );
};

/** Project image with graceful fallback gradient */
const ProjectImage = ({
  src,
  alt,
  gradient,
  className = "",
}: {
  src?: string;
  alt: string;
  gradient: string;
  className?: string;
}) => {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={`bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}
        aria-label={alt}
      >
        <ImageOff className="w-8 h-8 text-white/30" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={800}
      height={400}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

const ProjectCard = ({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: (p: Project) => void;
}) => {
  const Icon = iconMap[project.iconName] ?? Zap;
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col h-full"
    >
      <div
        className="glass-card rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all duration-300"
        onClick={() => onClick(project)}
      >
        {/* Project image / gradient banner */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <ProjectImage
            src={project.image}
            alt={`${project.title} preview`}
            gradient={project.gradient}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay so icon + badges stay readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Icon badge - bottom-left */}
          <div className={`absolute bottom-3 left-4 w-9 h-9 rounded-xl bg-gradient-to-br ${project.gradient} shadow-lg flex items-center justify-center`}>
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>

          {/* Status badge - top-right */}
          <div className="absolute top-3 right-3">
            <StatusBadge status={project.status} />
          </div>

          {/* Flagship ribbon - top-left */}
          {project.isFlagship && (
            <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              Flagship
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-5">
          <div className="mb-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {project.category}
            </span>
          </div>
          <h3 className="text-base font-display font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-md bg-primary/8 text-primary/80 border border-primary/10"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">
                +{project.tags.length - 4}
              </span>
            )}
          </div>

          {/* Footer links */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/50">
            <button
              onClick={(e) => { e.stopPropagation(); onClick(project); }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View Details
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 ml-auto">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  title="Live site"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  title="GitHub repo"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const ProjectModal = ({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) => {
  const Icon = iconMap[project.iconName] ?? Zap;
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal image hero */}
          <div className="relative h-52 overflow-hidden rounded-t-2xl flex-shrink-0">
            <ProjectImage
              src={project.image}
              alt={`${project.title} hero image`}
              gradient={project.gradient}
            />
            {/* Dark overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

            {/* Header content over image */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${project.gradient} shadow-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-0.5">
                      {project.category}
                    </p>
                    <h2 className="text-xl font-display font-bold text-white leading-tight">{project.title}</h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <StatusBadge status={project.status} />
                {project.isFounder && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/25">
                    Founder
                  </span>
                )}
                {project.isFlagship && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/25">
                    Flagship
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Modal body */}
          <div className="p-6 space-y-6">
            {/* Role */}
            {project.role && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium text-foreground">{project.role}</span>
              </div>
            )}

            {/* Long description */}
            <div>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                About This Project
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {/* Specs */}
            {project.specs && project.specs.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  Key Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {project.specs.map((s) => (
                    <div key={s.label} className="bg-muted/40 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
                      <p className="text-sm font-semibold text-foreground">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                Technologies & Domains
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/15 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  View Live Site
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <Github className="w-4 h-4" />
                  View Repository
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Projects = () => {
  const [activeSector, setActiveSector] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered =
    activeSector === "all"
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.sector === activeSector);

  const sectorCounts = sectors.map((s) => ({
    ...s,
    count:
      s.value === "all"
        ? portfolioProjects.length
        : portfolioProjects.filter((p) => p.sector === s.value).length,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-12"
          >
            <span className="text-primary font-medium text-sm mb-2 block tracking-wide uppercase">My Work</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Project{" "}
              <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              A curated collection of software, infrastructure, and systems work spanning clean energy, environmental impact, AI tools, and digital products.
            </p>
          </motion.div>

          {/* Sector filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {sectorCounts.map((s) => (
              <button
                key={s.value}
                onClick={() => setActiveSector(s.value)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSector === s.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {s.label}
                <span
                  className={`text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold ${
                    activeSector === s.value ? "bg-white/20" : "bg-background"
                  }`}
                >
                  {s.count}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div
            key={activeSector}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={setSelectedProject}
              />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No projects in this category yet.
            </div>
          )}
        </div>
      </main>

      {/* Detail modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Projects;
