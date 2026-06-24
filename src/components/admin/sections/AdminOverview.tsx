import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { FolderKanban, Zap, FileText, BookOpen, Mail, Star, Clock } from "lucide-react";

interface Stats {
  totalProjects: number;
  liveProjects: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  caseStudies: number;
  subscribers: number;
  testimonials: number;
}

interface RecentProject {
  id: string;
  title: string;
  status: string;
  updated_at: string;
}

const metricCards = (stats: Stats) => [
  {
    label: "Total Projects",
    value: stats.totalProjects,
    icon: <FolderKanban className="h-5 w-5" />,
    gradient: "from-blue-500/20 to-cyan-500/20",
    color: "text-blue-400",
  },
  {
    label: "Live Projects",
    value: stats.liveProjects,
    icon: <Zap className="h-5 w-5" />,
    gradient: "from-emerald-500/20 to-teal-500/20",
    color: "text-emerald-400",
  },
  {
    label: "Blog Posts",
    value: `${stats.publishedBlogPosts} / ${stats.totalBlogPosts}`,
    icon: <FileText className="h-5 w-5" />,
    gradient: "from-violet-500/20 to-purple-500/20",
    color: "text-violet-400",
  },
  {
    label: "Case Studies",
    value: stats.caseStudies,
    icon: <BookOpen className="h-5 w-5" />,
    gradient: "from-amber-500/20 to-orange-500/20",
    color: "text-amber-400",
  },
  {
    label: "Subscribers",
    value: stats.subscribers,
    icon: <Mail className="h-5 w-5" />,
    gradient: "from-pink-500/20 to-rose-500/20",
    color: "text-pink-400",
  },
  {
    label: "Testimonials",
    value: stats.testimonials,
    icon: <Star className="h-5 w-5" />,
    gradient: "from-yellow-500/20 to-amber-500/20",
    color: "text-yellow-400",
  },
];

function statusColor(status: string) {
  switch (status) {
    case "live":
      return "text-emerald-400";
    case "in-progress":
      return "text-amber-400";
    case "completed":
      return "text-sky-400";
    default:
      return "text-muted-foreground";
  }
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    if (!supabase) return;
    try {
      const [
        { count: totalProjects },
        { count: liveProjects },
        { count: totalBlogPosts },
        { count: publishedBlogPosts },
        { count: caseStudies },
        { count: subscribers },
        { count: testimonials },
        { data: recentData },
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "live"),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("case_studies").select("*", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
        supabase.from("testimonials").select("*", { count: "exact", head: true }),
        supabase
          .from("projects")
          .select("id, title, status, updated_at")
          .order("updated_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        totalProjects: totalProjects ?? 0,
        liveProjects: liveProjects ?? 0,
        totalBlogPosts: totalBlogPosts ?? 0,
        publishedBlogPosts: publishedBlogPosts ?? 0,
        caseStudies: caseStudies ?? 0,
        subscribers: subscribers ?? 0,
        testimonials: testimonials ?? 0,
      });
      setRecent((recentData ?? []) as RecentProject[]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load stats";
      toast({ title: "Error loading stats", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!stats) {
    return (
      <p className="text-muted-foreground text-justify">
        Could not load dashboard stats. Check your Supabase configuration.
      </p>
    );
  }

  const cards = metricCards(stats);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className={`bg-card bg-gradient-to-br ${card.gradient}`}>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className={`${card.color}`}>{card.icon}</div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recently Updated Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-muted-foreground text-justify">No projects found.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="font-medium truncate flex-1 mr-4">{p.title}</span>
                  <span className={`text-xs font-medium capitalize ${statusColor(p.status)}`}>
                    {p.status}
                  </span>
                  <span className="text-xs text-muted-foreground ml-4 hidden sm:block">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
