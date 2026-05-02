import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Component, ReactNode, lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";

// Lazy-load non-home pages to reduce initial bundle size
const Resume = lazy(() => import("./pages/Resume"));
const ProjectsPage = lazy(() => import("./pages/Projects"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LazyToaster = lazy(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const LazySonner = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

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

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Suspense fallback={null}>
            <LazyToaster />
            <LazySonner />
          </Suspense>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/projects" element={<ProjectsPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
