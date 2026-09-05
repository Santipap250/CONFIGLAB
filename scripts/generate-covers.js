const satori = require("satori").default;
const { Resvg } = require("@resvg/resvg-js");
const fs = require("fs");
const path = require("path");

const CARBON = "#0a0d10";
const RAISED = "#12171b";
const PHOSPHOR = "#4ce0d2";
const PHOSPHOR_DIM = "#2b8f86";
const AMBER = "#ff8a3d";
const PAPER = "#e7eef0";
const ASH = "#8a98a0";

const W = 1200;
const H = 630;

function wave(amp, freq, phase, w, h, midY) {
  const pts = [];
  for (let x = 0; x <= w; x += 8) {
    const nx = x / w;
    const y = midY + Math.sin(nx * Math.PI * 2 * freq + phase) * h * amp * (0.6 + 0.4 * Math.sin(nx * Math.PI));
    pts.push(`${x === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

// Per-episode icon paths (simple, hand-built, no external assets) —
// EP1: warning triangle (what is noise), EP2: signal source nodes (where
// it comes from), EP3: wrench+check (how to fix it).
const ICONS = {
  warning: {
    type: "svg",
    props: {
      viewBox: "0 0 24 24",
      width: 56,
      height: 56,
      fill: "none",
      children: [
        { type: "path", props: { d: "M12 3 L22 20 L2 20 Z", stroke: AMBER, strokeWidth: 1.6, strokeLinejoin: "round" } },
        { type: "line", props: { x1: 12, y1: 9.5, x2: 12, y2: 14, stroke: AMBER, strokeWidth: 1.6, strokeLinecap: "round" } },
        { type: "circle", props: { cx: 12, cy: 17, r: 0.9, fill: AMBER } },
      ],
    },
  },
  nodes: {
    type: "svg",
    props: {
      viewBox: "0 0 24 24",
      width: 56,
      height: 56,
      fill: "none",
      children: [
        { type: "circle", props: { cx: 5, cy: 6, r: 2.2, stroke: AMBER, strokeWidth: 1.6 } },
        { type: "circle", props: { cx: 19, cy: 6, r: 2.2, stroke: AMBER, strokeWidth: 1.6 } },
        { type: "circle", props: { cx: 12, cy: 18, r: 2.6, stroke: AMBER, strokeWidth: 1.6 } },
        { type: "path", props: { d: "M6.8 7.6 L10 15.5 M17.2 7.6 L14 15.5 M7.2 6 L16.8 6", stroke: AMBER, strokeWidth: 1.3 } },
      ],
    },
  },
  fix: {
    type: "svg",
    props: {
      viewBox: "0 0 24 24",
      width: 56,
      height: 56,
      fill: "none",
      children: [
        {
          type: "path",
          props: {
            d: "M14.7 6.3a3.5 3.5 0 0 0-4.6 4.1L4 16.5V20h3.5l6.1-6.1a3.5 3.5 0 0 0 4.1-4.6l-2.6 2.6-1.9-.5-.5-1.9Z",
            stroke: AMBER,
            strokeWidth: 1.5,
            strokeLinejoin: "round",
          },
        },
      ],
    },
  },
  funnel: {
    type: "svg",
    props: {
      viewBox: "0 0 24 24",
      width: 56,
      height: 56,
      fill: "none",
      children: [
        {
          type: "path",
          props: {
            d: "M3.5 4.5h17L14 12.5v6l-4 1.5v-7.5Z",
            stroke: AMBER,
            strokeWidth: 1.6,
            strokeLinejoin: "round",
          },
        },
      ],
    },
  },
};

const EPISODES = [
  { file: "advanced-tuning-ep1.png", ep: "EP1", tagEn: "WHAT IS NOISE", icon: "warning" },
  { file: "advanced-tuning-ep2.png", ep: "EP2", tagEn: "WHERE IT COMES FROM", icon: "nodes" },
  { file: "advanced-tuning-ep3.png", ep: "EP3", tagEn: "FIXING IT FOR FREE", icon: "fix" },
  { file: "advanced-tuning-ep4.png", ep: "EP4", tagEn: "NOISE & FILTERS", icon: "funnel" },
];

async function main() {
  const [spaceGrotesk700, spaceGrotesk500, plexMono500] = await Promise.all([
    fs.promises.readFile(path.join(__dirname, "..", "assets/fonts/SpaceGrotesk-700.woff")),
    fs.promises.readFile(path.join(__dirname, "..", "assets/fonts/SpaceGrotesk-500.woff")),
    fs.promises.readFile(path.join(__dirname, "..", "assets/fonts/IBMPlexMono-500.woff")),
  ]);

  const outDir = path.join(__dirname, "..", "public", "covers");
  fs.mkdirSync(outDir, { recursive: true });

  for (const epi of EPISODES) {
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: CARBON,
            position: "relative",
            fontFamily: "Space Grotesk",
          },
          children: [
            {
              type: "svg",
              props: {
                width: W,
                height: H,
                style: { position: "absolute", top: 0, left: 0, opacity: 0.55 },
                children: [
                  { type: "path", props: { d: wave(0.13, 0.9, 0, W, H, H * 0.5), stroke: PHOSPHOR, strokeWidth: 2, fill: "none" } },
                  { type: "path", props: { d: wave(0.08, 1.7, 2, W, H, H * 0.5), stroke: PHOSPHOR_DIM, strokeWidth: 2, fill: "none" } },
                  { type: "path", props: { d: wave(0.05, 3.1, 4, W, H, H * 0.5), stroke: AMBER, strokeWidth: 1.5, fill: "none" } },
                ],
              },
            },
            ...[
              { pos: { top: 26, left: 26 }, border: { borderTopWidth: 2, borderLeftWidth: 2 } },
              { pos: { top: 26, right: 26 }, border: { borderTopWidth: 2, borderRightWidth: 2 } },
              { pos: { bottom: 26, left: 26 }, border: { borderBottomWidth: 2, borderLeftWidth: 2 } },
              { pos: { bottom: 26, right: 26 }, border: { borderBottomWidth: 2, borderRightWidth: 2 } },
            ].map((c) => ({
              type: "div",
              props: {
                style: { position: "absolute", width: 26, height: 26, borderColor: PHOSPHOR_DIM, borderStyle: "solid", ...c.pos, ...c.border },
              },
            })),
            {
              type: "div",
              props: {
                style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 26 },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 130,
                        height: 130,
                        borderRadius: 999,
                        border: `2px solid ${AMBER}`,
                        background: RAISED,
                        boxShadow: `0 0 60px -8px ${AMBER}`,
                      },
                      children: ICONS[epi.icon],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", fontWeight: 700, fontSize: 96, color: PAPER, letterSpacing: 2 },
                      children: epi.ep,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        fontFamily: "IBM Plex Mono",
                        fontSize: 20,
                        letterSpacing: 6,
                        color: AMBER,
                        textTransform: "uppercase",
                      },
                      children: epi.tagEn,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        marginTop: 10,
                        fontFamily: "Space Grotesk",
                        fontWeight: 500,
                        fontSize: 22,
                        color: PHOSPHOR_DIM,
                        letterSpacing: 3,
                      },
                      children: "ADVANCED TUNING · OBIXCONFIG LAB",
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  position: "absolute",
                  bottom: 56,
                  left: 0,
                  right: 0,
                  justifyContent: "center",
                },
                children: [
                  { type: "div", props: { style: { width: 8, height: 8, borderRadius: 999, background: PHOSPHOR, display: "flex" } } },
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", fontFamily: "IBM Plex Mono", fontSize: 15, color: ASH, letterSpacing: 1 },
                      children: "obixconfiglab.vercel.app",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: W,
        height: H,
        fonts: [
          { name: "Space Grotesk", data: spaceGrotesk700, weight: 700, style: "normal" },
          { name: "Space Grotesk", data: spaceGrotesk500, weight: 500, style: "normal" },
          { name: "IBM Plex Mono", data: plexMono500, weight: 500, style: "normal" },
        ],
      }
    );

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: W } });
    const png = resvg.render().asPng();
    const outPath = path.join(outDir, epi.file);
    fs.writeFileSync(outPath, png);
    console.log(`wrote ${outPath} (${(png.length / 1024).toFixed(1)}KB)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
