import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/editor-guard";
import { listHistory } from "@/lib/editor-docs";

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }

  const doc = req.nextUrl.searchParams.get("doc") ?? "";
  const entries = await listHistory(doc);
  return NextResponse.json({ success: true, entries });
}
