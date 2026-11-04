import { CountUp } from "@/components/receipts/CountUp";
import { Receipt } from "@/components/receipts/Receipt";
import { Section } from "@/components/ui/Section";
import { facts } from "@/content/facts";
import { getMetric } from "@/content/queries";
import { formatYearMonth } from "@/lib/format";

const LEAD_METRIC_ID = "zetpeak-errors";

export function Experience() {
  const lead = getMetric(LEAD_METRIC_ID);

  return (
    <Section
      id="experience"
      title="Experience"
      note={
        <p>
          <span className="block font-mono text-numeral tracking-tight text-ink">
            <Receipt metric={lead} className="inline-flex min-h-11 min-w-11 items-center">
              {lead.countTo === undefined ? (
                lead.display
              ) : (
                <CountUp to={lead.countTo} display={lead.display} />
              )}
            </Receipt>
          </span>
          {lead.label} at Zetpeak, from tested data-quality checks.
        </p>
      }
    >
      <ol className="space-y-14">
        {facts.experience.map((job) => (
          <li key={`${job.organization}-${job.start}`} className="border-t border-rule pt-6">
            <h3 className="text-h3">
              {job.role}, {job.organization}
            </h3>
            <p className="mt-2 text-small text-ink-muted">
              <time dateTime={job.start}>{formatYearMonth(job.start)}</time> to{" "}
              <time dateTime={job.end}>{formatYearMonth(job.end)}</time>,{" "}
              {job.workMode === "Remote" ? "remote" : `${job.location}, on-site`}
            </p>
            <ul className="mt-5 max-w-measure list-disc space-y-3 pl-5 marker:text-accent">
              {job.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
