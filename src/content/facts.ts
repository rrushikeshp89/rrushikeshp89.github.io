import { factsSchema, TODO_CONFIRM, type FactsInput } from "./schema";

/**
 * Single source of truth for everything the site says. Parsed at module load, so an invalid
 * entry fails `next build`. Unknown facts use TODO_CONFIRM; never fill a gap with a guess.
 */
const GITHUB = "https://github.com/rrushikeshp89";
const GROVE_REPO = `${GITHUB}/grove-hrms`;
const LEADHUB_REPO = `${GITHUB}/leadhub-crm`;
const STOCKROOM_REPO = `${GITHUB}/stockroom-erp`;

export const rawFacts = {
  site: {
    url: TODO_CONFIRM,
    source: `${GITHUB}/portfolio`,
  },
  identity: {
    name: "Rushikesh Panchal",
    role: "Software Developer",
    location: "Bengaluru, India",
    email: "rrushikeshp8@gmail.com",
    linkedin: "https://www.linkedin.com/in/rushikesh-panchal/",
    github: GITHUB,
    headline: "Software developer building reliable full-stack TypeScript systems.",
    subline:
      "Next.js, Node.js and PostgreSQL, with server-side access control, transactional data integrity and end-to-end tests.",
    availability: "Based in Bengaluru, open to Software Developer roles.",
    objective:
      "Software Developer and recent B.Tech CSE (Data Science) graduate building full-stack TypeScript applications with Next.js, React, Node.js, and PostgreSQL, featuring server-side access control, transactional data integrity, and end-to-end testing. Seeking a Software Developer role to design, test, and ship reliable, production-ready code.",
    resume: TODO_CONFIRM,
  },
  approach: {
    principles: [
      {
        title: "Show the why.",
        detail:
          "Scores and decisions come with their reasons: SHAP reasons for every readmission score, weighted factors in résumé matching.",
      },
      {
        title: "Enforce it on the server.",
        detail:
          "Permissions are checked where the data is written, so hiding a button is never the only safeguard.",
      },
      {
        title: "Prove it, then say what’s missing.",
        detail:
          "Claims ship with tests (unit, end-to-end, axe), and every project states what it does not do yet.",
      },
    ],
    writePath: {
      caption: "Every write in Grove HRMS takes this path.",
      steps: [
        "Interface",
        "Server action",
        "Permission check",
        "Zod validation",
        "Transaction",
        "Audit log",
        "PostgreSQL",
      ],
    },
  },
  projects: [
    {
      slug: "grove-hrms",
      name: "Grove HRMS",
      pitch:
        "A full-stack HR management system with server-side role-based access and a single audited, transactional write path.",
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Playwright"],
      bullets: [
        "Full-stack HRMS on Next.js 16 and Supabase Postgres with a 45-table Prisma schema (people, attendance, leave, payroll, recruitment) and a seeded 100-employee demo company.",
        "Server-side RBAC across 4 roles and 26 own/team/company-scoped permissions; every write goes through one Zod-validated, transactional, audit-logged action layer.",
        "Employee directory, permission-aware profiles, and an interactive org chart on a custom WCAG AA design system, covered by 130+ Vitest and Playwright/axe tests.",
      ],
      links: [
        { kind: "source", href: GROVE_REPO },
        { kind: "live", href: "https://hrms.fluentopsai.com" },
      ],
      metrics: [
        {
          id: "grove-tables",
          display: "45",
          countTo: 45,
          label: "tables",
          receipt: {
            explanation:
              "The Prisma schema models people, attendance, leave, payroll and recruitment in 45 tables.",
            proof: { kind: "repo", href: GROVE_REPO, label: "Grove HRMS source on GitHub" },
          },
        },
        {
          id: "grove-permissions",
          display: "26",
          countTo: 26,
          label: "scoped permissions",
          receipt: {
            explanation:
              "26 permissions, each scoped to own, team or company records, checked on the server across 4 roles.",
            proof: { kind: "repo", href: GROVE_REPO, label: "Grove HRMS source on GitHub" },
          },
        },
        {
          id: "grove-tests",
          display: "130+",
          countTo: 130,
          label: "tests",
          receipt: {
            explanation:
              "More than 130 Vitest unit tests and Playwright end-to-end tests, including axe accessibility scans.",
            proof: { kind: "repo", href: GROVE_REPO, label: "Grove HRMS test suites on GitHub" },
          },
        },
        {
          id: "grove-demo-employees",
          display: "100",
          countTo: 100,
          label: "seeded demo employees",
          receipt: {
            explanation: "The live demo runs on a seeded company of 100 employees.",
            proof: {
              kind: "live",
              href: "https://hrms.fluentopsai.com",
              label: "Grove HRMS live demo",
            },
          },
        },
      ],
      limitations: TODO_CONFIRM,
    },
    {
      slug: "leadhub-crm",
      name: "LeadHub CRM",
      pitch:
        "A B2B sales CRM whose pipeline and lead-scoring rules live in one TypeScript domain layer shared by client and server.",
      stack: ["TypeScript", "React", "Node.js", "Express", "SQLite (Turso / libSQL)", "Docker"],
      bullets: [
        "Full-stack B2B sales CRM with a shared TypeScript domain layer (Zod schemas, business rules) reused by client and server: one source of truth for pipeline and lead-scoring logic.",
        "Secure Express 5 REST API over SQLite via Turso (libSQL) with versioned migrations, foreign-key integrity, session auth, RBAC, and rate limiting.",
        "Shipped with Docker on Railway: health checks, daily database snapshots, GitHub Actions CI running type checks and end-to-end API tests.",
      ],
      links: [
        { kind: "source", href: LEADHUB_REPO },
        { kind: "live", href: "https://crm.fluentopsai.com/inquiry" },
      ],
      metrics: [],
      limitations: TODO_CONFIRM,
    },
    {
      slug: "stockroom-erp",
      name: "Stockroom: Inventory & Purchase Order ERP",
      pitch:
        "An inventory and purchase-order ERP where receiving is atomic and stock history is append-only, enforced by the database.",
      stack: ["TypeScript", "React", "Node.js", "Express", "SQLite"],
      bullets: [
        "Inventory ERP with a four-stage purchase-order workflow and four-layer RBAC across 3 roles and 20 permissions.",
        "Atomic order receiving and append-only stock history enforced by database triggers.",
        "Headless-Chrome UX audit tool: layout shift cut from 0.495 to 0.004; 956 undersized tap targets fixed.",
      ],
      links: [
        { kind: "source", href: STOCKROOM_REPO },
        { kind: "live", href: "https://erp.fluentopsai.com" },
      ],
      metrics: [
        {
          id: "stockroom-permissions",
          display: "20",
          countTo: 20,
          label: "permissions across 3 roles",
          receipt: {
            explanation: "Four-layer RBAC: 20 permissions assigned across 3 roles.",
            proof: { kind: "repo", href: STOCKROOM_REPO, label: "Stockroom ERP source on GitHub" },
          },
        },
        {
          id: "stockroom-cls",
          display: "0.495 → 0.004",
          label: "cumulative layout shift",
          receipt: {
            explanation:
              "A headless-Chrome audit tool measured layout shift before and after the fixes: 0.495 down to 0.004.",
            proof: { kind: "repo", href: STOCKROOM_REPO, label: "Stockroom ERP source on GitHub" },
          },
        },
        {
          id: "stockroom-tap-targets",
          display: "956",
          countTo: 956,
          label: "undersized tap targets fixed",
          receipt: {
            explanation:
              "The same audit tool flagged 956 tap targets below the minimum size; all were fixed.",
            proof: { kind: "repo", href: STOCKROOM_REPO, label: "Stockroom ERP source on GitHub" },
          },
        },
      ],
      limitations: TODO_CONFIRM,
    },
  ],
  secondaryProjects: [
    {
      name: "Tessaract",
      summary: "Explainable résumé-to-job matching with deterministic weighted scoring.",
      links: [{ kind: "source", href: `${GITHUB}/Tessaract` }],
    },
    {
      name: "StrategyRoom.ai",
      summary: "Two-agent investment research with a reasoning chain and citations.",
      links: [{ kind: "source", href: `${GITHUB}/StrategyRoom.ai` }],
    },
    {
      name: "Readmission Shield",
      summary: "30-day readmission risk for diabetic patients, with SHAP reasons for every score.",
      links: [
        { kind: "source", href: `${GITHUB}/Hospital-Readmission-Shield-Diabetes` },
        {
          kind: "live",
          href: "https://hospital-readmission-shield-diabetes-mxh3cfy4tg5movmukaphtm.streamlit.app/",
        },
      ],
    },
  ],
  experience: [
    {
      role: "Data Science Intern",
      organization: "Zetpeak",
      start: "2025-10",
      end: "2026-01",
      location: "Bengaluru",
      workMode: "On-site",
      highlights: [
        "Automated data-quality validation scripts in Python and SQL for ingestion pipelines, backed by automated tests, reducing ingestion-level errors by 15% and improving the reliability of downstream ML applications.",
        "Built statistical models (multivariate regression, K-means with Scikit-Learn) to surface hidden patterns in corporate datasets.",
        "Documented findings and translated them into business insights.",
      ],
      metrics: [
        {
          id: "zetpeak-errors",
          display: "15%",
          countTo: 15,
          label: "fewer ingestion-level errors",
          receipt: {
            explanation:
              "Automated, tested data-quality checks on the ingestion pipelines reduced ingestion-level errors by 15%.",
            proof: { kind: "resume", label: "Résumé, Zetpeak internship" },
          },
        },
      ],
    },
    {
      role: "Business Analytics Intern",
      organization: "Maincrafts Technology",
      start: "2026-01",
      end: "2026-04",
      location: "Remote",
      workMode: "Remote",
      highlights: [
        "Built interactive Power BI dashboards (DAX, Power Query) for business KPIs.",
        "Analysed data in Excel with pivot tables and XLOOKUP.",
        "Modelled table relationships and slicers so stakeholders can self-serve.",
      ],
      metrics: [],
    },
  ],
  education: [
    {
      degree: "B.Tech",
      field: "Computer Science Engineering (Data Science)",
      institution: "Garden City University",
      location: "Bengaluru",
      graduation: "2026-07",
      cgpa: { value: 8.53, scale: 10 },
    },
  ],
  certifications: [
    "Google Gen AI Academy",
    "McKinsey Forward Program",
    "Google Data Analytics Professional Certificate",
  ],
  skills: [
    { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL", "HTML/CSS"] },
    {
      group: "Frontend",
      items: [
        "React",
        "Next.js (App Router)",
        "Tailwind CSS",
        "Radix UI",
        "React Hook Form",
        "React Router",
        "Vite",
      ],
    },
    {
      group: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "Next.js Server Actions",
        "REST API design",
        "Zod",
        "Better Auth",
        "JWT",
        "bcrypt",
      ],
    },
    {
      group: "Databases",
      items: [
        "PostgreSQL (Supabase)",
        "SQLite",
        "Prisma ORM",
        "Migrations",
        "Transactions and triggers",
      ],
    },
    {
      group: "Security",
      items: [
        "Role-Based Access Control",
        "Session authentication",
        "Audit logging",
        "Rate limiting",
      ],
    },
    {
      group: "DevOps & tools",
      items: [
        "Docker",
        "GitHub Actions (CI)",
        "Railway",
        "Git",
        "GitHub",
        "Scikit-Learn",
        "Power BI",
        "Excel",
      ],
    },
  ],
} satisfies FactsInput;

export const facts = factsSchema.parse(rawFacts);
