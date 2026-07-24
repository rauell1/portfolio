import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Download, ArrowLeft, Mail, Phone, MapPin, Linkedin, 
  GraduationCap, Briefcase, Award, Users, Lightbulb,
  Calendar, ChevronRight, Cpu, Leaf, BarChart3, Settings
} from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { buildWebPageSchema, buildBreadcrumbSchema } from "@/lib/structured-data";

const experiences = [
  {
    company: "Roam Electric Limited",
    role: "Technical Operations & Sales Engineer",
    location: "Nairobi, Kenya · Hybrid",
    period: "Jun 2025 - Present",
    achievements: [
      "Conduct multi-site technical assessments and feasibility studies for EV charging and solar hybrid system deployments across Nairobi and Kiambu — coordinating field technicians, clients, and internal engineering teams end-to-end.",
      "Monitor energy system performance across a 25%+ expanded portfolio of active EV and solar sites; identify and escalate technical faults to maintain uptime targets.",
      "Size and quote solar hybrid systems using Deye inverters, Solis string inverters, and Jinko solar panels — proposals include MPPT voltage verification and battery bank sizing.",
      "Deliver 10+ product and technical trainings to commercial and fleet clients on EV hardware, charging systems, and energy storage components.",
      "Support EV charging network expansion across Kenya including a 7-station rollout with Be Energy Limited — managing site assessments, partner coordination, and commercial tenancy negotiations.",
    ],
  },
  {
    company: "rauell.systems",
    role: "Founder & Full-Stack Engineer",
    location: "Nairobi, Kenya · Remote",
    period: "Jan 2024 - Present",
    achievements: [
      "SafariCharge: Solar monitoring and financial simulation dashboard for the Kenyan market (React, Next.js, Vercel).",
      "finance.rauell.systems: Personal finance tracker with M-Pesa SMS automation pipeline (MacroDroid + Supabase + Node.js) — fully deployed and in production.",
      "WASH Governance Platform (kypw.org): Reporting and coordination tool for Kenya Youth Parliament for Water (Next.js, Supabase, PostgreSQL).",
      "Roam Electric Charging Points Tracker: Real-time EV charging infrastructure visibility platform for Kenya (Next.js 16, Neon PostgreSQL, NextAuth).",
    ],
  },
  {
    company: "EVChaja",
    role: "Infrastructure Engineer",
    location: "Nairobi, Kenya · Hybrid",
    period: "Apr 2025 - Jun 2025",
    achievements: [
      "Led technical scoping and infrastructure analysis for 3 investment-ready EV charging projects — engineering reports supported stakeholder consultations that attracted KES 50M+ in potential investment.",
      "Engaged EPRA and EMAK on regulatory compliance and technical risk mapping across charging hardware, power electronics, battery management systems (BMS), and fleet-based energy models.",
    ],
  },
  {
    company: "Frisco Engineering Limited",
    role: "Technical Sales Engineer Intern",
    location: "Utawala, Kenya · On-site",
    period: "Feb 2024 - Jul 2024",
    achievements: [
      "Designed and delivered 10+ solar PV and backup power systems (KES 3M+ total project value) — conducting 15+ energy audits and site feasibility assessments for agricultural and commercial clients.",
      "Used PVsyst and PV*SOL for solar system modelling; prepared SLDs, BOMs, and technical proposals for off-grid and grid-tied systems.",
      "Managed system commissioning, client handover, and after-sales technical support — achieving 95% customer satisfaction through structured issue tracking and resolution.",
    ],
  },
];

const researchProjects = [
  "Designed and evaluated a solar-powered evaporative cooling system, extending tomato shelf life by seven days in off-grid environments",
  "Supported solar electrification of six off-grid sites in the Mara Region, reducing reliance on diesel generation",
  "Contributed to feasibility studies for over ten EV charging hub sites, integrating solar generation and second-life battery concepts",
  "Supported biogas installations aligned with circular economy and regenerative agriculture principles",
  "Engineered solar-powered borehole irrigation systems for smallholder farmers in semi-arid regions",
];

const education = [
  {
    institution: "University of East London (via Unicaf)",
    degree: "Master of Business Administration (MBA)",
    location: "London, UK",
    period: "Sept 2025 - Current",
  },
  {
    institution: "Jomo Kenyatta University of Agriculture and Technology",
    degree: "BSc. Agricultural and Biosystems Engineering",
    details: "Second Class Honors, Upper Division",
    location: "Juja, Kenya",
    period: "Sept 2018 - Dec 2023",
  },
];

const trainingCategories = [
  {
    title: "Electric Mobility",
    icon: Cpu,
    items: [
      "Battery Technology Training – Advanced (Siemens Stiftung / pManifold, Oct 2025)",
      "Battery Technology Training – Basic (Siemens Stiftung / pManifold, Sep 2025)",
      "Elum Certified Installer – ePowerControl ES/MC Series (Elum Energy, Dec 2025)",
      "Electric Mobility Technical Training (Advanced Mobility Centre / Kenya Power, Jan 2025)",
      "Electric Mobility: Key Concepts & Strategies (TUMI / PEM Motion, Nov 2025)",
      "Electric Two- and Three-Wheelers: Steering the Mobility Revolution (TUMI, Jun 2024)",
      "Exploring the World of Electric Buses (TUMI / PEM Motion, Jun 2024)",
    ],
  },
  {
    title: "Solar & Renewable Energy",
    icon: Leaf,
    items: [
      "Africa Fellowship – Solar PV Engineering Track, Cohort 5 (AFYEL, Jan 2026)",
      "Solar Systems Design, Sizing & Commissioning (T2) (Solar Training Kenya, Feb 2025)",
    ],
  },
  {
    title: "Data & Sustainable Mobility",
    icon: BarChart3,
    items: [
      "Data Fundamentals for Sustainable Mobility (TUMI / GIZ / Cities Forum, 2025)",
    ],
  },
];

