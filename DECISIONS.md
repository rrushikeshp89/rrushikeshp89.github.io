# Decisions

Assumptions, architecture decisions, skills used, and open items for the portfolio. Newest entries are added at the end of each section.

## Open items

| #   | Item                                             | Status                | Where it lives                                                                                                               |
| --- | ------------------------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1   | Production domain                                | `TODO(confirm)`       | `facts.site.url`. Until it's set, `src/lib/site.ts` falls back to `http://localhost:3000` for canonical, OG and sitemap URLs |
| 2   | Honest limitations for Grove, LeadHub, Stockroom | `TODO(confirm)`       | `facts.projects[].limitations`. To be taken from the repo READMEs in Phase 5                                                 |
| 3   | Receipt proof links point at repo roots          | Open                  | Phase 4 swaps them for verified paths (Prisma schema, test folders, CI runs) after reading each repo                         |
| 4   | Résumé PDF                                       | Needed before Phase 6 | Requested version: no phone number, rrushikeshp8 email. Without one, `/resume` points to LinkedIn                            |
| 5   | Availability date for the hero                   | Not asked yet         | The hero says "open to Software Developer roles" with no date unless one is confirmed                                        |

### Resolved (owner answers, 2026-11-04)

- Email: **rrushikeshp8@gmail.com**, the GitHub address (the résumé has rrushikeshp7).
- Grove test count: **"130+"**, the résumé figure (the README says 789).
- LeadHub database: **"SQLite via Turso (libSQL)"**. The optional Claude assistant is not mentioned.
- Phone number: **not published**. It is kept out of `facts.ts`, and a unit test checks this.
- Live demos on fluentopsai.com subdomains: **kept**.
- Headshot: **none**. The hero is typographic.

## Reader personas (ux-researcher-designer)

These are hypotheses. The skill's persona script needs interview data, and there is none.

1. **Technical recruiter, 30-second skim.** Screens many fresher profiles against a job description. Wants to know the role, matching stack keywords, location and availability, whether the work is real, and how to make contact or get the résumé.
   → Needs: role and stack in the hero, location, a résumé link in the header, an email CTA, and keywords as plain text.
2. **Engineering manager, 3–5 minute depth check.** Deciding whether to interview. Wants to know whether the code is real and runnable, whether the numbers are backed, how auth, data integrity and testing are handled, and whether he knows his limits.
   → Needs: source and live links, receipts with proof, case studies, and honest limitations.

Heuristic review of the section order: Work comes before Experience, which is right for a fresher because the projects are the strongest evidence. Two additions: **Résumé** in the header, and a hero line "Based in Bengaluru, open to Software Developer roles".

## Architecture decisions (senior-architect)

