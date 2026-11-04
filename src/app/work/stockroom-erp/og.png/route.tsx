import { getProject } from "@/content/queries";
import { renderOgImage } from "@/lib/og-image";

/** Written to out/work/stockroom-erp/og.png at build, so GitHub Pages serves it as image/png. */
export const dynamic = "force-static";

export function GET() {
  const project = getProject("stockroom-erp");
  return renderOgImage({ title: `${project.name} case study`, subtitle: project.pitch });
}
