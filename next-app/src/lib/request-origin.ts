import type { NextRequest } from "next/server";

/** The ingress supplies the public host/protocol; nextUrl may use the container address. */
export function isSameOriginRequest(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
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
