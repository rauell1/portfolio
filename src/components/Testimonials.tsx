import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  organisation: string;
  quote: string;
  initials: string;
  accent: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Samuel Kariuki",
    role: "Field Operations Manager",
    organisation: "Roam Electric",
    quote:
      "Roy's technical depth is matched by his ability to communicate complex energy systems to clients and field teams. His site commissionings have been consistently smooth across all our Nairobi deployments.",
    initials: "SK",
    accent: "from-cyan-500 to-blue-500",
  },
  {
    name: "Amina Wangari",
    role: "Programme Lead",
    organisation: "Africa Fellowship for Young Energy Leaders",
    quote:
      "One of our standout fellows. Roy brought both technical rigour and a clear vision for Africa's clean energy transition. His policy engagement and peer contributions elevated the entire cohort.",
    initials: "AW",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    name: "Peter Odhiambo",
    role: "Head of Projects",
    organisation: "HomeBiogas Kenya",
    quote:
      "Roy designed and installed biogas systems for multiple households across Western Kenya, always on time and on spec. His ability to train local installers added lasting value beyond the project itself.",
    initials: "PO",
    accent: "from-orange-500 to-amber-500",
  },
];

export const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-16 sm:py-24 lg:py-32 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono-custom text-xs uppercase tracking-widest mb-4 block">// Peer Recognition</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
            What{" "}
            <span className="font-editorial italic font-semibold text-primary">
              Colleagues Say
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed text-justify">
            Perspectives from professionals I've worked alongside across clean energy, e-mobility, and community programmes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -4 }}
              className="relative bg-card rounded-2xl border border-border/60 p-6 flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.accent} flex items-center justify-center flex-shrink-0`}>
                <Quote className="w-4 h-4 text-white" />
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1 text-justify">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.accent} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-[11px] font-bold text-white">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none mb-0.5">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role} · {t.organisation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
