import { ProjectCard } from "@/components/project/ProjectCard";
import { RoleSwitch } from "@/components/project/RoleSwitch";
import { SecondaryProjects } from "@/components/project/SecondaryProjects";
import { Section } from "@/components/ui/Section";
import { facts } from "@/content/facts";
import type { Project } from "@/content/schema";

function liveHref(links: Project["links"]): string {
  const live = links.find((link) => link.kind === "live");
  if (!live) throw new Error("The featured project needs a live demo link for its role switch");
  return live.href;
}

export function SelectedWork() {
  const [featured, ...others] = facts.projects;

  return (
    <Section
      id="work"
      title="Selected work"
      note="Three business systems, each with its source and a live demo."
    >
      <div className="space-y-16">
        {featured ? (
          <ProjectCard
            project={featured}
            featured
            demo={<RoleSwitch liveDemoHref={liveHref(featured.links)} />}
          />
        ) : null}
        {others.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <SecondaryProjects />
    </Section>
  );
}
