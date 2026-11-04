import { getProject } from "@/content/queries";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

const project = getProject("leadhub-crm");

export const alt = `${project.name} case study: ${project.pitch}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({ title: `${project.name} case study`, subtitle: project.pitch });
}
