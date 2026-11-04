import type { ReactNode } from "react";

type CardTone = "plain" | "featured";

interface CardProps {
  children: ReactNode;
  tone?: CardTone;
  labelledBy?: string;
  className?: string;
}

const TONES: Record<CardTone, string> = {
  plain: "border-t border-rule pt-8",
  featured: "rounded-slip bg-surface p-6 ring-1 ring-rule sm:p-8 lg:p-10",
};

/** A self-contained piece of work. Featured cards are raised; plain ones sit on a hairline. */
export function Card({ children, tone = "plain", labelledBy, className = "" }: CardProps) {
  return (
    <article aria-labelledby={labelledBy} className={`${TONES[tone]} ${className}`.trim()}>
      {children}
    </article>
  );
}
