import { facts } from "@/content/facts";
import { renderOgImage } from "@/lib/og-image";

/** Written to out/og.png at build, so GitHub Pages serves it as image/png (ADR-029). */
export const dynamic = "force-static";

export function GET() {
  return renderOgImage({ title: facts.identity.headline, subtitle: facts.identity.subline });
}
