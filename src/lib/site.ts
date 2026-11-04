import { facts } from "@/content/facts";
import { TODO_CONFIRM } from "@/content/schema";

/** Used until the real domain is confirmed; canonical/OG/sitemap URLs depend on it. */
const FALLBACK_SITE_URL = "http://localhost:3000";

export const siteUrl = new URL(
  facts.site.url === TODO_CONFIRM ? FALLBACK_SITE_URL : facts.site.url,
);
