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

/** Displays like "0.495 → 0.004" step down a size and take a full row so they never wrap. */
const LONG_DISPLAY_CHARS = 6;
const LONG_NUMBER_SIZE: Record<MetricSize, string> = {
  large: "text-h2",
  medium: "text-h3",
};

/**
 * Numerals with their labels. Each number is a receipt (activate it to see where it comes from)
 * and counts up on first view. A description list keeps number and meaning paired.
 */
function isLong(metric: Metric): boolean {
  return metric.display.length > LONG_DISPLAY_CHARS;
}

export function MetricList({ metrics, label, size = "large" }: MetricListProps) {
  if (metrics.length === 0) return null;

  return (
    <dl
      aria-label={label}
      className="grid max-w-xl grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-x-8 gap-y-8"
    >
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className={`flex flex-col gap-1 ${isLong(metric) ? "col-span-full" : ""}`.trim()}
        >
          <dt className="order-last text-small text-ink-muted">{metric.label}</dt>
          <dd
            className={`font-mono tracking-tight whitespace-nowrap ${isLong(metric) ? LONG_NUMBER_SIZE[size] : NUMBER_SIZE[size]}`}
          >
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
