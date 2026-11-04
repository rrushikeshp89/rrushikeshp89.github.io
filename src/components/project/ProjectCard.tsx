import { Card } from "@/components/ui/Card";
import { ChipList } from "@/components/ui/Chip";
import { TODO_CONFIRM, type Project } from "@/content/schema";
import { MetricList } from "./MetricList";
import { ProjectLinks } from "./ProjectLinks";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const titleId = `${project.slug}-title`;
  const numerals = project.metrics.filter((metric) => metric.countTo !== undefined);

  return (
    <Card tone={featured ? "featured" : "plain"} labelledBy={titleId}>
      <h3 id={titleId} className={featured ? "text-h2" : "text-h3"}>
        {project.name}
      </h3>
      <p className="mt-3 max-w-measure text-lead">{project.pitch}</p>
      <ChipList label={`${project.name} stack`} items={project.stack} className="mt-6" />

      {featured ? (
        <div className="mt-10">
          <MetricList metrics={numerals} label={`${project.name} in numbers`} />
        </div>
      ) : null}

      <ul className="mt-8 max-w-measure list-disc space-y-3 pl-5 marker:text-accent">
        {project.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      {project.limitations !== TODO_CONFIRM ? (
        <p className="mt-6 max-w-measure text-ink-muted">
          <span className="font-medium text-ink">What this doesn&rsquo;t do yet: </span>
          {project.limitations.join(" ")}
        </p>
      ) : null}

      <div className="mt-8">
        <ProjectLinks name={project.name} links={project.links} />
      </div>
    </Card>
  );
}
