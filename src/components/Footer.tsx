import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Linkedin, ArrowUp, Github } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/roy-otieno-60b190174/", label: "LinkedIn" },
    { icon: XIcon,    href: "https://x.com/rauell_",                             label: "X (Twitter)" },
    { icon: Github,   href: "https://github.com/rauell1",                        label: "GitHub" },
  ];

  const linkGroups = [
    {
      heading: "Work",
      links: [
        { label: "Projects",      href: "/projects" },
      ],
    },
    {
      heading: "Info",
      links: [
        { label: "Resume", href: "/resume" },
        { label: "Admin Login", href: "/admin" },
      ],
    },
  ];

  return (
    <footer className="relative py-12 px-6 border-t border-border/60 bg-background/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-display font-bold text-sm text-white">
                RO
              </div>
              <span className="font-display font-semibold text-sm">Roy Otieno</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
              Renewable Energy &amp; E-Mobility Engineer based in Nairobi, Kenya.
            </p>
          </div>

          {/* Link groups */}
          {linkGroups.map((group) => (
            <div key={group.heading}>
              <h4 className="font-display font-semibold mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                {group.heading}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-foreground/70 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold mb-3 text-xs uppercase tracking-wider text-muted-foreground">
              Connect
            </h4>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted/40 hover:bg-primary/20 hover:text-primary transition-all duration-200"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Roy Okola Otieno. All rights reserved.
          </p>
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
      </div>
    </footer>
  );
};
