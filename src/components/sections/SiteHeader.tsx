import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { facts } from "@/content/facts";
import { TODO_CONFIRM } from "@/content/schema";

const ANCHORS = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#contact", label: "Contact" },
] as const;

const NAV_LINK =
  "inline-flex min-h-11 items-center rounded-chip px-2 text-ink transition-colors duration-200 hover:bg-accent-soft sm:px-3";

/**
 * Sticky from the md breakpoint. On phones it scrolls away instead: a two-row sticky bar would
 * cover an eighth of the screen, and the hero and contact section repeat every action it holds.
 */
export function SiteHeader() {
  const { name, linkedin, github, resume } = facts.identity;

  return (
    <header className="z-40 border-b border-rule bg-paper md:sticky md:top-0">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-chip font-display text-lead"
        >
          {name}
        </Link>
        <div className="flex items-center gap-1 md:order-last">
          <ul className="hidden items-center gap-1 sm:flex">
            {resume !== TODO_CONFIRM ? (
              <li>
                <a href={resume} className={NAV_LINK}>
                  Résumé
                </a>
              </li>
            ) : null}
            <li>
              <a href={linkedin} rel="noopener noreferrer" className={NAV_LINK}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={github} rel="noopener noreferrer" className={NAV_LINK}>
                GitHub
              </a>
            </li>
          </ul>
          <ThemeToggle />
        </div>
        <nav aria-label="Sections" className="-mx-2 w-full md:mx-0 md:ml-auto md:w-auto">
          <ul className="flex items-center gap-1">
            {ANCHORS.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={NAV_LINK}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
