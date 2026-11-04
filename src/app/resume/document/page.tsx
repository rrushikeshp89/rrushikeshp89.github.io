import type { Metadata } from "next";
import { facts } from "@/content/facts";
import { formatYearMonth } from "@/lib/format";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${facts.identity.name}, ${facts.identity.role}.`,
  robots: { index: false },
};

const PROJECT_LINK_LABEL = { source: "Source", live: "Live" } as const;

/** "https://github.com/x" → "github.com/x": shorter in print, still a working link. */
function displayUrl(href: string): string {
  return href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/** "Two-agent research." → "two-agent research", to sit inside parentheses mid-sentence. */
function asClause(sentence: string): string {
  const trimmed = sentence.replace(/\.$/, "");
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="mt-3 border-b border-rule pb-0.5 font-display text-[11.5pt] text-accent">
      {children}
    </h2>
  );
}

/**
 * The résumé, generated from facts.ts and printed to /resume.pdf at build time
 * (scripts/build-resume.mjs), so it always says exactly what the site says. It deliberately
 * carries no phone number (master prompt §3, owner's choice). Readable on screen, sized for one
 * A4 page in print.
 */
export default function ResumeDocumentPage() {
  const { name, role, location, email, linkedin, github, objective } = facts.identity;

  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <article
        aria-labelledby="resume-name"
        className="resume-document mx-auto max-w-[52rem] px-4 py-12 text-[9pt] leading-[1.38] sm:px-6 print:max-w-none print:p-0"
      >
        <header>
          <h1 id="resume-name" className="font-display text-[22pt] leading-tight">
            {name}
          </h1>
          <p className="mt-0.5 text-[10.5pt]">
            {role}, {location}
          </p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-ink-muted print:gap-y-0">
            <li>
              <a href={`mailto:${email}`} className="inline-block py-1 text-accent print:py-0">
                {email}
              </a>
            </li>
            <li>
              <a
                href={siteUrl.href}
                rel="noopener noreferrer"
                className="inline-block py-1 text-accent print:py-0"
              >
                {displayUrl(siteUrl.href)}
              </a>
            </li>
            <li>
              <a
                href={linkedin}
                rel="noopener noreferrer"
                className="inline-block py-1 text-accent print:py-0"
              >
                {displayUrl(linkedin)}
              </a>
            </li>
            <li>
              <a
                href={github}
                rel="noopener noreferrer"
                className="inline-block py-1 text-accent print:py-0"
              >
                {displayUrl(github)}
              </a>
            </li>
          </ul>
        </header>

        <section aria-label="Objective" className="mt-3">
          <p>{objective}</p>
        </section>

        <section aria-labelledby="resume-projects">
          <SectionTitle id="resume-projects">Projects</SectionTitle>
          {facts.projects.map((project) => (
            <div key={project.slug} className="mt-1.5 break-inside-avoid">
              <h3 className="flex flex-wrap items-baseline justify-between gap-x-3 font-sans text-[10pt] font-medium tracking-normal">
                <span>
                  {project.name}
                  <span className="font-normal text-ink-muted"> | {project.stack.join(", ")}</span>
                </span>
                <span className="text-[8.5pt] font-normal">
                  {project.links.map((link, index) => (
                    <span key={link.href}>
                      {index > 0 ? ", " : ""}
                      <a href={link.href} rel="noopener noreferrer" className="text-accent">
                        {PROJECT_LINK_LABEL[link.kind]}
                      </a>
                    </span>
                  ))}
                </span>
              </h3>
              <ul className="mt-0.5 list-disc pl-4 marker:text-accent">
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="mt-2">
            <span className="font-medium">Also: </span>
            {facts.secondaryProjects
              .map((project) => `${project.name} (${asClause(project.summary)})`)
              .join("; ")}
            .
          </p>
        </section>

        <section aria-labelledby="resume-experience">
          <SectionTitle id="resume-experience">Experience</SectionTitle>
          {facts.experience.map((job) => (
            <div key={`${job.organization}-${job.start}`} className="mt-1.5 break-inside-avoid">
              <h3 className="flex flex-wrap items-baseline justify-between gap-x-3 font-sans text-[10pt] font-medium tracking-normal">
                <span>
                  {job.role}, {job.organization}
                </span>
                <span className="text-[8.5pt] font-normal text-ink-muted">
                  <time dateTime={job.start}>{formatYearMonth(job.start)}</time> to{" "}
                  <time dateTime={job.end}>{formatYearMonth(job.end)}</time>,{" "}
                  {job.workMode === "Remote" ? "remote" : `${job.location}, on-site`}
                </span>
              </h3>
              <ul className="mt-0.5 list-disc pl-4 marker:text-accent">
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section aria-labelledby="resume-education">
          <SectionTitle id="resume-education">Education and certifications</SectionTitle>
          {facts.education.map((entry) => (
            <p key={entry.institution} className="mt-2 flex flex-wrap justify-between gap-x-3">
              <span>
                <span className="font-medium">
                  {entry.degree}, {entry.field}
                </span>
                , {entry.institution}, {entry.location}. CGPA {entry.cgpa.value}/{entry.cgpa.scale}
              </span>
              <time dateTime={entry.graduation} className="text-[8.5pt] text-ink-muted">
                {formatYearMonth(entry.graduation)}
              </time>
            </p>
          ))}
          <p className="mt-1">{facts.certifications.join("; ")}</p>
        </section>

        <section aria-labelledby="resume-skills">
          <SectionTitle id="resume-skills">Skills</SectionTitle>
          <dl className="mt-1.5 grid grid-cols-[8.5rem_1fr] gap-x-3 gap-y-0.5">
            {facts.skills.map(({ group, items }) => (
              <div key={group} className="contents">
                <dt className="font-medium">{group}</dt>
                <dd>{items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </main>
  );
}
