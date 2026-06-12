import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { lazy, Suspense, useState } from "react";
import { IntroLoader } from "@/components/ui/IntroLoader";
import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { PAGE_SEO, SITE_URL } from "@/lib/seo";

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

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Roy Okola Otieno",
  url: SITE_URL,
  image: `${SITE_URL}/images/og-image.jpg`,
  jobTitle: "Technical Operations and Sales Engineer",
  description: "Clean energy and e-mobility engineer with 3+ years of experience in solar PV, EV charging infrastructure, and technical feasibility studies across East Africa.",
  email: "royokola3@gmail.com",
  telephone: "+254726683835",
  address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
  sameAs: [
    "https://www.linkedin.com/in/roy-otieno-60b190174/",
    "https://x.com/rauell_",
    "https://github.com/rauell1",
  ],
  worksFor: { "@type": "Organization", name: "Roam Electric Ltd", url: "https://www.roamelectric.com" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Jomo Kenyatta University of Agriculture and Technology" },
    { "@type": "CollegeOrUniversity", name: "University of East London" },
  ],
  knowsAbout: [
    "Solar PV System Design", "EV Charging Infrastructure", "Energy Audits",
    "Technical Feasibility Studies", "E-Mobility", "Renewable Energy",
    "Off-Grid Systems", "Battery Management Systems",
  ],
};

const Index = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SEO {...PAGE_SEO.home} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(PERSON_SCHEMA)}</script>
      </Helmet>
      {loading && <IntroLoader onComplete={() => setLoading(false)} />}

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
