import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Sarah Kamau",
    role: "Director of Sustainability",
    company: "Kenya Power & Lighting",
    content: "Roy's expertise in renewable energy systems is exceptional. His work on our solar microgrid project exceeded expectations, delivering both technical excellence and sustainable impact for rural communities.",
    rating: 5,
  },
  {
    id: "2",
    name: "James Mwangi",
    role: "CEO",
    company: "EVChaja Kenya",
    content: "Working with Roy on EV charging infrastructure has been transformative. His deep understanding of e-mobility and passion for sustainable transport makes him an invaluable partner in building Africa's EV future.",
    rating: 5,
  },
  {
    id: "3",
    name: "Prof. Elizabeth Odhiambo",
    role: "Research Lead",
    company: "JKUAT Energy Institute",
    content: "Roy's research contributions to solar-powered cold chain solutions have directly impacted smallholder farmers. His innovative approach combines technical rigor with real-world applicability.",
    rating: 5,
  },
  {
    id: "4",
    name: "David Njoroge",
    role: "Operations Manager",
    company: "Roam Electric",
    content: "Roy's analytical skills and dedication to sustainable mobility are outstanding. He played a key role in our feasibility studies, identifying optimal locations for EV hub deployment.",
    rating: 5,
  },
];

export const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <section id="testimonials" className="py-32 px-6 relative" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            <div className="absolute top-6 right-6 opacity-10">
              <Quote className="w-24 h-24 text-primary" />
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-1">
                {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("prev")}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("next")}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
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
                "{testimonials[currentIndex].content}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-display font-bold text-lg">
                  {testimonials[currentIndex].name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-display font-semibold text-lg">{testimonials[currentIndex].name}</p>
                  <p className="text-muted-foreground">
                    {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-white/20 hover:bg-white/40"
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
                onClick={() => setCurrentIndex(testimonials.findIndex(t => t.id === testimonial.id))}
                className="glass-card rounded-xl p-6 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-primary/30 flex items-center justify-center text-white font-medium text-sm">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </div>
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
