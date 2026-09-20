import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMG_SRC_PATTERN = /<img[^>]+src="(\/files\/images\/[^"]+)"/g;

// The headshot/challenge-coin photos are displayed at ~92px in the resume
// sidebar but embedded at full camera resolution (1-2MB PNGs), which is by
// far the biggest contributor to these PDFs' file size. Downscaling to a
// size still sharp at print resolution and re-encoding as JPEG shrinks that
// dramatically with no visible quality loss at the size they're shown.
const MAX_DIMENSION = 320;
const JPEG_QUALITY = 78;

/**
 * Replaces <img src="/files/images/..."> references with inlined,
 * downscaled/recompressed data URIs. Falls back to leaving the original src
 * in place for any image that fails to read or process.
 */
export async function compressEmbeddedImages(html: string): Promise<string> {
  const srcs = new Set<string>();
  for (const match of html.matchAll(IMG_SRC_PATTERN)) {
    srcs.add(match[1]);
  }
  if (srcs.size === 0) return html;

  let out = html;
  for (const src of srcs) {
    try {
      const filePath = path.join(process.cwd(), "public", decodeURIComponent(src));
      const original = await fs.readFile(filePath);
      const compressed = await sharp(original)
        .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY })
        .toBuffer();
      const dataUri = `data:image/jpeg;base64,${compressed.toString("base64")}`;
      out = out.split(`src="${src}"`).join(`src="${dataUri}"`);
    } catch {
      // Leave the original <img src> in place; the export still succeeds,
      // just without the size savings for that one image.
    }
  }
  return out;
}
