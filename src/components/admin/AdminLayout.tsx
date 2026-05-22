import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  RefreshCw,
  FolderKanban,
  FileText,
  BookOpen,
  Mail,
  Layers,
  Users,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import AdminOverview from "./sections/AdminOverview";
import AdminSync from "./sections/AdminSync";
import AdminProjects from "./sections/AdminProjects";
import AdminBlogPosts from "./sections/AdminBlogPosts";
import AdminCaseStudies from "./sections/AdminCaseStudies";
import AdminNewsletter from "./sections/AdminNewsletter";
import AdminPageSections from "./sections/AdminPageSections";

type AdminSection =
  | "overview"
  | "sync"
  | "projects"
  | "blog"
  | "case-studies"
  | "newsletter"
  | "page-sections"
  | "subscribers";

interface AdminLayoutProps {
  activeSection: AdminSection;
  setActiveSection: (s: AdminSection) => void;
  userEmail: string;
  onSignOut: () => void;
}

const navItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "sync", label: "Sync", icon: <RefreshCw className="h-4 w-4" /> },
  { id: "projects", label: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
  { id: "blog", label: "Blog Posts", icon: <FileText className="h-4 w-4" /> },
  { id: "case-studies", label: "Case Studies", icon: <BookOpen className="h-4 w-4" /> },
  { id: "newsletter", label: "Newsletter", icon: <Mail className="h-4 w-4" /> },
  { id: "page-sections", label: "Page Sections", icon: <Layers className="h-4 w-4" /> },
  { id: "subscribers", label: "Subscribers", icon: <Users className="h-4 w-4" /> },
];

function SectionContent({ section }: { section: AdminSection }) {
  switch (section) {
    case "overview":
      return <AdminOverview />;
    case "sync":
      return <AdminSync />;
    case "projects":
      return <AdminProjects />;
    case "blog":
      return <AdminBlogPosts />;
    case "case-studies":
      return <AdminCaseStudies />;
    case "newsletter":
      return <AdminNewsletter showSubscribersTab={false} />;
    case "subscribers":
      return <AdminNewsletter showSubscribersTab />;
    case "page-sections":
      return <AdminPageSections />;
    default:
      return null;
  }
}

export default function AdminLayout({
  activeSection,
  setActiveSection,
  userEmail,
  onSignOut,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = () => (
    <aside className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest">Admin Dashboard</p>
        <p className="text-xs text-muted-foreground mt-1 truncate">{userEmail}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeSection === item.id
                ? "bg-primary/20 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <p className="text-sm font-semibold text-primary">Admin</p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 h-full">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Desktop header */}
          <header className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
            <h1 className="text-lg font-semibold capitalize">
              {navItems.find((n) => n.id === activeSection)?.label ?? "Dashboard"}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{userEmail}</span>
              <Separator orientation="vertical" className="h-5" />
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={onSignOut}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </header>

          <div className="p-4 lg:p-6">
            <SectionContent section={activeSection} />
          </div>
        </main>
      </div>
    </div>
  );
}
