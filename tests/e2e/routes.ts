import { rawFacts } from "../../src/content/facts";

export const CASE_STUDY_ROUTES = rawFacts.projects.map((project) => `/work/${project.slug}`);

/** Every route the axe matrix scans. */
export const ROUTES = ["/", "/design", ...CASE_STUDY_ROUTES, "/this-page-does-not-exist"] as const;

export const COLOR_SCHEMES = ["light", "dark"] as const;
