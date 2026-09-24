import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, verifyCredentials, SESSION_COOKIE, SESSION_MAX_AGE, isLoginConfigured } from "@/lib/editor-auth";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

// Per source IP: caps total login attempts regardless of outcome, so a
// scripted brute force can't burn through guesses even with a valid
// Turnstile token.
const IP_LIMIT = 8;
const IP_WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  if (!isLoginConfigured()) {
    return NextResponse.json(
      { success: false, message: "Login is not configured. Set RESUME_EDITOR_USERNAME and RESUME_EDITOR_PASSWORD_HASH." },
      { status: 500 }
    );
  }

  const remoteIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
  const ipCheck = checkRateLimit(`editor-login:${remoteIp}`, IP_LIMIT, IP_WINDOW_MS);
  if (!ipCheck.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(ipCheck.retryAfterSeconds) } }
    );
  }

  let body: { username?: string; password?: string; turnstileToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const verified = await verifyTurnstileToken((body.turnstileToken ?? "").trim(), remoteIp);
  if (!verified) {
    return NextResponse.json({ success: false, message: "Verification check failed. Please try again." }, { status: 400 });
  }

  const username = (body.username ?? "").trim();
  const password = body.password ?? "";

  const ok = await verifyCredentials(username, password);
  if (!ok) {
    return NextResponse.json({ success: false, message: "Invalid username or password." }, { status: 401 });
  }

  resetRateLimit(`editor-login:${remoteIp}`);

  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
