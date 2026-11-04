import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { SkipLink } from "@/components/ui/SkipLink";
import { facts } from "@/content/facts";
import { CONTENT_SECURITY_POLICY } from "@/lib/csp";
import { ogImageMetadata } from "@/lib/og-image";
import { siteUrl } from "@/lib/site";
import { display, displayItalic, mono, text } from "./fonts";
import "./globals.css";

const { name, role, headline } = facts.identity;

const siteTitle = `${name}, ${role}`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: siteTitle, template: `%s | ${name}` },
  description: headline,
  authors: [{ name, url: facts.identity.github }],
  openGraph: {
    type: "website",
    siteName: name,
    title: siteTitle,
    description: headline,
    locale: "en_IN",
    images: ogImageMetadata("/og.png", `${name}: ${headline}`),
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: headline,
    images: ["/og.png"],
  },
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
        <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
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
