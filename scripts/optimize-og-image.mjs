// Post-build step: recompress the statically-generated OG image with
// palette-based PNG quantization (pngquant-equivalent, via sharp — no
// system binary needed, works on Vercel's build image).
import { readFile, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import sharp from "sharp";

const TARGET = ".next/server/app/opengraph-image.body";

async function run() {
  if (!existsSync(TARGET)) {
    console.log(`[optimize-og-image] ${TARGET} not found — skipping (dev build or route changed).`);
    return;
  }

  const before = await readFile(TARGET);
  const beforeSize = (await stat(TARGET)).size;

  const after = await sharp(before)
    .png({ palette: true, quality: 85, compressionLevel: 9, effort: 8 })
    .toBuffer();

  // Only overwrite if it's actually smaller — never regress.
  if (after.length < before.length) {
    await writeFile(TARGET, after);
  }

  const afterSize = after.length < before.length ? after.length : beforeSize;
  const savedPct = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(0);
  console.log(
    `[optimize-og-image] ${(beforeSize / 1024).toFixed(1)}KB → ${(afterSize / 1024).toFixed(1)}KB (-${savedPct}%)`
  );
}

run().catch((err) => {
  // Never fail the whole build over an image-optimization step.
  console.warn("[optimize-og-image] skipped due to error:", err.message);
});
