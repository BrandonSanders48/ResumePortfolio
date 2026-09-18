import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/editor-guard";
import { listDocs, pickDefaultDoc, readDoc } from "@/lib/editor-docs";

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }

  const docs = await listDocs();
  const requested = req.nextUrl.searchParams.get("doc");
  const activeDoc = pickDefaultDoc(docs, requested);
  const content = await readDoc(activeDoc);

  return NextResponse.json({ success: true, docs, activeDoc, content });
}
