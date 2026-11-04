"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Metric } from "@/content/schema";

interface ReceiptProps {
  metric: Metric;
  /** What the trigger shows; defaults to the metric's display value. */
  children?: ReactNode;
  /** Inline receipts sit inside a sentence (exempt from the 44 px target size, WCAG 2.5.8). */
  inline?: boolean;
  className?: string;
}

const PROOF_PREFIX: Record<Metric["receipt"]["proof"]["kind"], string> = {
  repo: "Source:",
  tests: "Tests:",
  ci: "CI:",
  live: "See it:",
  resume: "Source:",
};

/**
 * Native light dismiss: a click on the backdrop closes the dialog where the browser supports
 * `closedby`. Elsewhere Esc and the Close button still work. (React's types predate the attribute.)
 */
const LIGHT_DISMISS = { closedby: "any" } as Record<string, string>;

/**
 * "Show the receipts": a number that, when activated (click, Enter or Space), opens a slip saying
 * where it comes from and linking to the proof. The slip is a native modal <dialog>: the rest of
 * the page is inert while it is open, Esc and the close button dismiss it, and focus returns to
 * the number. It is portalled to <body> because a dialog cannot live inside a sentence's <p>.
 */
export function Receipt({ metric, children, inline = false, className = "" }: ReceiptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const anchorName = `--receipt-${titleId.replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) dialog.showModal();
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  const { proof, explanation } = metric.receipt;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        className={`receipt ${inline ? "receipt-inline" : ""} ${className}`.trim()}
        data-inline-target={inline ? "" : undefined}
        style={{ "--receipt-anchor": anchorName } as CSSProperties}
      >
        <span aria-hidden="true">{children ?? metric.display}</span>
        <span className="sr-only">
          {metric.display} {metric.label}, show source
        </span>
      </button>
      {isOpen
        ? createPortal(
            <dialog
              ref={dialogRef}
              aria-labelledby={titleId}
              onClose={handleClose}
              {...LIGHT_DISMISS}
              className="receipt-slip"
              style={{ "--receipt-anchor": anchorName } as CSSProperties}
            >
              <div className="p-5 pr-14">
                <p id={titleId} className="font-display text-lead leading-snug">
                  <span className="font-mono">{metric.display}</span> {metric.label}
                </p>
                <p className="mt-2 text-small">{explanation}</p>
                <p className="mt-3 text-small">
                  <span className="text-ink-muted">{PROOF_PREFIX[proof.kind]} </span>
                  {"href" in proof ? (
                    <a
                      href={proof.href}
                      rel="noopener noreferrer"
                      className="text-accent underline decoration-accent/50 underline-offset-[0.2em] hover:decoration-2"
                    >
                      {proof.label}
                    </a>
                  ) : (
                    proof.label
                  )}
                </p>
              </div>
              <form method="dialog">
                <button
                  type="submit"
                  className="absolute top-2 right-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-chip text-ink-muted transition-colors duration-200 hover:bg-accent-soft hover:text-ink"
                >
                  <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" className="size-4">
                    <path
                      d="M5 5l10 10M15 5L5 15"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="sr-only">Close</span>
                </button>
              </form>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
