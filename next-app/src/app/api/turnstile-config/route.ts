import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ siteKey: process.env.TURNSTILE_SITE_KEY || null });
}
