import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { portfolioProjects } from "@/data/portfolioProjects";
import { STATIC_BLOG_POSTS } from "@/data/blogPosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, RefreshCw, Database } from "lucide-react";

const TABLES = [
  "projects",
  "blog_posts",
  "case_studies",
  "newsletter_subscribers",
  "page_sections",
  "testimonials",
] as const;

type TableName = (typeof TABLES)[number];

interface TableStatus {
  count: number;
  ok: boolean;
}

type DbStatus = Record<TableName, TableStatus>;

export default function AdminSync() {
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [syncingBlog, setSyncingBlog] = useState(false);
  const [dbSlugs, setDbSlugs] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    refreshStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshStatus() {
    if (!supabase) {
      setDbLoading(false);
      return;
    }
    setDbLoading(true);
    try {
      const results = await Promise.all(
        TABLES.map((t) =>
          supabase!
            .from(t)
            .select("*", { count: "exact", head: true })
            .then(({ count, error }) => ({ table: t, count: count ?? 0, ok: !error }))
        )
      );
      const status = {} as DbStatus;
      results.forEach(({ table, count, ok }) => {
        status[table] = { count, ok };
      });
      setDbStatus(status);

      const { data } = await supabase.from("projects").select("slug");
      setDbSlugs((data ?? []).map((r: { slug: string | null }) => r.slug ?? ""));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Refresh failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setDbLoading(false);
    }
  }

  const staticSlugs = portfolioProjects.map((p) => p.id);
  const inDbNotStatic = dbSlugs.filter((s) => s && !staticSlugs.includes(s));
  const inStaticNotDb = staticSlugs.filter((s) => !dbSlugs.includes(s));

  async function seedProjects() {
    if (!supabase) return;
    setSeeding(true);
    try {
      const missing = portfolioProjects.filter((p) => !dbSlugs.includes(p.id));
      if (missing.length === 0) {
        toast({ title: "Nothing to seed", description: "All static projects are already in the DB." });
        setSeeding(false);
        return;
      }

      const rows = missing.map((p) => ({
        slug: p.id,
        title: p.title,
        sector: p.sector,
        category: p.category ?? null,
        description: p.description ?? null,
        long_description: p.longDescription ?? null,
        role: p.role ?? null,
        icon_name: p.iconName,
        link: p.link ?? null,
        repo: p.repo ?? null,
        gradient: p.gradient,
        tags: p.tags ?? [],
        is_founder: p.isFounder ?? false,
        is_flagship: p.isFlagship ?? false,
        status: p.status ?? "in-progress",
        specs: p.specs ? JSON.parse(JSON.stringify(p.specs)) : null,
        image: p.image ?? null,
        project_type: "portfolio",
      }));

      const { error } = await supabase.from("projects").upsert(rows, { onConflict: "slug" });
      if (error) throw error;
      toast({ title: "Seeded", description: `${rows.length} project(s) added to the database.` });
      await refreshStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Seed failed";
      toast({ title: "Seed failed", description: msg, variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  }

  async function syncBlogPosts() {
    if (!supabase) return;
    setSyncingBlog(true);
    try {
      const posts = STATIC_BLOG_POSTS.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        cover_image: p.cover_image,
        category: p.category,
        tags: p.tags,
        published: false,
        published_at: p.published_at,
      }));
      const { error } = await supabase.from("blog_posts").upsert(posts, { onConflict: "slug" });
      if (error) throw error;
      toast({ title: "Blog posts synced", description: `${posts.length} post(s) upserted.` });
      await refreshStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sync failed";
      toast({ title: "Blog sync failed", description: msg, variant: "destructive" });
    } finally {
      setSyncingBlog(false);
    }
  }

  const allOk = dbStatus ? TABLES.every((t) => dbStatus[t].ok) : false;

  return (
    <div className="space-y-6">
      {/* Database status */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Database Status
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refreshStatus} disabled={dbLoading} className="gap-2">
            <RefreshCw className={`h-3 w-3 ${dbLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            {allOk ? (
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400" />
            )}
            <span className={`text-sm font-medium ${allOk ? "text-emerald-400" : "text-red-400"}`}>
              {allOk ? "All tables reachable" : "Some tables have errors"}
            </span>
          </div>

          {dbLoading ? (
            <div className="space-y-2">
              {TABLES.map((t) => (
                <Skeleton key={t} className="h-6 w-full rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TABLES.map((t) => {
                const s = dbStatus?.[t];
                return (
                  <div key={t} className="flex items-center justify-between bg-muted/40 rounded px-3 py-2 text-xs">
                    <span className="font-mono text-muted-foreground">{t}</span>
                    <div className="flex items-center gap-1">
                      {s?.ok ? (
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-400" />
                      )}
                      <span className="font-semibold">{s?.count ?? "-"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Static vs DB comparison */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-sm">Static vs. Database - Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Static projects: {staticSlugs.length} - DB projects: {dbSlugs.length}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-amber-400">
              In static but missing from DB ({inStaticNotDb.length}):
            </p>
            {inStaticNotDb.length === 0 ? (
              <p className="text-xs text-muted-foreground">None - all static projects are in the DB.</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {inStaticNotDb.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs border-amber-500/50 text-amber-400">
                    {s}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-sky-400">
              In DB but not in static ({inDbNotStatic.length}):
            </p>
            {inDbNotStatic.length === 0 ? (
              <p className="text-xs text-muted-foreground">None.</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {inDbNotStatic.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs border-sky-500/50 text-sky-400">
                    {s}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="sm"
              onClick={seedProjects}
              disabled={seeding || inStaticNotDb.length === 0}
              className="gap-2"
            >
              {seeding ? "Seeding..." : `Seed ${inStaticNotDb.length} Missing Project(s)`}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={syncBlogPosts}
              disabled={syncingBlog}
              className="gap-2"
            >
              {syncingBlog ? "Syncing..." : "Sync Blog Posts"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
