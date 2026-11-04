import type { NextConfig } from "next";

/*
  Static export for GitHub Pages (DECISIONS.md, ADR-029). Pages serves files only: no headers,
  redirects or server. The Content-Security-Policy therefore ships as a <meta> tag
  (src/lib/csp.ts), and /resume is a static forwarding page.
*/
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Cache Components is off: it forbids the `dynamic = "force-static"` that static export needs on
  // metadata routes, and a site with no data to cache gains nothing from it (ADR-029).
  experimental: {
    sri: { algorithm: "sha256" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
