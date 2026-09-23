import { NextResponse } from "next/server";
import { isSiteGateEnabled } from "@/lib/site-gate";

export async function GET() {
  return NextResponse.json({
    siteKey: process.env.TURNSTILE_SITE_KEY || null,
    gateEnabled: isSiteGateEnabled(),
  });
}
