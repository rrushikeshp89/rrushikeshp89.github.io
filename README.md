# Rushikesh Panchal — portfolio

Live at **https://rrushikeshp89.github.io**

Personal portfolio of Rushikesh Panchal, Software Developer (Bengaluru). It is a static Next.js site and is built to be evidence of the work it describes: strict TypeScript, content validated with Zod, WCAG 2.2 AA checked with axe, and end-to-end tests.

> Status: Phases 1–6 are done: home page, receipts, the Grove role switch, three case studies, SEO and share images. Phase 7 (verify and ship) still needs the domain and the résumé PDF. See `DECISIONS.md` for the plan, the architecture decisions and the open items.

## Run it

Requires Node 22 or later (24 LTS recommended, see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev            # http://localhost:3000 (development)
pnpm build          # static export to out/
pnpm start          # serves out/ like GitHub Pages at http://localhost:3000
```

## Check it

```bash
pnpm typecheck      # next typegen + tsc (strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes)
pnpm lint           # ESLint: next, jsx-a11y strict, no any / non-null assertions
pnpm test           # Vitest unit tests
pnpm build          # production build; fails if src/content/facts.ts is invalid
pnpm test:e2e       # Playwright + axe against out/, served like GitHub Pages (run pnpm build first)
pnpm check:bundle   # gzipped JS per route; fails if / exceeds 150 kB
pnpm lhci           # Lighthouse (mobile, median of 5) on / and a case study; fails below the targets
pnpm test:ship      # release gate: fails while any TODO(confirm) remains in facts.ts
```

CI (`.github/workflows/ci.yml`) runs the same steps on every push. A push to `main` that passes all of them is published to GitHub Pages.

## Hosting notes

GitHub Pages serves files only, so the Content-Security-Policy ships as a `<meta>` tag and `/resume/` forwards with a meta refresh. Anti-framing headers (`frame-ancestors`, `X-Frame-Options`) cannot be set on this host. See `DECISIONS.md`, ADR-029.

## Where things live

- `src/content/facts.ts`: every fact, number and link the site shows, validated by `schema.ts`.
- `src/styles/tokens.css`: the light and dark design tokens.
- `tools/flow-lines`: the Python (fluidsim) generator for the decorative hero streamlines. It runs offline, and only its SVG output ships.
- `tests/unit`, `tests/e2e`: unit tests, and the Playwright specs with the axe matrix in `tests/e2e/routes.ts`.
