import type { Project } from "@/content/schema";

interface ArchitectureDiagramProps {
  diagram: Project["caseStudy"]["diagram"];
}

/**
 * The architecture as stacked layers, top to bottom. It is semantic HTML (an ordered list of
 * layers) rather than one SVG, so the text reflows at 320 px and at 200% zoom (WCAG 1.4.4 and
 * 1.4.10) and screen readers get the same structure sighted readers do. Only the arrows are SVG,
 * and they are decorative.
 */
export function ArchitectureDiagram({ diagram }: ArchitectureDiagramProps) {
  return (
    <figure aria-labelledby="architecture-title">
      <p id="architecture-title" className="font-medium">
        {diagram.title}
      </p>
      <ol className="mt-5" aria-label={`${diagram.title}, top to bottom`}>
        {diagram.layers.map((layer, index) => (
          <li key={layer.label}>
            {index > 0 ? <FlowArrow /> : null}
            <div className="rounded-slip border border-secondary/50 bg-surface p-4">
              <p className="text-small font-medium text-secondary">{layer.label}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {layer.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-chip border border-rule px-2.5 py-1 text-small leading-snug"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 max-w-measure text-small text-ink-muted">
        {diagram.description}
      </figcaption>
    </figure>
  );
}

function FlowArrow() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 32"
      className="mx-auto my-1 block h-8 w-6 text-secondary"
      fill="none"
    >
      <path d="M12 2v26M5 21l7 8 7-8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
