import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error.errors[0].message);
      return;
    }

    try {
      // Subscribe to newsletter
      const { error } = await supabase.from("newsletter_subscribers").insert({ email });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          setStatus("error");
          setErrorMessage("This email is already subscribed!");
        } else {
          throw error;
        }
        return;
      }

      // Send welcome email via edge function
      await supabase.functions.invoke("send-newsletter-welcome", {
        body: { email },
      });

      setStatus("success");
      setEmail("");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      setStatus("error");
      setErrorMessage("Failed to subscribe. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 p-4 rounded-xl"
      >
        <CheckCircle className="w-5 h-5" />
        <span>You're subscribed! Check your inbox for a welcome email.</span>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            required
          />
        </div>
        <motion.button
          type="submit"
          disabled={status === "loading"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
        >
          {status === "loading" ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            "Subscribe"
          )}
        </motion.button>
      </div>
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-400 text-sm mt-2"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </motion.div>
      )}
    </form>
  );
};
