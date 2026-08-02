import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OBIXCONFIG LAB — FPV Tuning & Betaflight Reference";

const CARBON = "#0a0d10";
const LINE = "#1e262b";
const PHOSPHOR = "#4ce0d2";
const PHOSPHOR_DIM = "#2b8f86";
const AMBER = "#ff8a3d";
const ASH = "#8a98a0";

// static waveform paths, same spirit as the ScopeTrace hero component
function wave(amp: number, freq: number, phase: number, w: number, h: number, midY: number) {
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 8) {
    const nx = x / w;
    const y =
      midY +
      Math.sin(nx * Math.PI * 2 * freq + phase) * h * amp * (0.6 + 0.4 * Math.sin(nx * Math.PI));
    pts.push(`${x === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

export default async function Image() {
  const [spaceGrotesk700, spaceGrotesk500, plexMono500] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-700.woff")),
    readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-500.woff")),
    readFile(join(process.cwd(), "assets/fonts/IBMPlexMono-500.woff")),
  ]);

  const W = 1200;
  const H = 630;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: CARBON,
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        {/* waveform backdrop */}
        <svg
          width={W}
          height={H}
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.8 }}
        >
          <path d={wave(0.14, 0.9, 0, W, H, H * 0.62)} stroke={PHOSPHOR} strokeWidth={2} fill="none" />
          <path d={wave(0.09, 1.7, 2, W, H, H * 0.62)} stroke={PHOSPHOR_DIM} strokeWidth={2} fill="none" />
          <path d={wave(0.05, 3.1, 4, W, H, H * 0.62)} stroke={AMBER} strokeWidth={1.5} fill="none" />
        </svg>

        {/* corner brackets, echoing HudFrame */}
        {[
          { pos: { top: 28, left: 28 }, border: { borderTopWidth: 2, borderLeftWidth: 2 } },
          { pos: { top: 28, right: 28 }, border: { borderTopWidth: 2, borderRightWidth: 2 } },
          { pos: { bottom: 28, left: 28 }, border: { borderBottomWidth: 2, borderLeftWidth: 2 } },
          { pos: { bottom: 28, right: 28 }, border: { borderBottomWidth: 2, borderRightWidth: 2 } },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 28,
              height: 28,
              borderColor: PHOSPHOR_DIM,
              borderStyle: "solid",
              ...c.pos,
              ...c.border,
            }}
          />
        ))}

        {/* main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            padding: "0 90px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: PHOSPHOR,
                boxShadow: `0 0 24px ${PHOSPHOR}`,
                display: "flex",
              }}
            />
            <div
              style={{
                fontFamily: "IBM Plex Mono",
                fontSize: 22,
                letterSpacing: 6,
                color: ASH,
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              FPV Analyzer Lab
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: 96,
              lineHeight: 1.02,
              color: "#e7eef0",
            }}
          >
            OBIXCONFIG
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: 96,
              lineHeight: 1.02,
              color: PHOSPHOR,
              textShadow: `0 0 40px ${PHOSPHOR}`,
              marginTop: -6,
            }}
          >
            LAB
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontFamily: "Space Grotesk",
              fontWeight: 500,
              fontSize: 28,
              color: ASH,
              maxWidth: 780,
            }}
          >
            A signal-grade reference lab for FPV tuning &amp; Betaflight configuration.
          </div>

          <div
            style={{
              display: "flex",
              gap: 28,
              marginTop: 44,
              fontFamily: "IBM Plex Mono",
              fontSize: 18,
              color: PHOSPHOR_DIM,
              letterSpacing: 1,
            }}
          >
            <span style={{ display: "flex" }}>Knowledge</span>
            <span style={{ display: "flex", color: LINE }}>/</span>
            <span style={{ display: "flex" }}>CLI Library</span>
            <span style={{ display: "flex", color: LINE }}>/</span>
            <span style={{ display: "flex" }}>Troubleshooting</span>
            <span style={{ display: "flex", color: LINE }}>/</span>
            <span style={{ display: "flex" }}>Tuning</span>
            <span style={{ display: "flex", color: LINE }}>/</span>
            <span style={{ display: "flex" }}>Tools</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: spaceGrotesk700, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: spaceGrotesk500, weight: 500, style: "normal" },
        { name: "IBM Plex Mono", data: plexMono500, weight: 500, style: "normal" },
      ],
    }
  );
}
