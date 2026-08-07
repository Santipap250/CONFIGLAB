import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OBIXCONFIG LAB — FPV Tuning, CLI Config Analyzer & Betaflight Reference";

const CARBON = "#0a0d10";
const RAISED = "#12171b";
const LINE = "#1e262b";
const PHOSPHOR = "#4ce0d2";
const PHOSPHOR_DIM = "#2b8f86";
const AMBER = "#ff8a3d";
const PAPER = "#e7eef0";
const ASH = "#8a98a0";

// static waveform paths, same spirit as the ScopeTrace hero component
function wave(amp: number, freq: number, phase: number, w: number, h: number, midY: number) {
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 8) {
    const nx = x / w;
    const y =
      midY + Math.sin(nx * Math.PI * 2 * freq + phase) * h * amp * (0.6 + 0.4 * Math.sin(nx * Math.PI));
    pts.push(`${x === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

// small deterministic sparkline for the analyzer-panel mockup — not real
// data, purely decorative texture (same honesty bar as everywhere else:
// no fabricated numbers are presented as real measurements)
function sparkline(w: number, h: number, seedPoints: number[]) {
  const step = w / (seedPoints.length - 1);
  return seedPoints
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(h - v * h).toFixed(1)}`)
    .join(" ");
}

const FEATURES = ["Knowledge", "CLI Library", "Troubleshoot", "Tuning", "Tools", "Config Analyzer"];

const ANALYZER_ROWS: { key: string; status: "warn" | "ok" | "info"; note: string }[] = [
  { key: "dyn_notch_min_hz", status: "warn", note: "out of range" },
  { key: "p_pitch", status: "ok", note: "customized" },
  { key: "dshot_idle_value", status: "info", note: "default" },
];

const STATUS_COLOR: Record<string, string> = { warn: AMBER, ok: PHOSPHOR, info: PHOSPHOR_DIM };

