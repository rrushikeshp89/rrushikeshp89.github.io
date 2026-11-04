"use client";

import * as Popover from "@radix-ui/react-popover";
import { useId, type ReactElement, type ReactNode } from "react";

interface SlipProps {
  /** A single focusable element (usually a <button>); Radix attaches the trigger behaviour to it. */
  trigger: ReactElement;
  title: string;
  children: ReactNode;
}

/**
 * An annotation slip: a small dialog that opens on click, Enter or Space (never hover), traps
 * focus while open, closes on Esc or the close button, and returns focus to its trigger.
 */
export function Slip({ trigger, title, children }: SlipProps) {
  const titleId = useId();

  return (
    <Popover.Root modal>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-labelledby={titleId}
          sideOffset={8}
          collisionPadding={16}
          className="slip relative z-50 w-[min(24rem,calc(100vw-2rem))] rounded-slip bg-surface p-5 pr-14 text-ink shadow-slip ring-1 ring-rule"
        >
          <p id={titleId} className="font-display text-lead leading-snug">
            {title}
          </p>
          <div className="mt-2 space-y-3 text-small">{children}</div>
          <Popover.Close className="absolute top-2 right-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-chip text-ink-muted transition-colors duration-200 hover:bg-accent-soft hover:text-ink">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" className="size-4">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="sr-only">Close</span>
          </Popover.Close>
          <Popover.Arrow className="fill-surface" width={14} height={7} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
