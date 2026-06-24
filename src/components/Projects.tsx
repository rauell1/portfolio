import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { ArrowRight, Zap, Leaf, Brain, Monitor, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface Path {
  label: string;
  description: string;
  accent: string;
  iconBg: string;
  icon: LucideIcon;
  tags: string[];
}

const PATHS: Path[] = [
  {
    label: "Clean Energy & E-Mobility",
    description:
      "Designing and deploying solar microgrids, EV charging infrastructure, and off-grid energy systems across East Africa, from feasibility to live pilot sites.",
    accent: "from-cyan-500 to-blue-500",
    iconBg: "bg-cyan-500/15 border-cyan-500/25 text-cyan-400",
    icon: Zap,
    tags: ["Solar PV", "EV Charging", "Battery Storage", "AgriTech", "Biogas"],
  },
  {
    label: "Environmental & Social Impact",
    description:
      "Building platforms and coordinating events that connect communities, environmental organisations, and industry partners around shared sustainability goals.",
    accent: "from-emerald-500 to-green-500",
    iconBg: "bg-emerald-500/15 border-emerald-500/25 text-emerald-400",
    icon: Leaf,
    tags: ["Non-Profit Tech", "Event Infrastructure", "Community", "Youth Empowerment"],
  },
  {
    label: "AI & Productivity Tools",
    description:
      "Shipping AI-powered tools that make complex workflows faster and more intelligent: CV writing, job targeting, and document generation for everyday users.",
    accent: "from-indigo-500 to-purple-500",
    iconBg: "bg-indigo-500/15 border-indigo-500/25 text-indigo-400",
    icon: Brain,
    tags: ["Generative AI", "OpenAI", "Anthropic", "Gemini", "Document Automation"],
  },
  {
    label: "Digital Products & Web",
    description:
      "Full-stack web platforms built with modern frameworks and deployed to production, from artist booking sites to SSR portfolio hubs.",
    accent: "from-pink-500 to-rose-500",
    iconBg: "bg-pink-500/15 border-pink-500/25 text-pink-400",
    icon: Monitor,
    tags: ["Next.js", "React", "TypeScript", "Supabase", "Vercel"],
  },
];

export const Projects = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    // Derive active dot from scroll position
    const cardWidth = el.scrollWidth / PATHS.length;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scrollTo = (dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / PATHS.length;
    const target = dir === "next"
      ? Math.min(el.scrollLeft + cardWidth, el.scrollWidth - el.clientWidth)
      : Math.max(el.scrollLeft - cardWidth, 0);
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const scrollToIndex = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / PATHS.length;
    el.scrollTo({ left: cardWidth * i, behavior: "smooth" });
  };

  return (
    <section id="work" className="py-16 sm:py-24 lg:py-32 relative" ref={sectionRef}>
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-20 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-mono-custom text-xs uppercase tracking-widest mb-4 block">// Portfolio</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
            Featured{" "}
            <span className="font-editorial italic font-semibold text-primary">
              Projects &amp; Focus
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed text-justify">
            Innovative solutions powering Africa's sustainable future through clean energy and e-mobility.
          </p>
        </motion.div>

        {/* Slider row */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scrollTo("prev")}
            disabled={!canScrollLeft}
            aria-label="Previous"
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-background border border-border shadow-md flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? "opacity-100 hover:border-primary/50 hover:text-primary cursor-pointer"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scrollTo("next")}
            disabled={!canScrollRight}
            aria-label="Next"
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-background border border-border shadow-md flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? "opacity-100 hover:border-primary/50 hover:text-primary cursor-pointer"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.projects-scroll::-webkit-scrollbar { display: none; }`}</style>

            {PATHS.map((path, i) => (
              <motion.div
                key={path.label}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="snap-start shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] bg-card rounded-2xl border border-border/60 p-7 flex flex-col gap-5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${path.iconBg} group-hover:scale-105 transition-transform duration-300`}>
                  <path.icon className="w-5 h-5" />
                </div>

                {/* Title + accent bar */}
                <div>
                  <h3 className="text-base sm:text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">
                    {path.label}
                  </h3>
                  <div className={`h-0.5 w-10 bg-gradient-to-r ${path.accent} rounded-full`} />
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 text-justify">
                  {path.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {path.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono-custom tracking-tight px-2.5 py-1 rounded-full bg-primary/8 border border-primary/12 text-primary/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {PATHS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${PATHS[i].label}`}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-border hover:bg-primary/40"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-xs font-mono-custom uppercase tracking-widest hover:bg-primary/90 btn-glow transition-all duration-300"
          >
            Explore Projects Spec Sheet <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
