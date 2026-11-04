import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { isExternalHref } from "@/lib/links";

type ButtonVariant = "primary" | "quiet";

const BASE =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-chip px-5 font-medium transition-colors duration-200";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent/88 active:bg-accent/80",
  quiet: "border border-ink/70 text-ink hover:bg-accent-soft active:bg-accent-soft/70",
};

export function buttonClassName(variant: ButtonVariant = "primary", extra = ""): string {
  return [BASE, VARIANTS[variant], extra].filter(Boolean).join(" ");
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
}

/** A link styled as a button. Navigation stays a link, so it keeps link semantics. */
export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={buttonClassName(variant, className)}
      {...(isExternalHref(href) ? { rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return <button type={type} className={buttonClassName(variant, className)} {...rest} />;
}