- **ADR-001 Static Next.js App Router on Vercel.** Next.js 16.4.5, React 19.3, every route prerendered (`○ Static`). The scaffold's defaults are kept: `cacheComponents`, `partialPrefetching`, and Turbopack with `@tailwindcss/turbopack`. No database and no API.
- **ADR-002 Content is typed TS objects validated by Zod, not MDX.** `src/content/schema.ts` defines the model and `facts.ts` calls `factsSchema.parse()` at module load. This was verified: an invalid email in `facts.ts` makes `next build` exit 1 with a ZodError. Types come from `z.infer`, so content and types cannot drift.
- **ADR-003 Tailwind v4 over CSS-variable tokens.** `src/styles/tokens.css` holds both palettes, and `globals.css` maps them into `@theme inline` (`bg-paper`, `text-ink`, `text-accent`, and so on).
- **ADR-004 Theme without flash.** A hand-written inline `<head>` script (`src/lib/theme-script.ts`) applies a stored `light`/`dark` choice before paint. With no stored choice, CSS follows `prefers-color-scheme`. next-themes is not used. Covered by `tests/e2e/theme.spec.ts`.
- **ADR-005 CSP: strict everywhere except inline scripts.** The first attempt, `script-src 'self' 'sha256-<theme script>'`, was tested and failed. A statically generated App Router page carries inline RSC payload scripts (`self.__next_f.push`). Next.js cannot nonce these on a static page, because there is no request at build time, and they cannot be hashed before the build. Playwright recorded 8 blocked scripts.
  - Decision: `script-src 'self' 'unsafe-inline'`. External chunks are still pinned with SRI (`experimental.sri`, sha256).
  - Everything else stays strict: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`, plus nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, HSTS and COOP.
  - Why the risk is acceptable: there are no third-party scripts, no user-generated content and no forms.
  - The alternative was a nonce CSP, which would make every page dynamic. That was rejected for performance.
  - `style-src` allows `'unsafe-inline'` because Radix positions popovers with inline styles.
- **ADR-006 Client islands only.** ThemeToggle, Receipt (Radix Popover), RoleSwitch (Radix ToggleGroup) and CountUp are the only `"use client"` components. Everything else is a Server Component.
- **ADR-007 Contact by `mailto:` plus LinkedIn and GitHub.** There is no form and no Server Action, so there are no secrets, no spam surface and nothing to rate-limit.
- **ADR-008 Résumé.** A static PDF in `public/`, with a `/resume` redirect in `next.config.ts`. Phase 6.
- **ADR-009 Testing.**
  - Vitest with jsdom and Testing Library for unit tests.
  - Playwright with `@axe-core/playwright` against `next start` on port 4310. Ports 3023–3222 fall inside a Windows-reserved range on the dev machine.
  - The axe matrix covers every route in light and dark at 1280 px and 375 px, using the WCAG 2.0/2.1/2.2 A and AA tags plus best-practice.
  - Lighthouse CI is added in Phase 3.
- **ADR-010 No analytics; Node 24 LTS.** `.nvmrc` pins 24 for CI and Vercel, and `engines` requires Node 22 or later. Local development ran on Node 25.6.1.

## Skills log

| Phase | Skill                  | What it changed                                                                                                                                                                                                                                                                            |
| ----- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Plan  | ux-researcher-designer | Two hypothesis personas. Added a header résumé link and a hero availability line                                                                                                                                                                                                           |
| Plan  | senior-architect       | ADR list above, kept proportionate to a static site                                                                                                                                                                                                                                        |
| Plan  | ui-ux-pro-max          | Its generated system ("Vibrant & Block-based", hover-overlay CTAs, mono headings) was **rejected**: it conflicts with the calm brief and with "no meaning on hover". Kept: its contrast, touch and reduced-motion checklist, and Newsreader from its editorial typography search           |
| Plan  | frontend-design        | Flagged cream, serif and terracotta as the commonest generated look. The paper moved to a faint sage-grey, the accent stays green, and terracotta is out. Also avoided: all-caps eyebrows, single-word headline accents, `→` on links, decorative 01/02 numbering, middle-dot meta strings |
| 1     | senior-fullstack       | Security headers, CI pipeline, scripts                                                                                                                                                                                                                                                     |
| 1     | clean-code             | Removed a test that always passed and the redundant `vite-tsconfig-paths` plugin (Vite resolves tsconfig paths natively). Function and size rules apply from here on                                                                                                                       |
| 1     | code-reviewer          | End-of-phase diff review (see below)                                                                                                                                                                                                                                                       |
| 1     | git-commit-helper      | Conventional commit message                                                                                                                                                                                                                                                                |

## Design tokens (Phase 1 values; contrast is asserted in Phase 2)

Light: paper `#f5f6f0`, surface `#fbfcf8`, ink `#1b2621`, ink-muted `#55615a`, rule `#d3d9cf`, accent `#1f5c45`, accent-soft `#dcede3`, secondary `#34506e`, success `#2f6b3a`, warn `#8a5a00`.

Dark (tuned separately): paper `#131a17`, surface `#1b2420`, ink `#e7eadf`, ink-muted `#a7b1a8`, rule `#2f3b35`, accent `#82cca8`, accent-soft `#1e3a2e`, secondary `#9db7d6`, success `#8fd19a`, warn `#e0b45c`.

Type: Newsreader (display, variable with an optical-size axis, normal and italic), IBM Plex Sans (text, variable), IBM Plex Mono 400/500 (metrics and receipts only). All are self-hosted through `next/font/google` with `display: swap`.
