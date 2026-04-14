import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  rating: number;
}

// Fallback data — shown until Supabase responds, or if the table is empty.
const FALLBACK: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Sarah Kamau",
    role: "Director of Sustainability",
    company: "Kenya Power & Lighting",
    content:
      "Roy's expertise in renewable energy systems is exceptional. His work on our solar microgrid project exceeded expectations, delivering both technical excellence and sustainable impact for rural communities.",
    rating: 5,
  },
  {
    id: "2",
    name: "James Mwangi",
    role: "CEO",
    company: "EVChaja Kenya",
    content:
      "Working with Roy on EV charging infrastructure has been transformative. His deep understanding of e-mobility and passion for sustainable transport makes him an invaluable partner in building Africa's EV future.",
    rating: 5,
  },
  {
    id: "3",
    name: "Prof. Elizabeth Odhiambo",
    role: "Research Lead",
    company: "JKUAT Energy Institute",
    content:
      "Roy's research contributions to solar-powered cold chain solutions have directly impacted smallholder farmers. His innovative approach combines technical rigor with real-world applicability.",
    rating: 5,
  },
  {
    id: "4",
    name: "David Njoroge",
    role: "Operations Manager",
    company: "Roam Electric",
    content:
      "Roy's analytical skills and dedication to sustainable mobility are outstanding. He played a key role in our feasibility studies, identifying optimal locations for EV hub deployment.",
    rating: 5,
  },
];

export const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id, name, role, company, content, image, rating")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setTestimonials(
            data.map((t) => ({
              id: t.id,
              name: t.name,
              role: t.role,
              company: t.company,
              content: t.content,
              image: t.image ?? undefined,
              rating: t.rating ?? 5,
            }))
          );
        }
        // On error or empty table, keep FALLBACK (state is already set)
      });
  }, []);

  const navigate = (direction: "prev" | "next") => {
    setCurrentIndex((prev) =>
      direction === "prev"
        ? prev === 0
          ? testimonials.length - 1
          : prev - 1
        : prev === testimonials.length - 1
        ? 0
        : prev + 1
    );
  };

  return (
    <section id="testimonials" className="py-32 px-6 relative" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            What People <span className="gradient-text">Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by industry leaders and partners in the renewable energy and e-mobility sectors.
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Quote icon */}
            <div className="absolute top-6 right-6 opacity-10" aria-hidden="true">
              <Quote className="w-24 h-24 text-primary" />
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-start mb-8">
              <div
                className="flex items-center gap-1"
                aria-label={`Rated ${testimonials[currentIndex]?.rating ?? 5} out of 5 stars`}
              >
                {Array.from({ length: testimonials[currentIndex]?.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" aria-hidden="true" />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("prev")}
                  aria-label="Previous testimonial"
                  className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-border transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => navigate("next")}
                  aria-label="Next testimonial"
                  className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-border transition-colors"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Content */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-8">
                "{testimonials[currentIndex]?.content}"
              </blockquote>

              <div className="flex items-center gap-4">
                {testimonials[currentIndex]?.image ? (
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-14 h-14 rounded-full object-cover"
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-display font-bold text-lg shrink-0"
                    aria-hidden="true"
                  >
                    {testimonials[currentIndex]?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
                <div>
                  <p className="font-display font-semibold text-lg">
                    {testimonials[currentIndex]?.name}
                  </p>
                  <p className="text-muted-foreground">
                    {testimonials[currentIndex]?.role},{" "}
                    {testimonials[currentIndex]?.company}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Dots indicator */}
            <div
              className="flex justify-center gap-2 mt-8"
              role="tablist"
              aria-label="Testimonial navigation"
            >
              {testimonials.map((t, index) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Go to testimonial from ${t.name}`}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "w-2 bg-black/10 dark:bg-white/20 hover:bg-black/20 dark:hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mini testimonials grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {testimonials
            .filter((_, i) => i !== currentIndex)
            .slice(0, 2)
            .map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                onClick={() =>
                  setCurrentIndex(testimonials.findIndex((t) => t.id === testimonial.id))
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setCurrentIndex(
                      testimonials.findIndex((t) => t.id === testimonial.id)
                    );
                  }
                }}
                aria-label={`Read full testimonial from ${testimonial.name}`}
                className="glass-card rounded-xl p-6 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-primary/30 flex items-center justify-center text-white font-medium text-sm shrink-0"
                      aria-hidden="true"
                    >
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
