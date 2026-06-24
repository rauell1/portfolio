import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, BookOpen, BarChart3, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { smoothScrollTo } from "@/lib/smoothScroll";

const hashNavItems = [
  { href: "#about",      label: "About" },
  { href: "#work",       label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills",     label: "Skills" },
  { href: "#contact",    label: "Contact" },
];

const routeNavItems = [
  { to: "/projects",     label: "Projects",      icon: null },
  { to: "/blog",         label: "Blog",          icon: BookOpen },
  { to: "/case-studies", label: "Case Studies",  icon: BarChart3 },
];

export const Navbar = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location  = useLocation();
  const isHome    = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (!isHome) { window.location.href = "/" + href; return; }
    const el = document.querySelector(href);
    if (el) smoothScrollTo(el);
    setMobileMenuOpen(false);
  };

  const isActiveRoute = (to: string) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-sm" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-display font-bold text-base text-white group-hover:shadow-glow transition-shadow duration-300">
                RO
              </div>
              <span className="hidden sm:block font-display font-semibold text-base">
                Roy <span className="text-primary">Otieno</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-0.5">
              {/* Hash links — only render on home */}
              {isHome && hashNavItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="relative px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300 rounded-full" />
                  </button>
                </li>
              ))}

              {/* Divider when on home */}
              {isHome && <li className="w-px h-4 bg-border/60 mx-1" aria-hidden="true" />}

              {/* Route links */}
              {routeNavItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 group flex items-center gap-1.5 rounded-lg ${
                      isActiveRoute(item.to)
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {item.icon && <item.icon className="w-3.5 h-3.5" />}
                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  to="/resume"
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 rounded-lg ${
                    isActiveRoute("/resume")
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Resume
                </Link>
              </li>

              <li className="ml-2">
                <Link
                  to="/admin"
                  className={`p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/40 transition-colors flex items-center justify-center ${
                    isActiveRoute("/admin") ? "text-primary bg-primary/8" : ""
                  }`}
                  aria-label="Admin Dashboard"
                  title="Admin Dashboard"
                >
                  <Lock className="w-4 h-4" />
                </Link>
              </li>
              <li className="ml-1">
                <ThemeToggle />
              </li>
            </ul>

            {/* Medium screens: show just route links (no hash) */}
            <ul className="hidden md:flex lg:hidden items-center gap-0.5">
              {routeNavItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      isActiveRoute(item.to) ? "text-primary bg-primary/8" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/resume"
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isActiveRoute("/resume") ? "text-primary bg-primary/8" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  Resume
                </Link>
              </li>
              <li className="ml-1"><ThemeToggle /></li>
            </ul>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/40 transition-colors flex items-center justify-center ${
                  isActiveRoute("/admin") ? "text-primary bg-primary/8" : ""
                }`}
                aria-label="Admin Dashboard"
                title="Admin Dashboard"
              >
                <Lock className="w-4 h-4" />
              </Link>
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-foreground rounded-lg hover:bg-muted/40 transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/97 backdrop-blur-xl border-b border-border/60"
            >
              <nav className="px-6 py-5 space-y-1">
                {/* Hash links (home page sections) */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 pb-1">Sections</p>
                {hashNavItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}

                <div className="h-px bg-border/60 my-3" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 pb-1">Pages</p>

                {routeNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActiveRoute(item.to)
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/resume"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActiveRoute("/resume")
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Resume
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};
