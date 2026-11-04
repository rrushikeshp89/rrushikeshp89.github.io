import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Rendered once at build: GitHub Pages serves it as a static file (ADR-029). */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/design" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
