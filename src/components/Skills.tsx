import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo, memo } from "react";
import React from "react";
import { Sun, Battery, Wind, Zap, Leaf, Droplets, Bot, FileBarChart2, Globe2, Map, Megaphone, BarChart3 } from "lucide-react";
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
      <Icon className="w-8 h-8 text-primary" />
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

const DEFAULT_SKILLS: SkillItem[] = [
  { name: "Solar PV Design", level: 95 },
  { name: "EV Charging Systems", level: 90 },
  { name: "Energy Audits", level: 88 },
  { name: "Sales Strategy", level: 92 },
  { name: "Policy Advocacy", level: 85 },
  { name: "Project Management", level: 88 },
  { name: "Data Analysis", level: 82 },
  { name: "Community Engagement", level: 95 },
];

const AI_AGENT_SKILLS: SkillItem[] = [
  { name: "AI-Assisted Feasibility Analysis", level: 82 },
  { name: "Automated Energy Reporting", level: 78 },
  { name: "AI Market Intelligence (EV/Solar)", level: 80 },
  { name: "Geospatial & GIS Data Analysis", level: 75 },
  { name: "AI-Powered Sales Outreach", level: 76 },
  { name: "Data-Driven Policy Advocacy", level: 78 },
];

const DEFAULT: SkillsContent = {
  tagline: "My Expertise",
  heading: "Skills &",
  heading_highlight: "Expertise",
  items: DEFAULT_SKILLS,
};

// PERF: React.memo prevents AnimatedProgressBar re-rendering when the parent
// re-renders for reasons unrelated to this bar's own props (e.g. Supabase data
// arriving, other state changes). Without memo, all 14 bars re-render together
// on every parent update, each re-running their useEffect timers.
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
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">{skill.name}</span>
        <span className="text-primary text-sm font-bold">{skill.level}%</span>
      </div>
      <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full relative"
          style={{ width: `${width}%` }}
          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 + index * 0.2 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
});
AnimatedProgressBar.displayName = "AnimatedProgressBar";

