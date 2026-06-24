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
    company: "Roam Electric Ltd",
    role: "Technical Operations and Sales Engineer",
    location: "Nairobi, Kenya",
    period: "Jun 2025 - Present",
    description: [
      "Conduct multi-site technical assessments and feasibility studies for EV charging and solar energy system deployments across Nairobi and Kiambu, coordinating between field technicians, clients, and internal engineering teams to resolve infrastructure issues end-to-end.",
      "Monitor energy system performance across a 25%+ expanded portfolio of active sites, identifying and escalating technical faults to maintain service continuity and uptime targets.",
      "Deliver 10+ product and technical trainings to clients, building operational capability in EV hardware, charging systems, and energy storage components across commercial and fleet accounts.",
      "Prepare structured technical reports on system status, operational issues, and follow-up actions, maintaining accurate documentation across all client engagements and site records.",
    ],
    current: true,
  },
  {
    company: "EVChaja",
    role: "EV Infrastructure Engineer and Consultant",
    location: "Remote, Nairobi",
    period: "Jan 2025 - Jun 2025",
    description: [
      "Led technical scoping and infrastructure analysis for 3 investment-ready EV charging projects, synthesising field data, grid assessments, and hardware specifications into engineering reports for decision-makers.",
      "Engaged regulators (EPRA, EMAK) to support compliance readiness and technical risk mapping for EV charging network deployments across Kenya, ensuring installations met applicable safety and grid standards.",
      "Supported stakeholder consultations that attracted KES 50M+ in potential investment by clearly presenting technical project viability and operational frameworks to prospective partners.",
    ],
    current: false,
  },
  {
    company: "Frisco Engineering Limited",
    role: "Technical Sales Engineer Intern",
    location: "Nairobi, Kenya",
    period: "Feb 2024 - Jul 2024",
    description: [
      "Designed and delivered 10+ solar PV and backup power systems (KES 3M+ total value), conducting 15+ energy audits and site feasibility assessments to specify correctly sized, reliable systems for agricultural and commercial clients.",
      "Managed system commissioning, client handover, and after-sales technical support, achieving 95% customer satisfaction through structured issue tracking and resolution.",
    ],
    current: false,
  },
  {
    company: "HomeBiogas Kenya",
    role: "Technical Sales Engineer Intern",
    location: "Nairobi, Kenya",
    period: "Jan 2023 - Mar 2024",
    description: [
      "Supported installation, commissioning, and performance monitoring of 10+ household biogas systems, reducing system failures by 30% through structured after-sales technical training and fault tracking.",
      "Built 5+ local partnerships to accelerate clean-energy adoption in peri-urban and rural markets, providing hands-on technical support and operator training.",
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
          <span className="text-primary font-mono-custom text-xs uppercase tracking-widest mb-4 block">// {content.tagline}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
            {content.heading}{" "}
            <span className="font-editorial italic font-semibold text-primary">
              {content.heading_highlight}
            </span>
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
                          className="text-lg font-display font-bold hover:text-primary transition-colors inline-flex items-center gap-2 group"
                        >
                          {exp.company}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <h3 className="text-lg font-display font-bold">{exp.company}</h3>
                      )}
                      {exp.isFounder && (
                        <span className="px-2 py-0.5 text-[10px] font-mono-custom bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/30 flex items-center gap-1 shadow-[0_0_12px_-2px_rgba(245,158,11,0.5)] animate-pulse">
                          <Award className="w-3 h-3" />
                          Founder
                        </span>
                      )}
                      {exp.current && !exp.isFounder && (
                        <span className="px-2 py-0.5 text-[10px] font-mono-custom bg-primary/20 text-primary rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-medium text-sm">{exp.role}</p>
                  </div>
                  {/* FIX: text-left on mobile so period/location doesn't overflow
                      when the card is narrow. text-right restored on sm+. */}
                  <div className="text-left sm:text-right shrink-0">
                    <div className="flex items-center gap-1 text-[11px] font-mono-custom text-muted-foreground mb-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono-custom text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <ul className="space-y-2">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground text-justify">
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
