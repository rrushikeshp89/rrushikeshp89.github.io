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
- **ADR-011 Theme toggle state lives in the DOM, not React.** The toggle renders both labels and icons, and CSS (`[data-theme-only]`) shows the one that matches the effective theme. Server HTML and the first client render are therefore identical: no hydration mismatch and no label flicker. The hidden label is `display: none`, so it is also dropped from the accessible name. Clicking reads the effective theme, stores the opposite, and syncs `<meta name="theme-color">`. This fixes the low finding from the Phase 1 review.
- **ADR-012 Slips are modal Radix popovers.** The brief asks popovers to trap and restore focus, so `Popover.Root` is `modal`: focus is trapped while open, Esc and the close button return focus to the trigger, and the rest of the page is hidden from assistive tech until it closes. Every slip has a visible title wired up through `aria-labelledby`.
- **ADR-013 Header is sticky from 768 px up, not on phones.** On a phone the header needs two rows (name and toggle, then the four anchors). Kept sticky, it would cover about an eighth of a 375 × 812 screen. It scrolls away instead; the hero CTAs and the Contact section repeat every action it holds. mobile-design's thumb-zone guidance put the primary CTAs full width and 48 px tall on phones.
- **ADR-014 Lighthouse runs through its Node API in Playwright's Chromium.** `@lhci/cli` uses chrome-launcher, which failed on this Windows machine with `spawn UNKNOWN`, with or without the sandbox. `scripts/lighthouse.mjs` starts `next start`, takes the median of 5 mobile runs per route, writes HTML reports to `.lighthouseci/`, and fails below Performance 95, Accessibility 100, Best Practices 95, SEO 100, or above LCP 2.0 s or CLS 0.02. Total Blocking Time is reported but not gated: it measures React and Next.js hydration on a 4×-throttled CPU, it is already weighted inside the performance score, and INP (the brief's target) can only be measured in the field.
- **ADR-015 JS budget counts what modern browsers download.** `scripts/check-bundle.mjs` sums gzipped `<script>` files referenced by the built HTML and skips `noModule` polyfills (38.7 kB of core-js that only browsers without ES modules fetch). The budget applies to `/`; `/design` is reported for information.
- **ADR-016 Facts drive optional UI.** The résumé link (header and Contact) and the "What this doesn't do yet" line render only once their facts are confirmed, so no unconfirmed fact or empty link ever reaches the page. An e2e test asserts that no `TODO(confirm)` text, `tel:` link or phone-number pattern is in the HTML, and that every number on the page appears in `facts.ts`.
- **ADR-017 Static font cuts, not the optical-size variable font.** Newsreader with its `opsz` axis came as two variable files of 132 kB (upright) and 147 kB (italic), both preloaded. On a throttled mobile run they competed with the JS, and Performance dropped as low as 88. Headings use one weight (500), so the site now loads static Newsreader 500 upright (24 kB, preloaded) and italic (not preloaded: it is only used for section titles below the fold), plus Plex Sans variable (40 kB) and Plex Mono 400/500 (10 kB each). The home page now references 84 kB of fonts instead of about 330 kB. Trade-off: no optical-size adjustment at display sizes.
- **ADR-018 Hero flow lines: static art from a real simulation, approved by the owner.** `tools/flow-lines/generate.py` runs fluidsim's 2D Navier-Stokes solver (128², ν = 1e-3, seeded noise decaying to t = 12) and traces evenly spaced streamlines through the final velocity field into `public/flow-lines.svg` (82 lines, 24.4 kB, 4.4 kB gzipped). The site uses it as a CSS `mask-image` over `--secondary` at 14% (light) and 20% (dark) opacity, fading at both edges. Checked against the brief's gate for optional effects:
  - **Off the critical path:** the image is a CSS mask, so it is never preloaded, never blocks render, and is not an LCP candidate. Added JavaScript: 0 kB.
  - **Off where it would cost or distract:** `display: none` below 768 px (no request is made, which an e2e test checks) and under `prefers-reduced-motion: reduce`. The art is static, but the brief's rule is applied literally. CSS has no reliable low-power signal (`prefers-reduced-data` is unsupported in Chrome), so the small-screen rule stands in for it.
  - **Complete without it:** with the art off, the page is exactly the Phase 3 page.
  - **Decorative only:** `aria-hidden="true"` and empty. Text contrast still passes axe in both themes.
  - **Gates:** Lighthouse mobile is unchanged, because its 412 px viewport never loads the art. On desktop, with the SVG allowed vs blocked: Performance 100 vs 100, LCP 255 ms vs 256 ms, TBT 0 vs 0, CLS 0.000 vs 0.000, and 5.3 kB transferred.
  - **Regenerate** (any Python 3.12+): `python -m venv .venv`, `pip install -r tools/flow-lines/requirements.txt`, `python tools/flow-lines/generate.py`.
