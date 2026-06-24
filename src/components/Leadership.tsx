import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Users, Award, Leaf, Sparkles, Heart } from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Globe, Users, Award, Leaf,
};

const accentMap = [
  { gradient: "from-yellow-500 to-orange-500", soft: "from-yellow-500/10 to-orange-500/10", border: "border-yellow-500/25", ring: "ring-yellow-500/20" },
  { gradient: "from-blue-500 to-cyan-500",     soft: "from-blue-500/10 to-cyan-500/10",     border: "border-blue-500/25",   ring: "ring-blue-500/20"   },
  { gradient: "from-emerald-500 to-green-500", soft: "from-emerald-500/10 to-green-500/10", border: "border-emerald-500/25", ring: "ring-emerald-500/20" },
  { gradient: "from-purple-500 to-pink-500",   soft: "from-purple-500/10 to-pink-500/10",   border: "border-purple-500/25", ring: "ring-purple-500/20"  },
];

interface LeaderItem { title: string; role?: string; subtitle: string; year: string; icon: string }
interface LeadershipContent {
  tagline: string;
  heading: string;
  heading_highlight: string;
  description: string;
  items: LeaderItem[];
}

const DEFAULT: LeadershipContent = {
  tagline: "Making an Impact",
  heading: "Leadership &",
  heading_highlight: "Engagement",
  description: "Committed to driving positive change through community engagement, policy advocacy, and creative leadership.",
  items: [
    {
      title: "Africa Fellowship for Young Energy Leaders",
      role: "Fellow",
      subtitle: "Selected for this pan-African clean energy leadership programme (Oct 2025 to Mar 2026). Key outcome: deepened the solar simulation modules at the core of SafariCharge, applying cross-country peer insights and policy frameworks directly to the project's technical design.",
      year: "Oct 2025 to Mar 2026",
      icon: "Award",
    },
    {
      title: "Kenya Youth Parliament for Water",
      role: "Events Coordinator",
      subtitle: "Kenyan chapter of the World Youth Parliament for Water. Coordinating and building up water advocacy groups across Kenya, organising campaigns on climate-resilient water systems, sustainable governance, and youth-led water policy reform.",
      year: "Apr 2026 to Present",
      icon: "Globe",
    },
    {
      title: "Greenwave Society",
      role: "Head of Design",
      subtitle: "Integrating the Society's environmental mission into every visual design element, translating community values into cohesive branding, campaign materials, and creative direction that amplifies the organisation's sustainability message.",
      year: "2026 to Present",
      icon: "Leaf",
    },
    {
      title: "Community Trainer",
      role: "Workshop Facilitator",
      subtitle: "Delivering hands-on workshops on solar irrigation, renewable energy systems, and circular-economy practices for rural farming communities across Kenya.",
      year: "Ongoing",
      icon: "Users",
    },
  ],
};

export const Leadership = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const content = DEFAULT;

  return (
    <section id="leadership" className="py-16 sm:py-24 lg:py-32 px-6 relative" ref={ref}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-10 opacity-[0.06]"
        >
          <Sparkles className="w-32 h-32 text-primary" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-10 opacity-[0.06]"
        >
          <Heart className="w-24 h-24 text-primary" />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto">
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
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed text-justify">
            {content.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {content.items.map((item, index) => {
            const Icon = iconMap[item.icon] || Award;
            const accent = accentMap[index % accentMap.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border ${accent.border} bg-card overflow-hidden group hover:shadow-lg transition-all duration-300`}
              >
                {/* Top accent bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${accent.gradient}`} />

                <div className="p-6">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${accent.soft} border ${accent.border} flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <span className="font-mono-custom text-[10px] tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full whitespace-nowrap self-start">
                      {item.year}
                    </span>
                  </div>

                  {/* Organisation */}
                  <h3 className="font-display font-semibold text-base sm:text-lg mb-1.5 group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Role chip */}
                  {item.role && (
                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md bg-gradient-to-r ${accent.soft} border ${accent.border} mb-3`}>
                      {item.role}
                    </span>
                  )}

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed text-justify">
                    {item.subtitle}
                  </p>
                </div>

                {/* Subtle glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${accent.soft} opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`} />
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
};
