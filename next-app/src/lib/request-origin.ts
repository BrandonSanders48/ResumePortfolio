import type { NextRequest } from "next/server";

/** Production origins are explicit: proxy headers can describe an internal HTTP hop. */
export function isSameOriginRequest(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const allowedOrigins = (process.env.EDITOR_ALLOWED_ORIGINS ?? "https://brandonsanders.org,https://www.brandonsanders.org")
    .split(",").map((value) => value.trim()).filter(Boolean);
  try {
    const parsed = new URL(origin);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin) return false;
    if (allowedOrigins.includes(origin)) return true;
  } catch {
    return false;
  }
  // Only development accepts origins derived from the request. In production,
  // forwarded/Host headers must not broaden the explicit allowlist.
  if (process.env.NODE_ENV === "production") return false;
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl.host).split(",")[0].trim();
  const protocol = (req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "")).split(",")[0].trim();
  if (protocol !== "http" && protocol !== "https") return false;
  try {
    const publicUrl = new URL(`${protocol}://${host}`);
    // Do not accept malformed proxy hosts, credentials, or Origin values with paths.
    return publicUrl.host === host && publicUrl.origin === origin;
  } catch {
    return false;
  }
}
