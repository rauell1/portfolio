import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

        {/* Path cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {PATHS.map((path, i) => (
            <motion.div
              key={path.label}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`relative glass-card rounded-2xl p-7 overflow-hidden bg-gradient-to-br ${path.bg}`}
            >
              {/* Icon */}
              <div className="mb-4">
                <path.icon className={`w-7 h-7 ${path.accent}`} />
              </div>

              {/* Heading + rule */}
              <div className="flex items-center gap-3 mb-3">
                <h3 className={`text-sm font-bold uppercase tracking-widest ${path.accent}`}>
                  {path.label}
                </h3>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {path.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {path.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
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
