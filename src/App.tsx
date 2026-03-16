import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Component, ReactNode, lazy, Suspense } from "react";
import Index from "./pages/Index";

// Lazy-load non-home pages to reduce initial bundle size
const Resume = lazy(() => import("./pages/Resume"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const ProjectsPage = lazy(() => import("./pages/Projects"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminPostEditor = lazy(() => import("./pages/AdminPostEditor"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ProtectedBlog = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === "royokola3@gmail.com";
  if (!isAdmin) {
    return <NotFound />;
  }
  return <Blog />;
};

const ProtectedBlogPost = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === "royokola3@gmail.com";
  if (!isAdmin) {
    return <NotFound />;
  }
  return <BlogPost />;
};

const PageLoader = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
    <div style={{ width: "2rem", height: "2rem", border: "2px solid hsl(197 68% 44%)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif", textAlign: "center", padding: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Roy Okola Otieno</h1>
            <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>Portfolio is temporarily unavailable. Please try again later.</p>
            <button onClick={() => window.location.reload()} style={{ padding: "0.5rem 1.5rem", background: "#197", border: "none", borderRadius: "0.5rem", color: "#fff", cursor: "pointer", fontSize: "1rem" }}>
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
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/blog" element={<ProtectedBlog />} />
                  <Route path="/blog/:slug" element={<ProtectedBlogPost />} />
                  <Route path="/case-studies" element={<CaseStudiesPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/posts/new" element={<AdminPostEditor />} />
                  <Route path="/admin/posts/:id" element={<AdminPostEditor />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