- **ADR-019 Scroll stroke from Skiper UI (skiper19), rebuilt without framer-motion, at the owner's request.**
  - **What it is:** Skiper's component is an SVG path whose drawn length follows scroll progress, driven by framer-motion (`useScroll`, `useTransform`, `motion.path`). Installing it through `shadcn add` would have run `shadcn init`, which rewrites `globals.css` and adds config. It would also have added roughly 30–45 kB of gzipped JavaScript to a home route at 135.9 kB, over the 150 kB budget.
  - **What was done instead:** the site uses Skiper's exact path with a CSS scroll-driven animation (`view-timeline` on `#work`, `animation-range: contain`), which adds 0 kB of JavaScript. Browsers without scroll timelines, and visitors who reduce motion, see it fully drawn.
  - **Placement:** the first attempt, behind the hero, read as a knot, and most of it drew while the hero was already scrolling off screen. It now sits in the sticky margin of Selected work and draws from 0% to 100% as the reader moves through the three projects, so it works as a reading-progress mark. It never passes behind text, and its `--stroke-highlight` colour is still contrast-tested against `ink` and `ink-muted`. It is hidden below the `lg` breakpoint, where there is no margin column.
  - **Licence:** the free licence requires attribution, so the footer credits Skiper UI (stored in `facts.site.credits`) and the component carries a source comment. Skiper's own credit to comgio.ai is kept in that comment.
  - **Side fix:** the margin block (title, note, aside) is now sticky as a unit. Before, only the title was sticky, and on long sections it slid over its own note.
  - **Measured:** JS on `/` is still 135.9 kB. Lighthouse mobile scored 89, 96 and 98 across three local runs (the 89 is machine noise: phones never render the stroke and the JavaScript is unchanged). Desktop scored Performance 100, LCP 267 ms, CLS 0.000, TBT 47 ms. 73 e2e tests pass, including drawing progress, reduced motion, phone hiding and the credit link.

## Skills log

| Phase | Skill                  | What it changed                                                                                                                                                                                                                                                                                               |
| ----- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plan  | ux-researcher-designer | Two hypothesis personas. Added a header résumé link and a hero availability line                                                                                                                                                                                                                              |
| Plan  | senior-architect       | ADR list above, kept proportionate to a static site                                                                                                                                                                                                                                                           |
| Plan  | ui-ux-pro-max          | Its generated system ("Vibrant & Block-based", hover-overlay CTAs, mono headings) was **rejected**: it conflicts with the calm brief and with "no meaning on hover". Kept: its contrast, touch and reduced-motion checklist, and Newsreader from its editorial typography search                              |
| Plan  | frontend-design        | Flagged cream, serif and terracotta as the commonest generated look. The paper moved to a faint sage-grey, the accent stays green, and terracotta is out. Also avoided: all-caps eyebrows, single-word headline accents, `→` on links, decorative 01/02 numbering, middle-dot meta strings                    |
| 1     | senior-fullstack       | Security headers, CI pipeline, scripts                                                                                                                                                                                                                                                                        |
| 1     | clean-code             | Removed a test that always passed and the redundant `vite-tsconfig-paths` plugin (Vite resolves tsconfig paths natively). Function and size rules apply from here on                                                                                                                                          |
| 1     | code-reviewer          | End-of-phase diff review (see below)                                                                                                                                                                                                                                                                          |
| 1     | git-commit-helper      | Conventional commit message                                                                                                                                                                                                                                                                                   |
| 2     | theme-factory          | Its ten preset themes were reviewed and none fits the brief: Forest Canopy and Botanical Garden come closest but ship different fonts and a non-editorial mood. So the skill's "create your own theme" path was used, keeping the Phase 1 palette and adding an `on-accent` token for text on primary buttons |
| 2     | ui-ux-pro-max          | Pre-delivery checklist applied: 44 px targets, `cursor-pointer`, 150–300 ms colour transitions with no layout-shifting hover scale, SVG icons rather than emoji, both themes checked at 375 and 1280 px                                                                                                       |
| 2     | frontend-design        | Spent the boldness in one place, the marginalia section layout (italic Newsreader titles in the left margin). Cards are not one identical rounded kit: featured cards are raised, plain ones sit on a hairline. Shadows appear only on slips. No `→`/`↗` glyphs on links                                      |
| 2     | senior-frontend        | Primitives are small, typed and composable (`ButtonLink` keeps link semantics; `ChipList` is a real list); a single `isExternalHref` rule sets `rel`                                                                                                                                                          |
| 2     | react-best-practices   | Server Components by default; the only client leaves are `ThemeToggle` and `Slip`. Hydration mismatches are avoided without effects (ADR-011); direct imports, no barrels                                                                                                                                     |
| 2     | code-reviewer          | End-of-phase diff review                                                                                                                                                                                                                                                                                      |
| 3     | mobile-design          | 44 px minimum targets (asserted by an e2e test), 48 px full-width hero CTAs on phones, 8 px+ gaps between targets, the phone header decision (ADR-013). Its native-app parts (React Native lists, platform nav) do not apply to a static site                                                                 |
| 3     | senior-frontend        | Sections compose the Phase 2 primitives; content is read through `content/queries.ts` (`getProject`, `getMetric`), so a renamed metric fails the build instead of rendering blank                                                                                                                             |
| 3     | ux-researcher-designer | Heuristic review of the built page against both personas (below)                                                                                                                                                                                                                                              |
| 3     | frontend-design        | Screenshot critique pass: the Grove numerals moved from 4 columns, which overflowed at 1280 px, to a 2 × 2 grid; the headline keeps "full-stack" on one line (non-breaking hyphen); the write-path flow got row spacing; straight apostrophes became typographic ones                                         |
| 3     | code-reviewer          | End-of-phase diff review                                                                                                                                                                                                                                                                                      |

