import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <section
        aria-labelledby="not-found-title"
        className="mx-auto max-w-page px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
      >
        <h1 id="not-found-title" className="max-w-[18ch] font-display text-display">
          There is no page at this address.
        </h1>
        <p className="mt-6 max-w-measure text-lead">
          The link may be mistyped or out of date. The work and the contact details are on the home
          page.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Go to the home page</ButtonLink>
          <ButtonLink href="/#work" variant="quiet">
            See the selected work
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
