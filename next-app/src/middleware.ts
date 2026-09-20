import { NextRequest, NextResponse } from "next/server";

/**
 * Blocks direct/off-site access to PDFs served from /files/*.pdf: only
 * requests whose Referer is this site itself (i.e. a click/embed on a page
 * that was actually loaded from here) are allowed through. A missing Referer
 * (typed/pasted URL, curl, most scraper bots) or a Referer from another
 * origin (hotlinking) gets a 403. The resume's Turnstile-gated download path
 * never hits this at all -- it reads the file server-side in
 * /api/resume-download instead of requesting the static path.
 */
export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.toLowerCase().endsWith(".pdf")) {
    return NextResponse.next();
  }

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
  matcher: ["/files/:path*"],
};
