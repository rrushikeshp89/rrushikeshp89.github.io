// Fails when the home route ships more JavaScript than its budget (master prompt §7: 150 kB gzipped).
// Counts what a modern browser downloads: `noModule` polyfill scripts are skipped, because only
// browsers without ES module support fetch them.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_BYTES = 150 * 1024;
const ROUTES = [
  { route: "/", file: "index.html", budgeted: true },
  { route: "/design/", file: "design/index.html", budgeted: false },
  { route: "/work/grove-hrms/", file: "work/grove-hrms/index.html", budgeted: false },
];

function moduleScriptSources(html) {
  return [...html.matchAll(/<script\b[^>]*>/g)]
    .map(([tag]) => tag)
    .filter((tag) => !/\bnoModule\b/i.test(tag))
    .map((tag) => /src="(\/_next\/static\/[^"]+\.js)"/.exec(tag)?.[1])
    .filter(Boolean);
}

function gzippedSize(src) {
  return gzipSync(readFileSync(join("out", src))).length;
}

let failed = false;
for (const { route, file, budgeted } of ROUTES) {
  const sources = [...new Set(moduleScriptSources(readFileSync(join("out", file), "utf8")))];
  const total = sources.reduce((sum, src) => sum + gzippedSize(src), 0);
  const overBudget = budgeted && total > BUDGET_BYTES;
  failed ||= overBudget;
  const status = !budgeted ? "info" : overBudget ? "FAIL" : "ok  ";
  console.log(
    `${status} ${route.padEnd(8)} ${(total / 1024).toFixed(1)} kB gzipped JS, ${sources.length} files`,
  );
}
console.log(`Budget for / is ${BUDGET_BYTES / 1024} kB.`);
process.exit(failed ? 1 : 0);
