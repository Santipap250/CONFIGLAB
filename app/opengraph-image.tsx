import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OBIXCONFIG LAB — FPV tuning and configuration share image";

export default async function Image() {
  const file = await readFile(join(process.cwd(), "public", "og-share.jpg"));
  const base64 = file.toString("base64");

  return new ImageResponse(
    (
      <img
        src={`data:image/jpeg;base64,${base64}`}
        alt="OBIX CONFIG LAB"
        width={1200}
        height={630}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    ),
    size
  );
}
