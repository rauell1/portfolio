import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SUPABASE_URL_HOST } from "@/integrations/supabase/client";
import { supabase } from "@/integrations/supabase/client";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000;

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetSending, setIsResetSending] = useState(false);
  const [error, setError] = useState("");
  const attemptsRef = useRef(0);
  const lockoutUntilRef = useRef<number>(0);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const now = Date.now();
    if (now < lockoutUntilRef.current) {
      const remainingSec = Math.ceil((lockoutUntilRef.current - now) / 1000);
      setError(`Too many failed attempts. Try again in ${remainingSec} seconds.`);
      return;
    }

    setIsLoading(true);

    // Normalize input to avoid accidental whitespace/case mismatch issues.
    const normalizedEmail = email.trim().toLowerCase();
    const { error } = await signIn(normalizedEmail, password);

    if (error) {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        lockoutUntilRef.current = Date.now() + LOCKOUT_DURATION_MS;
        attemptsRef.current = 0;
        setError("Too many failed attempts. Please try again in a few minutes.");
      } else {
        const authError = error as Error & { code?: string; status?: number };
        const baseMessage =
          error.message === "Invalid login credentials"
            ? "Invalid login credentials. This usually means the password is incorrect or the email does not exist in the connected Supabase project."
            : error.message;
        const details = authError.code
          ? ` (code: ${authError.code}${authError.status ? `, status: ${authError.status}` : ""})`
          : "";
        setError(`${baseMessage}${details}`);
      }
      toast({
        title: "Login failed",
        description: "Please verify credentials and confirm this deployment points to the correct Supabase project.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back",
        description: "You are now logged in.",
      });
      navigate("/");
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your email first, then click Forgot password.");
      return;
    }
    if (!supabase) {
      setError("Authentication service is unavailable. Please try again later.");
      return;
    }

    setIsResetSending(true);
    const redirectTo = `${window.location.origin}/auth/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo,
    });
    setIsResetSending(false);

    if (resetError) {
      setError(resetError.message);
      toast({
        title: "Reset email failed",
        description: resetError.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reset email sent",
      description: "Check your inbox and open the reset link to set a new password.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto glass-card rounded-2xl p-8"
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-display font-bold mb-2">Admin Sign In</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to unlock editing for projects, case studies, and blog posts.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-2">
              This login is restricted to the site owner.
            </p>

            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isResetSending}
                className="text-xs text-primary hover:underline disabled:opacity-60"
              >
                {isResetSending ? "Sending reset email..." : "Forgot password?"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-muted-foreground mb-3">
              Supabase host: {SUPABASE_URL_HOST ?? "not configured"}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to portfolio
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;

