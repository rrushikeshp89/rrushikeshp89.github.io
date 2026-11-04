import { Section } from "@/components/ui/Section";
import { facts } from "@/content/facts";
import { formatYearMonth } from "@/lib/format";

export function Credentials() {
  return (
    <Section id="credentials" title="Education">
      <ul className="space-y-6">
        {facts.education.map((entry) => (
          <li key={entry.institution}>
            <h3 className="text-h3">
              {entry.degree}, {entry.field}
            </h3>
            <p className="mt-2 text-ink-muted">
              {entry.institution}, {entry.location}. Completed{" "}
              <time dateTime={entry.graduation}>{formatYearMonth(entry.graduation)}</time>. CGPA{" "}
              <span className="font-mono text-ink">
                {entry.cgpa.value}/{entry.cgpa.scale}
              </span>
              .
            </p>
          </li>
        ))}
      </ul>
      <h3 className="mt-12 font-sans text-body font-medium tracking-normal">Certifications</h3>
      <ul className="mt-3 max-w-measure list-disc space-y-2 pl-5 marker:text-accent">
        {facts.certifications.map((certification) => (
          <li key={certification}>{certification}</li>
        ))}
      </ul>
    </Section>
  );
}
