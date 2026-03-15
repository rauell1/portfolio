import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Download, ArrowLeft, Mail, Phone, MapPin, Linkedin, 
  GraduationCap, Briefcase, Award, Users, Lightbulb,
  Calendar, ChevronRight, Cpu, Leaf, BarChart3, Settings
} from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";

const experiences = [
  {
    company: "Roam Electric Ltd",
    role: "Junior Sales Consultant",
    location: "Nairobi, Kenya",
    period: "Jun 2025 - Present",
    achievements: [
      "Increased sales pipeline opportunities by 25% through targeted promotion of solar equipment and EV charging hubs across Nairobi and Kiambu counties",
      "Generated over KES 10 million in monthly sales by cultivating strong relationships with EPCs, transport operators, and energy distributors",
    ],
  },
  {
    company: "EVChaja",
    role: "Business Strategy & Operations Consultant",
    location: "Remote - Nairobi",
    period: "Jan 2025 - Jun 2025",
    achievements: [
      "Delivered market intelligence reports that shaped EV charging hub expansion, contributing to 3 investment-ready projects",
      "Engaged with regulators and NGOs (EPRA, EMAK) to influence policy discussions, securing compliance for proposed projects",
      "Facilitated stakeholder consultations that attracted KES 50M+ in potential investment toward EV infrastructure",
    ],
  },
  {
    company: "Frisco Engineering Limited",
    role: "Technical Sales Engineer Intern",
    location: "Nairobi, Kenya",
    period: "Feb 2024 - Jul 2024",
    achievements: [
      "Designed and sized 10+ solar PV backup systems worth KES 3M+, closing multiple agricultural and residential sales",
      "Conducted 15+ energy audits and feasibility studies, providing clients with evidence-based investment decisions",
      "Facilitated training workshops with a 95% client satisfaction rate, strengthening adoption of renewable energy systems",
    ],
  },
  {
    company: "HomeBiogas Kenya",
    role: "Technical Sales Engineer Intern",
    location: "Nairobi, Kenya",
    period: "Jan 2023 - Feb 2024",
    achievements: [
      "Supported the installation of 10+ household biogas systems, reducing reliance on biomass and LPG fuels",
      "Led community engagement sessions that cut system failures by 30% through effective after-sales training",
      "Expanded reach by building 5+ local partnerships, accelerating market adoption of biogas in peri-urban communities",
    ],
  },
  {
    company: "Farmers Choice Limited",
    role: "Production Intern",
    location: "Nairobi, Kenya",
    period: "Dec 2021 - Mar 2022",
    achievements: [
      "Conducted energy and water efficiency audits, identifying opportunities for 10% reduction in resource use",
      "Developed sustainability reports highlighting waste reduction and energy efficiency initiatives",
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
    title: "Energy Systems and Electric Mobility",
    icon: Cpu,
    items: [
      "Electric Mobility Technical Training",
      "Electric Two and Three Wheelers Training",
      "Battery Technology Training (Siemens, Basic and Advanced)",
      "Exploring the World of Electric Mobility",
      "Exploring the World of Electric Buses",
    ],
  },
  {
    title: "Renewable Energy and Solar Systems",
    icon: Leaf,
    items: [
      "Solar PV Engineering Training (AFYEL)",
      "Solar Training Certificate",
      "Ebara Pumps Fundamentals and Technical Seminar",
    ],
  },
  {
    title: "Environmental, Management, Climate and ESG",
    icon: Settings,
    items: [
      "Environmental, Social and Governance Certificate",
      "Becoming a Climate Champion",
      "Green Skills for a Green Future Bootcamp",
      "Environmental Conservation Institute Certificate",
    ],
  },
  {
    title: "Data, Analytics and Geospatial Tools",
    icon: BarChart3,
    items: [
      "Data Fundamentals for Sustainable Mobility",
      "Data Analytics Job Simulation",
      "Power BI for energy data analysis",
      "GIS for Conservation (Modules 1 and 2, Beginner and Intermediate)",
    ],
  },
];

const skills = {
  technical: [
    "Renewable energy systems",
    "EV infrastructure",
    "Energy audits",
    "Feasibility analysis",
    "Sustainability data analysis",
    "Power BI",
    "GIS fundamentals",
  ],
  analytical: [
    "Systems thinking",
    "Stakeholder engagement",
    "Regulatory analysis",
    "Project coordination",
  ],
  communication: [
    "Technical reporting",
    "Client and stakeholder training",
    "Interdisciplinary collaboration",
  ],
};

const leadership = [
  {
    title: "Africa Fellowship for Young Energy Leaders",
    subtitle: "Cohort 5 (General Track and Solar PV Engineering Track)",
    period: "2025 - Present",
  },
  {
    title: "Member, World Youth Parliament for Water",
    period: "2024 - 2027",
  },
  {
    title: "Community Trainer",
    subtitle: "Delivering workshops on renewable energy adoption, solar irrigation, and circular economy practices",
    period: "Ongoing",
  },
  {
    title: "Student Leader, JKUAT",
    subtitle: "Coordinating peer-learning and engineering outreach initiatives",
    period: "During Studies",
  },
];

const ResumePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-display font-bold text-3xl text-white mx-auto mb-6">
              RO
            </div>
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
              A renewable-energy and e-mobility specialist with operational experience spanning distributed energy infrastructure, 
              EV-charging technology, and battery-swap system deployment in East Africa. Brings strengths in technical operations, 
              system-uptime management, feasibility analysis, and cross-functional coordination with contractors, utilities, and 
              regulatory agencies. Skilled at leading teams, generating performance insights, and delivering practical, real-world 
              solutions that enhance infrastructure reliability and customer experience, with a growing interest in energy-storage 
              systems, resource efficiency, and sustainable technology cycles.
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
              <div>
                <h3 className="font-bold text-primary mb-3">Technical</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-primary mb-3">Analytical & Organisational</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.analytical.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-primary mb-3">Communication</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.communication.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default ResumePage;
