import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Briefcase,
  User,
  ExternalLink,
  Download,
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
  ArrowUpRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { SITE_URL } from "@/lib/seo";
import { useCaseStudies, type CaseStudy } from "@/hooks/use-case-studies";

const iconMap: Record<string, React.ElementType> = {
  Zap, Battery, Leaf, Globe, Thermometer, Droplets, Users, Award, LayoutDashboard, FileText,
};

const Skeleton = () => (
  <div className="max-w-4xl mx-auto animate-pulse space-y-6 mt-10">
    <div className="h-64 bg-muted/40 rounded-3xl" />
    <div className="h-8 w-2/3 bg-muted/60 rounded" />
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-muted/30 rounded-xl" />)}
    </div>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-5 w-1/4 bg-muted/50 rounded" />
        <div className="h-3 w-full bg-muted/30 rounded" />
        <div className="h-3 w-5/6 bg-muted/30 rounded" />
      </div>
    ))}
  </div>
);

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { studies, loading } = useCaseStudies();

  const study = useMemo(() => studies.find((s) => s.slug === slug), [studies, slug]);
  const related = useMemo(
    () => studies.filter((s) => s.id !== study?.id && s.category === study?.category).slice(0, 3),
    [studies, study]
  );

  const Icon = study ? (iconMap[study.icon_name] ?? Zap) : Zap;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {study ? (
        <SEO
          title={`${study.title} | Roy Okola Otieno`}
          description={study.subtitle ?? `Detailed case study: ${study.title} — clean energy and e-mobility deployment across East Africa.`}
          canonical={`${SITE_URL}/case-studies/${study.slug}`}
          ogImage={study.image ?? undefined}
          keywords={`${study.category}, clean energy case study Africa, EV deployment Kenya, ${study.location ?? ""}`}
        />
      ) : (
        <SEO title="Case Study | Roy Okola Otieno" description="Detailed clean energy and e-mobility case study." />
      )}
      <Navbar />

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>

          {loading ? (
            <Skeleton />
          ) : !study ? (
            <div className="text-center py-32">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <h2 className="text-2xl font-display font-bold mb-2">Case study not found</h2>
              <p className="text-muted-foreground mb-6">This study may have been moved or removed.</p>
              <button
                onClick={() => navigate("/case-studies")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse all case studies
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                {/* Hero banner */}
                <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${study.gradient} mb-8 p-8 md:p-12`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-white blur-3xl" />
                    <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-white blur-2xl" />
                  </div>

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                        {study.category}
                        {study.is_flagship && " · Flagship"}
                      </span>
                      <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1 mb-2 leading-snug">
                        {study.title}
                      </h1>
                      {study.subtitle && (
                        <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl text-justify hyphens-auto">
                          {study.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="relative z-10 flex flex-wrap gap-5 mt-8 text-sm text-white/70">
                    {study.role && (
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{study.role}</span>
                    )}
                    {study.partner && (
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{study.partner}</span>
                    )}
                    {study.location && (
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{study.location}</span>
                    )}
                    {study.date && (
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{study.date}</span>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                {study.metrics.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.15 }}
                    className="mb-10"
                  >
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                      Key Metrics
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {study.metrics.map((m, i) => (
                        <motion.div
                          key={m.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
                          className="glass-card rounded-2xl p-4 border border-border/60 text-center"
                        >
                          <p className="text-2xl md:text-3xl font-display font-bold gradient-text leading-none mb-1">
                            {m.value}
                          </p>
                          {m.unit && (
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">
                              {m.unit}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">{m.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Sections */}
                {study.sections.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 }}
                    className="space-y-8 mb-10"
                  >
                    {study.sections.map((section, i) => (
                      <div key={i}>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                          {section.heading}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-justify hyphens-auto">
                          {section.body}
                        </p>
                        {section.image && (
                          <div className="mt-4 rounded-2xl overflow-hidden">
                            <img
                              src={section.image}
                              alt={section.heading}
                              className="w-full h-56 object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Cover image */}
                {study.image && (
                  <div className="mb-10 rounded-2xl overflow-hidden">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* CTAs */}
                {study.pdf_download && (
                  <div className="flex flex-wrap gap-3 mb-10">
                    <a
                      href={study.pdf_download}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF Report
                    </a>
                  </div>
                )}

                {/* Related */}
                {related.length > 0 && (
                  <div className="pt-10 border-t border-border/60">
                    <h2 className="text-lg font-display font-bold mb-5">More Case Studies</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {related.map((s) => {
                        const RelIcon = iconMap[s.icon_name] ?? Zap;
                        return (
                          <Link
                            key={s.id}
                            to={`/case-studies/${s.slug}`}
                            className="group rounded-xl glass-card border border-border/60 hover:border-primary/30 p-4 transition-all duration-200"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center flex-shrink-0`}>
                                <RelIcon className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                {s.category}
                              </span>
                            </div>
                            <h3 className="text-sm font-display font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
                              {s.title}
                            </h3>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              View study <ArrowUpRight className="w-3 h-3" />
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
