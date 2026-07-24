import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { profilePageSchema, websiteSchema } from "@/lib/structured-data";

const ParticleBackground = lazy(() =>
  import("@/components/ParticleBackground").then((m) => ({ default: m.ParticleBackground }))
);
const About      = lazy(() => import("@/components/About").then((m) => ({ default: m.About })));
const Projects   = lazy(() => import("@/components/Projects").then((m) => ({ default: m.Projects })));
const Experience = lazy(() => import("@/components/Experience").then((m) => ({ default: m.Experience })));
const Skills     = lazy(() => import("@/components/Skills").then((m) => ({ default: m.Skills })));
const Leadership    = lazy(() => import("@/components/Leadership").then((m) => ({ default: m.Leadership })));
const Testimonials  = lazy(() => import("@/components/Testimonials").then((m) => ({ default: m.Testimonials })));
const Contact       = lazy(() => import("@/components/Contact").then((m) => ({ default: m.Contact })));

const SectionSkeleton = () => <div className="h-24 w-full" aria-hidden="true" />;



const Index = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="min-h-screen overflow-x-hidden bg-background text-foreground"
  >
    <SEO {...PAGE_SEO.home} structuredData={[profilePageSchema, websiteSchema]} />

    <Suspense fallback={null}>
      <ParticleBackground />
    </Suspense>

    <Navbar />
    <Hero />

    <main className="relative z-10">
      <Suspense fallback={<SectionSkeleton />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Skills />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Leadership />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Contact />
      </Suspense>
    </main>

    <Footer />
  </motion.div>
);

export default Index;