export default async function Image() {
  const [spaceGrotesk700, spaceGrotesk500, plexMono500, thaiRegular, thaiSemibold, logoBuf] =
    await Promise.all([
      readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-700.woff")),
      readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-500.woff")),
      readFile(join(process.cwd(), "assets/fonts/IBMPlexMono-500.woff")),
      readFile(join(process.cwd(), "assets/fonts/IBMPlexSansThai-400.woff")),
      readFile(join(process.cwd(), "assets/fonts/IBMPlexSansThai-600.woff")),
      readFile(join(process.cwd(), "public/brand/obix-logo.png")),
    ]);

  const logoSrc = `data:image/png;base64,${logoBuf.toString("base64")}`;

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
          fontFamily: "IBM Plex Sans Thai",
        }}
      >
        {/* waveform backdrop */}
        <svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0, opacity: 0.55 }}>
          <path d={wave(0.1, 0.9, 0, W, H, H * 0.82)} stroke={PHOSPHOR} strokeWidth={2} fill="none" />
          <path d={wave(0.06, 1.7, 2, W, H, H * 0.82)} stroke={PHOSPHOR_DIM} strokeWidth={2} fill="none" />
          <path d={wave(0.04, 3.1, 4, W, H, H * 0.82)} stroke={AMBER} strokeWidth={1.5} fill="none" />
        </svg>

        {/* corner brackets */}
        {[
          { pos: { top: 26, left: 26 }, border: { borderTopWidth: 2, borderLeftWidth: 2 } },
          { pos: { top: 26, right: 26 }, border: { borderTopWidth: 2, borderRightWidth: 2 } },
          { pos: { bottom: 26, left: 26 }, border: { borderBottomWidth: 2, borderLeftWidth: 2 } },
          { pos: { bottom: 26, right: 26 }, border: { borderBottomWidth: 2, borderRightWidth: 2 } },
        ].map((c, i) => (
          <div
            key={i}
            style={{ position: "absolute", width: 26, height: 26, borderColor: PHOSPHOR_DIM, borderStyle: "solid", ...c.pos, ...c.border }}
          />
        ))}

        {/* main content: two columns */}
        <div style={{ display: "flex", height: "100%", padding: "58px 64px 0 64px" }}>
          {/* LEFT: logo, tagline, feature pills */}
          <div style={{ display: "flex", flexDirection: "column", width: 620, paddingTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: PHOSPHOR, display: "flex" }} />
              <div
                style={{
                  fontFamily: "IBM Plex Mono",
                  fontSize: 18,
                  letterSpacing: 5,
                  color: ASH,
                  textTransform: "uppercase",
                  display: "flex",
                }}
              >
                FPV Analyzer Lab
              </div>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={460} height={241} style={{ marginTop: 10, marginLeft: -8 }} />

            <div
              style={{
                display: "flex",
                marginTop: 6,
                fontFamily: "IBM Plex Sans Thai",
                fontWeight: 600,
                fontSize: 26,
                color: PAPER,
                maxWidth: 560,
              }}
            >
              เครื่องมือจูน &amp; วิเคราะห์ Config สำหรับนักบิน FPV
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 10,
                fontFamily: "IBM Plex Sans Thai",
                fontWeight: 400,
                fontSize: 19,
                color: ASH,
                maxWidth: 540,
                lineHeight: 1.5,
              }}
            >
              ความรู้ คลัง CLI แก้ปัญหา และวิเคราะห์ config ของคุณ — ครบในที่เดียว
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 30 }}>
              {FEATURES.map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    fontFamily: "IBM Plex Mono",
                    fontSize: 15,
                    color: PHOSPHOR_DIM,
                    border: `1px solid ${LINE}`,
                    borderRadius: 4,
                    padding: "6px 12px",
                  }}
                >
                  {f}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", marginTop: "auto", marginBottom: 40, alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: AMBER, display: "flex" }} />
              <div style={{ display: "flex", fontFamily: "IBM Plex Mono", fontSize: 18, color: PAPER, letterSpacing: 1 }}>
                obixconfiglab.vercel.app
              </div>
            </div>
          </div>

          {/* RIGHT: Config Analyzer mockup panel */}
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 30 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 430,
                borderRadius: 12,
                border: `1px solid ${PHOSPHOR_DIM}`,
                background: RAISED,
                boxShadow: `0 0 70px -12px ${PHOSPHOR}`,
                overflow: "hidden",
              }}
            >
              {/* title bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 20px",
                  borderBottom: `1px solid ${LINE}`,
                }}
              >
                <div style={{ width: 9, height: 9, borderRadius: 999, background: AMBER, display: "flex" }} />
                <div style={{ display: "flex", fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 17, color: PAPER }}>
                  CLI Config Analyzer
                </div>
              </div>

              {/* result rows */}
              <div style={{ display: "flex", flexDirection: "column", padding: "18px 20px 6px 20px" }}>
                {ANALYZER_ROWS.map((r) => (
                  <div
                    key={r.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: `1px solid ${LINE}`,
                    }}
                  >
                    <div style={{ display: "flex", fontFamily: "IBM Plex Mono", fontSize: 15, color: PAPER }}>
                      {r.key}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        fontFamily: "IBM Plex Mono",
                        fontSize: 13,
                        color: STATUS_COLOR[r.status],
                        border: `1px solid ${STATUS_COLOR[r.status]}`,
                        borderRadius: 4,
                        padding: "3px 9px",
                      }}
                    >
                      {r.note}
                    </div>
                  </div>
                ))}
              </div>

              {/* mini sparkline footer */}
              <div style={{ display: "flex", padding: "14px 20px 20px 20px" }}>
                <svg width={390} height={70} style={{ display: "flex" }}>
                  <path
                    d={sparkline(390, 60, [0.5, 0.62, 0.4, 0.7, 0.55, 0.8, 0.6, 0.75, 0.5, 0.65])}
                    stroke={PHOSPHOR}
                    strokeWidth={2}
                    fill="none"
                  />
                </svg>
              </div>
            </div>
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
        { name: "IBM Plex Sans Thai", data: thaiRegular, weight: 400, style: "normal" },
        { name: "IBM Plex Sans Thai", data: thaiSemibold, weight: 600, style: "normal" },
      ],
    }
  );
}
