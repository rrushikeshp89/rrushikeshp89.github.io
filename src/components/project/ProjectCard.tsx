import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { ChipList } from "@/components/ui/Chip";
import { TODO_CONFIRM, type Project } from "@/content/schema";
import { MetricList } from "./MetricList";
import { ProjectLinks } from "./ProjectLinks";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  /** An interactive illustration shown under the bullets (Grove's role switch). */
  demo?: ReactNode;
}

export function ProjectCard({ project, featured = false, demo }: ProjectCardProps) {
  const titleId = `${project.slug}-title`;

  return (
    <Card tone={featured ? "featured" : "plain"} labelledBy={titleId}>
      <h3 id={titleId} className={featured ? "text-h2" : "text-h3"}>
        {project.name}
      </h3>
      <p className="mt-3 max-w-measure text-lead">{project.pitch}</p>
      <ChipList label={`${project.name} stack`} items={project.stack} className="mt-6" />

      {project.metrics.length > 0 ? (
        <div className={featured ? "mt-10" : "mt-8"}>
          <MetricList
            metrics={project.metrics}
            label={`${project.name} in numbers`}
            size={featured ? "large" : "medium"}
          />
        </div>
      ) : null}

      <ul className="mt-8 max-w-measure list-disc space-y-3 pl-5 marker:text-accent">
        {project.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      {demo ? <div className="mt-10">{demo}</div> : null}

      {project.limitations !== TODO_CONFIRM ? (
        <p className="mt-6 max-w-measure text-ink-muted">
          <span className="font-medium text-ink">What this doesn&rsquo;t do yet: </span>
          {project.limitations[0]}
        </p>
      ) : null}

      <div className="mt-8">
        <ProjectLinks
          name={project.name}
          links={project.links}
          caseStudyHref={`/work/${project.slug}`}
        />
      </div>
    </Card>
  );
}
