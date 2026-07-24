// Eager (non-lazy) imports — renderToString cannot resolve React.lazy/Suspense
import IndexPage from "../pages/Index";
import ResumePage from "../pages/Resume";
import BlogPage from "../pages/Blog";
import staticRoutes from "./staticRoutes.json";

export interface PrerenderRoute {
  path: string;
  Component: React.ComponentType<Record<string, unknown>>;
}

const COMPONENT_BY_PATH: Record<string, React.ComponentType<Record<string, unknown>>> = {
  "/":       IndexPage  as React.ComponentType<Record<string, unknown>>,
  "/resume": ResumePage as React.ComponentType<Record<string, unknown>>,
  "/blog":   BlogPage   as React.ComponentType<Record<string, unknown>>,
};

export const prerenderRoutes: PrerenderRoute[] = (
  staticRoutes as Array<{ path: string }>
).map((r) => ({
  path: r.path,
  Component: COMPONENT_BY_PATH[r.path],
}));
