import { buttonClassName } from "@/components/ui/Button";
import type { Project } from "@/content/schema";

interface ProjectLinksProps {
  name: string;
  links: Project["links"];
}

const VISIBLE_LABEL: Record<Project["links"][number]["kind"], string> = {
  source: "Source code",
  live: "Live demo",
};

/** Visible text stays short; the hidden suffix makes each link unique out of context. */
export function ProjectLinks({ name, links }: ProjectLinksProps) {
  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            rel="noopener noreferrer"
            className={buttonClassName(link.kind === "source" ? "quiet" : "primary")}
          >
            {VISIBLE_LABEL[link.kind]}
            <span className="sr-only"> for {name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
