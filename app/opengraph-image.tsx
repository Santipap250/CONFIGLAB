import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OBIXCONFIG LAB — FPV Tuning & Betaflight Reference";

const CARBON = "#071014";
const CARBON_2 = "#0c171d";
const LINE = "#1b2a31";
const LINE_2 = "#263a43";
const PHOSPHOR = "#4ce0d2";
const PHOSPHOR_DIM = "#2aa89c";
const AMBER = "#ff8a3d";
const PAPER = "#eaf2f4";
const ASH = "#8ea0a8";
const MUTED = "#5f727a";

function wave(amp: number, freq: number, phase: number, w: number, h: number, midY: number) {
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 8) {
    const nx = x / w;
    const y =
      midY +
      Math.sin(nx * Math.PI * 2 * freq + phase) * h * amp * (0.58 + 0.42 * Math.sin(nx * Math.PI));
    pts.push(`${x === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

function sparkLine(values: number[], x: number, y: number, w: number, h: number) {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(0.0001, max - min);
  return values
    .map((v, i) => {
      const px = x + (w * i) / (values.length - 1);
      const py = y + h - ((v - min) / span) * h;
      return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(" ");
}

async function tryRead(...paths: string[]) {
  for (const p of paths) {
    try {
      return await readFile(p);
    } catch {
      // keep trying
    }
  }
  return null;
}

function pill(label: string, active = false) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 999,
        border: `1px solid ${active ? PHOSPHOR_DIM : LINE_2}`,
        background: active ? "rgba(76,224,210,0.10)" : "rgba(7,16,20,0.55)",
        padding: "8px 14px",
        color: active ? PHOSPHOR : ASH,
        fontFamily: "IBM Plex Mono",
        fontSize: 14,
        letterSpacing: 0.8,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: active ? PHOSPHOR : LINE_2,
          boxShadow: active ? "0 0 16px rgba(76,224,210,0.65)" : "none",
        }}
      />
      {label}
    </div>
  );
}

export default async function Image() {
  const [spaceGrotesk700, spaceGrotesk500, plexMono500, notoThaiRegular, notoThaiBold, logo] =
    await Promise.all([
      readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-700.woff")),
      readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-500.woff")),
      readFile(join(process.cwd(), "assets/fonts/IBMPlexMono-500.woff")),
      tryRead(
        "/usr/share/fonts/truetype/noto/NotoSansThai-Regular.ttf",
        "/usr/share/fonts/truetype/noto/NotoSansThai-CondensedRegular.ttf"
      ),
      tryRead(
        "/usr/share/fonts/truetype/noto/NotoSansThai-Bold.ttf",
        "/usr/share/fonts/truetype/noto/NotoSansThai-CondensedBold.ttf"
      ),
      readFile(join(process.cwd(), "public/brand/obix-logo.png")),
    ]);

  const W = 1200;
  const H = 630;
  const logoDataUri = `data:image/png;base64,${logo.toString("base64")}`;

  const fonts = [
    { name: "Space Grotesk", data: spaceGrotesk700, weight: 700, style: "normal" as const },
    { name: "Space Grotesk", data: spaceGrotesk500, weight: 500, style: "normal" as const },
    { name: "IBM Plex Mono", data: plexMono500, weight: 500, style: "normal" as const },
    ...(notoThaiRegular ? [{ name: "Noto Sans Thai", data: notoThaiRegular, weight: 400, style: "normal" as const }] : []),
    ...(notoThaiBold ? [{ name: "Noto Sans Thai", data: notoThaiBold, weight: 700, style: "normal" as const }] : []),
  ];

  const performanceBars = [62, 84, 78, 91, 74, 88, 96];
  const filterBars = [18, 30, 44, 58, 72, 66, 52, 36];
  const spark = [22, 18, 25, 31, 28, 44, 39, 58, 49, 64, 60, 73, 68, 79, 75];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${CARBON} 0%, ${CARBON_2} 54%, #0a1116 100%)`,
          color: PAPER,
          fontFamily: "Space Grotesk",
        }}
      >
        {/* neon glows */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 16% 28%, rgba(76,224,210,0.20) 0, rgba(76,224,210,0.00) 25%), radial-gradient(circle at 84% 12%, rgba(255,138,61,0.18) 0, rgba(255,138,61,0.00) 24%), radial-gradient(circle at 82% 86%, rgba(76,224,210,0.14) 0, rgba(76,224,210,0.00) 24%)",
          }}
        />

        {/* grid */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.4 }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 80}
              y1={0}
              x2={i * 80}
              y2={H}
              stroke={i % 2 === 0 ? LINE : LINE_2}
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * 70}
              x2={W}
              y2={i * 70}
              stroke={i % 2 === 0 ? LINE : LINE_2}
              strokeWidth={1}
            />
          ))}
        </svg>

        {/* wavebacks */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.9 }}>
          <path d={wave(0.12, 0.85, 0, W, H, H * 0.31)} stroke={PHOSPHOR} strokeWidth={2} fill="none" />
          <path d={wave(0.08, 1.5, 2.3, W, H, H * 0.61)} stroke={PHOSPHOR_DIM} strokeWidth={2} fill="none" />
          <path d={wave(0.05, 2.8, 4.6, W, H, H * 0.73)} stroke={AMBER} strokeWidth={1.5} fill="none" />
        </svg>

        {/* corner frame */}
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
              width: 30,
              height: 30,
              borderColor: PHOSPHOR_DIM,
              borderStyle: "solid",
              opacity: 0.95,
              ...c.pos,
              ...c.border,
            }}
          />
        ))}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            gap: 32,
            padding: "48px 54px",
          }}
        >
          {/* left side */}
          <div
            style={{
              flex: 1.05,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: PHOSPHOR,
                  boxShadow: "0 0 18px rgba(76,224,210,0.95)",
                }}
              />
              <div
                style={{
                  fontFamily: "IBM Plex Mono",
                  fontSize: 18,
                  letterSpacing: 4.6,
                  textTransform: "uppercase",
                  color: ASH,
                }}
              >
                TH FPV SOCIAL CARD
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 22 }}>
              <div
                style={{
                  width: 126,
                  height: 126,
                  borderRadius: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(10,18,23,0.88)",
                  border: `1px solid ${PHOSPHOR_DIM}`,
                  boxShadow: "0 18px 50px rgba(0,0,0,0.42), inset 0 0 0 1px rgba(255,255,255,0.03)",
                  overflow: "hidden",
                  padding: 16,
                  flexShrink: 0,
                }}
              >
                <img
                  src={logoDataUri}
                  alt=""
                  width={96}
                  height={96}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: PHOSPHOR,
                    fontFamily: "IBM Plex Mono",
                    fontSize: 15,
                    textTransform: "uppercase",
                    letterSpacing: 2.5,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: AMBER,
                      boxShadow: "0 0 18px rgba(255,138,61,0.55)",
                    }}
                  />
                  OBIXCONFIG LAB
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontSize: 74,
                    lineHeight: 0.98,
                    fontWeight: 700,
                    letterSpacing: -1.8,
                    color: PAPER,
                    textShadow: "0 0 28px rgba(76,224,210,0.16)",
                  }}
                >
                  โดรนต้องอ่านอาการให้ขาด
                </div>

                <div
                  style={{
                    marginTop: 12,
                    fontSize: 24,
                    lineHeight: 1.25,
                    color: ASH,
                    maxWidth: 610,
                    fontFamily: "Noto Sans Thai, Space Grotesk, sans-serif",
                  }}
                >
                  เครื่องมือวิเคราะห์ Betaflight, CLI, Tuning และ Troubleshooting ที่ทำมาเพื่อคอมมูนิตี้ FPV ไทย
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
              {pill("Knowledge", true)}
              {pill("CLI Library")}
              {pill("Troubleshoot")}
              {pill("Tuning")}
              {pill("Tools")}
              {pill("Analyzer", true)}
            </div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: "IBM Plex Mono",
                color: MUTED,
                fontSize: 14,
                letterSpacing: 1.1,
              }}
            >
              <span
                style={{
                  color: PHOSPHOR,
                  fontSize: 14,
                  letterSpacing: 1.6,
                }}
              >
                labfpv.vercel.app
              </span>
              <span style={{ color: LINE }}>•</span>
              <span>share-ready / seo-ready / fpv-lab</span>
            </div>
          </div>

          {/* right side */}
          <div
            style={{
              flex: 0.95,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 0,
            }}
          >
            <div
              style={{
                borderRadius: 28,
                border: `1px solid ${LINE_2}`,
                background:
                  "linear-gradient(180deg, rgba(13,24,30,0.98) 0%, rgba(9,17,21,0.98) 100%)",
                boxShadow: "0 26px 70px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.04)",
                padding: 22,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: "IBM Plex Mono",
                    fontSize: 14,
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    color: ASH,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: PHOSPHOR,
                      boxShadow: "0 0 14px rgba(76,224,210,0.75)",
                    }}
                  />
                  Live preview
                </div>
                <div
                  style={{
                    padding: "7px 12px",
                    borderRadius: 999,
                    background: "rgba(255,138,61,0.12)",
                    border: "1px solid rgba(255,138,61,0.36)",
                    color: AMBER,
                    fontFamily: "IBM Plex Mono",
                    fontSize: 13,
                    letterSpacing: 1,
                  }}
                >
                  v1.0 / public share
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  borderRadius: 22,
                  overflow: "hidden",
                  border: `1px solid ${LINE}`,
                }}
              >
                <div style={{ flex: 1, padding: 18, background: "rgba(5,10,12,0.95)" }}>
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono",
                      fontSize: 13,
                      color: PHOSPHOR,
                      letterSpacing: 1.1,
                    }}
                  >
                    $ config-analyzer --scan
                  </div>
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: ASH, fontFamily: "IBM Plex Mono", fontSize: 13 }}>
                      <span>gyro_noise</span><span style={{ color: PAPER }}>LOW</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: ASH, fontFamily: "IBM Plex Mono", fontSize: 13 }}>
                      <span>d-term_heat</span><span style={{ color: AMBER }}>WATCH</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: ASH, fontFamily: "IBM Plex Mono", fontSize: 13 }}>
                      <span>rpm_filter</span><span style={{ color: PHOSPHOR }}>READY</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: ASH, fontFamily: "IBM Plex Mono", fontSize: 13 }}>
                      <span>battery_drop</span><span style={{ color: PAPER }}>STABLE</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: 154,
                    padding: 16,
                    background: "rgba(10,18,23,0.96)",
                    borderLeft: `1px solid ${LINE}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {[
                    { label: "PID", value: "92 / 58 / 46" },
                    { label: "Rates", value: "850 / 0.52" },
                    { label: "Filters", value: "dyn notch" },
                    { label: "Cells", value: "6S / 2.4Ah" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      style={{
                        borderRadius: 16,
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${LINE}`,
                        padding: "10px 11px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "IBM Plex Mono",
                          fontSize: 11,
                          color: ASH,
                          letterSpacing: 1.2,
                          textTransform: "uppercase",
                        }}
                      >
                        {row.label}
                      </div>
                      <div style={{ fontSize: 16, color: PAPER, fontWeight: 700, lineHeight: 1.1 }}>{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 14 }}>
                <div
                  style={{
                    flex: 1,
                    borderRadius: 22,
                    padding: 16,
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${LINE}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      color: ASH,
                      fontFamily: "IBM Plex Mono",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                    }}
                  >
                    <span>Signal health</span>
                    <span style={{ color: PHOSPHOR }}>87%</span>
                  </div>
                  <svg width={332} height={86} viewBox="0 0 332 86">
                    <path d={sparkLine(spark, 2, 12, 328, 64)} stroke={PHOSPHOR} strokeWidth={3} fill="none" />
                    <path
                      d={sparkLine(spark.map((v, i) => v - (i % 2 ? 4 : 0)), 2, 12, 328, 64)}
                      stroke={AMBER}
                      strokeWidth={1.2}
                      fill="none"
                      opacity={0.7}
                    />
                  </svg>
                </div>

                <div
                  style={{
                    width: 152,
                    borderRadius: 22,
                    padding: 16,
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${LINE}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "IBM Plex Mono",
                      fontSize: 11,
                      color: ASH,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                    }}
                  >
                    <span>Output</span>
                    <span style={{ color: PHOSPHOR }}>Live</span>
                  </div>

                  {performanceBars.map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 20, color: ASH, fontFamily: "IBM Plex Mono", fontSize: 11 }}>
                        {i + 1}
                      </div>
                      <div
                        style={{
                          height: 10,
                          width: 84,
                          borderRadius: 999,
                          background: LINE,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${v}%`,
                            borderRadius: 999,
                            background:
                              i === 3
                                ? "linear-gradient(90deg, rgba(255,138,61,0.95), rgba(255,204,140,0.95))"
                                : "linear-gradient(90deg, rgba(76,224,210,0.95), rgba(76,224,210,0.62))",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {[
                  { label: "Knowledge", value: "9 topics" },
                  { label: "CLI", value: "25 commands" },
                  { label: "Troubleshoot", value: "15 fixes" },
                  { label: "Tools", value: "3 helpers" },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    style={{
                      flex: 1,
                      borderRadius: 18,
                      padding: "12px 14px",
                      background: i === 0 ? "rgba(76,224,210,0.10)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${i === 0 ? "rgba(76,224,210,0.34)" : LINE}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "IBM Plex Mono",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 1.2,
                        color: i === 0 ? PHOSPHOR : ASH,
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: PAPER }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  fontFamily: "IBM Plex Mono",
                  fontSize: 12,
                  color: MUTED,
                  letterSpacing: 0.8,
                }}
              >
                <span>Built for Thai FPV share posts</span>
                <span style={{ color: PHOSPHOR }}>facebook • x • line • discord</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
