"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface EmailOptionsProps {
  email: string;
  /** The visible trigger content, e.g. "Email me" or the address itself. */
  children: ReactNode;
  className?: string;
}

type CopyState = "idle" | "copied" | "failed";

/** Native light dismiss where supported; Esc and the Close button work everywhere. */
const LIGHT_DISMISS = { closedby: "any" } as Record<string, string>;

const ACTION =
  "flex min-h-11 w-full cursor-pointer items-center rounded-chip px-3 text-left transition-colors duration-200 hover:bg-accent-soft";

/**
 * "Email me" that works without a configured mail app. A mailto: link opens the visitor's mail
 * app, which does nothing visible when none is set up (common with webmail). So the link stays a
 * real mailto: (it still works without JavaScript), and with JavaScript a click opens a slip
 * that offers: copy the address, write in Gmail, write in Outlook.com, or open the mail app.
 */
export function EmailOptions({ email, children, className = "" }: EmailOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const anchorName = `--email-${titleId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const mailto = `mailto:${email}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  const outlook = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) dialog.showModal();
  }, [isOpen]);

  function open(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setCopyState("idle");
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <>
      <a
        ref={triggerRef}
        href={mailto}
        aria-haspopup="dialog"
        data-slip-anchor=""
        onClick={open}
        className={className}
        style={{ "--receipt-anchor": anchorName } as CSSProperties}
      >
        {children}
      </a>
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
              <div className="p-4 pr-14">
                <p id={titleId} className="px-3 pt-1 font-display text-lead leading-snug">
                  Email {email}
                </p>
                <ul className="mt-3 space-y-1 text-small">
                  <li>
                    <button type="button" onClick={copyAddress} className={ACTION}>
                      Copy email address
                    </button>
                  </li>
                  <li>
                    <a href={gmail} target="_blank" rel="noopener noreferrer" className={ACTION}>
                      Write in Gmail
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                  <li>
                    <a href={outlook} target="_blank" rel="noopener noreferrer" className={ACTION}>
                      Write in Outlook.com
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                  <li>
                    <a href={mailto} className={ACTION}>
                      Open my mail app
                    </a>
                  </li>
                </ul>
                <p role="status" className="mt-2 min-h-5 px-3 text-small text-ink-muted">
                  {copyState === "copied" ? `Copied ${email}` : null}
                  {copyState === "failed" ? `Copy is blocked here. The address is ${email}` : null}
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
