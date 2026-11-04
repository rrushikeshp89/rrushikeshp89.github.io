import { facts } from "@/content/facts";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = `${facts.identity.name}: ${facts.identity.headline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({ title: facts.identity.headline, subtitle: facts.identity.subline });
}
