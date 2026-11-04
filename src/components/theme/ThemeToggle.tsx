"use client";

import { useEffect } from "react";
import { applyTheme, getEffectiveTheme, syncThemeColor } from "@/lib/theme";

/**
 * Light/dark switch. Its label and icon are chosen by CSS ([data-theme-only]), so the markup is
 * identical on server and client: no hydration mismatch and no flash of the wrong label.
 */
export function ThemeToggle() {
  useEffect(syncThemeColor, []);

  function toggleTheme() {
    applyTheme(getEffectiveTheme() === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-chip text-ink transition-colors duration-200 hover:bg-accent-soft"
    >
      <span data-theme-only="light">
        <MoonIcon />
        <span className="sr-only">Switch to dark theme</span>
      </span>
      <span data-theme-only="dark">
        <SunIcon />
        <span className="sr-only">Switch to light theme</span>
      </span>
    </button>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none">
      <path
        d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
