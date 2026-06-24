import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
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
  Search,
  Star,
  Brain,
  Code2,
  LayoutGrid,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { type Project } from "@/data/portfolioProjects";
import { useProjects } from "@/hooks/use-projects";

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
  Brain,
  Code2,
};

const sectorIcons: Record<string, React.ElementType> = {
  all: LayoutGrid,
  "clean-energy": Zap,
  environmental: Globe,
  "ai-tools": Brain,
  "digital-products": Code2,
};

/* ── Stats Counter Component ────────────────────────────────────────── */
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => setCount(Math.floor(latest)),
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ── Status badge ──────────────────────────────────────────────────── */
const StatusBadge = ({ status }: { status?: Project["status"] }) => {
  if (!status) return null;
  const map = {
    live: {
      label: "Live",
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    },
    "in-progress": {
      label: "In Progress",
      cls: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    },
    completed: {
      label: "Completed",
      cls: "bg-sky-500/15 text-sky-400 border-sky-500/25",
    },
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
        className={`bg-gradient-to-br ${gradient} relative overflow-hidden ${className}`}
        aria-label={alt}
      >
        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-full bg-white/15 blur-2xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />
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

/* ── Spotlight Flagship Card (First Flagship - SafariCharge) ───────── */
const SpotlightFlagshipCard = ({ project, onClick }: { project: Project; onClick: (p: Project) => void }) => {
  const Icon = iconMap[project.iconName] ?? Zap;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative md:col-span-2 rounded-3xl overflow-hidden cursor-pointer border border-border/60 hover:border-primary/45 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 bg-card hover:scale-[1.005]"
      onClick={() => onClick(project)}
    >
      <div className="flex flex-col md:flex-row min-h-[400px]">
        {/* Left half: Image */}
        <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto overflow-hidden min-h-[250px] md:min-h-auto">
          <ProjectImage
            src={project.image}
            alt={`${project.title} spotlight`}
            gradient={project.gradient}
            className="transition-transform duration-700 group-hover:scale-105 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

          {/* FEATURED PROJECT Label with Pulsing Dot */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white">Featured Project</span>
          </div>

          {/* Role badge overlay on image bottom-left */}
          {project.role && (
            <span className="absolute bottom-4 left-4 text-[10px] font-semibold text-white/90 border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
              {project.role}
            </span>
          )}
        </div>

        {/* Right half: Content */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs text-primary font-bold uppercase tracking-wider">{project.category}</span>
            <h3 className="text-2xl md:text-3xl font-display font-bold mt-2 mb-3 group-hover:text-primary transition-colors leading-tight">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 text-justify hyphens-auto">
              {project.description}
            </p>

            {/* 2x2 Specs Grid */}
            {project.specs && project.specs.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {project.specs.slice(0, 4).map((s) => (
                  <div key={s.label} className="bg-muted/45 border border-border/40 rounded-xl p-3">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">{s.label}</p>
                    <p className="text-xs font-semibold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.tags.slice(0, 6).map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 text-xs rounded-md bg-primary/8 text-primary/80 border border-primary/10 font-medium">
                  {tag}
                </span>
              ))}
              {project.tags.length > 6 && (
                <span className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">+{project.tags.length - 6}</span>
              )}
            </div>

            {/* Footer with CTA links */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(project);
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                View Details <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 ml-auto">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-medium transition-all"
                    title="View Live Site"
                  >
                    <span>Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:border-primary/45 text-muted-foreground hover:text-primary text-xs font-medium transition-all"
                    title="GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Flagship card (larger, prominent - other flagships) ───────────── */
const FlagshipCard = ({ project, onClick }: { project: Project; onClick: (p: Project) => void }) => {
  const Icon = iconMap[project.iconName] ?? Zap;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer border border-border/60 hover:border-primary/45 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 bg-card hover:scale-[1.005]"
      onClick={() => onClick(project)}
    >
      {/* Thin Gradient Top Border */}
      <div className={`h-1 bg-gradient-to-r ${project.gradient}`} />

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

        {/* Outlined Role chip in bottom-left of image area */}
        {project.role && (
          <span className="absolute bottom-3 left-16 text-[9px] font-medium text-white/90 border border-white/20 bg-black/55 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
            {project.role}
          </span>
        )}

        {/* Status top-right */}
        <div className="absolute top-3 right-3"><StatusBadge status={project.status} /></div>

        {/* Icon bottom-left */}
        <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-2xl bg-gradient-to-br ${project.gradient} shadow-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{project.category}</span>
          {project.role && (
            <span className="text-[10px] font-medium text-primary/80 bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-full shrink-0">
              {project.role}
            </span>
          )}
        </div>
        <h3 className="text-xl font-display font-bold mt-1 mb-2 group-hover:text-primary transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 text-justify">
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
            onClick={(e) => {
              e.stopPropagation();
              onClick(project);
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View Details <ArrowUpRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                title="Live site"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Standard card (Redesigned Taller Card) ────────────────────────── */
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col h-full"
      data-sector={project.sector}
    >
      <div
        className="bg-card rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer hover:border-primary/35 hover:shadow-primary/10 transition-all duration-300 border border-border/60"
        onClick={() => onClick(project)}
      >
        {/* Image - Taller h-48 */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <ProjectImage
            src={project.image}
            alt={`${project.title} preview`}
            gradient={project.gradient}
            className="transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

          {/* Icon */}
          <div className={`absolute bottom-3 left-3 w-8 h-8 rounded-xl bg-gradient-to-br ${project.gradient} shadow-md flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Tech strip below the image (always visible) */}
        <div className="px-4 py-2 border-b border-border/30 bg-muted/20 flex flex-wrap gap-1.5 flex-shrink-0">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded bg-primary/5 text-primary/70 border border-primary/10">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-1.5 py-0.5 text-[9px] rounded bg-muted text-muted-foreground">+{project.tags.length - 3}</span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-4">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
            {project.category}
          </span>
          <h3 className="text-sm font-display font-bold mb-0.5 group-hover:text-primary transition-colors leading-snug">
            {project.title}
          </h3>

          {/* Project role beneath the title */}
          {project.role && (
            <p className="text-[10px] text-muted-foreground/80 italic mb-2">
              {project.role}
            </p>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3 text-justify hyphens-auto">
            {project.description}
          </p>

          {/* Footer: status left, links right */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
            <StatusBadge status={project.status} />

            <div className="flex items-center gap-1.5 ml-auto">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
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
                  className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  title="GitHub"
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

/* ── Detail Modal (Improved) ──────────────────────────────────────── */
const ProjectModal = ({
  project,
  onClose,
  onSelectProject,
  allProjects,
}: {
  project: Project;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  allProjects: Project[];
}) => {
  const Icon = iconMap[project.iconName] ?? Zap;

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Select 2 random other projects from the same sector
  const otherProjects = useMemo(() => {
    const sectorProjects = allProjects.filter((p) => p.sector === project.sector && p.id !== project.id);
    const shuffled = [...sectorProjects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [project, allProjects]);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
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
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* ESC hint only on desktop */}
                  <span className="hidden md:inline-block text-[10px] font-medium text-white/50 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                    ESC to close
                  </span>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
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
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl bg-muted/45 border border-border/50">
                <span className="text-muted-foreground font-medium">Role</span>
                <span className="text-foreground font-semibold">{project.role}</span>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">About This Project</h4>
              <p className="text-muted-foreground text-sm leading-relaxed text-justify">{project.longDescription}</p>
            </div>

            {project.specs && project.specs.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Key Details</h4>
                {/* 3 columns on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/45 hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" /> Repository
                  </a>
                )}
              </div>
            )}

            {/* Other projects mini-row */}
            {otherProjects.length > 0 && (
              <div className="pt-6 border-t border-border/40">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Other Projects in this Sector</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {otherProjects.map((op) => (
                    <div
                      key={op.id}
                      onClick={() => onSelectProject(op)}
                      className="flex gap-3 p-3 bg-muted/20 border border-border/40 rounded-xl cursor-pointer hover:border-primary/30 hover:bg-muted/40 transition-all duration-200 group"
                    >
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                        <ProjectImage
                          src={op.image}
                          alt={op.title}
                          gradient={op.gradient}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase font-semibold tracking-wider truncate">{op.category}</p>
                        <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate mt-0.5">{op.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
    <div className="h-48 bg-muted/50" />
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
  const regular = filtered.filter((p) => !p.isFlagship);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO page="projects" />
      <Navbar />

      {/* Overhauled Immersive Page Header */}
      <header className="pt-28 pb-16 bg-gradient-to-b from-slate-950 via-slate-900 to-background border-b border-border/40 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Pill Breadcrumb */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border/40 mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-primary font-bold text-xs mb-2.5 block tracking-widest uppercase">My Work</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
              Project <span className="bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">Portfolio</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed text-justify hyphens-auto">
              A curated collection of software, infrastructure, and systems work spanning clean energy, environmental impact, AI tools, and digital products.
            </p>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border/50">
              {[
                { label: "Projects", value: "11" },
                { label: "Domains", value: "4" },
                { label: "Live Products", value: "5" },
                { label: "Countries", value: "1+" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-display font-bold gradient-text leading-none">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Animated Counter Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mt-8">
            {[
              { label: "Projects", value: 11, suffix: "" },
              { label: "Domains", value: 4, suffix: "" },
              { label: "Live", value: 5, suffix: "" },
              { label: "Countries", value: 1, suffix: "+" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-primary/5 hover:border-primary/20 transition-all"
              >
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-[10px] text-muted-foreground font-bold mt-1.5 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Domain Breakdown Status Bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 pt-6 border-t border-border/40 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Breakdown:</span>
            {[
              { label: "Clean Energy", count: 6, dot: "bg-amber-400" },
              { label: "Environmental", count: 2, dot: "bg-emerald-400" },
              { label: "AI Tools", count: 1, dot: "bg-indigo-400" },
              { label: "Digital Products", count: 2, dot: "bg-pink-400" },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${d.dot} animate-pulse`} />
                <span>
                  {d.label} <strong className="text-foreground">{d.count}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Sticky Sector Filter Bar (Appears beneath Navbar) */}
          <div className="sticky top-[68px] z-40 -mx-6 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/45 mb-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Sector pills */}
              <div
                className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto pb-2 md:pb-0"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style>{`
                  .scrollbar-none::-webkit-scrollbar { display: none; }
                `}</style>
                {sectorCounts.map((s) => {
                  const Icon = sectorIcons[s.value] ?? LayoutGrid;
                  return (
                    <button
                      key={s.value}
                      onClick={() => setActiveSector(s.value)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0 ${
                        activeSector === s.value
                          ? "bg-gradient-to-r from-primary to-sky-500 text-white shadow-sm"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {s.label}
                      <span
                        className={`text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold ${
                          activeSector === s.value ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
                        }`}
                      >
                        {s.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search projects..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-8">
              {/* Full width skeleton for spotlight card */}
              <div className="rounded-3xl bg-card border border-border/60 overflow-hidden animate-pulse min-h-[350px] flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 bg-muted/50 aspect-video md:aspect-auto" />
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="h-3 w-16 bg-muted/50 rounded" />
                    <div className="h-6 w-3/4 bg-muted/60 rounded" />
                    <div className="h-3 w-full bg-muted/30 rounded" />
                    <div className="h-3 w-5/6 bg-muted/30 rounded" />
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <div className="h-10 bg-muted/40 rounded-xl" />
                      <div className="h-10 bg-muted/40 rounded-xl" />
                    </div>
                  </div>
                  <div className="h-4 w-1/3 bg-muted/40 rounded" />
                </div>
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
                      {flagship.map((p) => {
                        if (p.id === "safaricharge-platform") {
                          return <SpotlightFlagshipCard key={p.id} project={p} onClick={setSelectedProject} />;
                        }
                        return <FlagshipCard key={p.id} project={p} onClick={setSelectedProject} />;
                      })}
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
                    <p className="mb-4">No projects match your search. Try a different filter or keyword.</p>
                    <button
                      onClick={() => {
                        setActiveSector("all");
                        setQuery("");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-all shadow-sm"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </AnimatePresence>
          )}
        </div>
      </main>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSelectProject={setSelectedProject}
          allProjects={projects}
        />
      )}

      <Footer />
    </div>
  );
};

export default Projects;
