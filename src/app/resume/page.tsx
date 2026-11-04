import type { Metadata } from "next";
import { TextLink } from "@/components/ui/TextLink";
import { facts } from "@/content/facts";
import { TODO_CONFIRM } from "@/content/schema";

const { resume, linkedin } = facts.identity;
const hasPdf = resume !== TODO_CONFIRM;
const destination = hasPdf ? resume : linkedin;

export const metadata: Metadata = {
  title: "Résumé",
  robots: { index: false },
};

/**
 * GitHub Pages has no server-side redirects, so /resume forwards with a meta refresh and offers
 * the same destination as a link: the PDF once it exists, LinkedIn until then (ADR-008, ADR-029).
 */
export default function ResumePage() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <meta httpEquiv="refresh" content={`0; url=${destination}`} />
      <section
        aria-labelledby="resume-title"
        className="mx-auto max-w-page px-4 py-24 sm:px-6 lg:px-8"
      >
        <h1 id="resume-title" className="font-display text-h2">
          Opening the résumé
        </h1>
        <p className="mt-6 max-w-measure text-lead">
          {hasPdf ? (
            <TextLink href={destination}>Open the résumé (PDF)</TextLink>
          ) : (
            <>
              The PDF is not published yet. My experience is on{" "}
              <TextLink href={destination}>my LinkedIn profile</TextLink>.
            </>
          )}
        </p>
      </section>
    </main>
  );
}
