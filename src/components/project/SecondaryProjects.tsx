import { TextLink } from "@/components/ui/TextLink";
import { facts } from "@/content/facts";

const LINK_LABEL = { source: "Source", live: "Live demo" } as const;

export function SecondaryProjects() {
  return (
    <div className="mt-20">
      <h3 id="secondary-title" className="text-h3">
        Explainable AI and data science
      </h3>
      <ul aria-labelledby="secondary-title" className="mt-6 grid gap-8 sm:grid-cols-3 sm:gap-6">
        {facts.secondaryProjects.map((project) => (
          <li key={project.name} className="border-t border-rule pt-4">
            <p className="font-medium">{project.name}</p>
            <p className="mt-1 text-small text-ink-muted">{project.summary}</p>
            <p className="mt-2 flex flex-wrap gap-x-4 text-small">
              {project.links.map((link) => (
                <TextLink
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center"
                >
                  {LINK_LABEL[link.kind]}
                  <span className="sr-only"> for {project.name}</span>
                </TextLink>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
