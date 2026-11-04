import { EmailOptions } from "@/components/contact/EmailOptions";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { LINK_STYLE } from "@/components/ui/TextLink";
import { facts } from "@/content/facts";
import { TODO_CONFIRM } from "@/content/schema";

export function Contact() {
  const { email, linkedin, github, resume } = facts.identity;

  return (
    <Section id="contact" title="Contact">
      <p className="max-w-[22ch] font-display text-h2">Email is the quickest way to reach me.</p>
      <p className="mt-6">
        <EmailOptions
          email={email}
          className={`${LINK_STYLE} inline-flex min-h-11 items-center text-lead break-all`}
        >
          {email}
        </EmailOptions>
      </p>
      <ul className="mt-10 flex flex-wrap gap-3">
        <li>
          <ButtonLink href={linkedin} variant="quiet">
            LinkedIn
          </ButtonLink>
        </li>
        <li>
          <ButtonLink href={github} variant="quiet">
            GitHub
          </ButtonLink>
        </li>
        {resume !== TODO_CONFIRM ? (
          <li>
            <ButtonLink href={resume} variant="quiet">
              Download résumé (PDF)
            </ButtonLink>
          </li>
        ) : null}
      </ul>
    </Section>
  );
}
