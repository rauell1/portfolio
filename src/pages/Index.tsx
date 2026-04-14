import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { lazy, Suspense } from "react";

const ParticleBackground = lazy(() =>
  import("@/components/ParticleBackground").then((m) => ({
    default: m.ParticleBackground,
  }))
);

const About = lazy(() => import("@/components/About").then((m) => ({ default: m.About })));
// Projects now contains both the Projects tab AND the Impact (case studies) tab
const Projects = lazy(() => import("@/components/Projects").then((m) => ({ default: m.Projects })));
const Experience = lazy(() => import("@/components/Experience").then((m) => ({ default: m.Experience })));
const Skills = lazy(() => import("@/components/Skills").then((m) => ({ default: m.Skills })));
const Leadership = lazy(() => import("@/components/Leadership").then((m) => ({ default: m.Leadership })));
// BlogTeaser replaces the standalone CaseStudies section on the homepage
const BlogTeaser = lazy(() => import("@/components/BlogTeaser").then((m) => ({ default: m.BlogTeaser })));
const Contact = lazy(() => import("@/components/Contact").then((m) => ({ default: m.Contact })));

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <Navbar />
      <Hero />
      <main className="relative z-10">
        <Suspense fallback={<div className="h-24" />}>
          <About />
          <Projects />
          <Experience />
          <Skills />
          <Leadership />
          <BlogTeaser />
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
