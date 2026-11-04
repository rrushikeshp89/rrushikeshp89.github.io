import Link from "next/link";
import type { ReactNode } from "react";
import { isExternalHref } from "@/lib/links";

interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export const LINK_STYLE =
  "text-accent underline decoration-accent/50 decoration-1 underline-offset-[0.2em] transition-[text-decoration-color,text-decoration-thickness] duration-200 hover:decoration-accent hover:decoration-2";

/** Inline link. Internal routes use next/link; external ones get rel="noopener noreferrer". */
export function TextLink({ href, children, className = "" }: TextLinkProps) {
  const classes = `${LINK_STYLE} ${className}`.trim();

  if (isExternalHref(href)) {
    return (
      <a href={href} rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
