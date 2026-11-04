import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { SkipLink } from "@/components/ui/SkipLink";
import { facts } from "@/content/facts";
import { siteUrl } from "@/lib/site";
import { display, displayItalic, mono, text } from "./fonts";
import "./globals.css";

const { name, role, headline } = facts.identity;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: `${name}, ${role}`, template: `%s | ${name}` },
  description: headline,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f0" },
    { media: "(prefers-color-scheme: dark)", color: "#131a17" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${displayItalic.variable} ${text.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
