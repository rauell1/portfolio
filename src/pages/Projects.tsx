import { useState, useMemo } from "react";
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
  Search,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { type Project } from "@/data/portfolioProjects";
import { useProjects } from "@/hooks/use-projects";

const iconMap: Record<string, React.ElementType> = {
  Zap, Sun, Battery, Leaf, Globe, FileText, Music, Users, LayoutDashboard, Thermometer, Droplets,
};

/* ── Status badge ──────────────────────────────────────────────────── */
const StatusBadge = ({ status }: { status?: Project["status"] }) => {
  if (!status) return null;
  const map = {
    live:          { label: "Live",        cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
    "in-progress": { label: "In Progress", cls: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
    completed:     { label: "Completed",   cls: "bg-sky-500/15 text-sky-400 border-sky-500/25" },
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

/* ── Project image ──────────────────────────────────────────────────── */
const ProjectImage = ({
  src, alt, gradient, className = "",
}: {
  src?: string; alt: string; gradient: string; className?: string;
}) => {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className={`bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`} aria-label={alt}>
        <ImageOff className="w-8 h-8 text-white/30" />
      </div>
    );
  }
  return (
    <img
      src={src} alt={alt} width={800} height={400}
      loading="lazy" decoding="async"
      onError={() => setErrored(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

/* ── Flagship card (larger, prominent) ────────────────────────────── */
const FlagshipCard = ({ project, onClick }: { project: Project; onClick: (p: Project) => void }) => {
  const Icon = iconMap[project.iconName] ?? Zap;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 bg-background"
      onClick={() => onClick(project)}
    >
      {/* Image */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <ProjectImage
          src={project.image}
          alt={`${project.title} preview`}
          gradient={project.gradient}
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Founder / Flagship badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Star className="w-2.5 h-2.5" /> Flagship
          </span>
          {project.isFounder && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              Founder
            </span>
          )}
        </div>

        {/* Status top-right */}
        <div className="absolute top-3 right-3"><StatusBadge status={project.status} /></div>

        {/* Icon bottom-left */}
        <div className={`absolute bottom-4 left-4 w-10 h-10 rounded-2xl bg-gradient-to-br ${project.gradient} shadow-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{project.category}</span>
        <h3 className="text-xl font-display font-bold mt-1 mb-2 group-hover:text-primary transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.slice(0, 5).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-primary/8 text-primary/80 border border-primary/10">
              {tag}
            </span>
          ))}
          {project.tags.length > 5 && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">+{project.tags.length - 5}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <button
            onClick={(e) => { e.stopPropagation(); onClick(project); }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View Details <ArrowUpRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Live site">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Standard card ──────────────────────────────────────────────────── */
const ProjectCard = ({
  project, index, onClick,
}: {
  project: Project; index: number; onClick: (p: Project) => void;
}) => {
  const Icon = iconMap[project.iconName] ?? Zap;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col h-full"
    >
      <div
        className="bg-card rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all duration-300 border border-border/60"
        onClick={() => onClick(project)}
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden flex-shrink-0">
          <ProjectImage
            src={project.image}
            alt={`${project.title} preview`}
            gradient={project.gradient}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

          {/* Icon */}
          <div className={`absolute bottom-3 left-3 w-8 h-8 rounded-xl bg-gradient-to-br ${project.gradient} shadow-md flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>

          {/* Status */}
          <div className="absolute top-2.5 right-2.5"><StatusBadge status={project.status} /></div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-4">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
            {project.category}
          </span>
          <h3 className="text-sm font-display font-bold mb-1.5 group-hover:text-primary transition-colors leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded bg-primary/8 text-primary/70 border border-primary/10">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground">+{project.tags.length - 3}</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
            <button
              onClick={(e) => { e.stopPropagation(); onClick(project); }}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Details <ArrowUpRight className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-1.5 ml-auto">
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Live site">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="GitHub">
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

/* ── Detail Modal ─────────────────────────────────────────────────── */
const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const Icon = iconMap[project.iconName] ?? Zap;
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-background border border-border rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero */}
          <div className="relative h-52 overflow-hidden rounded-t-3xl flex-shrink-0">
            <ProjectImage src={project.image} alt={`${project.title} hero`} gradient={project.gradient} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${project.gradient} shadow-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-0.5">{project.category}</p>
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
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/80 text-white">
                    <Star className="w-2.5 h-2.5" /> Flagship
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {project.role && (
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl bg-muted/40 border border-border/50">
                <span className="text-muted-foreground font-medium">Role</span>
                <span className="text-foreground font-semibold">{project.role}</span>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">About This Project</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{project.longDescription}</p>
            </div>

            {project.specs && project.specs.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Key Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  {project.specs.map((s) => (
                    <div key={s.label} className="bg-muted/40 rounded-xl p-3 border border-border/40">
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">{s.label}</p>
                      <p className="text-sm font-semibold text-foreground">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Technologies &amp; Domains</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/15 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {(project.link || project.repo) && (
              <div className="flex flex-wrap gap-3 pt-2">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                  >
                    View Live Site <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" /> Repository
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Skeleton ─────────────────────────────────────────────────────── */
const CardSkeleton = () => (
  <div className="rounded-2xl bg-card border border-border/60 overflow-hidden animate-pulse">
    <div className="h-40 bg-muted/50" />
    <div className="p-4 space-y-2">
      <div className="h-3 w-16 bg-muted/50 rounded" />
      <div className="h-4 w-3/4 bg-muted/60 rounded" />
      <div className="h-3 w-full bg-muted/30 rounded" />
      <div className="h-3 w-4/5 bg-muted/30 rounded" />
    </div>
  </div>
);

/* ── Page ──────────────────────────────────────────────────────────── */
const Projects = () => {
  const [activeSector, setActiveSector] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects, sectors, loading } = useProjects();

  const sectorCounts = sectors.map((s) => ({
    ...s,
    count: s.value === "all" ? projects.length : projects.filter((p) => p.sector === s.value).length,
  }));

  const filtered = useMemo(() => {
    let result = activeSector === "all" ? projects : projects.filter((p) => p.sector === activeSector);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [projects, activeSector, query]);

  const flagship = filtered.filter((p) => p.isFlagship);
  const regular  = filtered.filter((p) => !p.isFlagship);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO page="projects" />
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
            className="mb-10"
          >
            <span className="text-primary font-medium text-sm mb-2 block tracking-wide uppercase">My Work</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Project <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              A curated collection of software, infrastructure, and systems work spanning clean energy, environmental impact, AI tools, and digital products.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
              />
            </div>

            {/* Sector pills */}
            <div className="flex flex-wrap gap-2">
              {sectorCounts.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setActiveSector(s.value)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeSector === s.value
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {s.label}
                  <span className={`text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold ${activeSector === s.value ? "bg-white/20" : "bg-background"}`}>
                    {s.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2 h-72 bg-muted/40 rounded-3xl animate-pulse border border-border/60" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <div key={activeSector + query} className="space-y-10">
                {/* Flagship */}
                {flagship.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <Star className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Flagship Projects</h2>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {flagship.map((p) => (
                        <FlagshipCard key={p.id} project={p} onClick={setSelectedProject} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular */}
                {regular.length > 0 && (
                  <div>
                    {flagship.length > 0 && (
                      <div className="flex items-center gap-3 mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">All Projects</h2>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regular.map((p, i) => (
                        <ProjectCard key={p.id} project={p} index={i} onClick={setSelectedProject} />
                      ))}
                    </div>
                  </div>
                )}

                {filtered.length === 0 && (
                  <div className="text-center py-24 text-muted-foreground">
                    <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
                    <p>No projects match your search. Try a different filter or keyword.</p>
                  </div>
                )}
              </div>
            </AnimatePresence>
          )}
        </div>
      </main>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      <Footer />
    </div>
  );
};

export default Projects;
