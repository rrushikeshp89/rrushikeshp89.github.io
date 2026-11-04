"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface CountUpProps {
  to: number;
  /** The final text, e.g. "130+". Server HTML shows it, so there is never a wrong number without JS. */
  display: string;
}

const DURATION_MS = 900;
const VISIBLE_THRESHOLD = 0.6;

function splitAround(display: string, value: number): [string, string] {
  const digits = String(value);
  const index = display.indexOf(digits);
  if (index === -1) return ["", ""];
  return [display.slice(0, index), display.slice(index + digits.length)];
}

/**
 * Counts up to a metric the first time it scrolls into view. Only numbers that start below the
 * fold animate (one already on screen at load just shows its value), nothing animates under
 * prefers-reduced-motion, and the width is reserved in `ch` so counting never shifts layout.
 * Screen readers get the final value from the surrounding receipt, never the moving digits.
 */
export function CountUp({ to, display }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    const [prefix, suffix] = splitAround(display, to);
    const render = (value: number) => {
      node.textContent = `${prefix}${value}${suffix}`;
    };
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / DURATION_MS);
          render(Math.round(to * (1 - (1 - progress) ** 3)));
          if (progress < 1) frame = requestAnimationFrame(tick);
          else node.textContent = display;
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: VISIBLE_THRESHOLD },
    );

    render(0);
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = display;
    };
  }, [to, display]);

  return (
    <span
      ref={ref}
      className="inline-block text-left tabular-nums"
      style={{ minWidth: `${display.length}ch` } as CSSProperties}
    >
      {display}
    </span>
  );
}
