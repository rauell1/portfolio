import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const attemptsRef = useRef(0);
  const lockoutUntilRef = useRef<number>(0);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Rate limiting check
    const now = Date.now();
    if (now < lockoutUntilRef.current) {
      const remainingSec = Math.ceil((lockoutUntilRef.current - now) / 1000);
      setError(`Too many failed attempts. Try again in ${remainingSec} seconds.`);
      return;
    }

    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      attemptsRef.current++;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        lockoutUntilRef.current = Date.now() + LOCKOUT_DURATION_MS;
        attemptsRef.current = 0;
        setError("Too many failed attempts. Account locked for 5 minutes.");
      } else {
        setError(error.message);
      }
      setIsLoading(false);
      return;
    }

    // Reset on success
    attemptsRef.current = 0;
    lockoutUntilRef.current = 0;

    toast({
      title: "Welcome back!",
      description: "You've been successfully logged in.",
    });
    
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">Admin Login</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to manage your blog posts
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10"
                  required
                  maxLength={255}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  maxLength={128}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              <a href="/forgot-password" className="text-primary hover:underline">
                Forgot your password?
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              <a href="/" className="text-primary hover:underline">
                ← Back to Portfolio
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
