import { ImageResponse } from "next/og";
import { person, trackRecord } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${person.name}, ${person.role}`;

/**
 * The card that shows up when this link is pasted into LinkedIn, a message, or
 * an application. Without one the site previews as a bare URL.
 *
 * Satori needs real font bytes, so the display face is fetched at build time.
 * If that fetch fails the card still renders, just in the default face, which
 * is a much better outcome than failing the build over a typeface.
 */
async function displayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&display=swap",
      { headers: { "user-agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const url = css.match(/src: url\((https:[^)]+\.(?:woff2|ttf))\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const font = await displayFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ededed",
          padding: "72px 80px",
          fontFamily: font ? "Display" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8b8b8b",
            }}
          >
            {person.role}
          </div>
          <div style={{ fontSize: 108, lineHeight: 1.05, marginTop: 18, letterSpacing: -3 }}>
            {person.name}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              marginTop: 24,
              color: "#c3c3c3",
              maxWidth: 880,
            }}
          >
            Rutgers Business School. Markets, equity research, and fintech.
          </div>
        </div>

        <div style={{ display: "flex", gap: 56, borderTop: "1px solid #262626", paddingTop: 28 }}>
          {trackRecord.slice(0, 3).map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 44, color: "#ededed" }}>{stat.value}</div>
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#8b8b8b",
                  marginTop: 6,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", marginLeft: "auto", alignItems: "flex-end" }}>
            <div style={{ fontSize: 22, color: "#a9c4e8" }}>haydenlin.vercel.app</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Display", data: font, style: "normal", weight: 600 }] : undefined,
    },
  );
}
