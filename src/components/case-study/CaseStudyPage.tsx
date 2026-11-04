import type { Metadata } from "next";
import { ArchitectureDiagram } from "@/components/project/ArchitectureDiagram";
import { MetricList } from "@/components/project/MetricList";
import { ProjectLinks } from "@/components/project/ProjectLinks";
import { ChipList } from "@/components/ui/Chip";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { facts } from "@/content/facts";
import { getProject } from "@/content/queries";
import { ogImageMetadata } from "@/lib/og-image";
import { TODO_CONFIRM, type Project } from "@/content/schema";

/** Metadata for a case-study route; each route file under src/app/work/ calls it with its slug. */
export function caseStudyMetadata(slug: string): Metadata {
  const project = getProject(slug);
  return {
    title: `${project.name} case study`,
    description: project.pitch,
    alternates: { canonical: `/work/${project.slug}/` },
    openGraph: {
      title: `${project.name} case study`,
      description: project.pitch,
      images: ogImageMetadata(`/work/${project.slug}/og.png`, `${project.name} case study`),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} case study`,
      description: project.pitch,
      images: [`/work/${project.slug}/og.png`],
    },
  };
}

function nextProject(current: Project): Project {
  const index = facts.projects.indexOf(current);
  const next = facts.projects[(index + 1) % facts.projects.length];
  if (!next) throw new Error("No projects to link to");
  return next;
}

interface CaseStudyPageProps {
  slug: string;
}

/**
 * A case study: problem, architecture, key decisions, proof and limitations. Each project has its
 * own static route file (src/app/work/<slug>/page.tsx), so an unknown /work/ URL is a real 404.
 */
export function CaseStudyPage({ slug }: CaseStudyPageProps) {
  const project = getProject(slug);

  const { caseStudy } = project;
  // IDs carry the slug: Next keeps visited routes hidden in the DOM, and shared IDs would let
  // aria-labelledby resolve to another case study's heading (DECISIONS.md, ADR-025).
  const next = nextProject(project);

  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <header className="mx-auto max-w-page px-4 pt-12 pb-4 sm:px-6 lg:px-8 lg:pt-20">
        <p className="text-small">
          <TextLink href="/#work" className="inline-flex min-h-11 items-center">
            All selected work
          </TextLink>
        </p>
        <h1 className="mt-4 font-display text-display">{project.name}</h1>
        <p className="mt-6 max-w-[48ch] text-lead">{project.pitch}</p>
        <ChipList label={`${project.name} stack`} items={project.stack} className="mt-6" />
        <div className="mt-8">
          <ProjectLinks name={project.name} links={project.links} />
        </div>
      </header>

      <Section id={`${project.slug}-problem`} title="The problem">
        <p className="max-w-measure text-lead">{caseStudy.problem}</p>
      </Section>

      <Section id={`${project.slug}-architecture`} title="Architecture">
        <ArchitectureDiagram
          diagram={caseStudy.diagram}
          titleId={`${project.slug}-diagram-title`}
        />
      </Section>

      <Section id={`${project.slug}-decisions`} title="Key decisions">
        <dl className="max-w-measure space-y-8">
          {caseStudy.decisions.map((decision) => (
            <div key={decision.title}>
              <dt className="font-display text-h3">{decision.title}</dt>
              <dd className="mt-2 text-ink-muted">{decision.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id={`${project.slug}-proof`}
        title="Proof"
        note="Every number opens its source. Every claim links to the code."
      >
        {project.metrics.length > 0 ? (
          <div className="mb-12">
            <MetricList metrics={project.metrics} label={`${project.name} in numbers`} />
          </div>
        ) : null}
        <ul className="max-w-measure space-y-4">
          {caseStudy.proof.map((item) => (
            <li key={item.href} className="border-t border-rule pt-4">
              <p>{item.claim}</p>
              <p className="mt-1 text-small">
                <TextLink href={item.href} className="inline-flex min-h-11 items-center font-mono">
                  {item.label}
                  <span className="sr-only"> in the {project.name} repository</span>
                </TextLink>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {project.limitations !== TODO_CONFIRM ? (
        <Section id={`${project.slug}-limitations`} title="What it doesn’t do yet">
          <ul className="max-w-measure list-disc space-y-3 pl-5 marker:text-accent">
            {project.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      <nav
        aria-label="More case studies"
        className="mx-auto max-w-page border-t border-rule px-4 py-12 sm:px-6 lg:px-8"
      >
        <p className="text-small text-ink-muted">Next case study</p>
        <p className="mt-2">
          <TextLink href={`/work/${next.slug}`} className="font-display text-h3">
            {next.name}
          </TextLink>
        </p>
      </nav>
    </main>
  );
}