// PERF: defined outside component — static array, no need to be inside render
const agentSkillCards = [
  {
    icon: FileBarChart2,
    title: "AI-Assisted Feasibility Analysis",
    description: "Using LLMs and data tools to accelerate solar PV and EV charging site feasibility studies and investment reports.",
  },
  {
    icon: BarChart3,
    title: "Automated Energy Reporting",
    description: "Automating Power BI dashboards and energy audit reports to deliver real-time insights to clients and stakeholders.",
  },
  {
    icon: Globe2,
    title: "AI Market Intelligence",
    description: "Leveraging AI to track EV and solar market trends, competitor activity, and investment opportunities across East Africa.",
  },
  {
    icon: Map,
    title: "Geospatial & GIS Analysis",
    description: "Applying AI-enhanced GIS tools to identify optimal sites for EV charging hubs and distributed solar installations.",
  },
  {
    icon: Megaphone,
    title: "AI-Powered Sales Outreach",
    description: "Using automation and AI to personalise outreach to EPCs, transport operators, and energy distributors at scale.",
  },
  {
    icon: Bot,
    title: "Data-Driven Policy Advocacy",
    description: "Synthesising regulatory data with AI tools to build compelling evidence for engagement with EPRA, EMAK, and NGOs.",
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
        if (data?.content) setContent(data.content as SkillsContent);
      });
  }, []);

  // PERF: stabilise skills array with useMemo so AnimatedProgressBar memo
  // comparison works correctly — without this, a new array reference on every
  // render would always bust the memo.
  const skills = useMemo(() => content.items, [content.items]);

  // Reduced from 6 to 3 decorative icons — the other 3 were off-screen on
  // most viewports and were adding 3 extra Framer Motion animation loops.
  const energyIcons = useMemo(() => [
    { icon: Sun,      position: "top-4 left-4" },
    { icon: Wind,     position: "bottom-4 left-4" },
    { icon: Droplets, position: "top-1/2 right-0 -translate-y-1/2" },
  ], []);

  return (
    <section id="skills" className="py-16 sm:py-20 lg:py-24 px-6 relative" ref={ref}>
      {/* Floating animated energy icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {energyIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.position} opacity-20`}
            animate={{ y: [0, -20, 0], rotate: [0, 360] }}
            transition={{
              y: { duration: 4 + index, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 20 + index * 2, repeat: Infinity, ease: "linear" },
            }}
          >
            <item.icon className="w-16 h-16 text-primary" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">{content.tagline}</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {content.heading} <span className="gradient-text">{content.heading_highlight}</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Skills Progress Bars */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 glass-card rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute -top-4 -right-4 opacity-10">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                <Sun className="w-24 h-24 text-primary" />
              </motion.div>
            </div>

            <h3 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
              <div className="flex gap-2">
                <EnergyIcon icon={Zap} delay={0} />
                <EnergyIcon icon={Leaf} delay={0.2} />
              </div>
              Core Competencies
            </h3>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-5 relative z-10">
              {skills.map((skill, index) => (
                <AnimatedProgressBar key={skill.name} skill={skill} index={index} isInView={isInView} />
              ))}
            </div>
          </motion.div>

          {/* Radar Chart */}
          <SkillsRadarChart skills={skills} isInView={isInView} />
        </div>

        {/* Technical Expertise Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          <motion.div
            className="relative rounded-2xl p-6 overflow-hidden group cursor-pointer"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))", border: "1px solid hsl(var(--primary) / 0.3)" }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(var(--primary) / 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle at center, hsl(var(--primary) / 0.2), transparent 70%)" }} />
            <div className="absolute -bottom-4 -left-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
                <Battery className="w-24 h-24 text-primary" />
              </motion.div>
            </div>
            <div className="relative z-10">
              <motion.div className="flex items-center gap-3 mb-4" initial={{ x: -10, opacity: 0 }} animate={isInView ? { x: 0, opacity: 1 } : {}} transition={{ delay: 0.5 }}>
                <motion.div className="p-3 rounded-xl bg-primary/20 border border-primary/30"
                  animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.4)", "0 0 20px 5px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0.4)"] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  <Sun className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-display font-bold text-primary">Engineering</h3>
              </motion.div>
              <p className="text-foreground/80 text-sm leading-relaxed">Solar PV system design, off-grid storage, EV charging architecture, and biogas installations.</p>
            </div>
          </motion.div>

          <motion.div
            className="relative rounded-2xl p-6 overflow-hidden group cursor-pointer"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))", border: "1px solid hsl(var(--primary) / 0.3)" }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(var(--primary) / 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle at center, hsl(var(--primary) / 0.2), transparent 70%)" }} />
            <div className="absolute -top-4 -right-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <Wind className="w-24 h-24 text-primary" />
              </motion.div>
            </div>
            <div className="relative z-10">
              <motion.div className="flex items-center gap-3 mb-4" initial={{ x: -10, opacity: 0 }} animate={isInView ? { x: 0, opacity: 1 } : {}} transition={{ delay: 0.6 }}>
                <motion.div className="p-3 rounded-xl bg-primary/20 border border-primary/30"
                  animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.4)", "0 0 20px 5px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0.4)"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>
                  <Battery className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-display font-bold text-primary">Business</h3>
              </motion.div>
              <p className="text-foreground/80 text-sm leading-relaxed">Strategic sales, project finance, stakeholder engagement, and market intelligence.</p>
            </div>
          </motion.div>

          <motion.div
            className="relative rounded-2xl p-6 overflow-hidden group cursor-pointer"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))", border: "1px solid hsl(var(--primary) / 0.3)" }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(var(--primary) / 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle at center, hsl(var(--primary) / 0.2), transparent 70%)" }} />
            <div className="absolute -bottom-4 -right-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <Droplets className="w-24 h-24 text-primary" />
              </motion.div>
            </div>
            <div className="relative z-10">
              <motion.div className="flex items-center gap-3 mb-4" initial={{ x: -10, opacity: 0 }} animate={isInView ? { x: 0, opacity: 1 } : {}} transition={{ delay: 0.7 }}>
                <motion.div className="p-3 rounded-xl bg-primary/20 border border-primary/30"
                  animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.4)", "0 0 20px 5px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0.4)"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>
                  <Leaf className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-display font-bold text-primary">Analytics</h3>
              </motion.div>
              <p className="text-foreground/80 text-sm leading-relaxed">Power BI dashboards, GIS mapping, feasibility studies, and energy audit reporting.</p>
            </div>
          </motion.div>
        </motion.div>

        {/* AI Agent & Automation Skills */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <motion.div className="p-2 rounded-xl bg-primary/20 border border-primary/30"
              animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.4)", "0 0 20px 5px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0.4)"] }}
              transition={{ duration: 2, repeat: Infinity }}>
              <Bot className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-display font-bold">
                AI-Augmented <span className="gradient-text">Energy Skills</span>
              </h3>
              <p className="text-foreground/60 text-sm mt-0.5">Applying AI tools to clean energy engineering, EV infrastructure & policy work</p>
            </div>
          </div>

          <motion.div className="glass-card rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
              {AI_AGENT_SKILLS.map((skill, index) => (
                <AnimatedProgressBar key={skill.name} skill={skill} index={index} isInView={isInView} />
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentSkillCards.map((card, index) => (
              <motion.div
                key={card.title}
                className="relative rounded-2xl p-6 overflow-hidden group cursor-pointer"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.04))", border: "1px solid hsl(var(--primary) / 0.25)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.08 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(var(--primary) / 0.25)" }}
              >
                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle at center, hsl(var(--primary) / 0.15), transparent 70%)" }} />
                <div className="relative z-10">
                  <motion.div className="p-3 rounded-xl bg-primary/20 border border-primary/30 w-fit mb-4"
                    animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.4)", "0 0 16px 4px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0.4)"] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}>
                    <card.icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <h4 className="text-base font-display font-bold text-primary mb-2">{card.title}</h4>
                  <p className="text-foreground/75 text-sm leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
