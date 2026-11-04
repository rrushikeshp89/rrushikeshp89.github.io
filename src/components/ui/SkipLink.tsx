"use client";

import type { MouseEvent } from "react";

/**
 * Next.js keeps up to three visited routes in the DOM, hidden with display: none, so after a
 * client-side navigation there can be several <main id="main">. "#main" would resolve to the
 * first, possibly hidden, one; this focuses the visible main instead. Without JavaScript there is
 * only ever one main, and the plain anchor works.
 */
function focusVisibleMain(event: MouseEvent<HTMLAnchorElement>) {
  const main = [...document.querySelectorAll<HTMLElement>("main")].find((candidate) =>
    candidate.checkVisibility(),
  );
  if (!main) return;
  event.preventDefault();
  main.focus();
  main.scrollIntoView();
  history.replaceState(null, "", "#main");
}

export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={focusVisibleMain}
      className="sr-only z-50 rounded-sm bg-surface px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4 print:hidden"
    >
      Skip to content
    </a>
  );
}
