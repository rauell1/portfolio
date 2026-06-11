import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, Zap, Leaf, Brain, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

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
    accent: "text-cyan-400 border-cyan-500/30",
    bg: "from-cyan-500/10 via-transparent to-transparent",
    icon: Zap,
    tags: ["Solar PV", "EV Charging", "Battery Storage", "AgriTech", "Biogas"],
  },
  {
    label: "Environmental & Social Impact",
    description:
      "Building platforms and coordinating events that connect communities, environmental organisations, and industry partners around shared sustainability goals.",
    accent: "text-emerald-400 border-emerald-500/30",
    bg: "from-emerald-500/10 via-transparent to-transparent",
    icon: Leaf,
    tags: ["Non-Profit Tech", "Event Infrastructure", "Community", "Youth Empowerment"],
  },
  {
    label: "AI & Productivity Tools",
    description:
      "Shipping AI-powered tools that make complex workflows - CV writing, job targeting, document generation - faster and more intelligent for everyday users.",
    accent: "text-indigo-400 border-indigo-500/30",
    bg: "from-indigo-500/10 via-transparent to-transparent",
    icon: Brain,
    tags: ["Generative AI", "OpenAI", "Anthropic", "Gemini", "Document Automation"],
  },
  {
    label: "Digital Products & Web",
    description:
      "Full-stack web platforms - from artist booking sites to SSR portfolio hubs - built with modern frameworks and deployed to production.",
    accent: "text-pink-400 border-pink-500/30",
    bg: "from-pink-500/10 via-transparent to-transparent",
    icon: Monitor,
    tags: ["Next.js", "React", "TypeScript", "Supabase", "Vercel"],
  },
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const calculateConstraints = () => {
      if (sliderRef.current && containerRef.current) {
        const sliderWidth = sliderRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        // Constraint calculation with standard margin buffer
        setDragConstraints({
          left: -sliderWidth + containerWidth - 32,
          right: 0,
        });
      }
    };

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);
    // Recalculate after initial render chunks settle
    const timer = setTimeout(calculateConstraints, 500);

    return () => {
      window.removeEventListener("resize", calculateConstraints);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section id="work" className="py-16 sm:py-24 lg:py-32 px-6 relative" ref={ref}>
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-20 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono-custom text-xs uppercase tracking-widest mb-4 block">// Portfolio</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
            Featured{" "}
            <span className="font-editorial italic font-semibold text-primary">
              Projects &amp; Focus
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            Innovative solutions powering Africa's sustainable future through clean energy and e-mobility.
          </p>
        </motion.div>

        {/* Physics-based Horizontal Slider Container */}
        <div 
          ref={containerRef} 
          className="w-full overflow-hidden relative cursor-grab active:cursor-grabbing pb-8 select-none"
          data-cursor="drag"
        >
          <motion.div
            ref={sliderRef}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.15}
            className="flex gap-6 w-max"
          >
            {PATHS.map((path, i) => (
              <motion.div
                key={path.label}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`w-[290px] sm:w-[380px] shrink-0 relative glass-card rounded-3xl p-8 border-white/[0.08] overflow-hidden bg-gradient-to-br ${path.bg} flex flex-col justify-between min-h-[300px] hover:border-primary/20 transition-all duration-300`}
              >
                <div>
                  {/* Icon & Specs */}
                  <div className="flex items-start mb-6">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                      <path.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  {/* Heading & Accent Bar */}
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-display font-medium leading-snug">
                      {path.label}
                    </h3>
                    <div className="h-0.5 w-12 bg-primary mt-2 rounded-full" />
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-[13px] sm:text-sm leading-relaxed mb-6 font-sans text-justify hyphens-auto">
                    {path.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {path.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono-custom tracking-tight px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Action Button CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-xs font-mono-custom uppercase tracking-widest hover:bg-primary/95 btn-glow transition-all duration-300"
          >
            Explore Projects Spec Sheet <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
