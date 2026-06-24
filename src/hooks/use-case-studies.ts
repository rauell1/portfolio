import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CaseStudyMetric {
  label: string;
  value: string;
  unit?: string;
  icon?: string;
}

export interface CaseStudySection {
  heading: string;
  body: string;
  image?: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  role: string | null;
  partner: string | null;
  location: string | null;
  date: string | null;
  gradient: string;
  icon_name: string;
  image: string | null;
  is_flagship: boolean;
  metrics: CaseStudyMetric[];
  sections: CaseStudySection[];
  pdf_download: string | null;
}

// Static fallback case studies
const STATIC_CASE_STUDIES: CaseStudy[] = [
  {
    id: "safaricharge-nairobi",
    slug: "safaricharge-nairobi-pilot",
    title: "SafariCharge Nairobi Pilot",
    subtitle: "Solar-Powered EV Charging at Urban Commercial Sites",
    category: "Clean Energy",
    role: "Founder & Lead Engineer",
    partner: "Nairobi Mall Operators",
    location: "Nairobi, Kenya",
    date: "2024 to Present",
    gradient: "from-cyan-500 to-blue-600",
    icon_name: "Zap",
    image: "/images/roam-charger-1.jpeg",
    is_flagship: true,
    metrics: [
      { label: "Sites Piloted", value: "2", unit: "locations" },
      { label: "Solar Capacity", value: "15", unit: "kWp" },
      { label: "Daily EV Sessions", value: "12", unit: "avg" },
      { label: "Grid Carbon Offset", value: "30", unit: "% reduction" },
    ],
    sections: [
      {
        heading: "Challenge",
        body: "Urban Nairobi faces rapid EV adoption without the charging infrastructure to match. Mall and commercial property owners want sustainable amenities but lack technical expertise to deploy and operate solar-backed charging stations economically.",
      },
      {
        heading: "Solution",
        body: "SafariCharge deployed a full-stack platform integrating solar PV, second-life battery storage, and smart EV charge controllers. The system dynamically manages energy flow between grid, solar, battery, and EV chargers using Kenya-specific KPLC tariff logic to minimise cost and maximise renewable utilisation.",
      },
      {
        heading: "Impact",
        body: "Two pilot sites are operational, delivering clean EV charging while reducing grid draw during peak tariff hours. AI-assisted analytics monitor system health and provide actionable reports to site operators. Partnership discussions are ongoing with three additional Nairobi-area mall groups.",
      },
    ],
    pdf_download: null,
  },
  {
    id: "roam-point-deployment",
    slug: "roam-point-charging-infrastructure",
    title: "Roam POINT Charging Hubs",
    subtitle: "Nationwide EV Charging Network Feasibility and Deployment",
    category: "E-Mobility",
    role: "Project Lead, Infrastructure & Partnerships",
    partner: "Roam Electric",
    location: "Nairobi & Mombasa, Kenya",
    date: "2023 to Present",
    gradient: "from-emerald-500 to-teal-600",
    icon_name: "Battery",
    image: "/images/roam-charger-4.jpeg",
    is_flagship: true,
    metrics: [
      { label: "Hub Sites Assessed", value: "20+", unit: "locations" },
      { label: "Fleet Uptime", value: "94", unit: "%" },
      { label: "Charge Sessions/Day", value: "200+", unit: "fleet-wide" },
      { label: "Routes Optimised", value: "8", unit: "bus corridors" },
    ],
    sections: [
      {
        heading: "Challenge",
        body: "Roam Electric needed to scale its charging infrastructure beyond a handful of depots to support a growing fleet of electric buses and motorcycles across Nairobi and the coast. The challenge was identifying economically viable hub locations that balanced grid capacity, site access, and operational demand.",
      },
      {
        heading: "Solution",
        body: "Conducted GIS-informed feasibility assessments of 20+ candidate sites, scoring each against grid availability, land tenure, traffic patterns, and fleet density. Designed charging specifications for both AC destination chargers and DC fast-chargers, incorporating load management to stay within grid connection limits.",
      },
      {
        heading: "Impact",
        body: "Delivered a prioritised rollout roadmap adopted for Roam's Phase 2 expansion. The first wave of hubs contributed to a fleet uptime improvement from 87% to 94% by reducing vehicle downtime due to charging availability constraints.",
      },
    ],
    pdf_download: null,
  },
  {
    id: "solar-cold-chain",
    slug: "solar-cold-chain-smallholder",
    title: "Solar Cold Chain for Smallholder Farmers",
    subtitle: "Off-Grid Refrigeration Reducing Post-Harvest Losses in Rural Kenya",
    category: "AgriTech",
    role: "Research Associate",
    partner: "JKUAT Energy Institute",
    location: "Rift Valley, Kenya",
    date: "2023",
    gradient: "from-blue-500 to-indigo-600",
    icon_name: "Thermometer",
    image: "/images/solar-cooling-ai.jpg",
    is_flagship: false,
    metrics: [
      { label: "Post-Harvest Loss", value: "45", unit: "% reduction" },
      { label: "Farmers Served", value: "120+", unit: "households" },
      { label: "Solar Capacity", value: "3", unit: "kWp per unit" },
      { label: "Storage Capacity", value: "500", unit: "kg produce" },
    ],
    sections: [
      {
        heading: "Challenge",
        body: "Smallholder farmers in the Rift Valley lose an estimated 30 to 50% of horticultural produce to post-harvest spoilage due to the lack of affordable, reliable cold storage. Grid electricity is either unavailable or too expensive for off-peak refrigeration operation.",
      },
      {
        heading: "Solution",
        body: "Designed a solar-powered cold room system combining a 3 kWp photovoltaic array, lithium battery bank, and efficient DC-powered refrigeration compressor. The system operates autonomously and maintains 4 to 8 degrees Celsius storage temperature for up to 72 hours without solar generation.",
      },
      {
        heading: "Impact",
        body: "Field trials across three farming cooperatives demonstrated a 45% reduction in post-harvest loss, translating to a 38% increase in net income per harvest cycle. The research contributed to JKUAT's off-grid agricultural energy publication and has been adopted as a model for county-level rural electrification programs.",
      },
    ],
    pdf_download: null,
  },
];

interface UseCaseStudiesResult {
  studies: CaseStudy[];
  loading: boolean;
  error: string | null;
}

export function useCaseStudies(): UseCaseStudiesResult {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      if (!supabase) {
        setStudies(STATIC_CASE_STUDIES);
        setLoading(false);
        return;
      }

      try {
        const { data, error: sbError } = await supabase
          .from("case_studies")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true });

        if (cancelled) return;
        if (sbError) throw sbError;

        if (data && data.length > 0) {
          setStudies(
            data.map((r) => ({
              id: r.id,
              slug: r.slug,
              title: r.title,
              subtitle: r.subtitle,
              category: r.category,
              role: r.role,
              partner: r.partner,
              location: r.location,
              date: r.date,
              gradient: r.gradient,
              icon_name: r.icon_name,
              image: r.image,
              is_flagship: r.is_flagship,
              metrics: (r.metrics as CaseStudyMetric[]) ?? [],
              sections: (r.sections as CaseStudySection[]) ?? [],
              pdf_download: r.pdf_download,
            }))
          );
        } else {
          setStudies(STATIC_CASE_STUDIES);
        }
      } catch (err) {
        if (cancelled) return;
        console.warn("[useCaseStudies] fallback to static:", err);
        setStudies(STATIC_CASE_STUDIES);
        setError(err instanceof Error ? err.message : "Failed to load case studies");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { studies, loading, error };
}
