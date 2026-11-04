// Prints /resume/document/ (generated from src/content/facts.ts) to out/resume.pdf after
// `next build`, so the published résumé always matches the site (DECISIONS.md, ADR-030).
// Fails the build if the page holds a phone number or does not fit one A4 page.
import { spawn, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const PORT = 4330;
const OUTPUT = "out/resume.pdf";
const PHONE_PATTERN = /(?<!\d)(?:\+?91[\s-]?)?[6-9]\d{9}(?!\d)/;
const MAX_PAGES = 1;

function startServer() {
  const server = spawn(`node scripts/serve-static.mjs out ${PORT}`, {
    shell: true,
    stdio: "pipe",
    detached: process.platform !== "win32",
  });
  return new Promise((resolve, reject) => {
    server.stdout.on("data", (chunk) => {
      if (String(chunk).includes("Ready")) resolve(server);
    });
    server.on("exit", (code) => reject(new Error(`Static server exited with code ${code}`)));
  });
}

function stopServer(server) {
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"]);
  else process.kill(-server.pid, "SIGTERM");
}

/** Chromium writes one "/Type /Page" object per page (and "/Type /Pages" for the tree). */
function countPages(pdf) {
  return (pdf.toString("latin1").match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
}

const server = await startServer();
const browser = await chromium.launch();
let failure = "";

try {
  const page = await browser.newPage();
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  await page.goto(`http://localhost:${PORT}/resume/document/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const text = await page.locator("article").innerText();
  if (PHONE_PATTERN.test(text)) failure = "the résumé contains a phone number";

  const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true });
  const pages = countPages(pdf);
  if (pages > MAX_PAGES) failure ||= `the résumé runs to ${pages} pages (limit ${MAX_PAGES})`;

  if (!failure) {
    writeFileSync(OUTPUT, pdf);
    const kb = (readFileSync(OUTPUT).length / 1024).toFixed(1);
    console.log(`résumé: ${OUTPUT}, ${pages} page, ${kb} kB`);
  }
} finally {
  await browser.close();
  stopServer(server);
}

if (failure) {
  console.error(`build-resume failed: ${failure}`);
  process.exit(1);
}
