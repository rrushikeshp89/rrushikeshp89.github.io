import { TextLink } from "@/components/ui/TextLink";
import { facts } from "@/content/facts";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule print:hidden">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-8 text-small text-ink-muted sm:px-6 lg:px-8">
        <p>{facts.identity.name}</p>
        <p>
          Built with Next.js, tested with Playwright and axe.{" "}
          <TextLink href={facts.site.source} className="inline-flex min-h-11 items-center">
            Source for this site
          </TextLink>
        </p>
      </div>
    </footer>
  );
}
