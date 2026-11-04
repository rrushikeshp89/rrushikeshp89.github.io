import { ScrollStroke } from "@/components/decor/ScrollStroke";
import { ProjectCard } from "@/components/project/ProjectCard";
import { SecondaryProjects } from "@/components/project/SecondaryProjects";
import { Section } from "@/components/ui/Section";
import { facts } from "@/content/facts";

export function SelectedWork() {
  const [featured, ...others] = facts.projects;

  return (
    <Section
      id="work"
      title="Selected work"
      note="Three business systems, each with its source and a live demo."
      aside={<ScrollStroke />}
      className="work-progress"
    >
      <div className="space-y-16">
        {featured ? <ProjectCard project={featured} featured /> : null}
        {others.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <SecondaryProjects />
    </Section>
  );
}
