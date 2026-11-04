import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  /** Short margin note under the title: context, not decoration. */
  note?: ReactNode;
  /** Decorative margin content shown under the note on wide screens only. */
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * The page's marginalia layout: on wide screens the section title sits in a narrow left margin
 * (columns 1–3) and the content runs in columns 5–12. The whole margin block is sticky, so the
 * title, its note and any aside move together. On small screens the margin folds on top.
 */
export function Section({ id, title, note, aside, className = "", children }: SectionProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`mx-auto grid max-w-page grid-cols-12 gap-x-6 px-4 py-16 sm:px-6 lg:px-8 lg:py-24 ${className}`.trim()}
    >
      <div className="col-span-12 mb-8 lg:col-span-3 lg:mb-0">
        <div className="lg:sticky lg:top-24">
          <h2 id={titleId} className="font-display-italic text-h3 italic">
            {title}
          </h2>
          {note ? <div className="mt-3 max-w-[32ch] text-small text-ink-muted">{note}</div> : null}
          {aside ? <div className="mt-8 hidden lg:block">{aside}</div> : null}
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8 lg:col-start-5">{children}</div>
    </section>
  );
}