## UX review of the home page (Phase 3)

- **Recruiter, 30 s.** Above the fold at 1280 × 800: role (h1), stack (sub-line), location and intent ("open to Software Developer roles"), Email me. At 375 × 812, the same plus both CTAs within thumb reach. Gap: no résumé link until the PDF exists (open item 4).
- **Engineering manager.** Each project has source and live links whose names make sense out of context, the stack as plain text, and the strongest three bullets. The receipts (Phase 4), case studies (Phase 5) and limitations (Phase 5) are still to come, and they are what this persona needs most.
- **Order check.** Work comes before Experience, and the 15% Zetpeak result sits in the Experience margin so it is the first thing seen there. The copy "every project states what it does not do yet" becomes true only when Phase 5 fills the limitations; the ship gate fails until then.

## Measurements

| Phase | Route | Lighthouse mobile (P / A / BP / SEO)                   | LCP         | CLS   | TBT       | JS gzipped |
| ----- | ----- | ------------------------------------------------------ | ----------- | ----- | --------- | ---------- |
| 3     | `/`   | 95–99 / 100 / 100 / 100 (median of 3, four local runs) | 0.92–0.95 s | 0.000 | 96–265 ms | 135.9 kB   |

## Design tokens (contrast asserted by `tests/unit/tokens.test.ts`)

Light: paper `#f5f6f0`, surface `#fbfcf8`, ink `#1b2621`, ink-muted `#55615a`, rule `#d3d9cf`, accent `#1f5c45`, accent-soft `#dcede3`, secondary `#34506e`, on-accent `#f5f6f0`, success `#2f6b3a`, warn `#8a5a00`.

Dark (tuned separately): paper `#131a17`, surface `#1b2420`, ink `#e7eadf`, ink-muted `#a7b1a8`, rule `#2f3b35`, accent `#82cca8`, accent-soft `#1e3a2e`, secondary `#9db7d6`, on-accent `#131a17`, success `#8fd19a`, warn `#e0b45c`.

Type: Newsreader 500 (display; static upright and italic cuts, see ADR-017), IBM Plex Sans (text, variable), IBM Plex Mono 400/500 (metrics and receipts only). All are self-hosted through `next/font/google` with `display: swap`.

Type scale (fluid, `clamp()`): small 15 px; body 16 → 18 px; lead 19 → 23 px; h3 22 → 28 px; h2 28 → 42 px; display 38 → 76 px; numeral 40 → 68 px. Radii: 2 px (chips, buttons), 6 px (slips, featured cards). Spacing uses Tailwind's 4 px grid in even steps (8-point rhythm). The page container is 72 rem and text measure is 68ch.
