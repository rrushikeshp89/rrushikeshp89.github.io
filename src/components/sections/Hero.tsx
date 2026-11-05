import { Receipt } from "@/components/receipts/Receipt";
import { EmailOptions } from "@/components/contact/EmailOptions";
import { ButtonLink, buttonClassName } from "@/components/ui/Button";
import { facts } from "@/content/facts";
import { getMetric } from "@/content/queries";
import { keepHyphensTogether } from "@/lib/format";

export function Hero() {
  const { headline, headlineEmphasis, subline, availability, email } = facts.identity;
  const [before = "", after = ""] = headline.split(headlineEmphasis);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate mx-auto grid max-w-page grid-cols-12 gap-x-6 px-4 pt-14 pb-16 sm:px-6 lg:px-8 lg:pt-24 lg:pb-24"
    >
      <div aria-hidden="true" className="flow-lines" />
      {/*
        From 1280 px the headline takes the full width at 68 px and breaks before the emphasis,
        so it reads as two lines: the plain clause, then the accent phrase. The first line needs
        about 1,068 px at that size and the column is 1,088 px. Narrower screens wrap naturally.
      */}
      <h1
        id="hero-title"
        className="col-span-12 font-display text-display lg:col-span-10 xl:col-span-12 xl:text-[4.25rem]"
      >
        {keepHyphensTogether(before.trimEnd())} <br className="hidden xl:inline" />
        <em className="font-display-italic text-accent italic">
          {keepHyphensTogether(headlineEmphasis)}
        </em>
        {keepHyphensTogether(after)}
      </h1>
      <p className="col-span-12 mt-6 max-w-[46ch] text-lead lg:col-span-7">{subline}</p>
      <p className="col-span-12 mt-3 text-ink-muted">{availability}</p>
      <div className="col-span-12 mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="#work" className="min-h-12 sm:min-h-11">
          See the work
        </ButtonLink>
        <EmailOptions email={email} className={buttonClassName("quiet", "min-h-12 sm:min-h-11")}>
          Email me
        </EmailOptions>
      </div>
      <p className="col-span-12 mt-14 max-w-[60ch] border-t border-rule pt-6 text-ink lg:col-span-8 lg:col-start-5">
        Recent work: Grove HRMS, a <Receipt inline metric={getMetric("grove-tables")} />
        -table system with <Receipt inline metric={getMetric("grove-permissions")} /> scoped
        permissions and <Receipt inline metric={getMetric("grove-tests")} /> tests, and Stockroom,
        where a UX audit cut layout shift <Receipt inline metric={getMetric("stockroom-cls")} />.
      </p>
    </section>
  );
}
