import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import { isAuthorized } from "@/lib/editor-guard";
import { listDocs, pickDefaultDoc, readDoc, publishPdf } from "@/lib/editor-docs";
import { applyTokens, filenamePart } from "@/lib/editor-tokens";
import { combinePagesHtml, getPdfAlertMessage } from "@/lib/editor-export";
import { compressEmbeddedImages } from "@/lib/editor-image-compress";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * req.nextUrl.origin reflects the server's own bind address (0.0.0.0 in a
 * container) rather than the public hostname. That's harmless for plain
 * <img> loads, but Chromium enforces stricter rules for CORS-mode fetches
 * (like @font-face) against 0.0.0.0/private addresses, which silently
 * failed self-hosted font loading during PDF export until this was derived
 * from the Host header instead (same fix as the /files/*.pdf referer guard).
 */
function getRequestOrigin(req: NextRequest): string {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl.host;
  const proto = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "");
  return `${proto}://${host}`;
}

type ExportBody = {
  doc?: string;
  content?: string;
  mode?: "current" | "both";
  otherDoc?: string;
  jobName?: string;
  companyName?: string;
  pdfAlert?: boolean;
  /** If set, also writes the generated PDF to public/files/<publishAs> on the server. */
  publishAs?: string;
  /** "pdf" (default) or "image" -- a flat PNG screenshot of the doc's design, for
   *  docs like the LinkedIn banner that are graphics rather than paginated documents. */
  format?: "pdf" | "image";
  /** Downscale/recompress embedded photos (the headshot, etc.) before rendering,
   *  for a meaningfully smaller PDF at the cost of some image quality. */
  compress?: boolean;
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

  if (body.format === "image") {
    return exportImage(doc, content, jobName, companyName, getRequestOrigin(req));
  }

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

  if (body.compress) {
    await Promise.all(
      pages.map(async (p) => {
        p.html = await compressEmbeddedImages(p.html);
      })
    );
  }

  const combinedHtml = combinePagesHtml(pages, getRequestOrigin(req));

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
    // Network going idle means the font files finished downloading, not that
    // the browser has finished swapping them in (font-display: swap can
    // still be showing the fallback font at that point) -- wait for the
    // actual font-loading promise too so the PDF never captures a
    // fallback-font frame that would look heavier/different from the preview.
    await page.evaluate(() => document.fonts.ready).catch(() => {});
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
    const pdfBuffer = Buffer.from(pdfBytes);

    let publishStatus = "";
    if (body.publishAs) {
      try {
        await publishPdf(body.publishAs, pdfBuffer);
        publishStatus = "ok";
      } catch (err) {
        publishStatus = `error:${err instanceof Error ? err.message : "unknown"}`;
      }
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filenameBase}.pdf"`,
        ...(publishStatus ? { "X-Publish-Status": publishStatus } : {}),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF export failed.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  } finally {
    await browser?.close();
  }
}

/**
 * Screenshots a doc's top-level design element (e.g. .banner, .resume) as a
 * flat PNG at its true pixel size, rather than printing it to a PDF page.
 * PNG over JPEG: this kind of content is flat colors, sharp text, and a thin
 * grid line pattern -- exactly what JPEG's lossy compression smears into
 * visible artifacts around edges, while PNG stays pixel-perfect and is still
 * a small file for graphics like this (unlike a photo, where JPEG would win).
 */
async function exportImage(doc: string, content: string, jobName: string, companyName: string, origin: string) {
  // Absolute-path assets (self-hosted fonts, /files/images/...) need a <base
  // href> to resolve against, since page.setContent() gives the page an
  // opaque origin with nothing to resolve a leading "/" against otherwise.
  const html = applyTokens(content, jobName, companyName).replace(
    /<head[^>]*>/i,
    (match) => `${match}<base href="${origin}/">`
  );

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    // Generously wide/tall so a flex-centered design (e.g. the banner) never
    // gets shrunk to fit a too-small viewport before we measure/capture it.
    await page.setViewport({ width: 1800, height: 900 });
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 60000 }).catch(() => {});

    const elementHandle = await page.evaluateHandle(() => document.body.firstElementChild);
    const element = elementHandle.asElement();
    if (!element) {
      return NextResponse.json({ success: false, message: "Could not find the design to capture." }, { status: 500 });
    }

    const pngBytes = await element.screenshot({ type: "png" });
    const filenameBase = doc.replace(/\.html?$/i, "").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "export";

    return new NextResponse(new Uint8Array(pngBytes), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${filenameBase}.png"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image export failed.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
