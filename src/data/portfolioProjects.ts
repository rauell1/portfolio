export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  role?: string;
  /** Lucide icon name, e.g. "Zap", "Battery", "Sun" */
  iconName: string;
  link?: string;
  gradient: string;
  tags: string[];
  isFounder?: boolean;
  isFlagship?: boolean;
  images?: string[];
  specs?: { label: string; value: string }[];
  pdfDownload?: string;
}

export const portfolioProjects: Project[] = [
  {
    id: "safaricharge",
    title: "SafariCharge Ltd",
    category: "E-Mobility",
    description:
      "Building smart EV charging hubs powered by solar microgrids and second-life batteries.",
    longDescription:
      "Piloted 2 sites and partnered with local malls for deployment. The project integrates solar PV, EV chargers, and repurposed EV batteries to create sustainable charging infrastructure.",
    iconName: "Zap",
    link: "https://safaricharge.com",
    gradient: "from-blue-500 to-cyan-400",
    tags: ["Solar", "EV Charging", "Battery Storage"],
    isFounder: true,
  },
  {
    id: "ev-hubs",
    title: "EV Charging Hub Expansion",
    category: "Infrastructure",
    description:
      "Collaborated with Roam Electric & EVChaja to identify optimal locations for EV charging infrastructure, integrating solar power and second-life batteries to support Nairobi's growing e-mobility ecosystem.",
    longDescription:
      "Collaborated with Roam Electric & EVChaja to identify optimal locations for EV charging infrastructure, integrating solar power and second-life batteries to support Nairobi's growing e-mobility ecosystem.",
    iconName: "Battery",
    gradient: "from-purple-500 to-pink-500",
    tags: ["Feasibility Studies", "Site Planning", "E-Mobility"],
  },
  {
    id: "solar-cooling",
    title: "Solar-Powered Cooling System",
    category: "AgriTech",
    description:
      "Designed an evaporative cooling unit extending tomato shelf life by 7 days.",
    longDescription:
      "Engineered a solar-powered evaporative cooling system (ECS) for off-grid areas, addressing post-harvest losses and improving incomes for smallholder farmers.",
    iconName: "Sun",
    gradient: "from-orange-500 to-yellow-400",
    tags: ["Solar PV", "Cold Chain", "Post-Harvest"],
  },
  {
    id: "borehole-irrigation",
    title: "Solarized Borehole Irrigation",
    category: "AgriTech",
    description:
      "Engineered off-grid solar pumping systems for smallholder farmers.",
    longDescription:
      "Implemented 10+ pilot installations in semi-arid regions, reducing reliance on diesel generators and enhancing climate-smart agriculture practices.",
    iconName: "Sun",
    gradient: "from-green-500 to-emerald-400",
    tags: ["Solar Pumping", "Irrigation", "Off-Grid"],
  },
  {
    id: "biogas",
    title: "Biogas for Circular Economy",
    category: "Renewable Energy",
    description:
      "Coordinated rural biogas installations reducing biomass dependence.",
    longDescription:
      "Partnered with schools and communities to install biogas digesters that produce clean cooking gas and organic fertilizer from organic waste, supporting regenerative farming.",
    iconName: "Leaf",
    gradient: "from-teal-500 to-green-400",
    tags: ["Biogas", "Circular Economy", "Rural Development"],
  },
  {
    id: "data-analytics",
    title: "Sustainable Mobility Analytics",
    category: "Data & Analytics",
    description:
      "Data-driven insights for sustainable transport and energy systems.",
    longDescription:
      "Applied data analysis techniques to optimize energy consumption, track system performance, and generate actionable insights for sustainable mobility projects.",
    iconName: "BarChart3",
    gradient: "from-indigo-500 to-blue-400",
    tags: ["Data Analysis", "Mobility", "Performance Tracking"],
  },
  {
    id: "roam-energy-page",
    title: "Roam Energy Marketing Site",
    category: "Web Development",
    description:
      "Multi-page static marketing website for Roam Energy, showcasing solar products, real deployment projects, and sustainable energy solutions across Africa.",
    longDescription:
      "Designed and built a responsive, multi-page static marketing site for Roam Energy using HTML, Tailwind CSS, and vanilla JavaScript. The site features an interactive product catalogue (solar panels, inverters, batteries), real-world project galleries including safari lodge and commercial deployments, smooth AOS scroll animations, a Swiper carousel, and a fully mobile-friendly layout — supporting Roam Energy's brand presence and customer acquisition.",
    iconName: "Globe",
    gradient: "from-orange-600 to-amber-500",
    tags: ["HTML/CSS", "Tailwind CSS", "JavaScript", "AOS"],
  },
];
