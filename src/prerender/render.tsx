import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

export interface RenderInput {
  path: string;
  Component: React.ComponentType<Record<string, unknown>>;
  routePattern?: string;
}

export interface RenderOutput {
  bodyHtml: string;
  headHtml: string;
}

export async function renderRoute(input: RenderInput): Promise<RenderOutput> {
  const routePattern = input.routePattern ?? input.path;
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const helmetContext: { helmet?: Record<string, { toString(): string }> } = {};

  // Suppress the useLayoutEffect-on-server warning that framer-motion and
  // react-router's Link emit. It is harmless during renderToString.
  const prevErr = console.error;
  console.error = (...args: unknown[]) => {
    const s = typeof args[0] === "string" ? args[0] : "";
    if (s.includes("useLayoutEffect does nothing on the server")) return;
    prevErr(...(args as []));
  };

  try {
    const bodyHtml = renderToString(
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          {/* defaultTheme keeps the SSR render consistent with the site default */}
          <ThemeProvider defaultTheme="dark">
            <TooltipProvider>
              <MemoryRouter initialEntries={[input.path]}>
                <Routes>
                  <Route
                    path={routePattern}
                    element={<input.Component />}
                  />
                </Routes>
              </MemoryRouter>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );

    const h = helmetContext.helmet;
    const headHtml = h
      ? [
          h.title?.toString() ?? "",
          h.meta?.toString() ?? "",
          h.link?.toString() ?? "",
          h.script?.toString() ?? "",
        ]
          .filter(Boolean)
          .join("\n")
      : "";

    return { bodyHtml, headHtml };
  } finally {
    console.error = prevErr;
  }
}

// Tags that the shell index.html hardcodes but that Helmet will re-emit per-route.
// Strip them before injection so the final HTML never has duplicates.
const SHELL_HEAD_PATTERNS: RegExp[] = [
  /<title>[^<]*<\/title>/i,
  /<meta\s+name="description"[^>]*>/i,
  /<meta\s+name="keywords"[^>]*>/i,
  /<meta\s+property="og:[^"]*"[^>]*\/?>/gi,
  /<meta\s+name="twitter:[^"]*"[^>]*\/?>/gi,
  /<link\s+rel="canonical"[^>]*>/i,
  /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi,
];

export function injectIntoTemplate(
  template: string,
  parts: { headHtml: string; bodyHtml: string }
): string {
  let html = template;
  for (const re of SHELL_HEAD_PATTERNS) html = html.replace(re, "");
  html = html.replace("</head>", `${parts.headHtml}\n</head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${parts.bodyHtml}</div>`
  );
  return html;
}
