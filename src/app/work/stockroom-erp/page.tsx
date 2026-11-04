import { CaseStudyPage, caseStudyMetadata } from "@/components/case-study/CaseStudyPage";

const SLUG = "stockroom-erp";

export const metadata = caseStudyMetadata(SLUG);

export default function Page() {
  return <CaseStudyPage slug={SLUG} />;
}
