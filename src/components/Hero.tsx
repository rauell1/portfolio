import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Stat { value: string; label: string }
interface HeroContent {
  availability: string;
  name: string;
  title: string;
  description: string;
  cta_primary: string;
  cta_secondary: string;
  stats: Stat[];
}

const DEFAULT: HeroContent = {
  availability: "Available for opportunities",
  name: "Roy Otieno",
  title: "Clean Energy Engineer & E-Mobility Specialist",
  description:
    "Driving Africa's sustainable transition through solar infrastructure, EV charging networks, and innovative energy solutions.",
  cta_primary: "View My Work",
  cta_secondary: "Let's Connect",
  stats: [
    { value: "10+", label: "Solar Projects" },
    { value: "3+", label: "Years Experience" },
    { value: "5+", label: "EV Hub Sites" },
  ],
};

export const Hero = () => {
  const [content, setContent] = useState<HeroContent>(DEFAULT);
  // FIX: respect prefers-reduced-motion in Framer Motion animations
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("page_sections")
      .select("content")
      .eq("page", "home")
      .eq("section", "hero")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setContent(data.content as HeroContent);
      });
  }, []);

  const scrollToWork = () => {
    const el = document.querySelector("#work");
    if (el) smoothScrollTo(el);
  };

  // FIX: short-circuit all entrance animations when reduced motion is preferred
  const fadeUp = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: {} }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      };

  return (
    // FIX: use <section> with role label for correct landmark semantics
    <section
      aria-label="Introduction"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Availability badge */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: prefersReducedMotion ? 0 : 0.0 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/30"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-medium text-primary">{content.availability}</span>
        </motion.div>

        {/* Main heading — h1 is correct here, only one per page */}
        <motion.h1
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: prefersReducedMotion ? 0 : 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl font-display font-bold mb-6 leading-tight"
        >
          <span className="text-foreground">I'm </span>
          <span className="gradient-text">{content.name}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: prefersReducedMotion ? 0 : 0.35 }}
          className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 font-light"
        >
          {content.title}
        </motion.p>

        {/* Description */}
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: prefersReducedMotion ? 0 : 0.45 }}
          className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-12"
        >
          {content.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: prefersReducedMotion ? 0 : 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={scrollToWork}
            // FIX: added aria-label so the icon-bearing button has a clear accessible name
            aria-label="View my work"
            className="group flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl btn-glow"
          >
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            {content.cta_primary}
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" aria-hidden="true" />
          </button>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector("#contact");
              if (el) smoothScrollTo(el);
            }}
            className="px-8 py-4 font-semibold rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            {content.cta_secondary}
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: prefersReducedMotion ? 0 : 0.65 }}
          className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-4 sm:gap-8 mt-16 sm:mt-20 max-w-3xl mx-auto"
        >
          {content.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-100 transition-opacity"
        onClick={scrollToWork}
        // FIX: make scroll indicator keyboard-accessible
        role="button"
        tabIndex={0}
        aria-label="Scroll to work section"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToWork(); } }}
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-primary/60" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  );
};
