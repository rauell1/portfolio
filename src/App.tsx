import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Component, ReactNode, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { CustomCursor } from "./components/ui/CustomCursor";
import Index from "./pages/Index";

const Resume          = lazy(() => import("./pages/Resume"));
const ProjectsPage    = lazy(() => import("./pages/Projects"));
const BlogPage        = lazy(() => import("./pages/Blog"));
const BlogPostPage    = lazy(() => import("./pages/BlogPost"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudies"));
const CaseStudyPage   = lazy(() => import("./pages/CaseStudy"));
const AdminPage       = lazy(() => import("./pages/Admin"));
const NotFound        = lazy(() => import("./pages/NotFound"));
const LazyToaster     = lazy(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const LazySonner      = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
    <div className="app-spinner" />
  </div>
);

const queryClient = new QueryClient();

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white text-center p-8">
          <div>
            <h1 className="text-3xl mb-4">Roy Okola Otieno</h1>
            <p className="opacity-70 mb-6">Portfolio is temporarily unavailable. Please try again later.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#197] border-0 rounded-lg text-white cursor-pointer text-base">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const PageTransition = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.22, ease: "easeOut" }}
  >
    <Outlet />
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route element={<PageTransition />}>
          <Route path="/"                    element={<Index />} />
          <Route path="/resume"              element={<Resume />} />
          <Route path="/projects"            element={<ProjectsPage />} />
          <Route path="/blog"                element={<BlogPage />} />
          <Route path="/blog/:slug"          element={<BlogPostPage />} />
          <Route path="/case-studies"        element={<CaseStudiesPage />} />
          <Route path="/case-studies/:slug"  element={<CaseStudyPage />} />
          <Route path="/admin"               element={<AdminPage />} />
          <Route path="*"                    element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <CustomCursor />
          <Suspense fallback={null}>
            <LazyToaster />
            <LazySonner />
          </Suspense>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <AnimatedRoutes />
            </Suspense>
          </BrowserRouter>
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
