import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { createGateToken, SITE_GATE_COOKIE, SITE_GATE_MAX_AGE } from "@/lib/site-gate";
import { checkRateLimit } from "@/lib/rate-limit";

// Reset-access is a low-stakes footer button, not an auth boundary, but it's
// still an unauthenticated endpoint -- cap how often one IP can hit it so it
// can't be scripted into a request-flood.
const RESET_LIMIT = 15;
const RESET_WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const remoteIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for");
  const verified = await verifyTurnstileToken((body.token ?? "").trim(), remoteIp);
  if (!verified) {
    return NextResponse.json({ success: false, message: "Verification failed. Please try again." }, { status: 400 });
  }

  const token = await createGateToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(SITE_GATE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SITE_GATE_MAX_AGE,
  });
  return res;
}

/** Clears the gate cookie so the next request goes back through /gate. */
export async function DELETE(req: NextRequest) {
  const remoteIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
  const check = checkRateLimit(`site-verify-reset:${remoteIp}`, RESET_LIMIT, RESET_WINDOW_MS);
  if (!check.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(check.retryAfterSeconds) } }
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(SITE_GATE_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
