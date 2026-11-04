import { readFileSync } from "node:fs";
import { join } from "node:path";

type Palette = Record<string, string>;

const css = readFileSync(join(process.cwd(), "src/styles/tokens.css"), "utf8");

function blockAfter(selector: string): Palette {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Selector not found: ${selector}`);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  const entries = [...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(
    ([, name, hex]) => [name, hex] as const,
  );
  return Object.fromEntries(
    entries.filter((entry): entry is [string, string] => Boolean(entry[0] && entry[1])),
  );
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const [r = 0, g = 0, b = 0] = channels.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  );
  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
}

const light = blockAfter(":root {");
const darkByPreference = blockAfter(':root:not([data-theme="light"])');
const darkByChoice = blockAfter(':root[data-theme="dark"]');

/** [foreground, background, minimum ratio]. 4.5 = body text, 3 = large text and UI parts. */
const PAIRS: readonly [string, string, number][] = [
  ["ink", "paper", 4.5],
  ["ink", "surface", 4.5],
  ["ink", "accent-soft", 4.5],
  ["ink-muted", "paper", 4.5],
  ["ink-muted", "surface", 4.5],
  ["accent", "paper", 4.5],
  ["accent", "surface", 4.5],
  ["accent", "accent-soft", 4.5],
  ["on-accent", "accent", 4.5],
  ["secondary", "paper", 4.5],
  ["success", "paper", 4.5],
  ["success", "surface", 4.5],
  ["warn", "paper", 4.5],
  ["warn", "surface", 4.5],
  ["ink", "stroke-highlight", 4.5],
  ["ink-muted", "stroke-highlight", 4.5],
];

describe("design tokens", () => {
  it("defines the same tokens in light and dark", () => {
    expect(Object.keys(darkByChoice).sort()).toEqual(Object.keys(light).sort());
  });

  it("keeps the system-dark and chosen-dark palettes identical", () => {
    expect(darkByPreference).toEqual(darkByChoice);
  });

  describe.each([
    ["light", light],
    ["dark", darkByChoice],
  ] as const)("%s theme", (_name, palette) => {
    it.each(PAIRS)("%s on %s meets %s:1", (foreground, background, minimum) => {
      const fg = palette[foreground];
      const bg = palette[background];
      if (!fg || !bg) throw new Error(`Missing token ${foreground} or ${background}`);
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(minimum);
    });
  });
});
