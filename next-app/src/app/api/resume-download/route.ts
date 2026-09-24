import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit } from "@/lib/rate-limit";

const RESUME_PATH = path.join(process.cwd(), "public", "files", "Brandon-Sanders-Resume.pdf");

const DOWNLOAD_LIMIT = 15;
const DOWNLOAD_WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  const remoteIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = checkRateLimit(`resume-download:${remoteIp}`, DOWNLOAD_LIMIT, DOWNLOAD_WINDOW_MS);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
    );
  }

  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const verified = await verifyTurnstileToken((body.token ?? "").trim(), remoteIp);
  if (!verified) {
    return NextResponse.json(
      { success: false, message: "Verification check failed. Please try again." },
      { status: 400 }
    );
  }

  let bytes: Buffer;
  try {
    bytes = await fs.readFile(RESUME_PATH);
  } catch {
    return NextResponse.json({ success: false, message: "Resume file not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Brandon-Sanders-Resume.pdf"',
    },
  });
}
