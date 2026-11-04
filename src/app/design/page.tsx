import type { Metadata } from "next";
import { Receipt } from "@/components/receipts/Receipt";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChipList } from "@/components/ui/Chip";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { facts } from "@/content/facts";
import { getMetric, getProject } from "@/content/queries";

export const metadata: Metadata = {
  title: "Design system",
  description: "Tokens and components used on this site.",
  robots: { index: false, follow: false },
};

const SWATCHES = [
  { token: "paper", role: "Page background" },
  { token: "surface", role: "Raised slips and featured cards" },
  { token: "ink", role: "Text" },
  { token: "ink-muted", role: "Secondary text" },
  { token: "rule", role: "Hairlines and borders" },
  { token: "accent", role: "Links, focus, primary action" },
  { token: "accent-soft", role: "Selected and hover fills" },
  { token: "secondary", role: "Diagrams" },
  { token: "success", role: "Positive status, always with text" },
  { token: "warn", role: "Caution status, always with text" },
] as const;

export default function DesignPage() {
  const grove = getProject("grove-hrms");
  const leadhub = getProject("leadhub-crm");
  const [tablesMetric] = grove.metrics;
  const clsMetric = getMetric("stockroom-cls");

  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <header className="mx-auto flex max-w-page flex-wrap items-end justify-between gap-6 px-4 pt-16 sm:px-6 lg:px-8">
        <div>
          <h1 className="font-display text-display">Design system</h1>
          <p className="mt-4 max-w-[48ch] text-lead text-ink-muted">
            The tokens and components this site is built from, shown in the current theme.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Section
        id="colour"
        title="Colour"
        note="Every text pair is checked for 4.5:1 contrast in both themes."
      >
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SWATCHES.map(({ token, role }) => (
            <li key={token} className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="size-12 shrink-0 rounded-chip ring-1 ring-rule"
                style={{ backgroundColor: `var(--${token})` }}
              />
              <span>
                <span className="block font-mono text-small">{token}</span>
                <span className="text-small text-ink-muted">{role}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="type"
        title="Type"
        note="Newsreader for display, IBM Plex Sans for text, IBM Plex Mono for figures."
      >
        <div className="space-y-10">
          <p className="font-display text-display">{facts.identity.headline}</p>
          <p className="font-display text-h2">{grove.name}</p>
          <p className="font-display text-h3">{leadhub.name}</p>
          <p className="max-w-measure text-lead">{grove.pitch}</p>
          <p className="max-w-measure">{facts.identity.objective}</p>
          <p className="max-w-measure text-small text-ink-muted">{leadhub.bullets[2]}</p>
          {tablesMetric ? (
            <p className="flex items-baseline gap-3">
              <span className="font-mono text-numeral tracking-tight">{tablesMetric.display}</span>
              <span className="text-ink-muted">{tablesMetric.label}</span>
            </p>
          ) : null}
        </div>
      </Section>

      <Section id="controls" title="Controls" note="Every target is at least 44 by 44 pixels.">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="#colour">See the work</ButtonLink>
          <ButtonLink href={`mailto:${facts.identity.email}`} variant="quiet">
            Email me
          </ButtonLink>
          <Button variant="quiet">Plain button</Button>
          <ThemeToggle />
        </div>
        <p className="mt-8 max-w-measure">
          Inline links read as links:{" "}
          <TextLink href={facts.identity.github}>Rushikesh Panchal on GitHub</TextLink>, or the{" "}
          <TextLink href="/">home page</TextLink>.
        </p>
      </Section>

      <Section id="blocks" title="Content blocks">
        <div className="space-y-12">
          <Card tone="featured" labelledBy="design-card-featured">
            <h3 id="design-card-featured" className="text-h3">
              {grove.name}
            </h3>
            <p className="mt-3 max-w-measure text-lead">{grove.pitch}</p>
            <ChipList label={`${grove.name} stack`} items={grove.stack} className="mt-6" />
          </Card>
          <Card labelledBy="design-card-plain">
            <h3 id="design-card-plain" className="text-h3">
              {leadhub.name}
            </h3>
            <p className="mt-3 max-w-measure">{leadhub.pitch}</p>
            <ChipList label={`${leadhub.name} stack`} items={leadhub.stack} className="mt-6" />
          </Card>
        </div>
      </Section>

      <Section
        id="receipts"
        title="Receipts"
        note="Open with click, Enter or Space. Esc closes and returns focus."
      >
        <p className="max-w-measure">
          Stockroom&rsquo;s layout shift went from <Receipt inline metric={clsMetric} />.
        </p>
      </Section>
    </main>
  );
}
