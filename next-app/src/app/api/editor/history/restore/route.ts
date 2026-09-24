import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/editor-guard";
import { readHistorySnapshot, writeDoc } from "@/lib/editor-docs";

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }

  let body: { doc?: string; id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const doc = body.doc ?? "";
  const id = body.id ?? "";

  const content = await readHistorySnapshot(doc, id);
  if (content === null) {
    return NextResponse.json({ success: false, message: "That version could not be found." }, { status: 404 });
  }

  try {
    // Snapshots the version being replaced (whatever's live right now), so
    // restoring is itself undoable from the same history list.
    await writeDoc(doc, content);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Restore failed.";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }

  return NextResponse.json({ success: true, content, updatedAt: new Date().toISOString() });
}
