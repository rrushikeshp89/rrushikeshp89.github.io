import { THEME_STORAGE_KEY } from "./theme-script";

export type Theme = "light" | "dark";

export function getEffectiveTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the choice then lasts for this page.
  }
  syncThemeColor();
}

/** Keeps the browser chrome colour (<meta name="theme-color">) in step with the page. */
export function syncThemeColor(): void {
  const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
  if (!paper) return;
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    meta.content = paper;
  }
}