const skills = {
  energy: [
    "Solar PV Design",
    "Solar Hybrid Sizing",
    "EV Charging Infrastructure",
    "MPPT",
    "Battery Storage",
    "PVsyst",
    "PV*SOL",
    "HOMER",
    "Deye · Solis · Jinko Solar",
  ],
  operations: [
    "Multi-Site Operations",
    "Technical Feasibility Studies",
    "KPI Reporting",
    "Fault Escalation",
    "Site Commissioning",
    "EPRA/EMAK Regulatory Compliance",
  ],
  sales: [
    "B2B Key Account Management",
    "Technical Proposals",
    "CRM",
    "Stakeholder Mapping",
    "Client Training",
    "Lead Conversion",
  ],
  engineering: [
    "Full-Stack Development",
    "Next.js",
    "React",
    "Node.js",
    "Supabase",
    "PostgreSQL",
    "Vercel",
    "REST APIs",
    "M-Pesa Integration",
  ],
};

const leadership = [
  {
    title: "Africa Fellow, Young Energy Leaders — Cohort 5",
    subtitle: "Multidisciplinary fellowship advancing clean-energy innovation and the African energy transition; Solar PV Engineering Track completed Jan 2026.",
    period: "2025 - 2026 (Completed)",
  },
  {
    title: "Event Coordinator & Member, Kenya Youth Parliament for Water (KYPW)",
    subtitle: "Lead webinars, policy dialogues, and field outreach for the national chapter. Coordinated Menstrual Hygiene Day 2026 at Lang'ata Women's Prison, featured in Citizen Digital.",
    period: "2024 - Present",
  },
  {
    title: "Community Trainer",
    subtitle: "Workshops on solar irrigation, renewable energy, and circular-economy practices for rural farmers.",
    period: "Ongoing",
  },
];

const ResumePage = () => {
  const p = PAGE_SEO.resume;
  const webPageSchema = buildWebPageSchema({
    name: p.title,
    description: p.description,
    url: p.canonical,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '' },
    { name: 'Resume' },
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO page="resume" structuredData={[webPageSchema, breadcrumbSchema]} />
      <ParticleBackground />
      
      {/* Header */}
      <header className="relative z-10 py-8 px-6 border-b border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </Link>
          <a
            href="/Roy_Otieno_CV.pdf"
            download
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors btn-glow"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <img
              src="/favicon.svg"
              alt="Roy Otieno"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Roy <span className="gradient-text">Otieno</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Clean Energy Engineer & E-Mobility Specialist
            </p>
            
            {/* Contact Info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href="mailto:royokola3@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> royokola3@gmail.com
              </a>
              <a href="tel:+254726683835" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" /> +254 726 683 835
              </a>
              <span className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" /> Nairobi, Kenya
              </span>
              <a 
                href="https://www.linkedin.com/in/roy-otieno-60b190174/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </motion.section>

          {/* Profile Summary */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              Profile
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Technical Operations &amp; Sales Engineer with 3+ years driving Kenya's solar PV and EV charging sectors — leading
              multi-site feasibility studies, B2B key account sales, EPRA/EMAK regulatory engagement, and technical training for
              Roam Electric's growing portfolio. Independent full-stack engineer at rauell.systems, shipping live products across
              energy, finance, and WASH sectors. Africa Fellow, Young Energy Leaders Cohort 5 (Completed 2026). MBA candidate,
              University of East London.
            </p>
          </motion.section>

          {/* Education */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-lg">{edu.institution}</h3>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-primary font-medium">{edu.degree}</p>
                  {edu.details && <p className="text-sm text-muted-foreground">{edu.details}</p>}
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {edu.location}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Experience */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              Professional Experience
            </h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-lg">{exp.company}</h3>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-primary font-medium mb-1">{exp.role}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3" />
                    {exp.location}
                  </p>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Research & Project Experience */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              Research and Project Experience
            </h2>
            <ul className="space-y-3">
              {researchProjects.map((project, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{project}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Leadership & Civic Engagement */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Leadership and Civic Engagement
            </h2>
            <div className="space-y-4">
              {leadership.map((item, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      {item.subtitle && <p className="text-sm text-muted-foreground">{item.subtitle}</p>}
                    </div>
                    <span className="text-sm text-muted-foreground">{item.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Professional Training & Certifications */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Professional Training and Certifications
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {trainingCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-black/5 dark:bg-white/5 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <category.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-primary">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Skills */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Skills
            </h2>
            <div className="space-y-6">
              {[
                { label: "Energy & EV", key: "energy" as const },
                { label: "Technical Ops", key: "operations" as const },
                { label: "Sales & BD", key: "sales" as const },
                { label: "Engineering", key: "engineering" as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <h3 className="font-bold text-primary mb-3">{label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills[key].map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default ResumePage;
