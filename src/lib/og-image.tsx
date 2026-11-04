import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { facts } from "@/content/facts";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

/** Light-theme tokens (src/styles/tokens.css): the share card always uses the paper look. */
const PAPER = "#f5f6f0";
const INK = "#1b2621";
const INK_MUTED = "#55615a";
const ACCENT = "#1f5c45";
const SECONDARY = "#34506e";

const fontFile = (pkg: string, file: string) =>
  readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

const assets = Promise.all([
  fontFile("newsreader", "newsreader-latin-500-normal.woff"),
  fontFile("ibm-plex-sans", "ibm-plex-sans-latin-500-normal.woff"),
  readFile(join(process.cwd(), "public", "flow-lines.svg"), "utf8"),
]);

interface OgImageContent {
  title: string;
  subtitle: string;
}

/** The share card: name and role, a serif title, a one-line subtitle, the hero flow lines. */
export async function renderOgImage({ title, subtitle }: OgImageContent): Promise<ImageResponse> {
  const [newsreader, plexSans, flowLines] = await assets;
  const tintedLines = flowLines.replace('stroke="#000"', `stroke="${SECONDARY}"`);
  const flowLinesSrc = `data:image/svg+xml;base64,${Buffer.from(tintedLines).toString("base64")}`;
  const { name, role, location } = facts.identity;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: PAPER,
        color: INK,
        fontFamily: "Plex Sans",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- satori renders <img>, not next/image */}
      <img
        src={flowLinesSrc}
        alt=""
        width={720}
        height={480}
        style={{ position: "absolute", right: -40, top: 60, opacity: 0.22 }}
      />
      {/* Fades the art in from the left so it has no hard edge. */}
      <div
        style={{
          position: "absolute",
          left: 500,
          top: 0,
          width: 280,
          height: "100%",
          backgroundImage: `linear-gradient(to right, ${PAPER}, rgba(245, 246, 240, 0))`,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 28 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: ACCENT }} />
          <div style={{ marginLeft: 18 }}>{name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div
            style={{
              fontFamily: "Newsreader",
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: INK_MUTED, lineHeight: 1.35 }}>
            {subtitle}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: INK_MUTED }}>
          {role}, {location}
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Newsreader", data: newsreader, weight: 500, style: "normal" },
        { name: "Plex Sans", data: plexSans, weight: 500, style: "normal" },
      ],
    },
  );
}
