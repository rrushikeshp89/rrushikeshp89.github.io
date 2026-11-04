import { IBM_Plex_Mono, Newsreader } from "next/font/google";
import localFont from "next/font/local";

/*
  Headings use a single weight (500). Static cuts are used instead of the variable font with the
  optical-size axis: that pair weighed 279 kB and slowed first render on mobile (DECISIONS.md, ADR-017).
*/
export const display = Newsreader({
  subsets: ["latin"],
  weight: "500",
  style: "normal",
  display: "swap",
  variable: "--font-newsreader",
});

/** Italic is only used for section titles below the fold, so it is not preloaded. */
export const displayItalic = Newsreader({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
  display: "swap",
  preload: false,
  variable: "--font-newsreader-italic",
});

/*
  Static 400 and 500 cuts (the only weights used) from @fontsource, not Google's variable font:
  Chromium on Linux mis-spaces some glyphs of the variable font in printed PDFs ("Dat abases"),
  which showed in the CI-built résumé. Google serves the variable file even when weights are named.
*/
export const text = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-plex-sans",
  fallback: ["system-ui", "sans-serif"],
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});
