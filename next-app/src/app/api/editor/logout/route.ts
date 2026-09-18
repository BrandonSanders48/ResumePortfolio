import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/editor-auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
