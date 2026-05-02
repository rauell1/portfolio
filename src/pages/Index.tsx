import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { lazy, Suspense } from "react";

const ParticleBackground = lazy(() =>
  import("@/components/ParticleBackground").then((m) => ({ default: m.ParticleBackground }))
);
const About      = lazy(() => import("@/components/About").then((m) => ({ default: m.About })));
const Projects   = lazy(() => import("@/components/Projects").then((m) => ({ default: m.Projects })));
const Experience = lazy(() => import("@/components/Experience").then((m) => ({ default: m.Experience })));
const Skills     = lazy(() => import("@/components/Skills").then((m) => ({ default: m.Skills })));
const Leadership = lazy(() => import("@/components/Leadership").then((m) => ({ default: m.Leadership })));
const Contact    = lazy(() => import("@/components/Contact").then((m) => ({ default: m.Contact })));

// Minimal height-placeholder shown while a section chunk loads.
// Keeps the layout stable (no CLS) and gives the user a visual cue
// that content is on its way without a full-page spinner.
const SectionSkeleton = () => <div className="h-24 w-full" aria-hidden="true" />;

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ParticleBackground is purely decorative — its own Suspense so it
          never blocks any section from rendering */}
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>

      <Navbar />
      <Hero />

      <main className="relative z-10">
        {/* Each section has its own Suspense boundary so sections render
            independently as their JS chunks arrive over the network.
            Without this, one slow chunk would hold up all sections below it. */}
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
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
