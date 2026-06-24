import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

type AdminSection =
  | "overview"
  | "sync"
  | "projects"
  | "blog"
  | "case-studies"
  | "newsletter"
  | "page-sections"
  | "subscribers"
  | "media";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signing, setSigning] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const { toast } = useToast();

  /* ── session bootstrap ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  /* ── sign in ────────────────────────────────────────────────────────── */
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      toast({ title: "Not configured", description: "Supabase client is unavailable.", variant: "destructive" });
      return;
    }
    setSigning(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // session state update fires via onAuthStateChange
    } catch (err: unknown) {
      // Always return the same generic message — no email enumeration
      console.error("[admin] sign-in error:", err instanceof Error ? err.message : err);
      toast({
        title: "Sign-in failed",
        description: "Invalid credentials. Please check your email and password.",
        variant: "destructive",
      });
    } finally {
      setSigning(false);
    }
  }

  /* ── sign out ───────────────────────────────────────────────────────── */
  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  }

  /* ── loading ────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SEO {...PAGE_SEO.admin} />
        <div className="app-spinner" />
      </div>
    );
  }

  /* ── login form ─────────────────────────────────────────────────────── */
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <SEO {...PAGE_SEO.admin} />
        {/* ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        </div>

        <Card className="relative w-full max-w-sm glass-card border-border/60 shadow-2xl">
          <CardHeader className="text-center pb-2">
            {/* lock icon */}
            <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-display font-bold">Admin Dashboard</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Sign in with your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="admin-email" className="text-sm font-medium text-foreground/80">
                  Email
                </label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="admin-password" className="text-sm font-medium text-foreground/80">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" disabled={signing}>
                {signing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ── dashboard ──────────────────────────────────────────────────────── */
  return (
    <AdminLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      userEmail={session.user.email ?? ""}
      onSignOut={handleSignOut}
    />
  );
}
