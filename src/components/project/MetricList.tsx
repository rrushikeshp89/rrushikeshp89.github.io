import { CountUp } from "@/components/receipts/CountUp";
import { Receipt } from "@/components/receipts/Receipt";
import type { Metric } from "@/content/schema";

type MetricSize = "large" | "medium";

interface MetricListProps {
  metrics: readonly Metric[];
  label: string;
  size?: MetricSize;
}

const NUMBER_SIZE: Record<MetricSize, string> = {
  large: "text-numeral",
  medium: "text-h2",
};

/**
 * Numerals with their labels. Each number is a receipt (activate it to see where it comes from)
 * and counts up on first view. A description list keeps number and meaning paired.
 */
export function MetricList({ metrics, label, size = "large" }: MetricListProps) {
  if (metrics.length === 0) return null;

  return (
    <dl
      aria-label={label}
      className="grid max-w-xl grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-x-8 gap-y-8"
    >
      {metrics.map((metric) => (
        <div key={metric.id} className="flex flex-col gap-1">
          <dt className="order-last text-small text-ink-muted">{metric.label}</dt>
          <dd className={`font-mono tracking-tight ${NUMBER_SIZE[size]}`}>
            <Receipt metric={metric} className="inline-flex min-h-11 min-w-11 items-center">
              {metric.countTo === undefined ? (
                metric.display
              ) : (
                <CountUp to={metric.countTo} display={metric.display} />
              )}
            </Receipt>
          </dd>
        </div>
      ))}
    </dl>
  );
}
