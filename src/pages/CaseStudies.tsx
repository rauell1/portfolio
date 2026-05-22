import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Calendar,
  Briefcase,
  BarChart3,
  Zap,
  Battery,
  Leaf,
  Globe,
  Thermometer,
  Droplets,
  Users,
  Award,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCaseStudies, type CaseStudy } from "@/hooks/use-case-studies";

const iconMap: Record<string, React.ElementType> = {
  Zap, Battery, Leaf, Globe, Thermometer, Droplets, Users, Award, LayoutDashboard, FileText,
};

/* ── Flagship card (top row, larger) ──────────────────────────────────── */
const FlagshipCard = ({ study, index }: { study: CaseStudy; index: number }) => {
  const navigate = useNavigate();
  const Icon = iconMap[study.icon_name] ?? Zap;
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br ${study.gradient} border border-white/10 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300`}
      onClick={() => navigate(`/case-studies/${study.slug}`)}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-6 right-6 w-40 h-40 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white blur-2xl" />
      </div>

      <div className="relative z-10 p-7 md:p-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/25 flex items-center justify-center flex-shrink-0">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/70 bg-white/10 px-3 py-1 rounded-full">
            {study.category}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 leading-snug">
          {study.title}
        </h3>
        {study.subtitle && (
          <p className="text-white/70 text-sm leading-relaxed mb-6 text-justify hyphens-auto">
            {study.subtitle}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs text-white/60">
          {study.location && (
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{study.location}</span>
          )}
          {study.partner && (
            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{study.partner}</span>
          )}
          {study.date && (
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{study.date}</span>
          )}
        </div>

        {/* Metrics */}
        {study.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {study.metrics.map((m) => (
              <div key={m.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <p className="text-white/60 text-[10px] font-medium mb-0.5">{m.label}</p>
                <p className="text-white font-display font-bold text-lg leading-none">
                  {m.value}
                  {m.unit && <span className="text-white/60 text-xs font-normal ml-1">{m.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="inline-flex items-center gap-2 text-sm font-semibold text-white">
          View case study
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
};

/* ── Standard card ──────────────────────────────────────────────────── */
const StudyCard = ({ study, index }: { study: CaseStudy; index: number }) => {
  const navigate = useNavigate();
  const Icon = iconMap[study.icon_name] ?? Zap;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group flex flex-col h-full rounded-2xl glass-card border border-border/60 hover:border-primary/30 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
      onClick={() => navigate(`/case-studies/${study.slug}`)}
    >
      {/* Gradient header */}
      <div className={`relative h-2 bg-gradient-to-r ${study.gradient}`} />

      <div className="flex-1 flex flex-col p-5">
        {/* Icon + category */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${study.gradient} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {study.category}
          </span>
        </div>

        <h3 className="text-base font-display font-bold mb-1 group-hover:text-primary transition-colors leading-snug">
          {study.title}
        </h3>
        {study.subtitle && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2 text-justify hyphens-auto">
            {study.subtitle}
          </p>
        )}

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {study.location && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />{study.location}
            </span>
          )}
          {study.date && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="w-2.5 h-2.5" />{study.date}
            </span>
          )}
        </div>

        {/* Top 2 metrics */}
        {study.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {study.metrics.slice(0, 2).map((m) => (
              <div key={m.label} className="rounded-lg bg-muted/40 p-2.5">
                <p className="text-[9px] text-muted-foreground font-medium mb-0.5">{m.label}</p>
                <p className="text-sm font-display font-bold text-foreground">
                  {m.value}
                  {m.unit && <span className="text-muted-foreground text-[10px] ml-0.5">{m.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{study.partner ?? ""}</span>
          <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all">
            View <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Skeleton ─────────────────────────────────────────────────────── */
const CardSkeleton = () => (
  <div className="rounded-2xl glass-card border border-border/60 animate-pulse overflow-hidden">
    <div className="h-2 bg-muted/60" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-10 w-10 bg-muted/50 rounded-xl" />
        <div className="h-3 w-16 bg-muted/40 rounded" />
      </div>
      <div className="h-5 w-3/4 bg-muted/60 rounded" />
      <div className="h-3 w-full bg-muted/40 rounded" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-12 bg-muted/30 rounded-lg" />
        <div className="h-12 bg-muted/30 rounded-lg" />
      </div>
    </div>
  </div>
);

/* ── Page ───────────────────────────────────────────────────────────── */
export default function CaseStudiesPage() {
  const { studies, loading } = useCaseStudies();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(studies.map((s) => s.category));
    return ["All", ...Array.from(cats).sort()];
  }, [studies]);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? studies
        : studies.filter((s) => s.category === activeCategory),
    [studies, activeCategory]
  );

  const flagship = filtered.filter((s) => s.is_flagship);
  const regular = filtered.filter((s) => !s.is_flagship);

  // Summary stats
  const totalMetrics = studies.flatMap((s) => s.metrics);
  const totalStudies = studies.length;
  const totalPartners = new Set(studies.map((s) => s.partner).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-24 px-6">
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
            <span className="text-primary font-medium text-sm mb-2 block tracking-wide uppercase">
              Impact Work
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Case <span className="gradient-text">Studies</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed text-justify hyphens-auto">
              Documented outcomes from real-world deployments in clean energy, e-mobility, and sustainable agriculture across East Africa.
            </p>
          </motion.div>

          {/* Summary stats bar */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-3 gap-4 mb-10"
            >
              {[
                { label: "Case Studies", value: totalStudies, icon: BarChart3 },
                { label: "Partner Orgs", value: totalPartners, icon: Briefcase },
                { label: "Metrics Tracked", value: totalMetrics.length, icon: Award },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-2xl p-4 text-center border border-border/60">
                  <s.icon className="w-5 h-5 text-primary mx-auto mb-2 opacity-70" />
                  <p className="text-2xl font-display font-bold gradient-text">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Category filter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2 rounded-3xl glass-card border border-border/60 animate-pulse h-64" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <div key={activeCategory} className="space-y-8">
                {/* Flagship */}
                {flagship.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {flagship.map((s, i) => (
                      <FlagshipCard key={s.id} study={s} index={i} />
                    ))}
                  </div>
                )}

                {/* Regular */}
                {regular.length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regular.map((s, i) => (
                      <StudyCard key={s.id} study={s} index={i} />
                    ))}
                  </div>
                )}

                {filtered.length === 0 && (
                  <div className="text-center py-24 text-muted-foreground">
                    No case studies in this category yet.
                  </div>
                )}
              </div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
