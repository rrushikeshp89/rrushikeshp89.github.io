import { getProject } from "@/content/queries";
import { renderOgImage } from "@/lib/og-image";

/** Written to out/work/grove-hrms/og.png at build, so GitHub Pages serves it as image/png. */
export const dynamic = "force-static";

export function GET() {
  const project = getProject("grove-hrms");
  return renderOgImage({ title: `${project.name} case study`, subtitle: project.pitch });
}
