import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ projectId: process.env.CLARITY_PROJECT_ID || null });
}
