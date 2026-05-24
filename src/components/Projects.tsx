import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Zap, Leaf, Brain, Monitor, ArrowLeftRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { SpotlightCard } from "./ui/SpotlightCard";

interface Path {
  label: string;
  description: string;
  accent: string;
  bg: string;
  icon: LucideIcon;
  tags: string[];
}

const PATHS: Path[] = [
  {
    label: "Clean Energy & E-Mobility",
    description:
      "Designing and deploying solar microgrids, EV charging infrastructure, and off-grid energy systems across East Africa - from feasibility to live pilot sites.",
    accent: "text-cyan-400",
    bg: "from-cyan-500/10 to-cyan-500/0",
    icon: Zap,
    tags: ["Solar PV", "EV Charging", "Battery Storage", "AgriTech", "Biogas"],
  },
  {
    label: "Environmental & Social Impact",
    description:
      "Building platforms and coordinating events that connect communities, environmental organisations, and industry partners around shared sustainability goals.",
    accent: "text-emerald-400",
    bg: "from-emerald-500/10 to-emerald-500/0",
    icon: Leaf,
    tags: ["Non-Profit Tech", "Event Infrastructure", "Community", "Youth Empowerment"],
  },
  {
    label: "AI & Productivity Tools",
    description:
      "Shipping AI-powered tools that make complex workflows - CV writing, job targeting, document generation - faster and more intelligent for everyday users.",
    accent: "text-indigo-400",
    bg: "from-indigo-500/10 to-indigo-500/0",
    icon: Brain,
    tags: ["Generative AI", "OpenAI", "Anthropic", "Gemini", "Document Automation"],
  },
  {
    label: "Digital Products & Web",
    description:
      "Full-stack web platforms - from artist booking sites to SSR portfolio hubs - built with modern frameworks and deployed to production.",
    accent: "text-pink-400",
    bg: "from-pink-500/10 to-pink-500/0",
    icon: Monitor,
    tags: ["Next.js", "React", "TypeScript", "Supabase", "Vercel"],
  },
];

export const Projects = () => {
  const ref = useRef(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (sliderRef.current) {
      setWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth);
    }
  }, [isInView]);

  return (
    <section id="work" className="py-16 sm:py-24 lg:py-32 px-6 relative overflow-hidden bg-background" ref={ref}>
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-mono-custom tracking-[0.2em] text-xs uppercase mb-3 block">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Featured <span className="gradient-text font-editorial italic font-normal">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Innovative solutions powering Africa's sustainable transition through clean energy, e-mobility, and automation.
          </p>
        </motion.div>

        {/* Drag Helper Tip */}
        <div className="flex justify-end items-center gap-1.5 text-xs text-muted-foreground tracking-widest font-mono-custom uppercase mb-4 animate-pulse">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Swipe or Drag to Explore</span>
        </div>

        {/* Horizontal Slider Viewport */}
        <div className="overflow-visible select-none cursor-grab active:cursor-grabbing" ref={sliderRef}>
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            whileDrag={{ cursor: "grabbing" }}
            className="flex gap-6 w-max pb-6"
          >
            {PATHS.map((path, i) => (
              <motion.div
                key={path.label}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="w-[290px] sm:w-[380px] h-[340px] flex projects-slide"
              >
                <SpotlightCard
                  className="relative glass-card rounded-3xl p-8 overflow-hidden h-full flex flex-col justify-between border border-white/10 dark:border-white/5 w-full"
                  glowColor={
                    path.label.includes("Energy")
                      ? "rgba(20, 184, 166, 0.12)" // Teal
                      : path.label.includes("Impact")
                      ? "rgba(16, 185, 129, 0.12)" // Green
                      : path.label.includes("AI")
                      ? "rgba(99, 102, 241, 0.12)" // Indigo
                      : "rgba(236, 72, 153, 0.12)" // Pink
                  }
                >
                  <div>
                    {/* Icon */}
                    <div className="mb-6">
                      <path.icon className={`w-8 h-8 ${path.accent}`} />
                    </div>

                    {/* Heading + rule */}
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className={`text-xs font-bold uppercase tracking-widest font-mono-custom ${path.accent}`}>
                        {path.label}
                      </h3>
                      <div className="flex-1 h-px bg-border/40" />
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 text-justify hyphens-auto font-sans">
                      {path.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {path.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-3 py-1 rounded-full bg-black/10 dark:bg-white/5 text-muted-foreground border border-border/30 font-medium font-mono-custom"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
