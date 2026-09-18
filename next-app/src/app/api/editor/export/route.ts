import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import { isAuthorized } from "@/lib/editor-guard";
import { listDocs, pickDefaultDoc, readDoc } from "@/lib/editor-docs";
import { applyTokens, filenamePart } from "@/lib/editor-tokens";
import { combinePagesHtml, getPdfAlertMessage } from "@/lib/editor-export";

export const runtime = "nodejs";
export const maxDuration = 60;

type ExportBody = {
  doc?: string;
  content?: string;
  mode?: "current" | "both";
  otherDoc?: string;
  jobName?: string;
  companyName?: string;
  pdfAlert?: boolean;
};

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }

  let body: ExportBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const docs = await listDocs();
  const doc = pickDefaultDoc(docs, body.doc);
  const content = body.content ?? "";
  const jobName = (body.jobName ?? "").trim();
  const companyName = (body.companyName ?? "").trim();

  const pages: { doc: string; html: string }[] = [];

  if (body.mode === "both") {
    let otherDoc = pickDefaultDoc(docs, body.otherDoc);
    if (otherDoc === doc) {
      const alt = docs.find((d) => d.filename !== doc);
      if (alt) otherDoc = alt.filename;
    }

    if (otherDoc !== doc) {
      const docIsCover = /cover/i.test(doc);
      const otherIsCover = /cover/i.test(otherDoc);
      const order = !docIsCover && otherIsCover ? [otherDoc, doc] : [doc, otherDoc];

      for (const docName of order) {
        const html = docName === doc ? content : await readDoc(docName);
        pages.push({ doc: docName, html: applyTokens(html, jobName, companyName) });
      }
    } else {
      pages.push({ doc, html: applyTokens(content, jobName, companyName) });
    }
  } else {
    pages.push({ doc, html: applyTokens(content, jobName, companyName) });
  }

  const combinedHtml = combinePagesHtml(pages, req.nextUrl.origin);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(combinedHtml, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 60000 }).catch(() => {});
    let pdfBytes: Uint8Array = await page.pdf({ format: "letter", printBackground: true });

    if (body.pdfAlert) {
      const message = getPdfAlertMessage(jobName);
      if (message) {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        pdfDoc.addJavaScript("EmbeddedJS", `app.alert(${JSON.stringify(message)});`);
        pdfBytes = await pdfDoc.save();
      }
    }

    const filenameBase = companyName ? `BrandonSanders_Resume-${filenamePart(companyName)}` : "BrandonSanders_Resume";

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filenameBase}.pdf"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF export failed.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
