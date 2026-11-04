import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";

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

export const text = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-sans",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});
