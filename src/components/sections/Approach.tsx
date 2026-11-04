import { Section } from "@/components/ui/Section";
import { facts } from "@/content/facts";

export function Approach() {
  const { principles, writePath } = facts.approach;

  return (
    <Section id="approach" title="How I work">
      <ul className="space-y-8">
        {principles.map((principle) => (
          <li key={principle.title} className="max-w-measure">
            <p className="font-display text-h3">{principle.title}</p>
            <p className="mt-2 text-ink-muted">{principle.detail}</p>
          </li>
        ))}
      </ul>

      <figure className="mt-16">
        <ol
          aria-label="Write path"
          className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-0 lg:gap-y-3"
        >
          {writePath.steps.map((step, index) => (
            <li key={step} className="flex items-center lg:contents">
              {index > 0 ? (
                <span aria-hidden="true" className="hidden px-2 text-secondary lg:inline">
                  <StepArrow />
                </span>
              ) : null}
              <span className="inline-flex min-h-10 items-center rounded-chip border border-secondary/60 px-3 font-mono text-small">
                {step}
              </span>
            </li>
          ))}
        </ol>
        <figcaption className="mt-4 text-small text-ink-muted">{writePath.caption}</figcaption>
      </figure>
    </Section>
  );
}

function StepArrow() {
  return (
    <svg viewBox="0 0 24 12" className="h-3 w-6" fill="none" focusable="false">
      <path d="M0 6h21M17 1.5 22 6l-5 4.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
