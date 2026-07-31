import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Dynamisk OG-bild — en unik förhandsvisning per sida.
 *
 * Anropas som /og?t=Rubrik&s=Underrubrik. URL:en byggs av `og()` i
 * src/lib/seo.ts, så sidorna behöver aldrig känna till den här routen.
 * Bilden är 1200x630 (standard för WhatsApp/Facebook/LinkedIn/X) och
 * cachas hårt — innehållet är helt bestämt av query-parametrarna.
 */

export const runtime = "nodejs";
export const revalidate = 86400;

const BLACK = "#14160f";
const LIME = "#d8ff77";
const CREAM = "#f8f7ec";
const GRAY = "#c0bfb4";

let acornCache: ArrayBuffer | null = null;
async function acorn(): Promise<ArrayBuffer | null> {
  if (acornCache) return acornCache;
  // public/ följer alltid med i en byggd container — src/ gör det inte alltid.
  // Därför ligger en kopia av Acorn i public/fonts/ (originalet är src/app/fonts/).
  for (const p of [
    path.join(process.cwd(), "public/fonts/acorn-8.ttf"),
    path.join(process.cwd(), "src/app/fonts/acorn-8.ttf"),
  ]) {
    try {
      const buf = await fs.readFile(p);
      acornCache = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
      return acornCache;
    } catch {
      /* prova nästa sökväg */
    }
  }
  return null;
}

/** Rubrikstorlek efter längd — långa rubriker får inte spilla ur ramen. */
function headingSize(len: number) {
  if (len > 68) return 50;
  if (len > 48) return 60;
  if (len > 30) return 72;
  return 86;
}

/**
 * Underrubriken krymper när rubriken redan tar två rader — annars kan
 * rubrik + text tillsammans bli högre än 630 px och trycka ut fotbalken.
 */
function subSize(titleLen: number, subLen: number) {
  if (titleLen > 48 && subLen > 95) return 24;
  if (subLen > 110) return 26;
  return 29;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("t") || "The Beach").slice(0, 110);
  const sub = (searchParams.get("s") || "").slice(0, 140);
  const font = await acorn();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BLACK,
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Limeglöd nere till höger — samma känsla som sajtens sektioner */}
        <div
          style={{
            position: "absolute",
            right: "-220px",
            bottom: "-280px",
            width: "760px",
            height: "760px",
            borderRadius: "760px",
            background: "radial-gradient(circle, rgba(216,255,119,0.22) 0%, rgba(216,255,119,0) 70%)",
            display: "flex",
          }}
        />

        {/* Ordmärke */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              fontFamily: font ? "Acorn" : "sans-serif",
              fontSize: "40px",
              color: LIME,
              letterSpacing: "0.06em",
            }}
          >
            THE BEACH
          </div>
          <div style={{ display: "flex", width: "8px", height: "8px", borderRadius: "8px", background: GRAY }} />
          <div style={{ display: "flex", fontSize: "22px", color: GRAY, letterSpacing: "0.14em" }}>
            HUDDINGE · STOCKHOLM
          </div>
        </div>

        {/* Rubrik + underrubrik */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "1000px" }}>
          <div
            style={{
              display: "flex",
              fontFamily: font ? "Acorn" : "sans-serif",
              fontSize: `${headingSize(title.length)}px`,
              lineHeight: 1.06,
              color: CREAM,
            }}
          >
            {title}
          </div>
          {sub ? (
            <div
              style={{
                display: "flex",
                marginTop: "24px",
                fontSize: `${subSize(title.length, sub.length)}px`,
                lineHeight: 1.35,
                color: GRAY,
                maxWidth: "920px",
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>

        {/* Fotbalk */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", width: "72px", height: "6px", background: LIME }} />
          <div style={{ display: "flex", fontSize: "26px", color: CREAM, letterSpacing: "0.02em" }}>
            thebeach.one
          </div>
          <div style={{ display: "flex", fontSize: "26px", color: GRAY }}>· Sommar året runt</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: font ? [{ name: "Acorn", data: font, style: "normal", weight: 400 }] : undefined,
      headers: { "cache-control": "public, max-age=86400, s-maxage=604800, immutable" },
    },
  );
}
