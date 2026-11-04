import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";
import type { Project } from "@/content/schema";

interface ProjectLinksProps {
  name: string;
  links: Project["links"];
  /** When set, the case study is the primary action and the external links step back. */
  caseStudyHref?: string;
}

const VISIBLE_LABEL: Record<Project["links"][number]["kind"], string> = {
  source: "Source code",
  live: "Live demo",
};

/** Visible text stays short; the hidden suffix makes each link unique out of context. */
export function ProjectLinks({ name, links, caseStudyHref }: ProjectLinksProps) {
  const externalVariant = (kind: Project["links"][number]["kind"]) =>
    caseStudyHref || kind === "source" ? "quiet" : "primary";

  return (
    <ul className="flex flex-wrap gap-3">
      {caseStudyHref ? (
        <li>
          <Link href={caseStudyHref} className={buttonClassName("primary")}>
            Case study
            <span className="sr-only"> for {name}</span>
          </Link>
        </li>
      ) : null}
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            rel="noopener noreferrer"
            className={buttonClassName(externalVariant(link.kind))}
          >
            {VISIBLE_LABEL[link.kind]}
            <span className="sr-only"> for {name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
