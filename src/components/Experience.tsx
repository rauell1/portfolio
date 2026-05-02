import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Calendar, MapPin, ChevronRight, ExternalLink, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string[];
  current: boolean;
  isFounder?: boolean;
  externalUrl?: string;
}

interface ExperienceContent {
  tagline: string;
  heading: string;
  heading_highlight: string;
  items: Experience[];
}

const DEFAULT_ITEMS: Experience[] = [
  {
    company: "SafariCharge",
    role: "Founder",
    location: "Nairobi, Kenya",
    period: "2024 - Present",
    description: [
      "Founded an EV charging infrastructure startup focused on expanding access to sustainable mobility across East Africa",
      "Leading strategic partnerships and market development for EV charging solutions",
    ],
    current: true,
    isFounder: true,
    externalUrl: "https://safaricharge-website.vercel.app/",
  },
  {
    company: "Roam Electric Ltd",
    role: "Junior Sales Consultant",
    location: "Nairobi, Kenya",
    period: "Jun 2025 - Present",
    description: [
      "Increased sales pipeline opportunities by 25% through targeted promotion of solar equipment and EV charging hubs across Nairobi and Kiambu counties",
      "Generated over KES 10 million in monthly sales by cultivating strong relationships with EPCs, transport operators, and energy distributors",
    ],
    current: true,
  },
  {
    company: "EVChaja",
    role: "Business Strategy & Operations Consultant",
    location: "Remote - Nairobi",
    period: "Jan 2025 - Jun 2025",
    description: [
      "Delivered market intelligence reports that shaped EV charging hub expansion, contributing to 3 investment-ready projects",
      "Engaged with regulators and NGOs (EPRA, EMAK) to influence policy discussions, securing compliance for proposed projects",
      "Facilitated stakeholder consultations that attracted KES 50M+ in potential investment toward EV infrastructure",
    ],
    current: false,
  },
  {
    company: "Frisco Engineering Limited",
    role: "Technical Sales Engineer Intern",
    location: "Nairobi, Kenya",
    period: "Feb 2024 - Jul 2024",
    description: [
      "Designed and sized 10+ solar PV backup systems worth KES 3M+, closing multiple agricultural and residential sales",
      "Conducted 15+ energy audits and feasibility studies, providing clients with evidence-based investment decisions",
      "Facilitated training workshops with a 95% client satisfaction rate, strengthening adoption of renewable energy systems",
    ],
    current: false,
  },
  {
    company: "HomeBiogas Kenya",
    role: "Technical Sales Engineer Intern",
    location: "Nairobi, Kenya",
    period: "Jan 2023 - Feb 2024",
    description: [
      "Supported the installation of 10+ household biogas systems, reducing reliance on biomass and LPG fuels",
      "Led community engagement sessions that cut system failures by 30% through effective after-sales training",
      "Expanded reach by building 5+ local partnerships, accelerating market adoption of biogas in peri-urban communities",
    ],
    current: false,
  },
  {
    company: "Farmers Choice Limited",
    role: "Production Intern",
    location: "Nairobi, Kenya",
    period: "Dec 2021 - Mar 2022",
    description: [
      "Conducted energy and water efficiency audits, identifying opportunities for 10% reduction in resource use",
      "Developed sustainability reports highlighting waste reduction and energy efficiency initiatives",
    ],
    current: false,
  },
];

const DEFAULT: ExperienceContent = {
  tagline: "Career Journey",
  heading: "Professional",
  heading_highlight: "Experience",
  items: DEFAULT_ITEMS,
};

export const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [content, setContent] = useState<ExperienceContent>(DEFAULT);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("page_sections")
      .select("content")
      .eq("page", "home")
      .eq("section", "experience")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setContent(data.content as ExperienceContent);
      });
  }, []);

  const experiences = content.items;

  return (
    <section id="experience" className="py-16 sm:py-24 lg:py-32 px-6 relative" ref={ref}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Timeline */}
        <div className="relative">
          {/* FIX: timeline line uses left-2 (not left-0) so it stays inside the
              container on screens narrower than 375px and doesn't cause horizontal
              overflow. On md+ it snaps to the center as before. */}
          <div className="absolute left-2 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative mb-12 md:mb-16 ${
                index % 2 === 0 ? "md:pr-[calc(50%+2rem)]" : "md:pl-[calc(50%+2rem)]"
              }`}
            >
              {/* Timeline dot — left-2 on mobile matches the line position */}
              <div className={`absolute left-2 md:left-1/2 top-0 w-4 h-4 rounded-full ${
                exp.current ? "bg-primary animate-pulse-glow" : "bg-primary/50"
              } border-4 border-background md:-translate-x-1/2 -translate-x-1/2 z-10`} />

              {/* Content card — min-w-0 prevents content from stretching the card
                  beyond the viewport on narrow screens */}
              <div className={`ml-10 md:ml-0 min-w-0 glass-card rounded-2xl p-6 card-hover ${
                exp.isFounder ? "ring-2 ring-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-[0_0_25px_-5px_hsl(var(--primary)/0.4)] animate-pulse-glow" : ""
              }`}>
                {/* Header — flex-wrap ensures period/location wraps on 320px screens */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {exp.isFounder && exp.externalUrl ? (
                        <a
                          href={exp.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl font-display font-bold hover:text-primary transition-colors inline-flex items-center gap-2 group"
                        >
                          {exp.company}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <h3 className="text-xl font-display font-bold">{exp.company}</h3>
                      )}
                      {exp.isFounder && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/30 flex items-center gap-1 shadow-[0_0_12px_-2px_rgba(245,158,11,0.5)] animate-pulse">
                          <Award className="w-3 h-3" />
                          Founder
                        </span>
                      )}
                      {exp.current && !exp.isFounder && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-medium">{exp.role}</p>
                  </div>
                  {/* FIX: text-left on mobile so period/location doesn't overflow
                      when the card is narrow. text-right restored on sm+. */}
                  <div className="text-left sm:text-right shrink-0">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <ul className="space-y-2">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
