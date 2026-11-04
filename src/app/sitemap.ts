import type { MetadataRoute } from "next";
import { facts } from "@/content/facts";
import { siteUrl } from "@/lib/site";

/** Public, indexable pages only: /design is noindex and stays out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteUrl).href;
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    ...facts.projects.map((project) => ({
      url: url(`/work/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
