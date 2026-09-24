import { NextRequest, NextResponse } from "next/server";
import { isSiteGateEnabled, verifyGateToken, SITE_GATE_COOKIE } from "@/lib/site-gate";

const GATE_EXEMPT_PREFIXES = [
  "/gate",
  "/api/",
  "/editor",
  "/_next/",
  "/files/",
  "/.well-known/",
  // Social-preview crawlers (LinkedIn, Slack, Twitter/X) fetch these
  // unauthenticated when unfurling a shared link -- they need to resolve
  // even when the rest of the site is gated.
  "/opengraph-image",
  "/twitter-image",
];
const GATE_EXEMPT_EXACT = [
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon-32.png",
  "/favicon-16.png",
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.toLowerCase().endsWith(".pdf")) {
    return pdfReferGuard(req);
  }

  if (isSiteGateEnabled() && !isGateExempt(pathname)) {
    const ok = await verifyGateToken(req.cookies.get(SITE_GATE_COOKIE)?.value);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/gate";
      url.search = `?next=${encodeURIComponent(pathname + req.nextUrl.search)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

function isGateExempt(pathname: string): boolean {
  if (GATE_EXEMPT_EXACT.includes(pathname)) return true;
  return GATE_EXEMPT_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Blocks direct/off-site access to PDFs served from /files/*.pdf: only
 * requests whose Referer is this site itself (i.e. a click/embed on a page
 * that was actually loaded from here) are allowed through. A missing Referer
 * (typed/pasted URL, curl, most scraper bots) or a Referer from another
 * origin (hotlinking) gets a 403. The resume's Turnstile-gated download path
 * never hits this at all -- it reads the file server-side in
 * /api/resume-download instead of requesting the static path.
 */
function pdfReferGuard(req: NextRequest): NextResponse {
  const referer = req.headers.get("referer");
  let refererHost: string | null = null;
  if (referer) {
    try {
      refererHost = new URL(referer).host;
    } catch {
      refererHost = null;
    }
  }

  // Compare against the Host header rather than req.nextUrl.origin: behind a
  // reverse proxy (or in a container bound to 0.0.0.0) the latter reflects
  // the server's own bind address, not the public hostname a real browser's
  // Referer would carry.
  const requestHost = req.headers.get("x-forwarded-host") || req.headers.get("host");

  if (!refererHost || !requestHost || refererHost !== requestHost) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
