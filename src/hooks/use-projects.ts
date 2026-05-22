import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { portfolioProjects, sectors as staticSectors } from "@/data/portfolioProjects";
import type { Project } from "@/data/portfolioProjects";
import type { Tables } from "@/integrations/supabase/types";

type DbProject = Tables<"projects">;

/** Map a Supabase projects row → the shared Project interface */
function mapDbProject(row: DbProject): Project {
  return {
    id: row.slug ?? row.id,
    title: row.title,
    sector: (row.sector ?? "digital-products") as Project["sector"],
    category: row.category ?? "",
    description: row.description ?? "",
    longDescription: row.long_description ?? row.description ?? "",
    role: row.role ?? undefined,
    iconName: row.icon_name ?? "Zap",
    link: row.link ?? undefined,
    repo: row.repo ?? undefined,
    gradient: row.gradient ?? "from-slate-500 to-gray-600",
    tags: row.tags ?? [],
    isFounder: row.is_founder,
    isFlagship: row.is_flagship,
    status: (row.status as Project["status"]) ?? undefined,
    specs: Array.isArray(row.specs)
      ? (row.specs as { label: string; value: string }[])
      : undefined,
    image: row.image ?? undefined,
  };
}

interface UseProjectsResult {
  projects: Project[];
  sectors: typeof staticSectors;
  loading: boolean;
  error: string | null;
  /** true when data is coming from Supabase (vs static fallback) */
  fromSupabase: boolean;
}

/**
 * Fetches all published projects from Supabase.
 * Falls back to the static portfolioProjects array if Supabase
 * is unavailable (no env vars set, network error, etc.).
 */
export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromSupabase, setFromSupabase] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      // No client configured → use static data immediately
      if (!supabase) {
        setProjects(portfolioProjects);
        setFromSupabase(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error: sbError } = await supabase
          .from("projects")
          .select("*")
          .in("status", ["live", "in-progress", "completed", "published"])
          .order("is_flagship", { ascending: false })
          .order("sector")
          .order("title");

        if (cancelled) return;

        if (sbError) throw sbError;

        if (data && data.length > 0) {
          setProjects(data.map(mapDbProject));
          setFromSupabase(true);
        } else {
          // DB is empty or no matching rows — use static fallback
          setProjects(portfolioProjects);
          setFromSupabase(false);
        }
      } catch (err) {
        if (cancelled) return;
        console.warn("[useProjects] Supabase fetch failed, using static data:", err);
        setProjects(portfolioProjects);
        setFromSupabase(false);
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProjects();
    return () => { cancelled = true; };
  }, []);

  return { projects, sectors: staticSectors, loading, error, fromSupabase };
}
