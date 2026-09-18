import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/editor-guard";
import { listDocs, pickDefaultDoc, writeDoc } from "@/lib/editor-docs";

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }

  let body: { doc?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const docs = await listDocs();
  const doc = pickDefaultDoc(docs, body.doc);
  const content = body.content ?? "";

  try {
    await writeDoc(doc, content);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to write file.";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Saved." });
}
