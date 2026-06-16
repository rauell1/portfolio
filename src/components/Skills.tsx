import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo, memo } from "react";
import React from "react";
import { Sun, Battery, Zap, Leaf, Bot, FileBarChart2, Globe2 } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { SkillsRadarChart } from "./SkillsRadarChart";
import { supabase } from "@/integrations/supabase/client";

const EnergyIcon = ({ icon: Icon, delay, className }: { icon: React.ComponentType<LucideProps>; delay: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    className={className}
  >
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <Icon className="w-6 h-6 text-primary" />
    </motion.div>
  </motion.div>
);

interface SkillItem { name: string; level: number }
interface SkillsContent {
  tagline: string;
  heading: string;
  heading_highlight: string;
  items: SkillItem[];
}

const STREAMLINED_SKILLS: SkillItem[] = [
  { name: "Solar PV & Off-Grid Design", level: 95 },
  { name: "EV Networks & Charging Tech", level: 92 },
  { name: "AI Feasibility & GIS Analysis", level: 85 },
  { name: "Automated Resource Dashboards", level: 88 },
  { name: "EPRA Strategy & Policy Advocacy", level: 90 },
];

const DEFAULT: SkillsContent = {
  tagline: "My Expertise",
  heading: "Skills &",
  heading_highlight: "Capabilities",
  items: STREAMLINED_SKILLS,
};

const AnimatedProgressBar = memo(({ skill, index, isInView }: { skill: SkillItem; index: number; isInView: boolean }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setWidth(skill.level), index * 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, skill.level, index]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="space-y-2.5"
    >
      <div className="flex justify-between items-center text-[11px] sm:text-xs font-mono-custom uppercase tracking-wider">
        <span className="text-muted-foreground/90 font-medium">{skill.name}</span>
        <span className="text-primary font-bold">{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-black/20 dark:bg-white/5 rounded-full overflow-hidden border border-white/[0.03]">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full relative"
          style={{ width: `${width}%` }}
          transition={{ duration: 1, delay: index * 0.08, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
            style={{ width: "100%", height: "100%" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
});
AnimatedProgressBar.displayName = "AnimatedProgressBar";

const consolidatedCards = [
  {
    icon: Sun,
    category: "01 // PHYSICAL SYSTEMS",
    title: "Engineering & Infrastructure",
    description: "Designing and deploying solar PV microgrids, utility solar backups, and EV fast-charging depot architecture, supporting fleet uptime of up to 94%.",
  },
  {
    icon: Bot,
    category: "02 // SMART AUTOMATION",
    title: "AI & Automation Engineering",
    description: "Accelerating clean energy and EV charging feasibility studies using customized LLMs, automated Power BI dashboards, and GIS geospatial analytics.",
  },
  {
    icon: Globe2,
    category: "03 // REGULATORY AFFAIRS",
    title: "Project Strategy & Policy",
    description: "Formulating models to attract KES 50M+ in infrastructure proposals, and coordinating policy discussions with EPRA, EMAK, county agencies, and NGOs.",
  },
];

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [content, setContent] = useState<SkillsContent>(DEFAULT);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("page_sections")
      .select("content")
      .eq("page", "home")
      .eq("section", "skills")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) {
          const parsed = data.content as SkillsContent;
          // If Supabase has data, limit or map it cleanly, otherwise keep our premium streamlined items
          if (parsed.items && parsed.items.length > 0) {
            setContent(parsed);
          }
        }
      });
  }, []);

  const skills = useMemo(() => content.items, [content.items]);

  return (
    <section id="skills" className="py-16 sm:py-24 lg:py-32 px-6 relative" ref={ref}>
      {/* Ambient background light */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-glow opacity-20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono-custom text-xs uppercase tracking-widest mb-4 block">// Capabilities</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
            {content.heading}{" "}
            <span className="font-editorial italic font-semibold text-primary">
              {content.heading_highlight}
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid layout: Streamlined Competencies + pentagon radar */}
        <div className="grid lg:grid-cols-3 gap-6 items-stretch mb-8">
          {/* Bento Card 1: Combined competencies list */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 glass-card rounded-3xl p-8 sm:p-10 border-white/[0.08] relative overflow-hidden group hover:border-primary/20 transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-display font-medium mb-8 flex items-center gap-3">
                <div className="flex gap-2">
                  <EnergyIcon icon={Zap} delay={0} />
                  <EnergyIcon icon={Leaf} delay={0.15} />
                </div>
                Core Capabilities &amp; AI Achievements
              </h3>

              <div className="space-y-6 relative z-10">
                {skills.map((skill, index) => (
                  <AnimatedProgressBar key={skill.name} skill={skill} index={index} isInView={isInView} />
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[10px] font-mono-custom text-muted-foreground/40 border-t border-white/[0.04] pt-6 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Dual-competence stack: Sustainable Engineering x Applied AI Automation
            </div>
          </motion.div>

          {/* Bento Card 2: 5-axis Pentagon Radar Chart */}
          <SkillsRadarChart skills={skills} isInView={isInView} />
        </div>

        {/* Bento Grid: 3 Flagship Expertise Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {consolidatedCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className="glass-card rounded-2xl p-6 border-white/[0.08] overflow-hidden group cursor-pointer relative hover:border-primary/20 transition-all duration-300 min-h-[220px] flex flex-col justify-between"
                whileHover={{ y: -4 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/25 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-mono-custom text-[8px] tracking-wider text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                    {card.category}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-base sm:text-lg font-display font-medium mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-sans">{card.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
