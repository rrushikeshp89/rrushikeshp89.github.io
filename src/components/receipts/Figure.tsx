import type { Metric } from "@/content/schema";

interface FigureProps {
  metric: Metric;
}

/** A number from facts.ts, set in the figures face. Phase 4 turns it into a receipt. */
export function Figure({ metric }: FigureProps) {
  return <span className="font-mono font-medium whitespace-nowrap">{metric.display}</span>;
}
