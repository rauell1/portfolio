import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Linkedin, ArrowUp, Github } from "lucide-react";

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/roy-otieno-60b190174/", label: "LinkedIn" },
    { icon: XIcon, href: "https://x.com/rauell_", label: "X (Twitter)" },
    { icon: Github, href: "https://github.com/rauell1", label: "GitHub" },
  ];

  const quickLinks = [
    { label: "Projects", href: "/projects" },
  ];

  return (
    <footer className="relative py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo and Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-display font-bold text-lg text-white">
              RO
            </div>
            <div>
              <p className="font-display font-semibold">Roy Otieno</p>
              <p className="text-xs text-muted-foreground">
                Renewable Energy & E-Mobility Expert
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-2 text-xs uppercase tracking-wider text-muted-foreground">Quick Links</h4>
            <ul className="flex gap-4 flex-wrap">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect + Social */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-primary/20 hover:text-primary transition-all duration-300"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
              <div className="w-px h-4 bg-border" />
              <motion.button
                onClick={scrollToTop}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Roy Otieno. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
