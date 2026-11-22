// Generates the site icons into src/app/, where Next.js picks them up by file convention:
//   icon.svg       a Newsreader italic "R" in paper on an accent-green rounded square
//   favicon.ico    16, 32 and 48 px renders of the same, for browsers that ask for /favicon.ico
//   apple-icon.png 180 px, full-bleed square (iOS applies its own corner mask)
// The letter is converted to an outline path, so the SVG needs no font. Run from the repo root:
//   node tools/icons/generate.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import opentype from "opentype.js";

const ACCENT = "#1f5c45"; // --accent (light theme)
const PAPER = "#f5f6f0"; // --paper (light theme)
const SIZE = 512;
const CORNER = 112; // about 22% of the side
const LETTER_HEIGHT = 360; // cap height of the R inside the 512 box (about 70%, legible at 16 px)

const fontFile = "node_modules/@fontsource/newsreader/files/newsreader-latin-500-italic.woff";
const buffer = readFileSync(fontFile);
const font = opentype.parse(
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.length),
);

/** The "R" as an SVG path, scaled to LETTER_HEIGHT and centred optically in the square. */
function letterPath() {
  const probe = font.getPath("R", 0, 0, 1000).getBoundingBox();
  const scale = LETTER_HEIGHT / (probe.y2 - probe.y1);
  const fontSize = 1000 * scale;
  const box = font.getPath("R", 0, 0, fontSize).getBoundingBox();
  const width = box.x2 - box.x1;
  const height = box.y2 - box.y1;
  const x = (SIZE - width) / 2 - box.x1;
  const y = (SIZE - height) / 2 - box.y1;
  return font.getPath("R", x, y, fontSize).toPathData(1);
}

function svg({ rounded }) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">` +
    `<rect width="${SIZE}" height="${SIZE}"${rounded ? ` rx="${CORNER}"` : ""} fill="${ACCENT}"/>` +
    `<path d="${letterPath()}" fill="${PAPER}"/></svg>\n`
  );
}

/** An .ico that embeds PNG images (supported by every current browser and Windows Vista+). */
function icoFromPngs(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map(({ data }) => data)]);
}

async function renderPng(page, markup, size) {
  await page.setViewportSize({ width: size, height: size });
  const src = `data:image/svg+xml;base64,${Buffer.from(markup).toString("base64")}`;
  await page.setContent(
    `<html><body style="margin:0;background:transparent"><img src="${src}" width="${size}" height="${size}" style="display:block"></body></html>`,
  );
  await page.locator("img").evaluate((img) => img.decode());
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

const rounded = svg({ rounded: true });
writeFileSync("src/app/icon.svg", rounded);

const browser = await chromium.launch();
const page = await browser.newPage();
const icoSizes = [16, 32, 48];
const icoPngs = [];
for (const size of icoSizes) icoPngs.push({ size, data: await renderPng(page, rounded, size) });
writeFileSync("src/app/favicon.ico", icoFromPngs(icoPngs));
writeFileSync("src/app/apple-icon.png", await renderPng(page, svg({ rounded: false }), 180));
await browser.close();

console.log(
  "icons: src/app/icon.svg, src/app/favicon.ico (16/32/48), src/app/apple-icon.png (180)",
);
