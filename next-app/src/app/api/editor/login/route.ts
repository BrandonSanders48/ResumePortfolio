import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, verifyCredentials, SESSION_COOKIE, SESSION_MAX_AGE, isLoginConfigured } from "@/lib/editor-auth";

export async function POST(req: NextRequest) {
  if (!isLoginConfigured()) {
    return NextResponse.json(
      { success: false, message: "Login is not configured. Set RESUME_EDITOR_USERNAME and RESUME_EDITOR_PASSWORD_HASH." },
      { status: 500 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const username = (body.username ?? "").trim();
  const password = body.password ?? "";

  const ok = await verifyCredentials(username, password);
  if (!ok) {
    return NextResponse.json({ success: false, message: "Invalid username or password." }, { status: 401 });
  }

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
