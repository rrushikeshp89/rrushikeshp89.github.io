# Rushikesh Panchal — portfolio

Personal portfolio of Rushikesh Panchal, Software Developer (Bengaluru). It is a static Next.js site and is built to be evidence of the work it describes: strict TypeScript, content validated with Zod, WCAG 2.2 AA checked with axe, and end-to-end tests.

> Status: Phase 1 (foundation). The pages are placeholders. See `DECISIONS.md` for the plan, the architecture decisions and the open items.

## Run it

Requires Node 22 or later (24 LTS recommended, see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## Check it

```bash
pnpm typecheck      # next typegen + tsc (strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes)
pnpm lint           # ESLint: next, jsx-a11y strict, no any / non-null assertions
pnpm test           # Vitest unit tests
pnpm build          # production build; fails if src/content/facts.ts is invalid
pnpm test:e2e       # Playwright + axe against the production build (run pnpm build first)
pnpm test:ship      # release gate: fails while any TODO(confirm) remains in facts.ts
```

CI (`.github/workflows/ci.yml`) runs the same steps on every push.

## Where things live

- `src/content/facts.ts`: every fact, number and link the site shows, validated by `schema.ts`.
- `src/styles/tokens.css`: the light and dark design tokens.
- `tests/unit`, `tests/e2e`: unit tests, and the Playwright specs with the axe matrix in `tests/e2e/routes.ts`.
