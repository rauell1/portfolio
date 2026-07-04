#!/usr/bin/env node
// Run AFTER `vite build`. Reads dist/index.html as the shell template and
// writes dist/<route>/index.html for every public route defined in staticRoutes.json.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const TEMPLATE_PATH = path.join(DIST, "index.html");

async function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error("✖ dist/index.html not found — run `vite build` first.");
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  // Load .env.* files (present locally; absent on Vercel where vars come from process.env).
  const fileEnv = loadEnv("production", ROOT, "VITE_");
  const pick = (k, fallback) => fileEnv[k] || process.env[k] || fallback;

  // Statically replace import.meta.env.VITE_* in SSR-loaded modules so that
  // createBrowserClient() never throws "URL is not defined" — even when there
  // is no .env file (CI / Vercel build). The placeholder values are harmless
  // because renderToString runs no effects, so Supabase makes zero network calls.
  const define = {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      pick("VITE_SUPABASE_URL", "https://placeholder.supabase.co")
    ),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
      pick("VITE_SUPABASE_PUBLISHABLE_KEY", "placeholder-anon-key")
    ),
  };

  const vite = await createServer({
    root: ROOT,
    mode: "production",
    define,
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true },
    appType: "custom",
    logLevel: "warn",
  });

  try {
    const { prerenderRoutes } = await vite.ssrLoadModule(
      "/src/prerender/routes.tsx"
    );
    const { renderRoute, injectIntoTemplate } = await vite.ssrLoadModule(
      "/src/prerender/render.tsx"
    );

    let written = 0;
    let skipped = 0;

    for (const route of prerenderRoutes) {
      try {
        const { bodyHtml, headHtml } = await renderRoute({
          path: route.path,
          Component: route.Component,
        });
        const html = injectIntoTemplate(template, { headHtml, bodyHtml });
        writeRoute(html, route.path);
        written++;
      } catch (err) {
        // Log and continue — the SPA fallback still serves this route client-side.
        console.warn(`⚠ prerender skipped ${route.path}: ${err.message}`);
        skipped++;
      }
    }

    const label = skipped > 0 ? ` (${skipped} skipped)` : "";
    console.log(`✔ prerendered ${written} routes${label}`);
  } finally {
    await vite.close();
  }
}

function writeRoute(html, routePath) {
  const rel =
    routePath === "/"
      ? "index.html"
      : path.join(routePath.replace(/^\//, ""), "index.html");
  const outPath = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✖ prerender failed:", err);
    process.exit(1);
  });
