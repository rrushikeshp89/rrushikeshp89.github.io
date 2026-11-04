import type { Metric } from "@/content/schema";

interface MetricListProps {
  metrics: readonly Metric[];
  label: string;
}

/** Large numerals with their labels. A description list keeps number and meaning paired. */
export function MetricList({ metrics, label }: MetricListProps) {
  if (metrics.length === 0) return null;

  return (
    <dl aria-label={label} className="grid max-w-xl grid-cols-2 gap-x-8 gap-y-8">
      {metrics.map((metric) => (
        <div key={metric.id} className="flex flex-col gap-1">
          <dt className="order-last text-small text-ink-muted">{metric.label}</dt>
          <dd className="font-mono text-numeral tracking-tight">{metric.display}</dd>
        </div>
      ))}
    </dl>
  );
}
